import { useId, type ReactNode } from "react";

export interface FieldControlProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

interface FormFieldProps {
  label: string;
  errorMessage: string | undefined;
  renderControl: (control: FieldControlProps) => ReactNode;
}

export const FIELD_CONTROL_CLASSES =
  "rounded border border-stone-300 bg-white px-3 py-2 aria-[invalid=true]:border-red-700 aria-[invalid=true]:bg-red-50";

export function FormField({ label, errorMessage, renderControl }: FormFieldProps) {
  const controlId = useId();
  const errorId = useId();
  const hasError = errorMessage !== undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={controlId} className="font-medium">
        {label}
      </label>
      {renderControl({ id: controlId, "aria-invalid": hasError, "aria-describedby": hasError ? errorId : undefined })}
      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-red-800">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
