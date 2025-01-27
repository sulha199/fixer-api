"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Fixer_1 = require("./Fixer");
const stringifyOptions_1 = require("./stringifyOptions");
class NodeFixer extends Fixer_1.Fixer {
    constructor(fetch, ...restParams) {
        super(...restParams);
        this.fetch = fetch;
    }
    request(path, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessKey = opts.access_key || this.basicOptions.accessKey;
            if (!accessKey) {
                throw new Error('access_key is required to use fixer');
            }
            const filteredOptions = Object.entries(opts).reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), (value ? { [key]: value } : {}))), {
                access_key: accessKey
            });
            const url = `${this.basicOptions.baseUrl}${path}`;
            const response = yield this.fetch(`${url}?${stringifyOptions_1.default(filteredOptions)}`, {
                headers: { 'apikey': accessKey }
            });
            let jsonResponse;
            try {
                jsonResponse = yield response.json();
            }
            catch (_a) {
                throw new Error(`Request to ${url} resulted in non-JSON response`);
            }
            if (jsonResponse.error) {
                throw new Error(`${jsonResponse.error.type}: ${jsonResponse.error.info}`);
            }
            return jsonResponse;
        });
    }
}
exports.default = NodeFixer;
//# sourceMappingURL=NodeFixer.js.map