import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const NoDataImage = () => {
    return (
        <View style={{ height: 300, aspectRatio: 1 }}>
            <LottieView style={{ flex: 1 }} source={require('../../assets/jsons/Animation-NoData.json')} autoPlay loop={false} />
        </View>
    )
}

export default NoDataImage