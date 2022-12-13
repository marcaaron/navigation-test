import _ from 'underscore';
import * as React from 'react';
import {View, Pressable, Dimensions} from 'react-native';
import {useNavigationBuilder, createNavigatorFactory, StackRouter} from '@react-navigation/native';

const isSmallScreenWidth = Dimensions.get('window').width <= 800;


function CustomStackNavigator(props) {
    const {navigation, state, descriptors, NavigationContent} = useNavigationBuilder(StackRouter, {
      children: props.children,
      screenOptions: props.screenOptions,
      initialRouteName: props.initialRouteName,
    });

    const lastChatIndex = _.findLastIndex(state.routes, {name: 'Chat'});
    const lastRHPIndex = _.findLastIndex(state.routes, (route) => route.name !== 'Chat' && route.name !== 'LeftHandNav');
    const isRHPOnTopOfStack = lastRHPIndex === state.index;
    return (
        <NavigationContent>
            <View style={{flexDirection: 'row', flex: 1}}>
                {state.routes.map((route, i) => {
                    if (route.name === 'LeftHandNav' && (i === state.index || !isSmallScreenWidth)) {
                        return (
                            <View
                                key={route.key}
                                style={{...descriptors[route.key].options.extraStyle[route.name], flex: 1, }}
                            >
                                {descriptors[route.key].render()}
                            </View>
                        )
                    }

                    // Only show the top-most chat and hide any others
                    if (route.name === 'Chat' && i !== lastChatIndex) {
                        return null;
                    }

                    if (route.name === 'Chat') {
                        return (
                            <View
                                key={route.key}
                                style={{flex: 1, ...descriptors[route.key].options.extraStyle[route.name],}}
                            >
                                {descriptors[route.key].render()}
                            </View>
                        )
                    }

                    if (route.name !== 'Chat' && route.name !== 'LeftHandNav' && i !== lastRHPIndex) {
                        return null;
                    }

                    if (!isRHPOnTopOfStack) {
                        return null;
                    }

                    return (
                        <View
                            key={route.key}
                            style={{width: '100%', height: '100%', position: 'absolute'}}
                        >
                            <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
                                <Pressable style={{flex: 1}} onPress={() => navigation.goBack()}>
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', flex: 1, width: '100%', height: '100%'}} />
                                </Pressable>
                                <View style={{width: 375}}>
                                    {descriptors[route.key].render()}
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </NavigationContent>
    );
}

export default createNavigatorFactory(CustomStackNavigator);
