import {statusHandler} from './statusHandler';

/**
 * Error Response Handler
 *
 * @param {*} error
 * @returns
 * @memberof RestClient
 */
export const errorHandler = (error: any) => {
  if (!error.response) {
    return {hasError: true, errorMessage: 'NETWORK_ERROR'};
  } else {
    const {hasError, errorMessage} = statusHandler(error.response);
    return {hasError: true, errorMessage: errorMessage};
  }
};
