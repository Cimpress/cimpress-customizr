const CustomizrClient = require('./CustomizrClient');

const mcpCustomizr = new CustomizrClient({
    resource: 'mcp-generic-ui-settings',
});

async function getMcpSettings(accessToken) {
    return await mcpCustomizr.getSettings(accessToken);
}

async function putMcpSettings(accessToken, settings) {
    mcpCustomizr.putSettings(accessToken, {
        language: settings.language,
        regionalSettings: settings.regionalSettings,
    });
}

async function getMcpLanguage(accessToken) {
    const mcpSettings = await mcpCustomizr.getSettings(accessToken);
    return mcpSettings.language;
}

async function putMcpLanguage(accessToken, language) {
    mcpCustomizr.putSettings(accessToken, {
        language: language,
    });
}

async function getMcpRegionalSettings(accessToken) {
    const mcpSettings = await mcpCustomizr.getSettings(accessToken);
    return mcpSettings.language;
}

async function putMcpRegionalSettings(accessToken, regionalSettings) {
    mcpCustomizr.putSettings(accessToken, {
        regionalSettings: regionalSettings,
    });
}

export {
    getMcpSettings,
    putMcpSettings,
    getMcpLanguage,
    putMcpLanguage,
    getMcpRegionalSettings,
    putMcpRegionalSettings,
};
