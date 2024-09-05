import axios, { AxiosResponse } from 'axios';

import { BASE_URL } from '../urls';
import { store } from '../../store/store';

// import { refresh } from '../../redux/actions/authentication/refresh.action';
import { getAccessToken } from '../../utils/Authenticator/accessToken';

import { errorHandler } from './errorHandler';
import { responseHandler, responseHandlerType } from './responseHandler';

import { logout } from '../../store/actions/authentication/authAction';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config: any) => {
    config.headers = {
      Authorization:
        // config.url === 'token'
        //   ? `Basic ${base64.encode(
        //     `MOBILE:519EAC95-AB16-46C9-9BA6-0202B524789E`,
        //   )}`
        //   : 
        `Bearer ${await getAccessToken()}`,
      //'content-Type': (await getAccessToken()) ? 'application/json' : '',
      'content-Type':
        config.url === 'token'
          ? 'application/x-www-form-urlencoded'
          : 'application/json',
    };
    console.log('value+++ ', config);
    return config;
  },
  error => Promise.reject(error),
);

let refreshTokenPromise: any; // this holds any in-progress token refresh requests

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): responseHandlerType | any => {
    console.log(response);
    return responseHandler(response);
  },
  async (error: any) => {
    const prevRequest = error?.config;
    console.log('err:', error);

    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;

      if (!refreshTokenPromise) {
        // check for an existing in-progress request
        // if nothing is in-progress, start a new refresh token request

        // refreshTokenPromise = refresh().then(token => {
        //   refreshTokenPromise = null; // clear state
        //   return token; // resolve with the new token
        // });
        return 'need-to-add-that-feature'
      }

      return refreshTokenPromise.then((token: any) => {
        prevRequest.headers['Authorization'] = `Bearer ${token}`;
        return axiosInstance(prevRequest);
      });
    } else if (error?.response?.status === 401 && prevRequest?.sent) {
      console.log('err code 401 - 2nd time - time to logout ::', error);
      return store.dispatch(logout());
    }
    return Promise.reject(errorHandler(error));
  },
);

export default axiosInstance;
