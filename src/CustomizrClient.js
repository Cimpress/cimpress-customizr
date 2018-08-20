const {pope} = require('pope');
const axios = require('axios');

const DEFAULT_BASE_URL = 'https://customizr.at.cimpress.io';

class CustomizrClient {
    constructor(options) {
        this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
        this.resource = encodeURIComponent(options.resource);
        this.timeout = options.timeout || 3000;
    }

    __getUrl(resource) {
        return `${pope('/v1/resources/{{resource}}/settings', {resource: resource || this.resource})}`;
    }

    __getAxiosInstance(accessToken) {
        return axios.create({
            baseURL: this.baseUrl,
            timeout: this.timeout,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    async getSettings(accessToken, resource = undefined) {
        const axiosInstance = this.__getAxiosInstance(accessToken);

        try {
            let response = await axiosInstance.get(this.__getUrl(resource));
            return response.data;
        } catch (err) {
            if (err.response.status !== 404) {
                throw err;
            }
            return {};
        }
    }

    async putSettings(accessToken, update, resource = undefined) {
        let settings = await this.getSettings(accessToken, resource);
        let newSettings = Object.assign({}, settings, update);

        const axiosInstance = this.__getAxiosInstance(accessToken);
        let response = await axiosInstance.put(this.__getUrl(resource), newSettings);

        return response.data;
    }
}

export default CustomizrClient;
