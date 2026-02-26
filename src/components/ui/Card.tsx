import { PlantColors } from '@/src/constants/colors';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: PlantColors.surface,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: PlantColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
});
