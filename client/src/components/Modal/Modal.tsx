import cn from 'classnames';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { HiMiniXMark } from 'react-icons/hi2';
import Button, { ButtonProps } from '../Button';
import styles from './Modal.module.scss';

interface Props {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  close?(): void;
  buttons?: ({ title: string; secondary?: boolean } & ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>)[];
  fullHeight?: boolean;
}

const Modal = ({ isOpen: show, title, children, close: onCloseRequest, buttons, fullHeight }: Props) => {
  return createPortal(
    <div className={cn(styles.background, !show && styles.hidden)}>
      <div className={cn(styles.container, !show && styles.hidden, fullHeight && styles.fullHeight)}>
        <header className={styles.header}>
          <h2>{title}</h2>
          <Button onClick={onCloseRequest} className={styles.button}>
            <HiMiniXMark />
          </Button>
        </header>
        <main className={styles.main}>{children}</main>
        {buttons && buttons.length && (
          <footer className={styles.footer}>
            {buttons.map(({ title, secondary, ...props }) => (
              <Button {...props} key={title} className={cn(styles.button, secondary && styles.secondary)}>
                {title}
              </Button>
            ))}
          </footer>
        )}
      </div>
    </div>,
    document.querySelector('#modal-portal') as HTMLElement
  );
};

export default Modal;
