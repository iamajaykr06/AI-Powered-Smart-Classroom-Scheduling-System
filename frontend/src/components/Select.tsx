import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, ...props }, ref) => {
    return (
      <div className="input-group">
        <label>{label}</label>
        <select ref={ref} {...props}>
          <option value="">Select a role</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="error">{error}</span>}
      </div>
    );
  }
);

export default Select;
