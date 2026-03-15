import { NextRequest } from 'next/server';
import { DESIGN_PROMPT, MECHANICS_PROMPT, SHOW_CREATION_TOOL } from '@/app/play/utils/systemPrompt';
import { extractWidgetData } from '@/app/play/utils/streamParser';

export const runtime = 'edge';

function sse(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing prompt' }), { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 500 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // STAGE 1: Visual Design
        const designResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://oliver-raney.dev',
          },
          body: JSON.stringify({
            model: process.env.OPENROUTER_MODEL_DESIGN || process.env.OPENROUTER_MODEL,
            messages: [
              { role: 'system', content: DESIGN_PROMPT },
              { role: 'user', content: prompt },
            ],
            stream: false,
          }),
        });

        if (!designResponse.ok) {
          throw new Error(`Design API error: ${designResponse.status}`);
        }
        const designData = await designResponse.json();
        const designCode = designData.choices?.[0]?.message?.content || '';

        // STAGE 2: Gameplay Mechanics (Streaming)
        const messages = [
          { role: 'system', content: MECHANICS_PROMPT },
          { role: 'user', content: `Intent: ${prompt}\n\nVisual Design:\n${designCode}` },
        ];

        let continueLoop = true;
        while (continueLoop) {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://oliver-raney.dev',
            },
            body: JSON.stringify({
              model: process.env.OPENROUTER_MODEL_MECHANICS || process.env.OPENROUTER_MODEL,
              messages,
              tools: [SHOW_CREATION_TOOL],
              stream: true,
              max_tokens: 8192,
            }),
          });

          if (!response.ok) {
            const err = await response.text();
            controller.enqueue(encoder.encode(sse({ type: 'error', error: `Mechanics API error: ${response.status} - ${err}` })));
            controller.enqueue(encoder.encode(sse({ type: 'done' })));
            controller.close();
            return;
          }

          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let buf = '';
          const toolCalls: Record<number, { name: string; args: string; id: string }> = {};
          let assistantContent = '';
          let lastHtmlLen = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });

            const parts = buf.split('\n');
            buf = parts.pop()!;

            for (const line of parts) {
              if (!line.startsWith('data: ')) continue;
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;

              let parsed;
              try { parsed = JSON.parse(data); } catch { continue; }

              const delta = parsed.choices?.[0]?.delta;
              if (!delta) continue;

              if (delta.content) assistantContent += delta.content;

              if (delta.tool_calls) {
                for (const tc of delta.tool_calls) {
                  const idx = tc.index ?? 0;
                  if (tc.id) {
                    toolCalls[idx] = { name: tc.function?.name || '', args: '', id: tc.id };
                  }
                  if (tc.function?.name && toolCalls[idx]) {
                    toolCalls[idx].name = tc.function.name;
                  }
                  if (tc.function?.arguments && toolCalls[idx]) {
                    toolCalls[idx].args += tc.function.arguments;

                    if (toolCalls[idx].name === 'show_creation') {
                      const data = extractWidgetData(toolCalls[idx].args);
                      const html = data.widget_code || '';
                      const instructions = data.instructions || '';
                      if ((html.length > 30 && html.length > lastHtmlLen + 20) || (instructions && !html)) {
                        if (html.length > 0) lastHtmlLen = html.length;
                        controller.enqueue(encoder.encode(sse({ type: 'widget_delta', html, instructions })));
                      }
                    }
                  }
                }
              }
            }
          }

          const completedTools = Object.values(toolCalls);
          if (completedTools.length === 0) {
            continueLoop = false;
            controller.enqueue(encoder.encode(sse({ type: 'done' })));
          } else {
            const assistantBlocks: any[] = [];
            if (assistantContent) assistantBlocks.push({ type: 'text', text: assistantContent });
            const toolResults: any[] = [];

            for (const tc of completedTools) {
              assistantBlocks.push({
                type: 'tool_use',
                id: tc.id,
                name: tc.name,
                input: (() => { try { return JSON.parse(tc.args); } catch { return {}; } })(),
              });

              if (tc.name === 'show_creation') {
                let finalHtml = '';
                let finalInst = '';
                let finalControls: any[] = [];
                try {
                  const p = JSON.parse(tc.args);
                  finalHtml = p?.widget_code || '';
                  finalInst = p?.instructions || '';
                  finalControls = p?.controls || [];
                } catch {
                  const d = extractWidgetData(tc.args);
                  finalHtml = d.widget_code || '';
                  finalInst = d.instructions || '';
                }

                console.log("\n==================== LLM CREATION RESPONSE ====================");
                console.log("--- Mechanics Phase Output ---");
                console.log(assistantContent);
                console.log("\n--- Full Widget Code ---");
                console.log(tc.args);
                console.log("===============================================================\n");

                controller.enqueue(encoder.encode(sse({ type: 'widget_final', html: finalHtml, instructions: finalInst, controls: finalControls })));
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: tc.id,
                  content: 'Creation rendered successfully.',
                });
                continueLoop = false;
              }
            }
            messages.push({ role: 'assistant', content: assistantBlocks as any });
            messages.push({ role: 'user', content: toolResults as any });
            assistantContent = '';
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode(sse({
          type: 'error',
          error: err instanceof Error ? err.message : 'Unknown error',
        })));
        controller.enqueue(encoder.encode(sse({ type: 'done' })));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
