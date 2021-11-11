import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, Keyboard} from 'react-native';
import {COLORS} from '../assets';
import {Input, Button} from '../components';
import {useAuth, useNotification, useTheme} from '../context';
import {userService} from '../services/user';

const Login = () => {
  const {setUser} = useAuth();
  const {handleNotification} = useNotification();
  const {background, text} = useTheme();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = useCallback(() => {
    Keyboard.dismiss();
    setLoggingIn(true);
    userService
      .loginWithEmailAndPassword(email, password)
      .then(({uid, name}) => {
        setUser({uid, name, email});
      })
      .catch(e => {
        handleNotification('error', 'Ops! ' + e);
        setLoggingIn(false);
      });
  }, [email, password, setUser, handleNotification]);

  return (
    <View style={[s.container, {backgroundColor: background}]}>
      <Text style={{color: text}}>Bem vindo(a) ao</Text>
      <Text style={s.title}>Barber Promo</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={v => setEmail(v)}
        disabled={loggingIn}
        keyboardType="email-address"
      />
      <Input
        placeholder="Senha"
        secure
        value={password}
        onChangeText={v => setPassword(v)}
        disabled={loggingIn}
      />
      <Button
        label="Entrar"
        onPress={handleLogin}
        disabled={!email || !password || loggingIn}
        loading={loggingIn}
      />
    </View>
  );
};

export default Login;

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 30,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
