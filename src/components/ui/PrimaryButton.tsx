import { PlantColors } from '@/src/constants/colors';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    type TextStyle,
    type ViewStyle,
} from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isFilled = variant === 'filled';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        isFilled ? styles.filled : styles.outlined,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isFilled ? PlantColors.white : PlantColors.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            isFilled ? styles.textFilled : styles.textOutlined,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: PlantColors.primary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: PlantColors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textFilled: {
    color: PlantColors.textOnPrimary,
  },
  textOutlined: {
    color: PlantColors.primary,
  },
});
