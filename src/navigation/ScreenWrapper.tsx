import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SIZES } from '../assets/theme';
import TabButton from '../components/TabButton';
import { appConfig, Screens } from '../config/app';
import assetsPng from '../assets/pngs'
import { Header } from '../components/UI';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp, RootStackParamList } from './navigationTypes';
const { IconHome, IconFleet, IconWorkOrder, IconSettings, IconSignOut } = assetsPng

type ScreenName = keyof Screens;

const ScreenWrapper = ({ children, selectedTab, setSelectedTab, ScreenName }: any) => {
    const navigation = useNavigation<NavigationProp>();
    type RouteType = RouteProp<RootStackParamList>;
    const route = useRoute<RouteType>();

    const isFocused = (label: any) => selectedTab === label;
    const user = useSelector((state: RootState) => state.authReducer.user);


    const handleNavigate = (name: ScreenName) => {
        setSelectedTab(name)
        switch (name) {
            case appConfig.screens.Route:
                return navigation.navigate('Route');
            case appConfig.screens.fleet:
                return navigation.navigate('Fleet');
            case appConfig.screens.Settings:
                return navigation.navigate('Settings');
            case appConfig.screens.Dashboard:
                return navigation.navigate('Dashboard');
            case appConfig.screens.ServiceCall:
                return navigation.navigate('ServiceCall');
            default:
                return console.warn("tab nav issue ::");
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: COLORS.white }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

            <StatusBar backgroundColor={COLORS.white} />
            {/* Header */}
            <Header
                containerStyles={{ paddingHorizontal: SIZES.padding, alignItems: 'center' }}
                title={ScreenName}
                leftComponent={!Object.values(appConfig.screens).includes(ScreenName) ? true : false}
                rightComponent={
                    <TouchableOpacity
                        style={{ borderRadius: SIZES.radius, alignItems: "center", justifyContent: 'center', backgroundColor: COLORS.orange, }}
                        onPress={() => setSelectedTab("Settings")}>
                        <Text numberOfLines={1} style={[FONTS.h4, { color: COLORS.white2 }]}>{user?.name}</Text>
                    </TouchableOpacity>
                }
            />

            {/* Content */}
            <View style={{ flex: 1 }}>
                {children}
            </View>


            {/* Footer */}
            <View style={{ height: 70, justifyContent: 'flex-end' }}>
                {/* Shadow */}
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 4 }}
                    colors={[COLORS.transparent, COLORS.black]}
                    style={{
                        position: 'absolute',
                        top: -20,
                        left: 0,
                        right: 0,
                        height: 100,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    }}
                />

                {/* Tabs */}
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        paddingHorizontal: SIZES.radius,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: COLORS.white,
                    }}
                >
                    <TabButton
                        label={appConfig.screens.Dashboard}
                        icon={IconHome}
                        isFocused={isFocused('Dashboard')}
                        onPress={() => handleNavigate("Dashboard")}
                    />
                    <TabButton
                        label={appConfig.screens.Route}
                        icon={IconWorkOrder}
                        isFocused={isFocused('Route')}
                        onPress={() => handleNavigate('Route')}
                    />
                    <TabButton
                        label={appConfig.screens.ServiceCall}
                        icon={IconWorkOrder}
                        isFocused={isFocused('ServiceCall')}
                        onPress={() => handleNavigate('ServiceCall')}
                    />
                    <TabButton
                        label={appConfig.screens.fleet}
                        icon={IconFleet}
                        isFocused={isFocused('fleet')}
                        onPress={() => handleNavigate('fleet')}
                    />
                    <TabButton
                        label={appConfig.screens.Settings}
                        icon={IconSettings}
                        isFocused={isFocused('Settings')}
                        onPress={() => handleNavigate('Settings')}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ScreenWrapper;


// useEffect(() => {
//     const unsubscribe = navigation.addListener('state', () => {
//         switch (route.name) {
//             case "Survey":
//                 return setSelectedTab("Route" as ScreenName);
//             case "InvoiceGenerate":
//                 return setSelectedTab("Route" as ScreenName);
//             case "PaymentOption":
//                 return setSelectedTab("Route" as ScreenName);
//             case "PdfReader":
//                 return setSelectedTab("Route" as ScreenName);
//             case "LocationList":
//                 return setSelectedTab("Route" as ScreenName);
//             case "StoreList":
//                 return setSelectedTab("Route" as ScreenName);
//             case "ImageView":
//                 return setSelectedTab("Route" as ScreenName);
//             case "InvoiceSubItems":
//                 return setSelectedTab("Route" as ScreenName);
//             case "StoreLicense":
//                 return setSelectedTab("Route" as ScreenName);
//             case "ATG_I":
//                 return setSelectedTab("Route" as ScreenName);
//             case "ATG_S":
//                 return setSelectedTab("Route" as ScreenName);
//             case "Route":
//                 console.log('called');
//                 return setSelectedTab("Route" as ScreenName);

//             case "Dashboard":
//                 return setSelectedTab("Dashboard" as ScreenName);


//             case "ServiceCall":
//                 return setSelectedTab("ServiceCall" as ScreenName);
//             case "Fleet":
//                 return setSelectedTab("Fleet" as ScreenName);
//             case "Settings":
//                 return setSelectedTab("Settings" as ScreenName);
//         }

//     });
//     return unsubscribe;
// }, [navigation, route, setSelectedTab]);


// useEffect(() => {
//     const unsubscribe = navigation.addListener('state', () => {
//         setSelectedTab(route.name as ScreenName);
//     });
//     return unsubscribe;
// }, [navigation, route, setSelectedTab]);

