import { createPortal } from 'react-dom';
import { titleBarHeight } from '.';
import isDesktopApp from '../../utils/isDesktopApp';
import styles from './TitleBar.module.scss';

const TitleBar = () => {
  if (!isDesktopApp()) {
    return null;
  }

  return createPortal(
    <div className={styles.bar} style={{ height: titleBarHeight }} />,
    document.getElementById('titleBarPortal') as HTMLElement
  );
};

export default TitleBar;
