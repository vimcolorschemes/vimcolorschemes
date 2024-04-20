import styles from './index.module.css';

type RadioOption<T> = {
  value?: T;
  label: string;
};

type RadioProps<T> = {
  name: string;
  value?: T;
  onChange: (value: T | undefined) => void;
  options: RadioOption<T>[];
};

export default function Radio<T extends string>({
  name,
  value,
  onChange,
  options,
}: RadioProps<T>) {
  return (
    <fieldset className={styles.container}>
      {options.map(option => (
        <label key={option.value ?? 'all'}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
