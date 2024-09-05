import { Image, ImageSourcePropType, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import Animated from 'react-native-reanimated'
import { COLORS, FONTS, SIZES } from '../assets/theme'

type Props = {
    label: string
    icon: ImageSourcePropType
    isFocused: boolean
    onPress: () => void;
    innerContainerStyle?: { // animations stoped
        backgroundColor: string;
    }
    outerContainerStyle?: { // animations stoped
        flex: number;
    }
}

const TabButton = ({ label, icon, isFocused, onPress, innerContainerStyle, outerContainerStyle }: Props) => {
    return (
        <TouchableWithoutFeedback
            onPress={onPress}
        >
            <Animated.View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' },
                // outerContainerStyle
            ]}>
                <Animated.View style={[{
                    flexDirection: 'row',
                    width: 35,
                    height: 35,
                    alignItems: 'center', justifyContent: 'center',
                    borderRadius: 60,
                    backgroundColor: isFocused ? COLORS.primary : COLORS.white
                },
                    // innerContainerStyle
                ]}>
                    <Image
                        source={icon}
                        style={{ width: 20, height: 20, tintColor: isFocused ? COLORS.white : COLORS.gray }}
                    />
                </Animated.View>
                <Text
                    numberOfLines={1}
                    style={[{
                        color: COLORS.gray
                    }, FONTS.h3]}
                >
                    {label}
                </Text>

            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

export default TabButton

const styles = StyleSheet.create({})