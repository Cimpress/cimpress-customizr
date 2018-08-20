const { pope } = require('pope');
const axios = require('axios');

const DEFAULT_BASE_URL = 'https://customizr.at.cimpress.io';

class CustomizrClient {

  constructor(options) {
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.resource = encodeURIComponent(options.resource);
    this.timeout = options.timeout || 3000;
    this.url = `${pope('/v1/resources/{{resource}}/settings', { resource: this.resource })}`;
  }

  __getAxiosInstance(accessToken) {
    return axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  async getSettings(accessToken) {

    const axiosInstance = this.__getAxiosInstance(accessToken);

    try {
      let response = await axiosInstance.get(this.url);
      return response.data;
    } catch (err) {
      if (err.response.status !== 404) {
        throw err;
      }
      return {};
    }
  }

  async putSettings(accessToken, update) {

    let settings = await this.getSettings(accessToken);
    let newSettings = Object.assign({}, settings, update);

    const axiosInstance = this.__getAxiosInstance(accessToken);
    let response = await axiosInstance.put(this.url, newSettings);

    return response.data;
  }
}

export default CustomizrClient;