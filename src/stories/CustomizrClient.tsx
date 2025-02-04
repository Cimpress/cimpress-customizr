import React from 'react';
import ReactJson from 'react-json-view'
import CustomizrClient from '../CustomizrClient';

export interface CustomizrClientGetDemoProps {
  // User's Auth0 token
  accessToken: string;
  // An arbitrary string identifier of a resource (typically an application or group of applications) for which the settings are stored
  resource?: string;
  // Optional base URL to use to access the Customizr service. The default value is https://customizr.at.cimpress.io
  baseUrl?: string;
  // Optional timeout when waiting for a response; default is 3000ms
  timeout?: number;
  // Optional number of retry attempts if request fails for reason other than a 404; default is 2
  retryAttempts?: number;
  // Optional delay between retries; default value is 1000ms
  retryDelayInMs?: number;
  // Optional session ID to be used for proxy requests
  sessionId?: string;
}

// default resource: mcp-generic-ui-settings
export const CustomizrClientGetDemo = ({ accessToken, resource = 'mcp-generic-ui-settings', baseUrl, timeout, retryAttempts, retryDelayInMs, sessionId }: CustomizrClientGetDemoProps) => {
    const clientRef = React.useRef(new CustomizrClient({ resource, baseUrl, timeout, retryAttempts, retryDelayInMs }));
    const [clientResponse, setClientResponse] = React.useState<any>();

    React.useEffect(() => {
        const getData = async () => {
            if (!clientRef.current) {
                return;
            }
            setClientResponse(await clientRef.current.getSettings(accessToken, resource, sessionId))
        }

        getData();
    }, [accessToken, resource, sessionId]);

    if (!clientResponse) {
        return <p>Update the props through the Storybook controls to view the API response.</p>;
    }

    return (
        <>
            <h2>Customizr service response:</h2>
            <ReactJson src={clientResponse} />
            <p><a href="https://app.getcortexapp.com/admin/service/en2ad65e4a6991b839/api" target='_blank'>Customizr service documentation</a></p>
        </>
    )
}

export interface CustomizrClientPutDemoProps extends CustomizrClientGetDemoProps {
    update: any;
}

export const CustomizrClientPutDemo = ({ accessToken, update = {}, resource = 'mcp-generic-ui-settings', baseUrl, timeout, retryAttempts, retryDelayInMs, sessionId }: CustomizrClientPutDemoProps) => {
    const clientRef = React.useRef(new CustomizrClient({ resource, baseUrl, timeout, retryAttempts, retryDelayInMs }));
    const [clientResponse, setClientResponse] = React.useState<any>();

    React.useEffect(() => {
        const putData = async () => {
            if (!clientRef.current) {
                return;
            }
            setClientResponse(await clientRef.current.putSettings(accessToken, update, resource, sessionId))
        }

        putData();
    }, [accessToken, resource, update, sessionId]);

    if (!clientResponse) {
        return <p>Update the props through the Storybook controls to view the API response.</p>;
    }

    return (
        <>
            <h2>Customizr service response:</h2>
            <ReactJson src={clientResponse} />
            <p><a href="https://app.getcortexapp.com/admin/service/en2ad65e4a6991b839/api" target='_blank'>Customizr service documentation</a></p>
        </>
    )
}