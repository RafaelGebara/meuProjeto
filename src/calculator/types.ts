/**
 * Tipos compartilhados pelo motor da calculadora.
 *
 * O motor é implementado como uma máquina de estados pura: cada ação do usuário
 * (digitar um número, escolher uma operação, apertar "=") produz um novo estado
 * a partir do estado anterior, sem efeitos colaterais. Isso deixa a lógica fácil
 * de testar e independente da interface React Native.
 */

/** Operações binárias suportadas pela calculadora. */
export type BinaryOperator = '+' | '-' | '*' | '/';

/** Identificador textual de cada tecla que a interface pode enviar ao motor. */
export type CalculatorKey =
  | { type: 'digit'; value: string }
  | { type: 'operator'; value: BinaryOperator }
  | { type: 'equals' }
  | { type: 'clear' }
  | { type: 'clear-entry' }
  | { type: 'toggle-sign' }
  | { type: 'percent' }
  | { type: 'decimal' }
  | { type: 'backspace' };

/** Um cálculo já concluído, guardado no histórico. */
export interface HistoryEntry {
  /** Identificador único e estável do registro (usado como key nas listas). */
  id: string;
  /** Expressão legível, por exemplo "12 + 30". */
  expression: string;
  /** Resultado já formatado para exibição, por exemplo "42". */
  result: string;
  /** Momento (epoch em milissegundos) em que o cálculo foi feito. */
  timestamp: number;
}

/**
 * Estado completo do motor.
 *
 * - `display` é sempre a string que deve aparecer no visor.
 * - `accumulator` guarda o operando da esquerda enquanto o usuário digita o da direita.
 * - `pendingOperator` é a operação escolhida e ainda não aplicada.
 * - `overwrite` indica que o próximo dígito deve substituir o visor inteiro
 *   (acontece logo após "=", após escolher uma operação ou logo depois de um erro).
 */
export interface CalculatorState {
  display: string;
  accumulator: number | null;
  pendingOperator: BinaryOperator | null;
  overwrite: boolean;
  error: string | null;
  history: HistoryEntry[];
}
