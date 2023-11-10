import cn from 'classnames';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiMiniXMark } from 'react-icons/hi2';
import Button, { ButtonProps } from '../Button';
import styles from './Modal.module.scss';

interface Props {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onCloseRequest?(): void;
  buttons?: ({ title: string; secondary?: boolean } & ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>)[];
  fullHeight?: boolean;
}

const Modal = ({ isOpen, title, children, onCloseRequest, buttons, fullHeight }: Props) => {
  useEffect(() => {
    if (!isOpen || !onCloseRequest) {
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      onCloseRequest();
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onCloseRequest]);

  return createPortal(
    <div className={cn(styles.background, !isOpen && styles.hidden)}>
      <div className={cn(styles.container, !isOpen && styles.hidden, fullHeight && styles.fullHeight)}>
        <header className={styles.header}>
          <h2>{title}</h2>
          {onCloseRequest && (
            <Button onClick={onCloseRequest} className={styles.button}>
              <HiMiniXMark />
            </Button>
          )}
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
