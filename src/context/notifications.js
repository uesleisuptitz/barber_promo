import React, {createContext, useContext, useState} from 'react';

const NotificationsContext = createContext({
  type: 'sucess' || 'warning' || 'error',
  message: '',
  open: false,
  handleNotification: (
    notificationType = 'sucess',
    notificationMessage = '',
    time = 5000,
  ) => {},
  onClose: () => {},
});

export const NotificationsProvider = ({children}) => {
  const [open, setOpen] = useState(true);
  const [type, setType] = useState('warning');
  const [message, setMessage] = useState('Teste teste teste');

  const handleNotification = (
    notificationType = 'sucess',
    notificationMessage = '',
    time = 0,
  ) => {
    if (['sucess', 'warning', 'error'].includes(notificationType)) {
      setType(notificationType);
    } else {
      setType('warning');
    }
    setMessage(notificationMessage);
    setOpen(true);
    if (time) {
      setTimeout(() => {
        setOpen(false);
      }, time);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        handleNotification,
        open,
        type,
        message,
        onClose: () => setOpen(false),
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationsContext);
