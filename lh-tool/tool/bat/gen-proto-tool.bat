@echo off
chcp 65001 >nul
echo ========================================
echo 协议文件生成工具
echo Protocol Generator
echo ========================================
echo.

cd /d %~dp0..\..

REM ========================================
REM 配置参数（直接在此处修改）
REM Configuration (Modify here directly)
REM ========================================

REM 源 JSON 文件路径（必需）
REM Source JSON file path (required)
set INPUT_PATH=test-data\testProto\testData.json

REM 输出目录路径（必需）
REM Output directory path (required)
set OUTPUT_DIR=output\proto

REM TypeScript 声明文件名（可选，默认: proto.d.ts）
REM TypeScript declaration file name (optional, default: proto.d.ts)
set DTS_FILE_NAME=proto.d.ts

REM JavaScript 实现文件名（可选，默认: proto.js）
REM JavaScript implementation file name (optional, default: proto.js)
set JS_FILE_NAME=proto.js

REM ========================================
REM 构建参数
REM Build arguments
REM ========================================

set PARAMS=%INPUT_PATH% %OUTPUT_DIR%

if not "%DTS_FILE_NAME%"=="" (
    set PARAMS=%PARAMS% %DTS_FILE_NAME%
)

if not "%JS_FILE_NAME%"=="" (
    set PARAMS=%PARAMS% %JS_FILE_NAME%
)

REM 执行生成
REM Execute generation
node tool\js\gen-proto.js %PARAMS%

echo.
pause

