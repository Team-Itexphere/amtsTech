import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp, StoreListProp } from '../../navigation/navigationTypes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { COLORS, SIZES } from '../../assets/theme';
import { ServeyStatus } from '../../types';

type Props = {}

const StoreScreen = (props: Props) => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<StoreListProp>();
    const dispatch = useDispatch();

    const currentLocation = useSelector((state: RootState) => state.routeReducer.location);
    route.params && route.params.newStatus && route.params.newStatus !== undefined && currentLocation.status !== route.params.newStatus && (
        dispatch({
            type: "LOCATION_PRESS_DATA",
            payload: {
                ...currentLocation,
                status: route.params?.newStatus,
            },
        })
    );

    const { location: { ro_loc_id, cus_id, list_id, rec_logs, hasInvoice, status, allowInv } } = useSelector((state: RootState) => state.routeReducer);
    useEffect(() => {
        console.log("Route Location ID:", ro_loc_id);
        console.log("Customer ID:", cus_id);
        console.log("List ID:", list_id);
        console.log("Rec Logs:", rec_logs);
        console.log("HasInvoice:", hasInvoice);
        console.log("AllowInvoice:", allowInv);
        console.log("Status:", status);
      }, [rec_logs]);
    const buttons = [
        { title: 'Monthly Inspection', icon: '📅' },
        { title: 'Sensor/CSLD Tickets', icon: '📊' },
        { title: 'Inventory Tickets', icon: '📦' },
        { title: 'Store Licenses', icon: '🏪' },
        { title: 'Invoice', icon: '💼' },
        { title: 'Pictures', icon: '📷' },
        { title: 'Maintainance Log', icon: '⚙️' },
        { title: 'Rectifier Log', icon: '📝' },
        { title: 'Site Info', icon: '🏷️' },
        { title: 'Notes', icon: '🗒️' }
    ];

    const handleButtonPress = (title: string) => {

        switch (title) {
            case 'Monthly Inspection':
                if (!ro_loc_id || !cus_id || !list_id) return console.warn(" ro_loc_id, cus_id, list_id  -> null");
                navigation.navigate('Survey');
                break;
            case 'Pictures':
                navigation.navigate('ImageView');
                break;
            case 'Sensor/CSLD Tickets':
                navigation.navigate('ATG_S');
                break;
            case 'Inventory Tickets':
                navigation.navigate('ATG_I');
                break;
            case 'Rectifier Log':
                navigation.navigate('Rec_Log');
                break;
            case 'Invoice':
                // navigation.navigate('InvoiceGenerate');
                navigation.navigate('InvoiceSubItems', { source: "store" });
                break;
            case 'Store Licenses':
                navigation.navigate('StoreLicense');
                break;
            case 'Site Info':
                if (!cus_id) return console.warn("cus_id  -> null");
                navigation.navigate('SiteInfo');
                break;
            case 'Notes':
                navigation.navigate('Notes');
                break;
            case 'Maintainance Log':
                navigation.navigate('MaintainsLogs');
                break;
            default:
                console.warn('No action for this title');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                {buttons.map((button, index) => (
                    <TouchableOpacity
                        key={index}
                        style={rec_logs == "1" && button.title === "Rectifier Log" ? styles.button : (button.title === "Rectifier Log" || (!list_id && button.title === "Monthly Inspection") ? { display: 'none' } : styles.button)} //[styles.button, { backgroundColor: COLORS.lightGray1 }] 
                        onPress={() => handleButtonPress(button.title)}
                    >
                        <Text style={styles.icon}>{button.icon}</Text>
                        <Text style={styles.buttonText}>{button.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        margin: 10,
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
    icon: {
        fontSize: SIZES.base * 3,
        marginBottom: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: '#000',
        fontWeight: 'bold',
    },
});

export default StoreScreen;
