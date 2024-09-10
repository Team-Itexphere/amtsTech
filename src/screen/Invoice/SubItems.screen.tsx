import { View, Text, Button, FlatList, KeyboardAvoidingViewComponent, KeyboardAvoidingView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONTS, SIZES } from '../../assets/theme'
import FormInput from '../../components/UI/FormInput';
import CustomDropdown from '../../components/UI/CustomDropdown';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LineDivider } from '../../components/UI';
import { useDispatch, useSelector } from 'react-redux';
import { save_SubItems } from '../../store/actions/survey/invoiceAction';
import { useNavigation, useRoute } from '@react-navigation/native';
import { InvoiceSubItemsProp, NavigationProp } from '../../navigation/navigationTypes';
import { getAmount, postInvoice_from_ServiceCall_ReqBody, postInvoiceInfo, postInvoiceInfo_From_ServiceCall, postInvoiceReqBody } from '../../store/actions/survey/surveyAction';
import { RootState } from '../../store/store';
import { saveDataFrom_ServiceCallTo_Invoice } from '../../store/actions/ServiceCall/ServiceCallStateAction';

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
    des_problem?: string
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

export interface ServiceCall_Invoice_SubItem_withAmount extends GeneralInvoiceSubItemWithAmount {
    des_problem: InvoiceSubItem["des_problem"];
}

export type InvoiceSubItemWithAmount =
    | GeneralInvoiceSubItemWithAmount
    | MonthlyInspectionInvoiceSubItemWithAmount | ServiceCall_Invoice_SubItem_withAmount;

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
    const isServiceCall = data.category === "Service Call"

    const calculatedAmount = isMonthlyInspection ? data.amount : data.qty * data.rate

    useEffect(() => {
        switch (data.category) {
            case "Monthly Inspection":
                onChange(id, 'amount', fetchedAmount)
                onChange(id, 'description', "Monthly Inspection")
                break;
            case "Service Call":
                onChange(id, 'amount', 0)
                onChange(id, 'des_problem', "")
                break;
            default:
                onChange(id, 'amount', 0)
                onChange(id, 'description', "")
                onChange(id, 'des_problem', "")
                break;
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
                    {isServiceCall &&
                        <FormInput
                            value={data.des_problem!}
                            placeholder="Problem Description"
                            keyboardType='default'
                            onChange={(value) => onChange(id, "des_problem", value)}
                            containerStyle={{ marginTop: SIZES.base, }}
                        />
                    }
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


            <Text style={{ ...FONTS.body2, margin: SIZES.base, textAlign: "right" }}>Amount : {calculatedAmount}</Text>

            <TouchableOpacity onPress={onDelete} style={{ marginTop: SIZES.base }}>
                <Text style={{ color: COLORS.red, textAlign: 'right' }}>Delete</Text>
            </TouchableOpacity>

            <LineDivider />
        </View>
    );
};

const SubItemsScreen = () => {
    const dispatch = useDispatch();
    const route = useRoute<InvoiceSubItemsProp>();
    const navigation = useNavigation<NavigationProp>();
    const { source, customer_id } = route.params;

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

        if (source.includes("Service Call")) {
            dispatch(saveDataFrom_ServiceCallTo_Invoice({ source: "Service Call", customer_id: customer_id! }));
            setForms([
                {
                    description: "",
                    des_problem: "",
                    category: "Service Call",
                    location: "",
                    qty: 0,
                    rate: 0
                }
            ])
        }
    }, [source])

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
            if (form.category === "Monthly Inspection") {
                if (!form.amount || form.amount <= 0) {
                    Alert.alert("Please enter a valid Amount for Monthly Inspection.");
                    return;
                }

            } else if (form.category === "Service Call") {
                if (form.des_problem === "") {
                    Alert.alert("Please enter valid des_problem for Service Call.");
                    return;
                }
                if (form.qty <= 0 || form.rate <= 0) {
                    Alert.alert("Please enter valid Quantity and Rate in every form.");
                    return;
                }
            } else {
                if (form.qty <= 0 || form.rate <= 0) {
                    Alert.alert("Please enter valid Quantity and Rate in every form.");
                    return;
                }
            }
        }

        const formsWithAmount: InvoiceSubItemWithAmount[] = forms.map(form => {
            switch (form.category) {
                case "Monthly Inspection":
                    return {
                        description: form.description,
                        category: form.category,
                        amount: form.amount!,
                    } as MonthlyInspectionInvoiceSubItemWithAmount;
                case "Service Call":
                    return {
                        description: form.description,
                        category: form.category,
                        location: form.location,
                        qty: form.qty,
                        rate: form.rate,
                        amount: form.qty * form.rate,
                        des_problem: form.des_problem
                    } as ServiceCall_Invoice_SubItem_withAmount;
                default:
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

        if (source.includes("Service Call")) {
            const form: postInvoice_from_ServiceCall_ReqBody = {
                customer_id: customer_id!,
                items: formsWithAmount
            }

            setIsLoarding(true)
            const postData = await postInvoiceInfo_From_ServiceCall(dispatch, form);
            setIsLoarding(false)
            if (postData) navigation.navigate('PdfReader', { invoice_link: postData.invoice_link })
        } else {

            if (!list_id || !cus_id) return console.warn("list_id | cus_id -> null");
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
        }

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
