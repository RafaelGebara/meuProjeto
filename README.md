# Calculadora (Expo)

Calculadora simples feita com [Expo](https://expo.dev) e Expo Router. A lógica de
cálculo é uma máquina de estados pura, separada da interface e coberta por testes.

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o app:

   ```bash
   npx expo start
   ```

   No terminal aparecem as opções para abrir em um emulador Android, no simulador
   iOS, no Expo Go ou na web.

## Como usar

- **Dígitos, `,`** — montam o número no visor.
- **`+ − × ÷`** — escolhem a operação. Operações em sequência são encadeadas e
  avaliadas da esquerda para a direita (`2 + 3 × 4` = `20`).
- **`=`** — conclui o cálculo e grava no histórico.
- **`C`** — limpa o visor e a operação pendente (o histórico é mantido).
- **`±`** — inverte o sinal do número atual.
- **`%`** — porcentagem. Sozinho, divide por 100; com um operando à esquerda,
  calcula a porcentagem sobre ele (`200 + 10 %` = `220`).
- **`⌫`** — apaga o último dígito.
- Divisão por zero mostra **Erro**; depois disso, só `C` volta a funcionar.
- Na **web**, o teclado físico também funciona (números, operadores, `Enter`,
  `Backspace`, `Esc`).
- Tocar em um item do **histórico** devolve aquele resultado para o visor.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/calculator/operations.ts` | Aritmética pura (soma, divisão, porcentagem, arredondamento de ponto flutuante). |
| `src/calculator/format.ts` | Conversão entre o número interno e a string do visor; separador de milhar e notação científica. |
| `src/calculator/engine.ts` | Máquina de estados: `reduce(state, key)` devolve o próximo estado sem efeitos colaterais. |
| `src/calculator/keys.ts` | Fábricas de teclas e mapeamento do teclado físico. |
| `hooks/use-calculator.ts` | Liga o motor puro ao React via `useReducer`. |
| `constants/calculator-layout.ts` | Layout declarativo do teclado e paleta de cores. |
| `components/calculator/*` | Visor, teclado, botão e histórico — apenas apresentação. |
| `app/(tabs)/index.tsx` | Tela da calculadora. |
| `app/(tabs)/explore.tsx` | Aba "Sobre" com a documentação viva do projeto. |

## Testes

```bash
npm test
```

As suítes em `src/calculator/__tests__` cobrem as operações, a formatação e o
motor completo (encadeamento, histórico, tratamento de erro, pureza do reducer).

## Qualidade

```bash
npm run lint      # ESLint (eslint-config-expo)
npx tsc --noEmit  # checagem de tipos
```
