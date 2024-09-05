import { View, Text, Modal, TouchableWithoutFeedback, Image } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../../assets/theme';

type Props = {
    isVisible: boolean
    setIsVisible: (val: boolean) => void;
    imguri: string
}


const SurveyImgModal = ({ isVisible = true, setIsVisible, imguri }: Props) => {

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
                        padding: 10,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.white,
                        width: SIZES.width,
                        height: "50%"
                    }}>
                        <Image
                            source={{ uri: imguri }}
                            style={{ height: '100%', width: "100%" }}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default SurveyImgModal