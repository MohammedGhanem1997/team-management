"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configLoader = process.env.NODE_ENV === 'production'
    ? require('./prod/app.config').default
    : require('./dev/app.config').default;
exports.default = configLoader;
//# sourceMappingURL=index.js.map