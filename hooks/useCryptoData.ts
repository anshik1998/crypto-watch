import { useContext } from 'react';
import { CryptoDataContext } from '@/context/CryptoDataContext';

export const useCryptoData = () => {
  return useContext(CryptoDataContext);
};