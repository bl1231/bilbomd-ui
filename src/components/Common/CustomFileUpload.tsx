import * as React from 'react';
import { FieldProps, getIn } from 'formik';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import InputLabel, { InputLabelProps } from '@mui/material/InputLabel';
import Input, { InputProps } from '@mui/material/Input';
import Button, { ButtonProps } from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';

export interface CustomFileUploadProps extends FieldProps {
  label: string;
  accept: string;
  disabled?: boolean;
  InputProps?: Omit<InputProps, 'name' | 'type' | 'label'>;
  InputLabelProps?: InputLabelProps;
  FormControlProps?: FormControlProps;
}

export const CustomFileUpload = ({
  field,
  form: { isSubmitting, touched, errors, setFieldValue },
  label,
  accept,
  disabled = false,
  InputProps: inputProps,
  InputLabelProps: inputLabelProps,
  FormControlProps: formControlProps
}: CustomFileUploadProps) => {
  const error = getIn(touched, field.name) && getIn(errors, field.name);

  return (
    <FormControl {...formControlProps}>
      {label && (
        <InputLabel shrink error={!!error} {...inputLabelProps}>
          {label}
        </InputLabel>
      )}
      <Button variant="contained" component="label">
        Choose File
        <Input
          style={{ display: 'none' }}
          error={!!error}
          inputProps={{
            type: 'file',
            accept,
            disabled: disabled || isSubmitting,
            name: field.name,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange: (event: React.ChangeEvent<any>) => {
              if (inputProps?.onChange) {
                inputProps.onChange(event);
              } else {
                const file = event.currentTarget.files[0];
                setFieldValue(field.name, file);
              }
            }
          }}
          {...inputProps}
        />
      </Button>
      {error && <FormHelperText error>here:{error}</FormHelperText>}
    </FormControl>
  );
};
