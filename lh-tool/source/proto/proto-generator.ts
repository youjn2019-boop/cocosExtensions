import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs-extra';
import { join } from 'path';

/**
 * 协议数据结构
 */
interface ProtocolData {
    n: string;  // name
    a?: string; // annotation/description
    p?: Record<string, any>; // properties
}

/**
 * 参数类型解析结果
 */
interface ParsedParameterType {
    tsType: string;
    description: string;
    needsReference?: boolean;
    isArray?: boolean;
    elementType?: string;
}

/**
 * 协议生成器类
 */
export class ProtoGenerator {
    private protocols: ProtocolData[] = [];
    private protocolMap: Map<string, ProtocolData> = new Map();
    private usedProtocolsSC: Set<string> = new Set(); // 跟踪已使用的协议SC
    private usedProtocolsCS: Set<string> = new Set(); // 跟踪已使用的协议CS

    /**
     * 读取并解析 JSON 数据
     */
    loadProtocolData(jsonPath: string): void {
        try {
            const data = readFileSync(jsonPath, 'utf8');
            this.protocols = JSON.parse(data);

            // 建立协议映射
            for (const protocol of this.protocols) {
                this.protocolMap.set(protocol.n, protocol);
            }

            console.log(`成功加载协议数据，共 ${this.protocols.length} 个协议组`);
        } catch (error: any) {
            console.error('读取协议数据失败:', error);
            throw error;
        }
    }

    /**
     * 解析参数类型
     */
    private parseParameterType(usedProtocols: Set<string>, paramValue: any): ParsedParameterType {
        if (Array.isArray(paramValue)) {
            const [type, description] = paramValue;

            if (typeof type === 'number') {
                return { tsType: 'number', description };
            } else if (typeof type === 'string') {
                if (type === '') {
                    return { tsType: 'string', description };
                } else {
                    // 第九步：处理类变量的类型是其他类的情况
                    // 如果类变量的类型不是number或string，并且在json中可以找到类型的定义，那么新加一个引用类
                    const classProtocol = this.protocolMap.get(type);
                    if (classProtocol && classProtocol.p) {
                        // 标记为被使用的协议，这样会在独立类中生成引用类
                        usedProtocols.add(type);
                        return { tsType: type, description, needsReference: true };
                    } else {
                        return { tsType: type, description };
                    }
                }
            } else if (Array.isArray(type)) {
                // 第九步：处理引用类数组的情况
                // 如 "fight_analyze":[["CS_kuaArena_fightFinished_fight_analyze"],"战斗分析数据"]
                const elementArray = type[0];
                let elementType: string;

                if (Array.isArray(elementArray)) {
                    // 处理 [["ItemInfo","id"]] 这种格式，取第一个元素作为类型
                    elementType = elementArray[0];
                } else if (typeof elementArray === 'object' && elementArray !== null) {
                    // 处理 [[{"k":0, "v":0}], "描述"] 这种 Map 数组格式
                    if (Object.prototype.hasOwnProperty.call(elementArray, "v")) {
                        const valueType = elementArray.v;
                        let keyType = 'string';
                        // k 的值：0 表示 number 类型的 key，"" 表示 string 类型的 key
                        if (typeof elementArray.k === 'number' && elementArray.k === 0) {
                            keyType = 'number';
                        } else if (typeof elementArray.k === 'string' && elementArray.k === '') {
                            keyType = 'string';
                        }

                        if (typeof valueType === 'number') {
                            return { tsType: `Record<${keyType}, number>[]`, description };
                        } else if (typeof valueType === 'string') {
                            if (!valueType) {
                                return { tsType: `Record<${keyType}, string>[]`, description };
                            } else {
                                const classProtocol = this.protocolMap.get(valueType);
                                if (classProtocol && classProtocol.p) {
                                    usedProtocols.add(valueType);
                                    return { tsType: `Record<${keyType}, ${valueType}>[]`, description };
                                } else {
                                    return { tsType: `Record<${keyType}, ${valueType}>[]`, description };
                                }
                            }
                        } else if (Array.isArray(valueType)) {
                            const mapArrValueType = valueType[0];
                            if (typeof mapArrValueType === 'number') {
                                return { tsType: `Record<${keyType}, number[]>[]`, description };
                            } else if (typeof mapArrValueType === 'string') {
                                if (!mapArrValueType) {
                                    return { tsType: `Record<${keyType}, string[]>[]`, description };
                                } else {
                                    const classProtocol = this.protocolMap.get(mapArrValueType);
                                    if (classProtocol && classProtocol.p) {
                                        usedProtocols.add(mapArrValueType);
                                        return { tsType: `Record<${keyType}, ${mapArrValueType}[]>[]`, description };
                                    } else {
                                        return { tsType: `Record<${keyType}, ${mapArrValueType}[]>[]`, description };
                                    }
                                }
                            }
                        }
                    }
                    return { tsType: 'any', description: '' };
                } else {
                    if (typeof elementArray === 'number') {
                        return { tsType: 'number[]', description };
                    } else if (typeof elementArray === 'string') {
                        if (!elementArray) {
                            return { tsType: 'string[]', description };
                        } else {
                            elementType = elementArray;
                        }
                    } else {
                        return { tsType: 'any', description: '' };
                    }
                }

                // 检查是否可以找到类型定义
                const classProtocol = this.protocolMap.get(elementType);
                if (classProtocol && classProtocol.p) {
                    // 标记为被使用的协议，这样会在独立类中生成引用类
                    usedProtocols.add(elementType);
                    return {
                        tsType: `${elementType}[]`,
                        description,
                        isArray: true,
                        elementType,
                        needsReference: true
                    };
                } else {
                    return {
                        tsType: `${elementType}[]`,
                        description,
                        isArray: true,
                        elementType
                    };
                }
            } else if (typeof type === 'object' && type !== null) {
                // 检查是否是map类型：{"k": 0, "v": ["SC_allNews"]}
                if (Object.prototype.hasOwnProperty.call(type, "v")) {
                    const valueType = type.v; // 如果是{xxx}格式，value是xxx；如果是{xxx:yyy}格式，value是yyy
                    let keyType = 'string';
                    // k 的值：0 表示 number 类型的 key，"" 表示 string 类型的 key
                    if (typeof type.k === 'number' && type.k === 0) {
                        keyType = 'number';
                    } else if (typeof type.k === 'string' && type.k === '') {
                        keyType = 'string';
                    }

                    if (Array.isArray(valueType)) {
                        const mapArrValueType = valueType[0];

                        if (typeof mapArrValueType === 'number') {
                            return { tsType: `Record<${keyType}, number[]>`, description };
                        } else if (typeof mapArrValueType === 'string') {
                            if (!mapArrValueType) {
                                return { tsType: `Record<${keyType}, string[]>`, description };
                            } else {
                                const classProtocol = this.protocolMap.get(mapArrValueType);
                                if (classProtocol && classProtocol.p) {
                                    // 标记为被使用的协议，这样会在独立类中生成
                                    usedProtocols.add(mapArrValueType);
                                    return { tsType: `Record<${keyType}, ${mapArrValueType}[]>`, description };
                                }
                            }
                        }
                    } else if (typeof valueType === 'number') {
                        return { tsType: `Record<${keyType}, number>`, description };
                    } else if (typeof valueType === 'string') {
                        if (!valueType) {
                            return { tsType: `Record<${keyType}, string>`, description };
                        } else {
                            const classProtocol = this.protocolMap.get(valueType);
                            if (classProtocol && classProtocol.p) {
                                return { tsType: `Record<${keyType}, ${valueType}>`, description };
                            }
                        }
                    }
                }
            }
        }

        return { tsType: 'any', description: '' };
    }

    /**
     * 递归收集所有相关的协议类型
     */
    private collectAllReferencedTypes(): void {
        // 首先收集 SC 和 CS 模块中所有引用的类型（包括直接引用和数组引用）
        const scProtocol = this.protocolMap.get('SC');
        const csProtocol = this.protocolMap.get('CS');

        // 用于存储所有需要检查的协议
        const toCheck: Set<string> = new Set();

        if (scProtocol) {
            // 收集 SC 模块中的所有引用
            for (const [key, value] of Object.entries(scProtocol.p || {})) {
                const [className] = value;
                toCheck.add(className);
            }
        }

        if (csProtocol) {
            // 收集 CS 模块中的所有引用
            for (const [key, value] of Object.entries(csProtocol.p || {})) {
                const [className] = value;
                toCheck.add(className);
            }
        }

        // 递归检查所有协议，收集数组引用的类型
        const checked: Set<string> = new Set();
        while (toCheck.size > 0) {
            const iterator = toCheck.values().next();
            if (iterator.done) break;
            
            const protocolName = iterator.value;
            toCheck.delete(protocolName);

            if (checked.has(protocolName)) {
                continue;
            }
            checked.add(protocolName);

            const protocol = this.protocolMap.get(protocolName);
            if (protocol && protocol.p) {
                // 收集这个协议中的所有引用，加入待检查列表
                for (const [key, value] of Object.entries(protocol.p)) {
                    if (Array.isArray(value)) {
                        const [type, description] = value;

                        if (typeof type === 'string' && type !== 'NULL') {
                            toCheck.add(type);
                        } else if (Array.isArray(type) && type.length === 1) {
                            const elementArray = type[0];
                            if (Array.isArray(elementArray)) {
                                toCheck.add(elementArray[0]);
                            } else {
                                toCheck.add(elementArray);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 生成 TypeScript 声明文件
     */
    generateTypeScriptDeclarations(): string {
        // 首先收集所有被引用的协议类型
        // this.collectAllReferencedTypes();

        let dtsContent = '';

        for (const protocol of this.protocols) {
            const { n: name, a: description, p: properties } = protocol;

            if (name === 'SC') {
                dtsContent += this.generateSCModule(properties || {});
            } else if (name === 'CS') {
                dtsContent += this.generateCSModule(properties || {});
            }
        }

        return dtsContent;
    }

    /**
     * 生成 SC 模块
     */
    private generateSCModule(properties: Record<string, any>): string {
        let content = 'declare module proto_sc {\n';

        // 生成子模块
        for (const [key, value] of Object.entries(properties)) {
            const [className, description] = value;
            content += `\t/**${description}*/\n`;
            content += `\texport module ${key} {\n`;

            // 查找对应的类定义
            const classProtocol = this.protocolMap.get(className);
            if (classProtocol && classProtocol.p) {
                content += this.generateModuleClasses(this.usedProtocolsSC, classProtocol.p, '\t\t');
            }

            content += '\t}\n\n';
        }

        // 生成所有以 SC_ 开头的独立协议类
        content += this.generateIndependentClasses(this.usedProtocolsSC, '\t');

        content += '}\n\n';
        return content;
    }

    /**
     * 生成 CS 模块
     */
    private generateCSModule(properties: Record<string, any>): string {
        let content = 'declare module proto_cs {\n';

        // 生成子模块
        for (const [key, value] of Object.entries(properties)) {
            const [className, description] = value;
            content += `\t/**${description}*/\n`;
            content += `\texport module ${key} {\n`;

            // 查找对应的类定义
            const classProtocol = this.protocolMap.get(className);
            if (classProtocol && classProtocol.p) {
                content += this.generateModuleClasses(this.usedProtocolsCS, classProtocol.p, '\t\t');
            }

            content += '\t}\n\n';
        }

        // 生成所有以 CS_ 开头的独立协议类
        content += this.generateIndependentClasses(this.usedProtocolsCS, '\t');

        content += '}\n\n';
        return content;
    }

    /**
     * 生成独立的协议类
     */
    private generateIndependentClasses(usedProtocols: Set<string>, indent: string): string {
        let content = '';

        for (const protocol of this.protocols) {
            const { n: name, a: description, p: properties } = protocol;

            // 只处理指定前缀的协议，且被引用过的，但不是内联使用的
            if (usedProtocols.has(name) && properties) {
                content += `${indent}/**${description}*/\n`;
                content += `${indent}export class ${name} {\n`;
                content += this.generateClassProperties(usedProtocols, properties, indent + '\t');
                content += `${indent}}\n\n`;
            }
        }

        return content;
    }

    /**
     * 生成模块内的类 - 修正版本，实现新的第5步规则
     */
    private generateModuleClasses(usedProtocols: Set<string>, properties: Record<string, any>, indent: string): string {
        let content = '';

        for (const [key, value] of Object.entries(properties)) {
            if (Array.isArray(value)) {
                const [type, description] = value;

                content += `${indent}/**${description}*/\n`;

                if (Array.isArray(type)) {
                    // 规则2：模块类的类型是数组，且可以找到类型定义，那么另外生成一个引用类，将结构定义在引用类那边，模块类使用extends的方式继承引用类
                    const elementType = type[0];

                    if (typeof elementType === 'number') {
                        content += `${indent}export class ${key} extends Array<number>{}\n\n`;
                    } else if (typeof elementType === 'string') {
                        if (elementType === '') {
                            content += `${indent}export class ${key} extends Array<string>{}\n\n`;
                        } else {
                            const classProtocol = this.protocolMap.get(elementType);
                            if (classProtocol && classProtocol.p) {
                                // 标记为被使用的协议，这样会在独立类中生成
                                usedProtocols.add(elementType);
                                content += `${indent}export class ${key} extends Array<${elementType}>{}\n\n`;
                            } else {
                                // 规则3：其他情况全部生成一个空的模块类
                                content += `${indent}export class ${key} {\n`;
                                content += `${indent}}\n\n`;
                            }
                        }
                    }
                } else if (typeof type === 'object' && type !== null) {
                    // 检查是否是map类型：{"k": 0, "v": ["SC_allNews"]}
                    if (Object.prototype.hasOwnProperty.call(type, "v")) {
                        const valueType = type.v;
                        let keyType = 'string';
                        // k 的值：0 表示 number 类型的 key，"" 表示 string 类型的 key
                        if (typeof type.k === 'number' && type.k === 0) {
                            keyType = 'number';
                        } else if (typeof type.k === 'string' && type.k === '') {
                            keyType = 'string';
                        }

                        if (Array.isArray(valueType)) {
                            const mapArrValueType = valueType[0];

                            if (typeof mapArrValueType === 'number') {
                                content += `${indent}export class ${key} {\n`;
                                content += `${indent}\t[key: ${keyType}]: number[]\n`;
                                content += `${indent}}\n\n`;
                            } else if (typeof mapArrValueType === 'string') {
                                if (!mapArrValueType) {
                                    content += `${indent}export class ${key} {\n`;
                                    content += `${indent}\t[key: ${keyType}]: string[]\n`;
                                    content += `${indent}}\n\n`;
                                } else {
                                    const classProtocol = this.protocolMap.get(mapArrValueType);
                                    if (classProtocol && classProtocol.p) {
                                        // 标记为被使用的协议，这样会在独立类中生成
                                        usedProtocols.add(mapArrValueType);
                                        content += `${indent}export class ${key} {\n`;
                                        content += `${indent}\t[key: ${keyType}]: ${mapArrValueType}[]\n`;
                                        content += `${indent}}\n\n`;
                                    } else {
                                        // 规则3：其他情况全部生成一个空的模块类
                                        content += `${indent}export class ${key} {\n`;
                                        content += `${indent}}\n\n`;
                                    }
                                }
                            }
                        } else if (typeof valueType === 'number') {
                            content += `${indent}export class ${key} {\n`;
                            content += `${indent}\t[key: ${keyType}]: number\n`;
                            content += `${indent}}\n\n`;
                        } else if (typeof valueType === 'string') {
                            if (!valueType) {
                                content += `${indent}export class ${key} {\n`;
                                content += `${indent}\t[key: ${keyType}]: string\n`;
                                content += `${indent}}\n\n`;
                            } else {
                                const classProtocol = this.protocolMap.get(valueType);
                                if (classProtocol && classProtocol.p) {
                                    // 标记为被使用的协议，这样会在独立类中生成
                                    usedProtocols.add(valueType);
                                    content += `${indent}export class ${key} {\n`;
                                    content += `${indent}\t[key: ${keyType}]: ${valueType}\n`;
                                    content += `${indent}}\n\n`;
                                } else {
                                    // 规则3：其他情况全部生成一个空的模块类
                                    content += `${indent}export class ${key} {\n`;
                                    content += `${indent}}\n\n`;
                                }
                            }
                        }
                    } else {
                        content += `${indent}export class ${key} {\n`;
                        content += `${indent}}\n\n`;
                    }
                } else if (typeof type === 'string' && type !== 'NULL') {
                    // 规则1：模块类的类型不是数组，且可以找到类型定义，那么直接将类型的定义结构生成在模块类这里
                    const classProtocol = this.protocolMap.get(type);
                    if (classProtocol && classProtocol.p) {
                        // 标记为内联类型，不生成独立的引用类
                        content += `${indent}export class ${key} {\n`;
                        content += this.generateClassProperties(usedProtocols, classProtocol.p, indent + '\t');
                        content += `${indent}}\n\n`;
                    } else {
                        // 规则3：其他情况全部生成一个空的模块类
                        content += `${indent}export class ${key} {\n`;
                        content += `${indent}}\n\n`;
                    }
                } else {
                    // 规则3：其他情况全部生成一个空的模块类
                    content += `${indent}export class ${key} {\n`;
                    content += `${indent}}\n\n`;
                }
            }
        }

        return content;
    }

    /**
     * 生成类属性
     */
    private generateClassProperties(usedProtocols: Set<string>, properties: Record<string, any>, indent: string): string {
        let content = '';

        for (const [key, value] of Object.entries(properties)) {
            const { tsType, description } = this.parseParameterType(usedProtocols, value);
            content += `${indent}${key}:${tsType}; //${description}\n`;
        }

        return content;
    }

    /**
     * 检查是否是基础类型
     */
    private isPrimitiveType(type: string): boolean {
        const primitiveTypes = ['string', 'number', 'boolean', 'any', 'void', 'null', 'undefined'];
        return primitiveTypes.includes(type.toLowerCase());
    }

    /**
     * 转换为TypeScript类型
     */
    private convertToTSType(type: string): string {
        // 如果是基础类型，直接返回
        if (this.isPrimitiveType(type)) {
            return type;
        }

        // 如果是数字字符串，转换为number
        if (!isNaN(Number(type)) && !isNaN(parseFloat(type))) {
            return 'number';
        }

        // 其他情况返回原类型（可能是自定义类型）
        return type;
    }

    /**
     * 生成 JavaScript 实现文件
     */
    generateJavaScriptImplementation(): string {
        let jsContent = `function _proto(name) {
\tvar f = function(){
\t\tthis.getJson = function(){
\t\t\tvar ss = name.split('.');
\t\t\treturn "{\\""+ss[1]+"\\":{\\""+ss[2]+"\\":"+JSON.stringify(this)+"}}";
\t\t}
\t};
\tf.key = name;
\tf.class = name;
\treturn f;
}\n\n`;

        // 生成 SC 模块
        const scProtocol = this.protocolMap.get('SC');
        if (scProtocol && scProtocol.p) {
            jsContent += 'window.proto_sc = {\n';
            jsContent += this.generateJSModule(scProtocol.p, 'proto_sc', '\t');
            jsContent += '};\n\n';
        }

        // 生成 CS 模块
        const csProtocol = this.protocolMap.get('CS');
        if (csProtocol && csProtocol.p) {
            jsContent += 'window.proto_cs = {\n';
            jsContent += this.generateJSModule(csProtocol.p, 'proto_cs', '\t');
            jsContent += '};\n\n';
        }

        return jsContent;
    }

    /**
     * 生成 JS 模块
     */
    private generateJSModule(properties: Record<string, any>, modulePrefix: string, indent: string): string {
        let content = '';
        const entries = Object.entries(properties);

        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            const [className, description] = value;

            content += `${indent}${key}:{\n`;

            // 查找对应的类定义
            const classProtocol = this.protocolMap.get(className);
            if (classProtocol && classProtocol.p) {
                content += this.generateJSClasses(classProtocol.p, `${modulePrefix}.${key}`, indent + '\t');
            }

            content += `${indent}}`;
            if (i < entries.length - 1) {
                content += ',';
            }
            content += '\n';
        }

        return content;
    }

    /**
     * 生成 JS 类
     */
    private generateJSClasses(properties: Record<string, any>, classPrefix: string, indent: string): string {
        let content = '';
        const entries = Object.entries(properties);

        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];

            content += `${indent}${key}: _proto("${classPrefix}.${key}")`;
            if (i < entries.length - 1) {
                content += ',';
            }
            content += '\n';
        }

        return content;
    }

    /**
     * 生成文件
     * @param inputPath 输入的 JSON 文件路径
     * @param outputDir 输出目录路径
     * @param dtsFileName TypeScript 声明文件名（可选，默认 'proto.d.ts'）
     * @param jsFileName JavaScript 实现文件名（可选，默认 'proto.js'）
     */
    generate(inputPath: string, outputDir: string, dtsFileName: string = 'proto.d.ts', jsFileName: string = 'proto.js'): void {
        // 确保输出目录存在
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true });
        }

        // 加载协议数据
        this.loadProtocolData(inputPath);

        // 生成 TypeScript 声明文件
        const dtsContent = this.generateTypeScriptDeclarations();
        const dtsPath = join(outputDir, dtsFileName);
        writeFileSync(dtsPath, dtsContent, 'utf8');
        console.log(`生成 TypeScript 声明文件: ${dtsPath}`);

        // 生成 JavaScript 实现文件
        const jsContent = this.generateJavaScriptImplementation();
        const jsPath = join(outputDir, jsFileName);
        writeFileSync(jsPath, jsContent, 'utf8');
        console.log(`生成 JavaScript 实现文件: ${jsPath}`);

        console.log('协议文件生成完成！');
        console.log(`共生成 ${this.usedProtocolsSC.size + this.usedProtocolsCS.size} 个独立协议类`);
    }
}

// 如果直接运行此文件
if (require.main === module) {
    const generator = new ProtoGenerator();

    // 从命令行参数获取路径，或使用默认路径
    const inputPath = process.argv[2] || 'sourceData/testData.json';
    const outputDir = process.argv[3] || 'dist/new';

    try {
        generator.generate(inputPath, outputDir);
    } catch (error: any) {
        console.error('生成失败:', error);
        process.exit(1);
    }
}
