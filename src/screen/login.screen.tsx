import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';

import Config from 'react-native-config';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import FormInput from '../components/UI/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions/authentication/authAction';
import { RootState } from '../store/store';
import { COLORS, SIZES, FONTS } from '../assets/theme';
import TextButton from '../components/UI/TextButton';
import Loading from '../components/UI/Loading';

const Login = () => {
  const [email, setEmail] = useState<string>('fieldtech1@amtstx.com');
  const [password, setPassword] = useState<string>('test@123');

  const dispatch: any = useDispatch();

  const isAuth = useSelector((state: RootState) => state.authReducer.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.authReducer.loading);
  const errorMsg = useSelector((state: RootState) => state.authReducer.error);

  const navigation: any = useNavigation();

  const handleLogin = async () => {
    dispatch(login(email, password));
  };

  return (
    <View
      style={{ backgroundColor: '#000', height: height, alignItems: 'center' }}>
      <StatusBar backgroundColor={'#000'} />
      {isLoading && <Loading />}
      <View style={styles.logoContainer}>
        <View style={styles.headerbg}>
          <Text style={styles.mainHeaderText}>Login</Text>
        </View>
        <Image
          alt="Logo"
          source={require('../assets/pngs/amts-logo-removebg-preview.png')}
          style={{
            width: width * 0.8,
            height: height * 0.2,
            marginBottom: height * 0.05,
          }}
          resizeMode="contain"></Image>
      </View>

      <View style={styles.loginContainer}>
        <View style={styles.mainHeader}></View>
        <View style={{ marginTop: 45, gap: 20 }}>
          <View>
            {/* Email */}
            <FormInput
              containerStyle={{
                borderRadius: SIZES.radius,
                // backgroundColor: COLORS.error,
              }}
              // inputContainerStyle={}
              placeholder="Email"
              value={email}
              onChange={(text) => setEmail(text)}
              prependComponent={
                <Image
                  source={require('../assets/icons/user.png')}
                  style={{
                    width: 25,
                    height: 25,
                    marginRight: SIZES.base,
                    tintColor: COLORS.lightGray1
                  }}
                />
              }
            />

          </View>
          <View>
            {/* Password */}
            <FormInput
              containerStyle={{
                marginTop: SIZES.base,
                borderRadius: SIZES.radius,
                // backgroundColor: COLORS.error,
              }}
              // inputContainerStyle={}
              placeholder="Password"
              value={password}
              // secureTextEntry={!isVisible}
              onChange={(text) => setPassword(text)}
              prependComponent={
                <Image
                  source={require('../assets/icons/password.png')}
                  style={{
                    width: 25,
                    height: 25,
                    marginRight: SIZES.base,
                    tintColor: COLORS.lightGray1
                  }}
                />
              }
            // appendComponent={
            //     <IconButton
            //         icon={isVisible ? icons.eye_off : icons.eye}
            //         iconStyle={{
            //             tintColor: COLORS.grey
            //         }}
            //         onPress={() => setIsVisible(!isVisible)}
            //     />
            // }
            />
          </View>
          <View style={styles.mainBtnContainer}>
            <TextButton
              label="Log In"
              contentContainerStyle={{
                height: 55,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.primary
              }}
              labelStyle={{
                ...FONTS.h3,
                color: COLORS.white
              }}
              onPress={() => handleLogin()}
            />
          </View>
        </View>

        <Text style={{ ...FONTS.body4, textAlign: 'center', marginVertical: SIZES.base * 2 }}>Version: {Config.APP_VERSION}</Text>

      </View>

    </View>
  );
};

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  mainHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeaderText: {
    fontSize: width * 0.065,
    color: '#ff7f4c',
    fontWeight: '400',
    marginStart: width * 0.03,
    marginEnd: width * 0.03,
    marginVertical: 6,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    borderRadius: 20,
    padding: width * 0.04,
  },
  mainBtnContainer: {
    marginTop: SIZES.base,

    // flex: 1,
    // elevation: 50,

  },
  btnText: {
    color: '#000',
    fontSize: width * 0.052,
    fontWeight: '400',
    marginVertical: width * 0.01,
  },
  headerbg: {
    borderRadius: width * 0.01,
    // borderColor: '#ff7f4c',
    borderWidth: 2,
    alignSelf: 'flex-start',
    marginTop: height * 0.03,
  },
  btnContainer: {
    backgroundColor: '#ff7f4c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: height * 0.003,
    borderRadius: width * 0.025,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: {width: 0, height: 2},
    //     shadowOpacity: 0.25,
    //     shadowRadius: 3.84,
    //   },
    //   android: {
    //     elevation: 10,
    //   },
    // }),
  },
});

export default Login;
