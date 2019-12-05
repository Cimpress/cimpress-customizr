export interface ClientOptions {
  resource?: string;
  timeout?: number;
  baseUrl?: string;
  retryAttempts?: number;
  retryDelayInMs?: number;
}

export interface McpGlobalSettings {
  language?: Array<string>;
  regionalSettings?: string;
  timezone?: string;
}

export interface LanguageCodes {
  lang: string;
  iso639_1: string;
  iso639_2: string;
  iso639_3: string;
}

export declare class CustomizrClient {
  constructor(options: ClientOptions);
  getSettings<T = any>(accessToken: string, resource?: string): Promise<T>;
  putSettings<T = any>(accessToken: string, newData: T, resource?: string): Promise<void>;
}

export declare function getMcpSettings(accessToken: string): Promise<McpGlobalSettings>;
export declare function setMcpSettings(accessToken: string, settings: McpGlobalSettings): Promise<void>;

export declare function setPreferredMcpSettings(accessToken: string, languageCode: string, languageTag: string, timezone: string): Promise<void>;

export declare function getPreferredMcpLanguages(accessToken: string): Promise<LanguageCodes[]>;
export declare function setPreferredMcpLanguage(accessToken: string, languageCode: string): Promise<void>;

export declare function getPreferredMcpRegionalSettings(accessToken: string): Promise<string>;
export declare function setPreferredMcpRegionalSettings(accessToken: string, languageTag: string): Promise<void>;

export declare function getPreferredMcpTimezone(accessToken: string): Promise<string>;
export declare function setPreferredMcpTimezone(accessToken: string, timezone: string): Promise<void>;

