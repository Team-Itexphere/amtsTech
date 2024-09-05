import { View, Text, Button, FlatList, KeyboardAvoidingViewComponent, KeyboardAvoidingView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONTS, SIZES } from '../../assets/theme'
import FormInput from '../../components/UI/FormInput';
import CustomDropdown from '../../components/UI/CustomDropdown';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LineDivider } from '../../components/UI';
import { useDispatch, useSelector } from 'react-redux';
import { save_SubItems } from '../../store/actions/survey/invoiceAction';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigation/navigationTypes';
import { getAmount, postInvoiceInfo, postInvoiceReqBody } from '../../store/actions/survey/surveyAction';
import { RootState } from '../../store/store';

interface FormComponentProps {
    id: number;
    data: InvoiceSubItem;
    fetchedAmount: number;
    onChange: (id: number, field: string, value: string | number) => void;
    onDelete: () => void;
}

export interface InvoiceSubItem {
    description: string;
    category: string;
    location: string;
    qty: number;
    rate: number;
    amount?: number;
}
export interface GeneralInvoiceSubItemWithAmount {
    description: string;
    category: string;
    location: string;
    qty: number;
    rate: number;
    amount: number;
}

export type MonthlyInspectionInvoiceSubItemWithAmount = Omit<
    GeneralInvoiceSubItemWithAmount,
    'location' | 'qty' | 'rate'
>;

export type InvoiceSubItemWithAmount =
    | GeneralInvoiceSubItemWithAmount
    | MonthlyInspectionInvoiceSubItemWithAmount;

function renderAbsoluteButton(handleSubmit: () => void) {
    return (
        <TouchableOpacity
            onPress={() => handleSubmit()}
            style={{
                padding: 10,
                borderRadius: 20,
                backgroundColor: COLORS.primary,
            }}>
            <Image
                alt="home"
                source={require('../../assets/pngs/Icon-Checkmark.png')}
                resizeMode="contain"
                style={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.white,
                }}
            />
        </TouchableOpacity>
    );
}

const FormComponent = ({ id, data, fetchedAmount, onChange, onDelete }: FormComponentProps) => {
    const DescriptionOptions = ['Gasoline nozzle', 'Diesel nozzle', '3/4 swivel', '3/4 hose', '3/4 breakaway', '3/4 whip hose', 'Gas filters', 'Diesel filters', 'Gray fill cap', 'Orange vapor cap', 'Ethanol sticker', "Calibration"];
    const CategoryOptions = ["Monthly Inspection", "Parts", "Calibration", "Calibration", "Service Call"];

    const isMonthlyInspection = data.category === "Monthly Inspection"

    useEffect(() => {
        if (isMonthlyInspection) {
            onChange(id, 'amount', fetchedAmount)
            onChange(id, 'description', "Monthly Inspection")
        } else {
            onChange(id, 'amount', 0)
            onChange(id, 'description', "")
        }
    }, [data.category])

    return (
        <View style={{ marginVertical: SIZES.base, marginHorizontal: SIZES.base }}>
            <CustomDropdown
                selectedValue={data.category}
                onValueChange={(value) => onChange(id, 'category', value)}
                options={CategoryOptions}
                placeholder="Category"
            />
            {isMonthlyInspection ? (
                <>
                    <FormInput
                        value={data.description}
                        placeholder="Description"
                        keyboardType='default'
                        onChange={(value) => onChange(id, 'description', value)}
                        containerStyle={{ marginTop: SIZES.base, }}
                    />
                    <FormInput
                        value={data.amount ? data.amount?.toString() : ''}
                        placeholder="Amount"
                        keyboardType='numeric'
                        onChange={(value) => onChange(id, 'amount', value)}
                        containerStyle={{ marginTop: SIZES.base, }}
                    />

                </>
            ) : (
                <>
                    <CustomDropdown
                        selectedValue={data.description}
                        onValueChange={(value) => onChange(id, 'description', value)}
                        options={DescriptionOptions}
                        placeholder="Description"
                        contentContainerStyle={{ marginTop: SIZES.base, }}
                    />
                    <FormInput
                        value={data.location}
                        placeholder="Location"
                        keyboardType='default'
                        onChange={(value) => onChange(id, 'location', value)}
                        containerStyle={{ marginTop: SIZES.base, }}
                    />

                    <FormInput
                        value={data.qty === 0 ? '' : data.qty.toString()}
                        placeholder="Quantity"
                        keyboardType='numeric'
                        onChange={(value) => onChange(id, 'qty', Number(value))}
                        containerStyle={{ marginVertical: SIZES.base, }}
                    />

                    <FormInput
                        value={data.rate === 0 ? '' : data.rate.toString()}
                        placeholder="Rate"
                        keyboardType='numeric'
                        onChange={(value) => onChange(id, 'rate', Number(value))}
                    />
                </>
            )}


            <Text style={{ ...FONTS.body2, margin: SIZES.base, textAlign: "right" }}>Amount : {isMonthlyInspection ? data.amount : data.qty * data.rate}</Text>

            <TouchableOpacity onPress={onDelete} style={{ marginTop: SIZES.base }}>
                <Text style={{ color: COLORS.red, textAlign: 'right' }}>Delete</Text>
            </TouchableOpacity>

            <LineDivider />
        </View>
    );
};

const SubItemsScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp>();

    const { location: { ro_loc_id, cus_id, list_id } } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoarding] = useState<boolean>(false);
    const [fetchedAmount, setFetchedAmount] = useState<number>(0);
    const [forms, setForms] = useState<InvoiceSubItem[]>([
        { description: '', category: '', location: '', qty: 0, rate: 0 },
    ]);

    const fetchData = async (ro_loc_id: number) => {
        setIsLoarding(true);
        const res_Amount = await getAmount(dispatch, ro_loc_id)

        setIsLoarding(false);
        if (!res_Amount) return console.warn('res_Amount null');
        setFetchedAmount(+res_Amount);
    };

    useEffect(() => {
        if (ro_loc_id) fetchData(ro_loc_id);
    }, [])

    const addForm = () => {
        setForms([...forms, { description: '', category: '', location: '', qty: 0, rate: 0 }]);
    };

    const handleChange = (id: number, field: string, value: string | number) => {

        // const newForms = forms.map((form, index) =>
        //     index === id ? { ...form, [field]: value } : form
        // );
        // setForms(newForms);

        setForms(prevForms =>
            prevForms.map((form, index) =>
                index === id ? { ...form, [field]: value } : form
            )
        );
    };

    const handleDelete = (id: number) => {
        const newForms = forms.filter((_, index) => index !== id);
        setForms(newForms);
    };

    const handleSubmit = async () => {
        // validate 
        for (const form of forms) {
            if (!form.description || !form.category) {
                Alert.alert("Please fill all required fields in every form.");
                return;
            }
            if (form.category !== "Monthly Inspection") {
                if (form.qty <= 0 || form.rate <= 0) {
                    Alert.alert("Please enter valid Quantity and Rate in every form.");
                    return;
                }
            } else {
                if (!form.amount || form.amount <= 0) {
                    Alert.alert("Please enter a valid Amount for Monthly Inspection.");
                    return;
                }
            }
        }

        const formsWithAmount: InvoiceSubItemWithAmount[] = forms.map(form => {
            if (form.category === "Monthly Inspection") {
                return {
                    description: form.description,
                    category: form.category,
                    amount: form.amount!,
                } as MonthlyInspectionInvoiceSubItemWithAmount;
            } else {
                return {
                    description: form.description,
                    category: form.category,
                    location: form.location,
                    qty: form.qty,
                    rate: form.rate,
                    amount: form.qty * form.rate,
                } as GeneralInvoiceSubItemWithAmount;
            }
        });

        dispatch(save_SubItems(formsWithAmount));
        if (!list_id || !cus_id) console.warn("list_id | cus_id -> null");
        const form: postInvoiceReqBody = {
            list_id: list_id!,
            cus_id: cus_id!,
            amount: fetchedAmount,
            items: formsWithAmount
        }

        setIsLoarding(true)
        const postData = await postInvoiceInfo(dispatch, form);
        setIsLoarding(false)
        if (postData) navigation.navigate('PdfReader', { invoice_link: postData.invoice_link })
        // navigation.navigate('PaymentOption');
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
        >
            {forms.map((form, index) => (
                <FormComponent
                    key={index}
                    id={index}
                    data={form}
                    fetchedAmount={fetchedAmount}
                    onChange={handleChange}
                    onDelete={() => handleDelete(index)}
                />
            ))}
            <Button title="+ Add Form" onPress={addForm} color={COLORS.lightOrange} />
            <View style={{ display: "flex", alignItems: "flex-end", margin: SIZES.base }}>
                {renderAbsoluteButton(handleSubmit)}
            </View>
        </KeyboardAwareScrollView>
    );
};

export default SubItemsScreen;
