import axiosInstance from './interceptor';

let _this;

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

class RestClient {
  constructor() {
    _this = this;
  }

  /**
   * Main method call for all rest calls with in logic
   *
   * @param {any} method
   * @param {any} url
   * @param {any} body
   * @param {any} header
   * @returns
   * @memberof RestClient
   */
  API(method: string, url: string, body?: any, header?: any, timeout?: number) {
    switch (method) {
      case METHODS.GET:
        return this._get(url, header, timeout);
      case METHODS.POST:
        body = body || {};
        return this._post(url, body, header, timeout);
      case METHODS.PUT:
        return this._put(url, body, header, timeout);
      case METHODS.DELETE:
        return this._delete(url, body, header, timeout);
      default:
        break;
    }
  }

  /**
   * GET Rest API Call
   *
   * @param {any} url
   * @param {any} header
   * @returns
   * @memberof RestClient
   */
  async _get(url: string, header?: Record<string, string>, timeout = 25000) {
    axiosInstance.defaults.timeout = timeout;
    return axiosInstance
      .get(url, { headers: header })
      .then(response => response)
      .catch(error => error);
  }

  /**
   * POST Rest API Call
   *
   * @param {any} url
   * @param {any} body
   * @param {any} header
   * @returns
   * @memberof RestClient
   */
  async _post(url: string, body: any, header: any, timeout = 25000) {
    console.log('check', url, body, header);
    //axiosInstance.defaults.timeout = timeout;
    return axiosInstance
      .post(url, body, header)
      .then(response => response)
      .catch(error => error);
  }

  /**
   * PUT Rest API Call
   *
   * @param {any} url
   * @param {any} body
   * @param {any} header
   * @returns
   * @memberof RestClient
   */
  async _put(url: string, body: any, header: any, timeout = 25000) {
    axiosInstance.defaults.timeout = timeout;
    return axiosInstance
      .put(url, body, { headers: header })
      .then(response => response)
      .catch(error => error);
  }

  /**
   * DELETE Rest API Call
   *
   * @param {any} url
   * @param {any} header
   * @returns
   * @memberof RestClient
   */
  async _delete(url: string, body: any, header: any, timeout = 25000) {
    axiosInstance.defaults.timeout = timeout;
    return axiosInstance
      .delete(url, { headers: header, data: body })
      .then(response => response)
      .catch(error => error);
  }
}

export const client = new RestClient();
