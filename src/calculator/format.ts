/**
 * Funções de formatação e conversão entre o número interno e a string do visor.
 *
 * O motor guarda o visor como string (para preservar coisas como "12." enquanto
 * o usuário digita), mas a aritmética precisa de `number`. Este arquivo concentra
 * essa ponte, além das regras de exibição (separador de milhar, notação
 * científica para números muito grandes, limite de dígitos, etc.).
 */

/** Quantidade máxima de dígitos exibidos antes de recorrer à notação científica. */
export const MAX_DISPLAY_DIGITS = 12;

/** Texto mostrado no visor quando ocorre um erro (ex.: divisão por zero). */
export const ERROR_DISPLAY = 'Erro';

/** Converte a string do visor em número para uso nos cálculos. */
export function parseDisplay(display: string): number {
  if (display === '' || display === '-' || display === '.') {
    return 0;
  }
  const normalized = display.replace(/\s/g, '').replace(',', '.');
  const value = Number(normalized);
  return Number.isNaN(value) ? 0 : value;
}

/**
 * Formata um número para exibição no visor.
 *
 * - Números não finitos viram {@link ERROR_DISPLAY}.
 * - Valores cujo módulo é gigante ou minúsculo usam notação científica.
 * - Os demais recebem separador de milhar e no máximo {@link MAX_DISPLAY_DIGITS}
 *   dígitos significativos.
 */
export function formatResult(value: number): string {
  if (!Number.isFinite(value)) {
    return ERROR_DISPLAY;
  }

  if (value === 0) {
    return '0';
  }

  const magnitude = Math.abs(value);
  if (magnitude >= 1e12 || magnitude < 1e-9) {
    return value.toExponential(6).replace('e', 'E');
  }

  const digitsBeforePoint = Math.floor(Math.log10(magnitude)) + 1;
  const decimals = Math.max(0, MAX_DISPLAY_DIGITS - Math.max(digitsBeforePoint, 1));

  const rounded = Number(value.toFixed(decimals));
  const [integerPart, decimalPart] = String(rounded).split('.');

  const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decimalPart ? `${withThousands},${decimalPart}` : withThousands;
}

/**
 * Monta a expressão legível guardada no histórico, por exemplo "1.200 + 30".
 * Recebe os operandos já como número e o símbolo da operação.
 */
export function formatExpression(left: number, operator: string, right: number): string {
  const symbol = OPERATOR_SYMBOLS[operator] ?? operator;
  return `${formatResult(left)} ${symbol} ${formatResult(right)}`;
}

/** Símbolos "bonitos" para exibição, no lugar de `*` e `/`. */
export const OPERATOR_SYMBOLS: Record<string, string> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
};

/**
 * Impede que o visor cresça indefinidamente enquanto o usuário digita.
 * Conta apenas dígitos, ignorando ponto decimal e sinal de menos.
 */
export function hasReachedDigitLimit(display: string): boolean {
  const digits = display.replace(/[^0-9]/g, '');
  return digits.length >= MAX_DISPLAY_DIGITS;
}
