import { ReactNode } from 'react';
import styles from './Tooltip.module.scss';
import cn from 'classnames';

interface Props {
  content: string;
  children: ReactNode;
  position: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip = ({ content, children, position }: Props) => {
  return (
    <>
      <div className={styles.container}>
        {children}
        <span className={cn(styles.tooltip, styles[position])}>
          <p className={styles.content}>{content}</p>
        </span>
      </div>
    </>
  );
};

export default Tooltip;
