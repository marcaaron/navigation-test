import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer, DefaultTheme, CommonActions} from '@react-navigation/native';
import {Text, View, Button} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Constants from 'expo-constants';

const config = {
  initialRouteName: '',
  screens: {
    Chat: 'r/:id',
    LeftHandNav: '',
    SettingsStack: {
      screens: {
        Settings: 'settings',
        About: 'settings/about',
      },
    },
    Search: 'search'
  },
};

const linking = {
  prefixes: ['http://localhost'],
  config,
};

function LeftHandNav({navigation}) {
  return (
    <View style={{flex: 1}}>
      <LHNHeader navigation={navigation} />
      <View style={{marginBottom: 20}}>
        <Button title="Chat 1" onPress={() => navigation.push('Chat', {id: 1})} />
      </View>
      <View style={{marginBottom: 20}}>
        <Button style={{marginBottom: 20}} title="Chat 2" onPress={() => navigation.push('Chat', {id: 2})} />
      </View>
      <View style={{marginBottom: 20}}>
        <Button style={{marginBottom: 20}} title="Chat 3" onPress={() => navigation.push('Chat', {id: 3})} />
      </View>
    </View>
  );
}

function AboutScreen({navigation}) {
  return (
    <View>
      <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Button title="<" onPress={() => navigation.pop()}/>
        </View>
        <Text style={{fontSize: 24, flex: 1, paddingLeft: 20}}>About</Text>
      </View>
      <Text style={{fontSize: 20, marginBottom: 20}}>Welcome to my test app</Text>
      <Button title="Navigate to Chat" onPress={() => navigation.push('Chat', {id: 1})} />
    </View>
  );
}

function LHNHeader(props) {
  return (
    <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{fontSize: 24}}>Chats</Text>
      <Button title="Search" onPress={() => props.navigation.push('Search')} />
      <Button title="Settings" onPress={() => props.navigation.push('SettingsStack')} />
    </View>
  );
}

function SearchScreen({navigation}) {
  return (
    <View>
      <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Button title="<" onPress={() => navigation.goBack()}/>
        </View>
        <Text style={{fontSize: 24, flex: 1, paddingLeft: 20}}>Search</Text>
      </View>
      <Text style={{marginBottom: 20}}>Search Results: </Text>
      <View style={{marginBottom: 20}}>
        <Button style={{marginBottom: 20}} title="Chat 1" onPress={() => navigation.navigate('Chat', {id: 1})} />
      </View>
      <View style={{marginBottom: 20}}>
        <Button style={{marginBottom: 20}} title="Chat 2" onPress={() => navigation.navigate('Chat', {id: 2})} />
      </View>
      <View style={{marginBottom: 20}}>
        <Button style={{marginBottom: 20}} title="Chat 3" onPress={() => navigation.navigate('Chat', {id: 3})} />
      </View>
    </View>
  );
}

function SettingsScreen({navigation}) {
  return (
    <View>
      <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Button title="<" onPress={() => navigation.goBack()}/>
        </View>
        <Text style={{fontSize: 24, flex: 1, paddingLeft: 20}}>Settings</Text>
      </View>
      <View style={{marginBottom: 20}}>
        <Button title="About" onPress={() => navigation.navigate('About')} />
      </View>
    </View>
  )
}

function ChatScreen({route, navigation}) {
  return (
    <View>
        <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Button title="<" onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
                return;
              }

              throw new Error('On the chat screen but nowhere to go back to. We should always at least have the LHN to go back to');
            }}/>
          </View>
          <Text style={{fontSize: 24}}>Chat with Person {route.params.id}</Text>
        </View>
        <Button title="Link to another chat" onPress={() => navigation.push('Chat', {id: route.params.id + 1})} />
        <Button
          title="Link to About"
          onPress={() => {
            // This is fairly complex but seems to be the way we can "push" a new stack on and add the Settings screen in the routes
            navigation.dispatch((state) => {
              const newState = {...state};
              const routes = [...newState.routes];
              routes.push({
                name: 'SettingsStack',
                state: {
                  index: 1,
                  routes: [{name: 'Settings'}, {name: 'About'}]
                }
              });
              const newestState = {
                ...newState,
                routes,
                index: routes.length - 1,
              };
              return CommonActions.reset(newestState);
            });
          }}
        />
    </View>
  );
}

const Stack = createNativeStackNavigator();

const SettingsStack = createNativeStackNavigator();

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator
    initialRouteName="Settings"
  >
    <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
    <SettingsStack.Screen name="About" component={AboutScreen} options={{headerShown: false}} />
  </SettingsStack.Navigator>
);

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function App() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#ecf0f1',
      padding: 8,
    }}>
      <NavigationContainer
        linking={linking}
        theme={navTheme}
        onStateChange={(state) => {
          console.log('STATE CHANGED: ', state);
        }}

        // In order for a Chat's "up" button to work correctly we need to at least always have an initial route of LHN + Chat
        // We are going to need to parse the initial state based on a deep link and provide a custom state object here. That way
        // we never get stuck calling "go back" on something that doesn't have a parent node.
        initialState={{
          index: 0,
          routes: [{name: 'LeftHandNav'}, {name: 'Chat', params: {id: 1}}]
        }}
      >
        <Stack.Navigator
          initialRouteName="LeftHandNav"
        >
            <Stack.Screen
              name="LeftHandNav"
              component={LeftHandNav}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{headerShown: false}} />
            <Stack.Screen name="Search" component={SearchScreen} options={{headerShown: false}} />
            <Stack.Screen name="SettingsStack" component={SettingsStackNavigator} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
