/**
 * Hook que liga o motor puro da calculadora ao ciclo de vida do React.
 *
 * Toda a lógica vive em `@/src/calculator`; aqui só guardamos o estado com
 * `useReducer` e expomos ações memoizadas para a interface.
 */

import { useCallback, useMemo, useReducer } from 'react';

import {
  backspaceKey,
  clearKey,
  decimalKey,
  digitKey,
  equalsKey,
  initialState,
  operatorKey,
  percentKey,
  reduce,
  toggleSignKey,
  type BinaryOperator,
  type CalculatorKey,
  type CalculatorState,
  type HistoryEntry,
} from '@/src/calculator';

export interface UseCalculatorResult {
  /** String que deve aparecer no visor. */
  display: string;
  /** Mensagem de erro atual, ou `null`. */
  error: string | null;
  /** Operação pendente, útil para destacar o botão ativo. */
  pendingOperator: BinaryOperator | null;
  /** Histórico de cálculos, do mais recente para o mais antigo. */
  history: HistoryEntry[];
  /** Envia uma tecla arbitrária ao motor. */
  dispatchKey: (key: CalculatorKey) => void;
  /** Atalhos nomeados para as teclas mais comuns. */
  actions: {
    inputDigit: (digit: string) => void;
    inputDecimal: () => void;
    chooseOperator: (operator: BinaryOperator) => void;
    equals: () => void;
    clear: () => void;
    backspace: () => void;
    toggleSign: () => void;
    percent: () => void;
  };
}

function calculatorReducer(state: CalculatorState, key: CalculatorKey): CalculatorState {
  return reduce(state, key);
}

export function useCalculator(): UseCalculatorResult {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const dispatchKey = useCallback((key: CalculatorKey) => dispatch(key), []);

  const actions = useMemo(
    () => ({
      inputDigit: (digit: string) => dispatch(digitKey(digit)),
      inputDecimal: () => dispatch(decimalKey),
      chooseOperator: (operator: BinaryOperator) => dispatch(operatorKey(operator)),
      equals: () => dispatch(equalsKey),
      clear: () => dispatch(clearKey),
      backspace: () => dispatch(backspaceKey),
      toggleSign: () => dispatch(toggleSignKey),
      percent: () => dispatch(percentKey),
    }),
    [],
  );

  return {
    display: state.display,
    error: state.error,
    pendingOperator: state.pendingOperator,
    history: state.history,
    dispatchKey,
    actions,
  };
}
