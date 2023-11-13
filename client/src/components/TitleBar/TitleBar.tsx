import { titleBarHeight } from '.';
import isDesktopApp from '../../utils/isDesktopApp';
import styles from './TitleBar.module.scss';

const TitleBar = () => {
  if (!isDesktopApp()) {
    return null;
  }

  return <div className={styles.bar} style={{ height: titleBarHeight }} />;
};

export default TitleBar;
