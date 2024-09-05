import { View, Text, StatusBar, FlatList, TouchableOpacity, Dimensions, Image, ImageSourcePropType } from 'react-native'
import React, { useEffect, useState } from 'react'
import ImageView from "react-native-image-viewing";
import { Image as ImageCompressor } from 'react-native-compressor';

import { COLORS, SIZES } from '../../assets/theme';
import FastImage from 'react-native-fast-image';
import assetsPng from '../../assets/pngs';
import { handleCameraLaunch, ImageLibraryPicker, resultAssets } from '../../utils/cameraHandler';
import { useDispatch, useSelector } from 'react-redux';
import { getAllImageList, ImageType, postImageCapture, postImageCaptureReqBody } from '../../store/actions/survey/picturesAction';
import { useIsFocused } from '@react-navigation/native';
import { RootState } from '../../store/store';
import Loading from '../../components/UI/Loading';
const { IconAddPhoto, IconGallery } = assetsPng

// type ImageItem = {
//     id: number;
//     src: string;
// };
type AddButtonProps = {
    handleAction: () => void;
    icon: ImageSourcePropType;
};

function renderButton({ handleAction, icon }: AddButtonProps) {
    return (
        <TouchableOpacity
            onPress={() => handleAction()}
            style={{
                width: 40,
                marginRight: 14,
                marginVertical: SIZES.base,
                padding: 5,
                borderRadius: 20,
                backgroundColor: COLORS.primary90,
            }}>
            <Image
                alt="home"
                source={icon}
                resizeMode="contain"
                style={{
                    width: 30,
                    height: 30,
                    tintColor: COLORS.white,
                }}
            />
        </TouchableOpacity>
    );
}
const ImageViewScreen = () => {
    const { width, height } = Dimensions.get('window');
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const { location: { cus_id, list_id } } = useSelector((state: RootState) => state.routeReducer);

    const [isShowImage, setIsShowImage] = useState<{ isVisible: boolean, imgIndex: number }>({ isVisible: false, imgIndex: 0 })

    const [isLoading, setIsLoarding] = useState<boolean>(false)
    const [imageuri, setImageuri] = useState('')
    const [imagesList, setImagesList] = useState<string[]>([])


    const fetchData = async (cus_id: number) => {
        setIsLoarding(true);
        const queryParam = {
            cus_id: cus_id,
            type: ImageType.PICTURE
        }
        const fetchArray = await getAllImageList(dispatch, queryParam)
        if (fetchArray) setImagesList(fetchArray.images)

        setIsLoarding(false);
    };

    useEffect(() => {
        if (cus_id) fetchData(cus_id);
    }, [])

    // useEffect(() => {
    //     const items = Array.apply(null, Array(120)).map((v, i) => {
    //         return {
    //             id: i,
    //             src: 'https://unsplash.it/400/400?image=' + (i + 1)
    //         }
    //     })

    //     setImagesList(items)
    // }, [])

    const processImage = async (imageRes: resultAssets) => {
        if (!cus_id || !list_id) return console.warn("cus_id or list_id -> null");
        if (!imageRes || !imageRes.base64 || !imageRes.uri) return console.warn("imageRes -> null");

        let compressedImage: string;
        setIsLoarding(true);

        try {
            const result = await ImageCompressor.compress(imageRes.uri, {
                returnableOutputType: 'base64',
                compressionMethod: 'auto'
            });
            compressedImage = result;
        } catch (error) {
            console.error("Image compression error:", error);
            compressedImage = imageRes.base64;
        }

        const body: postImageCaptureReqBody = {
            cus_id: cus_id!,
            list_id: list_id!,
            image: compressedImage,
            type: ImageType.PICTURE
        };

        const postRes = await postImageCapture(dispatch, body);
        setIsLoarding(false);
        if (!postRes) return console.error("Error in postImageCapture. Please check.");
        setImagesList(postRes.images);
    };

    const handleCamera = async () => {
        const cameraRes: resultAssets = await handleCameraLaunch()
        await processImage(cameraRes);
    }

    const handleImagePick = async () => {
        const imageRes: resultAssets = await ImageLibraryPicker();
        await processImage(imageRes);
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar backgroundColor={COLORS.white} />
            {isLoading && <Loading />}
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                {renderButton({
                    handleAction: handleImagePick,
                    icon: IconGallery,
                })}
                {renderButton({
                    handleAction: handleCamera,
                    icon: IconAddPhoto,
                })}
            </View>
            <FlatList
                data={imagesList}
                keyExtractor={(item, index) => `image-${index}-${item}`}
                renderItem={({ item, index }) => (

                    <TouchableOpacity onPress={() => setIsShowImage({ isVisible: true, imgIndex: index })}>
                        <FastImage
                            style={{ width: width / 3, height: width / 3 }}
                            source={{
                                uri: item,
                                headers: { Authorization: 'someAuthToken' },
                                priority: FastImage.priority.low,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </TouchableOpacity>

                )}
                numColumns={3}
            />
            <ImageView
                images={imagesList.map((d: string) => ({ uri: d }))}
                imageIndex={isShowImage.imgIndex}
                visible={isShowImage.isVisible}
                onRequestClose={() => setIsShowImage({ isVisible: false, imgIndex: 0 })}
            />

        </View>
    )
}

export default ImageViewScreen