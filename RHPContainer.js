import React from 'react';
import { Pressable, View } from 'react-native';

const RHPContainer = ({navigation, children}) => {
    return (
        <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>
            <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', flex: 1, width: '100%', height: '100%' }} />
            </Pressable>
            {
                children
            }
        </View>
    )
}

export default RHPContainer;