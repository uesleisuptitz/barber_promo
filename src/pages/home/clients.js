import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {COLORS, IMAGES} from '../../assets';
import {useClient, useClients, useTheme} from '../../context';

const Clients = ({navigation}) => {
  const {clients, clientsFiltered, loading, searching} = useClients();
  const {setName, setDocId, setTotalFrequency} = useClient();
  const {background, text} = useTheme();

  const setClient = useCallback(
    client => {
      setName(client.name);
      setDocId(client.docId);
      setTotalFrequency(client.totalFrequency);
    },
    [setName, setDocId, setTotalFrequency],
  );
  let list =
    clientsFiltered?.length > 0
      ? clientsFiltered
      : searching
      ? []
      : clients?.length > 0
      ? clients
      : [];

  return loading ? (
    <View style={s.loadingContainer}>
      <ActivityIndicator color={COLORS.primary} size={40} />
    </View>
  ) : (
    <FlatList
      data={list ? list.sort((a, b) => a.name - b.name) : []}
      indicatorStyle={'black'}
      scrollEnabled={clients.length > 0}
      refreshControl={
        <RefreshControl refreshing={loading} colors={[COLORS.primary]} />
      }
      ListEmptyComponent={
        searching ? (
          <View style={s.emptyContainer}>
            <Text style={s.emptyResults}>
              Nenhum resultado foi encontrado para a sua pesquisa. Tente digitar
              só algumas letras para melhorar a pesquisa.
            </Text>
          </View>
        ) : (
          <View style={s.emptyContainer}>
            <Image source={IMAGES.barberSaloom} style={s.emptyImage} />
            <Text style={s.emptyText}>
              Você ainda não possui clientes cadastrados
            </Text>
          </View>
        )
      }
      style={{backgroundColor: background}}
      renderItem={({item}) => (
        <TouchableOpacity
          key={item.id}
          style={[s.row, {backgroundColor: background}]}
          onPress={() => {
            setClient(item);
            navigation.navigate('Client');
          }}>
          <View style={s.clientFirstLetter}>
            <Text style={{color: COLORS.white, fontSize: 18}}>
              {item.name[0]}
            </Text>
          </View>
          <Text style={{color: text, fontSize: 17}}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.docId}
    />
  );
};

export default Clients;

const s = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightGray,
    height: 60,
    marginHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  clientFirstLetter: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.lightGray,
    fontSize: 15,
    marginTop: -230,
    marginBottom: 250,
  },
  emptyImage: {
    maxWidth: '90%',
    resizeMode: 'contain',
    marginTop: -50,
  },
  emptyResults: {
    color: COLORS.lightGray,
    fontSize: 15,
    marginTop: 50,
    textAlign: 'center',
  },
});
