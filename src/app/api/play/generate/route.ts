import { NextRequest } from 'next/server';
import { SYSTEM_PROMPT, SHOW_CREATION_TOOL } from '@/app/play/utils/systemPrompt';
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
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ];

        let continueLoop = true;

        while (continueLoop) {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://oliver-raney.dev',
              'X-Title': 'Play Arcade',
            },
            body: JSON.stringify({
              model: 'nvidia/nemotron-3-super-120b-a12b:free',
              messages,
              tools: [SHOW_CREATION_TOOL],
              stream: true,
              max_tokens: 8192,
            }),
          });

          if (!response.ok) {
            const err = await response.text();
            controller.enqueue(encoder.encode(sse({ type: 'error', error: `API error: ${response.status} - ${err}` })));
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

              // Text content
              if (delta.content) {
                assistantContent += delta.content;
              }

              // Tool calls
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

                    // Live-stream show_creation HTML and instructions as they arrive
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

          // Process completed tool calls
          const completedTools = Object.values(toolCalls);
          if (completedTools.length === 0) {
            continueLoop = false;
            controller.enqueue(encoder.encode(sse({ type: 'done' })));
          } else {
            // Build assistant message content
            const assistantBlocks: Array<Record<string, unknown>> = [];
            if (assistantContent) {
              assistantBlocks.push({ type: 'text', text: assistantContent });
            }

            const toolResults: Array<Record<string, unknown>> = [];

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
                if (assistantContent) {
                  console.log("--- Thought Process / Text ---");
                  console.log(assistantContent);
                }
                const scriptMatch = finalHtml.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
                console.log("\n--- JavaScript Mechanics ---");
                console.log(scriptMatch ? scriptMatch[1].trim() : "(No separate script block found)");
                console.log("\n--- Full Widget Code (args) ---");
                console.log(tc.args);
                console.log("===============================================================\n");

                controller.enqueue(encoder.encode(sse({ type: 'widget_final', html: finalHtml, instructions: finalInst, controls: finalControls })));
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: tc.id,
                  content: 'Creation rendered successfully.',
                });
              }
            }

            messages.push({ role: 'assistant', content: assistantBlocks as unknown as string });
            messages.push({ role: 'user', content: toolResults as unknown as string });
            assistantContent = '';
            continueLoop = true;
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
