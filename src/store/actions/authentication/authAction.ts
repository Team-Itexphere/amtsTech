import axios from 'axios';
import { Dispatch } from 'redux';
import { BASE_URL } from '../../../services/urls';
import { AuthActionTypes } from '../../../types';
import { submitSignOffDataService } from '../../../services/authentication/auth.service';
import { setAccessToken } from '../../../utils/Authenticator/accessToken';

export const login = (email: string, password: string) => {
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

export const logout = () => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    console.log('logout');
    dispatch({ type: 'LOGOUT' });
  };
};
