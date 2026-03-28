/**
 * FormInput — Wrapper que integra Input con react-hook-form via Controller.
 *
 * Uso:
 *   <FormInput control={control} name="displayName" label="NOMBRE" />
 */

import React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input, type InputProps } from './Input';

interface FormInputProps<T extends FieldValues>
  extends Omit<InputProps, 'value' | 'onChangeText' | 'onBlur' | 'error' | 'ref'> {
  control: Control<T>;
  name: Path<T>;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
        <Input
          ref={ref}
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...inputProps}
        />
      )}
    />
  );
}
