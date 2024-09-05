import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, FONTS, SIZES } from '../../assets/theme'
import assetsPng from '../../assets/pngs';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/actions/authentication/authAction';
import Config from 'react-native-config';

const { IconSignOut, IconUser, IconEmail, IconPhone, IconFleet } = assetsPng

type Props = {}

type renderProfileContentType = {
    icon: ImageSourcePropType
    ContentHeader: string
    content: string | null
}

const renderProfileContent = ({ icon, ContentHeader, content = '' }: renderProfileContentType) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: SIZES.base }}>
            {/* icon */}
            <View>
                <Image
                    source={icon}
                    style={{ width: 20, height: 20, tintColor: COLORS.primary, marginRight: 20 }}
                />
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
                {/* Header */}
                <Text style={[FONTS.h3, { color: COLORS.darkGray }]}>{ContentHeader}</Text>
                {/* content */}
                <Text style={[FONTS.body4, { color: COLORS.gray }]}>{content}</Text>
            </View>
        </View>
    )
}

const SettingsScreen = (props: Props) => {
    const dispatch: any = useDispatch();

    const user = useSelector((state: RootState) => state.authReducer.user);
    if (!user) return null;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightGray1 }}>
            {/* Header */}
            <View style={{ backgroundColor: COLORS.primary, height: SIZES.base * 15, padding: SIZES.padding }}>
                <Text style={[FONTS.h2, { color: COLORS.white }]}>Account Information</Text>
            </View>

            {/* main content */}
            <View style={{ flex: 1, marginHorizontal: SIZES.base * 2, }}>
                <View style={{ flex: 1, backgroundColor: COLORS.white, marginTop: -25, borderRadius: SIZES.radius }}>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: SIZES.padding, paddingBottom: SIZES.padding, marginTop: 10 }}>
                        <View style={{ paddingVertical: SIZES.base }}><Text style={[FONTS.h4, { color: COLORS.lightGray1 }]}>Login and Security</Text></View>
                        {renderProfileContent({
                            icon: IconUser,
                            content: user.name,
                            ContentHeader: 'Username'
                        })}
                        {renderProfileContent({
                            icon: IconEmail,
                            content: user.email,
                            ContentHeader: 'Email'
                        })}
                        {renderProfileContent({
                            icon: IconPhone,
                            content: user.phone,
                            ContentHeader: 'Phone Number'
                        })}
                        {renderProfileContent({
                            icon: IconFleet,
                            content: user.fleet,
                            ContentHeader: 'Fleet'
                        })}
                    </ScrollView>

                </View>

                {/* logout */}
                <View>
                    <TouchableOpacity
                        style={{
                            display: 'flex',
                            padding: SIZES.padding,
                            flexDirection: 'row', alignItems: 'center',
                            marginVertical: 5,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.white
                        }}
                        onPress={async () => await dispatch(logout())}
                    >
                        <Image
                            source={IconSignOut}
                            style={{ width: 20, height: 20, tintColor: COLORS.red, marginRight: 20 }}
                        />
                        <Text style={[FONTS.body4, { color: COLORS.red }]}>Log Out</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ ...FONTS.body4, textAlign: 'center' }}>Version: {Config.APP_VERSION}</Text>
            </View>


        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({})