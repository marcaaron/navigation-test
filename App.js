import 'react-native-gesture-handler';
import _ from 'underscore';
import * as React from 'react';
import {NavigationContainer, DefaultTheme,  getStateFromPath, createNavigationContainerRef, useNavigationState } from '@react-navigation/native';
import {Text, View, Image, Pressable, Dimensions, Platform}  from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import createWebNavigator from './createWebNavigator';
import * as Linking from 'expo-linking';
import * as ScreenOrientation from 'expo-screen-orientation';
import { CardStyleInterpolators } from '@react-navigation/stack';


const chevronStyle = {width: 30, height: 30, resizeMode: 'contain', marginRight: 10};
const chatTitleStyle = {fontSize: 18, fontWeight: 'bold'};
const titleStyle = {fontSize: 24, fontWeight: 'bold', flex: 1};

const config = {
  initialRouteName: 'LeftHandNav',
  screens: {
    Chat: { 
      path: 'r/:id?', 
      parse: { id: (id) => parseInt(id) } 
    },
    LeftHandNav: '',
    RightHandStack: {
      screens: {
        SettingsStack: {
          path: 'settings',
          screens: {
            Settings: '',
            About: 'about',
          },
        },
        Search: 'search'
      }
    }
  },
};

// NativeStackNavigator doesn't have animations on web
const createPlatformSpecificStackNavigator = () => Platform.OS == 'web' ? createStackNavigator() : createNativeStackNavigator()

const getPlatformSpecificScreenAnimations = () => {
  if (Platform.OS === "web") {
    return {
      // iOS like animations 
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      // by default this value is false on web
      animationEnabled: true,
    };
  } else if (Platform.OS === "android") {
    return {
      // We have less possibilities on NativeStack but slide_from_right work fine
      animation: 'slide_from_right'
    };
  }
  // Animations for iOS are good enought by default 
  return {};
};


// TODO: make this function work better or find another way!
const fixState = (state) => {
    // we don't want to add Chat route for small screens
    if (checkIsSmallScreen(Dimensions.get('window').width)) {
      return state 
    }
    if (!_.find(state.routes, r => r.name === 'Chat')) {
      state.routes.splice(1, 0, {name: 'Chat', params: {id: 1}});
    }
    return state;
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
const checkIsPortrait = (screenOrientation) => screenOrientation == 1;

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

const navigateUp = (navigation, screenName) => {
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
        <Pressable onPress={() => navigateUp(navigation, 'Settings')}>
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
        <Pressable style={{marginRight: 20}} onPress={() => navigation.push('RightHandStack', { screen: 'Search' })}>
          <Image style={{width: 30, height: 30}} source={{uri: 'https://raw.githubusercontent.com/marcaaron/navigation-test/main/search.png'}} />
        </Pressable>
        <Pressable onPress={() => navigation.push('RightHandStack', { screen :'SettingsStack' })}>
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
          onPress={() => navigation.push('RightHandStack', { screen: 'SettingsStack', params: {screen: 'About'} })}
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
    screenOptions={{
      headerShown: false,
      ...getPlatformSpecificScreenAnimations()
    }}
  >
    <SettingsStack.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{
        animationTypeForReplace: 'pop',
    }} />
    <SettingsStack.Screen name="About" component={AboutScreen} />
  </SettingsStack.Navigator>
)};

const RightHandStackNavigator = ({ navigation }) => {
  return (
    <RightHandStack.Navigator
      screenOptions={{
        ...getPlatformSpecificScreenAnimations(),
        headerShown: false,
      }}
    >
      <RightHandStack.Screen
        name="Search"
        component={SearchScreen}
      />
      <RightHandStack.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
      />
    </RightHandStack.Navigator>
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
      screenOptions={{headerShown: false}}
    >
        <Stack.Screen
          name="LeftHandNav"
          component={LeftHandNav}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          initialParams={{ id: 1 }} />
        <Stack.Screen
          name="RightHandStack"
          component={RightHandStackNavigator}
        />
    </Stack.Navigator>
  )
}

const WebStack = createWebNavigator();
const NativeStack = createNativeStackNavigator();

const RightHandStack = createPlatformSpecificStackNavigator();
const SettingsStack = createPlatformSpecificStackNavigator();

const WebNavigator = createMainStack(WebStack);
const NativeNavigator= createMainStack(NativeStack);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSmallScreen: checkIsSmallScreen(Dimensions.get('window').width),
      navigationState: null,
      isPortrait: null,
    }
  }
  
  handleResize(e) {
    const isSmallScreen = checkIsSmallScreen(e.window.width);
    if (isSmallScreen !== this.state.isSmallScreen) {
      this.setState({isSmallScreen})        
    }
  }

  handleRotate(e) {
    const isPortrait = checkIsPortrait(e.orientationInfo.orientation)
    if (isPortrait !== this.state.isPortrait) {
      this.setState({isPortrait})        
    }
  }
  
  handleInitialState(url) {
    // we don't want to set initialState for mobile or if application is opened using deeplinks
    if (Platform.OS !== 'web' && url !== null) {
      return;
    }
    this.setState({navigationState: getStateFromPath('', config)})
  }

  componentDidMount() {
    this.handleResize = this.handleResize.bind(this);
    this.handleRotate= this.handleRotate.bind(this);
    this.handleInitialState = this.handleInitialState.bind(this);
    this.getInitialState= this.getInitialState.bind(this);
    Dimensions.addEventListener('change', this.handleResize)
    ScreenOrientation.addOrientationChangeListener(this.handleRotate)
    ScreenOrientation.getOrientationAsync().then((e) => {this.setState({isPortrait: checkIsPortrait(e)})})
    Linking.getInitialURL().then(this.handleInitialState)
  }
  
  getInitialState() {
    if (this.state.navigationState) {
      return fixState(this.state.navigationState)
    }
    return this.state.navigationState
  }

  render() {
    const isNarrowLayout = Platform.OS == 'web' ? this.state.isSmallScreen : this.state.isPortrait;
    return (
      <IsSmallScreenContext.Provider value={isNarrowLayout}>
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
            key={isNarrowLayout ? 'native' : 'web'}
            onStateChange={(state) => {
              console.log('STATE CHANGED: ', state);
              this.setState({navigationState: state})
            }}
            initialState={this.getInitialState()}
          >
            {isNarrowLayout ? (
              <NativeNavigator />
            ) : (
              <WebNavigator />
            )}
          </NavigationContainer>
        </View>
      </IsSmallScreenContext.Provider>
    );
  }
}
