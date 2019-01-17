import {pope} from 'pope';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const DEFAULT_BASE_URL = 'https://customizr.at.cimpress.io';

class CustomizrClient {
    constructor(options) {
        this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
        this.resource = encodeURIComponent(options.resource);
        this.timeout = options.timeout || 3000;
        this.retryAttempts = options.retryAttempts || 2;
        this.retryDelayInMs = options.retryDelayInMs || 1000;

        let understoodOptions = ['baseUrl', 'resource', 'timeout', 'retryAttempts', 'retryDelayInMs'];
        Object.keys(options).forEach((passedOption) => {
            if (understoodOptions.indexOf(passedOption) === -1) {
                // eslint-disable-next-line no-console
                console.error(`[CustomizrClient] Option '${passedOption}' is not understood and will be ignored.`);
            }
        });
    }

    __getUrl(resource) {
        return `${pope('/v1/resources/{{resource}}/settings', {resource: resource || this.resource})}`;
    }

    __getAxiosInstance(accessToken) {
        let instance = axios.create({
            baseURL: this.baseUrl,
            timeout: this.timeout,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (this.retryAttempts > 0) {
            axiosRetry(instance, {
                retries: this.retryAttempts,
                retryDelay: (retryCount) => {
                    return this.retryDelayInMs;
                },
                shouldResetTimeout: true
            });
        }

        return instance;
    }

    async getSettings(accessToken, resource = undefined) {
        const axiosInstance = this.__getAxiosInstance(accessToken);

        try {
            let response = await axiosInstance.get(this.__getUrl(resource));
            return response.data;
        } catch (err) {
            if (err.response && err.response.status !== 404) {
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
