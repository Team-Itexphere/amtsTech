import { ActivityIndicator, FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, View, Switch, Alert, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONTS, SIZES } from '../../assets/theme'
import TextButton from '../../components/UI/TextButton'
import { CheckBox, LineDivider } from '../../components/UI'
import FormInput from '../../components/UI/FormInput'
import IconLabelButton from '../../components/UI/IconLabelButton'
import assetsPng from '../../assets/pngs';
import { Answer, ExtendedSurveyItem, SurveyItem, UniqueIdVal, getAmount, getSubmitedSurvey, getSurvey, getUniqueId, postAnswer, postAnswer_res, submitAllSurvey_With_Res } from '../../store/actions/survey/surveyAction'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NavigationProp, SurveyRouteProp } from '../../navigation/navigationTypes'
import { handleCameraLaunch, ImageLibraryPicker, resultAssets } from '../../utils/cameraHandler'
import { RootState } from '../../store/store'
import SurveyImgModal from '../../components/UI/Modals/surveyImgModal'
import ResponseModal from '../../components/UI/Modals/ResponseModal'
import Loading from '../../components/UI/Loading'
import { Image as ImageCompressor } from 'react-native-compressor';
import { ServeyStatus, Status } from '../../types'
const { IconEye, IconGallery, IconNext, IconSuccessLetter, IconAddPhoto } = assetsPng
type Props = {}
type ButtonId = 1 | 2 | 3 | null | '';

type visibleSurveyState = {
    modalName: "view_image" | "submit_form" | ""
    isVisible: boolean
}

function renderAnswerButtons({ item, isDisabled, onPressAnswButton }:
    { item: ExtendedSurveyItem, isDisabled: () => boolean, onPressAnswButton: (ButtonId: ButtonId) => void }
) {
    const isSelected = (val: number) => item.answ === val;
    return (
        <View style={{ flexDirection: 'row', marginVertical: SIZES.base * 2 }}>
            <TextButton
                label="Yes"
                contentContainerStyle={{
                    flex: 1,
                    height: 40,
                    marginRight: SIZES.base,
                    borderRadius: SIZES.radius,
                    backgroundColor: isSelected(1) ? COLORS.primary : COLORS.lightOrange2
                }}
                labelStyle={{
                    ...FONTS.h3,
                    color: isSelected(1) ? COLORS.white : COLORS.primary
                }}
                onPress={() => onPressAnswButton(1)}
                disabled={isDisabled()}
            />
            <TextButton
                label="No"
                contentContainerStyle={{
                    flex: 1,
                    height: 40,
                    borderRadius: SIZES.radius,
                    backgroundColor: isSelected(2) ? COLORS.primary : COLORS.lightOrange2
                }}
                labelStyle={{
                    ...FONTS.h3,
                    color: isSelected(2) ? COLORS.white : COLORS.primary
                }}
                onPress={() => onPressAnswButton(2)}
                disabled={isDisabled()}
            />
            <TextButton
                label="N/A"
                contentContainerStyle={{
                    flex: 1,
                    height: 40,
                    marginLeft: SIZES.base,
                    borderRadius: SIZES.radius,
                    backgroundColor: isSelected(3) ? COLORS.primary : COLORS.lightOrange2
                }}
                labelStyle={{
                    ...FONTS.h3,
                    color: isSelected(3) ? COLORS.white : COLORS.primary
                }}
                onPress={() => onPressAnswButton(3)}
                disabled={isDisabled()}
            />
        </View>
    )
}

const Survey = (props: Props) => {
    const dispatch = useDispatch();
    const route = useRoute<SurveyRouteProp>();

    const navigation = useNavigation<NavigationProp>();

    const user = useSelector((state: RootState) => state.authReducer.user);
    const {
        unique_id,
        surveyItemArray: surveyItemArrayFromRedux,
        location: {
            status,
            ro_loc_id,
            cus_id,
            list_id,
            cus_name
        }
    } = useSelector((state: RootState) => state.routeReducer);

    const [isLoading, setIsLoarding] = useState<boolean>(false)
    const [surveyItemArray, setSurveyItemArray] = useState<ExtendedSurveyItem[]>([]);
    const [isLastItem, setIsLastItem] = useState<boolean>(false);
    const [base64Image, setBase64Image] = useState<string | undefined>(undefined);
    const [uniqueIdData, setUniqueIdData] = useState<{ id: number } | null>(null)
    const [imgurl, setimgurl] = useState<string>()
    const [, setRender] = useState<number>(0); // useRef not allowing conditional rerendering.

    const [isToggleMode, setIsToggleMode] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<visibleSurveyState>({
        modalName: '',
        isVisible: false
    })

    const [genComment, setgenComment] = useState<string>('');

    useEffect(() => {

        if (surveyItemArrayFromRedux.length > 0 && unique_id) {
            // trying to again edit the survey
            setSurveyItemArray(surveyItemArrayFromRedux)
            setUniqueIdData({ id: unique_id })
        } else if (status /*=== ServeyStatus.Completed*/) {
            getSurveyToUpdate()
        } else {
            fetchData();
        }
    }, []);

    const getSurveyToUpdate = async () => {
        setIsLoarding(true)
        if (!list_id || !cus_id) return console.warn("getSurveyToUpdate list_id | cus_id -> null");
        const SubmitedListRes = await getSubmitedSurvey(dispatch, list_id, cus_id)

        // return console.log("SubmitedListRes ", SubmitedListRes);
        if (SubmitedListRes) {
            setSurveyItemArray(SubmitedListRes.extendedSurveyItem)
            setUniqueIdData({ id: SubmitedListRes.uniqueID })

            surveyItemArray[17] && setgenComment(surveyItemArray[17].gen_comment)
        } else {
            fetchData();
        }

        setIsLoarding(false)
    }

    const fetchData = async () => {
        if (!ro_loc_id || !cus_id || !list_id) return console.warn("ro_loc_id, cus_id, list_id  -> null");
        const SurveyArrayRes = await getSurvey(dispatch);
        const fetchUniqueId = await getUniqueId(dispatch, {
            unique_id: parseInt(`${Date.now()}${user?.id}`),
            ro_loc_id: ro_loc_id,
            cus_id: cus_id,
            list_id: list_id
        })

        setSurveyItemArray(SurveyArrayRes)
        if (fetchUniqueId) setUniqueIdData({ id: fetchUniqueId.id })
    };

    const currentIndex: any = React.useRef(0)
    const containerRef: any = React.useRef()
    const isFirstQuestion = (): boolean => currentIndex.current === 0;
    const isDisabled = (): boolean => isLoading ? true : false;

    const a = (b: ButtonId): Answer => {
        switch (b) {
            case 1:
                return Answer.Yes
            case 2:
                return Answer.No
            case 3:
                return Answer.NA
            default:
                return Answer.NULL;
        }
    }
    const sendAnswer = async (currentanw: number) => {
        if (!uniqueIdData?.id) {
            console.warn('required unique_id before sendAnswer ::');
            return false
        }
        setIsLoarding(true)

        const anws = surveyItemArray[currentanw]

        const asw = {
            unique_id: uniqueIdData?.id,
            ques_id: currentanw + 1,
            answer: a(anws.answ),
            desc: anws.description,
            file: base64Image ? base64Image : '',
            gen_comment: anws.gen_comment
        }

        const postData = await postAnswer(dispatch, asw, '');
        if (postData && postData.success) {
            setIsLoarding(false)
            return true
        } else {
            setIsLoarding(false)
            return false
        }

    }

    const submitAll = async (action: string) => {
        if (!uniqueIdData?.id) {
            console.warn('required unique_id before sendAnswer ::');
            return false
        }
        setIsLoarding(true)

        const results: Array<any> = [];

        let isTerminate = false;
        for (let index = 0; index < surveyItemArray.length; index++) {
            const anws = surveyItemArray[index];

            const asw = {
                unique_id: uniqueIdData?.id,
                ques_id: index + 1,
                answer: a(anws.answ),
                desc: anws.description,
                file: '',
                gen_comment: anws.gen_comment
            };

            if (anws.image.hasImg) {
                try {
                    asw.file = await ImageCompressor.compress(anws.image.imguri!, {
                        returnableOutputType: 'base64',
                        compressionMethod: 'auto'
                    });
                } catch (error) {
                    console.error(`Error compressing image for question ${index + 1}:`, error);
                }
            }

            isTerminate = false;

            switch (anws.answ) {
                case 1: // Yes
                    if ((index === 0 || index === 6 || index === 7 || index === 9) && !anws.image.hasImg) {
                        Alert.alert("Picture is required for question " + (index + 1));
                        isTerminate = true;
                    }
                    break;
                case 2: // No
                    if ((index !== 0 && index !== 6 && index !== 7 && index !== 9) && !anws.image.hasImg) {
                        Alert.alert("Picture is required for question " + (index + 1));
                        isTerminate = true;
                    }
                    break;
                case '':
                    Alert.alert("Answer is required for question " + (index + 1));
                    isTerminate = true;
                    break;
            }

            if (isTerminate) {
                break;
            }
            
            // Collect the result for further usage
            const result = await postAnswer(dispatch, asw, action);
            results.push(result);
        }

        setIsLoarding(false)

        if (isTerminate) {
            return;
        }
        
        const allSuccess = results.every(result => result.success === true);

        if (allSuccess) {
            console.log('All answers were submitted successfully.');
            // setIsVisible({ isVisible: true, modalName: 'submit_form' })
            //navigateToBack();

            navigation.navigate('StoreList', { newStatus: action !== 'save' ? ServeyStatus.Completed : undefined });
            
            //list_id && navigation.navigate('LocationList', { ro_loc_id: list_id });
        } else {
            Alert.alert("Some answers failed to submit.");
        }

    }

    const commanHandler = () => {
        setBase64Image(undefined)
        setimgurl('')
    }

    const handleNextPress = async () => {
        const test = await sendAnswer(currentIndex.current)
        if (!test) return
        commanHandler();
        if (currentIndex.current < surveyItemArray.length - 1) {
            currentIndex.current += 1
            setRender(prev => prev + 1);
            const nextIndex = currentIndex.current
            const offset = nextIndex * SIZES.width

            containerRef?.current?.scrollToOffset({
                offset,
                animated: true
            })

            if (currentIndex.current === surveyItemArray.length - 1) {
                setIsLastItem(true)
            }

        } else {
            // setIsVisible({ isVisible: true, modalName: 'submit_form' })
            navigateToBack();
        }

    }

    const handlePrevPress = async () => {
        if (isFirstQuestion()) return;
        if (isLastItem) setIsLastItem(false)
        await sendAnswer(currentIndex.current)
        commanHandler();

        currentIndex.current -= 1
        setRender(prev => prev - 1);
        const nextIndex = currentIndex.current
        const offset = nextIndex * SIZES.width

        containerRef?.current?.scrollToOffset({
            offset,
            animated: true
        })
    }

    const onPressAnswButton = (ButtonId: ButtonId, index?: number) => {
        // we use "index" when we show all the list
        const QueIndex = index ? index + 1 : currentIndex.current + 1
        setSurveyItemArray((prevItems) => {
            const newItems = [...prevItems];
            for (let i = 0; i < newItems.length; i++) {
                if (newItems[i].id === QueIndex) {
                    newItems[i] = { ...newItems[i], answ: ButtonId };
                    break; // exit the loop once the item is found and updated
                }
            }
            return newItems;
        });
    }

    const onChangeDescText = (text: string, index?: number) => {
        // we use "index" when we show all the list
        const QueIndex = index ? index + 1 : currentIndex.current + 1
        setSurveyItemArray((prevItems) => {
            const newItems = [...prevItems];
            for (let i = 0; i < newItems.length; i++) {
                if (newItems[i].id === QueIndex) {
                    newItems[i] = { ...newItems[i], description: text };
                    break;
                }
            }
            return newItems;
        })
    }

    const onChangeComment = (text: string) => {
        setSurveyItemArray((prevItems) => {
            const newItems = [...prevItems];
            for (let i = 0; i < newItems.length; i++) {
                if (newItems[i].id === 18) {
                    newItems[i] = { ...newItems[i], gen_comment: text };
                    break;
                }
            }
            
            setgenComment(newItems[17].gen_comment)
            return newItems;
        })
    }

    const getBase64ImageSizeInMB = (base64String: String) => {

        const stringLength = base64String.length;
        const sizeInBytes = (stringLength * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);

        return sizeInMB;
    };

    // const handleCamera = async (index?: number) => {
    //     const cameraRes: resultAssets = await handleCameraLaunch()
    //     if (cameraRes && !!cameraRes.base64 && !!cameraRes.uri) {
    //         // const imageSizeInMB = getBase64ImageSizeInMB(cameraRes.base64);
    //         try {
    //             const result = await ImageCompressor.compress(cameraRes?.uri, {
    //                 returnableOutputType: 'base64',
    //                 compressionMethod: 'auto'
    //             });
    //             setBase64Image(result)
    //         } catch (error) {
    //             console.error("catch handleCamera ImageCompressor ::", error);
    //             setBase64Image(cameraRes.base64)
    //         }

    //         // we use "index" when we show all the list
    //         const QueIndex = index ? index + 1 : currentIndex.current + 1
    //         setSurveyItemArray((prevItem) => {
    //             const newItems = [...prevItem];
    //             for (let i = 0; i < newItems.length; i++) {
    //                 if (newItems[i].id === QueIndex) {
    //                     newItems[i] = { ...newItems[i], image: { hasImg: true, imguri: cameraRes.uri } }
    //                 }
    //             }
    //             return newItems
    //         })
    //     }
    // }

    const processImage = async (imageRes: resultAssets, index?: number) => {
        if (!imageRes || !imageRes.base64 || !imageRes.uri) return console.warn("imageRes -> null");
        // const imageSizeInMB = getBase64ImageSizeInMB(cameraRes.base64);
        try {
            const result = await ImageCompressor.compress(imageRes?.uri, {
                returnableOutputType: 'base64',
                compressionMethod: 'auto'
            });
            setBase64Image(result)
        } catch (error) {
            console.error("catch handleCamera ImageCompressor ::", error);
            setBase64Image(imageRes.base64)
        }

        // we use "index" when we show all the list
        const QueIndex = index ? index + 1 : currentIndex.current + 1
        setSurveyItemArray((prevItem) => {
            const newItems = [...prevItem];
            for (let i = 0; i < newItems.length; i++) {
                if (newItems[i].id === QueIndex) {
                    newItems[i] = { ...newItems[i], image: { hasImg: true, imguri: imageRes.uri } }
                }
            }
            return newItems
        })

    };

    const handleCamera = async (index?: number) => {
        const cameraRes: resultAssets = await handleCameraLaunch()
        await processImage(cameraRes, index);
    }

    const handleImagePick = async (index?: number) => {
        const imageRes: resultAssets = await ImageLibraryPicker();
        await processImage(imageRes, index);
    };

    const navigateToBack = async () => {
        setIsVisible({ modalName: "submit_form", isVisible: false })
        dispatch(submitAllSurvey_With_Res(surveyItemArray, uniqueIdData?.id!));

        navigation.navigate('StoreList')
    }

    if (surveyItemArray.length === 0) return <Loading />

    const renderView = () => {
        if (isToggleMode) {
            return (
                // <View style={{ height: 400, }}>
                //     <View style={{ flex: 1 }}>
                //         <FlatList
                //             ref={containerRef}
                //             horizontal
                //             pagingEnabled
                //             scrollEnabled={false}
                //             snapToAlignment='center'
                //             snapToInterval={SIZES.width}
                //             decelerationRate="fast"
                //             showsHorizontalScrollIndicator={false}
                //             data={surveyItemArray}
                //             keyExtractor={(item, index) => `container ${item.id}${index}`}
                //             renderItem={({ item, index }) => {
                //                 return (
                //                     // same element use in else block in below
                //                     <View style={{ backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: SIZES.padding, width: SIZES.width, }}>
                //                         {/* <View style={{ marginVertical: 'auto' }}> */}


                //                         <Text style={[FONTS.h3,]}>{item.id}: {item.question}</Text>
                //                         {renderAnswerButtons({ item, isDisabled, onPressAnswButton })}
                //                         <LineDivider />


                //                         <FormInput
                //                             containerStyle={{
                //                                 borderRadius: SIZES.radius,
                //                                 marginVertical: SIZES.base * 2
                //                                 // backgroundColor: COLORS.error,
                //                             }}
                //                             // inputContainerStyle={}
                //                             placeholder="Description"
                //                             value={item.description}
                //                             onChange={(text: string) => onChangeDescText(text)}
                //                             editable={!isDisabled()}
                //                         />


                //                         <View style={{ flex: 1 }} />
                //                         <LineDivider />
                //                         <View style={{ flexDirection: 'row', marginTop: SIZES.radius }}>
                //                             <IconLabelButton
                //                                 iconStyle={{ tintColor: COLORS.secondary }}
                //                                 icon={IconAddPhoto} label='Camera'
                //                                 containerStyle={{ flex: 1 }}
                //                                 onPress={() => handleCamera()} />
                //                             <IconLabelButton
                //                                 iconStyle={{ tintColor: COLORS.secondary }}
                //                                 icon={IconGallery} label='Gallery'
                //                                 containerStyle={{ flex: 1 }}
                //                                 onPress={() => handleImagePick()} />
                //                             {item.image.hasImg ?
                //                                 <IconLabelButton
                //                                     iconStyle={{ tintColor: COLORS.secondary }}
                //                                     icon={IconEye} label='view image'
                //                                     containerStyle={{ flex: 1 }}
                //                                     onPress={() => {
                //                                         setimgurl(item.image.imguri)
                //                                         setIsVisible({ modalName: 'view_image', isVisible: true })
                //                                     }}
                //                                 /> :
                //                                 <View style={{ flex: 1 }} />
                //                             }
                //                         </View>
                //                         {/* </View> */}

                //                     </View>

                //                 )
                //             }}
                //         />
                //     </View>
                //     {/* This only use in their */}
                //     <View style={{
                //         display: 'flex',
                //         flexDirection: 'row',
                //         justifyContent: isFirstQuestion() ? 'flex-end' : 'space-between',
                //         backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: SIZES.base, marginTop: SIZES.base * 2,
                //     }}>

                //         {!isFirstQuestion() && <IconLabelButton
                //             labelStyle={{ marginRight: SIZES.base }}
                //             iconStyle={{ tintColor: COLORS.dark60 }}
                //             containerStyle={{
                //                 backgroundColor: COLORS.lightGrey,
                //                 padding: SIZES.base,
                //                 borderRadius: SIZES.radius,
                //             }}
                //             icon={IconNext}
                //             label="Prev"
                //             onPress={handlePrevPress}
                //             disabled={isDisabled()}
                //         />}

                //         {isLastItem && <FormInput
                //             containerStyle={{
                //                 borderRadius: SIZES.radius,
                //                 marginVertical: SIZES.base * 2
                //             }}
                //             placeholder="General Comments"
                //             value=""
                //             onChange={(text: string) => onChangeComment(text)}
                //         />}

                //         <IconLabelButton
                //             labelStyle={{ marginRight: SIZES.base }}
                //             iconStyle={{ tintColor: COLORS.dark60 }}
                //             icon={IconNext}
                //             label={(isLoading && !!base64Image) ? 'Image is uploading...' : isLoading ? 'Loading...' : isLastItem ? 'Submit' : 'Next'}
                //             containerStyle={{ flexDirection: 'row-reverse', backgroundColor: isLastItem ? COLORS.lightOrange : COLORS.lightGrey, padding: SIZES.base, borderRadius: SIZES.radius }}
                //             onPress={handleNextPress}
                //             disabled={isDisabled()}
                //         />
                //     </View>
                // </View>
            '');
        } else {
            return (
                <View style={{ flex: 1 }}>
                    {isLoading && <Loading />}
                    <Text 
                        style={{
                            textAlign: 'center',
                            paddingBottom: 5,
                            fontWeight: 600,
                            backgroundColor: COLORS.white
                        }}
                    >{cus_name}</Text>
                    <Button 
                        title="📝 View Previous Surveys" 
                        onPress={() => {
                            navigation.navigate('StoreSurveys');
                        }} 
                        color={COLORS.lightOrange} 
                    />  
                    <FlatList
                        data={surveyItemArray}
                        keyExtractor={(item, index) => `container ${item.id}${index}`}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: SIZES.padding, margin: SIZES.base, marginBottom: item.id === 18 ? 100 : 0 }}>
                                    {/* <View style={{ marginVertical: 'auto' }}> */}

                                    <Text style={[FONTS.h3,]}>{item.id}: {item.question}</Text>
                                    {renderAnswerButtons({ item, isDisabled, onPressAnswButton: (ButtonId) => onPressAnswButton(ButtonId, index) })}
                                    <LineDivider />

                                    <FormInput
                                        containerStyle={{
                                            borderRadius: SIZES.radius,
                                            marginVertical: SIZES.base * 2
                                            // backgroundColor: COLORS.error,
                                        }}
                                        // inputContainerStyle={}
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(text: string) => onChangeDescText(text, index)}
                                        editable={!isDisabled()}
                                    />


                                    <View style={{ flex: 1 }} />
                                    <LineDivider />
                                    <View style={{ flexDirection: 'row', marginTop: SIZES.radius }}>
                                        <IconLabelButton
                                            iconStyle={{ tintColor: COLORS.secondary }}
                                            icon={IconAddPhoto} label='Photo'
                                            containerStyle={{ flex: 1 }}
                                            onPress={() => handleCamera(index)} />
                                        <IconLabelButton
                                            iconStyle={{ tintColor: COLORS.secondary }}
                                            icon={IconGallery} label='Gallery'
                                            containerStyle={{ flex: 1 }}
                                            onPress={() => handleImagePick(index)} />
                                        {item.image.hasImg ?
                                            <IconLabelButton
                                                iconStyle={{ tintColor: COLORS.secondary }}
                                                icon={IconEye} label='view image'
                                                containerStyle={{ flex: 1 }}
                                                onPress={() => {
                                                    setimgurl(item.image.imguri)
                                                    setIsVisible({ modalName: 'view_image', isVisible: true })
                                                }}
                                            /> :
                                            <View style={{ flex: 1 }} />
                                        }
                                    </View>
                                    {/* </View> */}

                                </View>

                            )
                        }}
                    />
                    <View>
                        {/* <Text 
                            style={{
                                textAlign: 'center',
                                marginBottom: -25,
                                position: 'relative',
                                zIndex: 9
                            }}
                            >General Comments</Text> */}
                        <FormInput
                            containerStyle={{
                                borderRadius: SIZES.radius,
                                margin: SIZES.base
                            }}
                            placeholder="General Comments"
                            value={genComment || surveyItemArray[17].gen_comment}
                            onChange={(text: string) => onChangeComment(text)}
                            autoCapitalize="sentences"
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                margin: SIZES.base,
                                marginBottom: SIZES.radius
                            }}>
                            <IconLabelButton
                                labelStyle={{ marginRight: SIZES.base, ...FONTS.h3, color: COLORS.white }}
                                iconStyle={{ tintColor: COLORS.white }}
                                icon={IconNext}
                                label={'Save'}
                                containerStyle={{
                                    flex: 1, marginRight: 4,
                                    flexDirection: 'row-reverse',
                                    backgroundColor: COLORS.secondary, padding: SIZES.radius, borderRadius: SIZES.radius
                                }}
                                onPress={() => submitAll('save')}
                                disabled={isDisabled()}
                            />
                            <IconLabelButton
                                labelStyle={{ marginRight: SIZES.base, ...FONTS.h3, color: COLORS.white }}
                                iconStyle={{ tintColor: COLORS.white }}
                                icon={IconNext}
                                label={'Submit'}
                                containerStyle={{
                                    flex: 1,
                                    flexDirection: 'row-reverse',
                                    backgroundColor: COLORS.lightOrange, padding: SIZES.radius, borderRadius: SIZES.radius
                                }}
                                onPress={() => submitAll('submit')}
                                disabled={isDisabled()}
                            />
                        </View>
                    </View> 
                </View>
            );
        }
    };


    return (
        <SafeAreaView style={{
            flex: 1, backgroundColor: COLORS.lightGray1,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <StatusBar backgroundColor={COLORS.white} />
            {/* <View style={{ flexDirection: "row", alignItems: "center", margin: SIZES.base }}>
                <Switch
                    value={isToggleMode}
                    onValueChange={() => setIsToggleMode((prev) => !prev)}
                    trackColor={{ false: COLORS.primary50, true: COLORS.transparentBlack7 }}
                    thumbColor={COLORS.secondary}
                />
                <Text style={{ ...FONTS.body3 }}>Toggle View</Text>
            </View> */}

            {renderView()}

            {(isVisible.isVisible && isVisible.modalName === "view_image") && <SurveyImgModal
                isVisible={isVisible.isVisible && imgurl !== ''}
                setIsVisible={(val) => setIsVisible({ modalName: "view_image", isVisible: val })}
                imguri={imgurl!}
            />}

            {(isVisible.isVisible && isVisible.modalName === "submit_form") && <ResponseModal
                isVisible={isVisible.isVisible}
                setIsVisible={(val) => setIsVisible({ modalName: "submit_form", isVisible: val })}
                title='Submitted Successfully'
                description=''
                icon={IconSuccessLetter}
                actions={[
                    {
                        label: 'Yes',
                        onPress: () => navigateToBack(),//processedToInvoiceGenerate(),
                        contentContainerStyle: { flex: 1, borderRadius: SIZES.radius },
                        labelStyle: { color: COLORS.white }
                    },
                    // {
                    //     label: 'No',
                    //     onPress: () => {
                    //         setIsVisible({ modalName: "submit_form", isVisible: false })
                    //         navigation.navigate('Route')
                    //     },
                    //     contentContainerStyle: { flex: 1, backgroundColor: COLORS.lightOrange2, borderRadius: SIZES.radius, marginLeft: SIZES.base },
                    //     labelStyle: { color: COLORS.primary }
                    // }
                ]}
            />}
        </SafeAreaView >
    )
}


export default Survey


const styles = StyleSheet.create({})
