import { View, Text, StatusBar, FlatList, TouchableOpacity, Dimensions, Image, ImageSourcePropType, StyleSheet, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import ImageView from "react-native-image-viewing";
import { Image as ImageCompressor } from 'react-native-compressor';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS, SIZES } from '../../assets/theme';
import FastImage from 'react-native-fast-image';
import assetsPng from '../../assets/pngs';
import { handleCameraLaunch, ImageLibraryPicker, resultAssets } from '../../utils/cameraHandler';
import { deleteImage, getAllImageList, ImageType, postImageCapture, postImageCaptureReqBody } from '../../store/actions/survey/picturesAction';
import { RootState } from '../../store/store';
import Loading from '../../components/UI/Loading';
const { IconAddPhoto, IconGallery, IconClose } = assetsPng

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

const AtgiScreen = () => {
    const { width, height } = Dimensions.get('window');
    const dispatch = useDispatch();

    const { location: { cus_id, list_id } } = useSelector((state: RootState) => state.routeReducer);

    const [isShowImage, setIsShowImage] = useState<{ isVisible: boolean, imgIndex: number }>({ isVisible: false, imgIndex: 0 })

    const [isLoading, setIsLoarding] = useState<boolean>(false)
    const [imagesList, setImagesList] = useState<string[]>([])
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [deleteID, setDeleteID] = useState<number | null>(null);

    const fetchData = async (cus_id: number) => {
        setIsLoarding(true);
        const queryParam = {
            cus_id: cus_id,
            type: ImageType.ATGI
        }
        const fetchArray = await getAllImageList(dispatch, queryParam)
        if (fetchArray) setImagesList(fetchArray.images)
        setIsLoarding(false);
    };

    const handleDelete = (item: string) => {
        const pic_id_str = item?.split('/').pop()?.split('.')[0];
        if (pic_id_str) {
            const pic_id = Number(pic_id_str);
            if (!isNaN(pic_id)) {
                setDeleteID(pic_id);
                setIsModalVisible(true);
            } else {
                console.error('Failed to convert picture ID to number');
            }
        } else {
            console.error('Failed to extract picture ID');
        }
    }

    const onDelete =  async () => {
        setIsModalVisible(false);
        setIsLoarding(true);

        deleteID && await deleteImage(deleteID);
        cus_id && fetchData(cus_id);
        
        setIsLoarding(false);
    };

    useEffect(() => {
        if (cus_id) fetchData(cus_id);
    }, [])

    const processImage = async (imageRes: resultAssets) => {
        if (!cus_id) return console.warn("atgi - cus_id -> null");
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
            console.error("catch handleCamera ImageCompressor atgi View ::", error);
            compressedImage = imageRes.base64;
        }

        const body: postImageCaptureReqBody = {
            cus_id: cus_id!,
            // list_id: list_id!,
            image: compressedImage,
            type: ImageType.ATGI
        };

        const postRes = await postImageCapture(dispatch, body);
        setIsLoarding(false);
        if (!postRes) return console.error("Error in postImageCapture. Please  - atgi  check.");
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

                    <View style={styles.ImgContainer}>
                        <TouchableOpacity onPress={() => setIsShowImage({ isVisible: true, imgIndex: index })}>
                            <FastImage
                                style={{ width: (width - 40) / 3, height: width / 3 }}
                                source={{
                                    uri: item,
                                    headers: { Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.low,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                            <Image
                                source={IconClose}
                                style={styles.closeIcon}
                            />
                        </TouchableOpacity>
                    </View>

                )}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
            />
            <ImageView
                images={imagesList.map((d: string) => ({ uri: d }))}
                imageIndex={isShowImage.imgIndex}
                visible={isShowImage.isVisible}
                onRequestClose={() => setIsShowImage({ isVisible: false, imgIndex: 0 })}
            />

            {/* Modal for status change confirmation */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            Are you sure you want to delete this item?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: COLORS.gray }]}
                                onPress={() => setIsModalVisible(false)} // Close modal
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: COLORS.primary }]}
                                onPress={() => onDelete()}
                            >
                                <Text style={styles.modalButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    columnWrapper: {
        paddingHorizontal: 10,
        gap: 10,
        marginBottom: 10
    },
    ImgContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 5,
        
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        width: 25,
        height: 25
    },
    button: {
        backgroundColor: COLORS.lightOrange,
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10, // For Android shadow
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default AtgiScreen