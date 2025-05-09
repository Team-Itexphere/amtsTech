import axios from 'axios';
import { Dispatch } from 'redux';
import { BASE_URL } from '../../../services/urls';
import { AuthActionTypes } from '../../../types';
import { getUserDataService, submitSignOffDataService } from '../../../services/authentication/auth.service';
import { setAccessToken } from '../../../utils/Authenticator/accessToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = (email: string, password: string, rememberMe: boolean) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
      const response = await submitSignOffDataService(email, password)

      if (response.hasError) {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: response.errorMessage || 'An unexpected error occurred',
        });
      } else {
        if (response.data.authorisation.token) {
          if (rememberMe) {
            console.log('remember')
            // await AsyncStorage.setItem('authToken', response.data.authorisation.token);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
          }
        }

        setAccessToken(response.data.authorisation.token)
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      }
    } catch (error: any) {
      const errorMessage = error.response
        ? error.response.data.error
        : error.message;
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };
};

export const autoLogin = (token: string) => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    try {
      const response = await getUserDataService(token)

      if (response.hasError) {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: response.errorMessage || 'An unexpected error occurred',
        });
      } else {
        setAccessToken(token)
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      }
    } catch (error: any) {
      const errorMessage = error.response
        ? error.response.data.error
        : error.message;
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    console.log('logout');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('password');
    dispatch({ type: 'LOGOUT' });
    
  };
};
