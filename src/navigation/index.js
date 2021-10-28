import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Client, Home, Login} from '../pages';
import Menu from './menu';
import {useAuth, ClientsProvider, ClientProvider, useTheme} from '../context';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export const AppNavigation = () => {
  const {user} = useAuth();
  const {background, isDarkMode} = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={background}
      />
      <NavigationContainer>
        <ClientProvider>
          {user?.uid ? (
            <Drawer.Navigator
              initialRouteName="Home"
              drawerContent={props => <Menu {...props} />}>
              <Drawer.Screen name="Home" options={{headerShown: false}}>
                {props => (
                  <ClientsProvider>
                    <Home {...props} />
                  </ClientsProvider>
                )}
              </Drawer.Screen>
              <Drawer.Screen
                name="Client"
                options={{headerShown: false}}
                component={Client}
              />
            </Drawer.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          )}
        </ClientProvider>
      </NavigationContainer>
    </>
  );
};
