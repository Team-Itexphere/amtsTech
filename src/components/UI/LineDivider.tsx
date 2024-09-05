import { View, Text, ViewStyle } from 'react-native'
import React from 'react'
import { COLORS } from '../../assets/theme'

type Props = {
  lineStyle?: ViewStyle
}

const LineDivider = ({ lineStyle }: Props) => {
  return (
    <View
      style={{
        height: 2, width: '100%',
        backgroundColor: COLORS.lightGray1,
        ...lineStyle
      }}
    />
  )
}

export default LineDivider