import { useState } from 'react';
import { IconContext } from 'react-icons';
import { HiMiniArrowDownTray, HiMiniPlus } from 'react-icons/hi2';
import isDesktopApp from '../../../utils/isDesktopApp';
import Button from '../../Button';
import Tooltip from '../../Tooltip';
import CreatePasswordModal from '../CreatePasswordModal';
import styles from './Buttons.module.scss';

const Buttons = () => {
  const [isCreatePasswordModalOpen, setCreatePasswordModalOpen] = useState(false);

  return (
    <>
      <IconContext.Provider value={{ className: styles.icon }}>
        <Tooltip content="Create password" placement="bottom">
          <Button onClick={() => setCreatePasswordModalOpen(true)} className={styles.button}>
            <HiMiniPlus />
          </Button>
        </Tooltip>
        {!isDesktopApp() && (
          <Tooltip content="Download for Windows" placement="bottom">
            <a
              href="https://github.com/Kokapuk/desktop-password-manager/releases"
              target="_blank"
              style={{ display: 'flex' }}
            >
              <Button className={styles.button}>
                <HiMiniArrowDownTray />
              </Button>
            </a>
          </Tooltip>
        )}
        {/* {isDesktopApp() && (
          <Button className={styles.button}>
            <HiMiniCog8Tooth />
          </Button>
        )} */}
      </IconContext.Provider>

      <CreatePasswordModal
        isOpen={isCreatePasswordModalOpen}
        onCloseRequest={() => setCreatePasswordModalOpen(false)}
      />
    </>
  );
};

export default Buttons;
