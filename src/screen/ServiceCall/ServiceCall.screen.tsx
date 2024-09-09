import { View, Text, StatusBar, FlatList, TouchableOpacity, Animated, Keyboard } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { COLORS, FONTS, SIZES } from '../../assets/theme';
import { Status } from '../../types';
import ServiceListScreen from './ServiceList.screen';

type LayoutMeasurement = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const serviceCall_tabs = [{ id: 1, label: "Pending" }, { id: 0, label: "Completed" },]
const serviceCall_tabs_withRef = serviceCall_tabs.map((val) => ({ ...val, ref: React.createRef<TouchableOpacity>() }))

const TabIndicator = ({ measureLayout, scrollX }: { measureLayout: LayoutMeasurement[], scrollX: Animated.Value }) => {
    const inputRange = serviceCall_tabs_withRef.map((_, i) => i * SIZES.width)
    const tabIndicatorWidth = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure => measure.width)
    })

    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure => measure.x)
    })
    return (
        <Animated.View
            style={{
                position: 'absolute',
                bottom: 0,
                height: 5,
                width: tabIndicatorWidth,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.primary,
                transform: [{
                    translateX
                }]
            }}
        />
    )

}

const Tabs = ({ scrollX, onTabPress }: { scrollX: Animated.Value, onTabPress: (val: number) => void }) => {

    const [measureLayout, setMeasureLayout] = useState<LayoutMeasurement[]>([]);
    const containerRef = useRef<View>(null);

    useEffect(() => {
        const ml: LayoutMeasurement[] = [];
        serviceCall_tabs_withRef.forEach((val) => {
            if (val?.ref?.current && containerRef.current) {
                val?.ref?.current?.measureLayout(
                    containerRef.current,
                    (x, y, width, height) => {
                        ml.push({
                            x, y, width, height
                        })
                        if (ml.length === serviceCall_tabs_withRef.length) {
                            setMeasureLayout(ml)
                        }
                    }
                )
            }
        })
    }, [containerRef.current])

    return (
        <View
            ref={containerRef}
            style={{ flex: 1, flexDirection: 'row', backgroundColor: COLORS.primary20 }}
        >

            {measureLayout.length > 0 && <TabIndicator measureLayout={measureLayout} scrollX={scrollX} />}
            {serviceCall_tabs_withRef.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={`Tab-${index}`}
                        ref={item.ref}
                        style={{
                            flex: 1,
                            paddingHorizontal: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            // backgroundColor: COLORS.primary10
                        }}
                        onPress={() => {
                            Keyboard.dismiss()
                            onTabPress(index)
                        }}
                    >
                        <Text style={{ ...FONTS.h3, fontSize: SIZES.height > 800 ? 16 : 15 }}>{item.label}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const ServiceCallScreen = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList<any>>(null);

    const onTabPress = useCallback((tabIndex: number) => {
        flatListRef?.current?.scrollToOffset({
            offset: tabIndex * SIZES.width,
        });
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} />

            {/* Tabs */}
            <View style={{ height: 60 }}>
                <Tabs scrollX={scrollX} onTabPress={onTabPress} />
            </View>

            <Animated.FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled
                snapToAlignment={'center'}
                snapToInterval={SIZES.width}
                decelerationRate={"fast"}
                keyboardDismissMode={"on-drag"}
                showsHorizontalScrollIndicator={false}
                data={serviceCall_tabs_withRef}
                keyExtractor={item => `serviceCallTab-${item.id}`}
                onScroll={Animated.event([
                    { nativeEvent: { contentOffset: { x: scrollX } } }
                ], {
                    useNativeDriver: false
                })}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ width: SIZES.width }}>
                            {index == 0 && <ServiceListScreen status={Status.Pending} />}
                            {index == 1 && <ServiceListScreen status={Status.Completed} />}
                        </View>
                    )
                }}
            />
        </View >
    )
}

export default ServiceCallScreen