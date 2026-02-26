import { PlantColors } from '@/src/constants/colors';
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    type TextInputProps,
    type ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined, style]}
        placeholderTextColor={PlantColors.textMuted}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: PlantColors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: PlantColors.surface,
    borderWidth: 1,
    borderColor: PlantColors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 15,
    color: PlantColors.textPrimary,
  },
  inputError: {
    borderColor: PlantColors.error,
  },
  errorText: {
    fontSize: 12,
    color: PlantColors.error,
    marginTop: 4,
  },
});
