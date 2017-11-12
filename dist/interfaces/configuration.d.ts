/// <reference types="node" />
import { ServerOptions } from 'https';
export interface Configurations {
    host?: string;
    port?: number;
    path?: string;
    wildcard?: boolean;
    secret?: string;
    trustProxy?: boolean;
    enableHealthcheck?: boolean;
    healthcheckCode?: number;
    https?: ServerOptions;
}
