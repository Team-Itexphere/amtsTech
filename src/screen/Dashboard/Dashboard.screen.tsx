import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { COLORS, FONTS, SIZES } from '../../assets/theme';
import TextButton from '../../components/UI/TextButton';
import { NavigationProp } from '../../navigation/navigationTypes';
import { useNavigation } from '@react-navigation/native';

type Props = {}

const DashboardScreen = (props: Props) => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useSelector((state: RootState) => state.authReducer);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.welcomeText}>Welcome,</Text>
                <Text style={{ marginLeft: SIZES.base, ...FONTS.h2, color: COLORS.blue }}>{user?.name}!</Text>
            </View>

            <Text style={styles.dateText}>{formattedDate}</Text>
            <TextButton
                label="Routes  ➡️"
                contentContainerStyle={{
                    width: "100%",
                    height: 30,
                    marginVertical: SIZES.base,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.primary
                }}
                labelStyle={{
                    ...FONTS.h3,
                    color: COLORS.white
                }}
                onPress={() => navigation.navigate('Route')}
            />
            <TextButton
                label="Service Call  ➡️"
                contentContainerStyle={{
                    width: "100%",
                    height: 30,
                    marginVertical: SIZES.base,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.primary
                }}
                labelStyle={{
                    ...FONTS.h3,
                    color: COLORS.white
                }}
                onPress={() => navigation.navigate('ServiceCall')}
            />
            <TextButton
                label="Customers  ➡️"
                contentContainerStyle={{
                    width: "100%",
                    height: 30,
                    marginVertical: SIZES.base,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.primary
                }}
                labelStyle={{
                    ...FONTS.h3,
                    color: COLORS.white
                }}
                onPress={() => navigation.navigate('Customers')}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
        textShadowColor: COLORS.black,
        textShadowRadius: 10,
    },
    dateText: {
        fontSize: 20,
        color: COLORS.dark60,
        fontStyle: 'italic',
    },
});

export default DashboardScreen