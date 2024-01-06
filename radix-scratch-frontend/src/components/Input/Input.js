import { Label } from '../Label/Label';
import styles from './Input.module.css';
import cx from 'classnames';

export const Input = ({ onChange, placeholder="placeholder", value, label, type = "text", className }) => (
  <div className={styles.inputContainer}>
    <Label>{label}</Label>
    <input
      onChange={onChange}
      value={value}
      type={type}
      placeholder={placeholder}
      className={cx(className, styles.input)}
    ></input>
  </div>
);
