import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import HomeStackNavigator from './HomeStack.navigation'
import AuthStackNavigator from './AuthStack.navigation'
import { RootState } from '../store/store'
import { useSelector } from 'react-redux'

type Props = {}

const AppNavigator = (props: Props) => {
    const isAuth = useSelector((state: RootState) => state.authReducer.isAuthenticated);
    return (
        <NavigationContainer>
            {isAuth ? <HomeStackNavigator /> : <AuthStackNavigator />}
        </NavigationContainer>
    )
}

export default AppNavigator