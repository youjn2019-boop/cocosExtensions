@echo off
chcp 65001 >nul
echo ========================================
echo 导出多语言
echo ========================================
echo.

cd /d %~dp0..\..

REM ========================================
REM 配置参数（可选，如果不设置则使用 config.json 中的配置）
REM ========================================

REM 表格数据目录
set DATA_DIR=

REM 导出多语言目录
set LANG_DIR=

REM 是否格式化（true 或 false）
set FORMAT=

REM ========================================
REM 构建参数
REM ========================================

set PARAMS=

if not "%DATA_DIR%"=="" (
    set PARAMS=%PARAMS% --dataDir "%DATA_DIR%"
)

if not "%LANG_DIR%"=="" (
    set PARAMS=%PARAMS% --langDir "%LANG_DIR%"
)

if not "%FORMAT%"=="" (
    set PARAMS=%PARAMS% --format %FORMAT%
)

REM 执行导出
node tool/js/export-localize-tool.js%PARAMS%

echo.
pause
