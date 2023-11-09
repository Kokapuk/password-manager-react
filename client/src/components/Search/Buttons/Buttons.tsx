import { useState } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';
import Button from '../../Button';
import CreatePasswordModal from '../CreatePasswordModal';
import styles from './Buttons.module.scss';

const Buttons = () => {
  const [isCreatePasswordModalOpen, setCreatePasswordModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setCreatePasswordModalOpen(true)} className={styles.button}>
        <HiMiniPlus />
      </Button>
      {/* <Link style={{ display: 'flex', flexShrink: 0, flexGrow: 0 }} to='/settings'>
            <Button className={styles.button}>
              <HiMiniCog8Tooth />
            </Button>
          </Link> */}

      <CreatePasswordModal
        isOpen={isCreatePasswordModalOpen}
        onCloseRequest={() => setCreatePasswordModalOpen(false)}
      />
    </>
  );
};

export default Buttons;
