import cn from 'classnames';
import { ReactNode } from 'react';
import styles from './Tooltip.module.scss';

interface Props {
  content: string;
  children: ReactNode;
  position: 'top' | 'right' | 'bottom' | 'left';
  containerClass?: string;
}

const Tooltip = ({ content, children, position, containerClass }: Props) => {
  return (
    <>
      <div className={cn(styles.container, containerClass)}>
        {children}
        <span className={cn(styles.tooltip, styles[position])}>
          <p className={styles.content}>{content}</p>
        </span>
      </div>
    </>
  );
};

export default Tooltip;
