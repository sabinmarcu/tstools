"use strict";

import * as debug from "debug";

let debuggers: Map<String, Function> = new Map();
let info; debug.enable("info"); info = debug("info");

function generate(_type: string, path: string, namespace: string): Function {
    "use strict";
    return function(...args: Array<any>): void {
        if ((typeof this) === "undefined") {
            return;
        }
        let str: string = `${namespace}:${_type}~${path}`,
            s: string = new Error().stack,
            name: string = this.constructor.name || this.name || "",
            r: any = new RegExp(`${name}\.([a-zA-Z]*)`, "g");
        s = s.substr(s.indexOf(name) + name.length); r = r.exec(s);
        if (r && r[1] !== "") {
            if (typeof(this.uuid) !== "undefined") {
                str = `${str}!${this.uuid.substr(0, 6)}`;
            }
            str = `${str}#${r[1]}`;
        }
        if (!debuggers.has(str)) {
            debuggers.set(str, debug(str));
        }
        debuggers.get(str)(...args);
    };
}

function getName(target: Function): string {
        "use strict";

        let name: string = target.name || "",
            section: string = "",
            r: RegExpExecArray = /^(?:[A-Z][a-z]*)+([A-Z][a-z]*)$/.exec(name);

        if (r && r[1]) {
            section = r[1];
        }

        if (section) {
            name = `${section}:${name.replace(section, "")}`;
        }

        return name;
}

export function InstallLoggers(namespace?: string): Function  {
    "use strict";
    namespace = namespace || "app";
    return function(constructor: Function): void {
        "use strict";

        Object.defineProperties(constructor, {
            "log": {
                get: (): any => generate("log", getName(constructor), namespace),
            },
            "warn": {
                get: (): any => generate("warn", getName(constructor), namespace),
            },
            "error": {
                get: (): any => generate("error", getName(constructor), namespace),
            },
            "info": {
                get: (): any => generate("info", getName(constructor), namespace),
            },
        });

        Object.defineProperties(constructor.prototype, {
            "log": {
                get: (): any => generate("log", getName(constructor), namespace),
            },
            "warn": {
                get: (): any => generate("warn", getName(constructor), namespace),
            },
            "error": {
                get: (): any => generate("error", getName(constructor), namespace),
            },
            "info": {
                get: (): any => generate("info", getName(constructor), namespace),
            },
        });
    };
}

export function EnableNamespace(namespace: string = ''): void {
    "use strict";
    info(`Enabling ${namespace}`);
    debug.enable(`${namespace}*`);
}

export function EnableLogs(namespace: string = '*'): void {
    "use strict";
    info(`Enabling logs for ${namespace}`);
    debug.enable(`${namespace}:log*`);
}

export function EnableWarnings(namespace: string = '*'): void {
    "use strict";
    info(`Enabling warnings for ${namespace}`);
    debug.enable(`${namespace}:warn*`);
}

export function EnableErrors(namespace: string = '*'): void {
    "use strict";
    info(`Enabling errors for ${namespace}`);
    debug.enable(`${namespace}:error*`);
}

export function EnableInfos(namespace: string = '*'): void {
    "use strict";
    info(`Enabling infos for ${namespace}`);
    debug.enable(`${namespace}:info*`);
}

export class LoggerStub {
    log(...args: Array<any>): void { console.log("Log Stub"); return; }
    warn(...args: Array<any>): void { console.log("Warn Stub"); return; }
    error(...args: Array<any>): void { console.log("Error Stub"); return; }
    info(...args: Array<any>): void { console.log("Info Stub"); return; }
}
