import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    ViewStyle
} from 'react-native';
import { SIZES, COLORS } from '../../assets/theme';

import assetsPng from '../../assets/pngs'
const { IconCheckmark } = assetsPng

type CheckBoxType = {
    containerStyle?: ViewStyle
    isSelected: boolean
    onPress: () => void
}

const CheckBox = ({ containerStyle, isSelected, onPress }: CheckBoxType) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                ...containerStyle
            }}
            onPress={onPress}
        >
            <View
                style={{
                    width: 25,
                    height: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: SIZES.base,
                    borderWidth: 3,
                    borderColor: isSelected ? COLORS.primary : COLORS.gray,
                    backgroundColor: isSelected ? COLORS.primary : COLORS.transparent
                }}
            >
                {isSelected &&
                    <Image
                        source={IconCheckmark}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: COLORS.white   // This can change img color.
                        }}
                    />
                }
            </View>
        </TouchableOpacity>
    )
}


export default CheckBox
