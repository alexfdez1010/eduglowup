import { useEffect, useState } from 'react';

export const useMoney = () => {
  const [money, setMoney] = useState(-1);

  const getMoney = () => {
    fetch('/api/money')
      .then((response) => response.json())
      .then((data) => {
        setMoney(data.money);
      });
  };

  useEffect(() => {
    getMoney();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getMoney();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return money;
};
