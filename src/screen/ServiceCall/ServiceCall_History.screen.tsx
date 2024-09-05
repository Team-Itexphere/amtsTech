import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ImageView from "react-native-image-viewing";

import { getServiceCall_HistoryList, ServiceCall_HistoryType } from '../../store/actions/ServiceCall/ServiceCallAction';
import { ServiceCallHistoryProp } from '../../navigation/navigationTypes';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import TextButton from '../../components/UI/TextButton';
import { COLORS, FONTS, SIZES } from '../../assets/theme';
import Loading from '../../components/UI/Loading';



const renderItem = ({ item, showImagesHandler }: { item: ServiceCall_HistoryType, showImagesHandler: (val: string[]) => void }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.name}>{item.tech_name}</Text>
        <Text style={styles.comment}>{item.comment || 'No comment'}</Text>

        {item.images.length > 0 &&
            <TextButton
                label={`View Images - ${item.images.length.toString().padStart(2, '0')}`}
                contentContainerStyle={{
                    padding: SIZES.base - 5,
                    paddingHorizontal: SIZES.base,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.transparentBlack1,
                }}
                labelStyle={{
                    ...FONTS.h3,
                    color: COLORS.black,
                    textDecorationLine: 'underline',
                }}
                onPress={() => showImagesHandler(item.images)}
            />
        }
    </View>
);

const Footer = ({ imageIndex, imagesCount }: {
    imageIndex: number;
    imagesCount: number;
}) => (
    <View style={styles.footer}>
        <Text style={styles.footerText}>{`${imageIndex + 1}/${imagesCount}`}</Text>
    </View>
);
const ServiceCallHistoryScreen = () => {
    const dispatch = useDispatch();
    const route = useRoute<ServiceCallHistoryProp>();
    const { work_order_id } = route.params;

    const [isShowImages, setIsShowImages] = useState<{ isVisible: boolean, imageArray: string[] }>({ isVisible: false, imageArray: [] })
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serviceCallHistoryList, setServiceCallHistoryList] = useState<ServiceCall_HistoryType[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        const fetchArray = await getServiceCall_HistoryList(dispatch, work_order_id);
        if (fetchArray) setServiceCallHistoryList(fetchArray);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showImagesHandler = (images: string[]) => {
        setIsShowImages({ isVisible: true, imageArray: images })
    }

    return (
        <View style={styles.container}>
            {isLoading && <Loading />}
            <FlatList
                data={serviceCallHistoryList}
                renderItem={({ item }) => renderItem({ item, showImagesHandler })}
                keyExtractor={(item) => item.id.toString()}
            />

            <ImageView
                images={isShowImages.imageArray.map((d: string) => ({ uri: d }))}
                imageIndex={0}
                visible={isShowImages.isVisible}
                onRequestClose={() => setIsShowImages({ isVisible: false, imageArray: [] })}
                FooterComponent={({ imageIndex }) => (
                    <Footer imageIndex={imageIndex} imagesCount={isShowImages.imageArray.length} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    itemContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    comment: {
        fontSize: 16,
        marginBottom: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
    footer: {
        height: 50,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        alignItems: "center",
        justifyContent: "center",
    },
    footerText: {
        color: "#FFF",
        fontSize: 16,
    },
});

export default ServiceCallHistoryScreen;