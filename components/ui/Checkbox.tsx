import React from "react";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export function Checkbox({
  label,
  description,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-6">
        <input
          type="checkbox"
          className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded"
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={props.id}
              className="font-medium text-gray-700 text-base"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-gray-500 text-sm mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
