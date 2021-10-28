import React, {useRef} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {COLORS, ICONS} from '../../assets';
import SearchHeader from 'react-native-search-header';
import {DrawerActions} from '@react-navigation/native';
import {useClients, useTheme} from '../../context';

const Header = ({navigation}) => {
  const searchHeaderRef = useRef(null);
  const {handleSearchClients, handleClearSearch, handleOpenOrCloseSearch} =
    useClients();
  const {background, text} = useTheme();

  return (
    <View style={[s.container, {backgroundColor: background}]}>
      <TouchableOpacity
        style={s.buttons}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Image source={ICONS.burguerMenu} style={{tintColor: text}} />
      </TouchableOpacity>
      <Text style={[s.title, {color: text}]}>Lista de clientes</Text>
      <TouchableOpacity
        style={s.buttons}
        onPress={() => searchHeaderRef?.current?.show()}>
        <Image source={ICONS.search} style={{tintColor: text}} />
      </TouchableOpacity>
      <SearchHeader
        ref={searchHeaderRef}
        placeholder="Pesquisar"
        onEnteringSearch={({nativeEvent: {text}}) => handleSearchClients(text)}
        onHide={() => {
          handleClearSearch();
          handleOpenOrCloseSearch();
          if (searchHeaderRef?.current) searchHeaderRef.current.clear();
        }}
        onFocus={handleOpenOrCloseSearch}
        enableSuggestion={false}
        inputColor={text}
        placeholderColor={COLORS.lightGray}
        headerBgColor={background}
        iconColor={text}
        entryAnimation={'from-right-side'}
      />
    </View>
  );
};

export default Header;

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
