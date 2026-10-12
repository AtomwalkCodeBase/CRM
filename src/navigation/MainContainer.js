import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from '../screens/AuthScreen';
import { HomeStackScreen, MTaskStackScreen, ProfileStackScreen, TaskStackScreen, TodoStackScreen } from './MyStackContainers';
import Toast from 'react-native-toast-message';
import ToastMsg from '../components/ToastMsg';

//Screen names
const homeName = "Home";
const taskName = "My Task";
const mtaskName = "User Task";
const profileName = "Profile";
const loginName = "Login";
const todoName = "Todo";

const Tab = createBottomTabNavigator();

const MainContainer = () => {
  const { isLoading, userToken, error } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  if (error) {
    ToastMsg(error, '', 'error');
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={userToken ? { homeName } : { loginName }}
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          unmountOnBlur: true,
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === taskName) {
              iconName = focused ? 'list' : 'list-outline';
            } else if (rn === mtaskName) {
              iconName = focused ? 'create-outline' : 'create-outline';
            } else if (rn === todoName) {
              iconName = focused ? 'bulb-outline' : 'bulb-outline';

            } else if (rn === profileName) {
              iconName = focused ? 'person-circle' : 'person-circle-outline';

            } else if (rn === loginName) {
              iconName = focused ? 'log-in' : 'log-in-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },

        })}
      >

        {userToken ? (
          <>
            <Tab.Screen name={homeName} component={HomeStackScreen} />
            <Tab.Screen name={taskName} component={TaskStackScreen} />
            <Tab.Screen name={mtaskName} component={MTaskStackScreen} />
            <Tab.Screen name={todoName} component={TodoStackScreen} />
            <Tab.Screen name={profileName} component={ProfileStackScreen} />
          </>

        ) :
          (<>
            <Tab.Screen name={loginName} component={LoginScreen} />
          </>
          )
        }
      </Tab.Navigator>
      <Toast />
    </NavigationContainer>
  )
}

export default MainContainer;