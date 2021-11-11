import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {COLORS, ICONS, IMAGES} from '../../assets';
import {useAuth, useClient, useNotification, useTheme} from '../../context';
import {firestore} from '../../services';
import moment from 'moment';

const ClientHistory = () => {
  const {user} = useAuth();
  const {docId, setLastServiceIsAFreeService} = useClient();
  const {background, text} = useTheme();
  const {handleNotification} = useNotification();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const handleSetClientHistory = snapshot => {
        let changes = snapshot.docChanges();
        if (changes.length > 0) {
          changes.forEach((change, index) => {
            if (change.type === 'added') {
              setHistory(oldHistory => [
                ...oldHistory,
                {...change.doc.data(), docId: change.doc.id},
              ]);
            } else if (change.type === 'removed') {
              setHistory(oldHistory =>
                [...oldHistory].filter(event => event.docId !== change.doc.id),
              );
            } else if (change.type === 'modified') {
              setHistory(oldHistory =>
                [...oldHistory].map(event =>
                  event.docId === change.doc.id
                    ? {...change.doc.data(), docId: change.doc.id}
                    : event,
                ),
              );
            }
            if (index + 1 === changes.length) {
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      };
      const query = firestore()
        .collection(`users/${user.uid}/clients/${docId}/history`)
        .orderBy('date');
      const unsuscribe = query.onSnapshot(handleSetClientHistory, () =>
        notify(),
      );
      return () => {
        unsuscribe();
        setHistory([]);
        setLoading(true);
      };
    }
  }, [docId, notify, user]);

  const notify = useCallback(
    () =>
      handleNotification(
        'error',
        'Ops! Ocorreu um erro ao tentar buscar o histórico desse cliente!',
      ),
    [handleNotification],
  );

  useEffect(() => {
    if (history?.length > 0 && history[0].freeService) {
      setLastServiceIsAFreeService(true);
    }
  }, [history, setLastServiceIsAFreeService]);

  return (
    <>
      <Text style={s.title}>Histórico</Text>
      {loading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={s.loading}
          size={'large'}
        />
      ) : (
        <FlatList
          style={[s.listContainer, {backgroundColor: background}]}
          data={history ? history.sort((a, b) => b.date - a.date) : []}
          indicatorStyle={'black'}
          scrollEnabled={history.length > 0}
          ListEmptyComponent={
            <View style={s.emptyContainer}>
              <Image source={IMAGES.confuse} style={s.emptyImage} />
              <Text style={s.emptyText}>
                Esse cliente ainda não tem histórico
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <View
              key={item.id}
              style={[s.row, {backgroundColor: background}]}
              onPress={() => {}}>
              <Image
                source={item.freeService ? ICONS.promotion : ICONS.checkIn}
                style={s.calendar}
              />
              <View style={s.clientFirstLetter}>
                <Text style={{color: text}}>
                  {moment(item.date).locale('pt-br').format('LLL')}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={item => item.docId}
        />
      )}
    </>
  );
};

export default ClientHistory;

const s = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.lightGray,
    fontSize: 15,
    marginTop: -120,
    marginBottom: 250,
  },
  emptyImage: {
    maxWidth: '70%',
    resizeMode: 'contain',
    marginTop: -120,
  },
  title: {
    textAlign: 'center',
    color: COLORS.lightGray,
    textTransform: 'uppercase',
    marginVertical: 20,
    fontSize: 13,
  },
  row: {
    borderTopWidth: 0.5,
    borderTopColor: COLORS.lightGray,
    height: 60,
    marginHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  calendar: {
    tintColor: COLORS.primary,
    marginRight: 10,
  },
  loading: {marginTop: '45%'},
  listContainer: {width: '100%'},
});
