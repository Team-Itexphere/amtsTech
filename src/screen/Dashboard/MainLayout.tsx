import {
    View,
    Text,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native';
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import { Screens, appConfig, bottom_tabs, screens } from '../../config/app';
import assetsPng from '../../assets/pngs'
import { RootState } from '../../store/store';
import { logout } from '../../store/actions/authentication/authAction';
import { COLORS, FONTS, SIZES } from '../../assets/theme';

import { Header } from '../../components/UI';

// import FleetScreen from './fleet.sceen';
import TabButton from '../../components/TabButton';

import HeaderModal from '../../components/UI/Modals/HeaderModal';
import Loading from '../../components/UI/Loading';

const RouteScreen = React.lazy(() => import('./Route.screen'));
const FleetScreen = React.lazy(() => import('./fleet.sceen'));
const SettingsScreen = lazy(() => import('./settings.screen'));

const { IconHome, IconFleet, IconWorkOrder, IconSettings, IconSignOut } = assetsPng

type ScreenName = keyof Screens;

type Props = {}

const MainLayout = (props: Props) => {


    const flatListRef: any = useRef();

    // Reanimated Shared Value
    // const homeTabFlex = useSharedValue(1)
    // const homeTabColor = useSharedValue(COLORS.white)
    // const routeTabFlex = useSharedValue(1)
    // const routeTabColor = useSharedValue(COLORS.white)
    // const workOrderTabFlex = useSharedValue(1)
    // const workOrderTabColor = useSharedValue(COLORS.white)
    // const settingsTabFlex = useSharedValue(1)
    // const settingsTabColor = useSharedValue(COLORS.white)

    // Reanimated Animated Style
    // const homeFlexStyle = useAnimatedStyle(() => {
    //   return {
    //     flex: homeTabFlex.value
    //   }
    // })
    // const homeColorStyle = useAnimatedStyle(() => {
    //   return {
    //     backgroundColor: homeTabColor.value
    //   }
    // })

    // const routeFlexStyle = useAnimatedStyle(() => {
    //   return {
    //     flex: routeTabFlex.value
    //   }
    // })
    // const routeColorStyle = useAnimatedStyle(() => {
    //   return {
    //     backgroundColor: routeTabColor.value
    //   }
    // })
    // const workOrderFlexStyle = useAnimatedStyle(() => {
    //   return {
    //     flex: workOrderTabFlex.value
    //   }
    // })
    // const workOrderColorStyle = useAnimatedStyle(() => {
    //   return {
    //     backgroundColor: workOrderTabColor.value
    //   }
    // })

    // const settingsFlexStyle = useAnimatedStyle(() => {
    //   return {
    //     flex: settingsTabFlex.value
    //   }
    // })
    // const settingsColorStyle = useAnimatedStyle(() => {
    //   return {
    //     backgroundColor: settingsTabColor.value
    //   }
    // })

    const dispatch: any = useDispatch();
    const navigation: any = useNavigation();
    const isAuth = useSelector((state: RootState) => state.authReducer.isAuthenticated);
    const user = useSelector((state: RootState) => state.authReducer.user);

    const [selectedTab, setSelectedTab] = useState<ScreenName>("Dashboard");
    const [isSelected, setIsSelected] = useState<boolean>(false)

    const [isVisible, setIsVisible] = useState<boolean>(false)


    useEffect(() => {
        if (selectedTab == screens.Dashboard) {
            flatListRef?.current.scrollToIndex({
                index: 0,
                animated: false
            })
            // homeTabFlex.value = withTiming(1, { duration: 500 })
            // homeTabColor.value = withTiming(COLORS.primary, { duration: 500 })
        } else {
            // homeTabFlex.value = withTiming(1, { duration: 500 })
            // homeTabColor.value = withTiming(COLORS.white, { duration: 500 })
        }

        if (selectedTab == screens.Route) {
            flatListRef?.current.scrollToIndex({
                index: 1,
                animated: false
            })
            // routeTabFlex.value = withTiming(1, { duration: 500 })
            // routeTabColor.value = withTiming(COLORS.primary, { duration: 500 })
        } else {
            // routeTabFlex.value = withTiming(1, { duration: 500 })
            // routeTabColor.value = withTiming(COLORS.white, { duration: 500 })
        }

        if (selectedTab == screens.ServiceCall) {
            flatListRef?.current.scrollToIndex({
                index: 2,
                animated: false
            })
            // routeTabFlex.value = withTiming(1, { duration: 500 })
            // routeTabColor.value = withTiming(COLORS.primary, { duration: 500 })
        } else {
            // routeTabFlex.value = withTiming(1, { duration: 500 })
            // routeTabColor.value = withTiming(COLORS.white, { duration: 500 })
        }

        if (selectedTab == screens.fleet) {
            flatListRef?.current.scrollToIndex({
                index: 3,
                animated: false
            })
            // workOrderTabFlex.value = withTiming(1, { duration: 500 })
            // workOrderTabColor.value = withTiming(COLORS.primary, { duration: 500 })
        } else {
            // workOrderTabFlex.value = withTiming(1, { duration: 500 })
            // workOrderTabColor.value = withTiming(COLORS.white, { duration: 500 })
        }
        if (selectedTab == screens.Settings) {
            flatListRef?.current.scrollToIndex({
                index: 4,
                animated: false
            })
            // settingsTabFlex.value = withTiming(1, { duration: 500 })
            // settingsTabColor.value = withTiming(COLORS.primary, { duration: 500 })
        } else {
            // settingsTabFlex.value = withTiming(1, { duration: 500 })
            // settingsTabColor.value = withTiming(COLORS.white, { duration: 500 })
        }
    }, [selectedTab])

    const LazyComponent = ({ label }: { label: ScreenName }) => {
        switch (label) {
            case appConfig.screens.Route:
                return (
                    <Suspense fallback={<Loading />}>
                        <RouteScreen />
                    </Suspense>
                );
            case appConfig.screens.fleet:
                return (
                    <Suspense fallback={<Loading />}>
                        <FleetScreen />
                    </Suspense>
                );
            case appConfig.screens.Settings:
                return (
                    <Suspense fallback={<Loading />}>
                        <SettingsScreen />
                    </Suspense>
                );
            default:
                return <Text>Unknown screen</Text>;
        }
    };

    const logoutPress = async () => {
        await dispatch(logout());
        navigation.navigate('Login');
    };

    const isFocused = (screen: ScreenName): boolean => selectedTab === screen

    return (
        <Animated.View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            <StatusBar backgroundColor={COLORS.white} />

            {/* Header */}
            <Header
                containerStyles={{ height: 20, paddingHorizontal: SIZES.padding, marginVertical: 14, alignItems: 'center' }}
                title={selectedTab}
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
                <FlatList
                    ref={flatListRef}
                    horizontal
                    scrollEnabled={false}
                    pagingEnabled
                    snapToAlignment='center'
                    snapToInterval={SIZES.width}
                    showsHorizontalScrollIndicator={false}
                    data={bottom_tabs}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={({ item, index }: { item: any, index: number }) => {
                        return (
                            <View style={{ flex: 1, width: SIZES.width }}>
                                {item.label == appConfig.screens.Dashboard && <><Text>Working Order</Text></>}
                                {item.label == appConfig.screens.Route && <LazyComponent label={item.label} />}
                                {item.label == appConfig.screens.ServiceCall && <><Text>Service Call</Text></>}
                                {item.label == appConfig.screens.fleet && <LazyComponent label={item.label} />}
                                {item.label == appConfig.screens.Settings && <LazyComponent label={item.label} />}
                            </View>
                        )
                    }}
                />
            </View>

            {/* Footer */}
            <View style={{ height: 70, justifyContent: 'flex-end' }}>
                {/* Shadow */}
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 4 }}
                    colors={[
                        COLORS.transparent, COLORS.black
                    ]}
                    style={{
                        position: 'absolute',
                        top: -20,
                        left: 0,
                        right: 0,
                        height: 100,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15
                    }}
                />

                {/* Tabs */}
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        paddingHorizontal: SIZES.radius,
                        // paddingBottom: 3,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: COLORS.white
                    }}>
                    <TabButton
                        label={appConfig.screens.Dashboard}
                        icon={IconHome}
                        isFocused={isFocused('Dashboard')}
                        // outerContainerStyle={homeFlexStyle} // animations stoped
                        // innerContainerStyle={homeColorStyle} // animations stoped
                        onPress={() => setSelectedTab("Dashboard")}
                    />
                    <TabButton
                        label={appConfig.screens.Route}
                        icon={IconWorkOrder}
                        isFocused={isFocused('Route')}
                        // outerContainerStyle={workOrderFlexStyle} // animations stoped
                        // innerContainerStyle={workOrderColorStyle} // animations stoped
                        onPress={() => setSelectedTab("Route")}
                    />
                    <TabButton
                        label={appConfig.screens.ServiceCall}
                        icon={IconWorkOrder}
                        isFocused={isFocused('ServiceCall')}
                        // outerContainerStyle={workOrderFlexStyle} // animations stoped
                        // innerContainerStyle={workOrderColorStyle} // animations stoped
                        onPress={() => setSelectedTab("ServiceCall")}
                    />
                    <TabButton
                        label={appConfig.screens.fleet}
                        icon={IconFleet}
                        isFocused={isFocused('fleet')}
                        // outerContainerStyle={routeFlexStyle} // animations stoped
                        // innerContainerStyle={routeColorStyle} // animations stoped
                        onPress={() => setSelectedTab("fleet")}
                    />

                    <TabButton
                        label={appConfig.screens.Settings}
                        icon={IconSettings}
                        isFocused={isFocused('Settings')}
                        // outerContainerStyle={settingsFlexStyle} // animations stoped
                        // innerContainerStyle={settingsColorStyle} // animations stoped
                        onPress={() => setSelectedTab("Settings")}
                    />
                </View>
            </View>

            {/* <HeaderModal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        /> */}
        </Animated.View>
    )
}

export default MainLayout