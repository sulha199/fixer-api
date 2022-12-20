import { Fixer, IRawParams } from './Fixer';
declare type Fetcher = (...param: Parameters<typeof window.fetch>) => Promise<{
    readonly json: () => any;
}>;
declare class NodeFixer extends Fixer {
    fetch: Fetcher;
    constructor(fetch: Fetcher, ...restParams: any[]);
    request<Result>(path: string, opts: IRawParams): Promise<Result>;
}
export default NodeFixer;
