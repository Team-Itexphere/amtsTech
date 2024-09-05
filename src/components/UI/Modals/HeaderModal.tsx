import { Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { COLORS, FONTS, SIZES } from '../../../assets/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import assetsPng from '../../../assets/pngs';

const { IconSignOut } = assetsPng

type Props = {
    isVisible: boolean
    setIsVisible: (val: boolean) => void;
}

const HeaderModal = ({ isVisible = true, setIsVisible }: Props) => {

    const user = useSelector((state: RootState) => state.authReducer.user);

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={isVisible}
        >
            <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
                <View style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    // justifyContent: 'center',
                    backgroundColor: COLORS.transparentBlack1
                }}>
                    <View style={{
                        padding: 10,
                        marginTop: 50, marginRight: 20,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.white,
                    }}>
                        {/* <Text>Hi, {user?.name}</Text>
                        <View style={{ borderBottomColor: COLORS.darkGray2, borderBottomWidth: 1, marginTop: 10 }} /> */}
                        <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <Image
                                source={IconSignOut}
                                style={{ width: 20, height: 20, tintColor: COLORS.gray, marginRight: 10 }}
                            />
                            <Text style={[FONTS.body4]}>Log Out</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableWithoutFeedback>

        </Modal>
    )
}

export default HeaderModal

const styles = StyleSheet.create({})