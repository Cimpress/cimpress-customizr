import type { Meta, StoryObj } from '@storybook/react';

import { CustomizrClientGetDemo } from './CustomizrClient';

const meta = {
  title: 'Example/CustomizrClientDemo',
  component: CustomizrClientGetDemo,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    controls: {
      expanded: true,
    },
  },
  argTypes: {
    accessToken: {
        control: 'text',
        description: 'User\'s Auth0 token'
    },
    resource: {
        control: 'text',
        description: 'An arbitrary string identifier of a resource (typically an application or group of applications) for which the settings are stored',
        table: { type: { summary: 'string' }, defaultValue: { summary: 'mcp-generic-ui-settings' }}
    },
    baseUrl: {
        control: 'text',
        description: 'Optional base URL to use to access the Customizr service',
        table: { type: { summary: 'string' }, defaultValue: { summary: 'https://customizr.at.cimpress.io' }}
    },
    timeout: {
        control: 'number',
        description: 'Optional timeout when waiting for a response',
        table: { type: { summary: 'number' }, defaultValue: { summary: '3000' }}
    },
    retryAttempts: {
        control: 'number',
        description: 'Optional number of retry attempts if request fails for reason other than a 404',
        table: { type: { summary: 'number' }, defaultValue: { summary: '2' }}
    },
    retryDelayInMs: {
        control: 'number',
        description: 'Optional delay between retries',
        table: { type: { summary: 'number' }, defaultValue: { summary: '1000' }}
    },
    sessionId: {
        control: 'text',
        description: 'Optional session ID to be used for proxy requests',
        table: { type: { summary: 'string' }, defaultValue: { summary: undefined }}
    }
  },
} satisfies Meta<typeof CustomizrClientGetDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GetRequest: Story = {
  args: {
    accessToken: '',
    resource: 'mcp-generic-ui-settings'
  },
};