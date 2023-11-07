import cn from 'classnames';
import { useEffect, useState } from 'react';
import styles from './Favicon.module.scss';

interface Props {
  website: string;
}

const Favicon = ({ website }: Props) => {
  const [isLoading, setLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);

  useEffect(() => {
    setFailedToLoad(false);
  }, [website]);

  return (
    <div className={cn(styles.container, (isLoading || failedToLoad) && styles.container_loading)}>
      <img
        loading="lazy"
        className={cn(styles.image, (isLoading || failedToLoad) && styles.image_loading)}
        onLoad={() => setLoading(false)}
        onError={() => setFailedToLoad(true)}
        src={`https://www.google.com/s2/favicons?domain=${website}&sz=128`}
      />
    </div>
  );
};

export default Favicon;
