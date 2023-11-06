import classNames from 'classnames';
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
}

const Modal = ({ isOpen: show, title, children, close: onCloseRequest, buttons }: Props) => {
  return createPortal(
    <div className={classNames(styles.background, !show && styles.background__hidden)}>
      <div className={classNames(styles.container, !show && styles.container__hidden)}>
        <header className={styles.header}>
          <h2>{title}</h2>
          <Button onClick={onCloseRequest} className={styles.header__button}>
            <HiMiniXMark />
          </Button>
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          {buttons?.map(({ title, secondary, ...props }) => (
            <Button
              {...props}
              key={title}
              className={classNames(styles.footer__button, secondary && styles.footer__button_secondary)}
            >
              {title}
            </Button>
          ))}
        </footer>
      </div>
    </div>,
    document.querySelector('#modal-portal') as HTMLElement
  );
};

export default Modal;
