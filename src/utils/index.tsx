export interface Config {
    baseUrl: string,

}

export const getLogger :  (tag: string) => (...args: any) => void =
    tag => (...args) => console.log(tag, ...args);

export interface ResponseProps<T>{
    data: T,
}
const log = getLogger('api');

export function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
    log(`${fnName} - started`);
    return promise
        .then(res => {
            log(`${fnName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${fnName} - failed`, err);
            return Promise.reject(err);
        });
}

