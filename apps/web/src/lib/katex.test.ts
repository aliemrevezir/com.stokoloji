import { describe, it, expect } from 'vitest';
import { renderMath, splitInlineMath } from './katex';

describe('renderMath', () => {
  it('LaTeX formülünü KaTeX HTML çıktısına çevirir', () => {
    const html = renderMath('Z \\times \\sigma_d \\times \\sqrt{L}', true);
    expect(html).toContain('katex');
    expect(html).toContain('katex-display'); // display mode
  });

  it('display=false satır-içi (display olmayan) çıktı verir', () => {
    const html = renderMath('x^2', false);
    expect(html).toContain('katex');
    expect(html).not.toContain('katex-display');
  });

  it('hatalı LaTeX hata atmadan render eder (throwOnError:false)', () => {
    expect(() => renderMath('\\frac{1}{', true)).not.toThrow();
  });
});

describe('splitInlineMath', () => {
  it('$ içermeyen metni tek text parçası olarak döndürür', () => {
    expect(splitInlineMath('düz metin')).toEqual([{ type: 'text', value: 'düz metin' }]);
  });

  it('$...$ matematiğini ayırır', () => {
    expect(splitInlineMath('servis $\\sigma_d$ değeri')).toEqual([
      { type: 'text', value: 'servis ' },
      { type: 'math', value: '\\sigma_d' },
      { type: 'text', value: ' değeri' },
    ]);
  });

  it('birden çok matematik parçasını ayırır', () => {
    const segs = splitInlineMath('$a$ ve $b$');
    expect(segs.filter((s) => s.type === 'math').map((s) => s.value)).toEqual(['a', 'b']);
  });
});
