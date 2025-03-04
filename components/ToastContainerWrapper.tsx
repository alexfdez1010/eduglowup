'use client';

import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from 'next-themes';
import 'react-toastify/dist/ReactToastify.css';

export function ToastContainerWrapper() {
  const { theme } = useTheme();
  return <ToastContainer theme={theme} />;
}

interface ToastParams {
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  draggable?: boolean;
}

const showToast = (
  type: 'success' | 'error',
  message: string,
  params: ToastParams = {},
) => {
  toast[type](message, {
    position: 'bottom-right',
    autoClose: params.autoClose ?? 5000,
    hideProgressBar: params.hideProgressBar ?? false,
    closeOnClick: params.closeOnClick ?? true,
    draggable: params.draggable ?? true,
    progress: undefined,
  });
};

export const successToast = (message: string, params: ToastParams = {}) => {
  showToast('success', message, params);
};

export const errorToast = (message: string, params: ToastParams = {}) => {
  showToast('error', message, params);
};
