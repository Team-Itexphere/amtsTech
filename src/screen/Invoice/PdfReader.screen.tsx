import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, PermissionsAndroid, Linking, Alert } from 'react-native'
import React from 'react'
import { NavigationProp, PdfReaderRouteProp } from '../../navigation/navigationTypes';
import { useNavigation, useRoute } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import assetsPng from '../../assets/pngs'
import { COLORS, FONTS, SIZES } from '../../assets/theme';

const { IconHome, IconDownload, IconPaymentOptions } = assetsPng;
type Props = {}

const PdfReader = (props: Props) => {
    const route = useRoute<PdfReaderRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { invoice_link } = route.params;
    const source = { uri: invoice_link, cache: true };

    const openPDF = async () => {
        try {
            await Linking.openURL(invoice_link);
        } catch (err) {
            console.error("An error occurred", err);
            Alert.alert("An error occurred while trying to open the PDF.");
        }
    };


    return (
        <View style={styles.container}>
            <View
                style={{ position: 'absolute', zIndex: 1, flexDirection: 'row', top: 1, left: 10, backgroundColor: COLORS.primary60, padding: SIZES.base, borderRadius: SIZES.radius }}

            >
                <TouchableOpacity
                    onPress={() => navigation.navigate('Dashboard')}
                    style={{ padding: SIZES.base, borderRadius: 100, backgroundColor: COLORS.white, marginRight: 10 }}
                >
                    <Image
                        source={IconHome}
                        style={{ width: 30, height: 30, tintColor: COLORS.primary }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => openPDF()}
                    style={{ padding: SIZES.base, borderRadius: 100, backgroundColor: COLORS.white, marginRight: 10 }}
                >
                    <Image
                        source={IconDownload}
                        style={{ width: 30, height: 30, tintColor: COLORS.primary }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('PaymentOption')}
                    style={{ padding: SIZES.base, borderRadius: 100, backgroundColor: COLORS.white, marginRight: 10 }}
                >
                    <Image
                        source={IconPaymentOptions}
                        style={{ width: 30, height: 30, }}
                    />
                </TouchableOpacity>

                {/* <TouchableOpacity
                    onPress={() => navigation.navigate('PaymentOption')}
                    style={{ padding: SIZES.base, borderRadius: 100, backgroundColor: COLORS.white, justifyContent: 'center' }}
                >
                    <Text style={{ ...FONTS.body5 }}>Payment Info</Text>
                </TouchableOpacity> */}

            </View>
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
                style={styles.pdf} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
        position: 'relative'
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});

export default PdfReader