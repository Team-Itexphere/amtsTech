import { View, Text, TextInput, ViewStyle, TextStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { COLORS, SIZES, FONTS } from '../../assets/theme';

interface Props {
  inputRef?: React.RefObject<TextInput>;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  placeholder?: string;
  inputStyle?: TextStyle;
  value: string;
  prependComponent?: ReactNode;
  appendComponent?: ReactNode;
  onChange?: (text: any) => void;
  onPress?: () => void;
  editable?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCompleteType?: 'off' | 'username' | 'password' | 'email' | 'name';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  placeholderTextColor?: string;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
  onSubmitEditing?: () => void;
  multiline?: boolean
}
const FormInput = ({
  containerStyle,
  inputContainerStyle,
  placeholder,
  inputStyle,
  value = "",
  prependComponent,
  appendComponent,
  onChange,
  onPress,
  editable,
  secureTextEntry,
  keyboardType = "default",
  autoCompleteType = "off",
  autoCapitalize = "none",
  maxLength,
  placeholderTextColor = COLORS.dark60,
  multiline
}: Props) => {
  return (
    <View style={{ ...containerStyle }}>
      <View
        style={{
          flexDirection: 'row',
          height: 55,
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          alignItems: 'center',
          backgroundColor: COLORS.lightGrey,
          ...inputContainerStyle
        }}
      >
        {prependComponent}
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 0,
            ...FONTS.body3,
            ...inputStyle,
            // backgroundColor: 'blue'
          }}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoComplete={autoCompleteType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          onChangeText={(text) => onChange && onChange(text)}
          onPressIn={onPress}
          editable={editable}
          multiline={multiline}
        />
        {appendComponent}
      </View>
    </View>
  )
}


export default FormInput
