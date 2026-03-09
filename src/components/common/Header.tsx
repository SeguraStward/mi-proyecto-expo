import { useAppTheme } from '@/src/theme';
import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, style, rightElement }) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, style]}>
      <View>
        <Text style={[styles.title, {
          color: theme.colors.textPrimary,
          fontFamily: theme.typography.fontFamily,
        }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, {
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fontFamilyMono,
          }]}>{subtitle}</Text>
        )}
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
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
