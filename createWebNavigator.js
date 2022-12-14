import _ from 'underscore';
import * as React from 'react';
import {View, Pressable, Dimensions} from 'react-native';
import {useNavigationBuilder, createNavigatorFactory, StackRouter} from '@react-navigation/native';
import RHPContainer from './components/RHPContainer';

const isSmallScreenWidth = Dimensions.get('window').width <= 800;


function CustomStackNavigator(props) {
    const {navigation, state, descriptors, NavigationContent} = useNavigationBuilder(StackRouter, {
      children: props.children,
      screenOptions: props.screenOptions,
      initialRouteName: props.initialRouteName,
    });

    return (
        <NavigationContent>
            <View style={{flexDirection: 'row', flex: 1}}>
                {state.routes.map((route, i) => {
                    if (descriptors[route.key].options.isLHNVisible) {
                        return (
                            <View
                                key={route.key}
                                style={{maxWidth: 350, flex: 1, borderRightWidth: 1}}
                            >
                                {descriptors[route.key].render()}
                            </View>
                        )
                    }

                    if (i === descriptors[route.key].options.chatIndexToRender) {
                        return (
                            <View
                                key={route.key}
                                style={{flex: 1}}
                            >
                                {descriptors[route.key].render()}
                            </View>
                        )
                    }

                    if (descriptors[route.key].options.isRHPVisible) {
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
