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
import { ServeyStatus } from '../../types';

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

// function renderAbsoluteButton(handleSubmit: () => void) {
//     return (
//         <TouchableOpacity
//             onPress={() => handleSubmit()}
//             style={{
//                 padding: 10,
//                 borderRadius: 20,
//                 backgroundColor: COLORS.primary,
//             }}>
//             <Image
//                 alt="home"
//                 source={require('../../assets/pngs/Icon-Checkmark.png')}
//                 resizeMode="contain"
//                 style={{
//                     width: 20,
//                     height: 20,
//                     tintColor: COLORS.white,
//                 }}
//             />
//         </TouchableOpacity>
//     );
// }

function renderSaveButton(handleSubmit: () => void) {
    return (
        <TouchableOpacity
            onPress={() => handleSubmit()}
            style={{
                padding: 10,
                borderRadius: 20,
                backgroundColor: COLORS.primary,
            }}>
            <Image
                alt="save"
                source={require('../../assets/pngs/save.png')}
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

    const { location: { ro_loc_id, cus_id, list_id, status, hasInvoice } } = useSelector((state: RootState) => state.routeReducer);

    const route = useRoute<InvoiceSubItemsProp>();
    const { source } = route.params;    
    const [DescriptionOptions, setDescriptionOptions] = useState<any[]>(!source.includes("Service Call") ? ['Gasoline nozzle', 'Diesel nozzle', '3/4 swivel', '3/4 hose', '3/4 breakaway', '3/4 whip hose', 'Gas filters', 'Diesel filters', 'Gray fill cap', 'Orange vapor cap', 'Ethanol sticker', "Calibration"] : ["Service Call"]);

    const CategoryOptions = ["Parts", "Calibration", "Service Call"];
    !hasInvoice && !source.includes("Service Call") && CategoryOptions.unshift("Monthly Inspection");

    const isMonthlyInspection = data.category === "Monthly Inspection"
    const isServiceCall = data.category === "Service Call"
    const isCalibration = data.category === "Calibration"
    const isLabor = data.description === "Calibration Labor"

    const dataAmount = typeof data.amount === "number" ? +data.amount.toFixed(2) : 0;
    
    const [inspAmount, setInspAmount] = useState<number>(dataAmount) 

    const calculatedAmount = isMonthlyInspection ? inspAmount : (data.qty * data.rate).toFixed(2)
    
    useEffect(() => {
        switch (data.category) {
            case "Monthly Inspection":
                setInspAmount(dataAmount || fetchedAmount);
                onChange(id, 'amount', dataAmount || fetchedAmount)
                onChange(id, 'description', "Monthly Inspection")
                break;
            case "Service Call":
                // onChange(id, 'amount', 0)
                // onChange(id, 'des_problem', "")
                onChange(id, 'description', "")
                setDescriptionOptions(["Service Call"])
                break;
            case "Calibration":
                onChange(id, 'description', "")
                setDescriptionOptions(["Calibration", "Calibration Labor"])
                break;
            default:
                onChange(id, 'description', data.description)
                setDescriptionOptions(['Gasoline nozzle', 'Diesel nozzle', '3/4 swivel', '3/4 hose', '3/4 breakaway', '3/4 whip hose', 'Gas filters', 'Diesel filters', 'Gray fill cap', 'Orange vapor cap', 'Ethanol sticker'])
                // onChange(id, 'rate', 0)
                // onChange(id, 'qty', 0)
                // onChange(id, 'amount', 0)
                // onChange(id, 'description', "")
                // onChange(id, 'des_problem', "")
                break;
        }
    }, [data.category])

    useEffect(() => {
        setInspAmount(dataAmount || fetchedAmount);
    }, [data.amount])

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
                        value={inspAmount.toString() || ''}
                        placeholder="Amount"
                        keyboardType='numeric'
                        onChange={(value) => {console.log('vasl',+value)
                            setInspAmount(+value);
                            onChange(id, 'amount', +value);                            
                        }}
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
                    {!isServiceCall && !isCalibration &&
                        <FormInput
                            value={data.des_problem!}
                            placeholder="Problem Description"
                            keyboardType='default'
                            onChange={(value) => onChange(id, "des_problem", value)}
                            containerStyle={{ marginTop: SIZES.base, }}
                        />

                        
                    }
                    
                    {!isServiceCall && !isLabor && <FormInput
                        value={data.location}
                        placeholder="Location"
                        keyboardType='default'
                        onChange={(value) => onChange(id, 'location', value)}
                        containerStyle={{ marginTop: SIZES.base, }}
                    />
                    }

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
                        onChange={(value) => onChange(id, 'rate', value)}
                    />
                </>
            )}


            <Text style={{ ...FONTS.body2, margin: SIZES.base, textAlign: "right" }}>Amount : ${calculatedAmount}</Text>

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
    const { source, customer_id, invoice } = route.params;

    const currentLocation = useSelector((state: RootState) => state.routeReducer.location);
    const { location: { ro_loc_id, cus_id, list_id, status, hasInvoice, allowInv } } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoarding] = useState<boolean>(false);
    const [fetchedAmount, setFetchedAmount] = useState<number>(0);
    const [forms, setForms] = useState<InvoiceSubItem[]>(!invoice ? [
        { description: '', category: '', location: '', qty: 0, rate: 0 },
    ] : []);

    const [totalAmount, setTotalAmount] = useState(0);
    const [sales_tax, setSalesTax] = useState(0);
    const [comment, setComment] = useState<string>('');
    const [service, setService] = useState<string | null>(null);
    const [inv_id, setInvId] = useState<number | null>(null);

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

        if(invoice) { 
            const newInvoiceArr = invoice.invoice_items.map((item) =>
                { return { description: item.descript ?? '', category: item.category ?? '', location: item.location ?? '', qty: item.qty ?? 0, rate: parseFloat(item.rate) ?? 0, amount: parseFloat(item.amount) ?? 0 } }
            );
            setForms(newInvoiceArr);
            setInvId(invoice.id)
        }
    }, [source, invoice])

    const sales_tax_perc = 8.25/100; // Sales Tax Percentage

    useEffect(() => {
        let inspect_total = 0;
        let calib_total = 0;
        let monthlyIns = false;
        
        const total = forms.reduce((acc, form) => {
            let amount = 0;

            switch (form.category) {
                case "Monthly Inspection":
                    amount = typeof form.amount === 'number' ? form.amount : 0;
                    inspect_total += amount;
                    break;
                case "Calibration":
                    const cali_qty = typeof form.qty === 'string' ? parseFloat(form.qty) : form.qty || 0;
                    const cali_rate = typeof form.rate === 'string' ? parseFloat(form.rate) : form.rate || 0;
                    amount = cali_qty * cali_rate;
                    calib_total += amount;
                    break;
                default:
                    const qty = typeof form.qty === 'string' ? parseFloat(form.qty) : form.qty || 0;
                    const rate = typeof form.rate === 'string' ? parseFloat(form.rate) : form.rate || 0;
                    amount = qty * rate;
                    break;
            }
            
            switch (form.category) {
                case "Monthly Inspection":
                    monthlyIns = true;
                    break;
                case "Calibration":
                    setService("Calibration");
                    break;
                default:
                    setService("Service Call");
                    break;
            }
        
            return acc + amount;
        }, 0);

        if(!invoice && ro_loc_id && !hasInvoice && monthlyIns){
            setService("Monthly Inspection");
        }        

        const tax = (total - inspect_total - calib_total) * sales_tax_perc;

        setSalesTax(parseFloat(tax.toFixed(2)));
        setTotalAmount(parseFloat((total + tax).toFixed(2)));        
    }, [forms]);

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
    
    const setHasInvoice = (hasInvoice: boolean) => {
        dispatch({
            type: "LOCATION_PRESS_DATA",
            payload: {
                ...currentLocation,
                hasInvoice: hasInvoice,
            },
        })
    };

    const handleSubmit = async () => {
        // validate 
        if (!invoice && status !== ServeyStatus.Completed && !source.includes("Service Call") && !allowInv) {
            Alert.alert("Can not create an invoice until Inspection completed.");
            return;
        }

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
                        des_problem: form.des_problem || ''
                    } as ServiceCall_Invoice_SubItem_withAmount;
                default:
                    return {
                        description: form.description,
                        category: form.category,
                        location: form.location,
                        qty: form.qty,
                        rate: form.rate,
                        amount: form.qty * form.rate,
                        des_problem: form.des_problem || ''
                    } as GeneralInvoiceSubItemWithAmount;
            }
        });

        dispatch(save_SubItems(formsWithAmount));

        if (source.includes("Service Call")) {
            const form: postInvoice_from_ServiceCall_ReqBody = {
                customer_id: customer_id!,
                items: formsWithAmount,
                addi_comments: comment,
                service: service,
                id: inv_id
            }

            setIsLoarding(true)
            const postData = await postInvoiceInfo_From_ServiceCall(dispatch, form);
            setIsLoarding(false)
            
            postData && (setInvId(postData.id), navigation.navigate('PdfReader', { invoice_link: postData.invoice_link, istools: true, inv_id: postData.id }));
        } else {

            let postData: any;

            if (inv_id) { 
                console.log("list_id | cus_id -> null") 

                const form: postInvoice_from_ServiceCall_ReqBody = {
                    customer_id: cus_id!,
                    items: formsWithAmount,
                    addi_comments: comment,
                    service: service,
                    id: inv_id
                }
    
                setIsLoarding(true)
                postData = await postInvoiceInfo_From_ServiceCall(dispatch, form);
                setIsLoarding(false)
            } else {
                const form: postInvoiceReqBody = {
                    list_id: list_id!,
                    cus_id: cus_id!,
                    amount: fetchedAmount,
                    items: formsWithAmount,
                    addi_comments: comment,
                    service: service,
                    id: inv_id
                }

                setIsLoarding(true)
                postData = await postInvoiceInfo(dispatch, form);
                setIsLoarding(false)
            };

            postData && (
                setInvId(postData.id), 
                setHasInvoice(true), 
                navigation.navigate('PdfReader', { invoice_link: postData.invoice_link, istools: true, inv_id: postData.id })
            );
            // navigation.navigate('PaymentOption');
        }

    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
        >
            <Button 
                title="📝 View Previous Invoices" 
                onPress={() => {
                    navigation.navigate('StoreInvoices', { source: "store" });
                }} 
                color={COLORS.lightOrange} 
            />            
            {invoice ? (
                <Text style={{ ...FONTS.body3, margin: SIZES.base, marginBottom: SIZES.base, textAlign: "center", fontWeight: 700, color: 'green' }}>Edit Invoice #{invoice.invoice_no}</Text>
            ) : status !== ServeyStatus.Completed && !source.includes("Service Call") && !allowInv && (
                <Text style={{ ...FONTS.body4, margin: SIZES.base, marginBottom: SIZES.base, textAlign: "center", fontWeight: 700, color: 'red' }}>Can not create an invoice until Inspection completed.</Text>
            )}
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
            <FormInput
                value={comment}
                placeholder="Comment"
                keyboardType='default'
                containerStyle={{ marginTop: SIZES.base, }}
                onChange={(value) => setComment(value)}
            />
            <Text style={{ ...FONTS.body2, margin: SIZES.base, marginBottom: SIZES.none, textAlign: "right" }}>Sales Tax : ${sales_tax}</Text>
            <Text style={{ ...FONTS.body2, margin: SIZES.base, marginBottom: SIZES.none, textAlign: "right", fontWeight: 700 }}>Total Amount : ${totalAmount}</Text>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", margin: SIZES.base }}>
                <View style={{ margin: SIZES.base }}>
                    {renderSaveButton(handleSubmit)}
                </View>
                {/* <View style={{ margin: SIZES.base }}>
                    {renderAbsoluteButton(handleSubmit)}
                </View> */}
            </View>
        </KeyboardAwareScrollView>
    );
};

export default SubItemsScreen;
