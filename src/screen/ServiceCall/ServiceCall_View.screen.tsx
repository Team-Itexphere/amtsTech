import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ImageSourcePropType, FlatList, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Image as ImageCompressor } from 'react-native-compressor';
import ImageView from "react-native-image-viewing";

import FormInput from '../../components/UI/FormInput'
import { COLORS, FONTS, SIZES } from '../../assets/theme'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NavigationProp, ServiceCallViewProp } from '../../navigation/navigationTypes'
import TextButton from '../../components/UI/TextButton'
import { useDispatch } from 'react-redux'
import { ExtendedFormDataType, postServiceCall_Update } from '../../store/actions/ServiceCall/ServiceCallAction'
import { handleCameraLaunch, ImageLibraryPicker, resultAssets } from '../../utils/cameraHandler'
import CustomDropdown from '../../components/UI/CustomDropdown';
import { Status } from '../../types';
import Loading from '../../components/UI/Loading';
import assetsPng from '../../assets/pngs';
import FastImage from 'react-native-fast-image';

const { IconAddPhoto, IconGallery } = assetsPng

export type FormDataType = {
    status: Status | null;
    start_date: string;
    end_date: string;
    comment: string;
    images: Array<{ uri: string }>;
};

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
                alt="renderButton"
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

const initialState = {
    status: null,
    start_date: "2024-08-05",
    end_date: "2024-08-13",
    comment: "",
    images: []
}

const ServiceCallViewScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ServiceCallViewProp>();
    const params = route.params;

    const [isShowImage, setIsShowImage] = useState<{ isVisible: boolean, imgIndex: number }>({ isVisible: false, imgIndex: 0 })
    const [isLoading, setIsLoarding] = useState<boolean>(false)
    const [formData, setFormData] = useState<FormDataType>(initialState);

    const UpdateServiceCall = async () => {
        if (!formData.comment.trim() && !formData.status) return;

        setIsLoarding(true);
        try {
            const compressedImages = await Promise.all(
                formData.images.map(async (image) => {
                    return await ImageCompressor.compress(image.uri, {
                        returnableOutputType: 'base64',
                        compressionMethod: 'auto'
                    });
                })
            );

            const reqBody: ExtendedFormDataType = {
                id: params.id,
                comment: formData.comment,
                end_date: formData.end_date,
                start_date: formData.start_date,
                images: compressedImages,
                status: null
            }

            if (formData.status) reqBody.status = formData.status;

            const UpdatedServiceCallRes = await postServiceCall_Update(dispatch, reqBody);
            if (formData.status === Status.Completed) return navigation.navigate('ServiceCall')
            if (UpdatedServiceCallRes) setFormData(initialState)
        } catch (error) {
            console.error("Image compression error:", error);
        } finally {
            setIsLoarding(false);
        }
    };


    const pickImage = async (test: 'gallery' | 'camera') => {
        let cameraRes: resultAssets;
        if (test === 'camera') {
            cameraRes = await handleCameraLaunch();
        } else {
            cameraRes = await ImageLibraryPicker();
        }

        if (!cameraRes || !cameraRes.base64 || !cameraRes.uri) return console.warn("imageRes -> null");

        setIsLoarding(true);
        setFormData({
            ...formData,
            images: [...formData.images, { uri: cameraRes.uri }]
        });
        setIsLoarding(false);
    };

    const handleChangeDropdown = (value: FormDataType['status']) => {
        setFormData({ ...formData, status: value })
    };

    const deleteImage = (index: number) => {
        const updatedImages = [...formData.images];
        updatedImages.splice(index, 1);
        setFormData({ ...formData, images: updatedImages });
    };
    return (
        <View style={{ flex: 1 }}>
            {isLoading && <Loading />}
            <View style={{ padding: SIZES.base }}>
                <FormInput
                    containerStyle={{ marginVertical: SIZES.base * 2 }}
                    placeholder="Comment"
                    value={params.comment}
                    editable={false}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ ...FONTS.h3 }}>Update</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        {params.status === Status.Completed && <TextButton
                            label="Invoice 💼"
                            contentContainerStyle={{
                                padding: SIZES.base - 5,
                                paddingHorizontal: SIZES.base,
                                borderRadius: SIZES.radius,
                                backgroundColor: COLORS.transparentBlack1,
                            }}
                            labelStyle={{
                                ...FONTS.h3,
                                color: COLORS.darkGray,
                                textDecorationLine: 'underline',
                            }}
                            onPress={() => navigation.navigate('InvoiceSubItems', { source: "Service Call" })}
                        />}
                        <TextButton
                            label="History ➡️"
                            contentContainerStyle={{
                                padding: SIZES.base - 5,
                                paddingHorizontal: SIZES.base,
                                borderRadius: SIZES.radius,
                                backgroundColor: COLORS.transparentPrimray,
                            }}
                            labelStyle={{
                                ...FONTS.h3,
                                color: COLORS.primary,
                                textDecorationLine: 'underline',
                            }}
                            onPress={() => navigation.navigate('ServiceCall_Histroy', { work_order_id: params.id })}
                        />
                    </View>

                </View>

                <FormInput
                    containerStyle={{ marginVertical: SIZES.base * 2 }}
                    placeholder="Comment"
                    value={formData.comment}
                    onChange={(text) => setFormData({ ...formData, comment: text })}
                />
                <CustomDropdown
                    selectedValue={formData.status || ''}
                    onValueChange={(value) => handleChangeDropdown(value as FormDataType['status'])}
                    options={[Status.Completed, Status.Pending]}
                    placeholder="Status"
                    contentContainerStyle={{ marginVertical: SIZES.base, }}
                />

                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    {renderButton({
                        handleAction: () => pickImage('gallery'),
                        icon: IconGallery,
                    })}
                    {renderButton({
                        handleAction: () => pickImage('camera'),
                        icon: IconAddPhoto,
                    })}
                </View>
            </View>

            <FlatList
                data={formData.images}
                keyExtractor={(item, index) => `image-${index}-${item.uri}`}
                renderItem={({ item, index }) => (
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={() => setIsShowImage({ isVisible: true, imgIndex: index })}>
                            <FastImage
                                style={styles.image}
                                source={{
                                    uri: item.uri,
                                    headers: { Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.low,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deleteImage(index)}
                        >
                            <Text style={styles.deleteButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                )}
                numColumns={3}
                contentContainerStyle={styles.imageList}
            />
            <ImageView
                images={formData.images.map((d: FormDataType['images'][number]) => ({ uri: d.uri }))}
                imageIndex={isShowImage.imgIndex}
                visible={isShowImage.isVisible}
                onRequestClose={() => setIsShowImage({ isVisible: false, imgIndex: 0 })}
            />
            <TextButton
                label="Update"
                contentContainerStyle={{
                    height: 55,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.primary,
                    margin: SIZES.base
                }}
                labelStyle={{
                    ...FONTS.h3,
                    color: COLORS.white
                }}
                onPress={() => UpdateServiceCall()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imagePickerContainer: {
        width: 200,
        height: 100,
        alignSelf: 'center',
        marginVertical: SIZES.base * 2,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageList: {
        marginVertical: SIZES.base * 2,
    },
    imageContainer: {
        width: SIZES.width / 3 - SIZES.base * 2,
        height: SIZES.width / 3 - SIZES.base * 2,
        margin: SIZES.base,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        borderRadius: 15,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
});


export default ServiceCallViewScreen

{/* <FormInput
    containerStyle={{ marginVertical: SIZES.base * 2 }}
    placeholder="End Date - DD-MM-YYYY"
    value={formData.end_date}
    onChange={(text) => setFormData({ ...formData, end_date: text })}
/>
<FormInput
    containerStyle={{ marginVertical: SIZES.base * 2 }}
    placeholder="Start Date - DD-MM-YYYY"
    value={formData.start_date}
    onChange={(text) => setFormData({ ...formData, start_date: text })}
/> */}

{/* {Array(3).fill(null).map((_, index) => (
    <TouchableOpacity
        key={index}
        onPress={handleImageSelection}
        style={styles.imagePickerContainer}
    >
        {formData.images[index] ? (
            <Image source={{ uri: formData.images[index].uri }} style={styles.image} />
        ) : (
            <View style={styles.placeholderContainer}>
                <Text style={{ ...FONTS.body3 }}>Tap to add image</Text>
            </View>
        )}
    </TouchableOpacity>
))} */}