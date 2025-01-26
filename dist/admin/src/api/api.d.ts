declare const getConfig: () => Promise<any>;
declare const setConfig: (data: any) => Promise<import("axios").AxiosResponse<any, any>>;
export { getConfig, setConfig };
