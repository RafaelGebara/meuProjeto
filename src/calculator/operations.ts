/**
 * Operações aritméticas puras usadas pelo motor da calculadora.
 *
 * Todas as funções deste arquivo são determinísticas e sem efeitos colaterais:
 * recebem números e devolvem números (ou lançam um erro conhecido). Isso mantém
 * a aritmética isolada e coberta por testes unitários simples.
 */

import type { BinaryOperator } from './types';

/** Erro lançado quando o usuário tenta dividir por zero. */
export class DivisionByZeroError extends Error {
  constructor() {
    super('Não é possível dividir por zero');
    this.name = 'DivisionByZeroError';
  }
}

/** Soma dois números. */
export function add(a: number, b: number): number {
  return a + b;
}

/** Subtrai `b` de `a`. */
export function subtract(a: number, b: number): number {
  return a - b;
}

/** Multiplica dois números. */
export function multiply(a: number, b: number): number {
  return a * b;
}

/**
 * Divide `a` por `b`.
 *
 * @throws {DivisionByZeroError} quando `b` é zero.
 */
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new DivisionByZeroError();
  }
  return a / b;
}

/**
 * Aplica uma operação binária identificada pelo seu símbolo.
 *
 * Ponto flutuante em JavaScript acumula pequenos erros (0.1 + 0.2 !== 0.3), então
 * o resultado passa por {@link roundFloatingPointError} antes de ser devolvido.
 */
export function applyOperator(operator: BinaryOperator, a: number, b: number): number {
  switch (operator) {
    case '+':
      return roundFloatingPointError(add(a, b));
    case '-':
      return roundFloatingPointError(subtract(a, b));
    case '*':
      return roundFloatingPointError(multiply(a, b));
    case '/':
      return roundFloatingPointError(divide(a, b));
    default: {
      // `never` garante, em tempo de compilação, que todos os casos foram tratados.
      const exhaustiveCheck: never = operator;
      throw new Error(`Operador não suportado: ${String(exhaustiveCheck)}`);
    }
  }
}

/**
 * Arredonda erros de representação de ponto flutuante mantendo até 12 casas
 * significativas. Números "redondos" ficam intactos; ruído como
 * 0.30000000000000004 vira 0.3.
 */
export function roundFloatingPointError(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }
  return Number.parseFloat(value.toPrecision(12));
}

/** Converte uma porcentagem isolada (ex.: 50) na sua fração decimal (0.5). */
export function percentOf(value: number): number {
  return roundFloatingPointError(value / 100);
}

/**
 * Calcula a porcentagem de `value` relativa a `base`. Usado quando já existe um
 * operando à esquerda: "200 + 10%" deve somar 10% de 200, e não 0.1.
 */
export function percentOfBase(base: number, value: number): number {
  return roundFloatingPointError((base * value) / 100);
}

/** Inverte o sinal de um número, tratando o -0 como 0. */
export function negate(value: number): number {
  const result = -value;
  return Object.is(result, -0) ? 0 : result;
}
