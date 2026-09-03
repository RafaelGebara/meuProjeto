/**
 * Ponto de entrada público do módulo da calculadora. A interface deve importar
 * daqui (`@/src/calculator`) em vez de alcançar os arquivos internos.
 */

export * from './types';
export * from './operations';
export * from './format';
export * from './keys';
export {
  reduce,
  run,
  initialState,
  HISTORY_LIMIT,
  type EngineDeps,
} from './engine';
