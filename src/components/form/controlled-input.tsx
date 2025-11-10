import type { ComponentPropsWithoutRef } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { Input } from "../ui/input";
import { ControlledField, type ControlledFieldProps } from "./controlled-field";

type ControlledTextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControlledFieldProps<TFieldValues, TName>, "render"> & {
  inputProps?: ComponentPropsWithoutRef<typeof Input>;
  placeholder?: ComponentPropsWithoutRef<typeof Input>["placeholder"];
  type?: ComponentPropsWithoutRef<typeof Input>["type"];
  autoComplete?: ComponentPropsWithoutRef<typeof Input>["autoComplete"];
};

export function ControlledTextField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  inputProps,
  placeholder,
  type,
  autoComplete,
  ...fieldProps
}: ControlledTextFieldProps<TFieldValues, TName>) {
  const resolvedInputProps: ComponentPropsWithoutRef<typeof Input> = {
    ...inputProps,
    placeholder: placeholder ?? inputProps?.placeholder,
    type: type ?? inputProps?.type,
    autoComplete: autoComplete ?? inputProps?.autoComplete,
  };

  const ariaInvalidProp = inputProps?.["aria-invalid"];

  return (
    <ControlledField<TFieldValues, TName>
      {...fieldProps}
      render={({ field, fieldState }) => (
        <Input
          {...resolvedInputProps}
          {...field}
          id={resolvedInputProps.id ?? field.name}
          aria-invalid={
            ariaInvalidProp !== undefined
              ? ariaInvalidProp
              : fieldState.invalid
                ? true
                : undefined
          }
        />
      )}
    />
  );
}

export { ControlledTextField as ControlledInput };

export type { ControlledFieldProps, ControlledTextFieldProps };
