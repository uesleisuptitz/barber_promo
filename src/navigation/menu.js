import React, {useCallback, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import {COLORS, ICONS} from '../assets';
import {useAuth, useTheme} from '../context';
import {firestore} from '../services';
import {Input} from '../components';
import {RectButton} from 'react-native-gesture-handler';

const Menu = props => {
  const {
    user: {promotionFrequency, email, uid, name},
    logout,
  } = useAuth();
  const {background, text, switchTheme, isDarkMode} = useTheme();
  const [newPromotionFrequency, setNewPromotionFrequency] =
    useState(promotionFrequency);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (promotionFrequency && promotionFrequency !== newPromotionFrequency)
      setNewPromotionFrequency(promotionFrequency);
  }, [promotionFrequency]);

  const handleSavePromotionFrequency = useCallback(() => {
    if (newPromotionFrequency) {
      setSaving(true);
      firestore()
        .collection(`users`)
        .doc(uid)
        .update({promotionFrequency: parseInt(newPromotionFrequency)})
        .catch(() => {
          Alert.alert(
            'Ops!',
            'Ocorreu um erro ao tentar atualizar sua frequência promocional!',
          );
        })
        .finally(() => setSaving(false));
    }
  }, [newPromotionFrequency]);

  return (
    <DrawerContentScrollView
      {...props}
      style={[s.container, {backgroundColor: background}]}>
      <View style={s.content}>
        <View style={[s.row, s.line]}>
          <Text style={{color: text}}>{name}</Text>
          <Text style={{color: COLORS.primary, fontSize: 20}}>{email}</Text>
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
        <Text style={s.footer}>Desenvolvido por Uéslei Suptitz</Text>
      </View>
    </DrawerContentScrollView>
  );
};

export default Menu;

const s = StyleSheet.create({
  container: {
    padding: 0,
  },
  content: {
    height: Dimensions.get('window').height,
  },
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
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 20,
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
});
