import { View, Text } from 'react-native'
import React from 'react'
import DatePicker from 'react-native-date-picker'

type DateTimePickerProps = {
    isOpen: boolean;
    date?: Date | string; // Making the date prop optional
    confirmText: string;
    cancelText: string;
    title: string;
    changeDate: (date: Date) => void;
    onCancel: () => void;
    mode?: "date" | "datetime" | "time"
};


const DateTimePicker: React.FC<DateTimePickerProps> = ({ isOpen,
    date = new Date(), // Default to current date,
    confirmText, cancelText, title, mode = "date",
    changeDate, onCancel }) => {
    return (
        <DatePicker
            modal
            open={isOpen}
            date={new Date(date)}
            mode={mode}
            confirmText={confirmText}
            cancelText={cancelText}
            // textColor="#00FF00"
            // theme="dark"  only, iOS 13+
            title={title}
            onConfirm={date => changeDate(date)}
            onCancel={() => onCancel()}
        />
    )
}

export default DateTimePicker