import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../assets';
import {useAuth, useClient, useTheme} from '../../context';
import {Frequency} from '../../components';
import ClientHeader from './client-header';
import ClientHistory from './client-history';
import CheckIn from './check-in';
import DeleteClient from './delete-client';

const Client = ({navigation}) => {
  const {
    user: {promotionFrequency = 0},
  } = useAuth();
  const {background} = useTheme();

  let {totalFrequency = 0, lastServiceIsAFreeService} = useClient();

  let restOfDivision = totalFrequency % promotionFrequency;
  let freeServiceAvaliable = false;

  if (
    !lastServiceIsAFreeService &&
    restOfDivision === 0 &&
    totalFrequency >= promotionFrequency
  ) {
    freeServiceAvaliable = true;
  }

  return (
    <View style={[s.container, {backgroundColor: background}]}>
      <ClientHeader navigation={navigation} />
      <View style={s.content}>
        <Text style={s.title}>Frequência atual</Text>
        <Frequency
          frequency={restOfDivision}
          promotionFrequency={promotionFrequency}
          freeService={freeServiceAvaliable}
        />
        {freeServiceAvaliable && (
          <Text style={s.freeServiceWarning}>
            O próximo corte deste cliente é de graça!
          </Text>
        )}
      </View>
      <ClientHistory />
      <CheckIn />
      <DeleteClient navigation={navigation} />
    </View>
  );
};

export default Client;

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    color: COLORS.lightGray,
    textTransform: 'uppercase',
    marginVertical: 20,
    fontSize: 13,
  },
  freeServiceWarning: {
    marginTop: 20,
    color: COLORS.primary,
    textTransform: 'uppercase',
    maxWidth: 250,
    textAlign: 'center',
    fontSize: 14,
  },
});
