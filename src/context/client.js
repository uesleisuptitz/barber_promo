import React, {createContext, useContext, useState} from 'react';

const ClientContext = createContext({
  name: '',
  setName: () => {},
  docId: '',
  setDocId: () => {},
  totalFrequency: 0,
  setTotalFrequency: () => {},
  lastServiceIsAFreeService: false,
  setLastServiceIsAFreeService: () => {},
});

export const ClientProvider = ({children}) => {
  const [name, setName] = useState();
  const [docId, setDocId] = useState(false);
  const [totalFrequency, setTotalFrequency] = useState(0);
  const [lastServiceIsAFreeService, setLastServiceIsAFreeService] =
    useState(false);

  return (
    <ClientContext.Provider
      value={{
        name,
        setName,
        docId,
        setDocId,
        totalFrequency,
        setTotalFrequency,
        lastServiceIsAFreeService,
        setLastServiceIsAFreeService,
      }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
