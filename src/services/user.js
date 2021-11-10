import {auth} from './firebase';

const errorsCode = {
  'auth/invalid-email': 'Achamos que esse endereço de email é inválido.',
  'auth/user-disabled': 'Este email pertence a um usuário desativado!',
  'auth/user-not-found': 'Usuário não encontrado!',
  'auth/wrong-password': 'Senha incorreta!',
  'auth/email-already-in-use': 'Endereço de email já cadastrado!',
  'auth/operation-not-allowed': 'Operação não permitida!',
  'auth/weak-password': 'Senha muito fraca! Tente uma mais forte',
  'auth/too-many-requests':
    'O acesso à essa conta está bloqueado temporariamente por várias tentativas de login!',
};

const loginWithEmailAndPassword = (email, password) =>
  new Promise((resolve, reject) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(({user: {uid, displayName: name}}) => resolve({uid, name}))
      .catch(e =>
        reject(
          errorsCode[e.code] || 'Ocorreu um erro ao tentar efetuar seu login!',
        ),
      );
  });

const verifyLogin = () =>
  new Promise((resolve, reject) => {
    auth().onAuthStateChanged(user => {
      if (user) {
        let {uid, displayName: name, email} = user;
        resolve({uid, name, email});
      } else {
        reject();
      }
    });
  });

const signOut = () => {
  return new Promise((resolve, reject) => {
    auth()
      .signOut()
      .then(() => resolve())
      .catch(e => reject(e));
  });
};

export const userService = {
  loginWithEmailAndPassword,
  verifyLogin,
  signOut,
};
