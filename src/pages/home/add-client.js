import React, {useCallback, useState} from 'react';
import {StyleSheet, Image, Text, TouchableOpacity, Alert} from 'react-native';
import {COLORS, ICONS} from '../../assets';
import {Modal, Input} from '../../components';
import {firestore} from '../../services';
import {useAuth, useClients, useTheme} from '../../context';

const AddClient = () => {
  const {user} = useAuth();
  const {clients} = useClients();
  const {text} = useTheme();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [creatingClient, setCreatingClient] = useState(false);

  const handleCreateClient = useCallback(() => {
    setCreatingClient(true);
    firestore()
      .collection(`users/${user.uid}/clients`)
      .add({name: clientName})
      .then(() => {
        setModalIsOpen(false);
        Alert.alert('Pronto!', 'Seu cliente foi cadastrado com sucesso!');
        setCreatingClient(false);
        setClientName('');
      })
      .catch(() => {
        Alert.alert('Ops!', 'Ocorreu um erro ao tentar cadastrar seu cliente!');
        setCreatingClient(false);
      });
  }, [clientName]);

  let alreadyHasClientName = clients.some(({name}) => name === clientName);

  return (
    <>
      <Modal
        open={modalIsOpen}
        contentStyle={s.modalOverrideStyle}
        onClose={() => {
          if (!creatingClient) {
            setModalIsOpen(false);
            setClientName('');
          }
        }}
        title="Cadastrar novo cliente"
        okText="Cadastrar"
        onOk={handleCreateClient}
        okProps={{
          loading: creatingClient,
          disabled: alreadyHasClientName,
        }}>
        <Input
          placeholder="Nome do cliente"
          autoCapitalize="words"
          style={{maxWidth: '100%'}}
          disabled={creatingClient}
          value={clientName}
          onChangeText={v => setClientName(v)}
        />
        {alreadyHasClientName && (
          <Text style={[s.warning, {color: text}]}>
            Já existe um cliente com esse nome!
          </Text>
        )}
      </Modal>
      <TouchableOpacity
        style={s.addClientButton}
        onPress={() => setModalIsOpen(true)}>
        <Image source={ICONS.addUser} style={s.addClientIcon} />
      </TouchableOpacity>
    </>
  );
};

export default AddClient;

const s = StyleSheet.create({
  addClientButton: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  addClientIcon: {
    tintColor: COLORS.white,
  },
  modalOverrideStyle: {
    width: '90%',
    alignItems: 'flex-start',
    paddingTop: 15,
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.gray,
    marginBottom: 20,
  },
  closeModalButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalIcon: {
    tintColor: COLORS.gray,
    width: 15,
    height: 15,
  },
  createClientButton: {alignSelf: 'flex-end', marginVertical: 10, height: 45},
  warning: {
    textAlign: 'center',
  },
});
