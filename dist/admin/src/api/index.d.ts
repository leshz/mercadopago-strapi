declare const getConfig: () => Promise<any>;
declare const setConfig: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
declare const getDashboardStats: (fetchClient: {
    get: (url: string) => Promise<{
        data: any;
    }>;
}, days?: number) => Promise<any>;
export { getConfig, setConfig, getDashboardStats };
