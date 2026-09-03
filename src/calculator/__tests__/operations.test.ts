import {
  add,
  applyOperator,
  divide,
  DivisionByZeroError,
  multiply,
  negate,
  percentOf,
  percentOfBase,
  roundFloatingPointError,
  subtract,
} from '../operations';

describe('operações aritméticas básicas', () => {
  it('soma dois números', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-4, 4)).toBe(0);
  });

  it('subtrai o segundo do primeiro', () => {
    expect(subtract(10, 4)).toBe(6);
    expect(subtract(0, 7)).toBe(-7);
  });

  it('multiplica dois números', () => {
    expect(multiply(6, 7)).toBe(42);
    expect(multiply(-3, 3)).toBe(-9);
  });

  it('divide dois números', () => {
    expect(divide(9, 3)).toBe(3);
    expect(divide(1, 4)).toBe(0.25);
  });

  it('lança DivisionByZeroError ao dividir por zero', () => {
    expect(() => divide(1, 0)).toThrow(DivisionByZeroError);
  });
});

describe('applyOperator', () => {
  it('resolve cada operador pelo símbolo', () => {
    expect(applyOperator('+', 1, 2)).toBe(3);
    expect(applyOperator('-', 5, 2)).toBe(3);
    expect(applyOperator('*', 4, 5)).toBe(20);
    expect(applyOperator('/', 20, 4)).toBe(5);
  });

  it('corrige o ruído de ponto flutuante de 0.1 + 0.2', () => {
    expect(applyOperator('+', 0.1, 0.2)).toBe(0.3);
  });
});

describe('roundFloatingPointError', () => {
  it('mantém números já exatos', () => {
    expect(roundFloatingPointError(42)).toBe(42);
    expect(roundFloatingPointError(-0.5)).toBe(-0.5);
  });

  it('preserva valores não finitos', () => {
    expect(roundFloatingPointError(Infinity)).toBe(Infinity);
    expect(Number.isNaN(roundFloatingPointError(NaN))).toBe(true);
  });
});

describe('porcentagem', () => {
  it('percentOf converte um valor isolado em fração', () => {
    expect(percentOf(50)).toBe(0.5);
    expect(percentOf(12.5)).toBe(0.125);
  });

  it('percentOfBase calcula a porcentagem relativa a uma base', () => {
    expect(percentOfBase(200, 10)).toBe(20);
    expect(percentOfBase(80, 25)).toBe(20);
  });
});

describe('negate', () => {
  it('inverte o sinal', () => {
    expect(negate(5)).toBe(-5);
    expect(negate(-5)).toBe(5);
  });

  it('normaliza -0 para 0', () => {
    expect(Object.is(negate(0), 0)).toBe(true);
  });
});
