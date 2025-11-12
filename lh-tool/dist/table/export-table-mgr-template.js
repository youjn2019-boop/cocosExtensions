"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableTemplete = void 0;
exports.tableTemplete = {
    "table": `import { JsonUtil } from "../../oops/core/utils/JsonUtil";
{{importStr}}
export class Tables {
    private static _instance: Tables = null!;
    static get instance(): Tables {
        if (!this._instance) {
            this._instance = new Tables();
        }
        return this._instance;
    }

    tableNames = [{{namesStr}}];

    private _tbMgrClsMap = {};

    constructor() {
{{registerStr}}
    }

    private _mgrMap = {};
    getMgr(jsonName: string) {
        if (this.tableNames.indexOf(jsonName) == -1) return;
        if (!this._mgrMap[jsonName]) {
            let data = JsonUtil.get(jsonName);
            if (data) {
                this._mgrMap[jsonName] = new this._tbMgrClsMap[jsonName]();
                this._mgrMap[jsonName].mItemArray = data;
                JsonUtil.release(jsonName)
            }
        }
        return this._mgrMap[jsonName];
    }
{{getMgrStr}}
}
`,
    "importStr": `import { {{name}}Manager } from "./table/{{name}}Manager"\n`,
    "registerStr": `        this._tbMgrClsMap[this.tableNames[{{index}}]] = {{name}}Manager;\n`,
    "getMgrStr": `
    get {{name}}(): {{name}}Manager {
        return this.getMgr('{{name}}');
    }
        `,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LXRhYmxlLW1nci10ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NvdXJjZS90YWJsZS9leHBvcnQtdGFibGUtbWdyLXRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsYUFBYSxHQUFHO0lBQ3pCLE9BQU8sRUFDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQWtDQztJQUNHLFdBQVcsRUFBRSw2REFBNkQ7SUFDMUUsYUFBYSxFQUFFLDRFQUE0RTtJQUMzRixXQUFXLEVBQUU7Ozs7U0FJUjtDQUNSLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgdGFibGVUZW1wbGV0ZSA9IHtcclxuICAgIFwidGFibGVcIjogXHJcbmBpbXBvcnQgeyBKc29uVXRpbCB9IGZyb20gXCIuLi8uLi9vb3BzL2NvcmUvdXRpbHMvSnNvblV0aWxcIjtcclxue3tpbXBvcnRTdHJ9fVxyXG5leHBvcnQgY2xhc3MgVGFibGVzIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZTogVGFibGVzID0gbnVsbCE7XHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlKCk6IFRhYmxlcyB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBUYWJsZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRhYmxlTmFtZXMgPSBbe3tuYW1lc1N0cn19XTtcclxuXHJcbiAgICBwcml2YXRlIF90Yk1nckNsc01hcCA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG57e3JlZ2lzdGVyU3RyfX1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tZ3JNYXAgPSB7fTtcclxuICAgIGdldE1ncihqc29uTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudGFibGVOYW1lcy5pbmRleE9mKGpzb25OYW1lKSA9PSAtMSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICghdGhpcy5fbWdyTWFwW2pzb25OYW1lXSkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpzb25VdGlsLmdldChqc29uTmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tZ3JNYXBbanNvbk5hbWVdID0gbmV3IHRoaXMuX3RiTWdyQ2xzTWFwW2pzb25OYW1lXSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWdyTWFwW2pzb25OYW1lXS5tSXRlbUFycmF5ID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIEpzb25VdGlsLnJlbGVhc2UoanNvbk5hbWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21nck1hcFtqc29uTmFtZV07XHJcbiAgICB9XHJcbnt7Z2V0TWdyU3RyfX1cclxufVxyXG5gLFxyXG4gICAgXCJpbXBvcnRTdHJcIjogYGltcG9ydCB7IHt7bmFtZX19TWFuYWdlciB9IGZyb20gXCIuL3RhYmxlL3t7bmFtZX19TWFuYWdlclwiXFxuYCxcclxuICAgIFwicmVnaXN0ZXJTdHJcIjogYCAgICAgICAgdGhpcy5fdGJNZ3JDbHNNYXBbdGhpcy50YWJsZU5hbWVzW3t7aW5kZXh9fV1dID0ge3tuYW1lfX1NYW5hZ2VyO1xcbmAsXHJcbiAgICBcImdldE1nclN0clwiOiBgXHJcbiAgICBnZXQge3tuYW1lfX0oKToge3tuYW1lfX1NYW5hZ2VyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRNZ3IoJ3t7bmFtZX19Jyk7XHJcbiAgICB9XHJcbiAgICAgICAgYCxcclxufTsiXX0=