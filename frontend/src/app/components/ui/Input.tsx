import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

type InputProps = {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;

  multiline?: boolean;
  rows?: number;

  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  maxLength?: number;
  showCount?: boolean;

  onFocus?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  startIcon?: ReactNode;
  endIcon?: ReactNode;

  isLoading?: boolean;

  size?: "sm" | "md" | "lg";

  fullWidth?: boolean;
} & (
  | (InputHTMLAttributes<HTMLInputElement> & { multiline?: false })
  | (TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true })
);

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    {
      label,
      error,
      helperText,
      containerClassName,
      labelClassName,
      errorClassName,
      helperClassName,
      multiline = false,
      rows = 3,
      className,
      maxLength,
      showCount = false,
      value: controlledValue,
      onChange: controlledOnChange,
      startIcon,
      endIcon,
      isLoading = false,
      size = "md",
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      props.defaultValue?.toString() || ""
    );

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      controlledOnChange?.(e);
    };

    const sizeClasses = {
      sm: "py-1 px-2 text-sm",
      md: "py-2 px-3",
      lg: "py-3 px-4 text-lg",
    };

    const baseClasses = twMerge(
      "rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black",
      sizeClasses[size],
      fullWidth ? "w-full" : "w-auto",
      startIcon ? "pl-9" : "",
      endIcon || isLoading ? "pr-9" : "",
      error ? "border-red-500" : "border-gray-300",
      props.disabled ? "bg-gray-100 cursor-not-allowed opacity-75" : "",
      className
    );

    return (
      <div className={twMerge("flex flex-col space-y-1", containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className={twMerge(
              "text-sm font-medium text-gray-700",
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {startIcon}
            </div>
          )}

          {multiline ? (
            <textarea
              {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
              ref={ref as React.RefObject<HTMLTextAreaElement>}
              rows={rows}
              className={baseClasses}
              value={value}
              onChange={handleChange}
              maxLength={maxLength}
              disabled={isLoading || props.disabled}
            />
          ) : (
            <input
              {...(props as InputHTMLAttributes<HTMLInputElement>)}
              ref={ref as React.RefObject<HTMLInputElement>}
              className={baseClasses}
              value={value}
              onChange={handleChange}
              maxLength={maxLength}
              disabled={isLoading || props.disabled}
            />
          )}

          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="animate-spin h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}

          {endIcon && !isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {endIcon}
            </div>
          )}
        </div>

        {showCount && maxLength && (
          <div className="flex justify-end">
            <span className="text-xs text-gray-500">
              {value?.length || 0}/{maxLength} characters
            </span>
          </div>
        )}

        {error && (
          <p className={twMerge("text-sm text-red-500", errorClassName)}>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className={twMerge("text-sm text-gray-500", helperClassName)}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
