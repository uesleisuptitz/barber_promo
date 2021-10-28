import React from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../../assets';
import Header from './header';
import Clients from './clients';
import AddClient from './add-client';

const Home = props => {
  return (
    <View style={s.container}>
      <Header {...props} />
      <Clients {...props} />
      <AddClient />
    </View>
  );
};

export default Home;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
