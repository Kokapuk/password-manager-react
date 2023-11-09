import { ReactNode } from 'react';
import styles from './Tooltip.module.scss';

interface Props {
  content: string;
  children: ReactNode;
}

const Tooltip = ({ content, children }: Props) => {
  return (
    <>
      <div className={styles.container}>
        {children}
        <span className={styles.tooltip}>
          <p className={styles.content}>{content}</p>
        </span>
      </div>
    </>
  );
};

export default Tooltip;
