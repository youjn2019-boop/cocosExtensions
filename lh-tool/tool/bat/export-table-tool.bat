@echo off
chcp 65001 >nul
echo =======================================
echo 导出表格
echo =======================================
echo.

cd /d %~dp0..\..

REM ========================================
REM 配置参数（直接在此处修改，留空则从config.json读取）
REM Configuration (Modify here, leave empty to read from config.json)
REM ========================================

REM 打表工具路径
set EXE_FILE=

REM 表格数据目录
set DATA_DIR=

REM 导出代码目录
set CODE_DIR=

REM 导出数据目录
set EXPORT_DATA_DIR=

REM 临时目录
set TEMP_DIR=

REM 导出模式
set EXPORT_MODE="Client"

REM ========================================
REM 执行导出
REM Execute export
REM ========================================

set PARAMS=
if not "%EXE_FILE%"=="" set PARAMS=%PARAMS% --exeFile %EXE_FILE%
if not "%DATA_DIR%"=="" set PARAMS=%PARAMS% --dataDir %DATA_DIR%
if not "%CODE_DIR%"=="" set PARAMS=%PARAMS% --codeDir %CODE_DIR%
if not "%EXPORT_DATA_DIR%"=="" set PARAMS=%PARAMS% --exportDataDir %EXPORT_DATA_DIR%
if not "%TEMP_DIR%"=="" set PARAMS=%PARAMS% --tempDir %TEMP_DIR%
if not "%EXPORT_MODE%"=="" set PARAMS=%PARAMS% --exportMode %EXPORT_MODE%

node tool\js\export-table.js %PARAMS%

echo.
pause