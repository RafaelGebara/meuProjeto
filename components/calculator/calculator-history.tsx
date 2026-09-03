/**
 * Lista rolável com o histórico de cálculos. Tocar em um item devolve o
 * resultado correspondente para a tela, que decide o que fazer com ele.
 */

import { memo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { HistoryEntry } from '@/src/calculator';

interface CalculatorHistoryProps {
  entries: HistoryEntry[];
  onSelect?: (entry: HistoryEntry) => void;
}

function CalculatorHistoryComponent({ entries, onSelect }: CalculatorHistoryProps) {
  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Sem cálculos ainda</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${item.expression} igual a ${item.result}`}
          onPress={() => onSelect?.(item)}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
          <Text style={styles.expression} numberOfLines={1}>
            {item.expression}
          </Text>
          <Text style={styles.result} numberOfLines={1}>
            = {item.result}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 140,
    width: '100%',
  },
  content: {
    paddingHorizontal: 24,
  },
  row: {
    paddingVertical: 6,
    alignItems: 'flex-end',
  },
  rowPressed: {
    opacity: 0.6,
  },
  expression: {
    fontSize: 14,
    color: '#8e8e93',
  },
  result: {
    fontSize: 18,
    color: '#f2f2f7',
    fontWeight: '500',
  },
  empty: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#8e8e93',
    fontSize: 14,
  },
});

export const CalculatorHistory = memo(CalculatorHistoryComponent);
