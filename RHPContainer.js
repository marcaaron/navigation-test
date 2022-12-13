import React from 'react';
import { Pressable, View, Dimensions } from 'react-native';
const isSmallScreenWidth = Dimensions.get('window').width <= 800;

const RHPContainer = ({ navigation, children, contentStyle }) => {
    return (
        <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>
            {!isSmallScreenWidth && <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', flex: 1, width: '100%', height: '100%' }} />
            </Pressable>
            }
            <View style={{...contentStyle}}>
            {
                children
            }
            </View>
        </View>
    )
}

export default RHPContainer;