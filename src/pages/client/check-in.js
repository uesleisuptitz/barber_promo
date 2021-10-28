import React, {useCallback, useState} from 'react';
import {StyleSheet, Image, Text, TouchableOpacity, Alert} from 'react-native';
import {COLORS, ICONS} from '../../assets';
import {Modal} from '../../components';
import {firestore, firebase} from '../../services';
import {useAuth, useClient, useTheme} from '../../context';

const CheckIn = () => {
  const {user} = useAuth();
  const {text} = useTheme();
  const {promotionFrequency} = user;
  const {
    docId,
    setTotalFrequency,
    totalFrequency = 0,
    lastServiceIsAFreeService,
    setLastServiceIsAFreeService,
  } = useClient();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const handleClientCheckIn = useCallback(() => {
    let data = {date: new Date().getTime(), freeService: false};

    let restOfDivision = totalFrequency % promotionFrequency;
    if (
      !lastServiceIsAFreeService &&
      restOfDivision === 0 &&
      totalFrequency >= promotionFrequency
    ) {
      data.freeService = true;
    }
    setCheckingIn(true);
    let clientRef = firestore()
      .collection(`users/${user.uid}/clients`)
      .doc(docId);
    clientRef
      .collection('history')
      .add(data)
      .then(() => {
        if (!data.freeService) {
          clientRef.update({
            totalFrequency: firebase.firestore.FieldValue.increment(1),
          });
          setTotalFrequency(totalFrequency + 1);
          if (lastServiceIsAFreeService) setLastServiceIsAFreeService(false);
        }
        setModalIsOpen(false);
        Alert.alert('Pronto!', 'Check-in realizado com sucesso!');
      })
      .catch(() =>
        Alert.alert('Ops!', 'Ocorreu um erro ao tentar realizar o check-in!'),
      )
      .finally(() => setCheckingIn(false));
  }, [
    docId,
    user,
    totalFrequency,
    setTotalFrequency,
    promotionFrequency,
    lastServiceIsAFreeService,
    setLastServiceIsAFreeService,
  ]);

  let restOfDivision = totalFrequency % promotionFrequency;
  let freeCheckIn = false;
  if (
    !lastServiceIsAFreeService &&
    restOfDivision === 0 &&
    totalFrequency >= promotionFrequency
  ) {
    freeCheckIn = true;
  }

  return (
    <>
      <Modal
        open={modalIsOpen}
        title="Check-in"
        contentStyle={s.modalOverrideStyle}
        onClose={() => !checkingIn && setModalIsOpen(false)}
        okText="Confirmar"
        onOk={handleClientCheckIn}
        okProps={{loading: checkingIn}}>
        <Text style={{color: text}}>
          Você deseja adicionar um check-in para este usuário?
        </Text>
      </Modal>
      <TouchableOpacity
        style={s.checkInButton}
        onPress={() => setModalIsOpen(true)}>
        <Image
          source={freeCheckIn ? ICONS.promotion : ICONS.checkIn}
          style={s.checkInIcon}
        />
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
    right: 25,
    backgroundColor: COLORS.primary,
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
