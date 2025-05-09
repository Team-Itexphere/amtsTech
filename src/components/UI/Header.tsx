import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { FONTS, SIZES } from '../../assets/theme'
import assetsSvg from '../../assets/svg'
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigation/navigationTypes';

const { IconBack } = assetsSvg;

type Props = {
    containerStyles: StyleProp<ViewStyle>
    title: any
    leftComponent?: ReactNode
    rightComponent?: ReactNode,
    isTextOnly?: boolean
}

const Header = ({ containerStyles, title, leftComponent, rightComponent, isTextOnly = false }: Props) => {
    const navigation = useNavigation<NavigationProp>();

    if (isTextOnly) return (
        <View style={[{}, containerStyles]}>
            <Text style={[{ textAlign: 'center' }, FONTS.h3]}>{title}</Text>
        </View>
    )
    return (
        <View style={[{ flexDirection: 'row', marginTop: SIZES.base * 2, marginBottom: SIZES.base }, containerStyles]}>
            {/* Left */}
            {leftComponent ? <TouchableOpacity style={{ width: SIZES.body1 * 3 }} onPress={() => navigation.goBack()}>
                <IconBack width={25} height={25} />
            </TouchableOpacity> : <View style={{ width: SIZES.body1 * 3 }}></View>
            }

            {/* Title */}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[{ textAlign: 'center' }, FONTS.h3]}>{title}</Text>
            </View>


            {/* Right */}
            <View style={{ width: SIZES.body1 * 3 }}>
                {rightComponent}
            </View>

        </View>
    )
}

export default Header

const styles = StyleSheet.create({})