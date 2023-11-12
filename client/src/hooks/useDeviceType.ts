import { useEffect, useState } from 'react';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const useDeviceType = (): DeviceType => {
  const getDeviceType = (): DeviceType => {
    if (window.innerWidth >= 1024) {
      return 'desktop';
    }

    if (window.innerWidth < 1024 && window.innerWidth > 767) {
      return 'tablet';
    }

    return 'mobile';
  };

  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType());

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
};

export default useDeviceType;
