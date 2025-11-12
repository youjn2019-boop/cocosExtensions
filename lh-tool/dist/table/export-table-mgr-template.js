"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// source/table/export-table-mgr-template.ts
var export_table_mgr_template_exports = {};
__export(export_table_mgr_template_exports, {
  tableTemplete: () => tableTemplete
});
module.exports = __toCommonJS(export_table_mgr_template_exports);
var tableTemplete = {
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
  "importStr": `import { {{name}}Manager } from "./table/{{name}}Manager"
`,
  "registerStr": `        this._tbMgrClsMap[this.tableNames[{{index}}]] = {{name}}Manager;
`,
  "getMgrStr": `
    get {{name}}(): {{name}}Manager {
        return this.getMgr('{{name}}');
    }
        `
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tableTemplete
});
