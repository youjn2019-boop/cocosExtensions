/**
 * 纹理格式信息接口
 */
interface FormatInfo {
    bytesPerPixel: number;
    name: string;
}

/**
 * 纹理格式信息
 * 包含Cocos Creator 2.x和3.x的纹理格式定义
 */
class TextureFormats {
    /**
     * 获取Cocos Creator 2.x格式信息
     * @param format - 格式枚举值
     * @returns 格式信息对象
     */
    static getFormatInfoFrom2x(format: number): FormatInfo {
        const formatMap: Record<number, FormatInfo> = {
            0: { bytesPerPixel: 0.5, name: "RGB_DXT1" },
            1: { bytesPerPixel: 0.5, name: "RGBA_DXT1" },
            2: { bytesPerPixel: 1, name: "RGBA_DXT3" },
            3: { bytesPerPixel: 1, name: "RGBA_DXT5" },
            4: { bytesPerPixel: 0.5, name: "RGB_ETC1" },
            5: { bytesPerPixel: 0.25, name: "RGB_PVRTC_2BPPV1" },
            6: { bytesPerPixel: 0.25, name: "RGBA_PVRTC_2BPPV1" },
            7: { bytesPerPixel: 0.5, name: "RGB_PVRTC_4BPPV1" },
            8: { bytesPerPixel: 0.5, name: "RGBA_PVRTC_4BPPV1" },
            9: { bytesPerPixel: 1, name: "A8" },
            10: { bytesPerPixel: 1, name: "L8" },
            11: { bytesPerPixel: 2, name: "L8_A8" },
            12: { bytesPerPixel: 2, name: "R5_G6_B5" },
            13: { bytesPerPixel: 2, name: "R5_G5_B5_A1" },
            14: { bytesPerPixel: 2, name: "R4_G4_B4_A4" },
            15: { bytesPerPixel: 3, name: "RGB8" },
            16: { bytesPerPixel: 4, name: "RGBA8" },
            17: { bytesPerPixel: 6, name: "RGB16F" },
            18: { bytesPerPixel: 8, name: "RGBA16F" },
            19: { bytesPerPixel: 12, name: "RGB32F" },
            20: { bytesPerPixel: 16, name: "RGBA32F" },
            21: { bytesPerPixel: 4, name: "R32F" },
            22: { bytesPerPixel: 4, name: "111110F" },
            23: { bytesPerPixel: 3, name: "SRGB" },
            24: { bytesPerPixel: 4, name: "SRGBA" },
            25: { bytesPerPixel: 2, name: "D16" },
            26: { bytesPerPixel: 4, name: "D32" },
            27: { bytesPerPixel: 4, name: "D24S8" },
            28: { bytesPerPixel: 0.5, name: "RGB_ETC2" },
            29: { bytesPerPixel: 1, name: "RGBA_ETC2" },
            30: { bytesPerPixel: 1, name: "RGBA_ASTC_4X4" },
            31: { bytesPerPixel: 0.8, name: "RGBA_ASTC_5X4" },
            32: { bytesPerPixel: 0.64, name: "RGBA_ASTC_5X5" },
            33: { bytesPerPixel: 0.53, name: "RGBA_ASTC_6X5" },
            34: { bytesPerPixel: 0.44, name: "RGBA_ASTC_6X6" },
            35: { bytesPerPixel: 0.32, name: "RGBA_ASTC_8X5" },
            36: { bytesPerPixel: 0.27, name: "RGBA_ASTC_8X6" },
            37: { bytesPerPixel: 0.25, name: "RGBA_ASTC_8X8" },
            38: { bytesPerPixel: 0.2, name: "RGBA_ASTC_10X5" },
            39: { bytesPerPixel: 0.17, name: "RGBA_ASTC_10X6" },
            40: { bytesPerPixel: 0.125, name: "RGBA_ASTC_10X8" },
            41: { bytesPerPixel: 0.1, name: "RGBA_ASTC_10X10" },
            42: { bytesPerPixel: 0.083, name: "RGBA_ASTC_12X10" },
            43: { bytesPerPixel: 0.069, name: "RGBA_ASTC_12X12" },
            44: { bytesPerPixel: 1, name: "SRGBA_ASTC_4X4" },
            45: { bytesPerPixel: 0.8, name: "SRGBA_ASTC_5X4" },
            46: { bytesPerPixel: 0.64, name: "SRGBA_ASTC_5X5" },
            47: { bytesPerPixel: 0.53, name: "SRGBA_ASTC_6X5" },
            48: { bytesPerPixel: 0.44, name: "SRGBA_ASTC_6X6" },
            49: { bytesPerPixel: 0.32, name: "SRGBA_ASTC_8X5" },
            50: { bytesPerPixel: 0.27, name: "SRGBA_ASTC_8X6" },
            51: { bytesPerPixel: 0.25, name: "SRGBA_ASTC_8X8" },
            52: { bytesPerPixel: 0.2, name: "SRGBA_ASTC_10X5" },
            53: { bytesPerPixel: 0.17, name: "SRGBA_ASTC_10X6" },
            54: { bytesPerPixel: 0.125, name: "SRGBA_ASTC_10X8" },
            55: { bytesPerPixel: 0.1, name: "SRGBA_ASTC_10X10" },
            56: { bytesPerPixel: 0.083, name: "SRGBA_ASTC_12X10" },
            57: { bytesPerPixel: 0.069, name: "SRGBA_ASTC_12X12" }
        };

        return formatMap[format] || { bytesPerPixel: 4, name: "RGBA8" };
    }

    /**
     * 获取Cocos Creator 3.x格式信息
     * @param format - 格式枚举值
     * @returns 格式信息对象
     */
    static getFormatInfoFrom3x(format: number): FormatInfo {
        const formatMap: Record<number, FormatInfo> = {
            0: { bytesPerPixel: 4, name: "UNKNOWN" },
            1: { bytesPerPixel: 1, name: "A8" },
            2: { bytesPerPixel: 1, name: "L8" },
            3: { bytesPerPixel: 2, name: "LA8" },
            4: { bytesPerPixel: 1, name: "R8" },
            5: { bytesPerPixel: 1, name: "R8SN" },
            6: { bytesPerPixel: 1, name: "R8UI" },
            7: { bytesPerPixel: 1, name: "R8I" },
            8: { bytesPerPixel: 2, name: "R16F" },
            9: { bytesPerPixel: 2, name: "R16UI" },
            10: { bytesPerPixel: 2, name: "R16I" },
            11: { bytesPerPixel: 4, name: "R32F" },
            12: { bytesPerPixel: 4, name: "R32UI" },
            13: { bytesPerPixel: 4, name: "R32I" },
            14: { bytesPerPixel: 2, name: "RG8" },
            15: { bytesPerPixel: 2, name: "RG8SN" },
            16: { bytesPerPixel: 2, name: "RG8UI" },
            17: { bytesPerPixel: 2, name: "RG8I" },
            18: { bytesPerPixel: 4, name: "RG16F" },
            19: { bytesPerPixel: 4, name: "RG16UI" },
            20: { bytesPerPixel: 4, name: "RG16I" },
            21: { bytesPerPixel: 8, name: "RG32F" },
            22: { bytesPerPixel: 8, name: "RG32UI" },
            23: { bytesPerPixel: 8, name: "RG32I" },
            24: { bytesPerPixel: 3, name: "RGB8" },
            25: { bytesPerPixel: 3, name: "SRGB8" },
            26: { bytesPerPixel: 3, name: "RGB8SN" },
            27: { bytesPerPixel: 3, name: "RGB8UI" },
            28: { bytesPerPixel: 3, name: "RGB8I" },
            29: { bytesPerPixel: 6, name: "RGB16F" },
            30: { bytesPerPixel: 6, name: "RGB16UI" },
            31: { bytesPerPixel: 6, name: "RGB16I" },
            32: { bytesPerPixel: 12, name: "RGB32F" },
            33: { bytesPerPixel: 12, name: "RGB32UI" },
            34: { bytesPerPixel: 12, name: "RGB32I" },
            35: { bytesPerPixel: 4, name: "RGBA8" },
            36: { bytesPerPixel: 4, name: "BGRA8" },
            37: { bytesPerPixel: 4, name: "SRGB8_A8" },
            38: { bytesPerPixel: 4, name: "RGBA8SN" },
            39: { bytesPerPixel: 4, name: "RGBA8UI" },
            40: { bytesPerPixel: 4, name: "RGBA8I" },
            41: { bytesPerPixel: 8, name: "RGBA16F" },
            42: { bytesPerPixel: 8, name: "RGBA16UI" },
            43: { bytesPerPixel: 8, name: "RGBA16I" },
            44: { bytesPerPixel: 16, name: "RGBA32F" },
            45: { bytesPerPixel: 16, name: "RGBA32UI" },
            46: { bytesPerPixel: 16, name: "RGBA32I" },
            47: { bytesPerPixel: 2, name: "R5G6B5" },
            48: { bytesPerPixel: 4, name: "R11G11B10F" },
            49: { bytesPerPixel: 2, name: "RGB5A1" },
            50: { bytesPerPixel: 2, name: "RGBA4" },
            51: { bytesPerPixel: 4, name: "RGB10A2" },
            52: { bytesPerPixel: 4, name: "RGB10A2UI" },
            53: { bytesPerPixel: 4, name: "RGB9E5" },
            54: { bytesPerPixel: 4, name: "DEPTH" },
            55: { bytesPerPixel: 4, name: "DEPTH_STENCIL" },
            56: { bytesPerPixel: 0.5, name: "BC1" },
            57: { bytesPerPixel: 0.5, name: "BC1_ALPHA" },
            58: { bytesPerPixel: 0.5, name: "BC1_SRGB" },
            59: { bytesPerPixel: 0.5, name: "BC1_SRGB_ALPHA" },
            60: { bytesPerPixel: 1, name: "BC2" },
            61: { bytesPerPixel: 1, name: "BC2_SRGB" },
            62: { bytesPerPixel: 1, name: "BC3" },
            63: { bytesPerPixel: 1, name: "BC3_SRGB" },
            64: { bytesPerPixel: 0.5, name: "BC4" },
            65: { bytesPerPixel: 0.5, name: "BC4_SNORM" },
            66: { bytesPerPixel: 1, name: "BC5" },
            67: { bytesPerPixel: 1, name: "BC5_SNORM" },
            68: { bytesPerPixel: 1, name: "BC6H_UF16" },
            69: { bytesPerPixel: 1, name: "BC6H_SF16" },
            70: { bytesPerPixel: 1, name: "BC7" },
            71: { bytesPerPixel: 1, name: "BC7_SRGB" },
            72: { bytesPerPixel: 0.5, name: "ETC_RGB8" },
            73: { bytesPerPixel: 0.5, name: "ETC2_RGB8" },
            74: { bytesPerPixel: 0.5, name: "ETC2_SRGB8" },
            75: { bytesPerPixel: 0.5, name: "ETC2_RGB8_A1" },
            76: { bytesPerPixel: 0.5, name: "ETC2_SRGB8_A1" },
            77: { bytesPerPixel: 1, name: "ETC2_RGBA8" },
            78: { bytesPerPixel: 1, name: "ETC2_SRGB8_A8" },
            79: { bytesPerPixel: 0.5, name: "EAC_R11" },
            80: { bytesPerPixel: 0.5, name: "EAC_R11SN" },
            81: { bytesPerPixel: 1, name: "EAC_RG11" },
            82: { bytesPerPixel: 1, name: "EAC_RG11SN" },
            83: { bytesPerPixel: 0.25, name: "PVRTC_RGB2" },
            84: { bytesPerPixel: 0.25, name: "PVRTC_RGBA2" },
            85: { bytesPerPixel: 0.5, name: "PVRTC_RGB4" },
            86: { bytesPerPixel: 0.5, name: "PVRTC_RGBA4" },
            87: { bytesPerPixel: 0.25, name: "PVRTC2_2BPP" },
            88: { bytesPerPixel: 0.5, name: "PVRTC2_4BPP" },
            89: { bytesPerPixel: 1, name: "ASTC_RGBA_4X4" },
            90: { bytesPerPixel: 0.8, name: "ASTC_RGBA_5X4" },
            91: { bytesPerPixel: 0.64, name: "ASTC_RGBA_5X5" },
            92: { bytesPerPixel: 0.53, name: "ASTC_RGBA_6X5" },
            93: { bytesPerPixel: 0.44, name: "ASTC_RGBA_6X6" },
            94: { bytesPerPixel: 0.32, name: "ASTC_RGBA_8X5" },
            95: { bytesPerPixel: 0.27, name: "ASTC_RGBA_8X6" },
            96: { bytesPerPixel: 0.25, name: "ASTC_RGBA_8X8" },
            97: { bytesPerPixel: 0.2, name: "ASTC_RGBA_10X5" },
            98: { bytesPerPixel: 0.17, name: "ASTC_RGBA_10X6" },
            99: { bytesPerPixel: 0.125, name: "ASTC_RGBA_10X8" },
            100: { bytesPerPixel: 0.1, name: "ASTC_RGBA_10X10" },
            101: { bytesPerPixel: 0.083, name: "ASTC_RGBA_12X10" },
            102: { bytesPerPixel: 0.069, name: "ASTC_RGBA_12X12" },
            103: { bytesPerPixel: 1, name: "ASTC_SRGBA_4X4" },
            104: { bytesPerPixel: 0.8, name: "ASTC_SRGBA_5X4" },
            105: { bytesPerPixel: 0.64, name: "ASTC_SRGBA_5X5" },
            106: { bytesPerPixel: 0.53, name: "ASTC_SRGBA_6X5" },
            107: { bytesPerPixel: 0.44, name: "ASTC_SRGBA_6X6" },
            108: { bytesPerPixel: 0.32, name: "ASTC_SRGBA_8X5" },
            109: { bytesPerPixel: 0.27, name: "ASTC_SRGBA_8X6" },
            110: { bytesPerPixel: 0.25, name: "ASTC_SRGBA_8X8" },
            111: { bytesPerPixel: 0.2, name: "ASTC_SRGBA_10X5" },
            112: { bytesPerPixel: 0.17, name: "ASTC_SRGBA_10X6" },
            113: { bytesPerPixel: 0.125, name: "ASTC_SRGBA_10X8" },
            114: { bytesPerPixel: 0.1, name: "ASTC_SRGBA_10X10" },
            115: { bytesPerPixel: 0.083, name: "ASTC_SRGBA_12X10" },
            116: { bytesPerPixel: 0.069, name: "ASTC_SRGBA_12X12" }
        };

        return formatMap[format] || { bytesPerPixel: 4, name: "RGBA8" };
    }

    /**
     * 根据格式名称获取字节数
     * @param formatName - 格式名称
     * @returns 每像素字节数
     */
    static getBytesPerPixel(formatName: string): number {
        const formatMap: Record<string, number> = {
            'RGBA8888': 4,
            'RGBA8': 4,
            'RGB888': 3,
            'RGB8': 3,
            'RGBA4444': 2,
            'RGBA4': 2,
            'RGB565': 2,
            'R5G6B5': 2,
            'RGB5A1': 2,
            'A8': 1,
            'L8': 1,
            'LA8': 2,
            'L8_A8': 2,
            'R8': 1,
            'RG8': 2,
            'RGB16F': 6,
            'RGBA16F': 8,
            'RGB32F': 12,
            'RGBA32F': 16,
            'R32F': 4,
            'RG32F': 8,
            'D16': 2,
            'D24S8': 4,
            'D32': 4,
            'DEPTH': 4,
            'DEPTH_STENCIL': 4
        };

        return formatMap[formatName] || 4;
    }
}

export default TextureFormats;