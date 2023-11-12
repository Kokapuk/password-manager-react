import cn from 'classnames';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Favicon.module.scss';

interface Props {
  website: string;
}

const Favicon = ({ website }: Props) => {
  const [isLoading, setLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);
  const [memoizedWebsite, setMemoizedWebsite] = useState(website);
  const isInitialRender = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateMemoizedWebsite = useCallback(
    debounce((website: string) => {
      setFailedToLoad(false);
      setMemoizedWebsite(website);
    }, 1000),
    []
  );

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (website === memoizedWebsite) {
      setLoading(false);
    } else {
      setLoading(true);
    }

    updateMemoizedWebsite(website);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMemoizedWebsite, website]);

  return (
    <div className={cn(styles.container, (isLoading || failedToLoad) && styles.loading)}>
      <img
        key={memoizedWebsite}
        loading="lazy"
        className={cn(styles.image, (isLoading || failedToLoad) && styles.loading)}
        onLoad={() => setLoading(false)}
        onError={() => setFailedToLoad(true)}
        src={`https://www.google.com/s2/favicons?domain=${memoizedWebsite}&sz=128`}
      />
    </div>
  );
};

export default Favicon;
