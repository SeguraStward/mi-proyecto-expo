import { useAppTheme } from '@/src/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';

interface TabItem {
  key: string;
  label: string;
  icon?: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
  style?: ViewStyle;
}

/**
 * @deprecated Usar BottomNavBar para la navegacion principal.
 * Este componente se mantiene para usos internos (filtros, segmented control).
 */
export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabPress, style }) => {
  const theme = useAppTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        borderWidth: theme.borderWidths.medium,
      },
      style,
    ]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              { borderRadius: theme.radius.sm },
              isActive && { backgroundColor: theme.colors.primaryPale },
            ]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.label,
              {
                color: isActive ? theme.colors.primary : theme.colors.textMuted,
                fontFamily: theme.typography.fontFamily,
              },
              isActive && { fontWeight: '600' as const },
            ]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
