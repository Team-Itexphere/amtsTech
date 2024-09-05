import { View, Text, StatusBar, Image, ImageSourcePropType, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { CheckBox, Header } from '../../components/UI'
import { COLORS, SIZES, FONTS } from '../../assets/theme'
import FormInput from '../../components/UI/FormInput'
import TextButton from '../../components/UI/TextButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { InvoiceGenerateRouteProp, NavigationProp, PaymentOptionRouteProp } from '../../navigation/navigationTypes'
import { useDispatch, useSelector } from 'react-redux'
import { postPaymentInfo, postPaymentReqBody } from '../../store/actions/survey/surveyAction'
import Loading from '../../components/UI/Loading'

import assetsPng from '../../assets/pngs'
import { RootState } from '../../store/store'

const { IconMO, IconMoney, IconCheque } = assetsPng;

type formDataType = {
    selectedCheckBox: 'Cash' | 'Check' | 'MO',
    number: string | null
}
enum PaymentMethod {
    Cash,
    Check,
    MoneyOrder
}

function paymentMethod({
    option,
    setFormData,
    isSelected,
    icon
}: {
    option: string,
    setFormData: () => void;
    isSelected: boolean,
    icon: ImageSourcePropType
}
) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SIZES.base, padding: SIZES.padding, backgroundColor: COLORS.primary20, borderRadius: SIZES.radius }}>
            <Image
                source={icon}
                style={{ width: 30, height: 30, }}
            />
            <Text style={{ ...FONTS.body3, marginLeft: SIZES.padding, flex: 1 }}>{option}</Text>
            <CheckBox
                isSelected={isSelected}
                onPress={setFormData}
            />
        </View>
    )
}

const PaymentOption = () => {
    const dispatch = useDispatch();
    const route = useRoute<PaymentOptionRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    // const { amount, descript, unique_id } = route.params;
    const { res_Amount, invoice, location } = useSelector((state: RootState) => state.routeReducer);

    const [formData, setFormData] = useState<formDataType>({
        selectedCheckBox: 'Cash',
        number: null
    })
    // const [isSuccess, setIsSuccess] = useState<{ invoice_link: string }>({ invoice_link: "" })
    const [isLoading, setIsLoarding] = useState<boolean>(false)

    const isDisabled = () => {
        if (formData.selectedCheckBox === 'Check') {
            return true
        } else if (formData.selectedCheckBox === 'MO') {
            return true
        } else {
            return false
        }
    }

    const submitData = async () => {
        if (!res_Amount || !location.list_id || !location.cus_id) return console.warn("res_Amount or list_id or cus_id -> null ");
        if ((formData.selectedCheckBox === 'Check' || formData.selectedCheckBox === 'MO') && !formData.number) return
        setIsLoarding(true)

        const form: postPaymentReqBody = {
            list_id: location.list_id,
            cus_id: location.cus_id,
            pay_opt: formData.selectedCheckBox,
            check_no: formData.selectedCheckBox === 'Check' ? formData.number : null,
            mo_no: formData.selectedCheckBox === 'MO' ? formData.number : null,
            // descript: invoice.descript,
            amount: parseInt(res_Amount),
            items: invoice.items
        }

        const postData = await postPaymentInfo(dispatch, form);
        setIsLoarding(false)

        // if (postData) setIsSuccess({ invoice_link: postData.invoice_link })
        if (postData) navigation.navigate('PdfReader', { invoice_link: postData.invoice_link })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
            }}
        >
            <StatusBar backgroundColor={COLORS.white} />

            <View style={{ flex: 1 / 5 }} />
            <View style={{
                flex: 1,
                backgroundColor: COLORS.white,
                padding: SIZES.padding
            }}>
                <ScrollView>
                    <Text style={{ ...FONTS.h2, marginBottom: SIZES.base * 2 }}>Payment Option</Text>
                    {paymentMethod({
                        icon: IconMoney,
                        isSelected: Boolean(formData.selectedCheckBox === 'Cash'),
                        option: 'Cash',
                        setFormData: () => setFormData({ number: null, selectedCheckBox: "Cash" })
                    })}

                    {paymentMethod({
                        icon: IconCheque,
                        isSelected: Boolean(formData.selectedCheckBox === 'Check'),
                        option: 'Check',
                        setFormData: () => setFormData({ number: null, selectedCheckBox: "Check" })
                    })}
                    {paymentMethod({
                        icon: IconMO,
                        isSelected: Boolean(formData.selectedCheckBox === 'MO'),
                        option: 'MO',
                        setFormData: () => setFormData({ number: null, selectedCheckBox: "MO" })
                    })}

                    <View style={{ marginVertical: SIZES.base * 2, width: '100%', display: !isDisabled() ? 'none' : 'flex' }}>
                        <Text style={{ marginBottom: 2, marginLeft: 2, ...FONTS.body4 }}>{formData.selectedCheckBox === 'MO' ? ' MO number' : 'Check Number'}</Text>
                        <FormInput
                            containerStyle={{
                                borderRadius: SIZES.radius,

                            }}
                            placeholder={formData.selectedCheckBox === 'MO' ? 'Enter MO #' : 'Enter Check #'}
                            value={formData.number || ''}
                            onChange={(text: string) => setFormData({ ...formData, number: text })}
                            editable={isDisabled()}
                        // keyboardType="numeric"
                        />
                    </View>
                </ScrollView>
                <View style={{ flex: 1 }} />
                <View style={{ width: '100%', marginTop: 20 }}>
                    {/* {isSuccess.invoice_link ?
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PdfReader', { invoice_link: isSuccess.invoice_link })}
                            style={{ padding: SIZES.padding, borderRadius: SIZES.radius, backgroundColor: COLORS.transparentBlack1 }}>
                            <Text style={{ ...FONTS.h3, color: COLORS.green, textAlign: 'center' }}>View Invoice</Text>
                        </TouchableOpacity>
                        :
                        <TextButton
                            label={"View Invoice"}
                            contentContainerStyle={{
                                height: 55,
                                borderRadius: SIZES.radius,
                                backgroundColor: COLORS.primary
                            }}
                            labelStyle={{
                                ...FONTS.h3,
                                color: COLORS.white
                            }}
                            onPress={() => submitData()}
                            disabled={isLoading}
                        />
                    } */}
                    <TextButton
                        label={"View Invoice"}
                        contentContainerStyle={{
                            height: 55,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.primary
                        }}
                        labelStyle={{
                            ...FONTS.h3,
                            color: COLORS.white
                        }}
                        onPress={() => submitData()}
                        disabled={isLoading}
                    />
                </View>
                {isLoading && <Loading />}
            </View>
        </KeyboardAvoidingView>
    )
}

export default PaymentOption