import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {Alert} from 'react-native';
import {firestore} from '../services';
import {userService} from '../services/user';

let UserProps = {
  email: null,
  name: null,
  uid: null,
  promotionFrequency: 10,
};

const AuthContext = createContext({
  user: UserProps,
  logout: () => {},
});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(UserProps);

  useEffect(() => {
    userService.verifyLogin().then(loggedUSer => setUser(loggedUSer));
  }, []);

  useEffect(() => {
    if (user?.uid && !user?.name) {
      firestore()
        .collection(`users`)
        .doc(user.uid)
        .onSnapshot(snapshot => {
          if (snapshot) setUser({...user, ...snapshot.data()});
        });
    }
  }, [user]);

  const logout = useCallback(() => {
    userService
      .signOut()
      .then(() => {
        setUser(UserProps);
      })
      .catch(() => Alert.alert('Ops!', 'Ocorreu um erro ao tentar deslogar!'));
  }, []);

  return (
    <AuthContext.Provider value={{user, setUser, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
