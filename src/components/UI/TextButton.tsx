import React from 'react';
import {
    TouchableOpacity,
    Text,
    ViewStyle,
    TextStyle
} from 'react-native';
import { COLORS, FONTS } from '../../assets/theme';

interface Props {
    contentContainerStyle?: ViewStyle
    disabled?: boolean
    label?: string
    labelStyle?: TextStyle
    onPress: () => void
}

const TextButton = ({
    contentContainerStyle,
    disabled,
    label,
    labelStyle,
    onPress
}: Props) => {
    return (
        <TouchableOpacity
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary,
                ...contentContainerStyle
            }}
            disabled={disabled}
            onPress={() => onPress()}
        >
            <Text style={{ ...FONTS.h3, color: COLORS.secondary, ...labelStyle, }}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}


export default TextButton;


