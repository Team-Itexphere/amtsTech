import { View, Text, StatusBar, TouchableOpacity, Image, FlatList, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getServiceCallList, ServiceCallListType } from '../../store/actions/ServiceCall/ServiceCallAction';
import { NavigationProp } from '../../navigation/navigationTypes';
import { COLORS, FONTS, SIZES } from '../../assets/theme';
import NoDataImage from '../../components/UI/NoDataImage';
import Loading from '../../components/UI/Loading';
import assetsPng from "../../assets/pngs"
import { Status } from '../../types';
import { clearServiceCallData } from '../../store/actions/ServiceCall/ServiceCallStateAction';
import { formatDateUS, formatDateWithHyphen } from '../../utils/dateFormatter';
import { format, parse } from 'date-fns';

type renderCardType = {
    item: ServiceCallListType,
    containerStyle: ViewStyle,
    onPress: () => void
}
const { Bg1, Bg2, IconRefresh } = assetsPng;

const formatTimeWithAmPm = (timeString: string) => {
    const parsedTime = parse(timeString, 'HH:mm', new Date());

    return format(parsedTime, 'hh:mm a');
};

const renderCard = ({ item, containerStyle, onPress }: renderCardType) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ height: 120, width: 200, ...containerStyle, position: 'relative' }}>
            <Image
                source={item.status === Status.Pending ? Bg1 : Bg2}
                resizeMode='cover'
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: SIZES.radius
                }}
            />

            <View style={{
                position: 'absolute',
                bottom: 10,
                left: 10
            }}>
                <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: SIZES.base }}>
                    <View style={{
                        width: 60, borderRadius: SIZES.base,
                        backgroundColor: item.priority === 'High' ? COLORS.red : COLORS.orange
                    }}>
                        <Text style={{ ...FONTS.h5, color: COLORS.white, textAlign: 'center' }}>{item.priority}</Text>
                    </View>
                    <Text style={{ ...FONTS.h5, color: COLORS.white, marginLeft: SIZES.base }} numberOfLines={1}>{item.store_name}</Text>
                </View>
                <Text style={{ ...FONTS.h4, color: COLORS.white, }} numberOfLines={1}>{item.store_address}</Text>
                <Text style={{ ...FONTS.h3, color: COLORS.white, maxWidth: 310 }} numberOfLines={1}>{item.id}</Text>
                <Text style={{ ...FONTS.h4, color: COLORS.white, maxWidth: 310 }} numberOfLines={1}>
                    Date: {item.status === Status.Pending && item.date ? formatDateUS(item.date, 'MM-DD-YYYY') : (item.status === Status.Completed && item.comp_date ? formatDateUS(item.comp_date, 'MM-DD-YYYY') : 'N/A')}
                    , Time: {item.status === Status.Pending && item.time  ? formatTimeWithAmPm(item.time) : (item.status === Status.Completed && item.comp_time ? formatTimeWithAmPm(item.comp_time) : 'N/A')}
                </Text>
                {/* <Text style={{ ...FONTS.body4, color: COLORS.white, maxWidth: 90 }} numberOfLines={1}>{item.tech_id}</Text> */}
            </View>

            <View style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                alignItems: 'center'
            }}>
                <Text style={{ ...FONTS.body5, color: item.status === Status.Completed ? COLORS.green : COLORS.red, backgroundColor: COLORS.transparentWhite1, paddingHorizontal: SIZES.base, borderRadius: SIZES.radius }}>{item.status === Status.Completed ? Status.Completed : Status.Pending}</Text>
            </View>
        </TouchableOpacity>
    )
}

const ServiceListScreen = ({ status }: { status: Status }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const navigation = useNavigation<NavigationProp>();

    const [isLoading, setIsLoarding] = useState<boolean>(false)
    const [serviceCallData, setServiceCallData] = useState<ServiceCallListType[]>()

    const fetchData = async () => {
        setIsLoarding(true);
        const fetchArray = await getServiceCallList(dispatch)
        if (fetchArray) setServiceCallData(fetchArray)
        setIsLoarding(false);
    };

    useEffect(() => {
        fetchData();
        dispatch(clearServiceCallData());
    }, [])

    const onPressItem = (item: ServiceCallListType) => {
        navigation.navigate('ServiceCallView', item)
    }

    if (!isLoading && serviceCallData?.length === 0) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <NoDataImage />
            <Text style={{ ...FONTS.body2 }}>No Service Calls Available</Text>
        </View>
    )

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white, marginTop: SIZES.base }}>
            <StatusBar backgroundColor={COLORS.white} />
            {isLoading && <Loading />}
            <View style={{ display: 'flex', alignItems: 'flex-end', marginRight: SIZES.base * 2 }}>
                <TouchableOpacity onPress={() => fetchData()}>
                    <Image
                        source={IconRefresh}
                        style={{ width: 25, height: 25, }}
                    />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, }}>
                <FlatList
                    data={serviceCallData?.filter((val) => val.status === status)}
                    // numColumns={2}
                    scrollEnabled={true}
                    keyExtractor={item => `location-${item.id}`}
                    contentContainerStyle={{
                        // marginTop: SIZES.radius,
                        paddingBottom: SIZES.padding
                    }}
                    renderItem={({ item, index }) => (
                        renderCard({
                            item,
                            containerStyle: {
                                // height: 90,
                                width: SIZES.width - (SIZES.radius * 2), // - SIZES.radius),
                                marginTop: SIZES.radius,
                                marginHorizontal: SIZES.radius // : SIZES.padding
                            },
                            onPress: () => onPressItem(item)
                        })
                    )}
                />
            </View>
        </View>
    )
}

export default ServiceListScreen