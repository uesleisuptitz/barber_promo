import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {useAuth} from './auth';
import {firestore} from '../services';
import {useNotification} from '.';

const ClientsContext = createContext({
  clients: [],
  clientsFiltered: [],
  loading: true,
  searching: false,
  handleSearchClients: () => {},
  handleClearSearch: () => {},
  handleOpenOrCloseSearch: () => {},
});

export const ClientsProvider = ({children}) => {
  const {user} = useAuth();
  const {handleNotification} = useNotification();
  const [clients, setClients] = useState([]);
  const [clientsFiltered, setClientsFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const handleGetClients = snapshot => {
        setLoading(false);
        let changes = snapshot.docChanges();
        changes.forEach(change => {
          if (change.type === 'added') {
            setClients(oldClients =>
              [
                ...oldClients,
                {...change.doc.data(), docId: change.doc.id},
              ].sort((a, b) => a.name.localeCompare(b.name)),
            );
          } else if (change.type === 'removed') {
            setClients(oldClients =>
              [...oldClients]
                .filter(client => client.docId !== change.doc.id)
                .sort((a, b) => a.name.localeCompare(b.name)),
            );
          } else if (change.type === 'modified') {
            setClients(oldClients =>
              [...oldClients]
                .map(client =>
                  client.docId === change.doc.id
                    ? {...change.doc.data(), docId: change.doc.id}
                    : client,
                )
                .sort((a, b) => a.name.localeCompare(b.name)),
            );
          }
        });
      };
      const query = firestore().collection(`users/${user.uid}/clients`);
      const unsuscribe = query.onSnapshot(handleGetClients, () =>
        handleNotification(
          'error',
          'Ops! Ocorreu um erro ao tentar buscar seus clientes!',
        ),
      );
      return () => {
        unsuscribe();
      };
    }
  }, [handleNotification, user.uid]);

  const clearStringToSarch = useCallback(
    string =>
      string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase(),
    [],
  );

  const handleSearchClients = useCallback(
    searchText => {
      let filtered = [...clients].filter(({name}) =>
        clearStringToSarch(name).includes(clearStringToSarch(searchText))
          ? name
          : false,
      );
      setClientsFiltered(filtered);
    },
    [clearStringToSarch, clients],
  );
  const handleClearSearch = useCallback(() => setClientsFiltered([]), []);
  const handleOpenOrCloseSearch = useCallback(
    () => setSearching(oldValue => !oldValue),
    [],
  );

  return (
    <ClientsContext.Provider
      value={{
        clients,
        clientsFiltered,
        loading,
        handleSearchClients,
        handleClearSearch,
        handleOpenOrCloseSearch,
        searching,
      }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => useContext(ClientsContext);
