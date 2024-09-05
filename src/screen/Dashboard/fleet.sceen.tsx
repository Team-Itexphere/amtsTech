import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, FONTS } from '../../assets/theme'
import FormInput from '../../components/UI/FormInput'
import TextButton from '../../components/UI/TextButton'
import { useDispatch } from 'react-redux'
import { submitFleet } from '../../store/actions/fleet/fleetAction'

type Props = {}

const FleetScreen = (props: Props) => {
    const dispatch: any = useDispatch();
    const [formData, setFormData] = useState({
        start_millage: '',
        stop_millage: ''
    })

    const formSubmit = () => {
        dispatch(submitFleet(formData.start_millage, formData.stop_millage));
    }

    return (
        <KeyboardAvoidingView behavior='height' style={{ flex: 1, backgroundColor: COLORS.white, padding: SIZES.padding }}>
            <View>
                {/* Email */}
                <FormInput
                    containerStyle={{
                        borderRadius: SIZES.radius,
                        marginBottom: SIZES.base
                        // backgroundColor: COLORS.error,
                    }}
                    // inputContainerStyle={}
                    placeholder="Start Maillage"
                    value={formData.start_millage}
                    onChange={(text) => setFormData({ ...formData, start_millage: text })}
                />
                <FormInput
                    containerStyle={{
                        borderRadius: SIZES.radius,
                        marginBottom: SIZES.base
                        // backgroundColor: COLORS.error,
                    }}
                    // inputContainerStyle={}
                    placeholder="Stop Maillage"
                    value={formData.stop_millage}
                    onChange={(text) => setFormData({ ...formData, stop_millage: text })}
                />

                <View style={{}}>
                    <TextButton
                        label="Submit"
                        contentContainerStyle={{
                            height: 55,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.primary
                        }}
                        labelStyle={{
                            ...FONTS.h3,
                            color: COLORS.white
                        }}
                        onPress={() => formSubmit()}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default FleetScreen

const styles = StyleSheet.create({})