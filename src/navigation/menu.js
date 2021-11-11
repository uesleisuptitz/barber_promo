import React, {useCallback, useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import {COLORS, ICONS} from '../assets';
import {useAuth, useNotification, useTheme} from '../context';
import {firestore} from '../services';
import {Input} from '../components';
import {RectButton} from 'react-native-gesture-handler';

const Menu = props => {
  const {
    user: {promotionFrequency, email, uid, name},
    logout,
  } = useAuth();
  const {background, text, switchTheme, isDarkMode} = useTheme();
  const {handleNotification} = useNotification();
  const [newPromotionFrequency, setNewPromotionFrequency] =
    useState(promotionFrequency);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNewPromotionFrequency(oldValue =>
      promotionFrequency && promotionFrequency !== oldValue
        ? promotionFrequency
        : oldValue,
    );
  }, [promotionFrequency, setNewPromotionFrequency]);

  const handleSavePromotionFrequency = useCallback(() => {
    if (newPromotionFrequency) {
      setSaving(true);
      firestore()
        .collection('users')
        .doc(uid)
        .update({promotionFrequency: parseInt(newPromotionFrequency, 10)})
        .catch(() => {
          handleNotification(
            'error',
            'Ops! Ocorreu um erro ao tentar atualizar sua frequência promocional!',
          );
        })
        .finally(() => setSaving(false));
    }
  }, [newPromotionFrequency, uid, setSaving, handleNotification]);

  return (
    <>
      <DrawerContentScrollView
        {...props}
        style={[s.container, {backgroundColor: background}]}>
        <View style={s.content}>
          <View style={[s.row, s.line]}>
            <Text style={{color: text}}>{name}</Text>
            <Text style={s.email} numberOfLines={1} ellipsizeMode="tail">
              {email}
            </Text>
          </View>
          <View style={[s.row, s.line]}>
            <Text style={{color: text}}>
              Frequência promocional: {promotionFrequency} (atual)
            </Text>
            <Input
              style={s.frequencyInput}
              value={newPromotionFrequency + ''}
              onChangeText={v => setNewPromotionFrequency(v)}
              keyboardType="number-pad"
              maxLength={2}
              placeholderTextColor={COLORS.gray}
              onBlur={handleSavePromotionFrequency}
              focusable={!saving}
            />
          </View>
          <RectButton
            rippleColor={text}
            style={[s.row, s.line, s.button]}
            onPress={switchTheme}>
            <Image
              source={isDarkMode ? ICONS.dark : ICONS.light}
              style={[s.buttonIcon, {tintColor: text}]}
            />
            <Text style={[s.buttonText, {color: text}]}>Trocar tema</Text>
          </RectButton>
          <RectButton
            rippleColor={text}
            style={[s.row, s.line, s.button]}
            onPress={() => {
              props.navigation.dispatch(DrawerActions.closeDrawer());
              logout();
            }}>
            <Image
              source={ICONS.logout}
              style={[s.buttonIcon, {tintColor: text}]}
            />
            <Text style={[s.buttonText, {color: text}]}>Sair</Text>
          </RectButton>
        </View>
      </DrawerContentScrollView>
      <Text style={s.footer}>
        {'Desenvolvido por Uéslei Suptitz\nFone: (51) 98290-7685'}
      </Text>
    </>
  );
};

export default Menu;

const s = StyleSheet.create({
  container: {
    padding: 0,
  },
  content: {},
  row: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  line: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightGray,
  },
  footer: {
    color: COLORS.lightGray,
    bottom: 20,
    position: 'absolute',
    left: '14%',
    textAlign: 'center',
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  frequencyInput: {
    width: '100%',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    lineHeight: 21,
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 15,
    width: 22,
    height: 22,
  },
  email: {color: COLORS.primary, fontSize: 20},
});
