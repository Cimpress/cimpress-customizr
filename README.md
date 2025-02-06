# @cimpress-technology/customizr
A thin client for accessing Cimpress Customizr service

## Breaking Changes - 2.0.0 Release

The 2.0.0 release completely rewrites the core of the `CustomizrClient` to use the `fetch` API instead of `axios`. This will reduce the potential for security vulnerabilities within the package. It matches the `axios` behavior and response shapes as closely as possible, but please be sure to test your app when upgrading.

This release also adds Typescript for the `CustomizrClient` and exports the types. If you're using Typescript in your application or package, you will now get type hints.

## Usage

For versions `2.x.x` and later, you'll need to configure the `cimpress-technology` scope and will need a Cimpress Artifactory token to download the package.

Install the package:
    
    npm install --save @cimpress-technology/customizr

Using the client
    
    import {CustomizrClient} from '@cimpress-technology/customizr'
    
    const client = new CustomizrClient({
        // The resource you'd like to get/put the settings from/to.
        // You can either provide it here or directly in the get/putSettings methods
        resource: undefined,
        
        // The timeout to use for the network call. Default 3000ms
        timeout: 3000,
        
        // The address of Cimpress Customizr service
        baseUrl: 'https://customizr.at.cimpress.io',
        
        // How many try to retry the request in case of network error or 5xx response
        retryAttempts: 2,
        
        // How long to wait between retries in milliseconds
        retryDelayInMs: 1000
    });
    
    client.getSettings(accessToken, resource).then(data => ...)
    
    client.putSettings(accessToken, newData, resource).then(data => ...)
    
You can also use directly any of the following convenience functions:

    import {
        getMcpSettings, 
        setMcpSettings,
        
        setPreferredMcpSettings,
        
        getPreferredMcpLanguages, 
        setPreferredMcpLanguage,
        
        getPreferredMcpTimezone,
        setPreferredMcpTimezone
        
        getMcpRegionalSettings, 
        setMcpRegionalSettings
        
        } from 'cimpress-customizr'
        
        
    setPreferredMcpSettings(accessToken, 'eng', 'en-US', 'Europe/Amsterdam').then(() => {})
    
    getPreferredMcpLanguages(accessToken).then( languageArray => {
        /* 
        
        languageArray = [language, ... ]
        
        language = {
             lang: 'en' 
             iso639_1: 'en',
             iso639_2: 'eng',
             iso639_3: 'eng'
         }
        */
    
    } )
    
    setPreferredMcpLanguage(accessToken, newLanguage).then( ... )

### Versions before 2.x.x

This package was [originally published in the npm registry](https://www.npmjs.com/package/cimpress-customizr) under the name `cimpress-customizr`. All versions up to `1.2.0` can be found there. We recommend using version `2.x.x` or later to get security updates and feature improvements.

## Development

1. Clone the repository
    
        git clone https://github.com/Cimpress/cimpress-customizr
        
1. Run the following command to download the language translations files. 
        
        npm run build

1. Make sure your code passes the linting rules
        
        npm run code-check
        
1. Make sure to update **package.json** with the new version of the package (please follow 
[semantic versioning](https://semver.org/). After, please also update **CHANGELOG.md** file 
with short info for the changes in this new version.   

7. Don't forget to enjoy! 
