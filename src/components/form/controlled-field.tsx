"use client";
import type { ComponentProps, ReactNode } from "react";

import {
  Controller,
  type ControllerFieldState,
  type ControllerProps,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseFormStateReturn,
  useFormContext,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";

type ControlledFieldRenderArgs<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
};

export type ControlledFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  label?: ReactNode;
  description?: ReactNode;
  fieldProps?: ComponentProps<typeof Field>;
  labelProps?: ComponentProps<typeof FieldLabel>;
  descriptionProps?: ComponentProps<typeof FieldDescription>;
  errorProps?: Omit<ComponentProps<typeof FieldError>, "errors">;
  controllerProps?: Omit<
    ControllerProps<TFieldValues, TName>,
    "name" | "render" | "control"
  >;
  render: (args: ControlledFieldRenderArgs<TFieldValues, TName>) => ReactNode;
};

export function ControlledField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  fieldProps,
  labelProps,
  descriptionProps,
  controllerProps,
  render,
  errorProps,
}: ControlledFieldProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      {...controllerProps}
      render={(renderArgs) => {
        const { field, fieldState, formState } = renderArgs;
        const errors = fieldState.error ? [fieldState.error] : undefined;

        const { htmlFor, ...restLabelProps } = labelProps ?? {};
        const labelHtmlFor = htmlFor ?? field.name;

        return (
          <Field data-invalid={fieldState.invalid || undefined} {...fieldProps}>
            {label ? (
              <FieldLabel htmlFor={labelHtmlFor} {...restLabelProps}>
                {label}
              </FieldLabel>
            ) : null}
            <FieldContent>
              {render({ field, fieldState, formState })}
              {description ? (
                <FieldDescription {...descriptionProps}>
                  {description}
                </FieldDescription>
              ) : null}
              <FieldError {...errorProps} errors={errors} />
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}
