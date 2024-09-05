import { View, Text, TouchableOpacity, FlatList, ViewStyle, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, FONTS } from '../../assets/theme'
import { NavigationProp } from '../../navigation/navigationTypes'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { ClearAllRouteData, RouteItem, Status, getRoutes } from '../../store/actions/survey/routesAction'
import assetsPng from '../../assets/pngs'
import TextButton from '../../components/UI/TextButton'
import DateTimePicker from '../../components/thirdParty/DatePicker'
import { formatDateWithHyphen } from '../../utils/dateFormatter'
import Loading from '../../components/UI/Loading'
import ResponseModal from '../../components/UI/Modals/ResponseModal'

const { Bg1, Bg2, IconWarning, IconRefresh } = assetsPng;
type Props = {}
type renderCardType = {
  item: RouteItem,
  containerStyle: ViewStyle,
  onPress: () => void
}
type visibleHomeState = {
  modalName: "month_mismatch" | ""
  isVisible: boolean,
  data?: any
}


const RouteScreen = (props: Props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp>();

  const [date, setDate] = useState<Date>(new Date())
  const [isLoading, setIsLoarding] = useState<boolean>(false)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [routeArray, setRouteArray] = useState<RouteItem[]>([]);
  const [isDatePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [Model, setModel] = useState<visibleHomeState>({
    modalName: '',
    isVisible: false,
    data: null
  })

  const formatted_AmericanDate = formatDateWithHyphen(date, 'MM-DD-YYYY');
  const formattedDate = formatDateWithHyphen(date, 'DD-MM-YYYY');

  useEffect(() => {
    if (isFocused) fetchData(formattedDate);
  }, [isFocused])

  const fetchData = async (formattedDate: string) => {
    setIsLoarding(true);

    dispatch(ClearAllRouteData());
    const fetchArray = await getRoutes(dispatch, formattedDate)

    setRouteArray(fetchArray)
    setIsLoarding(false);
  };

  const changeDate = (date: Date) => {
    let tempDate = new Date(date);
    // let currentDate = new Date();
    setDatePickerOpen(false)

    // Check if the selected date's month and year match the current date's month and year
    // const isCurrentMonth = tempDate.getMonth() === currentDate.getMonth()
    //   && tempDate.getFullYear() === currentDate.getFullYear();
    // if (!isCurrentMonth) return setModel({ isVisible: true, modalName: "month_mismatch", data: tempDate });

    setDate(tempDate)
    fetchData(formatDateWithHyphen(tempDate, 'DD-MM-YYYY'));
  }


  const onPressItem = (ro_loc_id: number, status: RouteItem['status']) => {

    // if (status === Status.Completed) return Alert.alert('Already Completed', '', [
    //   { text: 'OK', onPress: () => console.log('OK Pressed') },
    // ]);

    let tempDate = new Date(date);
    let currentDate = new Date();
    // Check if the selected date's month and year match the current date's month and year
    const isCurrentMonth = tempDate.getDay() !== currentDate.getDay()
    if (isCurrentMonth && status === Status.Pending) return

    //  setModel({ isVisible: true, modalName: "month_mismatch", data: {} });

    navigation.navigate('LocationList', { ro_loc_id: ro_loc_id })

  }

  const renderCard = ({ item, containerStyle, onPress }: renderCardType) => {

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{ height: 150, width: 200, ...containerStyle, position: 'relative' }}>
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
          <Text style={{ ...FONTS.h4, color: COLORS.white, }}>{item.name}</Text>
          <Text style={{ ...FONTS.body4, color: COLORS.white, maxWidth: 90 }} numberOfLines={1}>{item.tech_id}</Text>
        </View>

        <View style={{
          position: 'absolute',
          bottom: 10,
          right: 10
        }}>
          <Text style={{ ...FONTS.body5, color: COLORS.red, backgroundColor: COLORS.transparentWhite1, paddingHorizontal: SIZES.base, borderRadius: SIZES.radius, }}>{item.status ? item.status : 'pending'}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const pullToRefresh = async () => {
    setIsRefreshing(true);
    const fetchArray = await getRoutes(dispatch, formattedDate)
    setRouteArray(fetchArray)
    setIsRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ marginTop: SIZES.base, flex: 1, }}>
        <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: SIZES.padding }}>
          <View style={{ flexDirection: 'row', }}>
            <Text style={{ ...FONTS.h2 }}>Routes: </Text>
            <TextButton label={formatted_AmericanDate}
              contentContainerStyle={{ width: 120, borderRadius: 30, }}
              labelStyle={{ ...FONTS.body3, color: COLORS.white, }}
              onPress={() => setDatePickerOpen(true)}
            />
          </View>
          <View style={{ display: 'flex', alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => fetchData(formattedDate)}>
              <Image
                source={IconRefresh}
                style={{ width: 30, height: 30, }}
              />
            </TouchableOpacity>
          </View>
        </View>


        <FlatList
          data={routeArray}
          numColumns={2}
          scrollEnabled={true}
          keyExtractor={item => `route-${item.id}`}
          contentContainerStyle={{
            marginTop: SIZES.radius,
            paddingBottom: SIZES.padding
          }}
          renderItem={({ item, index }) => (
            renderCard({
              item,
              containerStyle: {
                height: 130,
                width: (SIZES.width - (SIZES.padding * 2) - SIZES.radius) / 2,
                marginTop: SIZES.radius,
                marginLeft: (index + 1) % 2 === 0 ? SIZES.radius : SIZES.padding
              },
              onPress: () => onPressItem(item.id, item.status)
            })
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={pullToRefresh}
            />
          }
        />

        <DateTimePicker
          title='Please Select Date'
          isOpen={isDatePickerOpen}
          date={new Date()}
          confirmText='Add Your Date'
          cancelText='Cancel'
          changeDate={(date) => changeDate(date)}
          onCancel={() => setDatePickerOpen(false)}
        />
        {isLoading && <Loading />}
        {(Model.isVisible && Model.modalName === "month_mismatch") && <ResponseModal
          isVisible={Model.isVisible}
          setIsVisible={(val) => setModel({ modalName: "", isVisible: val })}
          title='You really want to proceed?'
          description='Selected one is not belongs to this month'
          icon={IconWarning}
          actions={[
            {
              label: 'Yes',
              onPress: () => {
                setModel({ modalName: "", isVisible: false })
              },
              contentContainerStyle: { flex: 1, borderRadius: SIZES.radius },
              labelStyle: { color: COLORS.white }
            },
            {
              label: 'No',
              onPress: () => setModel({ modalName: "", isVisible: false }),
              contentContainerStyle: { flex: 1, backgroundColor: COLORS.lightOrange2, borderRadius: SIZES.radius, marginLeft: SIZES.base },
              labelStyle: { color: COLORS.primary }
            }
          ]}
        />}
      </View>
    </View>
  )
}

export default RouteScreen