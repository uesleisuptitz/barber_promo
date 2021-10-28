import React, {useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {ICONS} from '../../assets';
import {useClient, useTheme} from '../../context';
import ClientEdit from './client-edit';

const ClientHeader = ({navigation}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const {name} = useClient();
  const {background, text} = useTheme();

  return (
    <View style={[s.container, {backgroundColor: background}]}>
      <ClientEdit open={modalIsOpen} onClose={() => setModalIsOpen(false)} />
      <TouchableOpacity
        style={s.buttons}
        onPress={() => navigation.navigate('Home')}>
        <Image source={ICONS.back} style={{tintColor: text}} />
      </TouchableOpacity>
      <Text style={[s.title, {color: text}]}>{name}</Text>
      <TouchableOpacity style={s.buttons} onPress={() => setModalIsOpen(true)}>
        <Image source={ICONS.edit} style={{tintColor: text}} />
      </TouchableOpacity>
    </View>
  );
};

export default ClientHeader;

const s = StyleSheet.create({
  container: {
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  title: {
    fontSize: 20,
  },
  buttons: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
