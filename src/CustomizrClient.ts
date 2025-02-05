const DEFAULT_BASE_URL = "https://customizr.at.cimpress.io";
const SESSION_PROXY_URL = "https://sessions.cimpress.io";

type Options = {
  resource: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelayInMs?: number;
};

class CustomError extends Error {
  code: number;
  request: Request;
  response: Response;

 constructor(message: string, code: number, request: Request, response: Response) {
  super(message)
  this.code = code
  this.request = request;
  this.response = response;
 }
}

class CustomizrClient {
  resource: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelayInMs: number;

  constructor(options: Options) {
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.resource = encodeURIComponent(options.resource);
    this.timeout = options.timeout || 3000;
    this.retryAttempts = options.retryAttempts || 2;
    this.retryDelayInMs = options.retryDelayInMs || 1000;

    let understoodOptions = ["baseUrl", "resource", "timeout", "retryAttempts", "retryDelayInMs"];
    Object.keys(options).forEach(passedOption => {
      if (understoodOptions.indexOf(passedOption) === -1) {
        console.error(`[CustomizrClient] Option '${passedOption}' is not understood and will be ignored.`);
      }
    });
  }

  __getUrl(resource?: string) {
    return `/v1/resources/${resource || this.resource}/settings`;
  }

  __getProxyUrl(url: string, method: string) {
    return `/v1/sessions/proxy?proxyUrl=${url}&proxyUrlMethod=${method}`;
  }

  __wait(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  __fetchRetry({
    accessToken,
    url,
    fetchOptions = {},
    delay = this.retryDelayInMs,
    tries = this.retryAttempts,
    sessionId,
  }: {
    accessToken: string;
    url: string;
    fetchOptions: any;
    delay?: number;
    tries?: number;
    sessionId?: string | undefined;
  }) {
    const baseUrl = accessToken ? this.baseUrl : SESSION_PROXY_URL;
    const options = {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {
            "x-session-id": sessionId,
          },
    };

    const onError = (
      err: Error
    ): Promise<
      | Error
      | (({
          accessToken,
          url,
          fetchOptions,
          delay,
          tries,
          sessionId,
        }: {
          accessToken: string;
          url: string;
          fetchOptions: any;
          delay?: number | undefined;
          tries?: number | undefined;
          sessionId?: string | undefined;
        }) => Promise<Error | Response>)
      | Response
    > => {
      const triesLeft = tries - 1;
      if (!triesLeft) {
        throw err;
      }
      return this.__wait(delay).then(() =>
        this.__fetchRetry({
          accessToken,
          url: `${url}`,
          fetchOptions: { ...options, ...fetchOptions },
          delay,
          tries: triesLeft,
          sessionId,
        })
      );
    };

    const mergedOptions = { ...options, ...fetchOptions };
    const fetchRequestData = {
      url: `${baseUrl}${url}`,
      ...mergedOptions
    }

    return fetch(fetchRequestData.url, mergedOptions)
      .then(async data => {
        if (!data.ok) {
          if (data.status === 404) {
            return {};
          }

          throw new CustomError(`Request failed with status code ${data.status}`, data.status, fetchRequestData, data);
        }
        return await data.json();
      })
      .catch(onError);
  }

  async getSettings(accessToken: string, resource: string | undefined = undefined, sessionId: string | undefined = undefined) {
    try {
      let response = accessToken
        ? await this.__fetchRetry({
            accessToken,
            url: this.__getUrl(resource),
            fetchOptions: { method: "GET" },
            sessionId,
          })
        : await this.__fetchRetry({
            accessToken,
            url: this.__getProxyUrl(`${this.baseUrl}${this.__getUrl(resource)}`, "get"),
            fetchOptions: {
              method: "POST",
            },
          });
      return response;
      // eslint-disable-next-line prettier/prettier
    } catch (err: any) {
      if (err && err.code !== 404) {
        throw err;
      }
      return {};
    }
  }

  async putSettings(accessToken: string, update: any, resource: string | undefined = undefined, sessionId: string | undefined = undefined) {
    let settings = await this.getSettings(accessToken, resource, sessionId);
    let newSettings = Object.assign({}, settings, update);

    let response = accessToken
      ? await this.__fetchRetry({
          accessToken,
          url: this.__getUrl(resource),
          fetchOptions: { body: JSON.stringify({ ...newSettings }), method: "PUT" },
        })
      : await this.__fetchRetry({
          accessToken,
          url: this.__getProxyUrl(`${this.baseUrl}${this.__getUrl(resource)}`, "put"),
          fetchOptions: { body: JSON.stringify({ ...newSettings }), method: "POST" },
        });

    return response;
  }
}

export default CustomizrClient;