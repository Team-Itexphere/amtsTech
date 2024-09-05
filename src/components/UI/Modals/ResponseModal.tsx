import { View, Text, Modal, ImageSourcePropType, ViewStyle, TextStyle, TouchableWithoutFeedback, ImageStyle, Image } from 'react-native'
import React from 'react'
import { COLORS, SIZES, FONTS } from '../../../assets/theme'
import TextButton from '../TextButton'

interface Action {
    contentContainerStyle?: ViewStyle
    disabled?: boolean
    label?: string
    labelStyle?: TextStyle
    onPress: () => void
}

type Props = {
    isVisible: boolean
    setIsVisible: (val: boolean) => void;
    title?: string;
    description?: string;
    icon?: ImageSourcePropType;
    actions?: Action[];
    iconStyle?: ImageStyle
}

const ResponseModal = ({
    isVisible,
    setIsVisible,
    title,
    description,
    icon,
    actions,
    iconStyle
}: Props) => {
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={isVisible}
        >
            <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
                <View style={{
                    flex: 1,
                    // width: SIZES.width,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.transparentBlack1
                }}>
                    <View style={{
                        padding: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.white,
                        width: "70%",
                        // height: "50%"
                    }}>
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: SIZES.base }}>
                            <Image source={icon} resizeMode='contain' style={{ width: 60, height: 60, ...iconStyle }} />
                            <Text style={{ marginTop: SIZES.base, ...FONTS.h2, textAlign: 'center' }}>{title}</Text>
                            <Text style={{ display: description !== '' ? 'flex' : 'none', ...FONTS.body3, textAlign: 'center', paddingVertical: SIZES.base }}>{description}</Text>
                        </View>
                        {actions && (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: SIZES.base * 2 }}>
                                {actions.map((action, index) => (
                                    <TextButton
                                        key={`${index}-actions`}
                                        label={action.label}
                                        contentContainerStyle={{ padding: SIZES.base, ...action.contentContainerStyle }}
                                        labelStyle={action.labelStyle}
                                        onPress={action.onPress}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default ResponseModal