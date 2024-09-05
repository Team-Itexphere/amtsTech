import { AxiosResponse } from 'axios';
import { statusHandler } from './statusHandler';

/**
 * Success Response Handler
 *
 * @param {*} response
 * @returns
 * @memberof RestClient
 */

export interface responseHandlerType {
  hasError: boolean,
  errorMessage: string,
  data: any
}

export const responseHandler = (response: AxiosResponse): responseHandlerType => {
  const { hasError, errorMessage } = statusHandler(response);
  if (hasError) {
    return { hasError: true, errorMessage: errorMessage, data: null };
  } else {
    return {
      hasError: false,
      errorMessage: '',
      data: response.data,
    };
  }
};
