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
      <legend className={styles.legend}>{name}:</legend>
      <div className={styles.options}>
        {options.map(option => (
          <label key={option.value ?? 'any'} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={styles.input}
            />
            <span className={styles.indicator} />
            <span className={styles.label}>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
