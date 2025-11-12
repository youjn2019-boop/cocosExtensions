"use strict";
// import { spawn } from "child_process";
// import iconv from 'iconv-lite';
// import { tableTemplete } from "./templete";
// import { GenConfig } from "../config/GenConfig";
// const fs = require("fs");
// const path = require("path");
// export class TableGen {
//     /**更新本地化表格 */
//     static async updateLocalize() {
//         // TableTool.exe -work_path %protoPath%\Out\config\ -command ExportLocalize
//         const args = [
//             '-work_path', GenConfig.getConfig().tablePath,
//             '-command', "ExportLocalize",
//         ];
//         let exePath: string = path.dirname(GenConfig.getConfig().dataTool);
//         let exeName: string = path.basename(GenConfig.getConfig().dataTool);
//         console.log("exePath")
//         return new Promise((resolve, reject) => {
//             process.chdir(exePath);
//             const child = spawn(exeName, args, {
//                 stdio: 'pipe',
//                 windowsHide: true
//             });
//             // 实时输出处理
//             child.stdout.on('data', (chunk: Buffer) => {
//                 console.log(iconv.decode(chunk, 'gbk'));
//             });
//             child.stderr.on('data', (chunk: Buffer) => {
//                 const errorMsg = iconv.decode(chunk, 'gbk');
//                 console.error(errorMsg);
//             });
//             child.on('error', (err) => {
//                 reject(err);
//             });
//             child.on('close', (code) => {
//                 if (code === 0) {
//                     console.log("更新本地化成功");
//                     resolve(null);
//                 } else {
//                     reject(new Error(`更新本地化异常： exited with code ${code}`));
//                 }
//             });
//         });
//     }
//     /**生成Tables代码 */
//     static genTables(tableNames: string[]) {
//         let fileUrl: string = path.join(GenConfig.getConfig().outCodePath, '../Tables.ts');
//         if (!tableNames || tableNames.length == 0 || !fileUrl) {
//             return;
//         }
//         let names: string = "\n";
//         let importStr: string = "";
//         let registerStr: string = "";
//         let getMgrStr: string = "";
//         let tmpStr: string;
//         for (let i: number = 0, leni: number = tableNames.length; i < leni; i++) {
//             let tableName: string = tableNames[i];
//             names += `        "${tableName}",\n`;
//             importStr += tableTemplete.importStr.replace(new RegExp("{{name}}", 'g'), tableName);
//             tmpStr = tableTemplete.registerStr.replace(new RegExp("{{name}}", 'g'), tableName);
//             registerStr += tmpStr.replace(new RegExp("{{index}}", 'g'), i.toString());
//             getMgrStr += tableTemplete.getMgrStr.replace(new RegExp("{{name}}", 'g'), tableName);
//         }
//         names += "    ";
//         let tableTs: string = tableTemplete.table;
//         let reg: RegExp = /\{\{(.+?)\}\}/;
//         let match: RegExpExecArray = reg.exec(tableTs);
//         let value: string;
//         while (match) {
//             switch (match[1]) {
//                 case "namesStr":
//                     value = names;
//                     break;
//                 case "importStr":
//                     value = importStr;
//                     break;
//                 case "registerStr":
//                     value = registerStr;
//                     break;
//                 case "getMgrStr":
//                     value = getMgrStr;
//                     break;
//             }
//             tableTs = tableTs.replace(match[0], value);
//             match = reg.exec(tableTs);
//         }
//         try {
//             fs.writeFileSync(fileUrl, tableTs);
//             console.log(`[tablegen tableTemplete] success ==> ${fileUrl}`);
//         } catch (err) {
//             console.error(`[tablegen tableTemplete] error`);
//             console.error(err);
//         }
//     }
//     /**获取指定模式下的表名列表 */
//     static getModeTableNames(exportMode: string): string[] {
//         // 检查dataTool是否存在
//         if (!GenConfig.getConfig().tablePath) {
//             console.error('tablePath未设置');
//             return;
//         }
//         if (!exportMode) {
//             exportMode = GenConfig.getConfig().exportMode;
//         }
//         let tableConfig = `${GenConfig.getConfig().tablePath}/config.json`;
//         try {
//             let tableNames: string[];
//             if (!fs.existsSync(tableConfig)) {
//                 console.log(`tableConfig ${tableConfig} not exist`);
//                 return tableNames;
//             }
//             let data = fs.readFileSync(tableConfig, "utf-8");
//             if (data) {
//                 tableNames = [];
//                 let configObj = JSON.parse(data);
//                 let defaultExport: boolean = configObj["ExportSettings"][exportMode]["DefaultExportTable"];
//                 let TypeInfos = configObj["ExportSettings"][exportMode]["TypeInfos"];
//                 console.log(`默认导出===> mode == [${exportMode}]-------defaultExport: ${defaultExport}`)
//                 for (const key in configObj["Tables"]) {
//                     if (configObj["Tables"][key]["Name"]) {
//                         if (defaultExport) {
//                             //默认导出
//                             if (!TypeInfos[key] || TypeInfos[key]["Exportable"]) {
//                                 tableNames.push(configObj["Tables"][key]["Name"]);
//                             }
//                         } else {
//                             if (TypeInfos[key] && TypeInfos[key]["Exportable"]) {
//                                 tableNames.push(configObj["Tables"][key]["Name"]);
//                             }
//                         }
//                     }
//                 }
//             }
//             return tableNames;
//         } catch (err) {
//             console.error(`[tablegen readConfig] error`);
//         }
//     }
//     /**复制表格代码和数据 */
//     static copyCode(tableNames: string[]) {
//         let originPath: string = GenConfig.getConfig().tmpPath;
//         let codePath: string = GenConfig.getConfig().outCodePath;
//         let dataPath: string = GenConfig.getConfig().outDataPath;
//         try {
//             if (originPath) {
//                 let tableName: string;
//                 let fileName: string;
//                 let origrinFileName: string;
//                 let destFileName: string;
//                 // 复制common
//                 fileName = "common.ts";
//                 origrinFileName = path.join(originPath, fileName);
//                 destFileName = path.join(codePath, fileName);
//                 fs.copyFile(origrinFileName, destFileName, (err) => { err && console.log(err) });
//                 for (let i: number = 0, leni: number = tableNames.length; i < leni; i++) {
//                     tableName = tableNames[i];
//                     // 复制代码
//                     fileName = tableName + ".ts";
//                     origrinFileName = path.join(originPath, fileName);
//                     destFileName = path.join(codePath, fileName);
//                     fs.copyFile(origrinFileName, destFileName, (err) => { err && console.log(err) });
//                     console.log(`复制表格代码 ${destFileName}`);
//                     fileName = tableName + "Manager.ts";
//                     origrinFileName = path.join(originPath, fileName);
//                     destFileName = path.join(codePath, fileName);
//                     fs.copyFile(origrinFileName, destFileName, (err) => { err && console.log(err) });
//                     console.log(`复制Manager代码 ${destFileName}`);
//                     // 复制数据
//                     fileName = tableName + ".json";
//                     origrinFileName = path.join(originPath, fileName);
//                     destFileName = path.join(dataPath, fileName);
//                     fs.copyFile(origrinFileName, destFileName, (err) => { err && console.log(err) });
//                     console.log(`复制表格json ${destFileName}`);
//                 }
//             }
//         } catch (err) {
//             console.error(`[tablegen readConfig] error`);
//         }
//     }
//     /**导出表格 */
//     static async execTableTool(exportMode: string) {
//         return new Promise((resolve, reject) => {
//             // 检查dataTool是否存在
//             if (!GenConfig.getConfig().dataTool) {
//                 console.error('dataTool未设置');
//                 reject();
//                 return;
//             }
//             // 检查dataTool是否存在
//             if (!GenConfig.getConfig().tablePath) {
//                 console.error('tablePath未设置');
//                 reject();
//                 return;
//             }
//             // 检查dataTool是否存在
//             if (!GenConfig.getConfig().tmpPath) {
//                 console.error('tmpPath未设置');
//                 reject();
//                 return;
//             }
//             if (!exportMode) {
//                 exportMode = GenConfig.getConfig().exportMode;
//             }
//             const args = [
//                 '-work_path', GenConfig.getConfig().tablePath,
//                 '-code_path', GenConfig.getConfig().tmpPath,
//                 '-code_type', 'TypeScript',
//                 '-export_mode', exportMode,
//                 '-delay_load'
//             ];
//             let exePath: string = path.dirname(GenConfig.getConfig().dataTool);
//             let exeName: string = path.basename(GenConfig.getConfig().dataTool);
//             process.chdir(exePath);
//             const child = spawn(exeName, args, {
//                 stdio: 'pipe',
//                 windowsHide: true
//             });
//             // 实时输出处理
//             child.stdout.on('data', (chunk: Buffer) => {
//                 console.log(iconv.decode(chunk, 'gbk'));
//             });
//             child.stderr.on('data', (chunk: Buffer) => {
//                 const errorMsg = iconv.decode(chunk, 'gbk');
//                 console.error(errorMsg);
//             });
//             child.on('error', (err) => {
//                 reject(err);
//             });
//             child.on('close', (code) => {
//                 if (code === 0) {
//                     console.log("表格导出成功");
//                     resolve(null);
//                 } else {
//                     reject(new Error(`Process exited with code ${code}`));
//                 }
//             });
//         });
//     }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtZ2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL3RhYmxlL3RhYmxlLWdlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUNBQXlDO0FBQ3pDLGtDQUFrQztBQUNsQyw4Q0FBOEM7QUFDOUMsbURBQW1EO0FBRW5ELDRCQUE0QjtBQUM1QixnQ0FBZ0M7QUFFaEMsMEJBQTBCO0FBQzFCLG9CQUFvQjtBQUNwQixzQ0FBc0M7QUFDdEMsc0ZBQXNGO0FBQ3RGLHlCQUF5QjtBQUN6Qiw2REFBNkQ7QUFDN0QsNENBQTRDO0FBQzVDLGFBQWE7QUFFYiw4RUFBOEU7QUFDOUUsK0VBQStFO0FBQy9FLGlDQUFpQztBQUVqQyxvREFBb0Q7QUFDcEQsc0NBQXNDO0FBQ3RDLG1EQUFtRDtBQUNuRCxpQ0FBaUM7QUFDakMsb0NBQW9DO0FBQ3BDLGtCQUFrQjtBQUVsQix3QkFBd0I7QUFDeEIsMkRBQTJEO0FBQzNELDJEQUEyRDtBQUMzRCxrQkFBa0I7QUFFbEIsMkRBQTJEO0FBQzNELCtEQUErRDtBQUMvRCwyQ0FBMkM7QUFDM0Msa0JBQWtCO0FBRWxCLDJDQUEyQztBQUMzQywrQkFBK0I7QUFDL0Isa0JBQWtCO0FBRWxCLDRDQUE0QztBQUM1QyxvQ0FBb0M7QUFDcEMsOENBQThDO0FBQzlDLHFDQUFxQztBQUNyQywyQkFBMkI7QUFDM0IsOEVBQThFO0FBQzlFLG9CQUFvQjtBQUNwQixrQkFBa0I7QUFDbEIsY0FBYztBQUNkLFFBQVE7QUFFUix1QkFBdUI7QUFDdkIsK0NBQStDO0FBQy9DLDhGQUE4RjtBQUM5RixtRUFBbUU7QUFDbkUsc0JBQXNCO0FBQ3RCLFlBQVk7QUFDWixvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBQ3RDLHdDQUF3QztBQUN4QyxzQ0FBc0M7QUFDdEMsOEJBQThCO0FBQzlCLHFGQUFxRjtBQUNyRixxREFBcUQ7QUFDckQsb0RBQW9EO0FBRXBELG9HQUFvRztBQUNwRyxrR0FBa0c7QUFDbEcseUZBQXlG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QWlFO0FBQ2pFLGdCQUFnQjtBQUVoQiw2QkFBNkI7QUFDN0IsaUVBQWlFO0FBQ2pFLCtEQUErRDtBQUMvRCw4Q0FBOEM7QUFDOUMsOENBQThDO0FBQzlDLGdDQUFnQztBQUNoQyxpQkFBaUI7QUFFakIsa0ZBQWtGO0FBQ2xGLG1GQUFtRjtBQUVuRixzQ0FBc0M7QUFDdEMsbURBQW1EO0FBQ25ELGlDQUFpQztBQUNqQyxvQ0FBb0M7QUFDcEMsa0JBQWtCO0FBRWxCLHdCQUF3QjtBQUN4QiwyREFBMkQ7QUFDM0QsMkRBQTJEO0FBQzNELGtCQUFrQjtBQUVsQiwyREFBMkQ7QUFDM0QsK0RBQStEO0FBQy9ELDJDQUEyQztBQUMzQyxrQkFBa0I7QUFFbEIsMkNBQTJDO0FBQzNDLCtCQUErQjtBQUMvQixrQkFBa0I7QUFFbEIsNENBQTRDO0FBQzVDLG9DQUFvQztBQUNwQyw2Q0FBNkM7QUFDN0MscUNBQXFDO0FBQ3JDLDJCQUEyQjtBQUMzQiw2RUFBNkU7QUFDN0Usb0JBQW9CO0FBQ3BCLGtCQUFrQjtBQUNsQixjQUFjO0FBQ2QsUUFBUTtBQUNSLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyBzcGF3biB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XHJcbi8vIGltcG9ydCBpY29udiBmcm9tICdpY29udi1saXRlJztcclxuLy8gaW1wb3J0IHsgdGFibGVUZW1wbGV0ZSB9IGZyb20gXCIuL3RlbXBsZXRlXCI7XHJcbi8vIGltcG9ydCB7IEdlbkNvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvR2VuQ29uZmlnXCI7XHJcblxyXG4vLyBjb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuLy8gY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG5cclxuLy8gZXhwb3J0IGNsYXNzIFRhYmxlR2VuIHtcclxuLy8gICAgIC8qKuabtOaWsOacrOWcsOWMluihqOagvCAqL1xyXG4vLyAgICAgc3RhdGljIGFzeW5jIHVwZGF0ZUxvY2FsaXplKCkge1xyXG4vLyAgICAgICAgIC8vIFRhYmxlVG9vbC5leGUgLXdvcmtfcGF0aCAlcHJvdG9QYXRoJVxcT3V0XFxjb25maWdcXCAtY29tbWFuZCBFeHBvcnRMb2NhbGl6ZVxyXG4vLyAgICAgICAgIGNvbnN0IGFyZ3MgPSBbXHJcbi8vICAgICAgICAgICAgICctd29ya19wYXRoJywgR2VuQ29uZmlnLmdldENvbmZpZygpLnRhYmxlUGF0aCxcclxuLy8gICAgICAgICAgICAgJy1jb21tYW5kJywgXCJFeHBvcnRMb2NhbGl6ZVwiLFxyXG4vLyAgICAgICAgIF07XHJcblxyXG4vLyAgICAgICAgIGxldCBleGVQYXRoOiBzdHJpbmcgPSBwYXRoLmRpcm5hbWUoR2VuQ29uZmlnLmdldENvbmZpZygpLmRhdGFUb29sKTtcclxuLy8gICAgICAgICBsZXQgZXhlTmFtZTogc3RyaW5nID0gcGF0aC5iYXNlbmFtZShHZW5Db25maWcuZ2V0Q29uZmlnKCkuZGF0YVRvb2wpO1xyXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKFwiZXhlUGF0aFwiKVxyXG5cclxuLy8gICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4vLyAgICAgICAgICAgICBwcm9jZXNzLmNoZGlyKGV4ZVBhdGgpO1xyXG4vLyAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IHNwYXduKGV4ZU5hbWUsIGFyZ3MsIHtcclxuLy8gICAgICAgICAgICAgICAgIHN0ZGlvOiAncGlwZScsXHJcbi8vICAgICAgICAgICAgICAgICB3aW5kb3dzSGlkZTogdHJ1ZVxyXG4vLyAgICAgICAgICAgICB9KTtcclxuXHJcbi8vICAgICAgICAgICAgIC8vIOWunuaXtui+k+WHuuWkhOeQhlxyXG4vLyAgICAgICAgICAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoY2h1bms6IEJ1ZmZlcikgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaWNvbnYuZGVjb2RlKGNodW5rLCAnZ2JrJykpO1xyXG4vLyAgICAgICAgICAgICB9KTtcclxuXHJcbi8vICAgICAgICAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChjaHVuazogQnVmZmVyKSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zdCBlcnJvck1zZyA9IGljb252LmRlY29kZShjaHVuaywgJ2diaycpO1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvck1zZyk7XHJcbi8vICAgICAgICAgICAgIH0pO1xyXG5cclxuLy8gICAgICAgICAgICAgY2hpbGQub24oJ2Vycm9yJywgKGVycikgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbi8vICAgICAgICAgICAgIH0pO1xyXG5cclxuLy8gICAgICAgICAgICAgY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUpID0+IHtcclxuLy8gICAgICAgICAgICAgICAgIGlmIChjb2RlID09PSAwKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLmm7TmlrDmnKzlnLDljJbmiJDlip9cIik7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihg5pu05paw5pys5Zyw5YyW5byC5bi477yaIGV4aXRlZCB3aXRoIGNvZGUgJHtjb2RlfWApKTtcclxuLy8gICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgfSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq55Sf5oiQVGFibGVz5Luj56CBICovXHJcbi8vICAgICBzdGF0aWMgZ2VuVGFibGVzKHRhYmxlTmFtZXM6IHN0cmluZ1tdKSB7XHJcbi8vICAgICAgICAgbGV0IGZpbGVVcmw6IHN0cmluZyA9IHBhdGguam9pbihHZW5Db25maWcuZ2V0Q29uZmlnKCkub3V0Q29kZVBhdGgsICcuLi9UYWJsZXMudHMnKTtcclxuLy8gICAgICAgICBpZiAoIXRhYmxlTmFtZXMgfHwgdGFibGVOYW1lcy5sZW5ndGggPT0gMCB8fCAhZmlsZVVybCkge1xyXG4vLyAgICAgICAgICAgICByZXR1cm47XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGxldCBuYW1lczogc3RyaW5nID0gXCJcXG5cIjtcclxuLy8gICAgICAgICBsZXQgaW1wb3J0U3RyOiBzdHJpbmcgPSBcIlwiO1xyXG4vLyAgICAgICAgIGxldCByZWdpc3RlclN0cjogc3RyaW5nID0gXCJcIjtcclxuLy8gICAgICAgICBsZXQgZ2V0TWdyU3RyOiBzdHJpbmcgPSBcIlwiO1xyXG4vLyAgICAgICAgIGxldCB0bXBTdHI6IHN0cmluZztcclxuLy8gICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwLCBsZW5pOiBudW1iZXIgPSB0YWJsZU5hbWVzLmxlbmd0aDsgaSA8IGxlbmk7IGkrKykge1xyXG4vLyAgICAgICAgICAgICBsZXQgdGFibGVOYW1lOiBzdHJpbmcgPSB0YWJsZU5hbWVzW2ldO1xyXG4vLyAgICAgICAgICAgICBuYW1lcyArPSBgICAgICAgICBcIiR7dGFibGVOYW1lfVwiLFxcbmA7XHJcblxyXG4vLyAgICAgICAgICAgICBpbXBvcnRTdHIgKz0gdGFibGVUZW1wbGV0ZS5pbXBvcnRTdHIucmVwbGFjZShuZXcgUmVnRXhwKFwie3tuYW1lfX1cIiwgJ2cnKSwgdGFibGVOYW1lKTtcclxuLy8gICAgICAgICAgICAgdG1wU3RyID0gdGFibGVUZW1wbGV0ZS5yZWdpc3RlclN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoXCJ7e25hbWV9fVwiLCAnZycpLCB0YWJsZU5hbWUpO1xyXG4vLyAgICAgICAgICAgICByZWdpc3RlclN0ciArPSB0bXBTdHIucmVwbGFjZShuZXcgUmVnRXhwKFwie3tpbmRleH19XCIsICdnJyksIGkudG9TdHJpbmcoKSk7XHJcbi8vICAgICAgICAgICAgIGdldE1nclN0ciArPSB0YWJsZVRlbXBsZXRlLmdldE1nclN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoXCJ7e25hbWV9fVwiLCAnZycpLCB0YWJsZU5hbWUpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBuYW1lcyArPSBcIiAgICBcIjtcclxuXHJcbi8vICAgICAgICAgbGV0IHRhYmxlVHM6IHN0cmluZyA9IHRhYmxlVGVtcGxldGUudGFibGU7XHJcblxyXG4vLyAgICAgICAgIGxldCByZWc6IFJlZ0V4cCA9IC9cXHtcXHsoLis/KVxcfVxcfS87XHJcbi8vICAgICAgICAgbGV0IG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgPSByZWcuZXhlYyh0YWJsZVRzKTtcclxuXHJcbi8vICAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmc7XHJcbi8vICAgICAgICAgd2hpbGUgKG1hdGNoKSB7XHJcbi8vICAgICAgICAgICAgIHN3aXRjaCAobWF0Y2hbMV0pIHtcclxuLy8gICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lc1N0clwiOlxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbmFtZXM7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbi8vICAgICAgICAgICAgICAgICBjYXNlIFwiaW1wb3J0U3RyXCI6XHJcbi8vICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpbXBvcnRTdHI7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbi8vICAgICAgICAgICAgICAgICBjYXNlIFwicmVnaXN0ZXJTdHJcIjpcclxuLy8gICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlZ2lzdGVyU3RyO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4vLyAgICAgICAgICAgICAgICAgY2FzZSBcImdldE1nclN0clwiOlxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0TWdyU3RyO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4vLyAgICAgICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgICAgICB0YWJsZVRzID0gdGFibGVUcy5yZXBsYWNlKG1hdGNoWzBdLCB2YWx1ZSk7XHJcbi8vICAgICAgICAgICAgIG1hdGNoID0gcmVnLmV4ZWModGFibGVUcyk7XHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICB0cnkge1xyXG4vLyAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVVcmwsIHRhYmxlVHMpO1xyXG4vLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW3RhYmxlZ2VuIHRhYmxlVGVtcGxldGVdIHN1Y2Nlc3MgPT0+ICR7ZmlsZVVybH1gKTtcclxuLy8gICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuLy8gICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW3RhYmxlZ2VuIHRhYmxlVGVtcGxldGVdIGVycm9yYCk7XHJcbi8vICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq6I635Y+W5oyH5a6a5qih5byP5LiL55qE6KGo5ZCN5YiX6KGoICovXHJcbi8vICAgICBzdGF0aWMgZ2V0TW9kZVRhYmxlTmFtZXMoZXhwb3J0TW9kZTogc3RyaW5nKTogc3RyaW5nW10ge1xyXG4vLyAgICAgICAgIC8vIOajgOafpWRhdGFUb29s5piv5ZCm5a2Y5ZyoXHJcbi8vICAgICAgICAgaWYgKCFHZW5Db25maWcuZ2V0Q29uZmlnKCkudGFibGVQYXRoKSB7XHJcbi8vICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3RhYmxlUGF0aOacquiuvue9ricpO1xyXG4vLyAgICAgICAgICAgICByZXR1cm47XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGlmICghZXhwb3J0TW9kZSkge1xyXG4vLyAgICAgICAgICAgICBleHBvcnRNb2RlID0gR2VuQ29uZmlnLmdldENvbmZpZygpLmV4cG9ydE1vZGU7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGxldCB0YWJsZUNvbmZpZyA9IGAke0dlbkNvbmZpZy5nZXRDb25maWcoKS50YWJsZVBhdGh9L2NvbmZpZy5qc29uYDtcclxuLy8gICAgICAgICB0cnkge1xyXG4vLyAgICAgICAgICAgICBsZXQgdGFibGVOYW1lczogc3RyaW5nW107XHJcbi8vICAgICAgICAgICAgIGlmICghZnMuZXhpc3RzU3luYyh0YWJsZUNvbmZpZykpIHtcclxuLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGB0YWJsZUNvbmZpZyAke3RhYmxlQ29uZmlnfSBub3QgZXhpc3RgKTtcclxuLy8gICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZU5hbWVzO1xyXG4vLyAgICAgICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgICAgICBsZXQgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyh0YWJsZUNvbmZpZywgXCJ1dGYtOFwiKTtcclxuLy8gICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuLy8gICAgICAgICAgICAgICAgIHRhYmxlTmFtZXMgPSBbXTtcclxuLy8gICAgICAgICAgICAgICAgIGxldCBjb25maWdPYmogPSBKU09OLnBhcnNlKGRhdGEpO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgIGxldCBkZWZhdWx0RXhwb3J0OiBib29sZWFuID0gY29uZmlnT2JqW1wiRXhwb3J0U2V0dGluZ3NcIl1bZXhwb3J0TW9kZV1bXCJEZWZhdWx0RXhwb3J0VGFibGVcIl07XHJcbi8vICAgICAgICAgICAgICAgICBsZXQgVHlwZUluZm9zID0gY29uZmlnT2JqW1wiRXhwb3J0U2V0dGluZ3NcIl1bZXhwb3J0TW9kZV1bXCJUeXBlSW5mb3NcIl07XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg6buY6K6k5a+85Ye6PT09PiBtb2RlID09IFske2V4cG9ydE1vZGV9XS0tLS0tLS1kZWZhdWx0RXhwb3J0OiAke2RlZmF1bHRFeHBvcnR9YClcclxuLy8gICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZ09ialtcIlRhYmxlc1wiXSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGlmIChjb25maWdPYmpbXCJUYWJsZXNcIl1ba2V5XVtcIk5hbWVcIl0pIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRFeHBvcnQpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6buY6K6k5a+85Ye6XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIVR5cGVJbmZvc1trZXldIHx8IFR5cGVJbmZvc1trZXldW1wiRXhwb3J0YWJsZVwiXSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlTmFtZXMucHVzaChjb25maWdPYmpbXCJUYWJsZXNcIl1ba2V5XVtcIk5hbWVcIl0pO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGVJbmZvc1trZXldICYmIFR5cGVJbmZvc1trZXldW1wiRXhwb3J0YWJsZVwiXSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmxlTmFtZXMucHVzaChjb25maWdPYmpbXCJUYWJsZXNcIl1ba2V5XVtcIk5hbWVcIl0pO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgIHJldHVybiB0YWJsZU5hbWVzO1xyXG4vLyAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4vLyAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbdGFibGVnZW4gcmVhZENvbmZpZ10gZXJyb3JgKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq5aSN5Yi26KGo5qC85Luj56CB5ZKM5pWw5o2uICovXHJcbi8vICAgICBzdGF0aWMgY29weUNvZGUodGFibGVOYW1lczogc3RyaW5nW10pIHtcclxuLy8gICAgICAgICBsZXQgb3JpZ2luUGF0aDogc3RyaW5nID0gR2VuQ29uZmlnLmdldENvbmZpZygpLnRtcFBhdGg7XHJcbi8vICAgICAgICAgbGV0IGNvZGVQYXRoOiBzdHJpbmcgPSBHZW5Db25maWcuZ2V0Q29uZmlnKCkub3V0Q29kZVBhdGg7XHJcbi8vICAgICAgICAgbGV0IGRhdGFQYXRoOiBzdHJpbmcgPSBHZW5Db25maWcuZ2V0Q29uZmlnKCkub3V0RGF0YVBhdGg7XHJcbi8vICAgICAgICAgdHJ5IHtcclxuLy8gICAgICAgICAgICAgaWYgKG9yaWdpblBhdGgpIHtcclxuLy8gICAgICAgICAgICAgICAgIGxldCB0YWJsZU5hbWU6IHN0cmluZztcclxuLy8gICAgICAgICAgICAgICAgIGxldCBmaWxlTmFtZTogc3RyaW5nO1xyXG4vLyAgICAgICAgICAgICAgICAgbGV0IG9yaWdyaW5GaWxlTmFtZTogc3RyaW5nO1xyXG4vLyAgICAgICAgICAgICAgICAgbGV0IGRlc3RGaWxlTmFtZTogc3RyaW5nO1xyXG4vLyAgICAgICAgICAgICAgICAgLy8g5aSN5Yi2Y29tbW9uXHJcbi8vICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IFwiY29tbW9uLnRzXCI7XHJcbi8vICAgICAgICAgICAgICAgICBvcmlncmluRmlsZU5hbWUgPSBwYXRoLmpvaW4ob3JpZ2luUGF0aCwgZmlsZU5hbWUpO1xyXG4vLyAgICAgICAgICAgICAgICAgZGVzdEZpbGVOYW1lID0gcGF0aC5qb2luKGNvZGVQYXRoLCBmaWxlTmFtZSk7XHJcbi8vICAgICAgICAgICAgICAgICBmcy5jb3B5RmlsZShvcmlncmluRmlsZU5hbWUsIGRlc3RGaWxlTmFtZSwgKGVycikgPT4geyBlcnIgJiYgY29uc29sZS5sb2coZXJyKSB9KTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwLCBsZW5pOiBudW1iZXIgPSB0YWJsZU5hbWVzLmxlbmd0aDsgaSA8IGxlbmk7IGkrKykge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHRhYmxlTmFtZSA9IHRhYmxlTmFtZXNbaV07XHJcbi8vICAgICAgICAgICAgICAgICAgICAgLy8g5aSN5Yi25Luj56CBXHJcbi8vICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSB0YWJsZU5hbWUgKyBcIi50c1wiO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIG9yaWdyaW5GaWxlTmFtZSA9IHBhdGguam9pbihvcmlnaW5QYXRoLCBmaWxlTmFtZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgZGVzdEZpbGVOYW1lID0gcGF0aC5qb2luKGNvZGVQYXRoLCBmaWxlTmFtZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgZnMuY29weUZpbGUob3JpZ3JpbkZpbGVOYW1lLCBkZXN0RmlsZU5hbWUsIChlcnIpID0+IHsgZXJyICYmIGNvbnNvbGUubG9nKGVycikgfSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOWkjeWItuihqOagvOS7o+eggSAke2Rlc3RGaWxlTmFtZX1gKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IHRhYmxlTmFtZSArIFwiTWFuYWdlci50c1wiO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIG9yaWdyaW5GaWxlTmFtZSA9IHBhdGguam9pbihvcmlnaW5QYXRoLCBmaWxlTmFtZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgZGVzdEZpbGVOYW1lID0gcGF0aC5qb2luKGNvZGVQYXRoLCBmaWxlTmFtZSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgZnMuY29weUZpbGUob3JpZ3JpbkZpbGVOYW1lLCBkZXN0RmlsZU5hbWUsIChlcnIpID0+IHsgZXJyICYmIGNvbnNvbGUubG9nKGVycikgfSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYOWkjeWItk1hbmFnZXLku6PnoIEgJHtkZXN0RmlsZU5hbWV9YCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgLy8g5aSN5Yi25pWw5o2uXHJcbi8vICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWUgPSB0YWJsZU5hbWUgKyBcIi5qc29uXCI7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgb3JpZ3JpbkZpbGVOYW1lID0gcGF0aC5qb2luKG9yaWdpblBhdGgsIGZpbGVOYW1lKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBkZXN0RmlsZU5hbWUgPSBwYXRoLmpvaW4oZGF0YVBhdGgsIGZpbGVOYW1lKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBmcy5jb3B5RmlsZShvcmlncmluRmlsZU5hbWUsIGRlc3RGaWxlTmFtZSwgKGVycikgPT4geyBlcnIgJiYgY29uc29sZS5sb2coZXJyKSB9KTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhg5aSN5Yi26KGo5qC8anNvbiAke2Rlc3RGaWxlTmFtZX1gKTtcclxuLy8gICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4vLyAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbdGFibGVnZW4gcmVhZENvbmZpZ10gZXJyb3JgKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq5a+85Ye66KGo5qC8ICovXHJcbi8vICAgICBzdGF0aWMgYXN5bmMgZXhlY1RhYmxlVG9vbChleHBvcnRNb2RlOiBzdHJpbmcpIHtcclxuLy8gICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4vLyAgICAgICAgICAgICAvLyDmo4Dmn6VkYXRhVG9vbOaYr+WQpuWtmOWcqFxyXG4vLyAgICAgICAgICAgICBpZiAoIUdlbkNvbmZpZy5nZXRDb25maWcoKS5kYXRhVG9vbCkge1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZGF0YVRvb2zmnKrorr7nva4nKTtcclxuLy8gICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgIC8vIOajgOafpWRhdGFUb29s5piv5ZCm5a2Y5ZyoXHJcbi8vICAgICAgICAgICAgIGlmICghR2VuQ29uZmlnLmdldENvbmZpZygpLnRhYmxlUGF0aCkge1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigndGFibGVQYXRo5pyq6K6+572uJyk7XHJcbi8vICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuLy8gICAgICAgICAgICAgICAgIHJldHVybjtcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAvLyDmo4Dmn6VkYXRhVG9vbOaYr+WQpuWtmOWcqFxyXG4vLyAgICAgICAgICAgICBpZiAoIUdlbkNvbmZpZy5nZXRDb25maWcoKS50bXBQYXRoKSB7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCd0bXBQYXRo5pyq6K6+572uJyk7XHJcbi8vICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuLy8gICAgICAgICAgICAgICAgIHJldHVybjtcclxuLy8gICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAgICAgaWYgKCFleHBvcnRNb2RlKSB7XHJcbi8vICAgICAgICAgICAgICAgICBleHBvcnRNb2RlID0gR2VuQ29uZmlnLmdldENvbmZpZygpLmV4cG9ydE1vZGU7XHJcbi8vICAgICAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBbXHJcbi8vICAgICAgICAgICAgICAgICAnLXdvcmtfcGF0aCcsIEdlbkNvbmZpZy5nZXRDb25maWcoKS50YWJsZVBhdGgsXHJcbi8vICAgICAgICAgICAgICAgICAnLWNvZGVfcGF0aCcsIEdlbkNvbmZpZy5nZXRDb25maWcoKS50bXBQYXRoLFxyXG4vLyAgICAgICAgICAgICAgICAgJy1jb2RlX3R5cGUnLCAnVHlwZVNjcmlwdCcsXHJcbi8vICAgICAgICAgICAgICAgICAnLWV4cG9ydF9tb2RlJywgZXhwb3J0TW9kZSxcclxuLy8gICAgICAgICAgICAgICAgICctZGVsYXlfbG9hZCdcclxuLy8gICAgICAgICAgICAgXTtcclxuXHJcbi8vICAgICAgICAgICAgIGxldCBleGVQYXRoOiBzdHJpbmcgPSBwYXRoLmRpcm5hbWUoR2VuQ29uZmlnLmdldENvbmZpZygpLmRhdGFUb29sKTtcclxuLy8gICAgICAgICAgICAgbGV0IGV4ZU5hbWU6IHN0cmluZyA9IHBhdGguYmFzZW5hbWUoR2VuQ29uZmlnLmdldENvbmZpZygpLmRhdGFUb29sKTtcclxuXHJcbi8vICAgICAgICAgICAgIHByb2Nlc3MuY2hkaXIoZXhlUGF0aCk7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gc3Bhd24oZXhlTmFtZSwgYXJncywge1xyXG4vLyAgICAgICAgICAgICAgICAgc3RkaW86ICdwaXBlJyxcclxuLy8gICAgICAgICAgICAgICAgIHdpbmRvd3NIaWRlOiB0cnVlXHJcbi8vICAgICAgICAgICAgIH0pO1xyXG5cclxuLy8gICAgICAgICAgICAgLy8g5a6e5pe26L6T5Ye65aSE55CGXHJcbi8vICAgICAgICAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChjaHVuazogQnVmZmVyKSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpY29udi5kZWNvZGUoY2h1bmssICdnYmsnKSk7XHJcbi8vICAgICAgICAgICAgIH0pO1xyXG5cclxuLy8gICAgICAgICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGNodW5rOiBCdWZmZXIpID0+IHtcclxuLy8gICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTXNnID0gaWNvbnYuZGVjb2RlKGNodW5rLCAnZ2JrJyk7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yTXNnKTtcclxuLy8gICAgICAgICAgICAgfSk7XHJcblxyXG4vLyAgICAgICAgICAgICBjaGlsZC5vbignZXJyb3InLCAoZXJyKSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuLy8gICAgICAgICAgICAgfSk7XHJcblxyXG4vLyAgICAgICAgICAgICBjaGlsZC5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xyXG4vLyAgICAgICAgICAgICAgICAgaWYgKGNvZGUgPT09IDApIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuihqOagvOWvvOWHuuaIkOWKn1wiKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4vLyAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGBQcm9jZXNzIGV4aXRlZCB3aXRoIGNvZGUgJHtjb2RlfWApKTtcclxuLy8gICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgfSk7XHJcbi8vICAgICB9XHJcbi8vIH0iXX0=