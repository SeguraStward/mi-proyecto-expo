import { PlantColors } from '@/src/constants/colors';
import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, style, rightElement }) => {
  return (
    <View style={[styles.container, style]}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: PlantColors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: PlantColors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: PlantColors.textSecondary,
    marginTop: 2,
  },
});
