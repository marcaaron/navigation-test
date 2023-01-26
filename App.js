import 'react-native-gesture-handler';
import _ from 'underscore';
import * as React from 'react';
import {NavigationContainer, DefaultTheme,  getStateFromPath, createNavigationContainerRef, useNavigationState } from '@react-navigation/native';
import {Text, View, Image, Pressable, Dimensions, Platform}  from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import createWebNavigator from './createWebNavigator';
import * as Linking from 'expo-linking';

const chevronStyle = {width: 30, height: 30, resizeMode: 'contain', marginRight: 10};
const chatTitleStyle = {fontSize: 18, fontWeight: 'bold'};
const titleStyle = {fontSize: 24, fontWeight: 'bold', flex: 1};

const config = {
  screens: {
    root: {
      initialRouteName: 'LeftHandNav',
      screens: {
        Chat: { 
          path: 'r/:id?', 
          parse: { id: (id) => parseInt(id) } 
        },
        LeftHandNav: '',
        SettingsStack: {
          path: 'settings',
          screens: {
            Settings: '',
            About: 'about',
          },
        },
        Search: 'search'
      },
    }
  }
};

const stripKeysFromNavigationState = ({key, stale, routeNames, routes, state, ...rest}) => {
  return {
    ...rest, 
    routes: routes && routes.map(stripKeysFromNavigationState),
    state: state && stripKeysFromNavigationState(state)
  }
}

// TODO: make this function work better or find another way!
const fixState = (state) => {
    // we don't want to add Chat route for small screens
    if (checkIsSmallScreen(Dimensions.get('window').width)) {
      return 
    }
    if (!_.find(state.routes[0].state, r => r.name === 'Chat')) {
      state.routes[0].state.routes.splice(1, 0, {name: 'Chat', params: {id: 1}});
    }
}

const linking = {
  prefixes: ['http://localhost', 'https://navigation-test-lime.vercel.app', Linking.createURL('/')],
  config,
  getStateFromPath(path, cfg) {
    const state = getStateFromPath(path, cfg);
    fixState(state)
    return state;
  }
};

const checkIsSmallScreen = (width) => width <= 800;

const useFocusedRouteParams = () => {
  const state = useNavigationState(state => state)
  return state.routes?.[state.index]?.params
}

function LeftHandNav({navigation}) {
  const focusedRouteParams = useFocusedRouteParams();
  return (
    <View style={{flex: 1}}>
      <LHNHeader navigation={navigation} />
      <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} disabled={focusedRouteParams?.id === 1} onPress={() => navigation.push('Chat', {id: 1})}>
        <View style={{borderRadius: 22.5, overflow: 'hidden', marginRight: 10}}>
          <Image style={{width: 45, height: 45}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/avatar_4.png'}} />
        </View>
        <Text style={chatTitleStyle}>Chat One</Text>
      </Pressable>
      <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} disabled={focusedRouteParams?.id === 2} onPress={() => navigation.push('Chat', {id: 2})}>
        <View style={{borderRadius: 22.5, overflow: 'hidden', marginRight: 10}}>
          <Image style={{width: 45, height: 45}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/avatar_5.png'}} />
        </View>
        <Text style={chatTitleStyle}>Chat Two</Text>
      </Pressable>
      <Pressable style={{flexDirection: 'row', margin: 10, alignItems: 'center'}} disabled={focusedRouteParams?.id === 3} onPress={() => navigation.push('Chat', {id: 3})}>
        <View style={{borderRadius: 22.5, overflow: 'hidden', marginRight: 10}}>
          <Image style={{width: 45, height: 45}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/avatar_3.png'}} />
        </View>
        <Text style={chatTitleStyle}>Chat Three</Text>
      </Pressable>
    </View>
  );
}

const navigationUp = (navigation, screenName) => {
  const state = navigation.getState()
  if (state.index > 0 && state.routes[state.index - 1].name === screenName) {
    navigation.pop()
  } else {
    navigation.replace(screenName)
  }
}

function AboutScreen({navigation}) {
  return (
    <View style={{margin: 10}}>
      <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Pressable onPress={() => navigationUp(navigation, 'Settings')}>
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
  );
}

function LHNHeader({navigation}) {
  return (
    <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 10}}>Chats</Text>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 10, marginTop: 10}}>
        <Pressable style={{marginRight: 20}} onPress={() => navigation.push('Search')}>
          <Image style={{width: 30, height: 30}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/search.png'}} />
        </Pressable>
        <Pressable onPress={() => navigation.push('SettingsStack')}>
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
  const isSmallScreen = React.useContext(IsSmallScreenContext);
  return (
    <View style={{margin: 10}}>
        <View style={{marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start'}}>
          {isSmallScreen && (
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
          onPress={() => navigation.push('SettingsStack', { screen: 'About' })}
        >
          <Text style={{color: 'blue', fontSize: 18, marginBottom: 10}}>Link to About</Text>
        </Pressable>
    </View>
  );
}

const navigationRef = createNavigationContainerRef()

const SettingsStackNavigator = ({ navigation }) => {
  return (
  <SettingsStack.Navigator
  >
    <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{
      headerShown: false,
      animationTypeForReplace: 'pop'
      }} />
    <SettingsStack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
  </SettingsStack.Navigator>
)};

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const IsSmallScreenContext = React.createContext();

const createMainStack = (Stack) => () => {
  return (
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
          options={{headerShown: false}}
          initialParams={{ id: 1 }} />
        <Stack.Group>
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SettingsStack"
            component={SettingsStackNavigator}
            options={{headerShown: false}}
          />
        </Stack.Group>
    </Stack.Navigator>
  )
}

const WebStack = createWebNavigator();
const NativeStack = createNativeStackNavigator();

const SettingsStack = createNativeStackNavigator();

const WebNavigator = createMainStack(WebStack);
const NativeNavigator= createMainStack(NativeStack);

const RootStack = createNativeStackNavigator();
 
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSmallScreen: checkIsSmallScreen(Dimensions.get('window').width),
      initialState: null,
    }
  }
  
  regenerateNavigationState() {
    const { routes, ...rest } = navigationRef.getRootState()
    // Modify navigation state so react-navigation will regenerate it with new keys.
    // See patches/@react-navigation+native+6.0.13.patch
    // const strippedState = stripKeysFromNavigationState({routes, ...rest}) 
    const strippedState = {routes: routes.map(stripKeysFromNavigationState), ...rest}
    navigationRef.resetRoot(strippedState)
  }
  
  handleResize(e) {
    const isSmallScreen = checkIsSmallScreen(e.window.width);
    if (isSmallScreen !== this.state.isSmallScreen) {
      this.regenerateNavigationState()
      this.setState({...this.state, isSmallScreen})        
    }
  }
  
  handleInitialState(url) {
    // we don't want to set initialState for web or if application is opened using deeplinks
    if (Platform.OS !== 'web' && url !== null) {
      return;
    }
    this.setState({...this.state, initialState: getStateFromPath('', config)})
  }

  componentDidMount() {
    this.handleResize = this.handleResize.bind(this);
    this.handleInitialState = this.handleInitialState.bind(this);
    Dimensions.addEventListener('change', this.handleResize)
    Linking.getInitialURL().then(this.handleInitialState)
  }

  render() {
    return (
      <IsSmallScreenContext.Provider value={this.state.isSmall}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          paddingTop: Constants.statusBarHeight,
          backgroundColor: '#ecf0f1',
          padding: 8,
        }}>
          <NavigationContainer
            ref={navigationRef}
            linking={linking}
            theme={navTheme}
            onStateChange={(state) => {
              console.log('STATE CHANGED: ', state);
            }}
            initialState={this.state.initialState}
          >
            <RootStack.Navigator screenOptions={{headerShown: false}}>
            {!this.state.isSmallScreen ? (
              <RootStack.Screen 
                name='root'
                component={WebNavigator} />
            ) : (
              <RootStack.Screen 
                name='root'
                component={NativeNavigator} />
            )}
            </RootStack.Navigator>
          </NavigationContainer>
        </View>
      </IsSmallScreenContext.Provider>
    );
  }
}
