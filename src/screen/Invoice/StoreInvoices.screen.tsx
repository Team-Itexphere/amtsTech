import { View, Text, Button, FlatList, KeyboardAvoidingViewComponent, KeyboardAvoidingView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS, SIZES } from '../../assets/theme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { InvoiceSubItemsProp, NavigationProp } from '../../navigation/navigationTypes';
import { getInvoices } from '../../store/actions/survey/surveyAction';
import { RootState } from '../../store/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { formatDateUS } from '../../utils/dateFormatter';

const StoreInvoicesScreen = () => {
    const dispatch = useDispatch();
    const route = useRoute<InvoiceSubItemsProp>();
    const navigation = useNavigation<NavigationProp>();
    const { source, customer_id } = route.params;

    const { location } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            setIsLoading(true);
            const invoices_arr = await getInvoices(dispatch, customer_id && customer_id !== undefined ? customer_id : location.cus_id);
            setIsLoading(false);
            if (!invoices_arr) {
                console.warn('No invoices');
            } else {
                setInvoices(invoices_arr);
            }
        };

        fetchInvoices();
    }, [location.cus_id, dispatch]);

    const viewPDF = (pdf_link: string, inv_id: number, has_sign: boolean) => {
        navigation.navigate('PdfReader', { invoice_link: pdf_link, istools: true, inv_id: inv_id, payOpt: has_sign });
    };

    const editInvoice = (id: number) => {
        navigation.navigate('InvoiceSubItems', { source: "store", invoice: invoices.find(invoice => invoice.id === id) });
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
        >
            {isLoading ? (
                <Text style={{ textAlign: 'center', marginTop: 200 }}>Loading...</Text>
            ) : invoices.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 200 }}>No invoices available</Text>
            ) : (
                invoices.map((invoice, index) => (
                    <View
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            margin: SIZES.base,
                            borderRadius: 10,
                            borderBottomWidth: 3,
                            borderColor: '#00800082',
                            backgroundColor: '#00000014',
                        }}
                    >
                        <View style={{ margin: SIZES.base }}>
                            <Text
                                style={{
                                    ...FONTS.body3,
                                    margin: SIZES.base,
                                    marginBottom: SIZES.none,
                                    textAlign: 'right',
                                }}
                            >
                                #{invoice.invoice_no}
                            </Text>
                        </View>
                        <View style={{ margin: SIZES.base }}>
                            <Text
                                style={{
                                    ...FONTS.body3,
                                    margin: SIZES.base,
                                    marginBottom: SIZES.none,
                                    textAlign: 'right',
                                }}
                            >
                                {formatDateUS(invoice.date, 'MM-DD-YYYY')}
                            </Text>
                        </View>
                        <View style={{ margin: SIZES.base, display: 'flex', flexDirection: 'row', gap: 5, marginRight: 10 }}>
                            {invoice.payment !== 'Paid' &&
                            <Button
                                title="Edit"
                                onPress={() => editInvoice(invoice.id)}  // Pass pdf_link when clicked
                                color={COLORS.lightOrange}
                            />
                            }
                            <View style={{ marginLeft: invoice.payment == 'Paid' ? 50 : 0 }}>
                                <Button
                                    title="View PDF"
                                    onPress={() => viewPDF(invoice.pdf_link, invoice.id, invoice.has_sign)} // Pass pdf_link when clicked
                                    color={COLORS.lightOrange}
                                />
                            </View>
                        </View>
                    </View>
                ))
            )}
        </KeyboardAwareScrollView>
    );
};

export default StoreInvoicesScreen;
