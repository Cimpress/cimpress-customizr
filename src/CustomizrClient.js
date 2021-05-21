import {pope} from 'pope';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const DEFAULT_BASE_URL = 'https://customizr.at.cimpress.io';
const SESSION_PROXY_URL = 'https://sessions.cimpress.io';

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

    __getProxyUrl(url, method) {
        return `${pope('/v1/sessions/proxy?proxyUrl={{url}}&proxyUrlMethod={{method}}', {url, method})}`;
    }

    __getAxiosInstance(accessToken, sessionId) {
        let instance = axios.create({
            baseURL: accessToken ? this.baseUrl : SESSION_PROXY_URL,
            timeout: this.timeout,
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`,
            } : {
                'x-session-id': sessionId,
            },
        });

        if (this.retryAttempts > 0) {
            axiosRetry(instance, {
                retries: this.retryAttempts,
                retryDelay: (retryCount) => {
                    return this.retryDelayInMs;
                },
                shouldResetTimeout: true,
            });
        }

        return instance;
    }

    async getSettings(accessToken, resource = undefined, sessionId = undefined) {
        const axiosInstance = this.__getAxiosInstance(accessToken, sessionId);

        try {
            let response = accessToken
                ? await axiosInstance.get(this.__getUrl(resource))
                : await axiosInstance.post(this.__getProxyUrl(`${this.baseUrl}${this.__getUrl(resource)}`, 'get'), {});
            return response.data;
        } catch (err) {
            if (err.response && err.response.status !== 404) {
                throw err;
            }
            return {};
        }
    }

    async putSettings(accessToken, update, resource = undefined, sessionId = undefined) {
        let settings = await this.getSettings(accessToken, resource, sessionId);
        let newSettings = Object.assign({}, settings, update);

        const axiosInstance = this.__getAxiosInstance(accessToken, sessionId);
        let response = accessToken
            ? await axiosInstance.put(this.__getUrl(resource), newSettings)
            : await axiosInstance.post(this.__getProxyUrl(`${this.baseUrl}${this.__getUrl(resource)}`, 'put'), newSettings);

        return response.data;
    }
}

export default CustomizrClient;
