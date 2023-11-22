import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import isDesktopApp from '../../utils/isDesktopApp';
import styles from './TitleBar.module.scss';

const TitleBar = () => {
  const [isMaximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!isDesktopApp()) {
      return;
    }

    window.electron.ipcRenderer.on('toggleMaximized', (_event: unknown, isMaximized: boolean) => {
      setMaximized(isMaximized);
    });
  }, []);

  if (!isDesktopApp()) {
    return null;
  }

  return createPortal(
    <div className={styles.bar}>
      <button onClick={() => window.electron.ipcRenderer.send('minimize')} className={styles.controlButton}>
        &#xE921;
      </button>
      <button onClick={() => window.electron.ipcRenderer.send('toggleMaximized')} className={styles.controlButton}>
        {isMaximized ? <>&#xE923;</> : <>&#xE922;</>}
      </button>
      <button
        onClick={() => window.electron.ipcRenderer.send('close')}
        className={classNames(styles.controlButton, styles.close)}
      >
        &#xE8BB;
      </button>
    </div>,
    document.getElementById('titleBarPortal') as HTMLElement
  );
};

export default TitleBar;
