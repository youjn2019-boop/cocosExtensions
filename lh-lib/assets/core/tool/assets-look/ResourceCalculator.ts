import Logger from './Logger';
import TextureFormats from './TextureFormats';

/**
 * 资源大小计算器
 * 负责计算各种Cocos Creator资源的内存占用
 */
class ResourceCalculator {
    private static _loged_type: Map<string, boolean> = new Map();
    private static _ignore_type: Set<string> = new Set();

    /**
     * 计算资源大小
     * @param asset - 资源对象
     * @returns 资源大小（字节）
     */
    static calculate(asset: any): number {
        try {
            const typeName = (asset.__classname__?.replace("cc.", "")) || asset.constructor.name;
            
            if (!this._loged_type.has(typeName) && !this._ignore_type.has(typeName)) {
                this._loged_type.set(typeName, true);
                Logger.log("************************************************");
                Logger.log("资源类型", typeName);
                Logger.log("原始数据:", asset);
            }

            let size = 0;
            switch (typeName) {
                case "Texture2D":
                case "cc_Texture2D":
                    size = this.calculateTextureSize(asset);
                    break;
                case "ImageAsset":
                case "cc_ImageAsset":
                    size = this.calculateImageAssetSize(asset);
                    break;
                case "AudioClip":
                case "cc_AudioClip":
                    size = this.calculateAudioSize(asset);
                    break;
                case "Prefab":
                case "cc_Prefab":
                    size = this.calculatePrefabSize(asset);
                    break;
                case "Material":
                case "cc_Material":
                    size = this.calculateMaterialSize(asset);
                    break;
                case "Mesh":
                case "cc_Mesh":
                    size = this.calculateMeshSize(asset);
                    break;
                case "AnimationClip":
                case "cc_AnimationClip":
                    size = this.calculateAnimationSize(asset);
                    break;
                case "EffectAsset":
                case "cc_EffectAsset":
                    size = this.calculateEffectSize(asset);
                    break;
                case "TTFFont":
                case "cc_TTFFont":
                    size = this.calculateFontSize(asset);
                    break;
                case "JsonAsset":
                case "cc_JsonAsset":
                    size = this.calculateJSONSize(asset);
                    break;
                case "BufferAsset":
                case "cc_BufferAsset":
                    size = this.calculateBufferSize(asset);
                    break;
                case "sp_SkeletonData":
                case "sp.SkeletonData":
                case "SkeletonData":
                    size = this.calculateSkeletonDataSize(asset);
                    break;
                case "TextAsset":
                case "cc_TextAsset":
                    size = this.calculateTextAssetSize(asset);
                    break;
                case "Asset":
                case "cc_Asset":
                    size = this.calculateAssetSize(asset);
                    break;
                default:
                    size = -1;
            }

            if (!this._loged_type.has(typeName) && !this._ignore_type.has(typeName)) {
                this._loged_type.set(typeName, true);
                Logger.log("大小:", size);
            }

            return size;
        } catch (error) {
            console.warn("计算资源大小时出错:", error);
            return 102400; // 默认100KB
        }
    }

    /**
     * 计算纹理大小
     * @param texture - 纹理对象
     * @returns 纹理大小（字节）
     */
    static calculateTextureSize(texture: any): number {
        try {
            const width = texture.width || texture._width || 0;
            const height = texture.height || texture._height || 0;

            if (width > 0 && height > 0) {
                const clampedWidth = Math.max(1, Math.min(width, 8192));
                const clampedHeight = Math.max(1, Math.min(height, 8192));
                
                let bytesPerPixel = 4; // 默认RGBA8888
                let formatName = "RGBA8888";

                // 获取像素格式信息
                if (texture._format !== undefined) {
                    const formatInfo = TextureFormats.getFormatInfoFrom2x(texture._format);
                    bytesPerPixel = formatInfo.bytesPerPixel;
                    formatName = formatInfo.name;
                } else if (texture.getPixelFormat) {
                    const format = texture.getPixelFormat();
                    bytesPerPixel = TextureFormats.getBytesPerPixel(format);
                    formatName = format;
                } else if (texture.pixelFormat) {
                    bytesPerPixel = TextureFormats.getBytesPerPixel(texture.pixelFormat);
                    formatName = texture.pixelFormat;
                } else if (texture._pixelFormat) {
                    bytesPerPixel = TextureFormats.getBytesPerPixel(texture._pixelFormat);
                    formatName = texture._pixelFormat;
                }

                let size = clampedWidth * clampedHeight * bytesPerPixel;

                // 压缩纹理处理
                const isCompressed = texture._compressed || 
                                   (texture._texture && texture._texture._compressed) || 
                                   false;
                if (isCompressed) {
                    size = Math.floor(size / 4);
                }

                // Mipmap处理
                const hasMipmaps = texture._genMipmaps || 
                                 texture.genMipmaps || 
                                 (texture._texture && texture._texture._genMipmaps) || 
                                 false;
                if (hasMipmaps) {
                    size = Math.floor(size * 1.33);
                }

                // 异常大小检查
                if (size > 1024 * 1024 * 1024) { // 1GB
                    console.warn(
                        `纹理尺寸异常: ${width}x${height}, 计算内存=${this.formatBytes(size)}, 使用默认值`
                    );
                    return 16384; // 16KB默认值
                }

                return size;
            }

            // 尝试从其他属性获取尺寸
            if (texture._nativeTexture) {
                const nativeTexture = texture._nativeTexture;
                if (nativeTexture.width && nativeTexture.height) {
                    const width = Math.max(1, Math.min(nativeTexture.width, 8192));
                    const height = Math.max(1, Math.min(nativeTexture.height, 8192));
                    return width * height * 4;
                }
            }

            if (texture._texture) {
                const innerTexture = texture._texture;
                if (innerTexture._width && innerTexture._height) {
                    const width = Math.max(1, Math.min(innerTexture._width, 8192));
                    const height = Math.max(1, Math.min(innerTexture._height, 8192));
                    let size = width * height * 4;
                    if (innerTexture._compressed) {
                        size = Math.floor(size / 4);
                    }
                    return size;
                }
            }

            if (texture._image && texture._image.width && texture._image.height) {
                const width = Math.max(1, Math.min(texture._image.width, 8192));
                const height = Math.max(1, Math.min(texture._image.height, 8192));
                return width * height * 4;
            }

            // 从URL推测尺寸
            if (texture._nativeUrl) {
                const url = texture._nativeUrl.toLowerCase();
                if (url.includes(".png") || url.includes(".jpg") || url.includes(".jpeg")) {
                    const sizeMatch = url.match(/(\d+)x(\d+)/);
                    if (sizeMatch) {
                        const width = Math.max(1, Math.min(parseInt(sizeMatch[1]), 8192));
                        const height = Math.max(1, Math.min(parseInt(sizeMatch[2]), 8192));
                        return width * height * 4;
                    }
                    return 16384; // 默认16KB
                }
            }

            return 16384; // 默认16KB
        } catch (error) {
            console.warn("计算纹理大小时出错:", error);
            return 16384;
        }
    }

    /**
     * 计算图像资源大小
     * @param imageAsset - 图像资源对象
     * @returns 图像大小（字节）
     */
    static calculateImageAssetSize(imageAsset: any): number {
        try {
            const width = imageAsset.width || imageAsset._width || 0;
            const height = imageAsset.height || imageAsset._height || 0;

            if (width > 0 && height > 0) {
                const clampedWidth = Math.max(1, Math.min(width, 8192));
                const clampedHeight = Math.max(1, Math.min(height, 8192));
                let size = clampedWidth * clampedHeight * 4; // RGBA

                if (size > 1024 * 1024 * 1024) { // 1GB
                    console.warn(
                        `图像尺寸异常: ${width}x${height}, 计算内存=${this.formatBytes(size)}, 使用默认值`
                    );
                    return 65536; // 64KB默认值
                }

                return size;
            }

            return 65536; // 默认64KB
        } catch (error) {
            console.warn("计算图像资源大小时出错:", error);
            return 65536;
        }
    }

    /**
     * 计算音频大小
     * @param audioClip - 音频剪辑对象
     * @returns 音频大小（字节）
     */
    static calculateAudioSize(audioClip: any): number {
        try {
            // 尝试获取音频时长和采样率
            const duration = audioClip.duration || audioClip._duration || 0;
            const sampleRate = audioClip.sampleRate || audioClip._sampleRate || 44100;
            const channels = audioClip.channels || audioClip._channels || 2;
            const bitsPerSample = 16; // 通常是16位

            if (duration > 0) {
                const size = duration * sampleRate * channels * (bitsPerSample / 8);
                return Math.max(size, 8192); // 最小8KB
            }

            // 如果有原始数据
            if (audioClip._buffer && audioClip._buffer.byteLength) {
                return audioClip._buffer.byteLength;
            }

            return 32768; // 默认32KB
        } catch (error) {
            console.warn("计算音频大小时出错:", error);
            return 32768;
        }
    }

    /**
     * 计算预制体大小
     * @param prefab - 预制体对象
     * @returns 预制体大小（字节）
     */
    static calculatePrefabSize(prefab: any): number {
        try {
            // 预制体大小主要取决于其包含的节点和组件数量
            let size = 1024; // 基础大小

            if (prefab.data && prefab.data._prefab) {
                const nodeCount = this.countNodesInPrefab(prefab.data._prefab);
                size += nodeCount * 512; // 每个节点约512字节
            }

            return Math.max(size, 1024);
        } catch (error) {
            console.warn("计算预制体大小时出错:", error);
            return 1024;
        }
    }

    /**
     * 计算材质大小
     * @param material - 材质对象
     * @returns 材质大小（字节）
     */
    static calculateMaterialSize(material: any): number {
        try {
            let size = 512; // 基础材质大小

            // 计算纹理引用
            if (material._props) {
                Object.values(material._props).forEach((prop: any) => {
                    if (prop && prop._uuid) {
                        size += 64; // 纹理引用开销
                    }
                });
            }

            return Math.max(size, 512);
        } catch (error) {
            console.warn("计算材质大小时出错:", error);
            return 512;
        }
    }

    /**
     * 计算网格大小
     * @param mesh - 网格对象
     * @returns 网格大小（字节）
     */
    static calculateMeshSize(mesh: any): number {
        try {
            let size = 0;

            // 顶点数据
            const vertexCount = mesh.vertexCount || mesh._vertexCount || 0;
            if (vertexCount > 0) {
                // 假设每个顶点包含位置(12字节) + 法线(12字节) + UV(8字节) = 32字节
                size += vertexCount * 32;
            }

            // 索引数据
            const indexCount = mesh.indexCount || mesh._indexCount || 0;
            if (indexCount > 0) {
                size += indexCount * 2; // 16位索引
            }

            if (size > 1024 * 1024 * 100) { // 100MB
                console.warn(
                    `网格顶点数异常: ${vertexCount}, 计算内存=${this.formatBytes(size)}, 使用默认值`
                );
                return 4096;
            }

            return Math.max(size, 1024);
        } catch (error) {
            console.warn("计算网格大小时出错:", error);
            return 1024;
        }
    }

    /**
     * 计算动画大小
     * @param animationClip - 动画剪辑对象
     * @returns 动画大小（字节）
     */
    static calculateAnimationSize(animationClip: any): number {
        try {
            const duration = animationClip.duration || animationClip._duration || 0;
            const frameRate = animationClip.sample || animationClip._sample || 30;
            
            let size = 1024; // 基础大小
            
            if (duration > 0) {
                const frameCount = duration * frameRate;
                size += frameCount * 64; // 每帧约64字节
            }

            return Math.max(size, 1024);
        } catch (error) {
            console.warn("计算动画大小时出错:", error);
            return 1024;
        }
    }

    /**
     * 计算特效资源大小
     * @param effectAsset - 特效资源对象
     * @returns 特效大小（字节）
     */
    static calculateEffectSize(effectAsset: any): number {
        try {
            // 特效主要是shader代码
            let size = 2048; // 基础大小

            if (effectAsset._techniques) {
                size += effectAsset._techniques.length * 1024;
            }

            return Math.max(size, 2048);
        } catch (error) {
            console.warn("计算特效大小时出错:", error);
            return 2048;
        }
    }

    /**
     * 计算字体大小
     * @param font - 字体对象
     * @returns 字体大小（字节）
     */
    static calculateFontSize(font: any): number {
        try {
            // TTF字体文件通常较大
            return 1024 * 1024; // 默认1MB
        } catch (error) {
            console.warn("计算字体大小时出错:", error);
            return 1024 * 1024;
        }
    }

    /**
     * 计算JSON资源大小
     * @param json - JSON对象
     * @returns JSON大小（字节）
     */
    static calculateJSONSize(json: any): number {
        try {
            const jsonString = JSON.stringify(json);
            return jsonString.length * 2; // UTF-16编码
        } catch (error) {
            console.warn("计算JSON大小时出错:", error);
            return 1024;
        }
    }

    /**
     * 计算缓冲区资源大小
     * @param bufferAsset - 缓冲区资源对象
     * @returns 缓冲区大小（字节）
     */
    static calculateBufferSize(bufferAsset: any): number {
        try {
            if (bufferAsset._buffer && bufferAsset._buffer.byteLength) {
                return bufferAsset._buffer.byteLength;
            }
            return 4096; // 默认4KB
        } catch (error) {
            console.warn("计算缓冲区大小时出错:", error);
            return 4096;
        }
    }

    /**
     * 计算骨骼数据大小
     * @param skeletonData - 骨骼数据对象
     * @returns 骨骼数据大小（字节）
     */
    static calculateSkeletonDataSize(skeletonData: any): number {
        try {
            let size = 4096; // 基础大小

            // 骨骼数量
            if (skeletonData.bones) {
                size += skeletonData.bones.length * 256;
            }

            // 动画数量
            if (skeletonData.animations) {
                size += Object.keys(skeletonData.animations).length * 1024;
            }

            return Math.max(size, 4096);
        } catch (error) {
            console.warn("计算骨骼数据大小时出错:", error);
            return 4096;
        }
    }

    /**
     * 计算文本资源大小
     * @param textAsset - 文本资源对象
     * @returns 文本大小（字节）
     */
    static calculateTextAssetSize(textAsset: any): number {
        try {
            if (textAsset.text) {
                return textAsset.text.length * 2; // UTF-16编码
            }
            return 1024; // 默认1KB
        } catch (error) {
            console.warn("计算文本资源大小时出错:", error);
            return 1024;
        }
    }

    /**
     * 计算通用资源大小
     * @param asset - 资源对象
     * @returns 资源大小（字节）
     */
    static calculateAssetSize(asset: any): number {
        try {
            return 1024; // 默认1KB
        } catch (error) {
            console.warn("计算资源大小时出错:", error);
            return 1024;
        }
    }

    /**
     * 格式化字节大小
     * @param bytes - 字节数
     * @returns 格式化后的大小字符串
     */
    static formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 辅助方法
    static countNodesInPrefab(prefabData: any): number {
        // 简单的节点计数实现
        return 1;
    }

    static getBytesPerPixel(format: any): number {
        return TextureFormats.getBytesPerPixel(format);
    }
}

export default ResourceCalculator;