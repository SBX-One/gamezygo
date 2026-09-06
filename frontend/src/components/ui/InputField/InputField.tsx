import * as React from "react";
import { cn } from "@/lib/utils";
import { Field, type FieldProps } from "@/components/ui/Field";

export interface InputFieldProps extends FieldProps {
  /** Label atau petunjuk di bagian atas input field */
  label?: React.ReactNode;
  /** Pesan error di bagian bawah input field (misal: '*Link steam salah...') */
  errorMessage?: React.ReactNode;
  /** Helper text opsional di bagian bawah jika tidak dalam kondisi error */
  helperText?: React.ReactNode;
  /** Custom class untuk wrapper container terluar */
  wrapperClassName?: string;
}

export function InputField({
  id,
  label,
  errorMessage,
  helperText,
  wrapperClassName,
  className,
  containerClassName,
  disabled,
  forceState,
  ...fieldProps
}: InputFieldProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const hasError = Boolean(errorMessage);

  return (
    <div className={cn("flex flex-col gap-2 w-full select-none", wrapperClassName)}>
      {/* 1. Top Label / Instructions */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-body-xs text-gray-400 font-normal leading-relaxed tracking-normal"
        >
          {label}
        </label>
      )}

      {/* 2. Main Field Component */}
      <Field
        id={inputId}
        disabled={disabled}
        forceState={forceState}
        containerClassName={cn(
          hasError && "",
          containerClassName
        )}
        className={className}
        {...fieldProps}
      />

      {/* 3. Bottom Error Message or Helper Text */}
      {errorMessage ? (
        <p className="text-body-xs text-rose-400 font-normal leading-tight tracking-normal">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p className="text-body-xs text-gray-400 font-normal leading-tight">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
