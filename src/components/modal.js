import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import {SHADOW, COLORS, ICONS} from '../assets';
import Modal from 'react-native-modal';
import {useTheme} from '../context';
import {Button} from '../components';

const ModalComponent = ({
  children,
  title = 'Modal',
  okText = 'Ok',
  onOk = () => {},
  open,
  onClose = () => {},
  okProps = {disabled: false, loading: false},
}) => {
  const {background, text} = useTheme();
  return (
    <Modal
      isVisible={open}
      useNativeDriver
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      style={s.modal}>
      <View style={[s.container, {backgroundColor: background}]}>
        <View style={s.header}>
          <Text style={[s.title, {color: text}]}>{title}</Text>
          <TouchableOpacity style={s.closeButton} onPress={onClose}>
            <Image
              source={ICONS.close}
              style={[s.closeIcon, {tintColor: text}]}
            />
          </TouchableOpacity>
        </View>
        <View style={s.content}>{children}</View>
        <Button
          label={okText}
          size="small"
          style={s.okButton}
          onPress={onOk}
          disabled={okProps.disabled}
          loading={okProps.loading}
        />
      </View>
    </Modal>
  );
};

export default ModalComponent;

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
  header: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightGray,
  },
  content: {
    margin: 20,
  },
  title: {
    fontSize: 18,
    marginLeft: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: 15,
    height: 15,
  },
  okButton: {
    width: '50%',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
