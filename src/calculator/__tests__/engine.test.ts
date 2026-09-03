import { initialState, reduce, run, HISTORY_LIMIT, type EngineDeps } from '../engine';
import {
  backspaceKey,
  clearKey,
  decimalKey,
  digitKey,
  equalsKey,
  operatorKey,
  percentKey,
  toggleSignKey,
} from '../keys';
import { ERROR_DISPLAY } from '../format';

/** Dependências determinísticas para tornar o histórico previsível nos testes. */
function makeDeps(): EngineDeps {
  let counter = 0;
  return {
    createId: () => `id_${++counter}`,
    now: () => 1_700_000_000_000 + counter,
  };
}

describe('entrada de dígitos', () => {
  it('substitui o zero inicial pelo primeiro dígito', () => {
    const state = run([digitKey('7')]);
    expect(state.display).toBe('7');
  });

  it('concatena dígitos seguintes', () => {
    const state = run([digitKey('1'), digitKey('2'), digitKey('3')]);
    expect(state.display).toBe('123');
  });

  it('respeita o limite de dígitos do visor', () => {
    const keys = Array.from({ length: 20 }, () => digitKey('9'));
    const state = run(keys);
    expect(state.display.replace(/\D/g, '').length).toBe(12);
  });

  it('permite apenas um ponto decimal', () => {
    const state = run([digitKey('1'), decimalKey, digitKey('5'), decimalKey, digitKey('2')]);
    expect(state.display).toBe('1.52');
  });
});

describe('operações encadeadas', () => {
  it('soma dois números com "="', () => {
    const state = run([digitKey('2'), operatorKey('+'), digitKey('3'), equalsKey]);
    expect(state.display).toBe('5');
  });

  it('encadeia sem apertar "=" entre as operações', () => {
    const state = run([
      digitKey('2'),
      operatorKey('+'),
      digitKey('3'),
      operatorKey('*'),
      digitKey('4'),
      equalsKey,
    ]);
    // (2 + 3) * 4 — a calculadora avalia da esquerda para a direita.
    expect(state.display).toBe('20');
  });

  it('troca a operação pendente sem recalcular', () => {
    const state = run([digitKey('9'), operatorKey('+'), operatorKey('-'), digitKey('4'), equalsKey]);
    expect(state.display).toBe('5');
  });

  it('repetir "=" não altera o resultado nesta implementação', () => {
    const state = run([digitKey('5'), operatorKey('+'), digitKey('1'), equalsKey, equalsKey]);
    expect(state.display).toBe('6');
  });
});

describe('divisão por zero', () => {
  it('coloca o motor em estado de erro', () => {
    const state = run([digitKey('5'), operatorKey('/'), digitKey('0'), equalsKey]);
    expect(state.display).toBe(ERROR_DISPLAY);
    expect(state.error).not.toBeNull();
  });

  it('ignora qualquer tecla que não seja "C" enquanto há erro', () => {
    let state = run([digitKey('5'), operatorKey('/'), digitKey('0'), equalsKey]);
    state = reduce(state, digitKey('7'));
    expect(state.display).toBe(ERROR_DISPLAY);
    state = reduce(state, clearKey);
    expect(state.display).toBe('0');
    expect(state.error).toBeNull();
  });
});

describe('teclas auxiliares', () => {
  it('backspace remove o último dígito', () => {
    const state = run([digitKey('1'), digitKey('2'), digitKey('3'), backspaceKey]);
    expect(state.display).toBe('12');
  });

  it('toggle-sign inverte o sinal do visor', () => {
    const state = run([digitKey('8'), toggleSignKey]);
    expect(state.display).toBe('-8');
  });

  it('percent isolado divide por 100', () => {
    const state = run([digitKey('5'), digitKey('0'), percentKey]);
    expect(state.display).toBe('0,5');
  });

  it('percent com operando à esquerda usa a base', () => {
    const state = run([
      digitKey('2'),
      digitKey('0'),
      digitKey('0'),
      operatorKey('+'),
      digitKey('1'),
      digitKey('0'),
      percentKey,
      equalsKey,
    ]);
    // 200 + 10% de 200 = 220
    expect(state.display).toBe('220');
  });

  it('clear zera tudo menos o histórico', () => {
    const deps = makeDeps();
    let state = run([digitKey('2'), operatorKey('+'), digitKey('2'), equalsKey], initialState, deps);
    state = reduce(state, clearKey, deps);
    expect(state.display).toBe('0');
    expect(state.history).toHaveLength(1);
  });
});

describe('histórico', () => {
  it('registra cada cálculo concluído, mais recente primeiro', () => {
    const deps = makeDeps();
    let state = run([digitKey('2'), operatorKey('+'), digitKey('3'), equalsKey], initialState, deps);
    state = run([digitKey('4'), operatorKey('*'), digitKey('5'), equalsKey], state, deps);

    expect(state.history).toHaveLength(2);
    expect(state.history[0]).toMatchObject({ expression: '4 × 5', result: '20' });
    expect(state.history[1]).toMatchObject({ expression: '2 + 3', result: '5' });
  });

  it('não ultrapassa HISTORY_LIMIT registros', () => {
    const deps = makeDeps();
    let state = initialState;
    for (let i = 0; i < HISTORY_LIMIT + 10; i++) {
      state = run([digitKey('1'), operatorKey('+'), digitKey('1'), equalsKey], state, deps);
    }
    expect(state.history).toHaveLength(HISTORY_LIMIT);
  });
});

describe('pureza do reducer', () => {
  it('não muta o estado recebido', () => {
    const frozen = Object.freeze({ ...initialState });
    expect(() => reduce(frozen, digitKey('1'))).not.toThrow();
  });
});
