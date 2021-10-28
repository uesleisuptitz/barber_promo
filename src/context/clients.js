import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {useAuth} from './auth';
import {firestore} from '../services';
import {Alert} from 'react-native';

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
        Alert.alert('Ops!', 'Ocorreu um erro ao tentar buscar seus clientes!'),
      );
      return () => {
        unsuscribe();
      };
    }
  }, []);

  const clearStringToSarch = useCallback(string =>
    string
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase(),
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
    [clients, setClientsFiltered],
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

//@todo apagar mock de nomes
const mock = [
  'Absalão',
  'Janira',
  'Ary',
  'Camilla',
  'Isabella',
  'Iasmin',
  'Liliana',
  'Milena',
  'Cristóvão',
  'Arthur',
  'Afonso',
  'Laryssa',
  'Guilherme',
  'Ahmad',
  'Anabel',
  'Polina',
  'Jael',
  'Rebecca',
  'Artyom',
  'Christian',
  'Fábia',
  'Oziel',
  'Eric',
  'Delfim',
  'Kevyn',
  'Enzo',
  'Hossana',
  'Armindo',
  'Dara',
  'Isael',
  'Delia',
  'Ezequiel',
  'Kiara',
  'Yasmin',
  'Manuela',
  'Ashley',
  'Maksim',
  'Lucy',
  'Lina',
  'Keven',
  'Henzo',
  'Jairo',
  'Derek',
  'Denzel',
  'Alice',
  'Sabrina',
  'Nélia',
  'Neide',
  'Alvin',
  'Lívia',
  'Alonso',
  'Uriel',
  'Kian',
  'Letízia',
  'Francesco',
  'Léon',
  'Jennifer',
  'Abrão',
  'Eduarda',
  'Luzia',
  'Suri',
  'Liliane',
  'Dominika',
  'Mikael',
  'KellY',
  'Jandira',
  'Nayara',
  'Chloé',
  'Nayla',
  'Viviana',
  'Brayan',
  'Martinha',
  'Nour',
  'Marília',
  'Clarinha',
  'Eliana',
  'Naísa',
  'Kendra',
  'Ananda',
  'Evandro',
  'Viktoriya',
  'Henrique',
  'Florbela',
  'Jessie',
  'Raina',
  'Nélson',
  'Bogdan',
  'Edwin',
  'Teotónio',
  'Eduardo',
  'Luara',
  'Pietra',
  'Giovany',
  'Thayra',
  'Jack',
  'Santhiago',
  'José',
  'Brahim',
  'Joshua',
  'Charlotte',
];
