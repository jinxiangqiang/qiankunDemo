import '@umijs/max/typings';


interface Client {
    /** 样式前缀 */
    prefix?: string;
    /** ant样式前缀 */
    antPrefix?: string;
    /** 通用间距 */
    gutter?: number | [number, number] | undefined;
    /** 请求地址前缀 */
    proxyPrefix?: string;
}

declare global {
    interface Window {
        client: Client;
    }
}