/**
 * Tela principal: a calculadora.
 *
 * A tela é fina de propósito — junta o hook `useCalculator` com os componentes
 * de visor, histórico e teclado, e trata só de coisas de apresentação (área
 * segura, teclado físico na web).
 */

import { useCallback, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CalculatorDisplay,
  CalculatorHistory,
  CalculatorKeypad,
} from '@/components/calculator';
import { useCalculator } from '@/hooks/use-calculator';
import { keyFromKeyboardEvent, type HistoryEntry } from '@/src/calculator';

export default function HomeScreen() {
  const { display, error, pendingOperator, history, dispatchKey } = useCalculator();

  // Na web, deixa a calculadora responder ao teclado físico.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      const key = keyFromKeyboardEvent(event.key);
      if (key) {
        event.preventDefault();
        dispatchKey(key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatchKey]);

  const handleSelectHistory = useCallback(
    (entry: HistoryEntry) => {
      // Recoloca o resultado escolhido no visor, dígito a dígito.
      dispatchKey({ type: 'clear' });
      const raw = entry.result.replace(/\./g, '').replace(',', '.');
      for (const char of raw) {
        if (char === '.') {
          dispatchKey({ type: 'decimal' });
        } else if (char === '-') {
          dispatchKey({ type: 'toggle-sign' });
        } else {
          dispatchKey({ type: 'digit', value: char });
        }
      }
    },
    [dispatchKey],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.top}>
        <CalculatorHistory entries={history} onSelect={handleSelectHistory} />
        <CalculatorDisplay value={display} pendingOperator={pendingOperator} error={error} />
      </View>
      <CalculatorKeypad onKey={dispatchKey} pendingOperator={pendingOperator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  top: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
