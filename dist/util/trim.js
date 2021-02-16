"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function trim(obj, exception) {
    const keys = Object.keys(obj);
    let trimed = keys.reduce((acc, value) => {
        acc[value] = obj[value];
        if (exception.indexOf(value)) {
            if (acc[value]) {
                acc[value] = acc[value].trim();
            }
        }
        return acc;
    }, {});
    return trimed;
}
exports.default = trim;
//# sourceMappingURL=trim.js.map