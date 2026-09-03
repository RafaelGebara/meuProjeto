/**
 * Descrição declarativa do teclado da calculadora.
 *
 * A grade é uma matriz de linhas; cada célula descreve um botão e a tecla
 * (`CalculatorKey`) que ele envia ao motor. A interface só percorre esta
 * estrutura — assim, mudar o layout não exige tocar em JSX.
 */

import type { CalculatorKey } from '@/src/calculator';
import {
  backspaceKey,
  clearKey,
  decimalKey,
  digitKey,
  equalsKey,
  operatorKey,
  percentKey,
  toggleSignKey,
} from '@/src/calculator';

/** Categoria visual do botão, usada para escolher a cor. */
export type ButtonVariant = 'digit' | 'operator' | 'function' | 'equals';

export interface ButtonSpec {
  /** Rótulo mostrado no botão. */
  label: string;
  /** Tecla enviada ao motor quando o botão é pressionado. */
  key: CalculatorKey;
  /** Categoria visual. */
  variant: ButtonVariant;
  /** Quantas colunas o botão ocupa (o "0" ocupa duas). */
  span?: number;
  /** Rótulo acessível opcional, quando o texto visível não basta. */
  accessibilityLabel?: string;
}

export const KEYPAD: ButtonSpec[][] = [
  [
    { label: 'C', key: clearKey, variant: 'function', accessibilityLabel: 'Limpar tudo' },
    { label: '±', key: toggleSignKey, variant: 'function', accessibilityLabel: 'Inverter sinal' },
    { label: '%', key: percentKey, variant: 'function', accessibilityLabel: 'Porcentagem' },
    { label: '÷', key: operatorKey('/'), variant: 'operator', accessibilityLabel: 'Dividir' },
  ],
  [
    { label: '7', key: digitKey('7'), variant: 'digit' },
    { label: '8', key: digitKey('8'), variant: 'digit' },
    { label: '9', key: digitKey('9'), variant: 'digit' },
    { label: '×', key: operatorKey('*'), variant: 'operator', accessibilityLabel: 'Multiplicar' },
  ],
  [
    { label: '4', key: digitKey('4'), variant: 'digit' },
    { label: '5', key: digitKey('5'), variant: 'digit' },
    { label: '6', key: digitKey('6'), variant: 'digit' },
    { label: '−', key: operatorKey('-'), variant: 'operator', accessibilityLabel: 'Subtrair' },
  ],
  [
    { label: '1', key: digitKey('1'), variant: 'digit' },
    { label: '2', key: digitKey('2'), variant: 'digit' },
    { label: '3', key: digitKey('3'), variant: 'digit' },
    { label: '+', key: operatorKey('+'), variant: 'operator', accessibilityLabel: 'Somar' },
  ],
  [
    { label: '0', key: digitKey('0'), variant: 'digit', span: 2 },
    { label: ',', key: decimalKey, variant: 'digit', accessibilityLabel: 'Vírgula decimal' },
    { label: '=', key: equalsKey, variant: 'equals', accessibilityLabel: 'Igual' },
  ],
];

/** Linha extra opcional com o backspace, exibida acima do teclado principal. */
export const SECONDARY_ROW: ButtonSpec[] = [
  { label: '⌫', key: backspaceKey, variant: 'function', accessibilityLabel: 'Apagar dígito' },
];

/** Paleta de cores de cada variante, por esquema de cor. */
export const BUTTON_COLORS: Record<
  'light' | 'dark',
  Record<ButtonVariant, { background: string; text: string }>
> = {
  light: {
    digit: { background: '#f2f2f7', text: '#1c1c1e' },
    operator: { background: '#ff9f0a', text: '#ffffff' },
    function: { background: '#d1d1d6', text: '#1c1c1e' },
    equals: { background: '#0a7ea4', text: '#ffffff' },
  },
  dark: {
    digit: { background: '#2c2c2e', text: '#f2f2f7' },
    operator: { background: '#ff9f0a', text: '#ffffff' },
    function: { background: '#48484a', text: '#f2f2f7' },
    equals: { background: '#0a7ea4', text: '#ffffff' },
  },
};
