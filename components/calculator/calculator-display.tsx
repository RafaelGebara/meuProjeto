/**
 * Visor da calculadora. Mostra o valor atual e, quando houver, a operação
 * pendente e a mensagem de erro. O texto encolhe para caber em uma linha.
 */

import { StyleSheet, Text, View } from 'react-native';

import { OPERATOR_SYMBOLS, type BinaryOperator } from '@/src/calculator';

interface CalculatorDisplayProps {
  value: string;
  pendingOperator: BinaryOperator | null;
  error: string | null;
}

export function CalculatorDisplay({ value, pendingOperator, error }: CalculatorDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.pending} numberOfLines={1}>
        {pendingOperator ? OPERATOR_SYMBOLS[pendingOperator] : ' '}
      </Text>
      <Text
        style={styles.value}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.4}
        accessibilityLiveRegion="polite"
        accessibilityLabel={`Visor: ${value}`}>
        {value}
      </Text>
      <Text style={styles.error} numberOfLines={1}>
        {error ?? ' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'flex-end',
  },
  pending: {
    fontSize: 20,
    color: '#ff9f0a',
    height: 24,
  },
  value: {
    fontSize: 64,
    fontWeight: '300',
    color: '#f2f2f7',
  },
  error: {
    fontSize: 14,
    color: '#ff453a',
    height: 20,
  },
});
