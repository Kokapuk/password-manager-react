import styles from './Switch.module.scss';

const Switch = (props: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>) => {
  return <input className={styles.switch} {...props} type="checkbox" />;
};

export default Switch;
