import React, {useCallback, useState} from 'react';
import {StyleSheet, Image, Text, TouchableOpacity, Alert} from 'react-native';
import {COLORS, ICONS} from '../../assets';
import {Modal} from '../../components';
import {firestore} from '../../services';
import {useAuth, useClient, useTheme} from '../../context';

const CheckIn = ({navigation}) => {
  const {user} = useAuth();
  const {text} = useTheme();
  const {docId, name} = useClient();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClient = useCallback(() => {
    setDeleting(true);
    firestore()
      .collection(`users/${user.uid}/clients`)
      .doc(docId)
      .delete()
      .then(() => {
        setModalIsOpen(false);
        Alert.alert('Pronto!', 'Cliente excluído com sucesso!');
        navigation.navigate('Home');
      })
      .catch(() =>
        Alert.alert('Ops!', 'Ocorreu um erro ao tentar excluir o cliente!'),
      )
      .finally(() => setDeleting(false));
  }, [docId, user]);

  return (
    <>
      <Modal
        open={modalIsOpen}
        title="Excluir cliente"
        contentStyle={s.modalOverrideStyle}
        onClose={() => !deleting && setModalIsOpen(false)}
        okText="Excluir"
        onOk={handleDeleteClient}
        okProps={{loading: deleting}}>
        <Text style={{color: text}}>
          Você deseja excluir {name} da sua lista de clientes? Esta ação não
          pode ser desfeita!
        </Text>
      </Modal>
      <TouchableOpacity
        style={s.checkInButton}
        onPress={() => setModalIsOpen(true)}>
        <Image source={ICONS.delete} style={s.checkInIcon} />
      </TouchableOpacity>
    </>
  );
};

export default CheckIn;

const s = StyleSheet.create({
  checkInButton: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 135,
    left: 25,
    backgroundColor: COLORS.gray,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  checkInIcon: {
    tintColor: COLORS.white,
  },

  checkInConfirmButton: {alignSelf: 'center', marginVertical: 10, height: 45},
});
