import styles from './Label.module.css'
import cx from 'classnames'
export const Label = ({ children, ...rest }) => <label {...rest} className={cx(styles.label, rest.className)}>{children}</label>
