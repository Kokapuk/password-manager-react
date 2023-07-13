import classNames from 'classnames';
import styles from '../styles/PasswordSkeleton.module.scss';

const PasswordSkeleton = () => {
  return (
    <div className={classNames(styles.bone, styles.background)}>
      <div className={classNames(styles.bone, styles.image)}></div>
      <div className={styles.details}>
        <div className={classNames(styles.bone, styles.details__title)}></div>
        <div className={classNames(styles.bone, styles['details__sub-title'])}></div>
      </div>
    </div>
  );
};

export default PasswordSkeleton;
