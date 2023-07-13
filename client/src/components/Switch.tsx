import styles from '../styles/Switch.module.scss';

const Switch = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={styles.switch} {...props} type='checkbox' />;
};

export default Switch;
