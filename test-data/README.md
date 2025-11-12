# 测试数据说明

## 测试步骤

1. **准备测试数据**：
   - 在此目录下放置 `LocalizeTable.xlsx` 文件
   - Excel 文件需要包含 `LocalizeTable-Lang` 和 `clientLang` 两个 sheet

2. **Excel 格式要求**：
   ```
   第1行：备注行（任意内容，会被忽略）
   第2行：字段名
     - 第1列：任意内容
     - 第2列：key 字段名（如 "id"）
     - 第3列起：语言版本名称（如 "zh", "en", "ja"）
   
   第3行起：数据行
     - 第1列：备注（可选）
     - 第2列：多语言 key（如 "100001"）
     - 第3列起：各语言版本的翻译内容
   ```

3. **示例数据**：
   ```
   | 备注       | id     | zh         | en            | ja             |
   |-----------|--------|------------|---------------|----------------|
   | 游戏名称   | 100001 | 骷髅传说    | Skeleton Legend | スケルトン伝説  |
   | 系统提示   | 100101 | 该系统功能维护中… | System maintenance... | システムメンテナンス中... |
   ```

4. **配置文件**：
   更新 `config.json`：
   ```json
   {
     "dataDir": "E:/cocos/LhDemo/extensions/lh-tool/test-data",
     "langDir": "E:/cocos/LhDemo/extensions/lh-tool/test-output",
     "formatEnabled": true
   }
   ```

5. **运行测试**：
   ```bash
   # 方式1：双击运行
   bat/export-localize.bat
   
   # 方式2：命令行运行
   cd e:/cocos/LhDemo/extensions/lh-tool
   node test-export-localize.js
   ```

6. **查看结果**：
   生成的 JSON 文件会在 `test-output` 目录下：
   - `zh.json`
   - `en.json`
   - `ja.json`
