/**
 * Status Handler
 *
 * @param {*} responseObj
 * @returns
 * @memberof RestClient
 */
export const statusHandler = (responseObj: any) => {
  if (responseObj == undefined) {
    return {hasError: true, errorMessage: 'SERVER_ERROR'};
  } else {
    switch (responseObj.status) {
      case 400:
        //console.log('status handler');
        //console.log(responseObj.data.status.Message);
        return {
          hasError: true,
          errorMessage: responseObj.data, //errorMessage: responseObj.data.error,
        };
      case 401:
        return {hasError: true, errorMessage: 'UNAUTHORIZED'};
      case 403:
        return {hasError: true, errorMessage: 'FORBIDDEN'};
      case 404:
        return {hasError: true, errorMessage: 'NOT_FOUND'};
      case 500:
        return {hasError: true, errorMessage: 'SERVER_ERROR'};
      default:
        return {hasError: false, errorMessage: ''};
    }
  }
};
