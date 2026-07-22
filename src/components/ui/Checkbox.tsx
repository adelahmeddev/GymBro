import { motion } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  id?: string;
}

export function Checkbox({ checked, onChange, label, id }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="inline-flex items-center gap-3 cursor-pointer select-none"
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <motion.div
          animate={checked ? 'checked' : 'unchecked'}
          className={`
            w-6 h-6 rounded-lg border-2 flex items-center justify-center
            transition-colors duration-200
            ${checked
              ? 'bg-accent border-accent'
              : 'bg-surface-tertiary border-border-light'
            }
          `}
        >
          {checked && (
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2 }}
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          )}
        </motion.div>
      </div>
      {label && <span className="text-text-primary text-sm">{label}</span>}
    </label>
  );
}
