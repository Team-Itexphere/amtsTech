import { View, Text, Modal, TouchableWithoutFeedback, Image } from 'react-native'
import React from 'react'
import { COLORS, FONTS, SIZES } from '../../../assets/theme';

type Props = {
    isVisible: boolean
    setIsVisible: (val: boolean) => void;
    selectedLog: any
}


const MaintainsModal = ({ isVisible = true, setIsVisible, selectedLog }: Props) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${month}/${day}/${year}`;
    };

    const renderfield = ({ fieldName, value }: {
        fieldName: "Date" | "Part" | "Location" | "Tech" | "Company" | "Description"
        value: string
    }) => {
        return (
            <View style={{ flexDirection: 'row', paddingVertical: 6, paddingLeft: SIZES.base }}>
                <Text style={{ ...FONTS.h4, width: 90 }}>{fieldName}</Text>
                <Text style={{ ...FONTS.body3, color: COLORS.black }}>:   {value ? value : "N/A"}</Text>
            </View>
        )
    }

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={isVisible}
        >
            <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
                <View style={{
                    flex: 1,
                    // width: SIZES.width,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.transparentBlack1
                }}>
                    <View style={{
                        padding: 10,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.white,
                        width: "80%",
                        height: "40%"
                    }}>
                        {renderfield({ fieldName: "Date", value: formatDate(selectedLog.date) })}
                        {renderfield({ fieldName: "Part", value: selectedLog.descript })}
                        {renderfield({ fieldName: "Location", value: selectedLog.location })}
                        {renderfield({ fieldName: "Tech", value: selectedLog.tech_name })}
                        {renderfield({ fieldName: "Company", value: selectedLog.company })}
                        {/* {renderfield({ fieldName: "Description", value: selectedLog.descript })} */}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default MaintainsModal