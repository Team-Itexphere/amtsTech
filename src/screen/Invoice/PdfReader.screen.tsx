import React, { useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    Modal,
    Alert,
    Linking,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Signature from 'react-native-signature-canvas';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp, PdfReaderRouteProp } from '../../navigation/navigationTypes';
import { COLORS, FONTS, SIZES } from '../../assets/theme';
import Loading from '../../components/UI/Loading';
import assetsPng from '../../assets/pngs'
import { postInvoice_from_ServiceCall_ReqPaymentBody, postInvoiceInfo_From_ServiceCall } from '../../store/actions/survey/surveyAction';
import { useDispatch } from 'react-redux';

const { IconHome, IconCheque, IconDownload, IconPaymentOptions } = assetsPng;

type Props = {};

const PdfReader = (props: Props) => {
    const dispatch = useDispatch();
    const route = useRoute<PdfReaderRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { invoice_link, istools, inv_id } = route.params;
    const source = { uri: invoice_link, cache: true };
    const [isLoading, setIsLoarding] = useState<boolean>(false)

    const [signatureVisible, setSignatureVisible] = useState(false);
    const signatureRef = useRef<any>(null);

    const openPDF = async () => {
        try {
            await Linking.openURL(invoice_link);
        } catch (err) {
            console.error('An error occurred', err);
            Alert.alert('An error occurred while trying to open the PDF.');
        }
    };

    const handleSignature = async (signature: string) => {
        setIsLoarding(true)
        setSignatureVisible(false);

        const form: postInvoice_from_ServiceCall_ReqPaymentBody = {
            signature: signature,
            inv_id: inv_id
        }

        const postData = await postInvoiceInfo_From_ServiceCall(dispatch, form);
        setIsLoarding(false)
        if (postData) navigation.navigate('PdfReader', { invoice_link: postData.invoice_link, istools: true, inv_id: postData.id })
    };

    // Handle when the user cancels the signature
    const handleEmpty = () => {
        setSignatureVisible(false);
        Alert.alert('Error', 'Signature not captured.');
    };

    // Trigger the modal for capturing the signature
    const openSignatureModal = () => {
        setSignatureVisible(true);
    };

    return (
        <View style={styles.container}>
            {istools && (
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        flexDirection: 'row',
                        top: 1,
                        left: 10,
                        backgroundColor: COLORS.primary60,
                        padding: SIZES.base,
                        borderRadius: SIZES.radius,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate('StoreList')}
                        style={{ padding: SIZES.base, borderRadius: 100, backgroundColor: COLORS.white, marginRight: 10 }}
                    >
                        <Image
                            source={IconHome}
                            style={{ width: 30, height: 30, tintColor: COLORS.primary }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => openPDF()}
                        style={{
                            padding: SIZES.base,
                            borderRadius: 100,
                            backgroundColor: COLORS.white,
                            marginRight: 10,
                        }}
                    >
                        <Image
                            source={IconDownload}
                            style={{ width: 30, height: 30, tintColor: COLORS.primary }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('PaymentOption', { inv_id: inv_id })}
                        style={{
                            padding: SIZES.base,
                            borderRadius: 100,
                            backgroundColor: COLORS.white,
                            marginRight: 10,
                        }}
                    >
                        <Image
                            source={IconPaymentOptions}
                            style={{ width: 30, height: 30 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={openSignatureModal}
                        style={{
                            padding: SIZES.base,
                            borderRadius: 100,
                            backgroundColor: COLORS.white,
                            marginRight: 10,
                        }}
                    >
                        <Image
                            source={IconCheque}
                            style={{ width: 30, height: 30 }}
                        />
                    </TouchableOpacity>
                </View>
            )}

            <Pdf
                source={source}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                trustAllCerts={false}
                style={styles.pdf}
            />

            {/* Signature Modal */}
            <Modal
                visible={signatureVisible}
                animationType="slide"
                onRequestClose={() => setSignatureVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: COLORS.white, width: '90%', margin: 'auto' }}>
                    <Signature
                        ref={signatureRef}
                        onOK={handleSignature}
                        onEmpty={handleEmpty}
                        descriptionText="Sign above"
                        clearText="Clear"
                        confirmText="Submit"
                        webStyle={`
                            .m-signature-pad--footer {
                                display: flex;
                                justify-content: space-between;
                            }
                            
                            .m-signature-pad--footer button {
                                background: ${COLORS.primary} !important;
                            }
                        `}
                        autoClear={true}
                    />
                </View>
            </Modal>
            {isLoading && <Loading />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
        position: 'relative',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default PdfReader;
