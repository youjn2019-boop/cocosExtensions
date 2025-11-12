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

// source/main.ts
var main_exports = {};
__export(main_exports, {
  load: () => load,
  methods: () => methods,
  unload: () => unload
});
module.exports = __toCommonJS(main_exports);

// package.json
var package_default = {
  $schema: "./@types/schema/package/index.json",
  package_version: 2,
  name: "lh-tool",
  version: "1.0.0",
  author: "Cocos Creator",
  editor: ">=3.8.7",
  scripts: {
    preinstall: "node ./scripts/preinstall.js",
    build: "node esbuild.config.js",
    preview: "node preview-server.js"
  },
  description: "i18n:lh-tool.description",
  main: "./dist/main.js",
  dependencies: {
    "fs-extra": "^10.0.0",
    "iconv-lite": "^0.6.3",
    vue: "^3.1.4",
    xlsx: "^0.18.5"
  },
  devDependencies: {
    "@cocos/creator-types": "^3.8.7",
    "@types/fs-extra": "^9.0.5",
    "@types/node": "^18.17.1",
    "@types/xlsx": "^0.0.35",
    esbuild: "^0.19.12",
    typescript: "^5.8.2"
  },
  panels: {
    default: {
      title: "i18n:lh-tool.panel_title",
      type: "dockable",
      main: "dist/panels/default",
      size: {
        "min-width": 400,
        "min-height": 300,
        width: 1024,
        height: 600
      }
    }
  },
  contributions: {
    menu: [
      {
        path: "i18n:menu.extension",
        label: "i18n:lh-tool",
        message: "open-panel"
      }
    ],
    messages: {
      "open-panel": {
        methods: [
          "openPanel"
        ]
      }
    }
  }
};

// source/main.ts
var methods = {
  /**
   * @en A method that can be triggered by message
   * @zh 通过 message 触发的方法
   */
  openPanel() {
    Editor.Panel.open(package_default.name);
  }
};
function load() {
}
function unload() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  load,
  methods,
  unload
});
