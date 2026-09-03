/**
 * Aba "Sobre": explica como a calculadora foi organizada. Serve de documentação
 * viva do projeto para quem abrir o app.
 */

import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function AboutScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={280}
          color="#808080"
          name="plus.forwardslash.minus"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Sobre a calculadora
        </ThemedText>
      </ThemedView>

      <ThemedText>
        Este app é uma calculadora simples construída com Expo Router. A lógica de
        cálculo é totalmente separada da interface.
      </ThemedText>

      <Collapsible title="Motor puro (src/calculator)">
        <ThemedText>
          A pasta <ThemedText type="defaultSemiBold">src/calculator</ThemedText> contém uma
          máquina de estados pura: a função{' '}
          <ThemedText type="defaultSemiBold">reduce(state, key)</ThemedText> recebe o estado
          atual e uma tecla e devolve o próximo estado, sem efeitos colaterais.
        </ThemedText>
        <ThemedText>
          Isso permite testar toda a aritmética, o encadeamento de operações e o
          histórico sem renderizar nada.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Interface (components/calculator)">
        <ThemedText>
          Os componentes <ThemedText type="defaultSemiBold">CalculatorDisplay</ThemedText>,{' '}
          <ThemedText type="defaultSemiBold">CalculatorKeypad</ThemedText> e{' '}
          <ThemedText type="defaultSemiBold">CalculatorHistory</ThemedText> apenas exibem
          dados e disparam teclas. O layout do teclado é declarado em{' '}
          <ThemedText type="defaultSemiBold">constants/calculator-layout.ts</ThemedText>.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Hook de ligação (useCalculator)">
        <ThemedText>
          O hook <ThemedText type="defaultSemiBold">useCalculator</ThemedText> guarda o estado
          com <ThemedText type="defaultSemiBold">useReducer</ThemedText> e expõe ações
          memoizadas para a tela.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Testes">
        <ThemedText>
          As suítes em <ThemedText type="defaultSemiBold">src/calculator/__tests__</ThemedText>{' '}
          cobrem operações, formatação e o motor. Rode com{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            npm test
          </ThemedText>
          .
        </ThemedText>
      </Collapsible>

      <Image
        source={require('@/assets/images/react-logo.png')}
        style={styles.logo}
        contentFit="contain"
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -80,
    left: -30,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 8,
  },
});
