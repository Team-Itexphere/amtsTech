import { View, Text, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, FONTS } from '../../assets/theme'
import { CheckBox, Header } from '../../components/UI'
import FormInput from '../../components/UI/FormInput'
import { InvoiceGenerateRouteProp, NavigationProp } from '../../navigation/navigationTypes'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import TextButton from '../../components/UI/TextButton'
import { useDispatch, useSelector } from 'react-redux'
import { save_Amount } from '../../store/actions/survey/invoiceAction'
import { RootState } from '../../store/store'
import { getAmount } from '../../store/actions/survey/surveyAction'
import Loading from '../../components/UI/Loading'

type Props = {}
type formDataType = {
    amount: string
    description: string
    isAddSubSelected: boolean
}
const InvoiceGenerate = (props: Props) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const route = useRoute<InvoiceGenerateRouteProp>();
    const navigation = useNavigation<NavigationProp>();

    const { location: { ro_loc_id } } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoarding] = useState<boolean>(false)
    const [formData, setFormData] = useState<formDataType>({
        amount: '',
        description: 'Monthly Inspection',
        isAddSubSelected: false
    })

    const fetchData = async () => {
        setIsLoarding(true);
        if (!ro_loc_id) return console.warn(" ro_loc_id -> null");
        const res_Amount = await getAmount(dispatch, ro_loc_id)

        setIsLoarding(false);
        if (!res_Amount) return console.warn('res_Amount null');
        setFormData({ ...formData, amount: res_Amount })
    };

    useEffect(() => {
        if (isFocused) fetchData();
    }, [isFocused])

    const formSubmit = async () => {
        dispatch(save_Amount(formData.amount));

        if (formData.isAddSubSelected) {
            return navigation.navigate('InvoiceSubItems', { source: "not_using" })
        } else {
            return navigation.navigate('PaymentOption')
        }

    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: COLORS.white,
        }}>
            <StatusBar backgroundColor={COLORS.white} />
            {isLoading && <Loading />}
            <View style={{ flex: 1 / 5 }} />
            <View style={{
                flex: 1,
                backgroundColor: COLORS.white,
                padding: SIZES.padding
            }}>
                <Text style={{ ...FONTS.h2, marginBottom: SIZES.base * 2, textAlign: 'center' }}>Proceed or change the invoice amount</Text>
                <View style={{ marginVertical: SIZES.base * 2, width: '100%', }}>
                    <Text style={{ marginBottom: 2, marginLeft: 2, ...FONTS.body4 }}>Invoice Amount ($)</Text>
                    <FormInput
                        containerStyle={{
                            borderRadius: SIZES.radius,

                        }}
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={(text: string) => setFormData({ ...formData, amount: text })}
                        keyboardType='numeric'
                    // editable={!isDisabled()}
                    />
                </View>
                <View style={{ width: '100%', }}>
                    <Text style={{ marginBottom: 2, marginLeft: 2, ...FONTS.body4 }}>Description</Text>
                    <FormInput
                        containerStyle={{
                            borderRadius: SIZES.radius,
                        }}
                        inputContainerStyle={
                            { height: 100 }
                        }
                        placeholder="Description"
                        value={formData.description}
                        onChange={(text: string) => setFormData({ ...formData, description: text })}
                        multiline={true}
                    />
                </View>
                <View style={{ flexDirection: 'row', marginTop: SIZES.base * 2 }}>
                    <Text style={{ ...FONTS.h4, marginRight: SIZES.base }}>Add Sub Items</Text>
                    <CheckBox
                        isSelected={formData.isAddSubSelected}
                        onPress={() => setFormData({ ...formData, isAddSubSelected: !formData.isAddSubSelected })}
                    />
                </View>

                <View style={{ flex: 1 }} />
                <View style={{ width: '100%', marginTop: 20 }}>
                    <TextButton
                        label="Proceed"
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
        </View>
    )
}

export default InvoiceGenerate