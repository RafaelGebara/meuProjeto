/**
 * Botão individual do teclado da calculadora.
 *
 * É "burro" de propósito: recebe a especificação (`ButtonSpec`) e um callback,
 * e não conhece o motor. Aplica feedback tátil no toque quando disponível.
 */

import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';

import { BUTTON_COLORS, type ButtonSpec } from '@/constants/calculator-layout';

interface CalculatorButtonProps {
  spec: ButtonSpec;
  onPress: (spec: ButtonSpec) => void;
  /** Realça o botão quando a sua operação está pendente. */
  active?: boolean;
}

function CalculatorButtonComponent({ spec, onPress, active = false }: CalculatorButtonProps) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const palette = BUTTON_COLORS[scheme][spec.variant];

  const handlePress = useCallback(() => {
    // O feedback tátil é "melhor esforço": em plataformas sem suporte ele falha
    // silenciosamente e não deve quebrar o toque.
    Haptics.selectionAsync().catch(() => undefined);
    onPress(spec);
  }, [onPress, spec]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={spec.accessibilityLabel ?? spec.label}
      accessibilityState={{ selected: active }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.background, flex: spec.span ?? 1 },
        active && styles.active,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.label, { color: palette.text }]}>{spec.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  active: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  label: {
    fontSize: 26,
    fontWeight: '600',
  },
});

export const CalculatorButton = memo(CalculatorButtonComponent);
