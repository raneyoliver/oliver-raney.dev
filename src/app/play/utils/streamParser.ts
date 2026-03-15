export function extractWidgetData(partialJson: string): { instructions: string | null; widget_code: string | null; controls: any[] | null } {
  try {
    const data = JSON.parse(partialJson);
    return {
      instructions: data?.instructions ?? null,
      widget_code: data?.widget_code ?? null,
      controls: data?.controls ?? null,
    };
  } catch { /* fall through */ }

  const extractString = (key: string) => {
    const idx = partialJson.indexOf(key);
    if (idx === -1) return null;

    let rest = partialJson.slice(idx + key.length);
    const colon = rest.indexOf(':');
    if (colon === -1) return null;
    rest = rest.slice(colon + 1).trimStart();
    if (!rest.startsWith('"')) return null;

    const content = rest.slice(1);
    const result: string[] = [];
    let i = 0;
    while (i < content.length) {
      const c = content[i];
      if (c === '\\' && i + 1 < content.length) {
        const n = content[i + 1];
        const esc: Record<string, string> = {
          'n': '\n', 't': '\t', 'r': '\r',
          '\\': '\\', '"': '"', '/': '/', 'b': '\b', 'f': '\f',
        };
        result.push(esc[n] ?? n);
        i += 2;
      } else if (c === '"') {
        break;
      } else {
        result.push(c);
        i++;
      }
    }
    return result.length > 0 ? result.join('') : null;
  };

  return {
    instructions: extractString('"instructions"'),
    widget_code: extractString('"widget_code"'),
    controls: null,
  };
}
