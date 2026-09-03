/**
 * Teclado da calculadora: percorre a matriz `KEYPAD` de `calculator-layout` e
 * renderiza um `CalculatorButton` por célula. Não contém lógica de cálculo.
 */

import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { CalculatorButton } from './calculator-button';
import { KEYPAD, type ButtonSpec } from '@/constants/calculator-layout';
import type { BinaryOperator, CalculatorKey } from '@/src/calculator';

interface CalculatorKeypadProps {
  onKey: (key: CalculatorKey) => void;
  pendingOperator: BinaryOperator | null;
}

function CalculatorKeypadComponent({ onKey, pendingOperator }: CalculatorKeypadProps) {
  const handlePress = useCallback(
    (spec: ButtonSpec) => {
      onKey(spec.key);
    },
    [onKey],
  );

  return (
    <View style={styles.container}>
      {KEYPAD.map((row, rowIndex) => (
        <View style={styles.row} key={`row-${rowIndex}`}>
          {row.map((spec) => {
            const isActive =
              spec.key.type === 'operator' && spec.key.value === pendingOperator;
            return (
              <CalculatorButton
                key={spec.label}
                spec={spec}
                onPress={handlePress}
                active={isActive}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
  },
});

export const CalculatorKeypad = memo(CalculatorKeypadComponent);
