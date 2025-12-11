@echo off
chcp 65001 >nul
echo ======================================
echo 测试复制 Spine 资源功能
echo ======================================
echo.

cd /d %~dp0..\..

REM ========================================
REM 配置参数（直接在此处修改，留空则从config.json读取）
REM Configuration (Modify here, leave empty to read from config.json)
REM ========================================

REM 英雄模型
set HERO_SOURCE=D:\workspace\Pro6\Art\动作\avatar
set HERO_TARGET=E:\cocos\LhDemo\extensions\lh-tool\output\spine\hero

REM 技能特效
set SKILL_SOURCE=
set SKILL_TARGET=

REM 是否仅使用bat中设置的参数，不读取config.json文件 (true/false)
set ONLY_USE_BAT_CONFIG=false

REM ========================================
REM 执行复制
REM Execute copy
REM ========================================

set PARAMS=
if not "%HERO_SOURCE%"=="" set PARAMS=%PARAMS% --hero-source %HERO_SOURCE%
if not "%HERO_TARGET%"=="" set PARAMS=%PARAMS% --hero-target %HERO_TARGET%
if not "%SKILL_SOURCE%"=="" set PARAMS=%PARAMS% --skill-source %SKILL_SOURCE%
if not "%SKILL_TARGET%"=="" set PARAMS=%PARAMS% --skill-target %SKILL_TARGET%
if "%ONLY_USE_BAT_CONFIG%"=="true" set PARAMS=%PARAMS% --only-use-bat-config true

node tool\js\copy-spine-tool.js %PARAMS%

echo.
pause
