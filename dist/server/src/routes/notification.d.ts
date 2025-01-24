declare const _default: {
    type: string;
    routes: {
        method: "POST";
        path: "/notifications";
        handler: string;
        config: {
            middlewares: string[];
            auth: boolean;
        };
    }[];
};
export default _default;
