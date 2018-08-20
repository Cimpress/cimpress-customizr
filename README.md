# cimpress-customizr
A thin client for accessing Cimpress Customizr service


## Usage

Install the package:
    
    npm install --save cimpress-customizr

Using the client
    
    import {CustomizrClient} from 'cimpress-customizr'
    
    const client = new CustomizrClient({
        // The resource you'd like to get/put the settings from/to.
        // You can either provide it here or directly in the get/putSettings methods
        resource: undefined,
        
        // The timeout to use for the network call. Default 3000ms
        timeout: 3000,
        
        // The address of Cimpress Customizr service
        baseUrl: 'https://customizr.at.cimpress.io'
    });
    
    client.getSettings(accessToken, resource).then(data => ...)
    
    client.putSettings(accessToken, newData, resource).then(data => ...)
    
You can also use directly any of the following convenience functions:

    import {getMcpSettings, putMcpSettings,
        getMcpLanguage, putMcpLanguage,
        getMcpRegionalSettings, putMcpRegionalSettings} from 'cimpress-customizr'
        
    getLanguage(accessToken).then( language => ... )
    
    putLanguage(accessToken, newLanguage).then( ... )

    

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
