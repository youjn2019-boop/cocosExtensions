const esbuild = require('esbuild');
const { copyFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

// 构建主进程
esbuild.build({
    entryPoints: ['source/main.ts'],
    bundle: true,
    outfile: 'dist/main.js',
    platform: 'node',
    format: 'cjs',
    external: [
        'electron',
        'original-fs'
    ],
    sourcemap: false,
    minify: false,
    target: 'node16',
}).catch(() => process.exit(1));

// 构建面板
esbuild.build({
    entryPoints: ['source/panels/default/index.ts'],
    bundle: true,
    outfile: 'dist/panels/default/index.js',
    platform: 'node',
    format: 'cjs',
    external: [
        'electron',
        'original-fs'
    ],
    sourcemap: false,
    minify: false,
    target: 'node16',
    loader: {
        '.html': 'text',
        '.css': 'text'
    }
}).catch(() => process.exit(1));

// 构建 table 模块
const tableFiles = [
    'export-localize.ts',
    'export-table.ts',
    'export-table-mgr-template.ts'
];

tableFiles.forEach(file => {
    esbuild.build({
        entryPoints: [`source/table/${file}`],
        bundle: true,
        outfile: `dist/table/${file.replace('.ts', '.js')}`,
        platform: 'node',
        format: 'cjs',
        external: [
            'electron',
            'original-fs'
        ],
        sourcemap: false,
        minify: false,
        target: 'node16',
    }).catch(() => process.exit(1));
});

// 复制 package.json（主进程需要）
setTimeout(() => {
    if (!existsSync('dist')) {
        mkdirSync('dist', { recursive: true });
    }
    if (existsSync('package.json')) {
        copyFileSync('package.json', 'dist/package.json');
        console.log('✓ Copied package.json to dist');
    }
}, 1000);

console.log('Building with esbuild...');
