import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {SHADOW, COLORS, ICONS} from '../assets';
import Modal from 'react-native-modal';
import {useNotification, useTheme} from '../context';
import {Button} from '.';

const ModalNotification = () => {
  const {background, text} = useTheme();
  const {open, type, message, onClose} = useNotification();
  return (
    <Modal
      isVisible={open}
      useNativeDriver
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={s.modal}>
      <View style={[s.container, {backgroundColor: background}]}>
        <View
          style={[
            s.imageContainer,
            type === 'sucess'
              ? s.sucess
              : type === 'error'
              ? s.error
              : s.warning,
          ]}>
          <Image
            style={s.image}
            source={
              type === 'sucess'
                ? ICONS.ok
                : type === 'error'
                ? ICONS.close
                : ICONS.warning
            }
          />
        </View>

        <Text style={[s.message, {color: text}]}>{message}</Text>
        <Button
          label={'Fechar'}
          size="small"
          style={s.okButton}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

export default ModalNotification;

const s = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
  container: {
    width: '85%',
    borderRadius: 8,
    ...SHADOW,
  },
  imageContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: -30,
    borderRadius: 60,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  sucess: {
    backgroundColor: '#39AF48',
  },
  error: {
    backgroundColor: '#E04A3A',
  },
  warning: {
    backgroundColor: COLORS.primary,
  },
  message: {
    margin: 20,
    textAlign: 'center',
  },
  okButton: {
    width: '50%',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
