/**
 * Fábricas de teclas (`CalculatorKey`) e utilidades para converter caracteres de
 * teclado físico nas teclas equivalentes. Centralizar isso evita repetir os
 * literais de objeto por toda a interface.
 */

import type { BinaryOperator, CalculatorKey } from './types';

export const digitKey = (value: string): CalculatorKey => ({ type: 'digit', value });
export const operatorKey = (value: BinaryOperator): CalculatorKey => ({
  type: 'operator',
  value,
});
export const equalsKey: CalculatorKey = { type: 'equals' };
export const clearKey: CalculatorKey = { type: 'clear' };
export const clearEntryKey: CalculatorKey = { type: 'clear-entry' };
export const decimalKey: CalculatorKey = { type: 'decimal' };
export const backspaceKey: CalculatorKey = { type: 'backspace' };
export const toggleSignKey: CalculatorKey = { type: 'toggle-sign' };
export const percentKey: CalculatorKey = { type: 'percent' };

/**
 * Converte um caractere vindo do teclado físico (web/desktop) na tecla
 * correspondente do motor, ou `null` quando não há mapeamento.
 */
export function keyFromKeyboardEvent(char: string): CalculatorKey | null {
  if (/^[0-9]$/.test(char)) {
    return digitKey(char);
  }
  switch (char) {
    case '+':
    case '-':
    case '*':
    case '/':
      return operatorKey(char);
    case '=':
    case 'Enter':
      return equalsKey;
    case '.':
    case ',':
      return decimalKey;
    case 'Backspace':
      return backspaceKey;
    case 'Escape':
      return clearKey;
    case '%':
      return percentKey;
    case 'n':
    case 'N':
      return toggleSignKey;
    default:
      return null;
  }
}
