import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

import { COLORS, SIZES } from '../../assets/theme';
import FormInput from './FormInput';
import { capitalizeFirstLetter } from '../../utils/stringUtils';

interface CustomDropdownProps {
    selectedValue: string;
    onValueChange: (value: string) => void;
    options: string[];
    placeholder: string;
    contentContainerStyle?: ViewStyle;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    selectedValue,
    onValueChange,
    options,
    placeholder,
    contentContainerStyle
}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <View style={{ ...contentContainerStyle }} >
            <FormInput
                value={capitalizeFirstLetter(selectedValue)}
                placeholder={placeholder}
                editable={false}
                appendComponent={
                    <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                        <Text>{dropdownVisible ? '▲' : '▼'}</Text>
                    </TouchableOpacity>
                }
            />
            {dropdownVisible && (
                <View style={styles.optionsContainer}>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.option, (index === options.length - 1) && { borderBottomWidth: 0 }]}
                            onPress={() => {
                                onValueChange(option);
                                setDropdownVisible(false);
                            }}
                        >
                            <Text style={{ textTransform: 'capitalize' }}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    optionsContainer: {
        borderColor: 'gray',
        borderWidth: 1,
        borderTopWidth: 0,
        backgroundColor: COLORS.lightGrey,
        borderRadius: SIZES.radius,
        marginTop: SIZES.base - 6,
        marginBottom: SIZES.radius,
        zIndex: 1,
    },
    option: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
});

export default CustomDropdown;
