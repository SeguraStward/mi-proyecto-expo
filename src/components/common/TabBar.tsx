import { PlantColors } from '@/src/constants/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';

interface TabItem {
  key: string;
  label: string;
  icon?: string; // emoji o se puede ampliar a un componente de icono
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
  style?: ViewStyle;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabPress, style }) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            {tab.icon && <Text style={styles.icon}>{tab.icon}</Text>}
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: PlantColors.surface,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: PlantColors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  activeTab: {
    backgroundColor: PlantColors.primaryPale,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: PlantColors.textMuted,
  },
  activeLabel: {
    color: PlantColors.primary,
    fontWeight: '600',
  },
});
