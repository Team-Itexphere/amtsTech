import { View, Text, ActivityIndicator, ViewStyle } from 'react-native'
import React from 'react'
import { COLORS } from '../../assets/theme'
import LottieView from 'lottie-react-native';

type Props = {
    contentContainerStyles?: ViewStyle
    LoaderColor?: string
}

const Loading = ({
    LoaderColor = COLORS.primary,
    contentContainerStyles
}: Props) => {
    return (
        <View style={{ position: 'absolute', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', backgroundColor: COLORS.transparent, ...contentContainerStyles }}>
            {/* <ActivityIndicator color={LoaderColor} size={'large'} /> */}
            <View style={{ height: 90, aspectRatio: 1 }}>
                <LottieView style={{ flex: 1 }} source={require('../../assets/jsons/Animation-Loading.json')} autoPlay loop />
            </View>

        </View>
    )
}

export default Loading