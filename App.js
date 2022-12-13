import 'react-native-gesture-handler';
import _ from 'underscore';
import * as React from 'react';
import {NavigationContainer, DefaultTheme, CommonActions, getStateFromPath, useFocusEffect} from '@react-navigation/native';
import {Text, View, Image, Pressable, Linking, Platform, BackHandler, Dimensions} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import createWebNavigator from './createWebNavigator';

const chevronStyle = {width: 30, height: 30, resizeMode: 'contain', marginRight: 10};
const chatTitleStyle = {fontSize: 18, fontWeight: 'bold'};
const titleStyle = {fontSize: 24, fontWeight: 'bold', flex: 1};

const config = {
  initialRouteName: '',
  screens: {
    Chat: 'r/:id?',
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
  prefixes: ['http://localhost', 'https://navigation-test-lime.vercel.app'],
  config,
  getStateFromPath(path, cfg) {
    const state = getStateFromPath(path, cfg);
    console.log('Get state from path: ', state);

    // We need to add the LHN if it does not exist
    if (!_.find(state.routes, r => r.name === 'LeftHandNav')) {
      state.routes.splice(0, 0, {name: 'LeftHandNav'});
    }

    if (!_.find(state.routes, r => r.name === 'Chat')) {
      state.routes.splice(1, 0, {name: 'Chat', params: {id: 1}});
    }

    return state;
  }
};

const isSmallScreenWidth = Dimensions.get('window').width <= 800;

/**
 * By default the back handler will pop. We want it to go "back" instead of "up". All screens that are inside a nested navigator
 * except the root screen of that nested navigator will need to implement this.
 */
function WithCustomBackBehavior(props) {
  useFocusEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      props.navigation.popToTop();
    });

    return () => subscription.remove();
  });

  return props.children;
}

function LeftHandNav({navigation}) {
  return (
    <View style={{flex: 1}}>
      <LHNHeader navigation={navigation} />
      <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} onPress={() => navigation.push('Chat', {id: 1})}>
        <View style={{borderRadius: 22.5, overflow: 'hidden', marginRight: 10}}>
          <Image style={{width: 45, height: 45}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/avatar_4.png'}} />
        </View>
        <Text style={chatTitleStyle}>Chat One</Text>
      </Pressable>
      <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} onPress={() => navigation.push('Chat', {id: 2})}>
        <View style={{borderRadius: 22.5, overflow: 'hidden', marginRight: 10}}>
          <Image style={{width: 45, height: 45}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/avatar_5.png'}} />
        </View>
        <Text style={chatTitleStyle}>Chat Two</Text>
      </Pressable>
      <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} onPress={() => navigation.push('Chat', {id: 3})}>
        <View style={{borderRadius: 22.5, overflow: 'hidden', marginRight: 10}}>
          <Image style={{width: 45, height: 45}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/avatar_3.png'}} />
        </View>
        <Text style={chatTitleStyle}>Chat Three</Text>
      </Pressable>
    </View>
  );
}

function AboutScreen({navigation}) {
  return (
    <WithCustomBackBehavior navigation={navigation}>
      <View style={{margin: 10}}>
        <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Pressable onPress={() => navigation.pop()}>
            <Image style={chevronStyle} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/chevron.png'}} />
          </Pressable>
          <Text style={titleStyle}>About</Text>
        </View>
        <Text style={{fontSize: 20, marginBottom: 20}}>Welcome to my test app</Text>
        <Pressable
            onPress={() => navigation.push('Chat', {id: 1})}
          >
            <Text style={{color: 'blue', fontSize: 18, marginBottom: 10}}>Link to another chat</Text>
        </Pressable>
        <Pressable
            onPress={() => navigation.push('Search')}
          >
            <Text style={{color: 'blue', fontSize: 18, marginBottom: 10}}>Link to Search page</Text>
        </Pressable>
      </View>
    </WithCustomBackBehavior>
  );
}

function LHNHeader(props) {
  return (
    <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 10}}>Chats</Text>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 10, marginTop: 10}}>
        <Pressable style={{marginRight: 20}} onPress={() => props.navigation.push('Search')}>
          <Image style={{width: 30, height: 30}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/search.png'}} />
        </Pressable>
        <Pressable onPress={() => props.navigation.push('SettingsStack')}>
          <View style={{borderRadius: 22.5, overflow: 'hidden'}}>
            <Image style={{width: 45, height: 45}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/avatar_3.png'}} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function SearchScreen({navigation}) {
  return (
      <View style={{margin: 10}}>
        <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image style={chevronStyle} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/chevron.png'}} />
          </Pressable>
          <Text style={titleStyle}>Search</Text>
        </View>
        <Text style={{marginBottom: 20}}>Search Results: </Text>
        <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} onPress={() => navigation.push('Chat', {id: 1})}>
          <View style={{borderRadius: 22.5, overflow: 'hidden', marginRight: 10}}>
            <Image style={{width: 45, height: 45}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/avatar_4.png'}} />
          </View>
          <Text style={chatTitleStyle}>Chat One</Text>
        </Pressable>
        <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} onPress={() => navigation.push('Chat', {id: 2})}>
          <View style={{borderRadius: 22.5, overflow: 'hidden', marginRight: 10}}>
            <Image style={{width: 45, height: 45}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/avatar_5.png'}} />
          </View>
          <Text style={chatTitleStyle}>Chat Two</Text>
        </Pressable>
      </View>
  );
}

function SettingsScreen({navigation}) {
  return (
    <View style={{margin: 10}}>
      <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image style={chevronStyle} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/chevron.png'}} />
        </Pressable>
        <Text style={titleStyle}>Settings</Text>
      </View>
      <Pressable style={{flexDirection: 'row', marginTop: 10}} onPress={() => navigation.push('About')}>
        <Text style={{fontSize: 24, flex: 1, paddingLeft: 20}}>About</Text>
        <Image style={chevronStyle} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/chevron-right.png'}} />
      </Pressable>
    </View>
  );
}

function ChatScreen({route, navigation}) {
  return (
    <View style={{margin: 10}}>
        <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start'}}>
          {isSmallScreenWidth && (
              <Pressable onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                  return;
                }

                console.error('On the chat screen but nowhere to go back to. We should always at least have the LHN to go back to');
            }}>
              <Image style={chevronStyle} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/chevron.png'}} />
            </Pressable>
          )}
          <View style={{borderRadius: 22.5, overflow: 'hidden', marginRight: 10}}>
            <Image style={{width: 45, height: 45}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/avatar_4.png'}} />
          </View>
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

const Stack = createWebNavigator();
const SettingsStack = createNativeStackNavigator();

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator
    initialRouteName="Settings"
    screenOptions={{headerShown: false}}
  >
    <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    <SettingsStack.Screen name="About" component={AboutScreen} />
  </SettingsStack.Navigator>
);

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
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
      if (Platform.OS !== 'web') {
        this.setState({initialState: getStateFromPath('', config)});
        return;
      }

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

      // Add a report when we are on large format web and a chat does not exist in the route
      if (!isSmallScreenWidth && !state.routes.find(route => route.name === 'Chat')) {
          state.routes.splice(1, 0, {name: 'Chat', params: {id: 1}});
      }

      this.setState({initialState: state});
    });
  }
  render() {
    const extraStyle = {};
    if (isSmallScreenWidth) {
      extraStyle['LeftHandNav'] = {
        maxWidth: Dimensions.get('window').width,
        borderRightWidth: 0
      }
      extraStyle['Chat'] = {
        maxWidth: Dimensions.get('window').width
      }
      extraStyle['Search'] = {
        
      },
      extraStyle['Settings'] = {
        
      }
      extraStyle['About'] = {
        
      }
    } else {
      extraStyle['LeftHandNav'] = {
        maxWidth: 350,
        borderRightWidth: 1
      }
      extraStyle['Chat'] = {
        
      }
      extraStyle['Search'] = {
        
      },
      extraStyle['Settings'] = {
        
      }
      extraStyle['About'] = {
        
      }
    }
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
              screenOptions={{headersShown: false, extraStyle, }}
            >
                <Stack.Screen
                  name="LeftHandNav"
                  component={LeftHandNav}
                />
                <Stack.Screen
                  name="Chat"
                  component={ChatScreen}
                  initialParams={{ id: 1 }} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="SettingsStack" component={SettingsStackNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
    );
  }
}
