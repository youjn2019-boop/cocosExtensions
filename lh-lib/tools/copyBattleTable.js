const fs = require('fs');

let sourceTable = '..\\..\\assets\\script\\data\\jsonToTs\\table\\';
let destTable = '.\\assets\\battle\\battle\\table\\';
let tableNames = [
    'behavior',
    'buffModify',
    'buff',
    'buffType',
    'buffProcess',
    'buffTrigger',
    'buffAbility',
    'bullet',
    'condition',
    'findTarget',
    'skill',
    'summon',
    'damageExpressConfig',
    'damageExpressDefine',
    'damageExpressConst',
];

for (let i = 0, leni = tableNames.length; i < leni; i++) {
    sourcePath = sourceTable + tableNames[i] + '.ts';
    destPath = destTable + tableNames[i] + '.ts';
    fs.copyFile(sourcePath, destPath, (err) => { if (err) console.log(err) });
    console.log(`复制文件==>${destPath}`);
}