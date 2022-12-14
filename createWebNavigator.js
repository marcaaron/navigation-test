import _ from 'underscore';
import * as React from 'react';
import {View, Dimensions} from 'react-native';
import {useNavigationBuilder, createNavigatorFactory, StackRouter} from '@react-navigation/native';
import RHPContainer from './components/RHPContainer';

const isSmallScreenWidth = Dimensions.get('window').width <= 800;


function CustomStackNavigator(props) {
    const {navigation, state, descriptors, NavigationContent} = useNavigationBuilder(StackRouter, {
      children: props.children,
      screenOptions: props.screenOptions,
      initialRouteName: props.initialRouteName,
    });
    const isLHNVisible = (state.index === 0 && state.routes.length === 1) || !isSmallScreenWidth;
    const lastChatIndex = _.findLastIndex(state.routes, {name: 'Chat'});
    const lastRHPIndex = _.findLastIndex(state.routes, (route) => route.name !== 'Chat' && route.name !== 'LeftHandNav');
    const isRHPOnTopOfStack = lastRHPIndex === state.index;
    return (
        <NavigationContent>
            <View style={{flexDirection: 'row', flex: 1}}>
                {state.routes.map((route, i) => {
                    if (isLHNVisible && i === 0) {
                        return (
                            <View
                                key={route.key}
                                style={{maxWidth: !isSmallScreenWidth ? 350 : Dimensions.get('window').width, flex: 1, borderRightWidth: !isSmallScreenWidth ? 1 : 0}}
                            >
                                {descriptors[route.key].render()}
                            </View>
                        )
                    }

                    if (i === lastChatIndex) {
                        return (
                            <View
                                key={route.key}
                                style={{flex: 1}}
                            >
                                {descriptors[route.key].render()}
                            </View>
                        )
                    }

                    if (isRHPOnTopOfStack && i === state.routes.length - 1) {
                        return (
                            <View
                                key={route.key}
                                style={{width: '100%', height: '100%', position: 'absolute'}}
                            >
                                <RHPContainer navigation={navigation} contentStyle={{width: 375}}>
                                        {descriptors[route.key].render()}
                                </RHPContainer>
                            </View>
                        );
                    }
                    return null;
                })}
            </View>
        </NavigationContent>
    );
}

export default createNavigatorFactory(CustomStackNavigator);
