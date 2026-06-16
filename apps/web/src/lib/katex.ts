/**
 * KaTeX matematik dizgisi — SERVER-SIDE.
 *
 * Formüller `katex.renderToString` ile build/SSR sırasında HTML'e çevrilir;
 * tarayıcıya ekstra JS gitmez (CWV korunur, mimari kural 7). Çıktı KaTeX'in
 * kendi `katex.min.css`'iyle (layout.tsx'te import) biçimlenir.
 *
 * Convention:
 * - Strapi `code` bloğu = display (ortalanmış) formül; içeriği LaTeX'tir.
 * - Paragraf içinde `$...$` = satır-içi formül.
 */
import katex from 'katex';

/** Tek bir LaTeX dizesini güvenli şekilde HTML'e çevirir. Hatalıysa ham metni döndürür. */
export function renderMath(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
      strict: false,
      output: 'htmlAndMathml',
    });
  } catch {
    return latex;
  }
}

/**
 * Bir metni `$...$` sınırlarına göre düz metin ve satır-içi matematik parçalarına böler.
 * Eşleşme yoksa tek bir text parçası döner (yaygın hızlı yol).
 */
export function splitInlineMath(text: string): Array<{ type: 'text' | 'math'; value: string }> {
  if (!text.includes('$')) return [{ type: 'text', value: text }];
  const parts: Array<{ type: 'text' | 'math'; value: string }> = [];
  // Kaçışsız $ ... $ çiftleri (içinde $ olmayan).
  const re = /\$([^$]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) });
    parts.push({ type: 'math', value: m[1] ?? '' });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
}
