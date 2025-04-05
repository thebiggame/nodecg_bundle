"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = set;
exports.get = get;
let nodecg;
function set(ctx) {
    nodecg = ctx;
}
function get() {
    return nodecg;
}
