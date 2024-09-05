import { View, Text, StatusBar, FlatList, ViewStyle, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getServiceCallList, ServiceCallListType } from '../../store/actions/ServiceCall/ServiceCallAction';
import { COLORS, FONTS, SIZES } from '../../assets/theme';
import Loading from '../../components/UI/Loading';
import { Status } from '../../types';
import assetsPng from "../../assets/pngs"
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigation/navigationTypes';
import NoDataImage from '../../components/UI/NoDataImage';

const { Bg1, Bg2, IconHighPriority, IconLowPriority, IconRefresh } = assetsPng;

type Props = {}
type renderCardType = {
    item: ServiceCallListType,
    containerStyle: ViewStyle,
    onPress: () => void
}
const renderCard = ({ item, containerStyle, onPress }: renderCardType) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ height: 100, width: 200, ...containerStyle, position: 'relative' }}>
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


const ServiceCallScreen = (props: Props) => {
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
        if (isFocused) fetchData();
    }, [isFocused])

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
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} />
            {isLoading && <Loading />}
            <View style={{ display: 'flex', alignItems: 'flex-end', marginRight: SIZES.base * 2 }}>
                <TouchableOpacity onPress={() => fetchData()}>
                    <Image
                        source={IconRefresh}
                        style={{ width: 30, height: 30, }}
                    />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, }}>
                <FlatList
                    data={serviceCallData}
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

export default ServiceCallScreen