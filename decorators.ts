let uuids = new Map<any, string>();

export function InstallUUID(): Function {
    return function(constructor): void {
        Object.defineProperty(constructor.prototype, "__uuid", {
            enumerable: false,
            configurable: false,
            get: function() {
                if (!uuids.has(this)) {
                    uuids.set(this, (Math["uuid"] || require("node-uuid").v1)());
                }
                return uuids.get(this);
            }
        });
    }
}

export function Namespace(ns: string = 'app'): Function {
    "use strict";
    return function(constructor): void {
        constructor.__ns = ns;
    }
}
