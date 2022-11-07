import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer, DefaultTheme, CommonActions, getStateFromPath} from '@react-navigation/native';
import {Text, View, Image, Pressable, Linking} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import search from './search.png';
import avatarThree from './avatar_3.png';
import avatarFour from './avatar_4.png';
import avatarFive from './avatar_5.png';
import chevron from './chevron.png';
import chevronRight from './chevron-right.png';

const chevronStyle = {width: 30, height: 30, resizeMode: 'contain', marginRight: 10};
const chatTitleStyle = {fontSize: 18, fontWeight: 'bold'};
const titleStyle = {fontSize: 24, fontWeight: 'bold', flex: 1};

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
      <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} onPress={() => navigation.push('Chat', {id: 1})}>
        <Image style={{width: 45, height: 45, borderRadius: '50%', marginRight: 10}} source={{uri: avatarFour}} />
        <Text style={chatTitleStyle}>Chat One</Text>
      </Pressable>
      <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} onPress={() => navigation.push('Chat', {id: 2})}>
        <Image style={{width: 45, height: 45, borderRadius: '50%', marginRight: 10}} source={{uri: avatarFive}} />
        <Text style={chatTitleStyle}>Chat Two</Text>
      </Pressable>
    </View>
  );
}

function AboutScreen({navigation}) {
  return (
    <View>
      <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Pressable onPress={() => navigation.pop()}>
          <Image style={chevronStyle} source={{uri: chevron}} />
        </Pressable>
        <Text style={titleStyle}>About</Text>
      </View>
      <Text style={{fontSize: 20, marginBottom: 20}}>Welcome to my test app</Text>
      <Pressable
          onPress={() => navigation.push('Chat', {id: 1})}
        >
          <Text style={{color: 'blue', fontSize: 18, marginBottom: 10}}>Link to another chat</Text>
        </Pressable>
    </View>
  );
}

function LHNHeader(props) {
  return (
    <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 10}}>Chats</Text>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 10, marginTop: 10}}>
        <Pressable style={{marginRight: 20}} onPress={() => props.navigation.push('Search')}>
          <Image style={{width: 30, height: 30}} source={{uri: search}} />
        </Pressable>
        <Pressable onPress={() => props.navigation.push('SettingsStack')}>
          <Image style={{width: 45, height: 45, borderRadius: '50%'}} source={{uri: avatarThree}} />
        </Pressable>
      </View>
    </View>
  );
}

function SearchScreen({navigation}) {
  return (
    <View>
      <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image style={chevronStyle} source={{uri: chevron}} />
        </Pressable>
        <Text style={titleStyle}>Search</Text>
      </View>
      <Text style={{marginBottom: 20}}>Search Results: </Text>
      <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} onPress={() => navigation.push('Chat', {id: 1})}>
        <Image style={{width: 45, height: 45, borderRadius: '50%', marginRight: 10}} source={{uri: avatarFour}} />
        <Text style={chatTitleStyle}>Chat One</Text>
      </Pressable>
      <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} onPress={() => navigation.push('Chat', {id: 2})}>
        <Image style={{width: 45, height: 45, borderRadius: '50%', marginRight: 10}} source={{uri: avatarFive}} />
        <Text style={chatTitleStyle}>Chat Two</Text>
      </Pressable>
    </View>
  );
}

function SettingsScreen({navigation}) {
  return (
    <View>
      <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image style={chevronStyle} source={{uri: chevron}} />
        </Pressable>
        <Text style={titleStyle}>Settings</Text>
      </View>
      <Pressable style={{flexDirection: 'row', marginTop: 10}} onPress={() => navigation.push('About')}>
        <Text style={{fontSize: 24, flex: 1, paddingLeft: 20}}>About</Text>
        <Image style={chevronStyle} source={{uri: chevronRight}} />
      </Pressable>
    </View>
  );
}

function ChatScreen({route, navigation}) {
  return (
    <View>
        <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Pressable onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
                return;
              }

              console.error('On the chat screen but nowhere to go back to. We should always at least have the LHN to go back to');
          }}>
            <Image style={chevronStyle} source={{uri: chevron}} />
          </Pressable>
          <Image style={{width: 45, height: 45, borderRadius: '50%', marginRight: 10}} source={{uri: avatarFour}} />
          <Text style={{fontSize: 24}}>Chat with Person {route.params.id}</Text>
        </View>
        <Pressable
          onPress={() => navigation.push('Chat', {id: parseInt(route.params.id, 10) + 1})}
        >
          <Text style={{color: 'blue', fontSize: 18, marginBottom: 10}}>Link to another chat</Text>
        </Pressable>
        <Pressable
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
        >
          <Text style={{color: 'blue', fontSize: 18, marginBottom: 10}}>Link to About</Text>
        </Pressable>
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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialState: null,
    };
  }

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      // From here we'll have a url and we need to build the initial state for the app
      // This is where things get tricky because if we have a report route then we need to parse the reportID and also make sure a LHN is the root view
      const pathname = new URL(url).pathname;
      const state = getStateFromPath(pathname, config);

      // If pathname is a chat then we need to push a left hand nav path
      if (pathname.startsWith('/r') || pathname.startsWith('/search') || pathname.startsWith('/settings')) {
        state.routes.unshift({name: 'LeftHandNav'});
      }

      // Since About is in a Settings stack we want the "up" button to go back to the Settings main page and so need to define this
      if (pathname === '/settings/about') {
        state.routes[1].state.routes.unshift({name: 'Settings'});
      }

      this.setState({initialState: state});
    });
  }

  render() {
    if (!this.state.initialState) {
      return null;
    }

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
            initialState={this.state.initialState}
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
}
