const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const postcss = require('rollup-plugin-postcss');
const typescript = require('rollup-plugin-typescript2');
const terser = require('@rollup/plugin-terser');

// 开关变量：控制是否启用压缩混淆
const enableMinification = false; // 设置为false可禁用压缩混淆

module.exports = [{
        input: './assets/battle/index.ts',
        output: [
            {
                file: 'dist/battle-lib.umd.js',
                format: 'umd',
                name: 'BattleLib',
                sourcemap: false
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json'
            }),
            postcss({
                minimize: true,
                extensions: ['.css'],
                extract: true
            }),
            // 条件性添加terser插件
            ...(enableMinification ? [terser()] : [])
        ]
    }
];