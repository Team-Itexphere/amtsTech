import { Image, ImageSourcePropType, ImageStyle, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { SIZES, FONTS } from '../../assets/theme'

type Props = {
    containerStyle?: ViewStyle
    iconStyle?: ImageStyle
    labelStyle?: TextStyle
    onPress?: () => void
    icon: ImageSourcePropType // which can be a URI, a local image, or a number (for static resources)
    label: string
    disabled?: boolean
}

const IconLabelButton = ({ containerStyle, iconStyle, onPress, icon, labelStyle, label, disabled }: Props) => {
    return (
        <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...containerStyle }}
            onPress={onPress}
            disabled={disabled}
        >
            <Image source={icon} resizeMode='contain' style={{ width: 20, height: 20, ...iconStyle }} />
            <Text style={{ marginLeft: SIZES.base, ...FONTS.body3, ...labelStyle }}>{label}</Text>
        </TouchableOpacity>
    )
}

export default IconLabelButton

const styles = StyleSheet.create({})