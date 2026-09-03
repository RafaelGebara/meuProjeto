import {
  ERROR_DISPLAY,
  formatExpression,
  formatResult,
  hasReachedDigitLimit,
  parseDisplay,
} from '../format';

describe('parseDisplay', () => {
  it('interpreta strings comuns', () => {
    expect(parseDisplay('42')).toBe(42);
    expect(parseDisplay('3.14')).toBe(3.14);
    expect(parseDisplay('-7')).toBe(-7);
  });

  it('trata estados intermediários como zero', () => {
    expect(parseDisplay('')).toBe(0);
    expect(parseDisplay('-')).toBe(0);
    expect(parseDisplay('.')).toBe(0);
  });

  it('aceita vírgula como separador decimal', () => {
    expect(parseDisplay('2,5')).toBe(2.5);
  });
});

describe('formatResult', () => {
  it('formata inteiros com separador de milhar', () => {
    expect(formatResult(1000)).toBe('1.000');
    expect(formatResult(1234567)).toBe('1.234.567');
  });

  it('usa vírgula para a parte decimal', () => {
    expect(formatResult(3.5)).toBe('3,5');
  });

  it('devolve "0" para zero', () => {
    expect(formatResult(0)).toBe('0');
  });

  it('retorna o texto de erro para valores não finitos', () => {
    expect(formatResult(Infinity)).toBe(ERROR_DISPLAY);
    expect(formatResult(NaN)).toBe(ERROR_DISPLAY);
  });

  it('cai para notação científica com números gigantes', () => {
    expect(formatResult(1e15)).toContain('E');
  });
});

describe('formatExpression', () => {
  it('monta a expressão com símbolos bonitos', () => {
    expect(formatExpression(1200, '+', 30)).toBe('1.200 + 30');
    expect(formatExpression(6, '*', 7)).toBe('6 × 7');
    expect(formatExpression(20, '/', 4)).toBe('20 ÷ 4');
  });
});

describe('hasReachedDigitLimit', () => {
  it('ignora ponto e sinal ao contar dígitos', () => {
    expect(hasReachedDigitLimit('-1.234')).toBe(false);
    expect(hasReachedDigitLimit('123456789012')).toBe(true);
  });
});
