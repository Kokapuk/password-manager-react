import { CSSTransition } from 'react-transition-group';
import styles from './LoadingSpinner.module.scss';

interface Props {
  loading?: boolean;
  size?: number;
  lineWidth?: number;
}

const LoadingSpinner = ({ loading = true, size, lineWidth }: Props) => {
  return (
    <CSSTransition
      in={loading}
      timeout={200}
      classNames={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        exit: styles.exit,
        exitActive: styles.exitActive,
      }}
      unmountOnExit
    >
      <div className={styles.spinner} style={{ height: size, borderWidth: lineWidth }} />
    </CSSTransition>
  );
};

export default LoadingSpinner;
