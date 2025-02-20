import { View, Text, StatusBar, TouchableOpacity, ScrollView, RefreshControl, FlatList, ViewStyle, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONTS, SIZES } from '../../assets/theme'
import { Header } from '../../components/UI'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { LocationListProp, NavigationProp } from '../../navigation/navigationTypes'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { ClearAllRouteData, getLocations, LocationItem, SaveLocationPressData, Status } from '../../store/actions/survey/routesAction'
import assetsPng from '../../assets/pngs'
import Loading from '../../components/UI/Loading'
import { ServeyStatus } from '../../types'

const { Bg1, Bg2, IconWarning } = assetsPng;

type Props = {}
type renderCardType = {
    item: LocationItem,
    containerStyle: ViewStyle,
    onPress: () => void,
    index: number
}

const renderCard = ({ item, containerStyle, onPress, index }: renderCardType) => {

    const notesPending = item.notes.length > 0 && item.notes.some(note => note.status !== Status.Completed);
    const pendingNotesCount = notesPending ? item.notes.filter(note => note.status !== Status.Completed).length : 0;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ height: 150, width: 200, ...containerStyle, position: 'relative' }}>
            <Image
                source={item.status === ServeyStatus.Pending ? Bg1 : Bg2}
                resizeMode='cover'
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: SIZES.radius
                }}
            />

            <View style={{
                position: 'absolute',
                top: 10,
                left: 10
            }}>
                <Text style={{ ...FONTS.h3, color: COLORS.white, }} numberOfLines={1}>Route # {item.route_no}</Text>
            </View>

            <View style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: COLORS.dark60, 
                width: 30, 
                height: 30, 
                borderRadius: 7,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{ ...FONTS.h3, color: COLORS.white }} numberOfLines={1}>{index + 1}</Text>
            </View>
            
            <View style={{
                position: 'absolute',
                bottom: 35,
                left: 10
            }}>
                <Text style={{ ...FONTS.h3, color: COLORS.white, }} numberOfLines={1}>{item.customer?.str_addr ?? ''}</Text>
                <Text style={{ ...FONTS.h4, color: COLORS.white, }}>{item.cus_name}</Text>
                <Text style={{ ...FONTS.body4, color: COLORS.white, maxWidth: 90 }} numberOfLines={1}>{item.cus_fac_id}</Text>
            </View>

            <View style={{
                position: 'absolute',
                bottom: 5,
                right: 5,
            }}>
                <Text style={{ ...FONTS.body5, color: item.status === ServeyStatus.Completed ? COLORS.green : COLORS.red, backgroundColor: COLORS.transparentWhite1, paddingHorizontal: SIZES.base, borderRadius: SIZES.radius, marginBottom: 3, width: 160, textAlign: 'center' }}>Inspection: {item.status === ServeyStatus.Completed ? 'Completed' : 'Pending'}</Text>
                {notesPending && <Text style={{ ...FONTS.body5, color: !notesPending ? COLORS.green : COLORS.red, backgroundColor: COLORS.transparentWhite1, paddingHorizontal: SIZES.base, borderRadius: SIZES.radius, marginBottom: 3, width: 160, textAlign: 'center' }}>Notes: {Status.Pending} ({pendingNotesCount})</Text>}
                <Text style={{ ...FONTS.body5, color: item.hasInvoice ? COLORS.green : COLORS.red, backgroundColor: COLORS.transparentWhite1, paddingHorizontal: SIZES.base, borderRadius: SIZES.radius, width: 160, textAlign: 'center' }}>Invoiced: {item.hasInvoice ? 'Yes' : 'No'} <Text style={{ color: item.invPaid ? COLORS.green : COLORS.red }}>{item.invPaid ? '- Paid' : '- Unpaid'}</Text></Text>
            </View>
        </TouchableOpacity>
    )
}

const LocationScreen = (props: Props) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<LocationListProp>();
    const { ro_loc_id } = route.params;

    const user = useSelector((state: RootState) => state.authReducer.user);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoarding] = useState<boolean>(false)
    const [LocationArray, setLocationArray] = useState<LocationItem[]>([]);

    const fetchData = async (ro_loc_id: number) => {
        setIsLoarding(true);
        dispatch(ClearAllRouteData());
        const fetchArray = await getLocations(dispatch, ro_loc_id)

        setLocationArray(fetchArray)
        setIsLoarding(false);
    };

    useEffect(() => {
        if (isFocused) fetchData(ro_loc_id);
    }, [isFocused])

    const pullToRefresh = async () => {
        setIsRefreshing(true);
        await fetchData(ro_loc_id)
        setIsRefreshing(false);
    };

    const onPressItem = (
        ro_loc_id: number,
        cus_id: number,
        list_id: number,
        status: LocationItem['status'],
        notes: LocationItem['notes'],        
        cus_name: string,
        rec_logs: number | string,
        hasInvoice: boolean | undefined,

    ) => {

        dispatch(SaveLocationPressData(ro_loc_id, cus_id, list_id, notes, status, cus_name, rec_logs, hasInvoice));
        navigation.navigate('StoreList')

    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} />
            {isLoading && <Loading />}
            {/* Header */}
            {/* <Header
                containerStyles={{ height: 20, paddingHorizontal: SIZES.padding, marginVertical: 14, alignItems: 'center' }}
                title={"Location"}
                rightComponent={
                    <TouchableOpacity
                        style={{ borderRadius: SIZES.radius, alignItems: "center", justifyContent: 'center', backgroundColor: COLORS.orange, }}
                        onPress={() => null}>
                        <Text numberOfLines={1} style={[FONTS.h4, { color: COLORS.white2 }]}>{user?.name}</Text>
                    </TouchableOpacity>
                }
            /> */}
            <View style={{ flex: 1, }}>

                <FlatList
                    data={LocationArray}
                    // numColumns={2}
                    scrollEnabled={true}
                    keyExtractor={item => `location-${item.id}`}
                    contentContainerStyle={{
                        marginTop: SIZES.radius,
                        paddingBottom: SIZES.padding
                    }}
                    renderItem={({ item, index }) => (
                        renderCard({
                            item,
                            containerStyle: {
                                height: 145,
                                width: SIZES.width - (SIZES.radius * 2), // - SIZES.radius),
                                marginTop: SIZES.radius,
                                marginHorizontal: SIZES.radius // : SIZES.padding
                            },
                            onPress: () => onPressItem(item.id, item.cus_id, item.list_id, item.status, item.notes, item.cus_name, item.customer.rec_logs, item.hasInvoice),
                            index
                        })
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={pullToRefresh}
                        />
                    }
                />
            </View>
        </View>
    )
}

export default LocationScreen