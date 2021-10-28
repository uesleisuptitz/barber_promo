import React, {useCallback, useState, useEffect} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {COLORS} from '../../assets';
import {Modal, Input} from '../../components';
import {firestore} from '../../services';
import {useAuth, useClient} from '../../context';

const ClientEdit = ({open, onClose = () => {}}) => {
  const {user} = useAuth();
  const {name, docId, setName} = useClient();
  const [newClientName, setNewClientName] = useState(name);
  const [savingUser, setSavingUser] = useState(false);

  useEffect(() => setNewClientName(name), [name]);

  const handleSaveClient = useCallback(() => {
    setSavingUser(true);
    firestore()
      .collection(`users/${user.uid}/clients`)
      .doc(docId)
      .update({name: newClientName})
      .then(() => {
        setName(newClientName);
        onClose();
        Alert.alert('Pronto!', 'Seu cliente foi alterado com sucesso!');
        setSavingUser(false);
      })
      .catch(() => {
        Alert.alert(
          'Ops!',
          'Ocorreu um erro ao tentar salvar suas alterações!',
        );
        setSavingUser(false);
      });
  }, [newClientName, docId]);

  return (
    <Modal
      open={open}
      contentStyle={s.modalOverrideStyle}
      onClose={() => !savingUser && onClose()}
      title="Editar cliente"
      okText="Salvar"
      onOk={handleSaveClient}
      okProps={{
        loading: savingUser,
      }}>
      <Input
        placeholder="Nome do cliente"
        autoCapitalize="words"
        style={{maxWidth: '100%'}}
        disabled={savingUser}
        value={newClientName}
        onChangeText={v => setNewClientName(v)}
        autoFocus
      />
    </Modal>
  );
};

export default ClientEdit;

const s = StyleSheet.create({
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
  saveClientButton: {alignSelf: 'flex-end', marginVertical: 10, height: 45},
});
