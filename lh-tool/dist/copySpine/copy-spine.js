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

// source/copySpine/copy-spine.ts
var copy_spine_exports = {};
__export(copy_spine_exports, {
  copySpineFiles: () => copySpineFiles
});
module.exports = __toCommonJS(copy_spine_exports);
var import_fs = require("fs");
var import_path = require("path");
var defaultSourcePath = "..\\..\\..\\..\\..\\..\\Art\\\u52A8\u4F5C\\avatar";
var defaultTargetPath = "..\\..\\assets\\bundle\\spine\\hero";
function findSkelFiles(dir) {
  return new Promise((resolve, reject) => {
    let results = [];
    (0, import_fs.readdir)(dir, { withFileTypes: true }, (err, entries) => {
      if (err) {
        return reject(err);
      }
      const promises = entries.map((entry) => {
        const fullPath = (0, import_path.join)(dir, entry.name);
        if (entry.isDirectory()) {
          return findSkelFiles(fullPath).then((subResults) => {
            results = results.concat(subResults);
          });
        } else if (entry.isFile() && (0, import_path.extname)(entry.name) === ".skel") {
          results.push(fullPath);
          return Promise.resolve();
        }
        return Promise.resolve();
      });
      Promise.all(promises).then(() => resolve(results)).catch(reject);
    });
  });
}
function copyFile(source, target) {
  return new Promise((resolve, reject) => {
    const targetDir = (0, import_path.dirname)(target);
    if (!(0, import_fs.existsSync)(targetDir)) {
      (0, import_fs.mkdirSync)(targetDir, { recursive: true });
    }
    const readStream = (0, import_fs.createReadStream)(source);
    const writeStream = (0, import_fs.createWriteStream)(target);
    readStream.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);
    readStream.pipe(writeStream);
  });
}
async function copySpineFiles(sourcePath, targetPath) {
  try {
    console.log("\u5F00\u59CB\u590D\u5236\u9AA8\u9ABC\u52A8\u753B\u8D44\u6E90...");
    console.log(`\u6E90\u8DEF\u5F84: ${sourcePath}`);
    console.log(`\u76EE\u6807\u8DEF\u5F84: ${targetPath}`);
    if (!(0, import_fs.existsSync)(targetPath)) {
      (0, import_fs.mkdirSync)(targetPath, { recursive: true });
    }
    const skelFiles = await findSkelFiles(sourcePath);
    console.log(`\u627E\u5230 ${skelFiles.length} \u4E2Askel\u6587\u4EF6`);
    const copyOperations = [];
    const filesToCopy = /* @__PURE__ */ new Set();
    for (const skelFile of skelFiles) {
      const baseName = (0, import_path.basename)(skelFile, ".skel");
      const dirName = (0, import_path.dirname)(skelFile);
      const atlasFilePath = (0, import_path.join)(dirName, `${baseName}.atlas`);
      const pngFilePath = (0, import_path.join)(dirName, `${baseName}.png`);
      if ((0, import_fs.existsSync)(atlasFilePath) && (0, import_fs.existsSync)(pngFilePath)) {
        filesToCopy.add(`${baseName}.skel`);
        filesToCopy.add(`${baseName}.atlas`);
        filesToCopy.add(`${baseName}.png`);
        copyOperations.push(async () => {
          try {
            await copyFile(skelFile, (0, import_path.join)(targetPath, `${baseName}.skel`));
            await copyFile(atlasFilePath, (0, import_path.join)(targetPath, `${baseName}.atlas`));
            await copyFile(pngFilePath, (0, import_path.join)(targetPath, `${baseName}.png`));
            return true;
          } catch (error) {
            console.error(`\u5904\u7406\u6587\u4EF6\u65F6\u51FA\u9519: ${skelFile}`, error);
            return false;
          }
        });
      } else {
        console.log(`\u8D44\u6E90\u4E0D\u5B8C\u6574\uFF0C\u8DF3\u8FC7: ${baseName}`);
        console.log(`  \u7F3A\u5C11\u6587\u4EF6: ${!(0, import_fs.existsSync)(atlasFilePath) ? atlasFilePath : ""} ${!(0, import_fs.existsSync)(pngFilePath) ? pngFilePath : ""}`);
      }
    }
    if ((0, import_fs.existsSync)(targetPath)) {
      const targetFiles = await new Promise((resolve, reject) => {
        (0, import_fs.readdir)(targetPath, (err, files) => {
          if (err)
            reject(err);
          else
            resolve(files);
        });
      });
      const deletePromises = targetFiles.filter((file) => !file.endsWith(".meta") && !filesToCopy.has(file)).map((file) => {
        const filePath = (0, import_path.join)(targetPath, file);
        return new Promise((resolve, reject) => {
          (0, import_fs.unlink)(filePath, (err) => {
            if (err)
              reject(err);
            else {
              console.log(`\u5220\u9664\u4E0D\u9700\u8981\u7684\u6587\u4EF6: ${file}`);
              resolve();
            }
          });
        });
      });
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`\u5171\u5220\u9664 ${deletePromises.length} \u4E2A\u4E0D\u9700\u8981\u7684\u6587\u4EF6`);
      }
    }
    if (copyOperations.length > 0) {
      console.log(`\u5F00\u59CB\u590D\u5236 ${copyOperations.length} \u7EC4\u8D44\u6E90...`);
      let completedCount = 0;
      let successCount = 0;
      const updateProgress = () => {
        completedCount++;
        const progress = Math.round(completedCount / copyOperations.length * 100);
        process.stdout.write(`\r\u590D\u5236\u8FDB\u5EA6: ${progress}% (${completedCount}/${copyOperations.length})`);
      };
      const results = await Promise.all(
        copyOperations.map(async (operation) => {
          const result = await operation();
          updateProgress();
          return result;
        })
      );
      console.log();
      successCount = results.filter(Boolean).length;
      console.log(`\u590D\u5236\u5B8C\u6210\uFF0C\u6210\u529F\u590D\u5236 ${successCount} \u7EC4\u8D44\u6E90`);
      return { fileCount: successCount * 3, success: true };
    } else {
      console.log("\u6CA1\u6709\u9700\u8981\u590D\u5236\u7684\u8D44\u6E90");
      return { fileCount: 0, success: true };
    }
  } catch (error) {
    console.error("\u590D\u5236\u8D44\u6E90\u5931\u8D25:", error);
    return { fileCount: 0, success: false };
  }
}
async function main() {
  let sourcePath = defaultSourcePath;
  let targetPath = defaultTargetPath;
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--source" || args[i] === "-s") && i + 1 < args.length) {
      sourcePath = args[i + 1];
      i++;
    } else if ((args[i] === "--target" || args[i] === "-t") && i + 1 < args.length) {
      targetPath = args[i + 1];
      i++;
    }
  }
  await copySpineFiles(sourcePath, targetPath);
}
if (require.main === module) {
  main();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  copySpineFiles
});
