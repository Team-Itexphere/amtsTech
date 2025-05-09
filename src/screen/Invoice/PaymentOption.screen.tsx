import { View, Text, StatusBar, Image, ImageSourcePropType, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { CheckBox, Header } from '../../components/UI'
import { COLORS, SIZES, FONTS } from '../../assets/theme'
import FormInput from '../../components/UI/FormInput'
import TextButton from '../../components/UI/TextButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { InvoiceGenerateRouteProp, NavigationProp, PaymentOptionRouteProp } from '../../navigation/navigationTypes'
import { useDispatch, useSelector } from 'react-redux'
import { postInvoice_from_ServiceCall_ReqPaymentBody, postInvoiceInfo_From_ServiceCall, postPaymentInfo, postPaymentReqBody } from '../../store/actions/survey/surveyAction'
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

    const { inv_id } = route.params;
    const { res_Amount, invoice, location,
        serviceCall: { source, customer_id }
    } = useSelector((state: RootState) => state.routeReducer);

    const [formData, setFormData] = useState<formDataType>({
        selectedCheckBox: 'Cash',
        number: null
    })
    // const [isSuccess, setIsSuccess] = useState<{ invoice_link: string }>({ invoice_link: "" })
    const [isLoading, setIsLoarding] = useState<boolean>(false)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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
        setIsLoarding(true)
        if ((formData.selectedCheckBox === 'Check' || formData.selectedCheckBox === 'MO') && !formData.number) return

        if (source.includes("Service Call")) {
            const form: postInvoice_from_ServiceCall_ReqPaymentBody = {
                check_no: formData.selectedCheckBox === 'Check' ? formData.number : null,
                mo_no: formData.selectedCheckBox === 'MO' ? formData.number : null,
                pay_opt: formData.selectedCheckBox,
                customer_id: customer_id!,
                items: invoice.items,
                inv_id: inv_id
            }

            const postData = await postInvoiceInfo_From_ServiceCall(dispatch, form);
            setIsLoarding(false)
            if (postData) navigation.navigate('PdfReader', { invoice_link: postData.invoice_link, istools: true, inv_id: postData.id, payOpt: postData.has_sign })

        } else {
            if ((!res_Amount || !location.list_id || !location.cus_id) && !inv_id) return console.warn("res_Amount or list_id or cus_id -> null ");
            // const form: postPaymentReqBody = {
            //     list_id: location.list_id,
            //     cus_id: location.cus_id,
            //     pay_opt: formData.selectedCheckBox,
            //     check_no: formData.selectedCheckBox === 'Check' ? formData.number : null,
            //     mo_no: formData.selectedCheckBox === 'MO' ? formData.number : null,
            //     // descript: invoice.descript,
            //     amount: parseInt(res_Amount),
            //     items: invoice.items,
            //     addi_comments: invoice.comment,
            //     service: invoice.service,
            //     inv_id: inv_id
            // }

            // const postData = await postPaymentInfo(dispatch, form);

            const form: postInvoice_from_ServiceCall_ReqPaymentBody = {
                check_no: formData.selectedCheckBox === 'Check' ? formData.number : null,
                mo_no: formData.selectedCheckBox === 'MO' ? formData.number : null,
                pay_opt: formData.selectedCheckBox,
                customer_id: customer_id!,
                items: invoice.items,
                inv_id: inv_id
            }
            
            const postData = await postInvoiceInfo_From_ServiceCall(dispatch, form);
            setIsLoarding(false)

            // if (postData) setIsSuccess({ invoice_link: postData.invoice_link })
            if (postData) navigation.navigate('PdfReader', { invoice_link: postData.invoice_link, istools: true, inv_id: postData.id, payOpt: postData.has_sign })
        }
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
                        label={"Pay Invoice"}
                        contentContainerStyle={{
                            height: 55,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.primary
                        }}
                        labelStyle={{
                            ...FONTS.h3,
                            color: COLORS.white
                        }}
                        onPress={() => setIsModalVisible(true)}
                        disabled={isLoading}
                    />
                </View>
                {isLoading && <Loading />}
            </View>

            {/* Modal for status change confirmation */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            Please confirm that you received the payment?
                        </Text>
                        <View style={{ marginVertical: SIZES.base * 2, width: '100%', display: !isDisabled() ? 'none' : 'flex' }}>
                            <Text style={{ marginBottom: 2, textAlign: 'center', ...FONTS.body4 }}>{formData.selectedCheckBox === 'MO' ? ' MO number' : 'Check Number'}</Text>
                            <FormInput
                                containerStyle={{
                                    borderRadius: SIZES.radius,
                                }}
                                inputStyle={{
                                    textAlign: 'center',
                                }}
                                placeholder={formData.selectedCheckBox === 'MO' ? 'Enter MO #' : 'Enter Check #'}
                                value={formData.number || ''}
                                onChange={(text: string) => setFormData({ ...formData, number: text })}
                                editable={isDisabled()}
                            // keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: COLORS.gray }]}
                                onPress={() => setIsModalVisible(false)} // Close modal
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: COLORS.primary }]}
                                onPress={() => submitData()}
                            >
                                <Text style={styles.modalButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.lightOrange,
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10, // For Android shadow
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    reasonInput: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        height: 80,
        fontSize: 14,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default PaymentOption