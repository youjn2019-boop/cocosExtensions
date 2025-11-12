export const tableTemplete = {
    "table": 
`import { JsonUtil } from "../../oops/core/utils/JsonUtil";
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