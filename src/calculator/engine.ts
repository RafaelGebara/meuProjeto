/**
 * Motor da calculadora: uma máquina de estados pura.
 *
 * `reduce(state, key)` recebe o estado atual e uma tecla e devolve o próximo
 * estado. Não há `Date.now()`, `Math.random()` nem acesso a React aqui — a única
 * exceção é o gerador de id do histórico, injetável para os testes.
 */

import {
  applyOperator,
  DivisionByZeroError,
  negate,
  percentOf,
  percentOfBase,
} from './operations';
import {
  ERROR_DISPLAY,
  formatExpression,
  formatResult,
  hasReachedDigitLimit,
  parseDisplay,
} from './format';
import type { CalculatorKey, CalculatorState, HistoryEntry } from './types';

/** Número máximo de cálculos mantidos no histórico. */
export const HISTORY_LIMIT = 50;

/** Estado inicial da calculadora: visor zerado, sem operação pendente. */
export const initialState: CalculatorState = {
  display: '0',
  accumulator: null,
  pendingOperator: null,
  overwrite: true,
  error: null,
  history: [],
};

/** Dependências injetáveis — trocadas nos testes por versões determinísticas. */
export interface EngineDeps {
  /** Gera o id de um registro de histórico. */
  createId: () => string;
  /** Devolve o timestamp atual em milissegundos. */
  now: () => number;
}

const defaultDeps: EngineDeps = {
  createId: () =>
    `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
  now: () => Date.now(),
};

/**
 * Aplica uma tecla ao estado e devolve o novo estado.
 *
 * A função nunca muta `state`; sempre devolve um objeto novo.
 */
export function reduce(
  state: CalculatorState,
  key: CalculatorKey,
  deps: EngineDeps = defaultDeps,
): CalculatorState {
  // Depois de um erro, só "C" (clear) volta a funcionar.
  if (state.error && key.type !== 'clear') {
    return state;
  }

  switch (key.type) {
    case 'digit':
      return inputDigit(state, key.value);
    case 'decimal':
      return inputDecimal(state);
    case 'operator':
      return chooseOperator(state, key.value, deps);
    case 'equals':
      return computeEquals(state, deps);
    case 'clear':
      return { ...initialState, history: state.history };
    case 'clear-entry':
      return { ...state, display: '0', overwrite: true };
    case 'backspace':
      return backspace(state);
    case 'toggle-sign':
      return toggleSign(state);
    case 'percent':
      return applyPercent(state);
    default: {
      const exhaustiveCheck: never = key;
      throw new Error(`Tecla desconhecida: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}

function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.overwrite) {
    return { ...state, display: digit === '0' ? '0' : digit, overwrite: false };
  }
  if (state.display === '0') {
    return { ...state, display: digit };
  }
  if (hasReachedDigitLimit(state.display)) {
    return state;
  }
  return { ...state, display: state.display + digit };
}

function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.overwrite) {
    return { ...state, display: '0.', overwrite: false };
  }
  if (state.display.includes('.')) {
    return state;
  }
  return { ...state, display: `${state.display}.` };
}

function chooseOperator(
  state: CalculatorState,
  operator: CalculatorState['pendingOperator'] & string,
  deps: EngineDeps,
): CalculatorState {
  const current = parseDisplay(state.display);

  // Troca a operação pendente sem recalcular quando o usuário só mudou de ideia.
  if (state.pendingOperator && state.overwrite) {
    return { ...state, pendingOperator: operator };
  }

  if (state.accumulator === null) {
    return {
      ...state,
      accumulator: current,
      pendingOperator: operator,
      overwrite: true,
    };
  }

  // Já existe operação pendente: aplica antes de registrar a próxima ("encadeia").
  try {
    const result = applyOperator(state.pendingOperator!, state.accumulator, current);
    return {
      ...state,
      display: formatResult(result),
      accumulator: result,
      pendingOperator: operator,
      overwrite: true,
      history: pushHistory(
        state.history,
        formatExpression(state.accumulator, state.pendingOperator!, current),
        formatResult(result),
        deps,
      ),
    };
  } catch (err) {
    return toErrorState(state, err);
  }
}

function computeEquals(state: CalculatorState, deps: EngineDeps): CalculatorState {
  if (state.pendingOperator === null || state.accumulator === null) {
    return { ...state, overwrite: true };
  }

  const right = parseDisplay(state.display);
  try {
    const result = applyOperator(state.pendingOperator, state.accumulator, right);
    return {
      ...state,
      display: formatResult(result),
      accumulator: null,
      pendingOperator: null,
      overwrite: true,
      history: pushHistory(
        state.history,
        formatExpression(state.accumulator, state.pendingOperator, right),
        formatResult(result),
        deps,
      ),
    };
  } catch (err) {
    return toErrorState(state, err);
  }
}

function backspace(state: CalculatorState): CalculatorState {
  if (state.overwrite || state.display === '0') {
    return state;
  }
  const next = state.display.slice(0, -1);
  if (next === '' || next === '-') {
    return { ...state, display: '0', overwrite: true };
  }
  return { ...state, display: next };
}

function toggleSign(state: CalculatorState): CalculatorState {
  if (state.display === '0') {
    return state;
  }
  const value = negate(parseDisplay(state.display));
  return { ...state, display: formatResult(value) };
}

function applyPercent(state: CalculatorState): CalculatorState {
  const current = parseDisplay(state.display);
  const value =
    state.accumulator !== null && state.pendingOperator !== null
      ? percentOfBase(state.accumulator, current)
      : percentOf(current);
  return { ...state, display: formatResult(value), overwrite: true };
}

/** Constrói o estado de erro a partir de uma exceção conhecida. */
function toErrorState(state: CalculatorState, err: unknown): CalculatorState {
  const message =
    err instanceof DivisionByZeroError
      ? err.message
      : 'Operação inválida';
  return {
    ...state,
    display: ERROR_DISPLAY,
    accumulator: null,
    pendingOperator: null,
    overwrite: true,
    error: message,
  };
}

/** Acrescenta um registro ao histórico respeitando {@link HISTORY_LIMIT}. */
function pushHistory(
  history: HistoryEntry[],
  expression: string,
  result: string,
  deps: EngineDeps,
): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: deps.createId(),
    expression,
    result,
    timestamp: deps.now(),
  };
  return [entry, ...history].slice(0, HISTORY_LIMIT);
}

/** Roda uma sequência de teclas a partir de um estado, útil em testes e demos. */
export function run(
  keys: CalculatorKey[],
  startState: CalculatorState = initialState,
  deps: EngineDeps = defaultDeps,
): CalculatorState {
  return keys.reduce((acc, key) => reduce(acc, key, deps), startState);
}
