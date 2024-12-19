import { View, Text, Button, FlatList, KeyboardAvoidingViewComponent, KeyboardAvoidingView, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS, SIZES } from '../../assets/theme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '../../navigation/navigationTypes';
import { getSurveys } from '../../store/actions/survey/surveyAction';
import { RootState } from '../../store/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { formatDateUS } from '../../utils/dateFormatter';

const StoreSurveysScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp>();

    const { location } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [surveys, setSurveys] = useState<any[]>([]);

    useEffect(() => {
        const fetchSurveys = async () => {
            setIsLoading(true);
            const surveys_arr = await getSurveys(dispatch, location.cus_id);
            setIsLoading(false);
            if (!surveys_arr) {
                console.warn('No surveys');
            } else {
                setSurveys(surveys_arr);
            }
        };

        fetchSurveys();
    }, [location.cus_id, dispatch]);

    const viewPDF = (pdf_link: string) => {
        navigation.navigate('PdfReader', { invoice_link: pdf_link, istools: false, inv_id: null });
    };

    const openPDF = async (pdf_link: string) => {
        try {
            await Linking.openURL(pdf_link);
        } catch (err) {
            console.error("An error occurred", err);
            Alert.alert("An error occurred while trying to open the PDF.");
        }
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
        >
            {isLoading ? (
                <Text style={{ textAlign: 'center', marginTop: 200 }}>Loading...</Text>
            ) : surveys.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 200 }}>No surveys available</Text>
            ) : (
                surveys.map((survey, index) => (
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
                                    ...FONTS.body4,
                                    margin: SIZES.base,
                                    marginBottom: SIZES.none,
                                    textAlign: 'right',
                                }}
                            >
                                {formatDateUS(survey.created_at, 'MM-DD-YYYY')}
                            </Text>
                        </View>
                        <View style={{ margin: SIZES.base, display: 'flex', flexDirection: 'row', gap: 5, marginRight: 10 }}>
                            <View style={{ /*marginLeft: survey.payment == 'Paid' ? 50 : 0*/ }}>
                                <Button
                                    title="View"
                                    onPress={() => viewPDF(survey.pdf_link)}
                                    color={COLORS.lightOrange}
                                />
                            </View>
                            <View>
                                <Button
                                    title="Download"
                                    onPress={() => openPDF(survey.pdf_link)}
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

export default StoreSurveysScreen;
