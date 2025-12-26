(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BattleLib = {}));
})(this, (function (exports) { 'use strict';

    class Battle {
        static get inst() {
            if (!this._inst)
                this._inst = new Battle();
            return this._inst;
        }
    }
    Battle._inst = null;
    const battle = Battle.inst;

    /**--------------------------战场------------------------- */
    /**战斗状态 */
    exports.BattleStatus = void 0;
    (function (BattleStatus) {
        BattleStatus[BattleStatus["None"] = 0] = "None";
        BattleStatus[BattleStatus["Running"] = 1] = "Running";
        BattleStatus[BattleStatus["Pause"] = 2] = "Pause";
        BattleStatus[BattleStatus["PauseWave"] = 3] = "PauseWave";
        BattleStatus[BattleStatus["SkillPause"] = 4] = "SkillPause";
        BattleStatus[BattleStatus["Finish"] = 5] = "Finish";
    })(exports.BattleStatus || (exports.BattleStatus = {}));
    /**技能释放模式 */
    exports.SkillUseMode = void 0;
    (function (SkillUseMode) {
        SkillUseMode[SkillUseMode["None"] = 0] = "None";
        SkillUseMode[SkillUseMode["AutoNormal"] = 1] = "AutoNormal";
        SkillUseMode[SkillUseMode["AutoAll"] = 2] = "AutoAll";
    })(exports.SkillUseMode || (exports.SkillUseMode = {}));
    exports.BattleRecordDataType = void 0;
    (function (BattleRecordDataType) {
        BattleRecordDataType[BattleRecordDataType["None"] = 0] = "None";
        // 战场日志
        /**初始化 1 */
        BattleRecordDataType[BattleRecordDataType["Init"] = 1] = "Init";
        /**开始战斗 100 */
        BattleRecordDataType[BattleRecordDataType["Start"] = 100] = "Start";
        /**战斗结束 101 是否时间到了*/
        BattleRecordDataType[BattleRecordDataType["Finish"] = 101] = "Finish";
        /**一个队伍团灭 102 队伍id，第几次*/
        BattleRecordDataType[BattleRecordDataType["TeamAllDie"] = 102] = "TeamAllDie";
        /**技能暂停 140 单位id 技能id */
        BattleRecordDataType[BattleRecordDataType["PauseBySkill"] = 103] = "PauseBySkill";
        /**技能暂停结束 141 */
        BattleRecordDataType[BattleRecordDataType["ResumeBySkill"] = 104] = "ResumeBySkill";
        // 单位日志
        /**添加单位 201 单位id 单位配置id 队伍id 单位类型 单位朝向*/
        BattleRecordDataType[BattleRecordDataType["UnitAdd"] = 200] = "UnitAdd";
        /**移除单位 110 单位id 移除类型 : 0 死亡   1 直接移除   2 逃跑*/
        BattleRecordDataType[BattleRecordDataType["UnitRemove"] = 201] = "UnitRemove";
        /**单位位置变化（移动） */
        BattleRecordDataType[BattleRecordDataType["UnitMove"] = 202] = "UnitMove";
        /**单位位置变化（不是移动） */
        BattleRecordDataType[BattleRecordDataType["UnitBlink"] = 203] = "UnitBlink";
        /**单位朝向 105 单位id 朝向 */
        BattleRecordDataType[BattleRecordDataType["UnitDir"] = 204] = "UnitDir";
        /**单位死亡 109 单位id */
        BattleRecordDataType[BattleRecordDataType["UnitDie"] = 205] = "UnitDie";
        /**刷新需要表现的属性 111 单位id 血量 最大血量 护盾 体型大小 */
        BattleRecordDataType[BattleRecordDataType["UnitAttr"] = 206] = "UnitAttr";
        /**单位受击 107 单位id, 施法者id, 技能id, buffid, 变化血量, 是否暴击, 是否有被格挡*/
        BattleRecordDataType[BattleRecordDataType["UnitBeHit"] = 207] = "UnitBeHit";
        /**单位miss 108 单位id, 施法者id, 技能id, buffid*/
        BattleRecordDataType[BattleRecordDataType["UnitBeMiss"] = 208] = "UnitBeMiss";
        /**单位击杀 unittype */
        BattleRecordDataType[BattleRecordDataType["UnitKill"] = 209] = "UnitKill";
        // 技能日志
        // 进入前摇
        // 前摇结束
        // 施法（创建子弹）
        // 进入后摇
        // 技能结束
        // 技能命中
        // 技能路径命中
        // 子弹到达
        /**技能节点 */
        BattleRecordDataType[BattleRecordDataType["SkillTimeNode"] = 300] = "SkillTimeNode";
        /**子弹日志 */
        /**添加子弹 120 子弹id, 子弹配置id, 施法者id, 技能id*/
        BattleRecordDataType[BattleRecordDataType["BulletAdd"] = 400] = "BulletAdd";
        /**移除子弹 121 子弹id */
        BattleRecordDataType[BattleRecordDataType["BulletRemove"] = 401] = "BulletRemove";
        /**子弹到达目标点 123 子弹id*/
        BattleRecordDataType[BattleRecordDataType["BulletArrive"] = 402] = "BulletArrive";
        /**子弹命中目标 123 子弹id*/
        BattleRecordDataType[BattleRecordDataType["BulletHit"] = 403] = "BulletHit";
        /**添加buff 130 单位id, 施法者id, buff配置id, 技能配置id, ...buff额外参数*/
        BattleRecordDataType[BattleRecordDataType["BuffAdd"] = 500] = "BuffAdd";
        /**移除buff 131 单位id, buff配置id*/
        BattleRecordDataType[BattleRecordDataType["BuffRemove"] = 501] = "BuffRemove";
        /**buff层数变化 132 单位id, buff配置id, buff当前层数*/
        BattleRecordDataType[BattleRecordDataType["BuffUpdateCount"] = 502] = "BuffUpdateCount";
        /**buff执行效果 132 单位id, buff配置id*/
        BattleRecordDataType[BattleRecordDataType["BuffExec"] = 503] = "BuffExec";
        /**buff被免疫 132 单位id, buff配置id*/
        BattleRecordDataType[BattleRecordDataType["BuffImmunity"] = 504] = "BuffImmunity";
    })(exports.BattleRecordDataType || (exports.BattleRecordDataType = {}));
    exports.BattleReportType = void 0;
    (function (BattleReportType) {
        BattleReportType[BattleReportType["None"] = 0] = "None";
        BattleReportType[BattleReportType["Damage"] = 1] = "Damage";
        BattleReportType[BattleReportType["Cure"] = 2] = "Cure";
        BattleReportType[BattleReportType["DamageDot"] = 3] = "DamageDot";
        BattleReportType[BattleReportType["Control"] = 4] = "Control";
        BattleReportType[BattleReportType["DamageBear"] = 5] = "DamageBear"; // 承受伤害
    })(exports.BattleReportType || (exports.BattleReportType = {}));
    exports.UnitEnergyUpdateType = void 0;
    (function (UnitEnergyUpdateType) {
        UnitEnergyUpdateType[UnitEnergyUpdateType["None"] = 0] = "None";
        UnitEnergyUpdateType[UnitEnergyUpdateType["UseSkill"] = 1] = "UseSkill";
        UnitEnergyUpdateType[UnitEnergyUpdateType["BeHit"] = 2] = "BeHit";
        UnitEnergyUpdateType[UnitEnergyUpdateType["Kill"] = 3] = "Kill";
        UnitEnergyUpdateType[UnitEnergyUpdateType["UseUltimate"] = 4] = "UseUltimate";
        UnitEnergyUpdateType[UnitEnergyUpdateType["Buff"] = 5] = "Buff";
    })(exports.UnitEnergyUpdateType || (exports.UnitEnergyUpdateType = {}));
    /**--------------------------战场------------------------- */
    /**--------------------------公共------------------------- */
    /**配置数据名 */
    exports.BattleConfigName = void 0;
    (function (BattleConfigName) {
        BattleConfigName["Skill"] = "skill";
        BattleConfigName["Buff"] = "buff";
        BattleConfigName["Bullet"] = "bullet";
        BattleConfigName["FindTarget"] = "findTarget";
        BattleConfigName["BuffModify"] = "buffModify";
        BattleConfigName["Behavior"] = "behavior";
        BattleConfigName["Condition"] = "condition";
        BattleConfigName["BuffType"] = "buffType";
        BattleConfigName["Summon"] = "summon";
        BattleConfigName["DamageExpressConfig"] = "damageExpressConfig";
        BattleConfigName["DamageExpressDefine"] = "damageExpressDefine";
        BattleConfigName["DamageExpressConst"] = "DamageExpressConst";
    })(exports.BattleConfigName || (exports.BattleConfigName = {}));
    /**目标选择 */
    exports.AreaType = void 0;
    (function (AreaType) {
        AreaType[AreaType["Self"] = 0] = "Self";
        AreaType[AreaType["Circle"] = 1] = "Circle";
        AreaType[AreaType["Sector"] = 2] = "Sector";
        AreaType[AreaType["Rect"] = 3] = "Rect";
    })(exports.AreaType || (exports.AreaType = {}));
    /**找人过滤逻辑 */
    exports.TargetFilterBy = void 0;
    (function (TargetFilterBy) {
        TargetFilterBy["None"] = "";
        TargetFilterBy["NoSelf"] = "1";
        TargetFilterBy["NoBulletTarget"] = "2";
        TargetFilterBy["NoControl"] = "3";
        TargetFilterBy["HasBulletTarget"] = "4";
    })(exports.TargetFilterBy || (exports.TargetFilterBy = {}));
    /**找人分组逻辑 */
    exports.TargetGroupBy = void 0;
    (function (TargetGroupBy) {
        TargetGroupBy[TargetGroupBy["None"] = 0] = "None";
        TargetGroupBy[TargetGroupBy["PosType1"] = 1] = "PosType1";
        TargetGroupBy[TargetGroupBy["PosType2"] = 2] = "PosType2";
    })(exports.TargetGroupBy || (exports.TargetGroupBy = {}));
    /**找人排序逻辑 */
    exports.TargetSortBy = void 0;
    (function (TargetSortBy) {
        TargetSortBy[TargetSortBy["None"] = 0] = "None";
        TargetSortBy[TargetSortBy["Random"] = 1] = "Random";
        TargetSortBy[TargetSortBy["Near"] = 2] = "Near";
        TargetSortBy[TargetSortBy["Far"] = 3] = "Far";
        TargetSortBy[TargetSortBy["MinHp1"] = 4] = "MinHp1";
        TargetSortBy[TargetSortBy["MaxAtk"] = 5] = "MaxAtk";
        TargetSortBy[TargetSortBy["MaxHp1"] = 6] = "MaxHp1";
        TargetSortBy[TargetSortBy["MaxHp2"] = 7] = "MaxHp2";
        TargetSortBy[TargetSortBy["MinHp2"] = 8] = "MinHp2";
    })(exports.TargetSortBy || (exports.TargetSortBy = {}));
    /**单位类型枚举 */
    exports.UnitType = void 0;
    (function (UnitType) {
        /**战士 */
        UnitType[UnitType["Role_1"] = 1] = "Role_1";
        /**弓箭手 */
        UnitType[UnitType["Role_2"] = 2] = "Role_2";
        /**法师 */
        UnitType[UnitType["Role_3"] = 3] = "Role_3";
        /**刺客 */
        UnitType[UnitType["Role_4"] = 4] = "Role_4";
        /**炮手 */
        UnitType[UnitType["Role_5"] = 5] = "Role_5";
        /**英灵 */
        UnitType[UnitType["Hero"] = 6] = "Hero";
        /**魔法书 */
        UnitType[UnitType["Magic"] = 7] = "Magic";
        /**boss */
        UnitType[UnitType["Monster"] = 8] = "Monster";
        /** 所有骷髅 */
        UnitType[UnitType["Skull"] = 9] = "Skull";
        /**召唤怪 */
        UnitType[UnitType["Summon"] = 100] = "Summon";
        /**特殊单位(不能被选中，不参与计算战斗结束) */
        UnitType[UnitType["Special"] = 101] = "Special";
        /**魔龙单位(不能被选中，不参与计算战斗结束) */
        UnitType[UnitType["Dragon"] = 102] = "Dragon";
    })(exports.UnitType || (exports.UnitType = {}));
    /**公式参数枚举 */
    exports.ExpressParamEnum = void 0;
    (function (ExpressParamEnum) {
        ExpressParamEnum["Unit1"] = "u1";
        ExpressParamEnum["Unit2"] = "u2";
        ExpressParamEnum["ReduceN"] = "N";
        ExpressParamEnum["ReduceS"] = "S";
        ExpressParamEnum["Lv"] = "lv";
        ExpressParamEnum["Atr"] = "atr";
        ExpressParamEnum["DamageReduceP"] = "damageReduceP";
        ExpressParamEnum["DamageReduceM"] = "damageReduceM";
    })(exports.ExpressParamEnum || (exports.ExpressParamEnum = {}));
    /** 单位流派枚举 */
    exports.UnitSectEnum = void 0;
    (function (UnitSectEnum) {
        UnitSectEnum[UnitSectEnum["None"] = 0] = "None";
        // 蛮族
        UnitSectEnum[UnitSectEnum["Sect1"] = 1] = "Sect1";
        // 人族
        UnitSectEnum[UnitSectEnum["Sect2"] = 2] = "Sect2";
        // 精灵
        UnitSectEnum[UnitSectEnum["Sect3"] = 3] = "Sect3";
        // 亡灵
        UnitSectEnum[UnitSectEnum["Sect4"] = 4] = "Sect4";
    })(exports.UnitSectEnum || (exports.UnitSectEnum = {}));
    /**属性提升类型，对应atrtype配置表 */
    exports.AtrType = void 0;
    (function (AtrType) {
        AtrType[AtrType["None"] = 0] = "None";
        /**攻击力 1*/
        AtrType[AtrType["Atk"] = 1] = "Atk";
        /**基础生命 2*/
        AtrType[AtrType["Hp"] = 2] = "Hp";
        /**基础护甲 3*/
        AtrType[AtrType["Def"] = 3] = "Def";
        /**基础魔抗 4*/
        AtrType[AtrType["MDef"] = 4] = "MDef";
        /**攻击速度 4*/
        AtrType[AtrType["AtkSpeed"] = 5] = "AtkSpeed";
        /**移动速度 6*/
        AtrType[AtrType["MoveSpeed"] = 6] = "MoveSpeed";
        /**物力攻击力附加 100*/
        AtrType[AtrType["AtkAdd"] = 101] = "AtkAdd";
        /**物理攻击万分比 101*/
        AtrType[AtrType["AtkPer"] = 102] = "AtkPer";
        /**生命附加 102*/
        AtrType[AtrType["HpAdd"] = 103] = "HpAdd";
        /**护甲附加 103*/
        AtrType[AtrType["DefAdd"] = 104] = "DefAdd";
        /**魔抗附加 104*/
        AtrType[AtrType["MDefAdd"] = 105] = "MDefAdd";
        /**生命万分比 105*/
        AtrType[AtrType["HpPer"] = 106] = "HpPer";
        /**护甲万分比 106*/
        AtrType[AtrType["DefPer"] = 107] = "DefPer";
        /**魔抗万分比 107*/
        AtrType[AtrType["MDefPer"] = 108] = "MDefPer";
        /**攻击速度万分比 108*/
        AtrType[AtrType["AtkSpeedPer"] = 109] = "AtkSpeedPer";
        /**移动速度万分比 109*/
        AtrType[AtrType["MoveSpeedPer"] = 110] = "MoveSpeedPer";
        /**命中 200*/
        AtrType[AtrType["Hit"] = 200] = "Hit";
        /**闪避 201*/
        AtrType[AtrType["Dodge"] = 201] = "Dodge";
        /**暴击率 202*/
        AtrType[AtrType["CritRate"] = 202] = "CritRate";
        /**抗暴击 203*/
        AtrType[AtrType["CritRateResist"] = 203] = "CritRateResist";
        /**技能命中 204*/
        AtrType[AtrType["SkillHit"] = 204] = "SkillHit";
        /**技能闪避 205*/
        AtrType[AtrType["SkillDodge"] = 205] = "SkillDodge";
        /**暴击伤害 206*/
        AtrType[AtrType["CritDamage"] = 206] = "CritDamage";
        /**暴击耐性 207*/
        AtrType[AtrType["CritDamageResist"] = 207] = "CritDamageResist";
        /**急速 208*/
        AtrType[AtrType["SkillRapid"] = 208] = "SkillRapid";
        /**受愈 209*/
        AtrType[AtrType["BeHealPer"] = 209] = "BeHealPer";
        /**治疗加成 210*/
        AtrType[AtrType["HealPer"] = 210] = "HealPer";
        /**受击回能 211*/
        AtrType[AtrType["EnergyHitAdd"] = 211] = "EnergyHitAdd";
        /**支援 212*/
        AtrType[AtrType["BuffTimeAdd"] = 212] = "BuffTimeAdd";
        /**韧性 213*/
        AtrType[AtrType["BuffTimeSub"] = 213] = "BuffTimeSub";
        /**小技能强度 214*/
        AtrType[AtrType["SkillAdd"] = 214] = "SkillAdd";
        /**终极技能强度 215*/
        AtrType[AtrType["SkillAddUltimate"] = 215] = "SkillAddUltimate";
        /**吸血 216*/
        AtrType[AtrType["Leech"] = 216] = "Leech";
        /**法术吸血 217*/
        AtrType[AtrType["MLeech"] = 217] = "MLeech";
        /**物理伤害增加 218*/
        AtrType[AtrType["DamageAdd"] = 218] = "DamageAdd";
        /**物理伤害减免 219*/
        AtrType[AtrType["DamageDef"] = 219] = "DamageDef";
        /**魔法伤害增加 220*/
        AtrType[AtrType["MDamageAdd"] = 220] = "MDamageAdd";
        /**魔法伤害减免 221*/
        AtrType[AtrType["MDamageDef"] = 221] = "MDamageDef";
        /**伤害增幅 222*/
        AtrType[AtrType["TotalDamageAdd"] = 222] = "TotalDamageAdd";
        /**伤害减免 223*/
        AtrType[AtrType["TotalDamageDef"] = 223] = "TotalDamageDef";
        /**蛮族伤害加成 300*/
        AtrType[AtrType["SectDamageAdd1"] = 301] = "SectDamageAdd1";
        /**蛮族伤害减免 301*/
        AtrType[AtrType["SectDamageDef1"] = 302] = "SectDamageDef1";
        /**人类伤害加成 302*/
        AtrType[AtrType["SectDamageAdd2"] = 303] = "SectDamageAdd2";
        /**人类伤害减免 303*/
        AtrType[AtrType["SectDamageDef2"] = 304] = "SectDamageDef2";
        /**精灵伤害加成 304*/
        AtrType[AtrType["SectDamageAdd3"] = 305] = "SectDamageAdd3";
        /**精灵伤害减免 305*/
        AtrType[AtrType["SectDamageDef3"] = 306] = "SectDamageDef3";
        /**亡灵伤害加成 306*/
        AtrType[AtrType["SectDamageAdd4"] = 307] = "SectDamageAdd4";
        /**亡灵伤害减免 307*/
        AtrType[AtrType["SectDamageDef4"] = 308] = "SectDamageDef4";
    })(exports.AtrType || (exports.AtrType = {}));
    /**单位移除方式 */
    exports.DieRemoveType = void 0;
    (function (DieRemoveType) {
        DieRemoveType[DieRemoveType["None"] = 0] = "None";
        DieRemoveType[DieRemoveType["Remove"] = 1] = "Remove";
        DieRemoveType[DieRemoveType["Hide"] = 2] = "Hide";
    })(exports.DieRemoveType || (exports.DieRemoveType = {}));
    /**单位移除类型 */
    exports.UnitRemoveType = void 0;
    (function (UnitRemoveType) {
        UnitRemoveType[UnitRemoveType["None"] = 0] = "None";
        UnitRemoveType[UnitRemoveType["Die"] = 1] = "Die";
        UnitRemoveType[UnitRemoveType["SurvivalTimeOver"] = 2] = "SurvivalTimeOver";
        UnitRemoveType[UnitRemoveType["Escape"] = 3] = "Escape";
        UnitRemoveType[UnitRemoveType["Handle"] = 4] = "Handle";
    })(exports.UnitRemoveType || (exports.UnitRemoveType = {}));
    exports.DamageType = void 0;
    (function (DamageType) {
        DamageType[DamageType["None"] = 0] = "None";
        DamageType[DamageType["Normal"] = 1] = "Normal";
        DamageType[DamageType["Skill"] = 2] = "Skill";
        DamageType[DamageType["Dot"] = 3] = "Dot";
        DamageType[DamageType["SkillCost"] = 4] = "SkillCost";
        DamageType[DamageType["Return"] = 5] = "Return";
        DamageType[DamageType["Link"] = 6] = "Link";
        DamageType[DamageType["Share"] = 7] = "Share";
    })(exports.DamageType || (exports.DamageType = {}));
    exports.DamageSubType = void 0;
    (function (DamageSubType) {
        DamageSubType[DamageSubType["None"] = 0] = "None";
        DamageSubType[DamageSubType["Physic"] = 1] = "Physic";
        DamageSubType[DamageSubType["Magic"] = 2] = "Magic";
        DamageSubType[DamageSubType["Real"] = 3] = "Real";
        DamageSubType[DamageSubType["Other"] = 4] = "Other";
    })(exports.DamageSubType || (exports.DamageSubType = {}));
    exports.DamageExpressType = void 0;
    (function (DamageExpressType) {
        DamageExpressType[DamageExpressType["None"] = 0] = "None";
        DamageExpressType[DamageExpressType["Express1"] = 1] = "Express1";
        DamageExpressType[DamageExpressType["Express2"] = 2] = "Express2";
        DamageExpressType[DamageExpressType["Express3"] = 3] = "Express3";
    })(exports.DamageExpressType || (exports.DamageExpressType = {}));
    // 回血类型
    exports.CureType = void 0;
    (function (CureType) {
        CureType[CureType["None"] = 0] = "None";
        CureType[CureType["Skill"] = 1] = "Skill";
        CureType[CureType["DamageLeach"] = 2] = "DamageLeach";
    })(exports.CureType || (exports.CureType = {}));
    exports.StorageType = void 0;
    (function (StorageType) {
        StorageType[StorageType["None"] = 0] = "None";
        StorageType[StorageType["Damage"] = 1] = "Damage";
        StorageType[StorageType["Cure"] = 2] = "Cure";
    })(exports.StorageType || (exports.StorageType = {}));
    /**--------------------------公共------------------------- */
    /**--------------------------BUFF------------------------- */
    /**buff移除类型 */
    exports.BuffRemoveType = void 0;
    (function (BuffRemoveType) {
        BuffRemoveType[BuffRemoveType["None"] = 0] = "None";
        BuffRemoveType[BuffRemoveType["Del"] = 1] = "Del";
        BuffRemoveType[BuffRemoveType["Time"] = 2] = "Time";
        BuffRemoveType[BuffRemoveType["Ability"] = 3] = "Ability";
    })(exports.BuffRemoveType || (exports.BuffRemoveType = {}));
    /**触发时机 */
    exports.TriggerEnum = void 0;
    (function (TriggerEnum) {
        TriggerEnum[TriggerEnum["None"] = 0] = "None";
        TriggerEnum[TriggerEnum["SkillStart"] = 1] = "SkillStart";
        TriggerEnum[TriggerEnum["SkillBeforeOver"] = 2] = "SkillBeforeOver";
        TriggerEnum[TriggerEnum["SkillCast"] = 3] = "SkillCast";
        TriggerEnum[TriggerEnum["SkillHit"] = 4] = "SkillHit";
        TriggerEnum[TriggerEnum["SkillCalc1"] = 5] = "SkillCalc1";
        TriggerEnum[TriggerEnum["SkillCalc2"] = 6] = "SkillCalc2";
        TriggerEnum[TriggerEnum["SkillAfter"] = 7] = "SkillAfter";
        TriggerEnum[TriggerEnum["BeAttackHit1"] = 8] = "BeAttackHit1";
        TriggerEnum[TriggerEnum["BeAttackHit2"] = 9] = "BeAttackHit2";
        TriggerEnum[TriggerEnum["SkillHitVia"] = 10] = "SkillHitVia";
        TriggerEnum[TriggerEnum["AddBuff2Self"] = 11] = "AddBuff2Self";
        TriggerEnum[TriggerEnum["AddBuff2Other"] = 12] = "AddBuff2Other";
        TriggerEnum[TriggerEnum["SkillKillCount"] = 13] = "SkillKillCount";
        TriggerEnum[TriggerEnum["BuffAddBefore"] = 14] = "BuffAddBefore";
        TriggerEnum[TriggerEnum["BuffAddAfter"] = 15] = "BuffAddAfter";
        TriggerEnum[TriggerEnum["ByBuff"] = 16] = "ByBuff";
        TriggerEnum[TriggerEnum["SubBuff"] = 17] = "SubBuff";
        TriggerEnum[TriggerEnum["MissCountChange"] = 18] = "MissCountChange";
        TriggerEnum[TriggerEnum["SubHoCountChange"] = 19] = "SubHoCountChange";
        TriggerEnum[TriggerEnum["BuffAddBefore2Other"] = 20] = "BuffAddBefore2Other";
        TriggerEnum[TriggerEnum["ChangeNormalTarget"] = 21] = "ChangeNormalTarget";
        TriggerEnum[TriggerEnum["BeHurt"] = 22] = "BeHurt";
        TriggerEnum[TriggerEnum["DotCalc1"] = 23] = "DotCalc1";
        TriggerEnum[TriggerEnum["DotCalc2"] = 24] = "DotCalc2";
        TriggerEnum[TriggerEnum["BeDotCalc1"] = 25] = "BeDotCalc1";
        TriggerEnum[TriggerEnum["BeDotCalc2"] = 26] = "BeDotCalc2";
        TriggerEnum[TriggerEnum["Die"] = 27] = "Die";
        TriggerEnum[TriggerEnum["SummonDie"] = 28] = "SummonDie";
        TriggerEnum[TriggerEnum["HpChange2"] = 29] = "HpChange2";
        TriggerEnum[TriggerEnum["TeamActBuffCount"] = 30] = "TeamActBuffCount";
        TriggerEnum[TriggerEnum["SkillFind1Before"] = 31] = "SkillFind1Before";
        TriggerEnum[TriggerEnum["BuffTriggerCount"] = 32] = "BuffTriggerCount";
        TriggerEnum[TriggerEnum["FriendEnter"] = 33] = "FriendEnter";
        TriggerEnum[TriggerEnum["EnemyEnter"] = 34] = "EnemyEnter";
        TriggerEnum[TriggerEnum["SkillKill"] = 35] = "SkillKill";
        TriggerEnum[TriggerEnum["SettlementKill"] = 36] = "SettlementKill";
        TriggerEnum[TriggerEnum["Miss"] = 37] = "Miss";
        TriggerEnum[TriggerEnum["CureCalc1"] = 38] = "CureCalc1";
        TriggerEnum[TriggerEnum["CureCalc2"] = 39] = "CureCalc2";
        TriggerEnum[TriggerEnum["BeCureCalc1"] = 40] = "BeCureCalc1";
        TriggerEnum[TriggerEnum["BeCureCalc2"] = 41] = "BeCureCalc2";
        TriggerEnum[TriggerEnum["EnemyDie"] = 42] = "EnemyDie";
        TriggerEnum[TriggerEnum["BuffTypeRemove1"] = 43] = "BuffTypeRemove1";
        TriggerEnum[TriggerEnum["BuffTypeRemove2"] = 44] = "BuffTypeRemove2";
        TriggerEnum[TriggerEnum["BuffTypeRemove3"] = 45] = "BuffTypeRemove3";
        TriggerEnum[TriggerEnum["WillDie"] = 46] = "WillDie";
        TriggerEnum[TriggerEnum["CalcDamageOver1"] = 47] = "CalcDamageOver1";
        TriggerEnum[TriggerEnum["BulletHit"] = 48] = "BulletHit";
        TriggerEnum[TriggerEnum["AddSummon"] = 49] = "AddSummon";
        TriggerEnum[TriggerEnum["DotKill"] = 50] = "DotKill";
        TriggerEnum[TriggerEnum["BlockTrigger"] = 51] = "BlockTrigger";
        TriggerEnum[TriggerEnum["BulletDivision"] = 52] = "BulletDivision";
        TriggerEnum[TriggerEnum["SkillFinish"] = 53] = "SkillFinish";
        TriggerEnum[TriggerEnum["SummonSurvivalTimeOver"] = 54] = "SummonSurvivalTimeOver";
        TriggerEnum[TriggerEnum["SkillUseCount"] = 55] = "SkillUseCount";
        TriggerEnum[TriggerEnum["TeamSkillUseCount"] = 56] = "TeamSkillUseCount";
        TriggerEnum[TriggerEnum["SkillBefore"] = 57] = "SkillBefore";
        TriggerEnum[TriggerEnum["StartFight"] = 1000] = "StartFight";
        TriggerEnum[TriggerEnum["FinishFight"] = 1001] = "FinishFight";
    })(exports.TriggerEnum || (exports.TriggerEnum = {}));
    /**条件枚举 */
    exports.BattleConditionType = void 0;
    (function (BattleConditionType) {
        BattleConditionType[BattleConditionType["None"] = 0] = "None";
        BattleConditionType[BattleConditionType["CheckSkill"] = 1] = "CheckSkill";
        BattleConditionType[BattleConditionType["CheckBuffCount"] = 2] = "CheckBuffCount";
        BattleConditionType[BattleConditionType["CheckHurtValue"] = 3] = "CheckHurtValue";
        BattleConditionType[BattleConditionType["CheckChangeHp"] = 4] = "CheckChangeHp";
        BattleConditionType[BattleConditionType["CheckBuffAddCount"] = 5] = "CheckBuffAddCount";
        BattleConditionType[BattleConditionType["CheckBuffDelCount"] = 6] = "CheckBuffDelCount";
        BattleConditionType[BattleConditionType["CheckBuffAdd2OtherCount"] = 7] = "CheckBuffAdd2OtherCount";
        BattleConditionType[BattleConditionType["CheckBuffTriggerCount"] = 8] = "CheckBuffTriggerCount";
        BattleConditionType[BattleConditionType["CheckCrit"] = 9] = "CheckCrit";
        BattleConditionType[BattleConditionType["CheckBuff"] = 10] = "CheckBuff";
        BattleConditionType[BattleConditionType["CheckTeamActBuff"] = 11] = "CheckTeamActBuff";
        BattleConditionType[BattleConditionType["CheckHpPer"] = 12] = "CheckHpPer";
        BattleConditionType[BattleConditionType["CheckUnitType"] = 13] = "CheckUnitType";
        BattleConditionType[BattleConditionType["CheckSkillHitCount"] = 14] = "CheckSkillHitCount";
        BattleConditionType[BattleConditionType["CheckSkillHitCountTotal"] = 15] = "CheckSkillHitCountTotal";
        BattleConditionType[BattleConditionType["CheckSkillFindTarget"] = 16] = "CheckSkillFindTarget";
        BattleConditionType[BattleConditionType["CheckSkillKill"] = 18] = "CheckSkillKill";
        BattleConditionType[BattleConditionType["CheckSkillCrit"] = 19] = "CheckSkillCrit";
        BattleConditionType[BattleConditionType["CheckShieldValueLess"] = 20] = "CheckShieldValueLess";
        BattleConditionType[BattleConditionType["CheckBuffSource"] = 21] = "CheckBuffSource";
        BattleConditionType[BattleConditionType["CheckSect"] = 22] = "CheckSect";
        BattleConditionType[BattleConditionType["CheckSkillUseCount"] = 23] = "CheckSkillUseCount";
        BattleConditionType[BattleConditionType["CheckBeHitCount"] = 24] = "CheckBeHitCount";
        BattleConditionType[BattleConditionType["CheckSubhpCount"] = 25] = "CheckSubhpCount";
        BattleConditionType[BattleConditionType["CheckMissCount"] = 26] = "CheckMissCount";
        BattleConditionType[BattleConditionType["CheckSummonCount"] = 27] = "CheckSummonCount";
        BattleConditionType[BattleConditionType["CheckSummonGroup"] = 28] = "CheckSummonGroup";
        BattleConditionType[BattleConditionType["CheckDamageType"] = 30] = "CheckDamageType";
        BattleConditionType[BattleConditionType["CheckToDieDamage"] = 31] = "CheckToDieDamage";
        BattleConditionType[BattleConditionType["CheckTeamSkillUseCount"] = 32] = "CheckTeamSkillUseCount";
        BattleConditionType[BattleConditionType["CheckTeam"] = 33] = "CheckTeam";
        BattleConditionType[BattleConditionType["CheckBuffCountMost"] = 34] = "CheckBuffCountMost";
    })(exports.BattleConditionType || (exports.BattleConditionType = {}));
    /**buff效果类型 */
    exports.AbilityEnum = void 0;
    (function (AbilityEnum) {
        AbilityEnum[AbilityEnum["None"] = 0] = "None";
        AbilityEnum[AbilityEnum["Damge1"] = 1] = "Damge1";
        AbilityEnum[AbilityEnum["Damge2"] = 2] = "Damge2";
        AbilityEnum[AbilityEnum["Damge3"] = 3] = "Damge3";
        AbilityEnum[AbilityEnum["Damge4"] = 4] = "Damge4";
        AbilityEnum[AbilityEnum["Damge5"] = 5] = "Damge5";
        AbilityEnum[AbilityEnum["Damge6"] = 6] = "Damge6";
        AbilityEnum[AbilityEnum["Damge7"] = 7] = "Damge7";
        AbilityEnum[AbilityEnum["Damge8"] = 8] = "Damge8";
        AbilityEnum[AbilityEnum["Damge9"] = 9] = "Damge9";
        AbilityEnum[AbilityEnum["Recover"] = 100] = "Recover";
        AbilityEnum[AbilityEnum["Recover1"] = 101] = "Recover1";
        AbilityEnum[AbilityEnum["Recover2"] = 102] = "Recover2";
        AbilityEnum[AbilityEnum["Recover3"] = 103] = "Recover3";
        AbilityEnum[AbilityEnum["UseSkill"] = 200] = "UseSkill";
        AbilityEnum[AbilityEnum["AddBuff"] = 201] = "AddBuff";
        AbilityEnum[AbilityEnum["ChangeBehavior"] = 202] = "ChangeBehavior";
        AbilityEnum[AbilityEnum["ClearDebuff"] = 203] = "ClearDebuff";
        AbilityEnum[AbilityEnum["ReplaceSkill"] = 204] = "ReplaceSkill";
        AbilityEnum[AbilityEnum["TriggerBuff"] = 205] = "TriggerBuff";
        AbilityEnum[AbilityEnum["DoBuff"] = 206] = "DoBuff";
        AbilityEnum[AbilityEnum["DelBuff1"] = 207] = "DelBuff1";
        AbilityEnum[AbilityEnum["Fear"] = 208] = "Fear";
        AbilityEnum[AbilityEnum["Blink"] = 209] = "Blink";
        AbilityEnum[AbilityEnum["DelBuff2"] = 210] = "DelBuff2";
        AbilityEnum[AbilityEnum["ChangeUnitScale"] = 211] = "ChangeUnitScale";
        AbilityEnum[AbilityEnum["Repel"] = 212] = "Repel";
        AbilityEnum[AbilityEnum["SubSkillCD"] = 213] = "SubSkillCD";
        AbilityEnum[AbilityEnum["Pull"] = 214] = "Pull";
        AbilityEnum[AbilityEnum["SettlementDot"] = 215] = "SettlementDot";
        AbilityEnum[AbilityEnum["Tuant"] = 216] = "Tuant";
        AbilityEnum[AbilityEnum["AddBuffImmunity"] = 217] = "AddBuffImmunity";
        AbilityEnum[AbilityEnum["ChangeBuffAddCount"] = 218] = "ChangeBuffAddCount";
        AbilityEnum[AbilityEnum["ChangeBuffOverLimit"] = 219] = "ChangeBuffOverLimit";
        AbilityEnum[AbilityEnum["ReplaceFind"] = 220] = "ReplaceFind";
        AbilityEnum[AbilityEnum["CopyBuff"] = 221] = "CopyBuff";
        AbilityEnum[AbilityEnum["RefreshBuffTime"] = 222] = "RefreshBuffTime";
        AbilityEnum[AbilityEnum["Summon"] = 223] = "Summon";
        AbilityEnum[AbilityEnum["AddSurvivalTime"] = 224] = "AddSurvivalTime";
        AbilityEnum[AbilityEnum["UpdateBuffTime"] = 225] = "UpdateBuffTime";
        AbilityEnum[AbilityEnum["AddSkillCD"] = 226] = "AddSkillCD";
        AbilityEnum[AbilityEnum["SubSkillTypeCD"] = 227] = "SubSkillTypeCD";
        AbilityEnum[AbilityEnum["NoCure"] = 228] = "NoCure";
        AbilityEnum[AbilityEnum["FirstBeAttack"] = 229] = "FirstBeAttack";
        AbilityEnum[AbilityEnum["IgnoreShield"] = 230] = "IgnoreShield";
        AbilityEnum[AbilityEnum["IgnoreDmage"] = 231] = "IgnoreDmage";
        AbilityEnum[AbilityEnum["LinkDamage"] = 232] = "LinkDamage";
        AbilityEnum[AbilityEnum["AddSkillTypeCD"] = 233] = "AddSkillTypeCD";
        AbilityEnum[AbilityEnum["LockHp"] = 234] = "LockHp";
        AbilityEnum[AbilityEnum["LinkBuff"] = 235] = "LinkBuff";
        AbilityEnum[AbilityEnum["ChangeAtrs"] = 236] = "ChangeAtrs";
        AbilityEnum[AbilityEnum["MoveToUnit"] = 237] = "MoveToUnit";
        AbilityEnum[AbilityEnum["ShieldValueAddPer"] = 238] = "ShieldValueAddPer";
        AbilityEnum[AbilityEnum["AddSkill"] = 239] = "AddSkill";
        AbilityEnum[AbilityEnum["BanSkill"] = 240] = "BanSkill";
        AbilityEnum[AbilityEnum["NoDie"] = 241] = "NoDie";
        AbilityEnum[AbilityEnum["FindLink"] = 242] = "FindLink";
        AbilityEnum[AbilityEnum["DelBuffNew1"] = 243] = "DelBuffNew1";
        AbilityEnum[AbilityEnum["DelBuffNew2"] = 244] = "DelBuffNew2";
        AbilityEnum[AbilityEnum["TriggerBuffByWeight"] = 245] = "TriggerBuffByWeight";
        AbilityEnum[AbilityEnum["AddAtrBuff"] = 246] = "AddAtrBuff";
        AbilityEnum[AbilityEnum["BeHurtThreshold"] = 247] = "BeHurtThreshold";
        AbilityEnum[AbilityEnum["BulletDivision"] = 248] = "BulletDivision";
        AbilityEnum[AbilityEnum["ChangeBuffCount"] = 249] = "ChangeBuffCount";
        AbilityEnum[AbilityEnum["Escape"] = 250] = "Escape";
        AbilityEnum[AbilityEnum["LinkFind1"] = 251] = "LinkFind1";
        AbilityEnum[AbilityEnum["ShareDamage"] = 252] = "ShareDamage";
        AbilityEnum[AbilityEnum["StorageValue"] = 253] = "StorageValue";
        AbilityEnum[AbilityEnum["UseStorageValue"] = 254] = "UseStorageValue";
        AbilityEnum[AbilityEnum["RealCure"] = 255] = "RealCure";
        AbilityEnum[AbilityEnum["ConditionDo"] = 256] = "ConditionDo";
        AbilityEnum[AbilityEnum["EnergyAdd"] = 300] = "EnergyAdd";
        AbilityEnum[AbilityEnum["EnergyModify"] = 301] = "EnergyModify";
        //影响战斗计算相关效果--------------------
        AbilityEnum[AbilityEnum["DamageReturn1"] = 400] = "DamageReturn1";
        AbilityEnum[AbilityEnum["Shield"] = 401] = "Shield";
        AbilityEnum[AbilityEnum["SubShield"] = 402] = "SubShield";
        AbilityEnum[AbilityEnum["Leech"] = 403] = "Leech";
        AbilityEnum[AbilityEnum["MustCrit"] = 404] = "MustCrit";
        AbilityEnum[AbilityEnum["MustHit"] = 405] = "MustHit";
        AbilityEnum[AbilityEnum["DamgeAdd1"] = 500] = "DamgeAdd1";
        AbilityEnum[AbilityEnum["DamgeAdd2"] = 501] = "DamgeAdd2";
        AbilityEnum[AbilityEnum["DamageReduce1"] = 502] = "DamageReduce1";
        AbilityEnum[AbilityEnum["DamageReduce2"] = 503] = "DamageReduce2";
        AbilityEnum[AbilityEnum["CritValue1"] = 504] = "CritValue1";
        AbilityEnum[AbilityEnum["CritResistance1"] = 505] = "CritResistance1";
        AbilityEnum[AbilityEnum["DamageAddEx"] = 506] = "DamageAddEx";
        //影响战斗计算相关效果--------------------
        AbilityEnum[AbilityEnum["ChangeAtrStart"] = 1000] = "ChangeAtrStart";
        AbilityEnum[AbilityEnum["ChangeAtrEnd"] = 2000] = "ChangeAtrEnd";
    })(exports.AbilityEnum || (exports.AbilityEnum = {}));
    exports.UniqueAbilityTag = void 0;
    (function (UniqueAbilityTag) {
        UniqueAbilityTag[UniqueAbilityTag["None"] = 0] = "None";
        UniqueAbilityTag[UniqueAbilityTag["Taunt"] = 1] = "Taunt";
        UniqueAbilityTag[UniqueAbilityTag["Move"] = 2] = "Move";
    })(exports.UniqueAbilityTag || (exports.UniqueAbilityTag = {}));
    /**buff叠加类型 */
    exports.BuffOverlap = void 0;
    (function (BuffOverlap) {
        BuffOverlap[BuffOverlap["ResetTime"] = 0] = "ResetTime";
        BuffOverlap[BuffOverlap["SameTime"] = 1] = "SameTime";
        BuffOverlap[BuffOverlap["RespectiveTime"] = 2] = "RespectiveTime";
        BuffOverlap[BuffOverlap["NoHandle"] = 3] = "NoHandle";
        BuffOverlap[BuffOverlap["StackAbility"] = 4] = "StackAbility";
        BuffOverlap[BuffOverlap["StackTriggerCount"] = 5] = "StackTriggerCount";
    })(exports.BuffOverlap || (exports.BuffOverlap = {}));
    /**buff修改类型 */
    exports.BuffModifyType = void 0;
    (function (BuffModifyType) {
        BuffModifyType[BuffModifyType["None"] = 0] = "None";
        BuffModifyType[BuffModifyType["Rate"] = 1] = "Rate";
        BuffModifyType[BuffModifyType["Time"] = 2] = "Time";
        BuffModifyType[BuffModifyType["Ability"] = 3] = "Ability";
    })(exports.BuffModifyType || (exports.BuffModifyType = {}));
    // buff来源
    exports.BuffSourceType = void 0;
    (function (BuffSourceType) {
        BuffSourceType[BuffSourceType["None"] = 0] = "None";
        BuffSourceType[BuffSourceType["Friend"] = 1] = "Friend";
        BuffSourceType[BuffSourceType["Enemy"] = 2] = "Enemy"; // 敌人
    })(exports.BuffSourceType || (exports.BuffSourceType = {}));
    // buff类型
    exports.BuffType = void 0;
    (function (BuffType) {
        BuffType[BuffType["None"] = 0] = "None";
        BuffType[BuffType["Julongfengyin"] = 3000] = "Julongfengyin";
        BuffType[BuffType["Block"] = 4300] = "Block";
    })(exports.BuffType || (exports.BuffType = {}));
    /**--------------------------BUFF------------------------- */
    /**--------------------------单位------------------------- */
    /**单位朝向 */
    exports.UnitDir = void 0;
    (function (UnitDir) {
        UnitDir[UnitDir["None"] = 0] = "None";
        UnitDir[UnitDir["Left"] = 1] = "Left";
        UnitDir[UnitDir["Right"] = 2] = "Right";
    })(exports.UnitDir || (exports.UnitDir = {}));
    /**单位流派类型 */
    exports.UnitSect = void 0;
    (function (UnitSect) {
        UnitSect[UnitSect["None"] = 0] = "None";
        UnitSect[UnitSect["Zhiming"] = 1] = "Zhiming";
        UnitSect[UnitSect["Yuansu"] = 2] = "Yuansu";
        UnitSect[UnitSect["Anying"] = 3] = "Anying";
        UnitSect[UnitSect["Xukong"] = 4] = "Xukong"; //虚空4
    })(exports.UnitSect || (exports.UnitSect = {}));
    /**--------------------------单位------------------------- */
    /**--------------------------技能------------------------- */
    /**技能类型 */
    exports.SkillType = void 0;
    (function (SkillType) {
        SkillType[SkillType["None"] = 0] = "None";
        SkillType[SkillType["Skill1"] = 1] = "Skill1";
        SkillType[SkillType["Skill2"] = 2] = "Skill2";
        SkillType[SkillType["Skill3"] = 3] = "Skill3";
        SkillType[SkillType["Skill4"] = 4] = "Skill4";
        SkillType[SkillType["Skill100"] = 5] = "Skill100";
    })(exports.SkillType || (exports.SkillType = {}));
    /**技能效果 */
    exports.SkillEffect = void 0;
    (function (SkillEffect) {
        SkillEffect[SkillEffect["None"] = 0] = "None";
        SkillEffect[SkillEffect["Control"] = 1] = "Control";
        SkillEffect[SkillEffect["Debuff"] = 2] = "Debuff";
        SkillEffect[SkillEffect["Support"] = 3] = "Support";
    })(exports.SkillEffect || (exports.SkillEffect = {}));
    // 技能状态
    exports.SkillProcessEnum = void 0;
    (function (SkillProcessEnum) {
        SkillProcessEnum["Empty"] = "empty";
        SkillProcessEnum["Before"] = "before";
        SkillProcessEnum["BeforeOver"] = "before-over";
        SkillProcessEnum["Cast"] = "cast";
        SkillProcessEnum["CastAfter"] = "castAfter";
        SkillProcessEnum["After"] = "after";
        SkillProcessEnum["Finish"] = "finish";
        SkillProcessEnum["Hit"] = "hit";
        SkillProcessEnum["HitVia"] = "hit-via";
    })(exports.SkillProcessEnum || (exports.SkillProcessEnum = {}));
    // 技能状态对应的处理函数
    exports.SkillProcessHandler = void 0;
    (function (SkillProcessHandler) {
        SkillProcessHandler["Before"] = "before";
        SkillProcessHandler["BeforeOver"] = "before-over";
        SkillProcessHandler["Cast"] = "cast";
        SkillProcessHandler["After"] = "after";
        SkillProcessHandler["Finish"] = "finish";
        SkillProcessHandler["Hit"] = "hit";
        SkillProcessHandler["HitVia"] = "hit-via";
    })(exports.SkillProcessHandler || (exports.SkillProcessHandler = {}));
    /**--------------------------技能------------------------- */
    /**地图类型 */
    exports.MapType = void 0;
    (function (MapType) {
        MapType[MapType["Default"] = 0] = "Default";
        MapType[MapType["Pixel"] = 1] = "Pixel";
        MapType[MapType["Hex"] = 2] = "Hex";
    })(exports.MapType || (exports.MapType = {}));

    /**
     * 定点数 - 性能优化版本
     */
    class FNumber {
        /**
         * 从对象池获取FNumber实例
         */
        static get(value) {
            if (this._pool.length > 0) {
                const instance = this._pool.pop();
                if (value !== undefined) {
                    instance.value = 0;
                    instance.add(value);
                }
                else {
                    instance.value = 0;
                }
                return instance;
            }
            return new FNumber(value);
        }
        /**
         * 回收FNumber实例到对象池
         */
        static put(instance) {
            if (this._pool.length < this._poolSize) {
                instance.value = 0;
                this._pool.push(instance);
            }
        }
        /**
         * 初始化对象池
         */
        static initPool() {
            while (this._pool.length < this._poolSize) {
                this._pool.push(new FNumber());
            }
            // 初始化链式调用实例
            if (!this.Chain) {
                this.Chain = new FNumber();
            }
        }
        valueOf() {
            return this.value;
        }
        toString() {
            return String(this.value);
        }
        /**
         * 创建FNumber实例 - 使用对象池
         */
        static creat(value) {
            return this.get(value);
        }
        /**
         * 链式调用 - 复用单例
         */
        static value(value) {
            if (!FNumber.Chain) {
                FNumber.Chain = new FNumber();
            }
            FNumber.Chain.value = 0;
            FNumber.Chain.add(value);
            return FNumber.Chain;
        }
        /**
         * 保留n位小数，并四舍五入 - 使用缓存的因子
         */
        static toFixed(num, n = 0) {
            if (n === 0) {
                return Math.round(num);
            }
            else if (n === this.Decimals) {
                // 使用缓存的因子
                return Math.round(num * this.DecimalsFactor) / this.DecimalsFactor;
            }
            else {
                const m = Math.pow(10, n);
                return Math.round(num * m) / m;
            }
        }
        /**
         * 获得小数位数 - 优化算法
         */
        static getDecimalPlace(num) {
            if (!num || num === Math.floor(num)) {
                return 0;
            }
            // 转换为字符串并查找小数点位置
            const str = num.toString();
            const dotIndex = str.indexOf('.');
            if (dotIndex === -1)
                return 0;
            return str.length - dotIndex - 1;
        }
        constructor(n) {
            this.value = 0;
            if (n !== undefined) {
                this.add(n);
            }
        }
        /**
         * 重置为0 - 优化条件判断
         */
        reset(n) {
            this.value = n !== undefined ? n : 0;
            return this;
        }
        // 优化2: 优化数值运算方法
        add(num) {
            if (!num)
                return this;
            // 使用位运算优化
            // const a = (this.value * FNumber.Ratio) | 0;
            const a = Math.floor(this.value * FNumber.Ratio);
            // const b = (num * FNumber.Ratio) | 0;
            const b = Math.floor(num * FNumber.Ratio);
            this.value = (a + b) / FNumber.Ratio;
            return this;
        }
        // public add(num: number): FNumber {
        //     if (!num) {
        //         return this;
        //     }
        //     // 使用预计算的乘法因子和除法因子
        //     this.value = (Math.floor(this.value * FNumber.Ratio) + Math.floor(num * FNumber.Ratio))/ FNumber.Ratio;
        //     return this;
        // }
        /**
         * 小数相减 - 使用缓存的比例因子
         */
        sub(num) {
            if (!num) {
                return this;
            }
            // 使用预计算的乘法因子和除法因子
            this.value = (Math.floor(this.value * FNumber.Ratio) - Math.floor(num * FNumber.Ratio)) / FNumber.Ratio;
            return this;
        }
        /**
         * 小数相乘 - 使用缓存的比例因子
         */
        mul(num) {
            if (!num) {
                this.value = 0;
                return this;
            }
            // 使用预计算的乘法因子和除法因子
            this.value = (Math.floor(this.value * FNumber.Ratio) * Math.floor(num * FNumber.Ratio)) / FNumber.Ratio / FNumber.Ratio;
            return this;
        }
        // public mul(num: number): FNumber {
        //     if (!num) {
        //         this.value = 0;
        //         return this;
        //     }
        //     // 使用位运算优化
        //     const a = (this.value * FNumber.Ratio) | 0;
        //     const b = (num * FNumber.Ratio) | 0;
        //     this.value = ((a * b) | 0)/ FNumber.Ratio/ FNumber.Ratio;
        //     return this;
        // }
        /**
         * 小数相除 - 使用缓存的比例因子
         */
        div(num) {
            if (!num) {
                this.value = 0;
                return this;
            }
            // 使用预计算的乘法因子
            this.value = Math.floor((Math.floor(this.value * FNumber.Ratio) / Math.floor(num * FNumber.Ratio)) * FNumber.Ratio) / FNumber.Ratio;
            return this;
        }
        /**
         * 取余
         */
        rem(num) {
            if (!num) {
                return 0;
            }
            const m = Math.pow(10, Math.max(FNumber.getDecimalPlace(this.value), FNumber.getDecimalPlace(num)));
            return FNumber.toFixed(this.value * m) % FNumber.toFixed(num * m) / m;
        }
        ;
        /**
         * 幂
         */
        pow(num) {
            if (!num) {
                return this;
            }
            this.value = Math.pow(FNumber.toFixed(this.value, FNumber.Decimals), FNumber.toFixed(num, FNumber.Decimals));
            return this;
        }
        ;
        /**
         * 开方
         */
        sqrt() {
            this.value = Math.sqrt(FNumber.toFixed(this.value, FNumber.Decimals));
            return this;
        }
        ;
        /**
         * 三角函数
         */
        sin(x) {
            this.value = FNumber.toFixed(Math.sin(x), FNumber.Decimals);
            return this;
        }
        ;
        cos(x) {
            this.value = FNumber.toFixed(Math.cos(x), FNumber.Decimals);
            return this;
        }
        ;
        tan(x) {
            this.value = FNumber.toFixed(Math.tan(x), FNumber.Decimals);
            return this;
        }
        ;
        asin(x) {
            this.value = FNumber.toFixed(Math.asin(x), FNumber.Decimals);
            return this;
        }
        ;
        acos(x) {
            this.value = FNumber.toFixed(Math.acos(x), FNumber.Decimals);
            return this;
        }
        ;
        atan(x) {
            this.value = FNumber.toFixed(Math.atan(x), FNumber.Decimals);
            return this;
        }
        ;
        atan2(y, x) {
            this.value = FNumber.toFixed(Math.atan2(y, x), FNumber.Decimals);
            return this;
        }
        ;
    }
    // 角度弧度常量
    FNumber.DEG = 57.29577951308232;
    FNumber.RAD = 0.017453292519943295;
    // 系统常量
    FNumber.PI = 3.141592653589793;
    FNumber.E = 2.718281828459045;
    FNumber.LN2 = 0.6931471805599453;
    FNumber.LN10 = 2.302585092994046;
    FNumber.LOG2E = 1.4426950408889634;
    FNumber.LOG10E = 0.4342944819032518;
    FNumber.SQRT1_2 = 0.7071067811865476;
    FNumber.SQRT2 = 1.4142135623730951;
    // 对象池 - 减少GC
    FNumber._pool = [];
    FNumber._poolSize = 50;
    FNumber.Chain = null;
    // 缩放的比例
    FNumber.Ratio = 1000;
    // 保留小数的位数
    FNumber.Decimals = 2;
    FNumber.DecimalsFactor = Math.pow(10, 3);

    class NumberUtil {
        static myParseInt(string) {
            // return parseInt(string);
            let num;
            if (typeof string === 'string' && /^[\+\-]?\d+/.test(string)) {
                num = parseInt(string.trim());
            }
            else if (typeof string === "number") {
                num = string;
            }
            if (!num) {
                num = 0;
            }
            return num;
        }
        static isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    }

    /**
     * 高性能3D向量类 - 使用FNumber进行精确计算
     * 用于游戏中需要精确计算的向量运算
     */
    class BVec3 {
        constructor(a, b, c) {
            if (a instanceof Array) {
                this.values = a;
            }
            else {
                this.values = [a, b, c];
            }
            this._fnum1 = FNumber.creat();
            this._fnum2 = FNumber.creat();
            this._fnum3 = FNumber.creat();
        }
        /**
         * 获取对象池中的向量实例
         */
        static get() {
            if (this._pool.length > 0) {
                return this._pool.pop();
            }
            return new BVec3(0, 0, 0);
        }
        /**
         * 回收向量到对象池
         */
        static put(v) {
            if (this._pool.length < this._poolSize) {
                v.setTo(0, 0, 0);
                this._pool.push(v);
            }
        }
        /**
         * 预先创建对象池
         */
        static initPool() {
            while (this._pool.length < this._poolSize) {
                this._pool.push(new BVec3(0, 0, 0));
            }
        }
        /**
         * 获取临时向量1 - 仅用于内部计算
         */
        static get _emp1() {
            if (!this._tempVec1) {
                this._tempVec1 = new BVec3(0, 0, 0);
            }
            return this._tempVec1;
        }
        /**
         * 获取临时向量2 - 仅用于内部计算
         */
        static get temp2() {
            if (!this._tempVec2) {
                this._tempVec2 = new BVec3(0, 0, 0);
            }
            return this._tempVec2;
        }
        /**
         * 获取临时向量2 - 仅用于内部计算
         */
        static get Temp() {
            if (!this._tempVec3) {
                this._tempVec3 = new BVec3(0, 0, 0);
            }
            return this._tempVec3;
        }
        get x() { return this.values[0]; }
        get y() { return this.values[1]; }
        get z() { return this.values[2]; }
        set x(val) { this.values[0] = val; }
        set y(val) { this.values[1] = val; }
        set z(val) { this.values[2] = val; }
        setTo(a, b, c) {
            var _a;
            if (typeof (a) == "object") {
                this.values[0] = a.x;
                this.values[1] = a.y;
                this.values[2] = (_a = a.z) !== null && _a !== void 0 ? _a : 0; // 使用空值合并运算符
                return this;
            }
            this.values[0] = a;
            this.values[1] = b;
            this.values[2] = c !== null && c !== void 0 ? c : 0;
            return this;
        }
        /**
         * 获取零向量
         */
        static get Zero() {
            if (!this._zero) {
                this._zero = new BVec3(0, 0, 0);
            }
            return this._zero;
        }
        /**
         * 获取单位向量
         */
        static get One() {
            if (!this._one) {
                this._one = new BVec3(1, 1, 1);
            }
            return this._one;
        }
        /**
         * 获取X轴单位向量
         */
        static get X() {
            if (!this._x) {
                this._x = new BVec3(1, 0, 0);
            }
            return this._x;
        }
        /**
         * 获取Y轴单位向量
         */
        static get Y() {
            if (!this._y) {
                this._y = new BVec3(0, 1, 0);
            }
            return this._y;
        }
        /**
         * 获取Z轴单位向量
         */
        static get Z() {
            if (!this._z) {
                this._z = new BVec3(0, 0, 1);
            }
            return this._z;
        }
        /**
         * 向量加法: this + that
         * 使用对象池优化
         */
        Add(that) {
            var _a;
            const result = BVec3.get();
            result.x = this._fnum1.reset(this.x).add(that.x).value;
            result.y = this._fnum2.reset(this.y).add(that.y).value;
            result.z = this._fnum3.reset(this.z).add((_a = that.z) !== null && _a !== void 0 ? _a : 0).value;
            return result;
        }
        /**
         * 向量加法: this += that (修改自身)
         * 避免创建新对象
         */
        AddSelf(that) {
            var _a;
            this.x = this._fnum1.reset(this.x).add(that.x).value;
            this.y = this._fnum2.reset(this.y).add(that.y).value;
            this.z = this._fnum3.reset(this.z).add((_a = that.z) !== null && _a !== void 0 ? _a : 0).value;
            return this;
        }
        /**
         * 向量减法: this - that
         * 使用对象池优化
         */
        Sub(that) {
            var _a;
            const result = BVec3.get();
            result.x = this._fnum1.reset(this.x).sub(that.x).value;
            result.y = this._fnum2.reset(this.y).sub(that.y).value;
            result.z = this._fnum3.reset(this.z).sub((_a = that.z) !== null && _a !== void 0 ? _a : 0).value;
            return result;
        }
        /**
         * 向量减法: this -= that (修改自身)
         * 避免创建新对象
         */
        SubSelf(that) {
            var _a;
            this.x = this._fnum1.reset(this.x).sub(that.x).value;
            this.y = this._fnum2.reset(this.y).sub(that.y).value;
            this.z = this._fnum3.reset(this.z).sub((_a = that.z) !== null && _a !== void 0 ? _a : 0).value;
            return this;
        }
        /**
         * 向量点积: this · that
         * 优化FNumber使用
         */
        Dot(that) {
            var _a;
            const x = this._fnum1.reset(this.x).mul(that.x).value;
            const y = this._fnum2.reset(this.y).mul(that.y).value;
            const z = this._fnum3.reset(this.z).mul((_a = that.z) !== null && _a !== void 0 ? _a : 0).value;
            return x + y + z;
        }
        /**
         * 向量叉积: this × that
         * 使用对象池优化
         */
        Cross(that) {
            var _a, _b;
            const result = BVec3.get();
            // 优化计算顺序，减少FNumber重置次数
            const x = this._fnum1.reset(this.y).mul((_a = that.z) !== null && _a !== void 0 ? _a : 0).sub(this._fnum2.reset(this.z).mul(that.y).value).value;
            const y = this._fnum1.reset(this.z).mul(that.x).sub(this._fnum2.reset(this.x).mul((_b = that.z) !== null && _b !== void 0 ? _b : 0).value).value;
            const z = this._fnum1.reset(this.x).mul(that.y).sub(this._fnum2.reset(this.y).mul(that.x).value).value;
            result.setTo(x, y, z);
            return result;
        }
        /**
         * 标量乘法: k * this
         * 使用对象池优化
         */
        Times(k) {
            const result = BVec3.get();
            result.x = this._fnum1.reset(this.x).mul(k).value;
            result.y = this._fnum1.reset(this.y).mul(k).value;
            result.z = this._fnum1.reset(this.z).mul(k).value;
            return result;
        }
        /**
         * 标量乘法: this *= k (修改自身)
         * 避免创建新对象
         */
        TimesSelf(k) {
            this.x = this._fnum1.reset(this.x).mul(k).value;
            this.y = this._fnum1.reset(this.y).mul(k).value;
            this.z = this._fnum1.reset(this.z).mul(k).value;
            return this;
        }
        /**
         * 标量除法: this / k
         * 使用对象池优化
         */
        Div(k) {
            if (Math.abs(k) < Number.EPSILON) {
                console.warn("BVec3.Div: Division by near-zero value");
                return BVec3.Zero.Clone();
            }
            const result = BVec3.get();
            result.x = this._fnum1.reset(this.x).div(k).value;
            result.y = this._fnum1.reset(this.y).div(k).value;
            result.z = this._fnum1.reset(this.z).div(k).value;
            return result;
        }
        /**
         * 标量除法: this /= k (修改自身)
         * 避免创建新对象
         */
        DivSelf(k) {
            if (Math.abs(k) < Number.EPSILON) {
                console.warn("BVec3.DivSelf: Division by near-zero value");
                return this;
            }
            this.x = this._fnum1.reset(this.x).div(k).value;
            this.y = this._fnum1.reset(this.y).div(k).value;
            this.z = this._fnum1.reset(this.z).div(k).value;
            return this;
        }
        /**
         * 向量取反: -this
         * 使用对象池优化
         */
        Negate() {
            const result = BVec3.get();
            result.x = -this.x;
            result.y = -this.y;
            result.z = -this.z;
            return result;
        }
        /**
         * 向量取反: this = -this (修改自身)
         * 避免创建新对象
         */
        NegateSelf() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        }
        /**
         * 向量平方长度
         * 优化FNumber使用
         */
        MagSqr() {
            return this.Dot(this);
        }
        /**
         * 向量长度
         * 使用缓存的FNumber计算
         */
        Mag() {
            return Math.sqrt(this.MagSqr());
        }
        /**
         * 向量归一化
         * 使用对象池优化
         */
        Normalized() {
            const mag = this.Mag();
            if (mag < Number.EPSILON) {
                return BVec3.Zero.Clone();
            }
            return this.Div(mag);
        }
        /**
         * 向量归一化: this = this/|this| (修改自身)
         * 避免创建新对象
         */
        NormalizeSelf() {
            const mag = this.Mag();
            if (mag < Number.EPSILON) {
                return this;
            }
            return this.DivSelf(mag);
        }
        /**
         * 获取方位角 (XY平面)
         * 优化FNumber使用
         */
        Azimuth() {
            return this._fnum1.reset().atan2(this.y, this.x).value;
        }
        /**
         * 获取极角 (与Z轴夹角)
         * 优化FNumber使用和计算顺序
         */
        Polar() {
            const xyMag = this._fnum2.reset(this.x).mul(this.x)
                .add(this._fnum3.reset(this.y).mul(this.y).value)
                .sqrt().value;
            return this._fnum1.reset().atan2(xyMag, this.z).value;
        }
        /**
         * 克隆向量
         * 使用对象池优化
         */
        Clone() {
            const result = BVec3.get();
            result.setTo(this.x, this.y, this.z);
            return result;
        }
        /**
         * 转换为LikeVec3接口
         * 避免创建新对象
         */
        ToB3Like() {
            return { x: this.x, y: this.y, z: this.z };
        }
        /**
         * 限制向量长度
         * 使用对象池和优化计算
         */
        Cap(length) {
            if (length <= Number.EPSILON) {
                return BVec3.Zero.Clone();
            }
            const magSqr = this.MagSqr();
            if (magSqr <= length * length) {
                return this.Clone();
            }
            const scale = length / Math.sqrt(magSqr);
            return this.Times(scale);
        }
        /**
         * 限制向量长度 (修改自身)
         * 避免创建新对象
         */
        CapSelf(length) {
            if (length <= Number.EPSILON) {
                this.setTo(0, 0, 0);
                return this;
            }
            const magSqr = this.MagSqr();
            if (magSqr <= length * length) {
                return this;
            }
            const scale = length / Math.sqrt(magSqr);
            return this.TimesSelf(scale);
        }
        /**
         * 向量相等判断
         * 优化条件判断
         */
        Equal(x, y, z) {
            var _a;
            let vx, vy, vz;
            if (typeof (x) == "object") {
                vx = x.x;
                vy = x.y;
                vz = (_a = x.z) !== null && _a !== void 0 ? _a : 0;
            }
            else {
                vx = x !== null && x !== void 0 ? x : 0;
                vy = y !== null && y !== void 0 ? y : 0;
                vz = z !== null && z !== void 0 ? z : 0;
            }
            return this.x === vx && this.y === vy && this.z === vz;
        }
        /**
         * 近似相等判断 (考虑浮点误差)
         */
        ApproxEqual(other, epsilon = 1e-6) {
            var _a;
            return Math.abs(this.x - other.x) < epsilon &&
                Math.abs(this.y - other.y) < epsilon &&
                Math.abs(this.z - ((_a = other.z) !== null && _a !== void 0 ? _a : 0)) < epsilon;
        }
        /**
         * 计算两点距离
         */
        static Distance(a, b) {
            var _a, _b;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dz = ((_a = a.z) !== null && _a !== void 0 ? _a : 0) - ((_b = b.z) !== null && _b !== void 0 ? _b : 0);
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        /**
         * 线性插值
         * 使用对象池优化
         */
        static Lerp(a, b, t) {
            var _a, _b, _c;
            const result = BVec3.get();
            // 直接计算，避免创建中间向量
            result.x = a.x + (b.x - a.x) * t;
            result.y = a.y + (b.y - a.y) * t;
            result.z = ((_a = a.z) !== null && _a !== void 0 ? _a : 0) + (((_b = b.z) !== null && _b !== void 0 ? _b : 0) - ((_c = a.z) !== null && _c !== void 0 ? _c : 0)) * t;
            return result;
        }
        /**
         * 释放FNumber资源
         */
        dispose() {
            // FNumber.put(this._fnum1);
            // FNumber.put(this._fnum2);
            // FNumber.put(this._fnum3);
        }
    }
    // 使用静态对象池减少对象创建
    BVec3._pool = [];
    BVec3._poolSize = 100;
    function bv3(x, y, z) {
        var _a;
        if (x instanceof BVec3) {
            return x.Clone();
        }
        const result = BVec3.get();
        if (typeof (x) == "object") {
            result.setTo(x.x, x.y, (_a = x.z) !== null && _a !== void 0 ? _a : 0);
        }
        else {
            result.setTo(x !== null && x !== void 0 ? x : 0, y !== null && y !== void 0 ? y : 0, z !== null && z !== void 0 ? z : 0);
        }
        return result;
    }
    // export const Project = (v: BVec3, n: BVec3): BVec3 => n.Times(v.Dot(n));

    /**数学计算相关 */
    class BMath {
        // 初始化三角函数表
        static initTrigTables() {
            // 预计算0-360度，每ANGLE_STEP度一个值
            for (let angle = 0; angle < 90; angle += this.ANGLE_STEP_TAN) {
                const rad = angle * this.DEG_TO_RAD;
                // this._sinCache[angle] = Math.sin(rad);
                // this._cosCache[angle] = Math.cos(rad);
                // 对于tan值，我们需要特殊处理90度和270度附近的值
                if (Math.abs(angle % 180 - 90) >= this.ANGLE_STEP_TAN) {
                    const tanValue = Math.tan(rad);
                    this._tanCache[angle] = tanValue;
                    // 添加到有序表中，用于二分查找
                    this._tanTable.push(tanValue);
                    this._angleTable.push(angle);
                }
            }
            // 确保tan表是有序的
            const pairs = this._tanTable.map((value, index) => ({ value, angle: this._angleTable[index] }));
            pairs.sort((a, b) => a.value - b.value);
            // 重建有序表
            this._tanTable.length = 0;
            this._angleTable.length = 0;
            for (const pair of pairs) {
                this._tanTable.push(pair.value);
                this._angleTable.push(pair.angle);
            }
        }
        /**
         * 二分查找最接近的值
         * @param arr 有序数组
         * @param target 目标值
         * @returns 最接近目标值的索引
         */
        static binarySearchNearest(arr, target) {
            if (arr.length === 0)
                return -1;
            if (target <= arr[0])
                return 0;
            if (target >= arr[arr.length - 1])
                return arr.length - 1;
            let low = 0;
            let high = arr.length - 1;
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                if (arr[mid] === target)
                    return mid;
                if (arr[mid] < target) {
                    low = mid + 1;
                }
                else {
                    high = mid - 1;
                }
            }
            // 找到最接近的值
            return (Math.abs(arr[low] - target) < Math.abs(arr[high] - target)) ? low : high;
        }
        /**
         * 使用查表法计算反正切值
         * @param y Y坐标
         * @param x X坐标
         * @returns 角度[0-360)
         */
        static fastAtan2(y, x) {
            // 特殊情况处理
            if (Math.abs(x) < 1e-6) {
                return y >= 0 ? 90 : 270;
            }
            if (Math.abs(y) < 1e-6) {
                return x >= 0 ? 0 : 180;
            }
            // 计算象限
            let quadrant = 0;
            if (x < 0) {
                quadrant = y < 0 ? 3 : 2;
            }
            else {
                quadrant = y < 0 ? 4 : 1;
            }
            // 计算tan值
            const tanValue = y / x;
            if (!this._tanTable || this._tanTable.length === 0) {
                this.initTrigTables();
            }
            // 使用二分查找找到最接近的角度
            const index = this.binarySearchNearest(this._tanTable, Math.abs(tanValue));
            let angle = this._angleTable[index];
            // 根据象限调整角度
            switch (quadrant) {
                case 1: break; // 第一象限，角度不变
                case 2:
                    angle = 180 - angle;
                    break; // 第二象限
                case 3:
                    angle = 180 + angle;
                    break; // 第三象限
                case 4:
                    angle = 360 - angle;
                    break; // 第四象限
            }
            return angle;
        }
        /**
         * 获取角度的正弦值 - 使用缓存优化，无插值
         * @param angle 角度[0-360)
         * @returns 正弦值
         */
        static sin(angle) {
            // 将角度转换到[0,360)范围
            angle = this.convertAngle(angle);
            // 找到最接近的缓存角度
            const cachedAngle = Math.round(angle / this.ANGLE_STEP) * this.ANGLE_STEP % 360;
            // 如果缓存中没有，则计算并缓存
            if (this._sinCache[cachedAngle] === undefined) {
                this._sinCache[cachedAngle] = Math.sin(cachedAngle * this.DEG_TO_RAD);
            }
            return this._sinCache[cachedAngle];
        }
        /**
         * 获取角度的余弦值 - 使用缓存优化，无插值
         * @param angle 角度[0-360)
         * @returns 余弦值
         */
        static cos(angle) {
            // 将角度转换到[0,360)范围
            angle = this.convertAngle(angle);
            // 找到最接近的缓存角度
            const cachedAngle = Math.round(angle / this.ANGLE_STEP) * this.ANGLE_STEP % 360;
            // 如果缓存中没有，则计算并缓存
            if (this._cosCache[cachedAngle] === undefined) {
                this._cosCache[cachedAngle] = Math.cos(cachedAngle * this.DEG_TO_RAD);
            }
            return this._cosCache[cachedAngle];
        }
        /**
         * 获取角度的正切值 - 使用查表优化
         * @param angle 角度[0-360)
         * @returns 正切值
         */
        static tan(angle) {
            // 避免除以零的情况
            const cosValue = this.cos(angle);
            if (Math.abs(cosValue) < 1e-6) {
                return this.sin(angle) > 0 ? 1e6 : -1e6;
            }
            return this.sin(angle) / cosValue;
        }
        /**两点距离 - 优化版本 */
        static distance(pos1, pos2) {
            // 直接使用临时FNumber对象
            const dx = this._fnum1.reset(pos1.x).sub(pos2.x).value;
            const dy = this._fnum2.reset(pos1.y).sub(pos2.y).value;
            // 优化平方和计算
            return this._fnum3.reset(dx).mul(dx).add(this._fnum2.reset(dy).mul(dy).value).sqrt().value;
        }
        /**
         * 角度转弧度 - 使用常量乘法
         * @param angle 角度
         * @returns 弧度
         */
        static angle2radian(angle) {
            return angle * this.DEG_TO_RAD;
        }
        /**
         * 弧度转角度 - 使用常量乘法
         * @param radian 弧度
         * @returns 角度
         */
        static radian2angle(radian) {
            return radian * this.RAD_TO_DEG;
        }
        /**
         * 两点计算弧度 - 优化版本
         * @param pos1 起点
         * @param pos2 终点
         * @returns 弧度
         */
        static getRadianBetweenPos(pos1, pos2) {
            return this.getAngleBetweenPos(pos1, pos2) * this.DEG_TO_RAD;
        }
        /**
         * 两点计算角度 - 优化版本
         * @param pos1 起点
         * @param pos2 终点
         * @returns 角度[0-360)
         */
        static getAngleBetweenPos(pos1, pos2) {
            if (!pos2 || !pos1)
                return 0;
            // 直接使用临时FNumber对象
            const y = this._fnum1.reset(pos2.y).sub(pos1.y).value;
            const x = this._fnum2.reset(pos2.x).sub(pos1.x).value;
            // 使用查表法计算角度
            return this.fastAtan2(y, x);
        }
        /**
         * 将数字转为[0,range)范围内的值 - 优化版本
         * @param value 输入值
         * @param range 范围上限
         * @returns 转换后的值
         */
        static convertToRange(value, range) {
            // 使用更高效的取模算法
            return ((value % range) + range) % range;
        }
        /**
         * 将角度转换为[0,360)范围内的值 - 优化版本
         * @param angle 输入角度
         * @returns 转换后的角度
         */
        static convertAngle(angle) {
            return this.convertToRange(angle, 360);
        }
        /**
         * 判断点是否在扇形中 - 优化版本
         * @param pos 待判断点
         * @param center 扇形中心
         * @param radius 扇形半径
         * @param startAngle 起始角度
         * @param endAngle 结束角度
         * @returns 是否在扇形内
         */
        static isPointInSector(pos, center, radius, startAngle, endAngle) {
            // 快速路径：先检查距离
            const distSqr = this.distanceSqr(pos, center);
            if (distSqr > radius * radius) {
                return false;
            }
            // 计算点相对于中心的角度
            const angle = this.getAngleBetweenPos(center, pos);
            // 优化角度判断
            if (endAngle < startAngle) {
                // 跨越0度的情况
                return (angle >= startAngle || angle <= endAngle);
            }
            else {
                // 不跨越0度的情况
                return (angle >= startAngle && angle <= endAngle);
            }
        }
        /**
         * 获取矩形的四个顶点 - 优化版本
         * @param centerPos 中心点
         * @param width 宽度
         * @param range 高度
         * @returns 四个顶点坐标数组
         */
        static getRectPointsByCenter(centerPos, width, range) {
            // 计算半宽和半高
            const halfWidth = range * 0.5;
            const halfHeight = width * 0.5;
            // 使用临时FNumber对象
            const left = this._fnum1.reset(centerPos.x).sub(halfWidth).value;
            const right = this._fnum2.reset(centerPos.x).add(halfWidth).value;
            const bottom = this._fnum3.reset(centerPos.y).sub(halfHeight).value;
            const top = this._fnum1.reset(centerPos.y).add(halfHeight).value;
            // 创建四个顶点
            return [
                bv3(left, bottom),
                bv3(right, bottom),
                bv3(right, top),
                bv3(left, top)
            ];
        }
        /**
         * 获取矩形的四个顶点 - 优化版本
         * @param oriPos 非中心点
         * @param range 长度
         * @param width 宽度
         * @param angle 角度
         * @returns 四个顶点坐标数组
         */
        static getRectPoints(oriPos, range, width, angle) {
            // 转换角度到[0,360)范围
            angle = this.convertAngle(angle);
            // 使用查表获取正弦和余弦值
            const cosAngle = this.cos(angle);
            const sinAngle = this.sin(angle);
            // 计算长度方向的单位向量
            const vec1 = bv3(cosAngle, sinAngle).TimesSelf(range);
            // 计算宽度方向的单位向量（垂直于长度方向）
            const perpAngle = this.convertAngle(angle + 90);
            const vec2 = bv3(this.cos(perpAngle), this.sin(perpAngle)).TimesSelf(width * 0.5);
            // 计算四个顶点
            const oriVec = BVec3.Temp.setTo(oriPos);
            const pos1 = oriVec.Add(vec2);
            const pos2 = oriVec.Sub(vec2);
            const pos3 = pos2.Add(vec1);
            const pos4 = pos1.Add(vec1);
            return [pos1, pos2, pos3, pos4];
        }
        /**
         * 判断点是否在多边形内 - 优化版本
         * 使用射线法判断点是否在多边形内
         * @param pos 待判断点
         * @param posRect 多边形顶点数组
         * @returns 是否在多边形内
         */
        static isPointInPolygon(pos, posRect) {
            const nCount = posRect.length;
            if (nCount < 3)
                return false;
            let nCross = 0;
            // 使用临时FNumber对象
            const fnum1 = this._fnum1;
            const fnum2 = this._fnum2;
            const fnum3 = this._fnum3;
            for (let i = 0; i < nCount; i++) {
                const p1 = posRect[i];
                const p2 = posRect[(i + 1) % nCount];
                // 快速路径：如果边是水平的，跳过
                if (p1.y === p2.y)
                    continue;
                // 快速路径：如果点在边的Y范围之外，跳过
                if (pos.y < Math.min(p1.y, p2.y) || pos.y > Math.max(p1.y, p2.y))
                    continue;
                // 计算交点的X坐标
                fnum1.reset(pos.y).sub(p1.y);
                fnum2.reset(p2.x).sub(p1.x);
                fnum3.reset(p2.y).sub(p1.y);
                const intersectX = fnum1.mul(fnum2.value).div(fnum3.value).add(p1.x).value;
                // 如果交点在点的右侧，则增加交点计数
                if (intersectX > pos.x) {
                    nCross++;
                }
            }
            // 交点数为奇数，点在多边形内
            return (nCross % 2 === 1);
        }
        /**
         * 将一个值限制在一个指定范围内 - 优化版本
         * @param value 输入值
         * @param min 最小值
         * @param max 最大值
         * @returns 限制后的值
         */
        static clamp(value, min, max) {
            return value < min ? min : (value > max ? max : value);
        }
        /**
         * 计算从点A到点B方向上距离为x的点的坐标 - 优化版本
         * @param A 起点A的坐标
         * @param B 目标点B的坐标
         * @param distance 距离x的值
         * @returns 返回距离点A为x的新点的坐标
         */
        static getPointAtDistance(A, B, distance) {
            // 使用临时FNumber对象
            const dx = this._fnum1.reset(B.x).sub(A.x).value;
            const dy = this._fnum2.reset(B.y).sub(A.y).value;
            // 计算向量长度
            const length = this._fnum3.reset(dx).mul(dx).add(this._fnum1.reset(dy).mul(dy).value).sqrt().value;
            // 避免除以零
            if (length < 1e-6) {
                return bv3(A.x, A.y);
            }
            // 计算单位向量
            const normalizedDx = dx / length;
            const normalizedDy = dy / length;
            // 计算目标点坐标
            const resultX = A.x + normalizedDx * distance;
            const resultY = A.y + normalizedDy * distance;
            return bv3(resultX, resultY);
        }
        /**
         * 线性插值 - 优化版本
         * @param a 起始值
         * @param b 结束值
         * @param t 插值系数[0,1]
         * @returns 插值结果
         */
        static lerp(a, b, t) {
            // 限制t在[0,1]范围内
            t = this.clamp(t, 0, 1);
            return a + (b - a) * t;
        }
        /**
         * 二维向量线性插值 - 优化版本
         * @param a 起始向量
         * @param b 结束向量
         * @param t 插值系数[0,1]
         * @returns 插值结果向量
         */
        static lerpVec(a, b, t) {
            var _a, _b, _c;
            // 限制t在[0,1]范围内
            t = this.clamp(t, 0, 1);
            // 计算插值结果
            const x = a.x + (b.x - a.x) * t;
            const y = a.y + (b.y - a.y) * t;
            const z = ((_a = a.z) !== null && _a !== void 0 ? _a : 0) + (((_b = b.z) !== null && _b !== void 0 ? _b : 0) - ((_c = a.z) !== null && _c !== void 0 ? _c : 0)) * t;
            return bv3(x, y, z);
        }
        /**
         * 计算两点之间的曼哈顿距离 - 优化版本
         * @param a 点A
         * @param b 点B
         * @returns 曼哈顿距离
         */
        static manhattanDistance(a, b) {
            var _a, _b;
            return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(((_a = a.z) !== null && _a !== void 0 ? _a : 0) - ((_b = b.z) !== null && _b !== void 0 ? _b : 0));
        }
        /**
         * 计算两点之间的平方距离 - 优化版本
         * 避免开方操作，用于距离比较
         * @param a 点A
         * @param b 点B
         * @returns 平方距离
         */
        static distanceSqr(a, b) {
            var _a, _b;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dz = ((_a = a.z) !== null && _a !== void 0 ? _a : 0) - ((_b = b.z) !== null && _b !== void 0 ? _b : 0);
            return dx * dx + dy * dy + dz * dz;
        }
        /**
         * 判断点是否在圆内 - 优化版本
         * 使用平方距离避免开方
         * @param point 待判断点
         * @param center 圆心
         * @param radius 半径
         * @returns 是否在圆内
         */
        static isPointInCircle(point, center, radius) {
            return this.distanceSqr(point, center) <= radius * radius;
        }
        /**
         * 判断点是否在矩形内 - 优化版本
         * @param point 待判断点
         * @param rect 矩形四个顶点
         * @returns 是否在矩形内
         */
        static isPointInRect(point, rect) {
            if (rect.length !== 4)
                return false;
            return this.isPointInPolygon(point, rect);
        }
        /**
         * 根据角度获取单位向量 - 使用查表优化
         * @param angle 角度[0-360)
         * @returns 单位向量
         */
        static angleToVector(angle) {
            return bv3(this.cos(angle), this.sin(angle));
        }
        /**
         * 向量转角度 - 优化版本
         * @param vector 向量
         * @returns 角度[0-360)
         */
        static vectorToAngle(vector) {
            return this.getAngleBetweenPos({ x: 0, y: 0 }, vector);
        }
        /**
         * 计算两个角度之间的最小差值 - 优化版本
         * @param a 角度a
         * @param b 角度b
         * @returns 最小角度差[-180,180)
         */
        static angleDifference(a, b) {
            // 将角度转换到[0,360)范围
            a = this.convertAngle(a);
            b = this.convertAngle(b);
            // 计算差值
            let diff = b - a;
            // 调整到[-180,180)范围
            if (diff > 180)
                diff -= 360;
            if (diff <= -180)
                diff += 360;
            return diff;
        }
        /**
         * 角度平滑插值 - 优化版本
         * @param current 当前角度
         * @param target 目标角度
         * @param t 插值系数[0,1]
         * @returns 插值后的角度
         */
        static lerpAngle(current, target, t) {
            // 计算最小角度差
            const diff = this.angleDifference(current, target);
            // 进行线性插值
            return this.convertAngle(current + diff * this.clamp(t, 0, 1));
        }
    }
    // 常量定义 - 避免重复计算
    BMath.TWO_PI = 2 * FNumber.PI;
    BMath.HALF_PI = FNumber.PI / 2;
    BMath.DEG_TO_RAD = FNumber.PI / 180;
    BMath.RAD_TO_DEG = 180 / FNumber.PI;
    // 临时FNumber对象 - 减少GC
    BMath._fnum1 = FNumber.creat();
    BMath._fnum2 = FNumber.creat();
    BMath._fnum3 = FNumber.creat();
    // 角度正弦值和余弦值缓存 - 动态生成
    BMath._sinCache = {};
    BMath._cosCache = {};
    BMath._tanCache = {};
    // 角度精度(度)，值越大精度越低但性能越高
    BMath.ANGLE_STEP = 3;
    BMath.ANGLE_STEP_TAN = 1;
    // 预计算的tan值数组，用于二分查找
    BMath._tanTable = [];
    BMath._angleTable = [];

    class StringUtil {
        /**
         * ";" 分割字符串成数组
         * @param str 字符串
         * @param delimiters 分隔符
         */
        static splitStringToMultiArray(str, delimiters = [","]) {
            return this.splitString(str, delimiters);
        }
        static splitString(str, delimiters = [","]) {
            if (!str) {
                return null;
            }
            if (!delimiters || delimiters.length <= 0) {
                return str;
            }
            let delimiter = delimiters.shift();
            return str.split(delimiter).map((subStr) => {
                return this.splitString(subStr, delimiters.concat());
            });
        }
        /**获取时间字符串（调试用） */
        static getDateString() {
            let d = new Date();
            let str = d.getHours().toString();
            let timeStr = "";
            timeStr += (str.length == 1 ? "0" + str : str) + ":";
            str = d.getMinutes().toString();
            timeStr += (str.length == 1 ? "0" + str : str) + ":";
            str = d.getSeconds().toString();
            timeStr += (str.length == 1 ? "0" + str : str) + ":";
            str = d.getMilliseconds().toString();
            if (str.length == 1)
                str = "00" + str;
            if (str.length == 2)
                str = "0" + str;
            timeStr += str;
            timeStr = "[" + timeStr + "]";
            return timeStr;
        }
    }

    class SkillTarget {
        constructor() {
            this.pos = null;
            this.units = [];
        }
    }

    /**找目标逻辑（单位或者坐标） */
    class BattleSelector {
        /**分组 */
        static OnTargetGroupBy(value, fn) {
            if (BattleSelector._groupByFunc[value]) {
                console.log(`重复注册选人分组函数   类型[${value}]`);
                return;
            }
            BattleSelector._groupByFunc[value] = fn;
        }
        /**排序 */
        static OnTargetSortBy(value, fn) {
            if (BattleSelector._sortByFunc[value]) {
                console.log(`重复注册选人排序函数   类型[${value}]`);
                return;
            }
            BattleSelector._sortByFunc[value] = fn;
        }
        /**
         * 技能找目标逻辑
         * @param unit 找目标发起者
         * @param find 找目标配置id
         * @param oriPos 找目标参考点（可选）
         * @param angle 找目标角度（可选）
         * @returns 返回skilltarget类型，包含单位和坐标，只会有一种结果
         */
        static GetSkillTarget(unit, param, checkFirstBeAttack) {
            let target;
            if (!param.oriPos) {
                param.oriPos = unit.pos;
            }
            let units = BattleSelector.SelectUnit(unit, param, checkFirstBeAttack);
            if (units && units.length > 0) {
                target = new SkillTarget();
                target.units = units.map(unit => unit.uid);
            }
            return target;
        }
        // 找单位逻辑
        static SelectUnit(unit, param, checkFirstBeAttack, forceFind) {
            var _a;
            if (!param.find) {
                return null;
            }
            if (param.find.id == 1) {
                return [unit];
            }
            if (param.find.id == 2) {
                return null;
            }
            if (param.find.rangeType == exports.AreaType.Self) {
                return [unit];
            }
            let resultUnit = [];
            // 找召唤物
            if (param.find.targetCamp == 3) {
                let summonConfigId = NumberUtil.myParseInt(param.find.targetType);
                let summonMap = unit.getSummon(summonConfigId);
                if (summonMap && summonMap.size > 0) {
                    for (const summon of summonMap.values()) {
                        resultUnit.push(summon);
                    }
                }
                return resultUnit;
            }
            if (!param.oriPos) {
                param.oriPos = unit.pos;
            }
            let excludeId = param.excludeId;
            let checkIsControl = false;
            if (!excludeId) {
                excludeId = [];
            }
            let includebuff = [];
            if ((_a = param.find) === null || _a === void 0 ? void 0 : _a.includeBuff) {
                includebuff.push(param.find.includeBuff);
            }
            let bulletTarget = unit.battleMgr.getUnit(param.bulluetTargetUid);
            if (param.find.filterBy) {
                let filterArr = param.find.filterBy.split("#");
                for (let i = 0, leni = filterArr.length; i < leni; i++) {
                    switch (filterArr[i]) {
                        case exports.TargetFilterBy.NoSelf:
                            excludeId.push(unit.uid);
                            break;
                        case exports.TargetFilterBy.NoBulletTarget:
                            if (bulletTarget) {
                                excludeId.push(bulletTarget.uid);
                            }
                            break;
                        case exports.TargetFilterBy.NoControl:
                            checkIsControl = true;
                            break;
                        case exports.TargetFilterBy.HasBulletTarget:
                            if (bulletTarget) {
                                resultUnit.push(bulletTarget);
                                excludeId.push(bulletTarget.uid);
                            }
                            break;
                    }
                }
            }
            let teams;
            if (!param.find.targetCamp) {
                teams = unit.battleMgr.getAllTeams();
            }
            else {
                if (param.find.targetCamp == 1) {
                    teams = [unit.battleMgr.getTeam(unit.teamId)];
                }
                else {
                    teams = unit.battleMgr.getEnmeyTeams(unit.campId);
                }
            }
            let params = StringUtil.splitStringToMultiArray(param.find.rangeParam, ["#"]); // param.find.rangeParam.split("#");
            let range = NumberUtil.myParseInt(params.shift());
            let checkParams = [];
            let checkFn;
            switch (param.find.rangeType) {
                case exports.AreaType.Circle:
                    checkFn = BattleSelector.SelectUnitCircle;
                    break;
                case exports.AreaType.Sector:
                    let checkAngle = FNumber.value(NumberUtil.myParseInt(params.shift())).div(2).value;
                    let startAngle = BMath.convertAngle(FNumber.value(param.angle).sub(checkAngle).value);
                    let endAngle = BMath.convertAngle(FNumber.value(param.angle).add(checkAngle).value);
                    checkParams = [startAngle, endAngle];
                    checkFn = BattleSelector.SelectUnitSector;
                    break;
                case exports.AreaType.Rect:
                    let width = NumberUtil.myParseInt(params.shift());
                    checkParams = BMath.getRectPoints(param.oriPos, range, width, param.angle);
                    checkFn = BattleSelector.SelectUnitRect;
                    break;
            }
            let sortByFn = BattleSelector._sortByFunc[param.find.sortBy];
            if (!sortByFn) {
                sortByFn = BattleSelector._sortByFunc[exports.TargetSortBy.Random];
            }
            let groupByFn = BattleSelector._groupByFunc[param.find.groupBy];
            let selectTypes = StringUtil.splitStringToMultiArray(param.find.targetType, [";", "#"]); // param.find.targetType.split("#");
            param.angle = param.angle ? param.angle : 0;
            let needCount = param.find.targetLimit ? param.find.targetLimit : 999;
            needCount -= resultUnit.length;
            for (let i = 0, leni = selectTypes.length; i < leni; i++) {
                let checkUnits = [];
                for (let j = 0, lenj = selectTypes[i].length; j < lenj; j++) {
                    let units = [];
                    for (let m = 0, lenm = teams.length; m < lenm; m++) {
                        let unitTmps = teams[m].getUnitsByType(NumberUtil.myParseInt(selectTypes[i][j]));
                        if (unitTmps) {
                            units = units.concat(unitTmps);
                        }
                    }
                    // let units: BattleUnit[] = team.getUnitsByType(NumberUtil.myParseInt(selectTypes[i][j]));
                    if (units && units.length > 0) {
                        for (let k = 0, lenk = units.length; k < lenk; k++) {
                            if (units[k].isDie) {
                                continue;
                            }
                            if (units[k].unitData.type == exports.UnitType.Special || units[k].unitData.type == exports.UnitType.Dragon) {
                                continue;
                            }
                            if (!forceFind && units[k].behavior.getNotFind(unit.teamId)) {
                                continue;
                            }
                            if (excludeId.indexOf(units[k].uid) >= 0) {
                                continue;
                            }
                            if (checkIsControl && !units[k].buffComp.checkInControl()) {
                                continue;
                            }
                            if (includebuff && includebuff.length > 0) {
                                let noBuff = false;
                                for (let m = 0, lenm = includebuff.length; m < lenm; m++) {
                                    if (units[k].buffComp.getBuffCountByType(includebuff[m]) <= 0) {
                                        noBuff = true;
                                        break;
                                    }
                                }
                                if (noBuff) {
                                    continue;
                                }
                            }
                            if (param.hitCount && param.hitCount > 0) {
                                let hitCount = unit.skillComp.getSkillHitCount(param.skillGroupId, units[k].uid);
                                if (hitCount >= param.hitCount) {
                                    continue;
                                }
                            }
                            if (!checkFn || (checkFn && checkFn(param.oriPos, units[k], range, param.angle, checkParams))) {
                                if (checkFirstBeAttack && units[k].buffComp.isFirstBeAttack()) {
                                    return [units[k]];
                                }
                                else {
                                    checkUnits.push(units[k]);
                                }
                            }
                        }
                    }
                }
                if (checkUnits.length <= 0) {
                    continue;
                }
                if (groupByFn) {
                    let groupUnits = groupByFn(checkUnits);
                    for (let j = 0, lenj = groupUnits.length; j < lenj; j++) {
                        if (!sortByFn) {
                            checkUnits = groupUnits[j].splice(0, needCount);
                        }
                        else {
                            checkUnits = sortByFn(param.oriPos, groupUnits[j], param.find, needCount, unit.battleMgr.getRandom());
                        }
                        resultUnit = resultUnit.concat(checkUnits);
                        needCount = needCount - checkUnits.length;
                    }
                }
                else {
                    if (!sortByFn) {
                        checkUnits = checkUnits.splice(0, needCount);
                    }
                    else {
                        checkUnits = sortByFn(param.oriPos, checkUnits, param.find, needCount, unit.battleMgr.getRandom());
                    }
                    resultUnit = resultUnit.concat(checkUnits);
                    needCount = needCount - checkUnits.length;
                }
            }
            return resultUnit;
        }
        // 圆形
        static SelectUnitCircle(oriPos, unit, findRange, angle, param) {
            let fixed1 = FNumber.creat(oriPos.x).sub(unit.pos.x);
            let fixed2 = FNumber.value(oriPos.y).sub(unit.pos.y);
            let distance = fixed1.mul(fixed1.value).add(fixed2.mul(fixed2.value).value).sqrt().value;
            return findRange >= distance;
        }
        // 扇形
        static SelectUnitSector(oriPos, unit, findRange, angle, param) {
            return BMath.isPointInSector(unit.pos, oriPos, findRange, param[0], param[1]);
        }
        // 矩形
        static SelectUnitRect(oriPos, unit, findRange, angle, param) {
            return BMath.isPointInPolygon(unit.pos, param);
        }
        // 寻找最近友方
        static findNearFriend() {
            let unit;
            return unit;
        }
    }
    BattleSelector._groupByFunc = new Map();
    BattleSelector._sortByFunc = new Map();

    /**条件检测 */
    class ConditionManager {
        /**注册condition检测函数 */
        static OnConditionCheck(type, fn) {
            if (ConditionManager._conditionFunc[type]) {
                console.log(`重复注册条件检测函数   类型[${type}]`);
                return;
            }
            ConditionManager._conditionFunc[type] = fn;
        }
        static getConditionCheck(type) {
            return ConditionManager._conditionFunc[type];
        }
    }
    ConditionManager._conditionFunc = new Map();

    // 每层buff的信息
    class BuffLayerInfo {
        constructor(owner, config, actorId, skillId, beHitId, extendTime) {
            this._owner = owner;
            this._config = config;
            this._buffId = config.id;
            this._curTime = 0;
            this._interval = 0;
            this._execDelayCount = 0;
            this._removeBaseTime = this._config.time + (extendTime || 0);
            this.refreshRemoveTime();
            this.updateInfo(actorId, skillId, beHitId);
        }
        /**刷新持续时间 */
        refreshRemoveTime() {
            this._removeTime = this._removeBaseTime;
            if ([exports.AbilityEnum.Repel, exports.AbilityEnum.Pull, exports.AbilityEnum.Fear].indexOf(this._config.ability) >= 0 && this._removeTime <= 0) {
                this._removeTime = 100;
            }
            if (this._removeTime > 0) {
                // 增加buff影响的时间
                let timeTmp = this._owner.attrComp.getBuffExtendTime(this._config.id, this._config.buffType);
                this._removeTime += timeTmp;
            }
            this._owner.battleMgr.battleLog(`单位[${this._owner.uid}]的buff[${this._config.id}]持续时间==[${this._removeTime}]`, "BUFF");
        }
        updateInfo(actorId, skillId, beHitId) {
            this._layerParam = { actorId, skillId, count: 1, beHitId };
        }
        updateAbility(ability) {
            this._ability = ability;
        }
        /**重置时间 */
        resetTime() {
            this._curTime = 0;
            this._interval = 0;
        }
        /**刷新 */
        update(dt) {
            this.subTime(dt);
            this.subInterval(dt);
        }
        /**更新执行时间 */
        subInterval(dt) {
            if (this._config.execInterval > 0) {
                this._interval = FNumber.value(this._interval).add(dt).value;
                if (this._interval >= this._config.execInterval) {
                    this._interval = FNumber.value(this._interval).sub(this._config.execInterval).value;
                    this._execDelayCount++;
                }
            }
        }
        /**更新存活时间 */
        subTime(dt) {
            this._curTime = FNumber.value(this._curTime).add(dt).value;
        }
        /**增加buff时间 */
        addTime(time) {
            this._curTime = FNumber.value(this._curTime).sub(time).value;
            // this._curTime = Math.max(0, this._curTime);
        }
        /**结算次数 */
        settlement(count) {
            let countTmp = 0;
            if (this._config.execInterval > 0) {
                let leftCount = Math.floor(FNumber.value(this._interval).add(this._removeTime).sub(this._curTime).div(this._config.execInterval).value);
                if (leftCount > 0) {
                    countTmp = Math.min(count, leftCount);
                    let subTime = FNumber.value(this._config.execInterval).mul(countTmp).value;
                    this._curTime = FNumber.value(this._curTime).add(subTime).sub(this._interval).value;
                    this._interval = 0;
                }
            }
            return countTmp;
        }
        /**是否有效 */
        getIsValid() {
            if (this._config.withActor == 1 && !this._owner.battleMgr.getUnit(this._layerParam.actorId)) {
                return false;
            }
            if (this._removeTime > 0) {
                return this._curTime < this._removeTime;
            }
            else {
                return true;
            }
        }
        /**获取是否要执行 */
        getExecCount() {
            let countTmp = this._execDelayCount;
            this._execDelayCount = 0;
            return countTmp;
        }
        /**获取剩余可执行次数 */
        getExecLeftCount() {
            return this._execDelayCount;
        }
        /**获取ability */
        getAbility() {
            return this._ability;
        }
        /**获取层数信息 */
        getLayerParam() {
            return this._layerParam;
        }
    }

    class BattleBuff {
        constructor() {
            this._conditionTrigger = false; // 时机触发
            this._timeTrigger = false; // 时间触发
            this._buffTrigger = false; // 是否通过buff触发(206类型触发)
            this._isTrigger = false;
            this.conditionValues = {}; // 条件缓存
        }
        initBuff(owner, config, buffTrigger = false) {
            this._owner = owner;
            this._config = config;
            // let isDieBuff: boolean = false;
            if (this._config.trigger) {
                this._triggers = [];
                let arr = this._config.trigger.split("#");
                for (let i = 0, leni = arr.length; i < leni; i++) {
                    this._triggers.push(NumberUtil.myParseInt(arr[i]));
                    // if (this._triggers[i] == TriggerEnum.Die) {
                    //     isDieBuff = true;
                    // }
                }
            }
            else {
                this._triggers = null;
            }
            this._ability = {};
            this._layers = [];
            this._bindSkillId = [];
            this._triggerCount = 0;
            // this._triggerCountLimit = this._config.removeTriggerCount ? this._config.removeTriggerCount : isDieBuff ? 1 : 0;
            this._triggerCountLimit = this._config.removeTriggerCount ? this._config.removeTriggerCount : 0;
            this._conditionTrigger = !!this._config.trigger;
            this._timeTrigger = !!this._config.execInterval;
            this._buffTrigger = buffTrigger;
            this._isTrigger = this._conditionTrigger || this._timeTrigger || this._buffTrigger;
            this.onInit();
        }
        update(dt) {
            this.updateBuffTime(dt);
            this.onUpdate(dt);
            // //检测移除
            // if (this._triggerCountUpdate) {
            //     this._triggerCountUpdate = false;
            //     this.checkRemove(TriggerEnum.Trigger, null);
            // }
        }
        updateBuffTime(dt) {
            let removeIndex = [];
            let param;
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._layers[i].update(dt);
                let execCount = this._layers[i].getExecCount();
                if (execCount && execCount > 0) {
                    if (!param) {
                        param = { buffLayerIndex: [] };
                    }
                    for (let j = 0; j < execCount; j++) {
                        param.buffLayerIndex.push(i);
                    }
                }
                if (!this._layers[i].getIsValid()) {
                    removeIndex.push(i);
                }
            }
            if (param) {
                this.enterTrigger(null, param, null);
            }
            if (removeIndex.length > 0) {
                this._owner.battleMgr.battleLog(`[${this._owner.uid}]减少buff层数[${this._config.id}],减少层数${removeIndex.length},减少方式=>时间到了`, "BUFF");
                this._layers = this._layers.filter((value, index) => {
                    return !(removeIndex.indexOf(index) >= 0);
                });
                if (this._layers.length <= 0) {
                    this._owner.buffComp.removeBuff(this._config.id, exports.BuffRemoveType.Time);
                }
                else {
                    // if (this._needUpdate) {
                    //     this._needUpdate = false;
                    //     this.updateAbility();
                    // }
                    if (removeIndex.length > 0) {
                        this.updateAbility();
                    }
                }
            }
        }
        getConfig() {
            return this._config;
        }
        /**添加 */
        add(actorId, skillId, addCount, beHitId, addParam, extendTime) {
            let preCount = this.getCount();
            if (this._bindSkillId.indexOf(skillId) < 0) {
                this._bindSkillId.push(skillId);
            }
            this._addSkillId = skillId;
            this._actorId = actorId;
            let isAdd = this._layers.length == 0;
            if (this._config.overlap == exports.BuffOverlap.ResetTime) {
                if (isAdd) {
                    this._layers.push(new BuffLayerInfo(this._owner, this._config, actorId, skillId, beHitId, extendTime));
                }
                this._layers[0].resetTime();
                this._layers[0].updateInfo(actorId, skillId, beHitId);
                this.updateLayerAbility(0, addParam);
            }
            else {
                if (this._config.overlap == exports.BuffOverlap.StackTriggerCount) {
                    // 叠加触发次数上限
                    if (isAdd) {
                        this._layers.push(new BuffLayerInfo(this._owner, this._config, actorId, skillId, beHitId, extendTime));
                        this.updateLayerAbility(this._layers.length - 1, addParam);
                        this._triggerCountLimit = this._config.removeTriggerCount * addCount;
                    }
                    else {
                        this._triggerCountLimit += this._config.removeTriggerCount * addCount;
                    }
                    // 检测buff类型上限
                    let buffTypeInfo = battle.config.getBuffType(this._config.buffType);
                    if (buffTypeInfo && buffTypeInfo.overlapLimit > 0) {
                        let overlimit = buffTypeInfo.overlapLimit;
                        //加上buff改变的上限
                        overlimit += this._owner.attrComp.getBuffOverlimit(this._config.buffType);
                        overlimit = this._config.removeTriggerCount * overlimit;
                        this._triggerCountLimit = Math.min(this._triggerCountLimit, overlimit);
                    }
                }
                else {
                    if (!isAdd && this._config.overlap == exports.BuffOverlap.StackAbility) {
                        this.stackAbility(actorId, skillId, addCount, beHitId, addParam);
                        return;
                    }
                    if (this._config.overlap == exports.BuffOverlap.SameTime) {
                        for (let i = 0, leni = this._layers.length; i < leni; i++) {
                            this._layers[i].resetTime();
                        }
                    }
                    for (let i = 0; i < addCount; i++) {
                        this._layers.push(new BuffLayerInfo(this._owner, this._config, actorId, skillId, beHitId, extendTime));
                        this.updateLayerAbility(this._layers.length - 1, addParam);
                    }
                }
            }
            if (isAdd) {
                this._triggerCount = 0;
                this.onAdd();
            }
            if (!this._config.trigger && this._config.triggerCondition) {
                this.enterTrigger(null, null, null);
            }
            // 刷新属性
            // this._needUpdate = true;
            this.updateAbility();
            if (preCount != this.getCount()) {
                this._owner.battleMgr.addRecord(exports.BattleRecordDataType.BuffUpdateCount, { uid: this._owner.uid, buff: { buffId: this._config.id, updateCount: { count: this.getCount() } } });
            }
            return addCount;
        }
        /**
         * 减少层数
         * @param count 需要减少的层数
         * @returns 实际减少的层数
         */
        delCount(count) {
            if (this._config.notRemove == 1) {
                return;
            }
            let preCount = this.getCount();
            let removeCount = Math.min(count, this._layers.length);
            this._layers.splice(0, removeCount);
            if (this._layers.length <= 0) {
                this._owner.buffComp.removeBuff(this._config.id, exports.BuffRemoveType.Del);
            }
            else {
                // this._needUpdate = true;
                this.updateAbility();
                if (preCount != this.getCount()) {
                    this._owner.battleMgr.addRecord(exports.BattleRecordDataType.BuffUpdateCount, { uid: this._owner.uid, buff: { buffId: this._config.id, updateCount: { count: this.getCount() } } });
                }
            }
            if (removeCount > 0) {
                this._owner.battleMgr.battleLog(`[${this._owner.uid}]减少buff[${this._config.id}],减少层数${removeCount},减少方式=>被删除`, "BUFF");
            }
            return removeCount;
        }
        /**移除 */
        remove() {
            // 移除
            this.onRemove();
        }
        /**重置buff时间 */
        resetTime() {
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._layers[i].resetTime();
            }
        }
        /**增加buff持续时间 */
        addTime(time) {
            if (!time) {
                return;
            }
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._layers[i].addTime(time);
            }
        }
        /**增加buff持续时间 */
        refreshRemoveTime() {
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._layers[i].refreshRemoveTime();
            }
        }
        /**获取当前层数 */
        getCount() {
            return this._layers.length;
        }
        /**获取首次添加技能来源id */
        getAddSkillId() {
            return this._addSkillId;
        }
        /**获取首次添加单位来源id */
        getActorId() {
            return this._actorId;
        }
        /**检测触发 */
        checkTrigger(type, conditionParam, abilityParam, inResult) {
            if (!this._triggers || this._triggers.indexOf(type) < 0) {
                return null;
            }
            return this.enterTrigger(conditionParam, abilityParam, inResult);
        }
        /**进入触发 */
        enterTrigger(conditionParam, abilityParam, inResult) {
            let doCount = this.checkCondition(this._config.triggerCondition, conditionParam);
            if (doCount <= 0) {
                return null;
            }
            let doCount2 = this.checkCondition(this._config.execCondition, conditionParam);
            if (doCount2 <= 0) {
                return null;
            }
            doCount = Math.max(doCount, doCount2);
            if (this.checkRate()) {
                if (!abilityParam) {
                    abilityParam = {};
                }
                abilityParam.doCount = doCount;
                if (conditionParam && conditionParam.skillId) {
                    abilityParam.skill = battle.config.getSkill(conditionParam.skillId); //this._owner.skillComp.getSkill(conditionParam.skillId)?.config;
                }
                else {
                    abilityParam.skill = battle.config.getSkill(this._addSkillId); //this._owner.skillComp.getSkill(this._addSkillId)?.config;
                }
                return this.doAbility(abilityParam, inResult);
            }
            else {
                return null;
            }
        }
        /**获取触发概率 */
        getRate() {
            // 如果有修改器并且修改器类型是修改概率
            if (this._config.modify) {
                let buffModify = battle.config.getBuffModify(this._config.modify);
                if (buffModify.type == exports.BuffModifyType.Rate) {
                    let doCount = this.checkCondition(buffModify.condition, null);
                    let percent = NumberUtil.myParseInt(buffModify.param1);
                    return FNumber.value(doCount).mul(percent).add(this._config.rate).value;
                }
            }
            return this._config.rate;
        }
        /**判断概率 */
        checkRate() {
            let randomTmp = this._owner.battleMgr.getRandom().randomInt(10000, 0);
            let checkRate = this.getRate();
            if (randomTmp <= checkRate) {
                return true;
            }
            else {
                return false;
            }
        }
        /**检测buff条件 */
        checkCondition(conditions, conditionParam) {
            let doCount = 0;
            if (conditions) {
                //触发条件有两种链接方式 &:需要满足所有条件  |:满足任一条件
                let isAnd = conditions.indexOf("&") >= 0;
                let triggerConfigs;
                if (!conditionParam) {
                    conditionParam = {};
                }
                conditionParam.checkSkillId = this._bindSkillId;
                let condition;
                if (isAnd) {
                    triggerConfigs = conditions.split("&");
                    for (let j = 0, lenj = triggerConfigs.length; j < lenj; j++) {
                        condition = battle.config.getCondition(NumberUtil.myParseInt(triggerConfigs[j]));
                        if (!condition) {
                            console.error(`条件id获取不到配置===${triggerConfigs[j]}`);
                            return 0;
                        }
                        let func = ConditionManager.getConditionCheck(condition.type);
                        if (func) {
                            let doCountTmp = func(this, condition, conditionParam);
                            if (doCountTmp > 0) {
                                if (doCount > 0) {
                                    doCount = Math.max(doCount, doCountTmp);
                                }
                                else {
                                    doCount = doCountTmp;
                                }
                            }
                            else {
                                return 0;
                            }
                        }
                        else {
                            return 0;
                        }
                    }
                }
                else {
                    triggerConfigs = conditions.split("|");
                    for (let j = 0, lenj = triggerConfigs.length; j < lenj; j++) {
                        condition = battle.config.getCondition(NumberUtil.myParseInt(triggerConfigs[j]));
                        if (!condition) {
                            console.error(`条件id获取不到配置===${triggerConfigs[j]}`);
                            return 0;
                        }
                        let func = ConditionManager.getConditionCheck(condition.type);
                        if (func) {
                            let doCountTmp = func(this, condition, conditionParam);
                            if (doCountTmp > 0) {
                                doCount = Math.max(doCount, doCountTmp);
                                break;
                            }
                        }
                    }
                }
            }
            else {
                doCount = 1;
            }
            return doCount;
        }
        /**执行效果 */
        doAbility(param, inResult) {
            if (!param) {
                return null;
            }
            // this._triggerCountUpdate = true;
            this._triggerCount++;
            if (this._triggers && this._triggers.indexOf(exports.TriggerEnum.BuffTriggerCount) < 0 && this._config.ability >= 200 && this._config.ability < exports.AbilityEnum.ChangeAtrStart) {
                this.getOwner().buffComp.recordTriggerBuffCount(this._config.id, this._config.buffType, 1);
            }
            if (!param.actorUid) {
                param.actorUid = this._owner.uid;
            }
            this._owner.battleMgr.battleLog(`[${this._owner.uid}]触发buff[${this._config.id}],buff效果`, "BUFF");
            let rtn = this.exec(param, inResult);
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.BuffExec, { uid: this._owner.uid, buff: { buffId: this._config.id, exec: { extraParam: this.getExtraParam() } } });
            // buff触发后
            if (this._config.buffType == exports.BuffType.Block) {
                this._owner.buffComp.triggerBuff(exports.TriggerEnum.BlockTrigger, null, null, null);
            }
            // if (this._config.remove == TriggerEnum.TriggerRemove) {
            //     this.checkRemove(TriggerEnum.TriggerRemove, null);
            // }
            if (this._triggerCountLimit > 0 && this._triggerCount >= this._triggerCountLimit) {
                if (this._config.removeCount > 0) {
                    this.delCount(this._config.removeCount);
                }
                else {
                    this._owner.buffComp.removeBuff(this._config.id, exports.BuffRemoveType.Del);
                }
            }
            return rtn;
            // if (this._config.target && this._config.target != "1") {
            //     // buff找人
            //     let findIds: string[] = this._config.target.split('#');
            //     for (let j: number = 0, lenj: number = findIds.length; j < lenj; j++) {
            //         let find: findTarget = battle.config.getFindTarget(parseInt(findIds[j]));
            //         let targets: BattleUnit[] = BattleSelector.SelectUnit(this._owner, find, this._owner.pos);
            //         if (targets) {
            //             for (let i: number = 0, leni: number = targets.length; i < leni; i++) {
            //                 param.target = targets[i];
            //                 this.exec(param, inResult);
            //             }
            //         } else {
            //             param.target = param.behit;
            //             this.exec(param, inResult);
            //         }
            //     }
            // } else {
            //     param.target = this._owner;
            //     return this.exec(param, inResult);
            // }
            // let func: BuffAbilityExec = BuffManager.getAbilityExec(this._config.ability);
            // if (func) {
            //     if (!param.actor) {
            //         param.actor = this._owner;
            //     }
            //     param.buffConfig = this.getConfig();
            //     if (this._config.target) {
            //         // buff找人
            //         let findIds: string[] = this._config.target.split('#');
            //         for (let j: number = 0, lenj: number = findIds.length; j < lenj; j++) {
            //             let find: findTarget = battle.config.getFindTarget(parseInt(findIds[j]));
            //             let targets: BattleUnit[] = BattleSelector.SelectUnit(this._owner, find, this._owner.pos);
            //             if (targets) {
            //                 for (let i: number = 0, leni: number = targets.length; i < leni; i++) {
            //                     param.target = targets[i];
            //                     func(param, inResult);
            //                 }
            //             } else {
            //                 param.target = param.behit;
            //                 func(param, inResult);
            //             }
            //         }
            //     } else {
            //         param.target = param.behit;
            //         func(param, inResult);
            //     }
            //     return null;
            // } else {
            //     return this._ability;
            // }
        }
        // /**检测移除 */
        // checkRemove(type: TriggerEnum, conditionParam: BattleConditionParam) {
        //     if (!this._config.remove || this._config.remove != type) {
        //         return;
        //     }
        //     let doCount: number = this.checkCondition(this._config.removeCondition, conditionParam);
        //     if (doCount <= 0) {
        //         return;
        //     }
        //     this._owner.buffComp.removeBuff(this._config.id);
        // }
        /**设置效果值 */
        setAbility(value) {
            this._ability = value;
        }
        /**获取效果值 */
        getAbility() {
            return this._ability;
        }
        /**减少血量记录 */
        recordHpSub(value1, value2) {
            if (value1 > 0) {
                //记录扣血万分比
                let subPercent = this._owner.attrComp.converHpToPercent(value1);
                this._hpSub1 = FNumber.value(this._hpSub1).add(subPercent).value;
            }
            if (value2 > 0) {
                //记录扣血固定值
                this._hpSub2 = FNumber.value(this._hpSub2).add(value2).value;
            }
        }
        /**
         * 减少血量扣除记录
         * @param value1 万分比
         * @param value2 固定值
         */
        delRecordHpSub(value1, value2) {
            if (value1 > 0) {
                this._hpSub1 = FNumber.value(this._hpSub1).sub(value1).value;
            }
            if (value2 > 0) {
                this._hpSub2 = FNumber.value(this._hpSub2).sub(value2).value;
            }
        }
        getHpSub1() {
            return this._hpSub1;
        }
        getHpSub2() {
            return this._hpSub2;
        }
        /**
         * 获取父单位
         */
        getOwner() {
            return this._owner;
        }
        /**buff执行目标 */
        findExecTarget(param, findId, addActorId) {
            if (param && param["targetUid"]) {
                let unitTmp = this._owner.battleMgr.getUnit(param["targetUid"]);
                if (unitTmp) {
                    return [unitTmp];
                }
            }
            let units = [];
            if (!findId) {
                findId = this._config.target;
            }
            if (findId) {
                // buff找人
                switch (findId) {
                    case "0":
                        // buff拥有者
                        // units.push(this._owner);
                        break;
                    case "1":
                        // buff拥有者
                        units.push(this._owner);
                        break;
                    case "2":
                        // 本次受击者
                        if (param && param.beHitUid) {
                            let unitTmp = this._owner.battleMgr.getUnit(param.beHitUid);
                            unitTmp && units.push(unitTmp);
                        }
                        break;
                    case "3":
                        // buff施加者
                        let unitTmp;
                        if (addActorId) {
                            unitTmp = this._owner.battleMgr.getUnit(addActorId);
                        }
                        else {
                            unitTmp = this._owner.battleMgr.getUnit(this._actorId);
                        }
                        unitTmp && units.push(unitTmp);
                        break;
                    case "4":
                        // 本次施法者
                        if (param && param.actorUid) {
                            let unitTmp = this._owner.battleMgr.getUnit(param.actorUid);
                            unitTmp && units.push(unitTmp);
                        }
                        break;
                    case "5":
                        // 召唤物父单位
                        let parent = this._owner.getParent();
                        if (parent && !parent.isDie) {
                            units.push(parent);
                        }
                        break;
                    default:
                        let findIds = findId.split('#');
                        let forceFind = (this._triggers && this._triggers.indexOf(exports.TriggerEnum.StartFight) >= 0);
                        for (let j = 0, lenj = findIds.length; j < lenj; j++) {
                            let find = battle.config.getFindTarget(NumberUtil.myParseInt(findIds[j]));
                            if (find) {
                                let targets = BattleSelector.SelectUnit(this._owner, { find: find, oriPos: this._owner.pos }, false, forceFind);
                                if (targets) {
                                    units.push(...targets);
                                }
                            }
                        }
                        break;
                }
            }
            else {
                units = [this._owner];
            }
            return units;
        }
        /**获取buff触发次数 */
        getTriggerCount() {
            return this._triggerCount;
        }
        /**刷新buff加成 */
        updateAbilityForce() {
            this.updateAbility();
        }
        /**-----------------------------子类实现方法------------------ */
        /**初始化 */
        onInit() {
        }
        /**下一波或者战斗结束，尝试清理 */
        tryClear() {
        }
        onUpdate(dt) {
        }
        /**添加 */
        onAdd() {
        }
        /**移除 */
        onRemove() {
            // 处理衍生buff
            if (this._config.derive && this._config.deriveFollowRemove == 1) {
                this._owner.buffComp.removeBuff(this._config.derive, exports.BuffRemoveType.None);
            }
        }
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
        }
        /**刷新buff加成 */
        updateAbility() {
        }
        /**叠加效果 */
        stackAbility(actorId, skillId, addCount, beHitId, addParam) {
        }
        /**执行buff效果 */
        exec(param, inResult) {
            return this._ability;
        }
        /**刷新行为 */
        refreshBehavior() {
        }
        /**扣除效果值 */
        subAbility(value) {
            return { subAbility: value };
        }
        settlement(count) {
            // let countTmp: number = count;
            // for (let i: number = 0, leni: number = this._layers.length; i < leni; i++) {
            //     if (countTmp <= 0) {
            //         break;
            //     }
            //     countTmp = this._layers[i].settlement(countTmp);
            // }
            // this.updateBuffTime(0);
            return 0;
        }
        /**用于获取一些特殊buff的额外参数 */
        getExtraParam() {
            return null;
        }
        /**常态buff还是触发buff */
        isTriggerBuff() {
            return this._isTrigger;
        }
    }

    class ObjectUtil {
        /**
         * 获取数据类型
         * @param o
         * @returns
         */
        static getType(o) {
            var s = Object.prototype.toString.call(o);
            return s.match(/\[object (.*?)\]/)[1].toLowerCase();
        }
        /**
         * 深度拷贝
         * @param data
         * @returns
         */
        static deepClone(data) {
            let type = this.getType(data);
            let obj;
            if (type === 'array') {
                obj = [];
            }
            else if (type === 'object') {
                obj = {};
            }
            else {
                //不再具有下一层次
                return data;
            }
            if (type === 'array') {
                for (let i = 0, len = data.length; i < len; i++) {
                    obj.push(this.deepClone(data[i]));
                }
            }
            else if (type === 'object') {
                for (let key in data) {
                    obj[key] = this.deepClone(data[key]);
                }
            }
            return obj;
        }
        /**
         * 合并多个对象
         * @param target 目标对象，合并后结果会存储在该对象中
         * @param sources 要合并的源对象列表
         * @returns 合并后的目标对象
         */
        static mergeKVnumber(target, ...sources) {
            if (!sources.length)
                return target;
            const source = sources.shift();
            if (typeof target === 'object' && target !== null && typeof source === 'object' && source !== null) {
                for (const key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        const sourceValue = source[key];
                        if (typeof sourceValue === 'number') {
                            if (target.hasOwnProperty(key)) {
                                target[key] += sourceValue; // 若目标对象已有该键，累加值
                            }
                            else {
                                target[key] = sourceValue; // 若目标对象没有该键，直接赋值
                            }
                        }
                    }
                }
            }
            return this.mergeKVnumber(target, ...sources);
        }
        /**刷新数值 */
        static updateKVnumberValue(obj, type, value, cover) {
            cover ? (obj[type] = value) : (obj[type] = FNumber.value(value).add(this.getKVnumberValue(obj, type)).value);
        }
        static getKVnumberValue(obj, type) {
            return obj[type] || 0;
        }
        /**
         * 将数字记录中的所有值按指定倍率计算，保持键不变
         * @param record 输入的数字记录
         * @param multiplier 倍率值（默认为2）
         * @returns 返回一个新的记录，其中的值都乘以了倍率
         */
        static multiplyRecord(record, multiplier = 2) {
            const result = {};
            Object.keys(record).forEach(key => {
                result[Number(key)] = record[Number(key)] * multiplier;
            });
            return result;
        }
    }

    /**属性buff */
    class BattleBuff1000 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            let ability = { addAtr: {} };
            let atrType = this._config.ability - exports.AbilityEnum.ChangeAtrStart;
            let atrValue = NumberUtil.myParseInt(this._config.param3);
            if (!atrValue) {
                atrValue = NumberUtil.myParseInt(this._config.param1);
            }
            if (!atrValue) {
                atrValue = NumberUtil.myParseInt(addParam.attrValue);
            }
            if (this._config.param4 == "1") {
                atrValue = 0 - atrValue;
            }
            ObjectUtil.updateKVnumberValue(ability.addAtr, atrType, atrValue, true);
            this._layers[index].updateAbility(ability);
        }
        updateAbility() {
            let atrType = this._config.ability - exports.AbilityEnum.ChangeAtrStart;
            let preValue = 0;
            if (this._ability && this._ability.addAtr) {
                preValue = ObjectUtil.getKVnumberValue(this._ability.addAtr, atrType);
            }
            else {
                this._ability = { addAtr: {} };
            }
            let atrValue = 0;
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                atrValue += ObjectUtil.getKVnumberValue(this._layers[i].getAbility().addAtr, atrType);
            }
            ObjectUtil.updateKVnumberValue(this._ability.addAtr, atrType, atrValue, true);
            if (!this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateModifyAttr(atrType, atrValue - preValue);
            }
        }
        onRemove() {
            super.onRemove();
            let atrType = this._config.ability - exports.AbilityEnum.ChangeAtrStart;
            let preValue = 0;
            if (this._ability && this._ability.addAtr) {
                preValue = ObjectUtil.getKVnumberValue(this._ability.addAtr, atrType);
            }
            if (preValue != 0 && !this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateModifyAttr(atrType, -preValue);
            }
        }
        exec(param, inResult) {
            if (param.doCount && param.doCount > 0) {
                return {
                    addAtr: ObjectUtil.multiplyRecord(this._ability.addAtr, param.doCount)
                };
            }
            else {
                return super.exec(param, inResult);
            }
        }
    }

    class BuffFactory {
        static registerBuffCls(ability, cls) {
            this._buffCls[ability] = cls;
        }
        static creatBuff(ability) {
            if (ability > exports.AbilityEnum.ChangeAtrStart && ability < exports.AbilityEnum.ChangeAtrEnd) {
                return new BattleBuff1000();
            }
            else {
                if (this._buffCls[ability]) {
                    return new this._buffCls[ability]();
                }
                else {
                    return new BattleBuff();
                }
            }
        }
    }
    BuffFactory._buffCls = {};

    class BattleCommon {
        /**合并buff效果 */
        static MergeBuffAbilityReturn(ability1, ability2) {
            if (!ability1) {
                ability1 = {};
            }
            if (!ability2) {
                return ability1;
            }
            if (ability2.addAtr) {
                if (ability1.addAtr) {
                    ObjectUtil.mergeKVnumber(ability1.addAtr, ability2.addAtr);
                }
                else {
                    ability1.addAtr = ability2.addAtr;
                }
            }
            if (ability2.damageAddParam) {
                if (ability1.damageAddParam) {
                    ability1.damageAddParam.damageAdd1 = NumberUtil.myParseInt(ability1.damageAddParam.damageAdd1) + NumberUtil.myParseInt(ability2.damageAddParam.damageAdd1);
                    ability1.damageAddParam.damageAdd2 = NumberUtil.myParseInt(ability1.damageAddParam.damageAdd2) + NumberUtil.myParseInt(ability2.damageAddParam.damageAdd2);
                    ability1.damageAddParam.damageAdd3 = NumberUtil.myParseInt(ability1.damageAddParam.damageAdd3) + NumberUtil.myParseInt(ability2.damageAddParam.damageAdd3);
                    ability1.damageAddParam.damageAdd4 = NumberUtil.myParseInt(ability1.damageAddParam.damageAdd4) + NumberUtil.myParseInt(ability2.damageAddParam.damageAdd4);
                    ability1.damageAddParam.damageReduce1 = NumberUtil.myParseInt(ability1.damageAddParam.damageReduce1) + NumberUtil.myParseInt(ability2.damageAddParam.damageReduce1);
                    ability1.damageAddParam.damageReduce2 = NumberUtil.myParseInt(ability1.damageAddParam.damageReduce2) + NumberUtil.myParseInt(ability2.damageAddParam.damageReduce2);
                    ability1.damageAddParam.damageReduce3 = NumberUtil.myParseInt(ability1.damageAddParam.damageReduce3) + NumberUtil.myParseInt(ability2.damageAddParam.damageReduce3);
                }
                else {
                    ability1.damageAddParam = ability2.damageAddParam;
                }
            }
            if (ability2.critPer) {
                ability1.critPer = (ability1.critPer || 0) + ability2.critPer;
            }
            if (ability2.critConst) {
                ability1.critConst = (ability1.critConst || 0) + ability2.critConst;
            }
            if (ability2.critReducePer) {
                ability1.critReducePer = (ability1.critReducePer || 0) + ability2.critReducePer;
            }
            if (ability2.critReduceConst) {
                ability1.critReduceConst = (ability1.critReduceConst || 0) + ability2.critReduceConst;
            }
            if (ability2.leech) {
                ability1.leech = (ability1.leech || 0) + ability2.leech;
            }
            if (ability2.damageReturn1) {
                ability1.damageReturn1 = (ability1.damageReturn1 || 0) + ability2.damageReturn1;
            }
            if (ability2.realSkillId) {
                ability1.realSkillId = ability2.realSkillId;
            }
            if (ability2.addCount) {
                ability1.addCount = ability2.addCount;
            }
            if (ability2.skillFind1) {
                ability1.skillFind1 = ability2.skillFind1;
            }
            if (ability2.skillFind2) {
                ability1.skillFind2 = ability2.skillFind2;
            }
            if (ability2.skillFind3) {
                ability1.skillFind3 = ability2.skillFind3;
            }
            if (ability2.mustCrit) {
                ability1.mustCrit = ability1.mustCrit || ability2.mustCrit;
            }
            if (ability2.mustHit) {
                ability1.mustHit = ability1.mustHit || ability2.mustHit;
            }
            if (ability2.lockHp) {
                ability1.lockHp = ability1.lockHp || ability2.lockHp;
            }
            if (ability2.realCure) {
                ability1.realCure = ability1.realCure || ability2.realCure;
            }
            if (ability2.ignoreShield) {
                ability1.ignoreShield = ability1.ignoreShield || ability2.ignoreShield;
            }
            if (ability2.bulletDivision) {
                ability1.bulletDivision = ability1.bulletDivision || ability2.bulletDivision;
            }
            if (ability2.buffExtendTime) {
                ability1.buffExtendTime = (ability1.buffExtendTime || 0) + ability2.buffExtendTime;
            }
            if (ability2.sharedPer) {
                ability1.sharedPer = (ability1.sharedPer || 0) + ability2.sharedPer;
            }
            if (ability2.storageCure) {
                ability1.storageCure = (ability1.storageCure || 0) + ability2.storageCure;
            }
            if (ability2.immunityBuffType) {
                if (ability1.immunityBuffType) {
                    ability1.immunityBuffType = ObjectUtil.mergeKVnumber(ability1.immunityBuffType, ability2.immunityBuffType);
                }
                else {
                    ability1.immunityBuffType = ability2.immunityBuffType;
                }
            }
            if (ability2.immunityBuffAbility) {
                if (ability1.immunityBuffAbility) {
                    ability1.immunityBuffAbility = ObjectUtil.mergeKVnumber(ability1.immunityBuffAbility, ability2.immunityBuffAbility);
                }
                else {
                    ability1.immunityBuffAbility = ability2.immunityBuffAbility;
                }
            }
            return ability1;
        }
        ;
        // static getUnitInfo(unit: BattleUnit, keys: string[]): number {
        //     let infoValue: number = 0;
        //     switch (keys[1]) {
        //         case "atr":
        //             let atrType: number = NumberUtil.myParseInt(keys[2]);
        //             infoValue = unit.attrComp.getAtrValue(atrType);
        //             break;
        //     }
        //     return infoValue;
        // }
        /**计算闪避 */
        static calcHit(random, attacker, hiter) {
            let checkHit = BMath.clamp(attacker - hiter, 3000, 10000);
            let randomTmp = random.randomInt(0, BattleCommon.AttributeMultiplying);
            return randomTmp <= checkHit;
        }
        /**计算暴击 */
        static calcCrit(random, attacker, hiter) {
            let checkHit = BMath.clamp(attacker - hiter, 0, 10000);
            let randomTmp = random.randomInt(0, BattleCommon.AttributeMultiplying);
            return randomTmp <= checkHit;
        }
        /**计算伤害值(buff类型1的伤害)
         * 1. （攻击力*技能伤害系数*（1+（伤害加成-伤害减免））+技能具体值）*（1+最终伤害加成-最终免伤加成）*伤害修正值
         * 攻击力：攻击方基础攻击属性=（攻击*攻击比+攻击附加）
         * 技能伤害系数：(skill伤害系数?skill伤害系数:伤害buff percent)+增伤buff501 percent
         * 技能伤害加成：攻击方基础属性
         * 技能伤害减免：受击方基础属性
         * 技能具体值：伤害buff constValue+增伤buff501 constValue
         * 最终伤害加成：增伤buff500 percent
         * 最终免伤加成：增伤buff502 percent
         * 伤害修正值：9000-11000随机
         * 1+（施法者伤害加成-受击者伤害减免），最小值为20%
         * （1+最终伤害加成-最终免伤加成），最小值为20%，最大值为400%
        */
        static calcHitValue(random, param) {
            // 基础攻击力
            let atrDamage = param.atrValue;
            // 技能伤害系数
            let per = FNumber.value(param.addPer).div(BattleCommon.AttributeMultiplying).value;
            //（1+（伤害加成-伤害减免）+技能具体值）
            let basePer = FNumber.value(10000).add(param.addPerBase).sub(param.reducePerBase).value;
            basePer = Math.max(basePer, 2000);
            basePer = FNumber.value(basePer).div(BattleCommon.AttributeMultiplying).value;
            let damage = FNumber.value(atrDamage).mul(per).mul(basePer).add(param.addConst).value;
            //（1+最终伤害加成-最终免伤加成+护盾伤害加成-护盾伤害减免）
            let finalPer = FNumber.value(10000).add(param.addFinal).add(param.shieldAdd).sub(param.shieldReduce).sub(param.reduceFinal).value;
            finalPer = BMath.clamp(finalPer, 2000, 40000);
            finalPer = FNumber.value(finalPer).div(BattleCommon.AttributeMultiplying).value;
            // 随机修正
            let randomTmp = FNumber.value(random.randomInt(BattleCommon.DamageRandom1, BattleCommon.DamageRandom2)).div(BattleCommon.AttributeMultiplying).value;
            randomTmp = 1;
            damage = FNumber.value(damage).mul(finalPer).mul(randomTmp).value;
            return damage;
        }
        /**暴击伤害
         * 伤害公式最终伤害值*（基础暴击倍率+（施法者暴伤提升*（1+技能暴伤百分比）+技能暴伤具体值）-（受击者暴伤减免*（1+技能暴伤减免百分比修正）+技能暴伤减免具体值修正））
         * 基础暴击倍率：1.5
         * （暴击倍率+（施法者暴伤提升*（1+技能暴伤百分比）+技能暴伤具体值）-（受击者暴伤减免*（1+技能暴伤减免百分比修正）+技能暴伤减免具体值修正），最小值为1.2，最大值为10
         */
        static calcCritValue(value, param) {
            let critAdd = FNumber.value(10000).add(param.critPer).div(BattleCommon.AttributeMultiplying).mul(param.critPerBase).add(param.critConst).value;
            let critReduce = FNumber.value(10000).add(param.critReducePer).div(BattleCommon.AttributeMultiplying).mul(param.critReducePerBase).add(param.critReduceConst).value;
            let critRate = FNumber.value(BattleCommon.CritBaseRate).add(critAdd).sub(critReduce).value;
            critRate = BMath.clamp(critRate, BattleCommon.CritRandom1, BattleCommon.CritRandom2);
            return FNumber.value(critRate).div(BattleCommon.AttributeMultiplying).mul(value).value;
        }
        /**计算 攻击和生命 */
        static calcAtkOrHp(base, percent, add) {
            return FNumber.value(percent).div(BattleCommon.AttributeMultiplying).add(1).mul(base).add(add).value;
        }
        /**设置单位类型前缀 */
        static setUnitPrefix(type, prefix) {
            this._UnitPrefix[type] = prefix;
        }
        static getUnitPrefix(type) {
            if (this._UnitPrefix[type]) {
                return this._UnitPrefix[type];
            }
            else {
                return `Unit${type}`;
            }
        }
    }
    BattleCommon.BattleFrameTime = 66; // ms
    /**属性的倍率 */
    BattleCommon.AttributeMultiplying = 10000;
    /**能量值上限 */
    BattleCommon.EnergyValueMax = 10000;
    /**能量值(击杀) */
    BattleCommon.EnergyAddKill = 5000;
    /**能量值(受击) */
    BattleCommon.EnergyAddHitExpress = "500+(subHpPer*10000)";
    // 伤害计算常数
    BattleCommon.DamageRandom1 = 9000;
    BattleCommon.DamageRandom2 = 11000;
    BattleCommon.CritBaseRate = 15000;
    BattleCommon.CritRandom1 = 12000;
    BattleCommon.CritRandom2 = 100000;
    BattleCommon.ReduceExpressParamN = 1000;
    BattleCommon.ReduceExpressParamS = 1000;
    /**公式 */
    /**免伤率计算 */
    BattleCommon.ReduceExpress = "{{atr.3}}/({{atr.3}}+{{N}}+{{S}}*{{lv}})*10000";
    BattleCommon.MReduceExpress = "{{atr.4}}/({{atr.4}}+{{N}}+{{S}}*{{lv}})*10000";
    /**普攻默认cd */
    BattleCommon.MinSkillCD = 100; // 技能最短cd
    BattleCommon.NormalSkillCD = 1200;
    BattleCommon.MinNormalSkillTime = 150; // 普攻最短流程时间
    // /**获取属性 */
    // getAtrValue(type: AtrType): number {
    //     if (type == AtrType.AtrType_Attack) {
    //         //如果是攻击力 （展示 基础攻击力 * （1*攻击力加成） + 附加攻击力）
    //         let atkBase = this._data[AtrType.AtrType_Attack] || 0;
    //         let atkPer = this._data[AtrType.AtrType_AttackPercent] || 0;
    //         let atkAdd = this._data[AtrType.AtrType_Attack_Add] || 0;
    //         return FNumber.value(atkPer).div(BattleCommon.AttributeMultiplying).add(1).mul(atkBase).add(atkAdd).value;
    //     } else if (type == AtrType.AtrType_Hp) {
    //         //如果是血量（展示 基础血量 * （1*血量加成） + 附加血量）
    //         let hpBase = this._data[AtrType.AtrType_Hp] || 0;
    //         let hpPer = this._data[AtrType.AtrType_HpPercent] || 0;
    //         let hpAdd = this._data[AtrType.AtrType_Hp_Add] || 0;
    //         return FNumber.value(hpPer).div(BattleCommon.AttributeMultiplying).add(1).mul(hpBase).add(hpAdd).value;
    //     } else if (type == AtrType.AtrType_Attack_Add || type == AtrType.AtrType_Hp_Add) {
    //         //如果是攻击力附加 或 血量附加 返回数字
    //         let value = this._data[type] || 0;
    //         return value;
    //     } else {
    //         //剩下全部返回万分比
    //         let value = this._data[type] || 0;
    //         return FNumber.value(value).value;
    //     }
    // }
    BattleCommon._UnitPrefix = {};

    /**伤害buff */
    class BattleBuffDamage extends BattleBuff {
        onInit() {
            this._damageSkillType = exports.SkillType.None;
            this._damageType = exports.DamageType.Normal;
            this._damageExpressConfig = battle.config.getDamageExpressConfig(NumberUtil.myParseInt(this._config.param1));
            this._damageExpressDefine = this._damageExpressConfig ? battle.config.getDamageExpressDefine(this._damageExpressConfig.expressId) : null;
            this._buffDamagePer = NumberUtil.myParseInt(this._config.param2);
        }
        beforeExec(param, inResult) {
            return true;
        }
        exec(param, inResult) {
            if (!this.checkExpressDefine()) {
                return;
            }
            if (this._owner.isDie) {
                return;
            }
            if (!this.beforeExec(param, inResult)) {
                return;
            }
            if (param.skill) {
                this._damageSkillId = param.skill.id;
            }
            else {
                this._damageSkillId = 0;
            }
            this._abilityParam = ObjectUtil.deepClone(param);
            this._inBuffReturn = ObjectUtil.deepClone(inResult);
            if (this._abilityParam.calcPercent && this._abilityParam.calcPercent > 0) {
                this._buffDamagePer = this._abilityParam.calcPercent;
            }
            // 伤害流程处理
            this.onDamageProcess();
            return null;
        }
        // 伤害流程处理
        onDamageProcess() {
        }
        // 受击者死亡
        onBeHitDie() {
            let addUnit = this._owner.battleMgr.getUnit(this._actorId);
            if (addUnit) {
                let battleSkill = addUnit.skillComp.getSkill(this._damageSkillId);
                if (battleSkill) {
                    battleSkill.onKill(this._behitUnit.unitData.type);
                }
            }
        }
        /**判断公式 */
        checkExpressDefine() {
            return !!this._damageExpressDefine;
        }
        /**计算基础伤害 */
        baseDamage() {
            var _a, _b;
            if (!this._damageExpressDefine.damageBase) {
                return 0;
            }
            let keyArrs = this._damageExpressConfig.damageBase.split("#");
            if (!keyArrs || keyArrs.length == 0 || !keyArrs[0]) {
                // 默认参数
                switch (this._damageExpressConfig.damageSubType) {
                    case exports.DamageSubType.Physic:
                        keyArrs = battle.config.getDamageExpressConst(1).content.split("#");
                        break;
                    case exports.DamageSubType.Magic:
                        keyArrs = battle.config.getDamageExpressConst(2).content.split("#");
                        break;
                    case exports.DamageSubType.Real:
                        keyArrs = battle.config.getDamageExpressConst(3).content.split("#");
                        break;
                }
            }
            if (!keyArrs || keyArrs.length == 0) {
                return 0;
            }
            let expressParam = {};
            expressParam.damagePer = this._buffDamagePer;
            expressParam.unit1 = this._actorUnit;
            expressParam.unit2 = this._behitUnit;
            expressParam.exAttr1 = (_a = this._actorBuffReturn) === null || _a === void 0 ? void 0 : _a.addAtr;
            expressParam.exAttr2 = (_b = this._beHitBuffReturn) === null || _b === void 0 ? void 0 : _b.addAtr;
            expressParam.keyArrs = keyArrs;
            return this._owner.battleMgr.execExpress(this._damageExpressDefine.damageBase, expressParam);
        }
        /**计算伤害加成 */
        addDamage(damage) {
            var _a, _b, _c, _d;
            if (!this._damageExpressDefine.damageAdd) {
                return damage;
            }
            let keyArrs = this._damageExpressConfig.damageAdd.split("#");
            if (!keyArrs || keyArrs.length == 0 || !keyArrs[0]) {
                // 默认参数
                switch (this._damageExpressConfig.damageSubType) {
                    case exports.DamageSubType.Physic:
                        keyArrs = battle.config.getDamageExpressConst(4).content.split("#");
                        break;
                    case exports.DamageSubType.Magic:
                        keyArrs = battle.config.getDamageExpressConst(5).content.split("#");
                        break;
                    case exports.DamageSubType.Real:
                        keyArrs = battle.config.getDamageExpressConst(6).content.split("#");
                        break;
                }
            }
            let expressParam = {};
            expressParam.unit1 = this._actorUnit;
            expressParam.unit2 = this._behitUnit;
            expressParam.exAttr1 = (_a = this._actorBuffReturn) === null || _a === void 0 ? void 0 : _a.addAtr;
            expressParam.exAttr2 = (_b = this._beHitBuffReturn) === null || _b === void 0 ? void 0 : _b.addAtr;
            expressParam.damage = damage;
            expressParam.keyArrs = keyArrs;
            if (this._damageSkillType == exports.SkillType.Skill1) {
                expressParam.skillAdd = 0;
            }
            else if (this._damageSkillType == exports.SkillType.Skill2) {
                expressParam.skillAdd = this._actorUnit.attrComp.getAtrValue(exports.AtrType.SkillAddUltimate, (_c = this._actorBuffReturn) === null || _c === void 0 ? void 0 : _c.addAtr);
            }
            else {
                expressParam.skillAdd = this._actorUnit.attrComp.getAtrValue(exports.AtrType.SkillAdd, (_d = this._actorBuffReturn) === null || _d === void 0 ? void 0 : _d.addAtr);
            }
            damage = this._owner.battleMgr.execExpress(this._damageExpressDefine.damageAdd, expressParam);
            return damage;
        }
        /**计算流派加成 */
        sectDamage(damage) {
            var _a, _b;
            if (!this._damageExpressDefine.damageSect) {
                return damage;
            }
            let expressParam = {};
            let sectAdd = this._actorUnit.attrComp.getSectAdd(this._behitUnit.unitData.sect, (_a = this._actorBuffReturn) === null || _a === void 0 ? void 0 : _a.addAtr);
            let sectReduce = this._behitUnit.attrComp.getSectReduce(this._actorUnit.unitData.sect, (_b = this._beHitBuffReturn) === null || _b === void 0 ? void 0 : _b.addAtr);
            expressParam.unit1 = this._actorUnit;
            expressParam.unit2 = this._behitUnit;
            expressParam.damage = damage;
            expressParam.sectAdd = sectAdd;
            expressParam.sectReduce = sectReduce;
            damage = this._owner.battleMgr.execExpress(this._damageExpressDefine.damageSect, expressParam);
            return damage;
        }
        /**检测是否免疫伤害 */
        checkIgnoreDamage() {
            return false;
        }
    }

    /**伤害1(普攻) */
    class BattleBuff1 extends BattleBuffDamage {
        onInit() {
            super.onInit();
            this._damageType = exports.DamageType.Normal;
        }
        onAdd() {
            if (this._addSkillId && this._addSkillId > 0) {
                let addSkill = battle.config.getSkill(this._addSkillId);
                if (addSkill) {
                    this._damageSkillType = addSkill.type;
                }
            }
        }
        beforeExec(param, inResult) {
            this._behitUnit = this._owner.battleMgr.getUnit(param.beHitUid);
            if (!this._behitUnit) {
                return false;
            }
            // 无法选中不受伤害
            if (this._behitUnit.behavior.getNotFind(this._owner.teamId)) {
                return false;
            }
            if (this.checkIgnoreDamage()) {
                return;
            }
            this._actorUnit = this._owner;
            return true;
        }
        onDamageProcess() {
            this._actorBuffReturn = BattleCommon.MergeBuffAbilityReturn(this._actorBuffReturn, this._inBuffReturn);
            this._beHitBuffReturn = {};
            this._actorBuffCondition = {
                skillId: this._damageSkillId,
                beHitUid: this._behitUnit.uid,
            };
            this._actorBuffCondition.hitCount2 = this._actorBuffReturn.hitCount2 ? this._actorBuffReturn.hitCount2 : 1;
            this._actorBuffCondition.hitCount3 = this._actorBuffReturn.hitCount3 ? this._actorBuffReturn.hitCount3 : 1;
            this._beHitBuffCondition = {
                skillId: this._damageSkillId,
                actorUid: this._actorUnit.uid,
            };
            // 计算命中之前
            this._actorBuffReturn = BattleCommon.MergeBuffAbilityReturn(this._actorBuffReturn, this._actorUnit.buffComp.triggerBuff(exports.TriggerEnum.SkillCalc1, this._actorBuffCondition, this._abilityParam, this._actorBuffReturn));
            this._beHitBuffReturn = BattleCommon.MergeBuffAbilityReturn(this._beHitBuffReturn, this._behitUnit.buffComp.triggerBuff(exports.TriggerEnum.BeAttackHit1, this._beHitBuffCondition, this._abilityParam, this._beHitBuffReturn));
            if (this.checkHit()) {
                //记录命中和受击次数
                this.onHit();
                // 暴击判断
                let isCrit = this.checkCrit();
                this._actorBuffCondition.isCrit = isCrit;
                this._beHitBuffCondition.isCrit = isCrit;
                this._actorBuffReturn = BattleCommon.MergeBuffAbilityReturn(this._actorBuffReturn, this._actorUnit.buffComp.triggerBuff(exports.TriggerEnum.SkillCalc2, this._actorBuffCondition, this._abilityParam, this._actorBuffReturn));
                this._beHitBuffReturn = BattleCommon.MergeBuffAbilityReturn(this._beHitBuffReturn, this._behitUnit.buffComp.triggerBuff(exports.TriggerEnum.BeAttackHit2, this._beHitBuffCondition, this._abilityParam, this._beHitBuffReturn));
                let damage = this.baseDamage();
                if (isCrit) {
                    damage = this.critDamage(damage);
                }
                // 伤害加成
                damage = this.addDamage(damage);
                // 流派克制
                damage = this.sectDamage(damage);
                this._abilityParam.damageValue = damage;
                this._abilityParam.damageType = this._damageType;
                this._actorBuffReturn = BattleCommon.MergeBuffAbilityReturn(this._actorBuffReturn, this._actorUnit.buffComp.triggerBuff(exports.TriggerEnum.CalcDamageOver1, this._actorBuffCondition, this._abilityParam, this._actorBuffReturn));
                this._behitUnit.beAttack(damage, this._actorUnit.uid, this._damageSkillId, this._config.id, { damageType: this._damageType, isCrit });
                if (this._behitUnit.isDie) {
                    this.onBeHitDie();
                }
            }
            else {
                this.onMiss();
            }
        }
        /**判断命中 */
        checkHit() {
            if (!this._damageExpressDefine.checkHit) {
                return true;
            }
            if (this._actorBuffReturn.mustHit || this._beHitBuffReturn.mustHit) {
                return true;
            }
            let expressParam = {};
            let hit; // = actor.attrComp.getSectAdd(beHit.unitData.sect, this._actorBuffReturn.addAtr);
            let dodge; // = beHit.attrComp.getSectReduce(actor.unitData.sect, this._behitBuffReturn.addAtr);
            if (this._damageSkillType == exports.SkillType.Skill1) {
                hit = this._actorUnit.attrComp.getAtrValue(exports.AtrType.Hit, this._actorBuffReturn.addAtr);
                dodge = this._behitUnit.attrComp.getAtrValue(exports.AtrType.Dodge, this._beHitBuffReturn.addAtr);
            }
            else {
                hit = this._actorUnit.attrComp.getAtrValue(exports.AtrType.SkillHit, this._actorBuffReturn.addAtr);
                dodge = this._behitUnit.attrComp.getAtrValue(exports.AtrType.SkillDodge, this._beHitBuffReturn.addAtr);
            }
            expressParam.unit1 = this._actorUnit;
            expressParam.unit2 = this._behitUnit;
            expressParam.hit = hit;
            expressParam.dodge = dodge;
            let checkValue = this._owner.battleMgr.execExpress(this._damageExpressDefine.checkHit, expressParam);
            if (checkValue >= BattleCommon.AttributeMultiplying) {
                return true;
            }
            else if (checkValue <= 0) {
                return false;
            }
            else {
                let randomValue = this._owner.battleMgr.getRandom().randomInt(0, BattleCommon.AttributeMultiplying);
                return randomValue < checkValue;
            }
        }
        /**命中处理 */
        onHit() {
            this._behitUnit.buffComp.recordBeHitCount();
        }
        /**闪避处理 */
        onMiss() {
            // 记录闪避次数
            this._behitUnit.buffComp.recordMissCount();
            this._behitUnit.buffComp.triggerBuff(exports.TriggerEnum.Miss, null, { actorUid: this._owner.uid }, null);
            // 单位id, 施法者id, 技能id, buffid
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitBeMiss, { uid: this._behitUnit.uid, unitBeMiss: { actorId: this._owner.uid, skillId: this._abilityParam.skill.id, buffid: this._config.id } });
        }
        /**判断暴击 */
        checkCrit() {
            if (!this._damageExpressDefine.checkCrit) {
                return false;
            }
            if (this._actorBuffReturn.mustCrit || this._beHitBuffReturn.mustCrit) {
                return true;
            }
            let expressParam = {};
            expressParam.unit1 = this._actorUnit;
            expressParam.unit2 = this._behitUnit;
            expressParam.exAttr1 = this._actorBuffReturn.addAtr;
            expressParam.exAttr2 = this._beHitBuffReturn.addAtr;
            let checkValue = this._owner.battleMgr.execExpress(this._damageExpressDefine.checkCrit, expressParam);
            if (checkValue >= BattleCommon.AttributeMultiplying) {
                return true;
            }
            else if (checkValue <= 0) {
                return false;
            }
            else {
                let randomValue = this._owner.battleMgr.getRandom().randomInt(0, BattleCommon.AttributeMultiplying);
                return randomValue < checkValue;
            }
        }
        /**计算暴击 */
        critDamage(damage) {
            if (!this._damageExpressDefine.damageCrit) {
                return damage;
            }
            let expressParam = {};
            expressParam.unit1 = this._actorUnit;
            expressParam.unit2 = this._behitUnit;
            expressParam.exAttr1 = this._actorBuffReturn.addAtr;
            expressParam.exAttr2 = this._beHitBuffReturn.addAtr;
            expressParam.damage = damage;
            damage = this._owner.battleMgr.execExpress(this._damageExpressDefine.damageCrit, expressParam);
            return damage;
        }
    }
    //     protected _defaultUnitType: string = "3";
    //     protected _defaultAtrType: number = 1;
    //     // 属性值*技能伤害系数*（1+（伤害加成-伤害减免+技能伤害加成-技能伤害减免）+技能具体值）*（1+最终伤害加成-最终免伤加成+护盾伤害加成-护盾伤害减免）*伤害修正值 + 附加值
    //     /**计算值 */
    //     protected calcValue(actor: BattleUnit, beHit: BattleUnit, actorResult: BuffAbilityReturn, targetResult: BuffAbilityReturn, abilityParam: BuffAbilityParam, addActorId?: string): number {
    //         let atrUnit: BattleUnit = this.getAtrUnit(abilityParam, addActorId);
    //         let atrBase: number = this.getAtrBase(atrUnit, actorResult, targetResult);
    //         let calcPercent: number = 0;
    //         if (abilityParam.skill && abilityParam.skill.id == this._addSkillId) {
    //             calcPercent = abilityParam.calcPercent;
    //         }
    //         let skillPer: number = this.getSkillPer(calcPercent, actor, beHit, actorResult, targetResult);
    //         let atrPer: number = this.getAtrPer(actor, beHit, actorResult, targetResult);
    //         let skillAdd: number = this.getSkillAdd(actor, beHit, actorResult, targetResult);
    //         let finalPer: number = this.getFinalPer(actor, beHit, actorResult, targetResult);
    //         let randomCorrect: number = this.getRandomCorrect();
    //         let calcValue: number = FNumber.value(atrBase).mul(skillPer).mul(atrPer).add(skillAdd).mul(finalPer).mul(randomCorrect).value;
    //         calcValue = this.checkThreshold(calcValue);
    //         // 获取伤害固定加成
    //         if (actorResult && actorResult.damageAddParam) {
    //             let damageConstAdd: number = actorResult.damageAddParam.damageAdd4;
    //             calcValue = FNumber.value(calcValue).add(damageConstAdd).value;
    //         }
    //         // calcValue+=damageConstAdd;
    //         return calcValue;
    //     }
    //     /**技能伤害系数 */
    //     protected getSkillPer(skillConfigPer: number, actor: BattleUnit, beHit: BattleUnit, inResult: BuffAbilityReturn, targetResult: BuffAbilityReturn): number {
    //         let addPer: number = 0;
    //         if (skillConfigPer) {
    //             // 技能配置的系数
    //             addPer = NumberUtil.myParseInt(skillConfigPer);
    //         } else {
    //             addPer = this._damagePer;
    //         }
    //         if (inResult && inResult.damageAddParam && inResult.damageAddParam.damageAdd2) {
    //             addPer = FNumber.value(addPer).add(inResult.damageAddParam.damageAdd2).value;
    //         }
    //         if (actor && actor.attrComp.getDamageAddParam() && actor.attrComp.getDamageAddParam().damageAdd2) {
    //             addPer = FNumber.value(addPer).add(actor.attrComp.getDamageAddParam().damageAdd2).value;
    //         }
    //         if (targetResult.damageAddParam && targetResult.damageAddParam.damageAdd2) {
    //             addPer = FNumber.value(addPer).add(targetResult.damageAddParam.damageAdd2).value;
    //         }
    //         if (beHit && beHit.attrComp.getDamageAddParam() && beHit.attrComp.getDamageAddParam().damageReduce2) {
    //             addPer = FNumber.value(addPer).sub(beHit.attrComp.getDamageAddParam().damageReduce2).value;
    //         }
    //         addPer = FNumber.value(addPer).div(BattleCommon.AttributeMultiplying).value;
    //         return addPer;
    //     }
    //     /**其他属性值
    //      * （1+（普攻伤害加成-普攻伤害减免）
    //      * 最小值2000
    //     */
    //     protected getBaseAtrPer(actor: BattleUnit, beHit: BattleUnit, inResult: BuffAbilityReturn, targetResult: BuffAbilityReturn): number {
    //         // let add: number = actor.attrComp.getOriAtrValue(AtrType.AtrType_Damage_Add);
    //         // let reduce: number = beHit.attrComp.getOriAtrValue(AtrType.AtrType_Damage_Reduce);
    //         // if (inResult && inResult.addAtr) {
    //         //     add = FNumber.value(add).add(ObjectUtil.getKVnumberValue(inResult.addAtr, AtrType.AtrType_Damage_Add)).value;
    //         //     reduce = FNumber.value(reduce).add(ObjectUtil.getKVnumberValue(inResult.addAtr, AtrType.AtrType_Damage_Reduce)).value;
    //         // }
    //         // if (targetResult && targetResult.addAtr) {
    //         //     add = FNumber.value(add).add(ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_Damage_Add)).value;
    //         //     reduce = FNumber.value(reduce).add(ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_Damage_Reduce)).value;
    //         // }
    //         // let valueTmp: number = FNumber.value(add).sub(reduce).value;
    //         // return valueTmp;
    //         return 10000;
    //     }
    //     /**其他属性值
    //      * （1+（普攻伤害加成-普攻伤害减免）
    //      * 最小值2000
    //     */
    //     protected getAtrPer(actor: BattleUnit, beHit: BattleUnit, inResult: BuffAbilityReturn, targetResult: BuffAbilityReturn): number {
    //         // let add: number = actor.attrComp.getOriAtrValue(AtrType.AtrType_Normal_Add);
    //         // let reduce: number = beHit.attrComp.getOriAtrValue(AtrType.AtrType_Normal_Reduce);
    //         // if (inResult && inResult.addAtr) {
    //         //     add = FNumber.value(add).add(ObjectUtil.getKVnumberValue(inResult.addAtr, AtrType.AtrType_Normal_Add)).value;
    //         //     reduce = FNumber.value(reduce).add(ObjectUtil.getKVnumberValue(inResult.addAtr, AtrType.AtrType_Normal_Reduce)).value;
    //         // }
    //         // if (targetResult && targetResult.addAtr) {
    //         //     add = FNumber.value(add).add(ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_Normal_Add)).value;
    //         //     reduce = FNumber.value(reduce).add(ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_Normal_Reduce)).value;
    //         // }
    //         // let baseValue: number = this.getBaseAtrPer(actor, beHit, inResult, targetResult);
    //         // let valueTmp: number = FNumber.value(10000).add(baseValue).add(add).sub(reduce).value;
    //         // valueTmp = Math.max(2000, valueTmp);
    //         // valueTmp = FNumber.value(valueTmp).div(BattleCommon.AttributeMultiplying).value;
    //         // return valueTmp;
    //         return 10000;
    //     }
    //     /**技能具体值 */
    //     protected getSkillAdd(actor: BattleUnit, beHit: BattleUnit, inResult: BuffAbilityReturn, targetResult: BuffAbilityReturn): number {
    //         let skillAdd: number = this._damageAdd;
    //         if (inResult && inResult.damageAddParam && inResult.damageAddParam.damageAdd3) {
    //             skillAdd = FNumber.value(skillAdd).add(inResult.damageAddParam.damageAdd3).value;
    //         }
    //         if (actor && actor.attrComp.getDamageAddParam() && actor.attrComp.getDamageAddParam().damageAdd3) {
    //             skillAdd = FNumber.value(skillAdd).add(actor.attrComp.getDamageAddParam().damageAdd3).value;
    //         }
    //         if (targetResult && targetResult.damageAddParam && targetResult.damageAddParam.damageAdd3) {
    //             skillAdd = FNumber.value(skillAdd).add(targetResult.damageAddParam.damageAdd3).value;
    //         }
    //         if (beHit && beHit.attrComp.getDamageAddParam() && beHit.attrComp.getDamageAddParam().damageReduce3) {
    //             skillAdd = FNumber.value(skillAdd).sub(beHit.attrComp.getDamageAddParam().damageReduce3).value;
    //         }
    //         return skillAdd;
    //     }
    //     /**最终伤害加成
    //      * （1+最终伤害加成-最终免伤加成+护盾伤害加成-护盾伤害减免）
    //      * 最小值2000， 最大值40000
    //     */
    //     protected getFinalPer(actor: BattleUnit, beHit: BattleUnit, inResult: BuffAbilityReturn, targetResult: BuffAbilityReturn): number {
    //         // let finalAdd: number = 0;
    //         // let finalReduce: number = 0;
    //         // let calcShield: boolean = beHit.buffComp.hasShield() && !inResult.ignoreShield && !targetResult.ignoreShield;
    //         // let shieldAdd: number = 0;
    //         // let shieldReduce: number = 0;
    //         // if (calcShield) {
    //         //     shieldAdd = actor.attrComp.getOriAtrValue(AtrType.AtrType_Shield_Add);
    //         //     shieldReduce = beHit.attrComp.getOriAtrValue(AtrType.AtrType_Shield_Reduce);
    //         // }
    //         // if (inResult) {
    //         //     if (inResult.damageAddParam) {
    //         //         if (inResult.damageAddParam.damageAdd1) {
    //         //             finalAdd = FNumber.value(finalAdd).add(inResult.damageAddParam.damageAdd1).value;
    //         //         }
    //         //         if (inResult.damageAddParam.damageReduce1) {
    //         //             finalReduce = FNumber.value(finalReduce).add(inResult.damageAddParam.damageReduce1).value;
    //         //         }
    //         //     }
    //         //     if (calcShield && inResult.addAtr) {
    //         //         shieldAdd = FNumber.value(shieldAdd).add(ObjectUtil.getKVnumberValue(inResult.addAtr, AtrType.AtrType_Shield_Add)).value;
    //         //         shieldReduce = FNumber.value(shieldReduce).add(ObjectUtil.getKVnumberValue(inResult.addAtr, AtrType.AtrType_Shield_Reduce)).value;
    //         //     }
    //         // }
    //         // if (actor && actor.attrComp.getDamageAddParam() && actor.attrComp.getDamageAddParam().damageAdd1) {
    //         //     finalAdd = FNumber.value(finalAdd).add(actor.attrComp.getDamageAddParam().damageAdd1).value;
    //         // }
    //         // if (targetResult) {
    //         //     if (targetResult.damageAddParam) {
    //         //         if (targetResult.damageAddParam.damageAdd1) {
    //         //             finalAdd = FNumber.value(finalAdd).add(targetResult.damageAddParam.damageAdd1).value;
    //         //         }
    //         //         if (targetResult.damageAddParam.damageReduce1) {
    //         //             finalReduce = FNumber.value(finalReduce).add(targetResult.damageAddParam.damageReduce1).value;
    //         //         }
    //         //     }
    //         //     if (calcShield && targetResult.addAtr) {
    //         //         shieldAdd = FNumber.value(shieldAdd).add(ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_Shield_Add)).value;
    //         //         shieldReduce = FNumber.value(shieldReduce).add(ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_Shield_Reduce)).value;
    //         //     }
    //         // }
    //         // if (beHit && beHit.attrComp.getDamageAddParam() && beHit.attrComp.getDamageAddParam().damageReduce1) {
    //         //     finalReduce = FNumber.value(finalReduce).add(beHit.attrComp.getDamageAddParam().damageReduce1).value;
    //         // }
    //         // let finalValue: number = FNumber.value(BattleCommon.AttributeMultiplying).add(finalAdd).add(shieldAdd).sub(finalReduce).sub(shieldReduce).value;
    //         // finalValue = BMath.clamp(finalValue, 2000, 40000);
    //         // finalValue = FNumber.value(finalValue).div(BattleCommon.AttributeMultiplying).value;
    //         // return finalValue;
    //         return 10000;
    //     }
    //     /**随机修正
    //      * 9000-11000
    //      */
    //     protected getRandomCorrect(): number {
    //         let randomTmp: number = BattleCommon.AttributeMultiplying;
    //         randomTmp = FNumber.value(randomTmp).div(BattleCommon.AttributeMultiplying).value;
    //         return randomTmp;
    //     }
    //     /**检测命中 */
    //     protected checkHit(actor: BattleUnit, beHit: BattleUnit): boolean {
    //         // return BattleCommon.calcHit(actor.battleMgr.getRandom(), actor.attrComp.getOriAtrValue(AtrType.Hit), beHit.attrComp.getOriAtrValue(AtrType.Dodge));
    //         return true;
    //     }
    //     /**造成伤害 */
    //     protected onAttack(value: number) {
    //     }
    //     /**检测暴击 */
    //     protected checkCrit(actor: BattleUnit, beHit: BattleUnit, actorResult: BuffAbilityReturn, targetResult: BuffAbilityReturn): boolean {
    //         // let isCrit: boolean;
    //         // if (actorResult.mustCrit || targetResult.mustCrit) {
    //         //     isCrit = true;
    //         // } else {
    //         //     // 是否暴击
    //         //     let critRate: number = actor.attrComp.getOriAtrValue(AtrType.AtrType_CritRate);
    //         //     // 加上临时属性
    //         //     if (actorResult && actorResult.addAtr) {
    //         //         critRate += ObjectUtil.getKVnumberValue(actorResult.addAtr, AtrType.AtrType_CritRate);
    //         //     }
    //         //     let critReduceRate: number = beHit.attrComp.getOriAtrValue(AtrType.AtrType_CritRateResistance);
    //         //     // 加上临时属性
    //         //     if (targetResult && targetResult.addAtr) {
    //         //         critReduceRate += ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_CritRateResistance);
    //         //     }
    //         //     isCrit = BattleCommon.calcCrit(actor.battleMgr.getRandom(), critRate, critReduceRate);
    //         // }
    //         // return isCrit;
    //         return false;
    //     }
    //     protected exec(param: BuffAbilityParam, inResult: BuffAbilityReturn): BuffAbilityReturn {
    //         let beHit: BattleUnit = this._owner.battleMgr.getUnit(param.beHitUid);
    //         if (!beHit) {
    //             return;
    //         }
    //         // 无法选中不受伤害
    //         if (beHit.behavior.getNotFind(this._owner.teamId)) {
    //             return;
    //         }
    //         let actor: BattleUnit = this._owner.battleMgr.getUnit(param.actorUid);
    //         if (!actor) {
    //             return;
    //         }
    //         if (this.checkIgnoreDamage(beHit)) {
    //             this._owner.battleMgr.battleLog(`[${actor.uid}]对[${beHit.uid}]攻击[${param.skill.id}],伤害被免疫`);
    //             return;
    //         }
    //         // 判断命中
    //         let isHit: boolean;
    //         if (inResult && inResult.mustHit) {
    //             isHit = true;
    //         } else {
    //             isHit = this.checkHit(actor, beHit);
    //         }
    //         if (isHit) {
    //             //记录受击次数
    //             this.recordHit(beHit, param.skill.id);
    //             beHit.buffComp.recordBeHitCount();
    //             param.buffId = this._config.id;
    //             let skillId: number = 0;
    //             if (param.skill) {
    //                 skillId = param.skill.id;
    //             }
    //             // 伤害计算1（暴击前）
    //             let conditionParam1: BattleConditionParam = {
    //                 skillId: skillId,
    //                 beHitUid: beHit.uid,
    //             }
    //             if (inResult) {
    //                 conditionParam1.hitCount2 = inResult.hitCount2 ? inResult.hitCount2 : 1;
    //                 conditionParam1.hitCount3 = inResult.hitCount3 ? inResult.hitCount3 : 1;
    //             }
    //             let actorResult: BuffAbilityReturn = {};
    //             actorResult = BattleCommon.MergeBuffAbilityReturn(actorResult, inResult);
    //             actorResult = BattleCommon.MergeBuffAbilityReturn(actorResult, actor.buffComp.triggerBuff(TriggerEnum.SkillCalc1, conditionParam1, param, actorResult));
    //             // 被技能命中（暴击前）
    //             let conditionParam2: BattleConditionParam = {
    //                 skillId: skillId,
    //                 actorUid: actor.uid,
    //             }
    //             if (actorResult) {
    //                 conditionParam2.hitCount2 = actorResult.hitCount2 ? actorResult.hitCount2 : 1;
    //                 conditionParam2.hitCount3 = actorResult.hitCount3 ? actorResult.hitCount3 : 1;
    //             }
    //             let targetResult: BuffAbilityReturn = {};
    //             targetResult = BattleCommon.MergeBuffAbilityReturn(targetResult, beHit.buffComp.triggerBuff(TriggerEnum.BeAttackHit1, conditionParam2, param, targetResult));
    //             let isCrit: boolean = this.checkCrit(actor, beHit, actorResult, targetResult);
    //             conditionParam1.isCrit = isCrit;
    //             conditionParam2.isCrit = isCrit;
    //             // 伤害计算2（暴击后）
    //             actorResult = BattleCommon.MergeBuffAbilityReturn(actorResult, actor.buffComp.triggerBuff(TriggerEnum.SkillCalc2, conditionParam1, param, actorResult));
    //             // 被技能命中（暴击后）
    //             targetResult = BattleCommon.MergeBuffAbilityReturn(targetResult, beHit.buffComp.triggerBuff(TriggerEnum.BeAttackHit2, conditionParam2, param, targetResult));
    //             let calcValue: number = this.calcValue(actor, beHit, actorResult, targetResult, param);
    //             this._owner.battleMgr.battleLog(`[时间]${StringUtil.getDateString()}[${actor.uid}]对[${beHit.uid}]使用技能[${param.skill.id}],造成基本伤害[${calcValue}]`)
    //             if (isCrit) {
    //                 // this._owner.skillComp.recordSkillCritCount(param.skill.id);
    //                 // let critParam: BattleCritParam = new BattleCritParam();
    //                 // critParam.critPerBase = actor.attrComp.getOriAtrValue(AtrType.AtrType_CritValue);
    //                 // if (actorResult) {
    //                 //     if (actorResult.addAtr) {
    //                 //         critParam.critPerBase = FNumber.value(critParam.critPerBase).add(ObjectUtil.getKVnumberValue(actorResult.addAtr, AtrType.AtrType_CritValue)).value;
    //                 //     }
    //                 //     if (actorResult.critPer) {
    //                 //         critParam.critPer = FNumber.value(critParam.critPer).add(actorResult.critPer).value;
    //                 //     }
    //                 //     if (actorResult.critConst) {
    //                 //         critParam.critConst = FNumber.value(critParam.critConst).add(actorResult.critConst).value;
    //                 //     }
    //                 // }
    //                 // critParam.critReducePerBase = beHit.attrComp.getOriAtrValue(AtrType.AtrType_CritResistance);
    //                 // if (targetResult) {
    //                 //     if (targetResult.addAtr) {
    //                 //         critParam.critPerBase = FNumber.value(critParam.critPerBase).add(ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_CritValue)).value;
    //                 //         critParam.critReducePerBase = FNumber.value(critParam.critPerBase).add(ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_CritResistance)).value;
    //                 //     }
    //                 //     if (targetResult.critReducePer) {
    //                 //         critParam.critReducePer = FNumber.value(critParam.critReducePer).add(targetResult.critReducePer).value;
    //                 //     }
    //                 //     if (targetResult.critReduceConst) {
    //                 //         critParam.critReduceConst = FNumber.value(critParam.critReduceConst).add(targetResult.critReduceConst).value;
    //                 //     }
    //                 // }
    //                 // calcValue = BattleCommon.calcCritValue(calcValue, critParam);
    //                 // this._owner.battleMgr.battleLog(`[${actor.uid}]对[${beHit.uid}]使用技能[${param.skill.id}],造成暴击伤害[${calcValue}]`);
    //             }
    //             param.damageValue = calcValue;
    //             param.damageType = this._damageType;
    //             this._owner.buffComp.triggerBuff(TriggerEnum.CalcDamageOver1, conditionParam1, param, null);
    //             let ignoreShield: boolean = (actorResult && actorResult.ignoreShield) || (targetResult && targetResult.ignoreShield);
    //             beHit.beAttack(calcValue, actor.uid, param.skill.id, this._config.id, { damageType: this._damageType, isCrit, ignoreShield });
    //             this.onAttack(calcValue);
    //             // 吸血
    //             let leechPer: number = 0;
    //             if (actorResult) {
    //                 if (actorResult.leech) {
    //                     leechPer = actorResult.leech;
    //                 }
    //             }
    //             // 吸血回复
    //             if (leechPer > 0) {
    //                 let leechHp: number = FNumber.value(calcValue).mul(leechPer).div(BattleCommon.AttributeMultiplying).value;
    //                 actor.attrComp.addHp(leechHp, actor.uid, 0, 0);
    //             }
    //             if (beHit.isDie) {
    //                 let addUnit: BattleUnit = this._owner.battleMgr.getUnit(this._actorId);
    //                 if (addUnit) {
    //                     let battleSkill: BattleSkill = addUnit.skillComp.getSkill(param.skill.id);
    //                     if (battleSkill) {
    //                         battleSkill.onKill(1);
    //                         addUnit.buffComp.triggerBuff(TriggerEnum.SkillKill, conditionParam1, param, null);
    //                     }
    //                 }
    //             } else {
    //                 // 对面被击中
    //                 if (targetResult) {
    //                     //反伤
    //                     let returnAtk: number = 0;
    //                     if (targetResult.damageReturn1) {
    //                         returnAtk = FNumber.value(targetResult.damageReturn1).div(BattleCommon.AttributeMultiplying).mul(calcValue).value;
    //                     }
    //                     if (returnAtk > 0) {
    //                         actor.beAttack(returnAtk, beHit.uid, 0, 0, { damageType: DamageType.Return, isReturn: true });
    //                     }
    //                 }
    //             }
    //         } else {
    //             // 记录闪避次数
    //             beHit.buffComp.recordMissCount();
    //             beHit.buffComp.triggerBuff(TriggerEnum.Miss, null, { actorUid: param.actorUid }, null);
    //             // 单位id, 施法者id, 技能id, buffid
    //             this._owner.battleMgr.addRecord(BattleRecordDataType.UnitMiss, [param.beHitUid, actor.uid, param.skill.id, this._config.id]);
    //         }
    //         return null;
    //     }
    //     protected recordHit(target: BattleUnit, skillId: number) {
    //         // 记录命中
    //         this._owner.buffComp.recordHitUnit(target.uid);
    //         // 普攻
    //         this._owner.buffComp.recordNormalHitUnit(target.uid);
    //     }
    // }

    /**回血buff */
    class BattleBuffCure extends BattleBuff {
        onAdd() {
            if (this._addSkillId && this._addSkillId > 0) {
                let addSkill = battle.config.getSkill(this._addSkillId);
                if (addSkill) {
                    this._skillType = addSkill.type;
                }
            }
        }
        onInit() {
            this._cureType = exports.CureType.None;
            this._damageExpressConfig = battle.config.getDamageExpressConfig(NumberUtil.myParseInt(this._config.param1));
            this._damageExpressDefine = this._damageExpressConfig ? battle.config.getDamageExpressDefine(this._damageExpressConfig.expressId) : null;
            this._buffPer = NumberUtil.myParseInt(this._config.param2);
            this._perType = NumberUtil.myParseInt(this._config.param3);
        }
        beforeExec(param, inResult) {
            return true;
        }
        exec(param, inResult) {
            if (!this.checkExpressDefine()) {
                return;
            }
            if (this._owner.isDie) {
                return;
            }
            if (!this.beforeExec(param, inResult)) {
                return;
            }
            if (param.skill) {
                this._skillId = param.skill.id;
            }
            else {
                this._skillId = 0;
            }
            this._abilityParam = ObjectUtil.deepClone(param);
            this._inBuffReturn = ObjectUtil.deepClone(inResult);
            if (this._perType == 1) {
                this._curePer = this._buffPer;
            }
            else {
                if (this._abilityParam.calcPercent && this._abilityParam.calcPercent > 0) {
                    this._curePer = this._abilityParam.calcPercent;
                }
                else {
                    this._curePer = this._buffPer;
                }
            }
            // 伤害流程处理
            this.onCureProgress();
            return null;
        }
        // 伤害流程处理
        onCureProgress() {
        }
        /**判断公式 */
        checkExpressDefine() {
            return !!this._damageExpressDefine;
        }
        /**基础治疗 */
        baseCure(expressParam) {
            var _a, _b;
            if (!this._damageExpressDefine.damageBase) {
                return 0;
            }
            if (!expressParam) {
                expressParam = {};
                expressParam.keyArrs = this._damageExpressConfig.damageBase.split("#");
            }
            expressParam.curePer = this._curePer;
            expressParam.unit1 = this._actorUnit;
            expressParam.unit2 = this._behitUnit;
            expressParam.exAttr1 = (_a = this._actorBuffReturn) === null || _a === void 0 ? void 0 : _a.addAtr;
            expressParam.exAttr2 = (_b = this._beHitBuffReturn) === null || _b === void 0 ? void 0 : _b.addAtr;
            return this._owner.battleMgr.execExpress(this._damageExpressDefine.damageBase, expressParam);
        }
    }

    /**回血1 */
    class BattleBuff100 extends BattleBuffCure {
        /**计算伤害加成 */
        addCure(cure) {
            var _a, _b, _c, _d;
            if (!this._damageExpressDefine.damageAdd) {
                return cure;
            }
            let keyArrs = this._damageExpressConfig.damageAdd.split("#");
            let expressParam = {};
            expressParam.unit1 = this._actorUnit;
            expressParam.unit2 = this._behitUnit;
            expressParam.exAttr1 = (_a = this._actorBuffReturn) === null || _a === void 0 ? void 0 : _a.addAtr;
            expressParam.exAttr2 = (_b = this._beHitBuffReturn) === null || _b === void 0 ? void 0 : _b.addAtr;
            expressParam.cure = cure;
            expressParam.keyArrs = keyArrs;
            if (this._skillType == exports.SkillType.Skill1) {
                expressParam.skillAdd = 0;
            }
            else if (this._skillType == exports.SkillType.Skill2) {
                expressParam.skillAdd = this._actorUnit.attrComp.getAtrValue(exports.AtrType.SkillAddUltimate, (_c = this._actorBuffReturn) === null || _c === void 0 ? void 0 : _c.addAtr);
            }
            else {
                expressParam.skillAdd = this._actorUnit.attrComp.getAtrValue(exports.AtrType.SkillAdd, (_d = this._actorBuffReturn) === null || _d === void 0 ? void 0 : _d.addAtr);
            }
            cure = this._owner.battleMgr.execExpress(this._damageExpressDefine.damageAdd, expressParam);
            return cure;
        }
    }

    /**伤害吸血 */
    class BattleBuff101 extends BattleBuffCure {
        onInit() {
            super.onInit();
            this._cureType = exports.CureType.DamageLeach;
        }
        beforeExec(param, inResult) {
            this._behitUnit = this._owner.battleMgr.getUnit(param.beHitUid);
            if (!this._behitUnit) {
                return false;
            }
            this._actorUnit = this._owner;
            return true;
        }
        onCureProgress() {
            let cure = this.baseCure({ keyArrs: ["damage"], damage: this._abilityParam.damageValue });
            this._owner.battleMgr.battleLog(`[时间]${StringUtil.getDateString()}[${this._actorUnit.uid}]对[${this._behitUnit.uid}]使用技能[${this._skillId}],吸血[${cure}]`, "CURE", "Leach");
            this._actorUnit.attrComp.addHp(cure, this._actorUnit.uid, this._skillId, this._config.id);
        }
    }

    /**储存伤害转回血 */
    class BattleBuff102 extends BattleBuff100 {
    }

    /**链接治疗 */
    class BattleBuff103 extends BattleBuff100 {
    }

    /**伤害2(技能) */
    class BattleBuff2 extends BattleBuff1 {
        constructor() {
            super(...arguments);
            this._damageType = exports.DamageType.Skill;
            this._defaultUnitType = "3";
            this._defaultAtrType = 1;
        }
        /**其他属性值
         * （1+（普攻伤害加成-普攻伤害减免）
         * 最小值2000
        */
        getAtrPer(actor, beHit, inResult, targetResult) {
            // let add: number = actor.attrComp.getOriAtrValue(AtrType.AtrType_Skill_Add);
            // let reduce: number = beHit.attrComp.getOriAtrValue(AtrType.AtrType_Skill_Reduce);
            // if (inResult && inResult.addAtr) {
            //     add = FNumber.value(add).add(ObjectUtil.getKVnumberValue(inResult.addAtr, AtrType.AtrType_Skill_Add)).value;
            //     reduce = FNumber.value(reduce).add(ObjectUtil.getKVnumberValue(inResult.addAtr, AtrType.AtrType_Skill_Reduce)).value;
            // }
            // if (targetResult && targetResult.addAtr) {
            //     add = FNumber.value(add).add(ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_Skill_Add)).value;
            //     reduce = FNumber.value(reduce).add(ObjectUtil.getKVnumberValue(targetResult.addAtr, AtrType.AtrType_Skill_Reduce)).value;
            // }
            // let baseValue: number = this.getBaseAtrPer(actor, beHit, inResult, targetResult);
            // let valueTmp: number = FNumber.value(10000).add(baseValue).add(add).sub(reduce).value;
            // valueTmp = Math.max(2000, valueTmp);
            // valueTmp = FNumber.value(valueTmp).div(BattleCommon.AttributeMultiplying).value;
            // return valueTmp;
            return 10000;
        }
        exec(abilityParam, inResult) {
            let targets = this.findExecTarget(abilityParam);
            if (!targets) {
                return null;
            }
            let abilityParamTmp = ObjectUtil.deepClone(abilityParam);
            let inResultTmp = ObjectUtil.deepClone(inResult);
            for (let i = 0, leni = targets.length; i < leni; i++) {
                let beHit = targets[i];
                if (!beHit) {
                    continue;
                }
                abilityParamTmp.beHitUid = beHit.uid;
                super.exec(abilityParamTmp, inResultTmp);
            }
            return null;
        }
        recordHit(target, skillId) {
            // 记录命中
            this._owner.buffComp.recordHitUnit(target.uid);
            // // 普攻
            // this._owner.buffComp.recordNormalHitUnit(target.uid);
        }
    }

    /**释放技能 */
    class BattleBuff200 extends BattleBuff {
        exec(param, inResult) {
            var _a;
            // let skillGroup: number = NumberUtil.myParseInt(this._config.param4);
            // 技能目标
            let target;
            if (this._config.param3) {
                target = this.findExecTarget(param, this._config.param3)[0];
            }
            // 释放技能
            let skillActors = this.findExecTarget(param);
            if (skillActors) {
                let skillGroups = this._config.param4.split("#");
                for (let j = 0, lenj = skillActors.length; j < lenj; j++) {
                    let skillActor = skillActors[j];
                    for (let i = 0, leni = skillGroups.length; i < leni; i++) {
                        let skillGroup = NumberUtil.myParseInt(skillGroups[i]);
                        if (param.skill && param.skill.canTriggerBySelf != 1 && param.skill.skillGroup == skillGroup) {
                            return;
                        }
                        let skillid = (_a = skillActor.skillComp.getSkillByGroup(skillGroup)) === null || _a === void 0 ? void 0 : _a.skillId;
                        if (skillid) {
                            skillActor.skillComp.updateHandleSkill(skillid, target);
                        }
                    }
                }
            }
            return null;
        }
    }

    /**添加buff */
    class BattleBuff201 extends BattleBuff {
        exec(param, inResult) {
            let addBuffIds;
            if (this._config.modify) {
                let buffModify = battle.config.getBuffModify(this._config.modify);
                if (buffModify.type == exports.BuffModifyType.Ability) {
                    let conditionParam = {};
                    if (inResult) {
                        conditionParam.hitCount2 = inResult.hitCount2 ? inResult.hitCount2 : 1;
                        conditionParam.hitCount3 = inResult.hitCount3 ? inResult.hitCount3 : 1;
                    }
                    let doCount = this.checkCondition(buffModify.condition, conditionParam);
                    if (doCount > 0) {
                        addBuffIds = buffModify.param4.split("#");
                        if (buffModify.param3 == "2") {
                            addBuffIds = this._owner.battleMgr.getRandom().randomInArr(addBuffIds, 1);
                        }
                    }
                }
            }
            if (!addBuffIds) {
                addBuffIds = this._config.param4.split("#");
                if (this._config.param3 == "2") {
                    addBuffIds = this._owner.battleMgr.getRandom().randomInArr(addBuffIds, 1);
                }
            }
            let addParam = {};
            if (param.damageValue) {
                addParam.damage = param.damageValue;
            }
            if (inResult && inResult.findTarget3) {
                addParam.findTarget3 = ObjectUtil.deepClone(inResult.findTarget3);
            }
            if (inResult && inResult.findTarget1) {
                addParam.findTarget1 = ObjectUtil.deepClone(inResult.findTarget1);
            }
            let addCount = NumberUtil.myParseInt(this._config.param2);
            if (!addCount) {
                addCount = 1;
            }
            addCount = addCount * this._layers.length;
            let targets = this.findExecTarget(param);
            let skillId = this.getAddSkillId();
            if (param.skill) {
                skillId = param.skill.id;
            }
            let behitId = param.beHitUid ? param.beHitUid : "";
            for (let k = 0; k < param.doCount; k++) {
                for (let j = 0, lenj = targets.length; j < lenj; j++) {
                    let target = targets[j];
                    let addNow = this._config.param1 == "1";
                    for (let i = 0, leni = addBuffIds.length; i < leni; i++) {
                        let buffId = NumberUtil.myParseInt(addBuffIds[i]);
                        let buffConfig = battle.config.getBuff(buffId);
                        if (!buffConfig || ((buffConfig.ability != exports.AbilityEnum.NoDie && buffConfig.ability != exports.AbilityEnum.LockHp) && target.isDie)) {
                            continue;
                        }
                        if (addNow) {
                            target.buffComp.addBuff(param.actorUid, buffId, skillId, addCount, behitId, addParam);
                        }
                        else {
                            target.buffComp.recordBuff(param.actorUid, buffId, skillId, addCount, behitId, addParam);
                        }
                    }
                }
            }
            return null;
        }
    }

    /**改变行为逻辑 */
    class BattleBuff202 extends BattleBuff {
        /**添加 */
        onAdd() {
            this._owner.behavior.updateOpt(NumberUtil.myParseInt(this._config.param4), true);
        }
        onRemove() {
            super.onRemove();
            this._owner.buffComp.refreshBehavior();
        }
        /**刷新行为 */
        refreshBehavior() {
            this._owner.behavior.updateOpt(NumberUtil.myParseInt(this._config.param4), true);
        }
    }

    /**驱散debuff */
    class BattleBuff203 extends BattleBuff {
        exec(param, inResult) {
            for (let k = 0; k < param.doCount; k++) {
                let targets = this.findExecTarget(param);
                for (let j = 0, lenj = targets.length; j < lenj; j++) {
                    let target = targets[j];
                    if (target.isRealDie()) {
                        continue;
                    }
                    target.buffComp.clearDebuff(NumberUtil.myParseInt(this._config.param3));
                }
            }
            return null;
        }
    }

    /**替换技能 */
    class BattleBuff204 extends BattleBuff {
        onAdd() {
            this._ability = { realSkillId: NumberUtil.myParseInt(this._config.param4) };
        }
    }

    /**触发其他buff */
    class BattleBuff205 extends BattleBuff {
        exec(param, inResult) {
            let rtn = {};
            for (let k = 0; k < param.doCount; k++) {
                let targets = this.findExecTarget(param);
                for (let j = 0, lenj = targets.length; j < lenj; j++) {
                    let target = targets[j];
                    let buffids = this._config.param4.split("#");
                    for (let i = 0, leni = buffids.length; i < leni; i++) {
                        let buffTmp = target.buffComp.getBuffById(NumberUtil.myParseInt(buffids[i]));
                        if (buffTmp) {
                            rtn = BattleCommon.MergeBuffAbilityReturn(rtn, buffTmp.doAbility(param, inResult));
                        }
                    }
                }
            }
            return rtn;
        }
    }

    /**执行多个效果 */
    class BattleBuff206 extends BattleBuff {
        onAdd() {
            this._doBuffs = [];
            let buffIds = this._config.param4.split("#");
            for (let i = 0, leni = buffIds.length; i < leni; i++) {
                let config = battle.config.getBuff(NumberUtil.myParseInt(buffIds[i]));
                if (!config) {
                    return;
                }
                let buff = BuffFactory.creatBuff(config.ability);
                buff.initBuff(this._owner, config, true);
                buff.add(this._actorId, this._addSkillId, 1, this._actorId);
                buff.updateAbilityForce();
                this._doBuffs.push(buff);
            }
        }
        exec(param, inResult) {
            let actor = this._owner.battleMgr.getUnit(this._actorId, true);
            let abilityTmp = {};
            let paramTmp = ObjectUtil.deepClone(param);
            if (actor) {
                // paramTmp.actorUid = this._actorId;
                // let targets: BattleUnit[] = this.findExecTarget(paramTmp);
                // for (let j: number = 0, lenj: number = targets.length; j < lenj; j++) {
                // let target: BattleUnit = targets[j];
                // paramTmp.targetUid = target.uid;
                for (let i = 0, leni = this._doBuffs.length; i < leni; i++) {
                    if (this._doBuffs[i].checkRate()) {
                        abilityTmp = BattleCommon.MergeBuffAbilityReturn(abilityTmp, this._doBuffs[i].doAbility(paramTmp, inResult));
                    }
                }
                // }
            }
            return abilityTmp;
        }
    }

    /**删除buff */
    class BattleBuff207 extends BattleBuff {
        exec(param, inResult) {
            // // 无敌
            // return;
            let count = NumberUtil.myParseInt(this._config.param2);
            if (!count) {
                count = 0;
            }
            let buffIds;
            let buffTypes;
            if (this._config.param1 == "2") {
                buffTypes = this._config.param4.split("#");
                if (this._config.param3 == "2") {
                    buffTypes = this._owner.battleMgr.getRandom().randomInArr(buffTypes, 1);
                }
            }
            else {
                buffIds = this._config.param4.split("#");
                if (this._config.param3 == "2") {
                    buffIds = this._owner.battleMgr.getRandom().randomInArr(buffIds, 1);
                }
            }
            for (let k = 0; k < param.doCount; k++) {
                let targets = this.findExecTarget(param);
                for (let j = 0, lenj = targets.length; j < lenj; j++) {
                    let target = targets[j];
                    if (!target) {
                        continue;
                    }
                    if (buffIds) {
                        for (let i = 0, leni = buffIds.length; i < leni; i++) {
                            target.buffComp.delBuff(NumberUtil.myParseInt(buffIds[i]), count);
                        }
                    }
                    if (buffTypes) {
                        for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                            target.buffComp.delBuffByType(NumberUtil.myParseInt(buffTypes[i]), count);
                        }
                    }
                }
            }
            return null;
        }
    }

    /**恐惧 */
    class BattleBuff208 extends BattleBuff {
        onAdd() {
            let actor = this._owner.battleMgr.getUnit(this._actorId);
            if (actor) {
                let moveVec = this._owner.pos.Sub(actor.pos);
                if (moveVec.Equal(BVec3.Zero)) {
                    let dirSign = this._owner.behavior.getDir() == exports.UnitDir.Right ? -0.5 : 0.5;
                    let randomx = FNumber.value(dirSign).mul(actor.battleMgr.getRandom().random()).add(dirSign).value;
                    let randomy = FNumber.value(actor.battleMgr.getRandom().random()).sub(0.5).value;
                    moveVec.setTo(randomx, randomy);
                }
                if (moveVec.x > 0.1) {
                    this._owner.behavior.updateDir(exports.UnitDir.Right);
                }
                else if (moveVec.x < -0.1) {
                    this._owner.behavior.updateDir(exports.UnitDir.Left);
                }
                let moveSpeed = this._owner.attrComp.moveSpeed;
                let moveDis = FNumber.value(moveSpeed).mul(this._config.time).div(1000).value;
                let moveTargetPos = this._owner.getMap().fixToValidPos(moveVec.Normalized().Times(moveDis).Add(this._owner.pos));
                // 校正
                moveDis = this._owner.pos.Sub(moveTargetPos).Mag();
                let moveSpeedTmp = FNumber.value(moveDis).mul(1000).div(this._config.time).value;
                moveSpeed = Math.max(moveSpeed, moveSpeedTmp);
                this._ability = {
                    moveSpeed: moveSpeed,
                    moveTargetPos: moveTargetPos
                };
            }
        }
    }

    // 定义常量，提高代码可读性
    // const SQRT_3_DIV_2 = 0.866025404;
    const SQRT_3 = 1.73205080756;
    /**
     * 六边形工具类
     *      +z(r)
     *  -x      -y
     *  +y(s)   +x(q)
     *      -z
     */
    class HexUtil {
        /**把hex坐标转为像素坐标 */
        static hexToPixel(hexX, hexY, hexZ) {
            let x = (hexX * HexUtil.InnerRadius * 2) + (hexZ * HexUtil.InnerRadius); // (hexX + hexZ * 0.5) * HexUtil.InnerRadius * 2;
            let y = hexZ * HexUtil.OuterRadius * 1.5;
            // let x = FNumber.value(hexZ).mul(0.5).add(hexX).value;
            // x = FNumber.value(x).mul(HexUtil.InnerRadius).mul(2).value;
            // let y = FNumber.value(hexZ).mul(HexUtil.OuterRadius).mul(1.5).value;
            return bv3(x, y);
        }
        /**把像素坐标转换成hex坐标 */
        static pixelToHex(x, y) {
            return this.cartesianToCube(x, y);
            // // 先转成平行四边形坐标系
            // let rValue: number = FNumber.value(pixel.y).mul(2).div(SQRT_3).value;
            // let r: number = Math.round(FNumber.value(rValue).div(HexUtil.InnerRadius).div(2).value);
            // let qValue: number = FNumber.value(pixel.y).div(SQRT_3).value;
            // qValue = FNumber.value(pixel.x).sub(qValue).value;
            // let q: number = Math.round(FNumber.value(qValue).div(HexUtil.InnerRadius).div(2).value);
            // return [q, r];
        }
        static cartesianToCube(x, y) {
            const q = (SQRT_3 / 3 * x - 1 / 3 * y) / HexUtil.OuterRadius;
            const r = (2 / 3 * y) / HexUtil.OuterRadius;
            // 初步计算的浮点坐标
            let fx = q;
            let fz = r;
            let fy = -fx - fz;
            // 四舍五入到最接近的整数坐标
            let rx = Math.round(fx);
            let ry = Math.round(fy);
            let rz = Math.round(fz);
            const xDiff = Math.abs(rx - fx);
            const yDiff = Math.abs(ry - fy);
            const zDiff = Math.abs(rz - fz);
            if (xDiff > yDiff && xDiff > zDiff) {
                rx = -ry - rz;
            }
            else if (yDiff > zDiff) {
                ry = -rx - rz;
            }
            else {
                rz = -rx - ry;
            }
            if (rx == -0) {
                rx = 0;
            }
            if (ry == -0) {
                ry = 0;
            }
            if (rz == -0) {
                rz = 0;
            }
            return { x: rx, y: ry, z: rz };
        }
        /**找到距离目标点固定距离的所有格子
         * @param q 目标点的q坐标
         * @param r 目标点的r坐标
         * @param distance 距离
         * @param inner 是否包含距离之内
         */
        static findHexesAroundPoint(q, r, distance, inner) {
            let results = [];
            let startq;
            let endq;
            for (let dz = -distance; dz <= distance; dz++) {
                startq = Math.max(-distance, -dz - distance);
                endq = Math.min(distance, -dz + distance);
                if (inner || Math.abs(dz) == distance) {
                    for (let dx = startq; dx <= endq; dx++) {
                        results.push({ x: q + dx, z: r + dz, y: -q - dx - r - dz });
                    }
                }
                else {
                    results.push({ x: q + startq, z: r + dz, y: -q - startq - r - dz });
                    results.push({ x: q + endq, z: r + dz, y: -q - endq - r - dz });
                }
            }
            return results;
        }
        /**找到距离目标点固定距离的所有格子
         * @param q 目标点的q坐标
         * @param r 目标点的r坐标
         * @param distance 距离
         * @param inner 是否包含距离之内
         */
        static findHexesAroundPointBys(q, r, distance, inner) {
            if (distance == 0) {
                return [{ x: q, y: r, z: -q - r }];
            }
            let results = [];
            let startq;
            let endq;
            let s = -q - r;
            let stepFunc;
            let checkFunc;
            if (distance > 0) {
                stepFunc = (num) => {
                    return num + 1;
                };
                checkFunc = (num) => {
                    return num <= distance;
                };
            }
            else {
                stepFunc = (num) => {
                    return num - 1;
                };
                checkFunc = (num) => {
                    return num >= distance;
                };
            }
            let disTmp = Math.abs(distance);
            for (let ds = -distance; checkFunc(ds); ds = stepFunc(ds)) {
                startq = Math.max(-disTmp, -ds - disTmp);
                endq = Math.min(disTmp, -ds + disTmp);
                if (inner || Math.abs(ds) == disTmp) {
                    for (let dx = startq; dx <= endq; dx++) {
                        if (dx == 0 && ds == 0) {
                            continue;
                        }
                        results.push({ x: q + dx, y: s + ds, z: r - dx - ds });
                    }
                }
                else {
                    results.push({ x: q + startq, y: s + ds, z: r - startq - ds });
                    results.push({ x: q + endq, y: s + ds, z: r - endq - ds });
                }
            }
            return results;
        }
        // 计算两个六边形之间的距离
        static distance(hex1, hex2) {
            return (Math.abs(hex1.x - hex2.x) + Math.abs(hex1.z - hex2.z) + Math.abs(hex1.y - hex2.y)) / 2;
        }
        // 计算两个六边形之间的距离
        static distanceTile(hex1, hex2) {
            return Math.max(Math.max(Math.abs(hex1.x - hex2.x), Math.abs(hex1.z - hex2.z)), Math.abs(hex1.y - hex2.y));
        }
    }
    HexUtil.OuterRadius = 60;
    HexUtil.InnerRadius = FNumber.value(HexUtil.OuterRadius).mul(SQRT_3).div(2).value; // 51.96
    // // 假设 Sqrt_3 和 HexTileOuterRadius 已经定义
    // const Sqrt_3 = Math.sqrt(3);
    // const HexTileOuterRadius = 1;
    // /**
    //  * 将世界坐标（UnityPos) 转换到目标 HexGrid 下标
    //  * （这个方法不是很精确）
    //  * @param unityX 世界坐标
    //  * @param unityZ 世界坐标
    //  * @returns 所属的 HexTile 坐标
    //  */
    // function UnityPosToHexGrid(unityX: number, unityZ: number): HexGrid {
    //     const q = (Sqrt_3 / 3.0 * unityX) - (1.0 / 3.0 * unityZ);
    //     const r = 2.0 / 3.0 * unityZ;
    //     return new HexGrid(HexRound(q / HexTileOuterRadius, r / HexTileOuterRadius));
    // }
    // /**
    //  * 坐标规整；
    //  */
    // function HexRound(q: number, r: number): Vector2Int {
    //     const s = -q - r;
    //     const rq = Math.round(q);
    //     const rr = Math.round(r);
    //     const rs = Math.round(s);
    //     const q_diff = Math.abs(rq - q);
    //     const r_diff = Math.abs(rr - r);
    //     const s_diff = Math.abs(rs - s);
    //     if (q_diff > r_diff && q_diff > s_diff) {
    //         rq = -rr - rs;
    //     } else if (r_diff > s_diff) {
    //         rr = -rq - rs;
    //     }
    //     return new Vector2Int(rq, rr);
    // }

    /**闪烁 */
    class BattleBuff209 extends BattleBuff {
        constructor() {
            super(...arguments);
            this._blinkPos = bv3();
        }
        onInit() {
            this._targetType = NumberUtil.myParseInt(this._config.param1) || 1; // 目标类型 1:目标
            this._posType = NumberUtil.myParseInt(this._config.param2) || 1; // 位置类型 1：背后->侧边->前面 2：前面->侧边->背后 3：随机
            this._dis = NumberUtil.myParseInt(this._config.param3) || 1; // 距离
        }
        exec(param, inResult) {
            let target;
            if (this._targetType == 1) {
                target = this._owner.battleMgr.getUnit(param.beHitUid);
            }
            if (!target) {
                return;
            }
            this._blinkPos.setTo(0, 0);
            let roundCell = []; // 周边位置
            let validCell = []; // 有效位置
            if (this._posType == 2) {
                roundCell = HexUtil.findHexesAroundPointBys(target.tile.x, target.tile.z, -this._dis, true);
            }
            else {
                roundCell = HexUtil.findHexesAroundPointBys(target.tile.x, target.tile.z, this._dis, true);
            }
            let map = this._owner.battleMgr.getMap();
            for (let i = 0, leni = roundCell.length; i < leni; i++) {
                if (map.getCellTile(roundCell[i])) {
                    validCell.push(roundCell[i]);
                    if (!map.isOccupyCell(roundCell[i])) {
                        this._blinkPos.setTo(map.getCellPos(roundCell[i]));
                        validCell = null;
                        break;
                    }
                }
            }
            if (validCell) {
                // 还未找到目标点
                this._blinkPos.setTo(map.getCellPos(validCell[0]));
            }
            if (target.pos.x - this._blinkPos.x > 1) {
                this._owner.behavior.updateDir(exports.UnitDir.Right);
            }
            else if (target.pos.x - this._blinkPos.x < -1) {
                this._owner.behavior.updateDir(exports.UnitDir.Left);
            }
            this._owner.setPos(this._blinkPos.x, this._blinkPos.y);
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitBlink, { uid: this._owner.uid, unitBlink: { posx: this._blinkPos.x, posy: this._blinkPos.y } });
            return null;
        }
    }

    /**删除buff(按比例) */
    class BattleBuff210 extends BattleBuff {
        exec(param, inResult) {
            let value = NumberUtil.myParseInt(this._config.param2);
            if (!value) {
                value = 0;
            }
            let buffIds;
            let buffTypes;
            if (this._config.param1 == "2") {
                buffTypes = this._config.param4.split("#");
                if (this._config.param3 == "2") {
                    buffTypes = this._owner.battleMgr.getRandom().randomInArr(buffTypes, 1);
                }
            }
            else {
                buffIds = this._config.param4.split("#");
                if (this._config.param3 == "2") {
                    buffIds = this._owner.battleMgr.getRandom().randomInArr(buffIds, 1);
                }
            }
            for (let k = 0; k < param.doCount; k++) {
                let targets = this.findExecTarget(param);
                for (let j = 0, lenj = targets.length; j < lenj; j++) {
                    let target = targets[j];
                    if (!target || target.isRealDie()) {
                        continue;
                    }
                    if (buffIds) {
                        for (let i = 0, leni = buffIds.length; i < leni; i++) {
                            target.buffComp.delBuff(NumberUtil.myParseInt(buffIds[i]), 0, value);
                        }
                    }
                    if (buffTypes) {
                        for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                            target.buffComp.delBuffByType(NumberUtil.myParseInt(buffTypes[i]), 0, value);
                        }
                    }
                }
            }
            return null;
        }
    }

    /**改变体型大小 */
    class BattleBuff211 extends BattleBuff {
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.unitScale = NumberUtil.myParseInt(this._config.param3);
            this._layers[index].updateAbility(ability);
        }
        /**刷新buff加成 */
        updateAbility() {
            let preValue = 0;
            if (this._ability && this._ability.unitScale) {
                preValue = this._ability.unitScale;
            }
            else {
                this._ability = { unitScale: 0 };
            }
            this._ability.unitScale = 0;
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._ability.unitScale += this._layers[i].getAbility().unitScale;
            }
            this._owner.attrComp.updateScale(this._ability.unitScale - preValue);
        }
        onRemove() {
            super.onRemove();
            let preValue = 0;
            if (this._ability && this._ability.unitScale) {
                preValue = this._ability.unitScale;
            }
            if (preValue != 0) {
                this._owner.attrComp.updateScale(-preValue);
            }
        }
    }

    /**击退 */
    class BattleBuff212 extends BattleBuff {
        onInit() {
            this._moveTime = this._config.time ? this._config.time : 100;
            this._moveDis = this._config.param3 ? NumberUtil.myParseInt(this._config.param3) : 100;
        }
        onAdd() {
            let actor = this._owner.battleMgr.getUnit(this._actorId);
            if (actor) {
                let moveVec = this._owner.pos.Sub(actor.pos);
                if (moveVec.Equal(BVec3.Zero)) {
                    let dirSign = this._owner.behavior.getDir() == exports.UnitDir.Right ? -0.5 : 0.5;
                    let randomx = FNumber.value(dirSign).mul(actor.battleMgr.getRandom().random()).add(dirSign).value;
                    let randomy = FNumber.value(actor.battleMgr.getRandom().random()).sub(0.5).value;
                    moveVec.setTo(randomx, randomy);
                }
                moveVec = moveVec.Normalized();
                let moveSpeed = FNumber.value(this._moveDis).mul(1000).div(this._moveTime).value;
                let moveTargetPos = this._owner.getMap().fixToValidPos(moveVec.Times(this._moveDis).Add(this._owner.pos));
                // 校正
                let moveDis = this._owner.pos.Sub(moveTargetPos).Mag();
                let moveSpeedTmp = FNumber.value(moveDis).mul(1000).div(this._moveTime).value;
                moveSpeed = Math.max(moveSpeed, moveSpeedTmp);
                this._ability = {
                    moveSpeed: moveSpeed,
                    moveTargetPos: moveTargetPos
                };
                this._owner.skillComp.interruptSkill();
            }
        }
    }

    /**减少技能cd */
    class BattleBuff213 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            let ability = { skillSubCd: {}, skillSubCdPer: {} };
            let skillGroup = NumberUtil.myParseInt(this._config.param4);
            if (this._config.param3) {
                ability.skillSubCd[skillGroup] = NumberUtil.myParseInt(this._config.param3);
            }
            if (this._config.param1) {
                ability.skillSubCdPer[skillGroup] = NumberUtil.myParseInt(this._config.param1);
            }
            this._layers[index].updateAbility(ability);
        }
        updateAbility() {
            let preValue = 0;
            let preValuePer = 0;
            let skillGroup = NumberUtil.myParseInt(this._config.param4);
            if (this._ability.skillSubCd) {
                preValue = NumberUtil.myParseInt(this._ability.skillSubCd[skillGroup]);
            }
            else {
                this._ability.skillSubCd = {};
            }
            if (this._ability.skillSubCdPer) {
                preValuePer = NumberUtil.myParseInt(this._ability.skillSubCdPer[skillGroup]);
            }
            else {
                this._ability.skillSubCdPer = {};
            }
            let curValue = 0;
            let curValuePer = 0;
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                if (this._layers[i].getAbility().skillSubCd) {
                    curValue += NumberUtil.myParseInt(this._layers[i].getAbility().skillSubCd[skillGroup]);
                }
                if (this._layers[i].getAbility().skillSubCdPer) {
                    curValuePer += NumberUtil.myParseInt(this._layers[i].getAbility().skillSubCdPer[skillGroup]);
                }
            }
            if (curValue > 0) {
                this._ability.skillSubCd[skillGroup] = curValue;
            }
            if (curValuePer > 0) {
                this._ability.skillSubCdPer[skillGroup] = curValuePer;
            }
            if (!this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateSkillSubCd(skillGroup, curValue - preValue, curValuePer - preValuePer);
            }
        }
        onRemove() {
            super.onRemove();
            let preValue = 0;
            let preValuePer = 0;
            let skillGroup = NumberUtil.myParseInt(this._config.param4);
            if (this._ability) {
                if (this._ability.skillSubCd) {
                    preValue = NumberUtil.myParseInt(this._ability.skillSubCd[skillGroup]);
                }
                if (this._ability.skillSubCdPer) {
                    preValuePer = NumberUtil.myParseInt(this._ability.skillSubCdPer[skillGroup]);
                }
            }
            if ((preValue != 0 || preValuePer != 0) && !this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateSkillSubCd(skillGroup, -preValue, -preValuePer);
            }
        }
        exec(param, inResult) {
            var _a;
            let skillGroup = NumberUtil.myParseInt(this._config.param4);
            let preValue = 0;
            let preValuePer = 0;
            let force = this._config.param2 == "1";
            if (this._ability) {
                if (this._ability.skillSubCd) {
                    preValue = NumberUtil.myParseInt(this._ability.skillSubCd[skillGroup]);
                }
                if (this._ability.skillSubCdPer) {
                    preValuePer = NumberUtil.myParseInt(this._ability.skillSubCdPer[skillGroup]);
                }
            }
            if ((preValue != 0 || preValuePer != 0)) {
                for (let j = 0; j < param.doCount; j++) {
                    let targets = this.findExecTarget(param);
                    for (let i = 0, leni = targets.length; i < leni; i++) {
                        if (targets[i].isDie) {
                            continue;
                        }
                        (_a = targets[i].skillComp.getSkillByGroup(skillGroup)) === null || _a === void 0 ? void 0 : _a.subCdByBuff(preValue, preValuePer, force);
                    }
                }
            }
            return null;
        }
    }

    /**拉人 */
    class BattleBuff214 extends BattleBuff {
        onInit() {
            this._moveTime = this._config.time ? this._config.time : 100;
            this._moveRange = this._config.param3 ? NumberUtil.myParseInt(this._config.param3) : 50;
        }
        onAdd() {
            let actor = this._owner.battleMgr.getUnit(this._actorId);
            if (actor) {
                let moveVec = actor.pos.Sub(this._owner.pos).Normalized();
                if (moveVec.Equal(BVec3.Zero)) {
                    let dirSign = this._owner.behavior.getDir() == exports.UnitDir.Right ? -0.5 : 0.5;
                    let randomx = FNumber.value(dirSign).mul(actor.battleMgr.getRandom().random()).add(dirSign).value;
                    let randomy = FNumber.value(actor.battleMgr.getRandom().random()).sub(0.5).value;
                    moveVec.setTo(randomx, randomy);
                }
                let moveDis = FNumber.value(BMath.distance(actor.pos, this._owner.pos)).sub(this._moveRange).value;
                moveDis = Math.max(moveDis, this._moveRange);
                let moveSpeed = FNumber.value(moveDis).mul(1000).div(this._moveTime).value;
                let moveTargetPos = this._owner.getMap().fixToValidPos(moveVec.Times(moveDis).Add(this._owner.pos));
                // 校正
                moveDis = this._owner.pos.Sub(moveTargetPos).Mag();
                let moveSpeedTmp = FNumber.value(moveDis).mul(1000).div(this._moveTime).value;
                moveSpeed = Math.max(moveSpeed, moveSpeedTmp);
                this._ability = {
                    moveSpeed: moveSpeed,
                    moveTargetPos: moveTargetPos
                };
            }
        }
    }

    /**结算dot */
    class BattleBuff215 extends BattleBuff {
        exec(param, inResult) {
            let targets = this.findExecTarget(param);
            let buffTypes;
            if (this._config.param4) {
                buffTypes = this._config.param4.split("#");
            }
            for (let j = 0, lenj = targets.length; j < lenj; j++) {
                let target = targets[j];
                target.buffComp.settlementDot(NumberUtil.myParseInt(this._config.param3), buffTypes);
                if (target.isDie) {
                    this._owner.buffComp.triggerBuff(exports.TriggerEnum.SettlementKill, null, null, null);
                }
            }
            return null;
        }
    }

    /**嘲讽 */
    class BattleBuff216 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            if (NumberUtil.myParseInt(this._config.param3) == 1) {
                this._ability = {
                    tauntId: this._layers[index].getLayerParam().beHitId
                };
            }
            else {
                this._ability = {
                    tauntId: this._actorId
                };
            }
        }
        getExtraParam() {
            if (this._ability && this._ability.tauntId) {
                return { linkTarget: [this._ability.tauntId] };
            }
            else {
                return null;
            }
        }
    }

    /**添加免疫buff类型 */
    class BattleBuff217 extends BattleBuff {
        onInit() {
            this._immunityType = NumberUtil.myParseInt(this._config.param1);
            if (!this._immunityType) {
                this._immunityType = 1;
            }
        }
        updateLayerAbility(index, addParam) {
            let ability = { immunityBuffType: {}, immunityBuffAbility: {} };
            let buffTypes = this._config.param4.split("#");
            for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                let typeKey = NumberUtil.myParseInt(buffTypes[i]);
                if (this._immunityType == 1) {
                    ability.immunityBuffType[typeKey] = 1;
                }
                else {
                    ability.immunityBuffAbility[typeKey] = 1;
                }
            }
            this._layers[index].updateAbility(ability);
        }
        updateAbility() {
            let preValue = 0;
            let typeKeys = this._config.param4.split("#");
            if (this._immunityType == 1) {
                for (let i = 0, leni = typeKeys.length; i < leni; i++) {
                    let typeKey = NumberUtil.myParseInt(typeKeys[i]);
                    if (this._ability.immunityBuffType) {
                        preValue = NumberUtil.myParseInt(this._ability.immunityBuffType[typeKey]);
                    }
                    else {
                        this._ability.immunityBuffType = {};
                    }
                    let curValue = this._layers.length;
                    this._ability.immunityBuffType[typeKey] = curValue;
                    if (!this.isTriggerBuff()) {
                        this._owner.attrComp.updateBuffTypeImmunity(typeKey, curValue - preValue);
                    }
                }
            }
            else {
                for (let i = 0, leni = typeKeys.length; i < leni; i++) {
                    let typeKey = NumberUtil.myParseInt(typeKeys[i]);
                    if (this._ability.immunityBuffAbility) {
                        preValue = NumberUtil.myParseInt(this._ability.immunityBuffAbility[typeKey]);
                    }
                    else {
                        this._ability.immunityBuffAbility = {};
                    }
                    let curValue = this._layers.length;
                    this._ability.immunityBuffAbility[typeKey] = curValue;
                    if (!this.isTriggerBuff()) {
                        this._owner.attrComp.updateBuffAbilityImmunity(typeKey, curValue - preValue);
                    }
                }
            }
        }
        onRemove() {
            super.onRemove();
            let curValue = 0;
            let buffTypes = this._config.param4.split("#");
            if (!this.isTriggerBuff()) {
                for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                    let typeKey = NumberUtil.myParseInt(buffTypes[i]);
                    if (this._immunityType == 1) {
                        if (this._ability && this._ability.immunityBuffType) {
                            curValue = NumberUtil.myParseInt(this._ability.immunityBuffType[typeKey]);
                        }
                        this._owner.attrComp.updateBuffTypeImmunity(typeKey, -curValue);
                    }
                    else {
                        if (this._ability && this._ability.immunityBuffAbility) {
                            curValue = NumberUtil.myParseInt(this._ability.immunityBuffAbility[typeKey]);
                        }
                        this._owner.attrComp.updateBuffAbilityImmunity(typeKey, -curValue);
                    }
                }
            }
        }
    }

    /**修改buff添加次数 */
    class BattleBuff218 extends BattleBuff {
        onAdd() {
            this._ability = {
                addCount: NumberUtil.myParseInt(this._config.param3)
            };
        }
    }

    /**修改buff叠加上限 */
    class BattleBuff219 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            let ability = { buffOverlimit: {} };
            let buffTypes = this._config.param4.split("#");
            let value = NumberUtil.myParseInt(this._config.param3);
            for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                let buffType = NumberUtil.myParseInt(buffTypes[i]);
                if (this._config.param1 == "2") {
                    ability.buffOverlimit[buffType] = -value;
                }
                else {
                    ability.buffOverlimit[buffType] = value;
                }
            }
            this._layers[index].updateAbility(ability);
        }
        updateAbility() {
            let preValue = 0;
            let buffTypes = this._config.param4.split("#");
            for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                let buffType = NumberUtil.myParseInt(buffTypes[i]);
                if (this._ability.buffOverlimit) {
                    preValue = NumberUtil.myParseInt(this._ability.buffOverlimit[buffType]);
                }
                else {
                    this._ability.buffOverlimit = {};
                }
                let curValue = 0;
                for (let i = 0, leni = this._layers.length; i < leni; i++) {
                    if (this._layers[i].getAbility().buffOverlimit) {
                        curValue += NumberUtil.myParseInt(this._layers[i].getAbility().buffOverlimit[buffType]);
                    }
                }
                this._ability.buffOverlimit[buffType] = curValue;
                if (!this.isTriggerBuff()) {
                    this._owner.attrComp.updateBuffOverlimit(buffType, curValue - preValue);
                }
            }
        }
        onRemove() {
            super.onRemove();
            let curValue = 0;
            let buffTypes = this._config.param4.split("#");
            for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                let buffType = NumberUtil.myParseInt(buffTypes[i]);
                if (this._ability && this._ability.buffOverlimit) {
                    curValue = NumberUtil.myParseInt(this._ability.buffOverlimit[buffType]);
                }
                if (!this.isTriggerBuff()) {
                    this._owner.attrComp.updateBuffOverlimit(buffType, -curValue);
                }
            }
        }
        exec(param, inResult) {
            let curValue = 0;
            let buffTypes = this._config.param4.split("#");
            for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                let buffType = NumberUtil.myParseInt(buffTypes[i]);
                if (this._ability && this._ability.buffOverlimit) {
                    curValue = NumberUtil.myParseInt(this._ability.buffOverlimit[buffType]);
                }
                this._owner.attrComp.updateBuffOverlimit(buffType, curValue);
            }
            return null;
        }
    }

    /**替换找人 */
    class BattleBuff220 extends BattleBuff {
        onAdd() {
            this._ability = {
                skillFind1: NumberUtil.myParseInt(this._config.param1),
                skillFind2: this._config.param2,
                skillFind3: this._config.param3
            };
        }
    }

    class ArrayUtil {
        /**
         * 合并多个数组并去除重复项
         * @param arrays 要合并的数组列表
         * @returns 合并后的无重复数组
         */
        static mergeUnique(...arrays) {
            // 使用 Map 来去重，key 和 value 都使用元素本身
            const uniqueMap = new Map();
            // 遍历所有数组
            arrays.forEach(arr => {
                arr.forEach(item => {
                    uniqueMap.set(item, item);
                });
            });
            // 将 Map 的值转回数组
            return Array.from(uniqueMap.values());
        }
        /**
         * 合并多个对象数组并根据指定的键去除重复项
         * @param key 用于判断重复的键名
         * @param arrays 要合并的对象数组列表
         * @returns 合并后的无重复对象数组
         */
        static mergeUniqueByKey(key, ...arrays) {
            const uniqueMap = new Map();
            arrays.forEach(arr => {
                arr.forEach(item => {
                    uniqueMap.set(item[key], item);
                });
            });
            return Array.from(uniqueMap.values());
        }
        /**
         * 将字符串按指定分隔符分割成数组
         * @param str 要分割的字符串
         * @param separator 分隔符，可以是字符串或字符串数组，默认为 ","
         * @param filterEmpty 是否过滤空字符串，默认为 true
         * @returns 分割后的数组
         */
        static splitToArray(str, separator = "#", filterEmpty = false) {
            if (!str) {
                return [];
            }
            let array;
            if (Array.isArray(separator)) {
                // 使用正则表达式一次性分割，避免多次遍历
                const regexStr = separator.map(sep => 
                // 转义特殊字符
                sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
                array = str.split(new RegExp(regexStr));
            }
            else {
                array = str.split(separator);
            }
            // 使用 for 循环过滤，避免创建新数组
            if (filterEmpty) {
                let validCount = 0;
                for (let i = 0; i < array.length; i++) {
                    if (array[i] !== "") {
                        if (i !== validCount) {
                            array[validCount] = array[i];
                        }
                        validCount++;
                    }
                }
                array.length = validCount;
            }
            return array;
        }
        /**
         * 将字符串按指定分隔符分割成数字数组
         * @param str 要分割的字符串
         * @param separator 分隔符，可以是字符串或字符串数组，默认为 ","
         * @param filterEmpty 是否过滤空字符串，默认为 true
         * @returns 分割后的数字数组
         */
        static splitToNumberArray(str, separator = "#", filterEmpty = false) {
            const strArray = this.splitToArray(str, separator, filterEmpty);
            // 使用 for 循环转换，避免创建中间数组
            const numbers = new Array(strArray.length);
            for (let i = 0; i < strArray.length; i++) {
                numbers[i] = NumberUtil.myParseInt(strArray[i]);
            }
            return numbers;
        }
        /**
         * 将字符串按多个分隔符分割成多维数组
         * @param str 要分割的字符串
         * @param separators 分隔符数组，按顺序分割
         * @param filterEmpty 是否过滤空字符串，默认为 true
         * @returns 分割后的多维数组
         */
        static splitToMultiArray(str, separators, filterEmpty = false) {
            if (!str || !separators.length) {
                return [];
            }
            // 预分配数组大小以避免动态扩容
            const result = new Array(16); // 初始大小可根据实际情况调整
            let resultLength = 0;
            // 获取当前层级的分隔符
            const separator = separators[0];
            // 手动分割字符串，避免 split 方法的开销
            let start = 0;
            let end = 0;
            const strLength = str.length;
            const sepLength = separator.length;
            while (end <= strLength) {
                // 找到分隔符或到达字符串末尾
                if (end === strLength || str.startsWith(separator, end)) {
                    const segment = str.slice(start, end);
                    // 过滤空字符串
                    if (!filterEmpty || segment !== "") {
                        if (separators.length > 1) {
                            // 递归处理下一层，复用数组
                            result[resultLength++] = this.splitToMultiArray(segment, separators.slice(1), filterEmpty);
                        }
                        else {
                            result[resultLength++] = segment;
                        }
                    }
                    start = end + sepLength;
                    end = start;
                }
                else {
                    end++;
                }
            }
            // 调整数组长度为实际大小
            result.length = resultLength;
            return result;
        }
        /**
         * 将字符串按多个分隔符分割成多维数字数组
         * @param str 要分割的字符串
         * @param separators 分隔符数组，按顺序分割
         * @param filterEmpty 是否过滤空字符串，默认为 true
         * @returns 分割后的多维数字数组
         */
        static splitToMultiNumberArray(str, separators, filterEmpty = false) {
            const array = this.splitToMultiArray(str, separators, filterEmpty);
            // 递归转换为数字，避免使用 map
            const convertToNumber = (arr) => {
                const result = new Array(arr.length);
                for (let i = 0; i < arr.length; i++) {
                    const item = arr[i];
                    result[i] = Array.isArray(item) ? convertToNumber(item) : NumberUtil.myParseInt(item);
                }
                return result;
            };
            return convertToNumber(array);
        }
    }

    /**复制buff */
    class BattleBuff221 extends BattleBuff {
        onInit() {
            this._buffKeys = ArrayUtil.splitToNumberArray(this._config.param4);
            let arrTmp = ArrayUtil.splitToNumberArray(this._config.param1);
            this._keyType = arrTmp[0];
            this._copyCount = arrTmp[1];
        }
        exec(param, inResult) {
            let sourceUnit;
            if (this._config.param3) {
                sourceUnit = this.findExecTarget(param, this._config.param3)[0];
            }
            else {
                sourceUnit = this._owner;
            }
            let addBuffIds = [];
            let highCountId;
            let highCount = 0;
            let copyCount = {};
            if (this._keyType == 1) {
                for (let i = 0, leni = this._buffKeys.length; i < leni; i++) {
                    let buffIdTmp = this._buffKeys[i];
                    let countTmp = sourceUnit.buffComp.getBuffCountById(buffIdTmp);
                    if (countTmp > 0) {
                        addBuffIds.push(buffIdTmp);
                        copyCount[buffIdTmp] = countTmp;
                        if (highCount < countTmp) {
                            highCount = countTmp;
                            highCountId = buffIdTmp;
                        }
                    }
                }
            }
            else if (this._keyType == 2) {
                for (let i = 0, leni = this._buffKeys.length; i < leni; i++) {
                    let buffTypeTmp = this._buffKeys[i];
                    let buffMap = sourceUnit.buffComp.getBuffsByType(buffTypeTmp);
                    if (buffMap) {
                        for (const buff of buffMap.values()) {
                            let buffIdTmp = buff.getConfig().id;
                            let countTmp = buff.getCount();
                            addBuffIds.push(buffIdTmp);
                            copyCount[buffIdTmp] = countTmp;
                            if (highCount < countTmp) {
                                highCount = countTmp;
                                highCountId = buffIdTmp;
                            }
                        }
                    }
                }
            }
            if (this._copyCount && this._copyCount > 0) {
                addBuffIds = this._owner.battleMgr.getRandom().randomInArr(addBuffIds, this._copyCount);
            }
            if (this._config.param2 == "2") {
                highCount = 0;
                for (let i = 0, leni = addBuffIds.length; i < leni; i++) {
                    if (highCount < copyCount[addBuffIds[i]]) {
                        highCountId = addBuffIds[i];
                        highCount = copyCount[highCountId];
                    }
                }
                copyCount = {};
                copyCount[highCountId] = highCount;
            }
            else if (this._config.param2 == "3") ;
            else {
                copyCount = {};
            }
            let skillId = this.getAddSkillId();
            if (param.skill) {
                skillId = param.skill.id;
            }
            let targets = this.findExecTarget(param);
            for (let j = 0, lenj = targets.length; j < lenj; j++) {
                let target = targets[j];
                for (let i = 0, leni = addBuffIds.length; i < leni; i++) {
                    let behitId = param.beHitUid ? param.beHitUid : "";
                    let addCount = copyCount[addBuffIds[i]] ? copyCount[addBuffIds[i]] : 1;
                    target.buffComp.recordBuff(param.actorUid, NumberUtil.myParseInt(addBuffIds[i]), skillId, addCount, behitId);
                }
            }
            return null;
        }
    }

    /**刷新buff时间 */
    class BattleBuff222 extends BattleBuff {
        exec(param, inResult) {
            let buffIds = this._config.param4.split("#");
            let buffTypes = this._config.param4.split("#");
            let targets = this.findExecTarget(param);
            for (let j = 0, lenj = targets.length; j < lenj; j++) {
                let target = targets[j];
                if (this._config.param1 == "1") {
                    for (let i = 0, leni = buffIds.length; i < leni; i++) {
                        target.buffComp.resetTime(NumberUtil.myParseInt(buffIds[i]), null);
                    }
                }
                else if (this._config.param1 == "2") {
                    for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                        target.buffComp.resetTime(null, NumberUtil.myParseInt(buffTypes[i]));
                    }
                }
            }
            return null;
        }
    }

    /**召唤 */
    class BattleBuff223 extends BattleBuff {
        exec(param, inResult) {
            let unitAtr = this._owner.attrComp.getBaseAttrData();
            let summonConfigId = NumberUtil.myParseInt(this._config.param4);
            let summonConfig = battle.config.getSummon(summonConfigId);
            if (!summonConfig) {
                return;
            }
            let attr = {};
            for (let key in unitAtr) {
                let needPercent = ([exports.AtrType.Hp, exports.AtrType.HpAdd, exports.AtrType.Atk, exports.AtrType.AtkAdd].findIndex(item => item == NumberUtil.myParseInt(key)) >= 0);
                if (needPercent) {
                    attr[key] = FNumber.value(unitAtr[key]).mul(summonConfig.percent).div(BattleCommon.AttributeMultiplying).value;
                }
                else {
                    attr[key] = unitAtr[key];
                }
            }
            // 召唤位置相对单位
            let posUnit;
            switch (this._config.param3) {
                case "0":
                    posUnit = this._owner;
                    break;
                case "1":
                    break;
                case "2":
                    let unitIds = this._owner.skillComp.getSkillHitUids(param.skill.skillGroup);
                    if (unitIds) {
                        posUnit = this._owner.battleMgr.getUnit(unitIds[0], true);
                    }
                    break;
                default:
                    posUnit = this._owner;
                    break;
            }
            let summonPos;
            if (posUnit) {
                if (posUnit.behavior.getDir() == exports.UnitDir.Left) {
                    summonPos = bv3(posUnit.pos.x - 100, posUnit.pos.y);
                }
                else {
                    summonPos = bv3(posUnit.pos.x + 100, posUnit.pos.y);
                }
            }
            else {
                summonPos = bv3(-300, 0);
            }
            let randomX = this._owner.battleMgr.getRandom().randomInt(50, 0);
            let randomY = this._owner.battleMgr.getRandom().randomInt(50, 0);
            summonPos.setTo(summonPos.x + randomX, summonPos.y + randomY);
            let linkKeyDef = summonConfig.beAttackLink ? summonConfig.beAttackLink : "";
            let summonIndex = this._owner.createSummonId();
            let initData = {
                data: { clientId: `${this._owner.unitData.clientId}_s${summonIndex}`, type: exports.UnitType.Summon, configId: summonConfig.id, station: 1, survivalTime: summonConfig.survivalTime, linkKeyDef: linkKeyDef },
                atr: attr,
                pos: summonPos,
                teamId: this._owner.teamId,
                campId: this._owner.campId,
                skills: ArrayUtil.splitToNumberArray(summonConfig.skill),
                buffs: [],
                parentUnitUid: this._owner.uid,
            };
            this._owner.battleMgr.addUnit(initData);
            return null;
        }
    }

    /**增加存活时间 */
    class BattleBuff224 extends BattleBuff {
        exec(param, inResult) {
            this._owner.addSurvivalTime(NumberUtil.myParseInt(this._config.param3));
            return null;
        }
    }

    /**修改buff持续时间 */
    class BattleBuff225 extends BattleBuff {
        updateAbility() {
            let time = NumberUtil.myParseInt(this._config.param3);
            if (!time) {
                return;
            }
            let preValue = 0;
            let curValue = time * this.getCount();
            if (this._config.param1 == "1") {
                let buffIds = this._config.param4.split("#");
                if (!this._ability.buffExtendTimeById) {
                    this._ability.buffExtendTimeById = {};
                }
                for (let i = 0, leni = buffIds.length; i < leni; i++) {
                    let buffId = NumberUtil.myParseInt(buffIds[i]);
                    preValue = NumberUtil.myParseInt(this._ability.buffExtendTimeById[buffId]);
                    this._ability.buffExtendTimeById[buffId] = curValue;
                    if (!this.isTriggerBuff()) {
                        // 直接改变属性
                        this._owner.attrComp.updateBuffExtendTime(buffId, FNumber.value(curValue).sub(preValue).value);
                    }
                }
            }
            else if (this._config.param1 == "2") {
                let buffTypes = this._config.param4.split("#");
                if (!this._ability.buffExtendTimeByType) {
                    this._ability.buffExtendTimeByType = {};
                }
                for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                    let buffType = NumberUtil.myParseInt(buffTypes[i]);
                    preValue = NumberUtil.myParseInt(this._ability.buffExtendTimeByType[buffType]);
                    this._ability.buffExtendTimeByType[buffType] = curValue;
                    if (!this.isTriggerBuff()) {
                        // 直接改变属性
                        this._owner.attrComp.updateBuffExtendTime(buffType, FNumber.value(curValue).sub(preValue).value, true);
                    }
                }
            }
        }
        onRemove() {
            super.onRemove();
            if (!this.isTriggerBuff()) {
                let time = NumberUtil.myParseInt(this._config.param3);
                if (!time) {
                    return;
                }
                let preValue = 0;
                if (this._config.param1 == "1") {
                    let buffIds = this._config.param4.split("#");
                    if (!this._ability.buffExtendTimeById) {
                        this._ability.buffExtendTimeById = {};
                    }
                    for (let i = 0, leni = buffIds.length; i < leni; i++) {
                        let buffId = NumberUtil.myParseInt(buffIds[i]);
                        preValue = NumberUtil.myParseInt(this._ability.buffExtendTimeById[buffId]);
                        this._owner.attrComp.updateBuffExtendTime(buffId, -preValue);
                    }
                }
                else if (this._config.param1 == "2") {
                    let buffTypes = this._config.param4.split("#");
                    if (!this._ability.buffExtendTimeByType) {
                        this._ability.buffExtendTimeByType = {};
                    }
                    for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                        let buffType = NumberUtil.myParseInt(buffTypes[i]);
                        preValue = NumberUtil.myParseInt(this._ability.buffExtendTimeByType[buffType]);
                        this._owner.attrComp.updateBuffExtendTime(buffType, -preValue, true);
                    }
                }
            }
        }
        exec(param, inResult) {
            if (!this.isTriggerBuff()) {
                return null;
            }
            let time = NumberUtil.myParseInt(this._config.param3);
            if (!time) {
                return null;
            }
            let preValue = 0;
            let targets = this.findExecTarget(param);
            if (this._config.param1 == "1") {
                let buffIds = this._config.param4.split("#");
                for (let i = 0, leni = buffIds.length; i < leni; i++) {
                    let buffId = NumberUtil.myParseInt(buffIds[i]);
                    preValue = NumberUtil.myParseInt(this._ability.buffExtendTimeById[buffId]);
                    for (let j = 0, lenj = targets.length; j < lenj; j++) {
                        let target = targets[j];
                        if (!target || target.isRealDie()) {
                            continue;
                        }
                        target.buffComp.addBuffTime(preValue, buffId, null);
                    }
                }
            }
            else if (this._config.param1 == "2") {
                let buffTypes = this._config.param4.split("#");
                for (let i = 0, leni = buffTypes.length; i < leni; i++) {
                    let buffType = NumberUtil.myParseInt(buffTypes[i]);
                    preValue = NumberUtil.myParseInt(this._ability.buffExtendTimeByType[buffType]);
                    for (let j = 0, lenj = targets.length; j < lenj; j++) {
                        let target = targets[j];
                        if (!target || target.isRealDie()) {
                            continue;
                        }
                        target.buffComp.addBuffTime(preValue, null, buffType);
                    }
                }
            }
            else if (this._config.param1 == "3") {
                let time = NumberUtil.myParseInt(this._config.param3);
                if (!time) {
                    return;
                }
                return { buffExtendTime: time };
            }
            return null;
        }
    }

    /**延长技能cd */
    class BattleBuff226 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            let ability = { skillSubCd: {}, skillSubCdPer: {} };
            let skillGroup = NumberUtil.myParseInt(this._config.param4);
            if (this._config.param3) {
                ability.skillSubCd[skillGroup] = NumberUtil.myParseInt(this._config.param3);
            }
            if (this._config.param1) {
                ability.skillSubCdPer[skillGroup] = NumberUtil.myParseInt(this._config.param1);
            }
            this._layers[index].updateAbility(ability);
        }
        updateAbility() {
            let preValue = 0;
            let preValuePer = 0;
            let skillGroup = NumberUtil.myParseInt(this._config.param4);
            if (this._ability.skillSubCd) {
                preValue = NumberUtil.myParseInt(this._ability.skillSubCd[skillGroup]);
            }
            else {
                this._ability.skillSubCd = {};
            }
            if (this._ability.skillSubCdPer) {
                preValuePer = NumberUtil.myParseInt(this._ability.skillSubCdPer[skillGroup]);
            }
            else {
                this._ability.skillSubCdPer = {};
            }
            let curValue = 0;
            let curValuePer = 0;
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                if (this._layers[i].getAbility().skillSubCd) {
                    curValue += NumberUtil.myParseInt(this._layers[i].getAbility().skillSubCd[skillGroup]);
                }
                if (this._layers[i].getAbility().skillSubCdPer) {
                    curValuePer += NumberUtil.myParseInt(this._layers[i].getAbility().skillSubCdPer[skillGroup]);
                }
            }
            if (curValue > 0) {
                this._ability.skillSubCd[skillGroup] = curValue;
            }
            if (curValuePer > 0) {
                this._ability.skillSubCdPer[skillGroup] = curValuePer;
            }
            if (!this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateSkillSubCd(skillGroup, -(curValue - preValue), -(curValuePer - preValuePer));
            }
        }
        onRemove() {
            super.onRemove();
            let preValue = 0;
            let preValuePer = 0;
            let skillGroup = NumberUtil.myParseInt(this._config.param4);
            if (this._ability) {
                if (this._ability.skillSubCd) {
                    preValue = NumberUtil.myParseInt(this._ability.skillSubCd[skillGroup]);
                }
                if (this._ability.skillSubCdPer) {
                    preValuePer = NumberUtil.myParseInt(this._ability.skillSubCdPer[skillGroup]);
                }
            }
            if ((preValue != 0 || preValuePer != 0) && !this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateSkillSubCd(skillGroup, preValue, preValuePer);
            }
        }
        exec(param, inResult) {
            var _a;
            let skillGroup = NumberUtil.myParseInt(this._config.param4);
            let preValue = 0;
            let preValuePer = 0;
            let force = this._config.param2 == "1";
            if (this._ability) {
                if (this._ability.skillSubCd) {
                    preValue = NumberUtil.myParseInt(this._ability.skillSubCd[skillGroup]);
                }
                if (this._ability.skillSubCdPer) {
                    preValuePer = NumberUtil.myParseInt(this._ability.skillSubCdPer[skillGroup]);
                }
            }
            if ((preValue != 0 || preValuePer != 0)) {
                for (let j = 0; j < param.doCount; j++) {
                    let targets = this.findExecTarget(param);
                    for (let i = 0, leni = targets.length; i < leni; i++) {
                        if (targets[i].isDie) {
                            continue;
                        }
                        (_a = targets[i].skillComp.getSkillByGroup(skillGroup)) === null || _a === void 0 ? void 0 : _a.subCdByBuff(-preValue, -preValuePer, force);
                    }
                }
            }
            return null;
        }
    }

    /**减少技能cd(根据类型) */
    class BattleBuff227 extends BattleBuff {
        constructor() {
            super(...arguments);
            this._skillTypes = [];
        }
        onInit() {
            this._skillTypes = ArrayUtil.splitToNumberArray(this._config.param4);
        }
        updateLayerAbility(index, addParam) {
            let ability = { skillTypeSubCd: {}, skillTypeSubCdPer: {} };
            for (let i = 0, leni = this._skillTypes.length; i < leni; i++) {
                let skillType = this._skillTypes[i];
                if (this._config.param3) {
                    ability.skillTypeSubCd[skillType] = NumberUtil.myParseInt(this._config.param3);
                }
                if (this._config.param1) {
                    ability.skillTypeSubCdPer[skillType] = NumberUtil.myParseInt(this._config.param1);
                }
            }
            this._layers[index].updateAbility(ability);
        }
        updateAbility() {
            for (let i = 0, leni = this._skillTypes.length; i < leni; i++) {
                let skillType = this._skillTypes[i];
                let preValue = 0;
                let preValuePer = 0;
                if (this._ability.skillTypeSubCd) {
                    preValue = NumberUtil.myParseInt(this._ability.skillTypeSubCd[skillType]);
                }
                else {
                    this._ability.skillTypeSubCd = {};
                }
                if (this._ability.skillTypeSubCdPer) {
                    preValuePer = NumberUtil.myParseInt(this._ability.skillTypeSubCdPer[skillType]);
                }
                else {
                    this._ability.skillTypeSubCdPer = {};
                }
                let curValue = 0;
                let curValuePer = 0;
                for (let i = 0, leni = this._layers.length; i < leni; i++) {
                    if (this._layers[i].getAbility().skillTypeSubCd) {
                        curValue += NumberUtil.myParseInt(this._layers[i].getAbility().skillTypeSubCd[skillType]);
                    }
                    if (this._layers[i].getAbility().skillTypeSubCdPer) {
                        curValuePer += NumberUtil.myParseInt(this._layers[i].getAbility().skillTypeSubCdPer[skillType]);
                    }
                }
                if (curValue > 0) {
                    this._ability.skillTypeSubCd[skillType] = curValue;
                }
                if (curValuePer > 0) {
                    this._ability.skillTypeSubCdPer[skillType] = curValuePer;
                }
                if (!this.isTriggerBuff()) {
                    // 直接改变属性
                    this._owner.attrComp.updateSkillTypeSubCd(skillType, curValue - preValue, curValuePer - preValuePer);
                }
            }
        }
        onRemove() {
            super.onRemove();
            for (let i = 0, leni = this._skillTypes.length; i < leni; i++) {
                let skillType = this._skillTypes[i];
                let preValue = 0;
                let preValuePer = 0;
                if (this._ability) {
                    if (this._ability.skillTypeSubCd) {
                        preValue = NumberUtil.myParseInt(this._ability.skillTypeSubCd[skillType]);
                    }
                    if (this._ability.skillTypeSubCdPer) {
                        preValuePer = NumberUtil.myParseInt(this._ability.skillTypeSubCdPer[skillType]);
                    }
                }
                if ((preValue != 0 || preValuePer != 0) && !this.isTriggerBuff()) {
                    // 直接改变属性
                    this._owner.attrComp.updateSkillTypeSubCd(skillType, -preValue, -preValuePer);
                }
            }
        }
        exec(param, inResult) {
            let force = this._config.param2 == "1";
            for (let i = 0, leni = this._skillTypes.length; i < leni; i++) {
                let skillType = this._skillTypes[i];
                let preValue = 0;
                let preValuePer = 0;
                if (this._ability) {
                    if (this._ability.skillTypeSubCd) {
                        preValue = NumberUtil.myParseInt(this._ability.skillTypeSubCd[skillType]);
                    }
                    if (this._ability.skillTypeSubCdPer) {
                        preValuePer = NumberUtil.myParseInt(this._ability.skillTypeSubCdPer[skillType]);
                    }
                }
                if ((preValue != 0 || preValuePer != 0)) {
                    for (let j = 0; j < param.doCount; j++) {
                        let targets = this.findExecTarget(param);
                        for (let i = 0, leni = targets.length; i < leni; i++) {
                            if (targets[i].isDie) {
                                continue;
                            }
                            let skills = targets[i].skillComp.getSkillByType(skillType);
                            for (let skillTmp of skills) {
                                skillTmp.subCdByBuff(preValue, preValuePer, force);
                            }
                        }
                    }
                }
            }
            return null;
        }
    }

    /**禁止治疗 */
    class BattleBuff228 extends BattleBuff {
        onAdd() {
            this._owner.buffComp.addNoCure();
        }
        onRemove() {
            super.onRemove();
            this._owner.buffComp.delNoCure();
        }
    }

    /**优先被攻击 */
    class BattleBuff229 extends BattleBuff {
        onAdd() {
            this._owner.buffComp.addFirstBeAttack();
        }
        onRemove() {
            super.onRemove();
            this._owner.buffComp.delFirstBeAttack();
        }
    }

    /**无视护盾 */
    class BattleBuff230 extends BattleBuff {
        onAdd() {
            this._ability = { ignoreShield: true };
        }
    }

    /**免疫伤害 */
    class BattleBuff231 extends BattleBuff {
        constructor() {
            super(...arguments);
            this._ignoreTypes = [];
        }
        onInit() {
            this._ignoreTypes = ArrayUtil.splitToNumberArray(this._config.param1);
            this._ignoreCount = NumberUtil.myParseInt(this._config.param2);
        }
        onAdd() {
            for (let i = 0, leni = this._ignoreTypes.length; i < leni; i++) {
                this._owner.buffComp.addIgnoreDamage(this._ignoreTypes[i]);
            }
        }
        onRemove() {
            super.onRemove();
            for (let i = 0, leni = this._ignoreTypes.length; i < leni; i++) {
                this._owner.buffComp.delIgnoreDamage(this._ignoreTypes[i]);
            }
        }
        /**扣除效果值 */
        subAbility(sub) {
            if (this._ignoreTypes.indexOf(sub.ignoreDamageType) >= 0) {
                if (this._ignoreCount > 0) {
                    this._ignoreCount--;
                    if (this._ignoreCount <= 0) {
                        this._owner.buffComp.removeBuff(this._config.id, exports.BuffRemoveType.Ability);
                    }
                }
                return { result: true };
            }
            else {
                return { result: false };
            }
        }
    }

    /**传递伤害    232 */
    class BattleBuff232 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            if (addParam.findTarget3) {
                this._linkTargets = addParam.findTarget3;
            }
        }
        exec(param, inResult) {
            if (this._linkTargets && param.damageValue) {
                let percent = 1000;
                if (this._config.param1) {
                    percent = NumberUtil.myParseInt(this._config.param1);
                }
                let linkDamage = FNumber.value(param.damageValue).mul(percent).div(BattleCommon.AttributeMultiplying).value;
                for (let i = 0, leni = this._linkTargets.length; i < leni; i++) {
                    if (this._linkTargets[i] == this._owner.uid) {
                        continue;
                    }
                    let target = this._owner.battleMgr.getUnit(this._linkTargets[i]);
                    if (!target) {
                        continue;
                    }
                    target.beAttack(linkDamage, this._actorId, this._addSkillId, this._config.id, { damageType: exports.DamageType.Link, isLink: true });
                }
            }
            return null;
        }
        getExtraParam() {
            if (this._linkTargets) {
                return { linkTarget: this._linkTargets };
            }
            else {
                return null;
            }
        }
    }

    /**延长技能cd（根据类型） */
    class BattleBuff233 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            let ability = { skillTypeSubCd: {}, skillTypeSubCdPer: {} };
            let skillType = NumberUtil.myParseInt(this._config.param4);
            if (this._config.param3) {
                ability.skillTypeSubCd[skillType] = NumberUtil.myParseInt(this._config.param3);
            }
            if (this._config.param1) {
                ability.skillTypeSubCdPer[skillType] = NumberUtil.myParseInt(this._config.param1);
            }
            this._layers[index].updateAbility(ability);
        }
        updateAbility() {
            let preValue = 0;
            let preValuePer = 0;
            let skillType = NumberUtil.myParseInt(this._config.param4);
            if (this._ability.skillTypeSubCd) {
                preValue = NumberUtil.myParseInt(this._ability.skillTypeSubCd[skillType]);
            }
            else {
                this._ability.skillTypeSubCd = {};
            }
            if (this._ability.skillTypeSubCdPer) {
                preValuePer = NumberUtil.myParseInt(this._ability.skillTypeSubCdPer[skillType]);
            }
            else {
                this._ability.skillTypeSubCdPer = {};
            }
            let curValue = 0;
            let curValuePer = 0;
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                if (this._layers[i].getAbility().skillTypeSubCd) {
                    curValue += NumberUtil.myParseInt(this._layers[i].getAbility().skillTypeSubCd[skillType]);
                }
                if (this._layers[i].getAbility().skillTypeSubCdPer) {
                    curValuePer += NumberUtil.myParseInt(this._layers[i].getAbility().skillTypeSubCdPer[skillType]);
                }
            }
            if (curValue > 0) {
                this._ability.skillTypeSubCd[skillType] = curValue;
            }
            if (curValuePer > 0) {
                this._ability.skillTypeSubCdPer[skillType] = curValuePer;
            }
            if (!this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateSkillTypeSubCd(skillType, -(curValue - preValue), -(curValuePer - preValuePer));
            }
        }
        onRemove() {
            super.onRemove();
            let preValue = 0;
            let preValuePer = 0;
            let skillType = NumberUtil.myParseInt(this._config.param4);
            if (this._ability) {
                if (this._ability.skillTypeSubCd) {
                    preValue = NumberUtil.myParseInt(this._ability.skillTypeSubCd[skillType]);
                }
                if (this._ability.skillTypeSubCdPer) {
                    preValuePer = NumberUtil.myParseInt(this._ability.skillTypeSubCdPer[skillType]);
                }
            }
            if ((preValue != 0 || preValuePer != 0) && !this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateSkillTypeSubCd(skillType, preValue, preValuePer);
            }
        }
        exec(param, inResult) {
            let skillType = NumberUtil.myParseInt(this._config.param4);
            let preValue = 0;
            let preValuePer = 0;
            let force = this._config.param2 == "1";
            if (this._ability) {
                if (this._ability.skillTypeSubCd) {
                    preValue = NumberUtil.myParseInt(this._ability.skillTypeSubCd[skillType]);
                }
                if (this._ability.skillTypeSubCdPer) {
                    preValuePer = NumberUtil.myParseInt(this._ability.skillTypeSubCdPer[skillType]);
                }
            }
            if ((preValue != 0 || preValuePer != 0)) {
                for (let j = 0; j < param.doCount; j++) {
                    let targets = this.findExecTarget(param);
                    for (let i = 0, leni = targets.length; i < leni; i++) {
                        if (targets[i].isDie) {
                            continue;
                        }
                        let skills = targets[i].skillComp.getSkillByType(skillType);
                        for (let skillTmp of skills) {
                            skillTmp.subCdByBuff(-preValue, -preValuePer, force);
                        }
                    }
                }
            }
            return null;
        }
    }

    /**锁血 */
    class BattleBuff234 extends BattleBuff {
        onAdd() {
            if (!this.isTriggerBuff()) {
                this._owner.buffComp.addLockHp();
            }
            this._ability = { lockHp: true };
        }
        onRemove() {
            super.onRemove();
            if (!this.isTriggerBuff()) {
                this._owner.buffComp.delLockHp();
            }
        }
    }

    /**传递buff（配合链接） */
    class BattleBuff235 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            if (addParam.linkTargets) {
                this._linkTargets = addParam.linkTargets;
            }
        }
        exec(param, inResult) {
            if (this._linkTargets && param.addBuffInfo) {
                let linkBuffTypes;
                if (this._config.param4) {
                    linkBuffTypes = this._config.param4.split("#");
                }
                let buffConfig = battle.config.getBuff(param.addBuffInfo.id);
                if (!buffConfig || (linkBuffTypes && linkBuffTypes.length > 0 && linkBuffTypes.indexOf(buffConfig.buffType.toString()) < 0)) {
                    return;
                }
                if (!param.addBuffInfo.addParam) {
                    param.addBuffInfo.addParam = {};
                }
                param.addBuffInfo.addParam.isLink = true;
                for (let i = 0, leni = this._linkTargets.length; i < leni; i++) {
                    if (this._linkTargets[i] == this._owner.uid) {
                        continue;
                    }
                    let target = this._owner.battleMgr.getUnit(this._linkTargets[i]);
                    if (!target) {
                        continue;
                    }
                    target.buffComp.recordBuff(param.addBuffInfo.actorId, param.addBuffInfo.id, param.addBuffInfo.skillId, param.addBuffInfo.addCount, param.addBuffInfo.beHitId, param.addBuffInfo.addParam);
                }
            }
            return null;
        }
    }

    /**增加多个属性 */
    class BattleBuff236 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            let buffIds = this._config.param4.split("#");
            let ability = { addAtr: {} };
            for (let i = 0, leni = buffIds.length; i < leni; i++) {
                let buffConfig = battle.config.getBuff(NumberUtil.myParseInt(buffIds[i]));
                if (!buffConfig) {
                    continue;
                }
                let atrType = buffConfig.ability - exports.AbilityEnum.ChangeAtrStart;
                let atrValue = NumberUtil.myParseInt(buffConfig.param3);
                if (!atrValue) {
                    atrValue = NumberUtil.myParseInt(buffConfig.param1);
                }
                if (buffConfig.param4 == "1") {
                    atrValue = 0 - atrValue;
                }
                ObjectUtil.updateKVnumberValue(ability.addAtr, atrType, atrValue, true);
            }
            this._layers[index].updateAbility(ability);
        }
        updateAbility() {
            let buffIds = this._config.param4.split("#");
            for (let i = 0, leni = buffIds.length; i < leni; i++) {
                let buffConfig = battle.config.getBuff(NumberUtil.myParseInt(buffIds[i]));
                if (!buffConfig) {
                    continue;
                }
                let atrType = buffConfig.ability - exports.AbilityEnum.ChangeAtrStart;
                let preValue = 0;
                if (this._ability && this._ability.addAtr) {
                    preValue = ObjectUtil.getKVnumberValue(this._ability.addAtr, atrType);
                }
                else {
                    this._ability = { addAtr: {} };
                }
                let atrValue = 0;
                for (let i = 0, leni = this._layers.length; i < leni; i++) {
                    atrValue += ObjectUtil.getKVnumberValue(this._layers[i].getAbility().addAtr, atrType);
                }
                ObjectUtil.updateKVnumberValue(this._ability.addAtr, atrType, atrValue, true);
                if (!this.isTriggerBuff()) {
                    // 直接改变属性
                    this._owner.attrComp.updateModifyAttr(atrType, atrValue - preValue);
                }
            }
        }
        onRemove() {
            super.onRemove();
            let buffIds = this._config.param4.split("#");
            for (let i = 0, leni = buffIds.length; i < leni; i++) {
                let buffConfig = battle.config.getBuff(NumberUtil.myParseInt(buffIds[i]));
                if (!buffConfig) {
                    continue;
                }
                let atrType = buffConfig.ability - exports.AbilityEnum.ChangeAtrStart;
                let preValue = 0;
                if (this._ability && this._ability.addAtr) {
                    preValue = ObjectUtil.getKVnumberValue(this._ability.addAtr, atrType);
                }
                if (preValue != 0 && !this.isTriggerBuff()) {
                    // 直接改变属性
                    this._owner.attrComp.updateModifyAttr(atrType, -preValue);
                }
            }
        }
    }

    /**锁头冲锋 */
    class BattleBuff237 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            if (this._layers[index].getLayerParam().beHitId) {
                let moveSpeed = NumberUtil.myParseInt(this._config.param3);
                this._ability = {
                    moveSpeed: moveSpeed,
                    moveUnit: this._layers[index].getLayerParam().beHitId
                };
                this._owner.skillComp.interruptSkill();
            }
        }
    }

    /**护盾值加成 */
    class BattleBuff238 extends BattleBuff {
        updateLayerAbility(index, addParam) {
            let ability = { shieldValueAddPer: 0 };
            if (this._config.param1) {
                ability.shieldValueAddPer = NumberUtil.myParseInt(this._config.param1);
            }
            this._layers[index].updateAbility(ability);
        }
        updateAbility() {
            let preValue = 0;
            if (this._ability.shieldValueAddPer) {
                preValue = this._ability.shieldValueAddPer;
            }
            let curValue = 0;
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                if (this._layers[i].getAbility().shieldValueAddPer) {
                    curValue += this._layers[i].getAbility().shieldValueAddPer;
                }
            }
            this._ability.shieldValueAddPer = curValue;
            this._owner.attrComp.updateShieldValueAddPer(curValue - preValue);
        }
        onRemove() {
            super.onRemove();
            let preValue = 0;
            if (this._ability) {
                if (this._ability.shieldValueAddPer) {
                    preValue = this._ability.shieldValueAddPer;
                }
            }
            if (preValue != 0) {
                // 直接改变属性
                this._owner.attrComp.updateShieldValueAddPer(-preValue);
            }
        }
    }

    /**添加技能 */
    class BattleBuff239 extends BattleBuff {
        exec(param, inResult) {
            let addSkillIds;
            if (!addSkillIds) {
                addSkillIds = this._config.param4.split("#");
            }
            let targets = this.findExecTarget(param);
            for (let j = 0, lenj = targets.length; j < lenj; j++) {
                let target = targets[j];
                if (target.isRealDie()) {
                    continue;
                }
                for (let i = 0, leni = addSkillIds.length; i < leni; i++) {
                    target.addSkill(NumberUtil.myParseInt(addSkillIds[i]));
                }
            }
            return null;
        }
    }

    /**禁用技能 */
    class BattleBuff240 extends BattleBuff {
        onAdd() {
            let skillGroups = this._config.param4.split("#");
            for (let i = 0, leni = skillGroups.length; i < leni; i++) {
                let skillGroup = NumberUtil.myParseInt(skillGroups[i]);
                this._owner.skillComp.banSkill(skillGroup);
            }
        }
        onRemove() {
            super.onRemove();
            let skillGroups = this._config.param4.split("#");
            for (let i = 0, leni = skillGroups.length; i < leni; i++) {
                let skillGroup = NumberUtil.myParseInt(skillGroups[i]);
                this._owner.skillComp.allowSkill(skillGroup);
            }
        }
    }

    /**不死（只是保留单位释放死亡后的技能，相当于是死亡了，不可被选中） */
    class BattleBuff241 extends BattleBuff {
        onAdd() {
            this._owner.buffComp.addNoDie();
        }
        onRemove() {
            super.onRemove();
            this._owner.buffComp.delNoDie();
        }
    }

    /**找人链接 */
    class BattleBuff242 extends BattleBuff {
        onAdd() {
            if (!this._findTargets) {
                let addBuffIds;
                if (!addBuffIds) {
                    addBuffIds = this._config.param4.split("#");
                }
                let targets = this.findExecTarget(null, this._config.param3);
                let skillId = this.getAddSkillId();
                if (targets && targets.length > 0) {
                    this._linkTargets = [];
                    for (let i = 0, leni = targets.length; i < leni; i++) {
                        this._linkTargets.push(targets[i].uid);
                    }
                    for (let i = 0, leni = addBuffIds.length; i < leni; i++) {
                        for (let j = 0, lenj = targets.length; j < lenj; j++) {
                            let buffId = NumberUtil.myParseInt(addBuffIds[i]);
                            let target = targets[j];
                            target.buffComp.addBuff(this._actorId, buffId, skillId, 1, "", { linkTargets: this._linkTargets });
                        }
                    }
                }
            }
        }
    }

    /**删除buff（按key分组） */
    class BattleBuff243 extends BattleBuff {
        exec(param, inResult) {
            let param1Arr = this._config.param1.split("#");
            let keyType = param1Arr[0];
            let randomCount = NumberUtil.myParseInt(param1Arr[1]);
            // 拆分key
            // let buffIds: string[];
            // let buffTypes: string[];
            let keyArr = this._config.param4.split("#");
            let getCount;
            let delBuff;
            if (keyType == "2") {
                // buffTypes = this._config.param4.split("#");
                getCount = this.getCountByType;
                delBuff = this.delBuffByType;
            }
            else {
                // buffIds = this._config.param4.split("#");
                getCount = this.getCountById;
                delBuff = this.delBuffById;
            }
            let countType = NumberUtil.myParseInt(this._config.param2);
            let count = 0;
            let countPer = 0;
            if (countType == 1) {
                // 固定
                count = NumberUtil.myParseInt(this._config.param3);
                if (count <= 0) {
                    return;
                }
            }
            else if (countType == 2) {
                // 系数
                countPer = NumberUtil.myParseInt(this._config.param3);
                if (countPer <= 0) {
                    return;
                }
            }
            for (let k = 0; k < param.doCount; k++) {
                let targets = this.findExecTarget(param);
                for (let j = 0, lenj = targets.length; j < lenj; j++) {
                    let target = targets[j];
                    if (!target) {
                        continue;
                    }
                    if (randomCount > 0) {
                        let keyArrTmp = [];
                        for (let i = 0, leni = keyArr.length; i < leni; i++) {
                            if (getCount(target, NumberUtil.myParseInt(keyArr[i])) > 0) {
                                keyArrTmp.push(keyArr[i]);
                            }
                        }
                        keyArr = this._owner.battleMgr.getRandom().randomInArr(keyArrTmp, randomCount);
                        // if (buffIds) {
                        //     let buffIdsTmp: string[] = [];
                        //     for (let i: number = 0, leni: number = buffIds.length; i < leni; i++) {
                        //         if (target.buffComp.getBuffCountById(buffIds[i]) > 0) {
                        //             buffIdsTmp.push(buffIds[i]);
                        //         }
                        //     }
                        //     buffIds = BRandom.randomInArr(buffIdsTmp, randomCount);
                        // }
                        // if (buffTypes) {
                        //     let buffTypesTmp: string[] = [];
                        //     for (let i: number = 0, leni: number = buffTypes.length; i < leni; i++) {
                        //         if (target.buffComp.getBuffCountByType(NumberUtil.myParseInt(buffTypes[i])) > 0) {
                        //             buffTypesTmp.push(buffTypes[i]);
                        //         }
                        //     }
                        //     buffTypes = BRandom.randomInArr(buffTypesTmp, randomCount);
                        // }
                    }
                    if (keyArr && keyArr.length > 0) {
                        for (let i = 0, leni = keyArr.length; i < leni; i++) {
                            delBuff(target, NumberUtil.myParseInt(keyArr[i]), count, countPer);
                        }
                    }
                    // if (buffIds) {
                    //     for (let i: number = 0, leni: number = buffIds.length; i < leni; i++) {
                    //         target.buffComp.delBuff(NumberUtil.myParseInt(buffIds[i]), count);
                    //     }
                    // }
                    // if (buffTypes) {
                    //     for (let i: number = 0, leni: number = buffTypes.length; i < leni; i++) {
                    //         target.buffComp.delBuffByType(NumberUtil.myParseInt(buffTypes[i]), count);
                    //     }
                    // }
                }
            }
            return null;
        }
        getCountById(target, buffId) {
            return target.buffComp.getBuffCountById(buffId);
        }
        getCountByType(target, buffType) {
            return target.buffComp.getBuffCountByType(buffType);
        }
        delBuffById(target, buffId, count, countPer) {
            target.buffComp.delBuff(buffId, count, countPer);
        }
        delBuffByType(target, buffType, count, countPer) {
            target.buffComp.delBuffByType(buffType, count, countPer);
        }
    }

    /**删除buff（按总集合） */
    class BattleBuff244 extends BattleBuff {
        onInit() {
        }
        exec(param, inResult) {
            // if (this._config.modify) {
            //     let buffModify: buffModify = battle.config.getBuffModify(this._config.modify);
            //     if (buffModify.type == BuffModifyType.Ability) {
            //         let conditionParam: BattleConditionParam = {}
            //         if (inResult) {
            //             conditionParam.hitCount2 = inResult.hitCount2 ? inResult.hitCount2 : 1;
            //             conditionParam.hitCount3 = inResult.hitCount3 ? inResult.hitCount3 : 1;
            //         }
            //         let doCount: number = this.checkCondition(buffModify.condition, conditionParam);
            //         if (doCount > 0) {
            //             addBuffIds = buffModify.param4.split("#");
            //             if (buffModify.param3 == "2") {
            //                 addBuffIds = BRandom.randomInArr(addBuffIds, 1);
            //             }
            //         }
            //     }
            // }
            let param1Arr = this._config.param1.split("#");
            let keyType = param1Arr[0];
            let randomCount = NumberUtil.myParseInt(param1Arr[1]);
            // 拆分key
            let keyArr = this._config.param4.split("#");
            let getCount;
            let delBuff;
            if (keyType == "2") {
                getCount = this.getCountByType;
                delBuff = this.delBuffByType;
            }
            else {
                getCount = this.getCountById;
                delBuff = this.delBuffById;
            }
            let countType = NumberUtil.myParseInt(this._config.param2);
            let count = 0;
            let countPer = 0;
            if (countType == 1) {
                // 固定
                count = NumberUtil.myParseInt(this._config.param3);
                if (count <= 0) {
                    return;
                }
                count *= param.doCount;
                count = Math.max(count, 1);
            }
            else if (countType == 2) {
                // 系数
                countPer = NumberUtil.myParseInt(this._config.param3);
                if (countPer <= 0) {
                    return;
                }
            }
            let targets = this.findExecTarget(param);
            for (let j = 0, lenj = targets.length; j < lenj; j++) {
                let target = targets[j];
                if (!target) {
                    continue;
                }
                // 获取目标身上buff总数
                let hasCount = 0;
                let keyArrTmp = [];
                for (let i = 0, leni = keyArr.length; i < leni; i++) {
                    let countTmp = getCount(target, NumberUtil.myParseInt(keyArr[i]));
                    if (countTmp > 0) {
                        hasCount += countTmp;
                        keyArrTmp.push(keyArr[i]);
                    }
                }
                if (randomCount > 0) {
                    keyArrTmp = this._owner.battleMgr.getRandom().randomInArr(keyArrTmp, randomCount);
                }
                if (count <= 0) {
                    count = Math.floor(FNumber.value(hasCount).mul(countPer).div(BattleCommon.AttributeMultiplying).value);
                    count = count * param.doCount;
                    count = Math.max(count, 1);
                }
                if (keyArrTmp && keyArrTmp.length > 0) {
                    for (let i = 0; i < count; i++) {
                        let randomIndex = this._owner.battleMgr.getRandom().randomInt(keyArrTmp.length, 0);
                        let buffKey = NumberUtil.myParseInt(keyArrTmp[randomIndex]);
                        delBuff(target, buffKey, 1);
                    }
                }
            }
            return null;
        }
        getCountById(target, buffId) {
            return target.buffComp.getBuffCountById(buffId);
        }
        getCountByType(target, buffType) {
            return target.buffComp.getBuffCountByType(buffType);
        }
        delBuffById(target, buffId, count, countPer) {
            target.buffComp.delBuff(buffId, count, countPer);
        }
        delBuffByType(target, buffType, count, countPer) {
            target.buffComp.delBuffByType(buffType, count, countPer);
        }
    }

    /**
     * 战斗随机数生成器
     *
     * !!!注意，该类只能由对应创建的战斗系统调用，其他系统、战斗场次不得调用!!!
     */
    class BRandom {
        constructor() {
            this.showLog = false;
            // 随机数种子
            this._rdSeed1 = 0;
            this._rdSeed2 = 0;
            this._rdSeed3 = 0;
            this._rdSeed4 = 0;
        }
        setRandomSeed(seed) {
            this._rdSeed1 = seed << 24;
            this._rdSeed2 = seed << 16;
            this._rdSeed3 = seed << 8;
            this._rdSeed4 = seed << 4;
            // 先碰撞x次，让随机平均值值趋于稳定
            for (let i = 0; i < 150; i++) {
                this.random();
            }
        }
        // 随机值(!!!只能由战斗系统调用)
        random() {
            this._rdSeed1 >>>= 0;
            this._rdSeed2 >>>= 0;
            this._rdSeed3 >>>= 0;
            this._rdSeed4 >>>= 0;
            let cast32 = (this._rdSeed1 + this._rdSeed2) | 0;
            this._rdSeed1 = this._rdSeed2 ^ this._rdSeed2 >>> 9;
            this._rdSeed2 = this._rdSeed3 + (this._rdSeed3 << 3) | 0;
            this._rdSeed3 = (this._rdSeed3 << 21 | this._rdSeed3 >>> 11);
            this._rdSeed4 = this._rdSeed4 + 1 | 0;
            cast32 = cast32 + this._rdSeed4 | 0;
            this._rdSeed3 = this._rdSeed3 + cast32 | 0;
            let result = (cast32 >>> 0) / 4294967296;
            return result;
        }
        // 随机数(!!!只能由战斗系统调用)
        randomNum(max, min = 0) {
            if (min > max) {
                let temp = max;
                max = min;
                min = temp;
            }
            return this.random() * (max - min) + min;
        }
        // 随机整数(!!!只能由战斗系统调用)
        randomInt(max, min = 0) {
            return Math.floor(this.randomNum(max, min));
        }
        // 随机概率(!!!只能由战斗系统调用)
        randomBool(rate = 0.5) {
            return this.random() <= rate;
        }
        // 随机万分率(!!!只能由战斗系统调用)
        randomWBool(rate = 5000) {
            return this.random() * 10000 <= rate;
        }
        // 随机符号(!!!只能由战斗系统调用)
        randomSign() {
            return this.randomBool() ? -1 : 1;
        }
        // 随机元素(!!!只能由战斗系统调用)
        randomInArr(arr, cnt = 1) {
            if (cnt >= arr.length) {
                return arr;
            }
            const tmp = arr.concat();
            const ret = [];
            while (cnt > 0 && tmp.length > 0) {
                const idx = this.randomInt(tmp.length);
                ret.push(tmp[idx]);
                tmp.splice(idx, 1);
                cnt--;
            }
            return ret;
        }
    }

    class RandomUtils {
        /**根据类型获取一个random类 */
        static getRandom(type = 0) {
            if (!type)
                return null;
            if (!this._randoms[type]) {
                this._randoms[type] = new BRandom();
            }
            return this._randoms[type];
        }
        /**
         * 根据权重数组随机选择一个索引
         * @param weights 权重数组
         * @returns 选中的索引，如果权重数组为空或所有权重为0，返回-1
         * @example
         * randomByWeight([10, 20, 30]) // 10% 概率返回0，20%概率返回1，30%概率返回2
         */
        static randomByWeight(weights, random) {
            const len = weights === null || weights === void 0 ? void 0 : weights.length;
            if (!len)
                return -1;
            // 快速计算总权重
            let totalWeight = weights[0];
            for (let i = 1; i < len; i++) {
                totalWeight += weights[i];
            }
            if (totalWeight <= 0)
                return -1;
            // 随机一个权重值
            const randomWeight = random.randomInt(totalWeight);
            // 使用累积权重数组优化查找
            let currentWeight = weights[0];
            if (randomWeight < currentWeight)
                return 0;
            for (let i = 1; i < len; i++) {
                currentWeight += weights[i];
                if (randomWeight < currentWeight) {
                    return i;
                }
            }
            return len - 1;
        }
        /**
         * 根据权重数组随机选择多个不重复的索引
         * @param weights 权重数组
         * @param count 需要选择的数量
         * @returns 选中的索引数组
         */
        static randomMultiByWeight(weights, count, random) {
            const len = weights === null || weights === void 0 ? void 0 : weights.length;
            if (!len || count <= 0)
                return [];
            if (count >= len)
                return Array.from(Array(len).keys());
            // 预分配数组
            const result = new Array(count);
            const tempWeights = new Array(len);
            // 快速复制权重数组
            for (let i = 0; i < len; i++) {
                tempWeights[i] = weights[i];
            }
            // 使用原地交换法，避免额外的索引数组
            for (let i = 0; i < count; i++) {
                const index = i + this.randomByWeight(tempWeights.slice(i, len), random);
                if (index === -1)
                    break;
                // 记录选中的索引
                result[i] = index;
                // 交换权重到已选区域
                if (i !== index) {
                    const temp = tempWeights[i];
                    tempWeights[i] = tempWeights[index];
                    tempWeights[index] = temp;
                }
            }
            return result;
        }
    }
    RandomUtils._randoms = {};

    /**概率触发其他buff */
    class BattleBuff245 extends BattleBuff {
        exec(param, inResult) {
            let rtn = {};
            let randomRate = ArrayUtil.splitToNumberArray(this._config.param3, ["#"]);
            let randomBuff = ArrayUtil.splitToNumberArray(this._config.param4, ["#"]);
            let randomIndex = RandomUtils.randomByWeight(randomRate, this._owner.battleMgr.getRandom());
            let buffid = randomBuff[randomIndex];
            if (!buffid) {
                return;
            }
            // for (let k: number = 0; k < param.doCount; k++) {
            let targets = this.findExecTarget(param);
            for (let j = 0, lenj = targets.length; j < lenj; j++) {
                let target = targets[j];
                let buffTmp = target.buffComp.getBuffById(buffid);
                if (buffTmp) {
                    rtn = BattleCommon.MergeBuffAbilityReturn(rtn, buffTmp.doAbility(param, inResult));
                }
            }
            // }
            return rtn;
        }
    }

    /**根据目标属性加属性 */
    class BattleBuff246 extends BattleBuff {
        /**获取属性值 */
        getAtrBase(unit, atrType) {
            let baseType = exports.AtrType.None;
            let percentType = exports.AtrType.None;
            let addType = exports.AtrType.None;
            if (atrType == exports.AtrType.Atk) {
                baseType = exports.AtrType.Atk;
                percentType = exports.AtrType.AtkPer;
                addType = exports.AtrType.AtkAdd;
            }
            else if (atrType == exports.AtrType.Hp) {
                baseType = exports.AtrType.Hp;
                percentType = exports.AtrType.HpPer;
                addType = exports.AtrType.HpAdd;
            }
            else {
                baseType = atrType;
            }
            if (percentType > exports.AtrType.None && addType > exports.AtrType.None) {
                let base = unit.attrComp.getOriAtrValue(baseType);
                let per = unit.attrComp.getOriAtrValue(percentType);
                let add = unit.attrComp.getOriAtrValue(addType);
                return BattleCommon.calcAtkOrHp(base, per, add);
            }
            else {
                return unit.attrComp.getOriAtrValue(baseType);
            }
        }
        exec(param, inResult) {
            if (!this._config.param2) {
                return null;
            }
            let atrPercent = this._config.param1 ? NumberUtil.myParseInt(this._config.param1) : 0;
            if (!atrPercent) {
                return null;
            }
            let atrBuffId = NumberUtil.myParseInt(this._config.param2);
            let targets = this.findExecTarget(param, this._config.param4);
            let attrType = NumberUtil.myParseInt(this._config.param3);
            let attrValue = 0;
            for (let j = 0, lenj = targets.length; j < lenj; j++) {
                let target = targets[j];
                attrValue += this.getAtrBase(target, attrType);
            }
            attrValue = FNumber.value(attrValue).mul(atrPercent).div(BattleCommon.AttributeMultiplying).value;
            let skillId = this.getAddSkillId();
            if (param.skill) {
                skillId = param.skill.id;
            }
            let behitId = param.beHitUid ? param.beHitUid : "";
            let addParam = {};
            addParam.attrValue = attrValue;
            this._owner.buffComp.recordBuff(param.actorUid, atrBuffId, skillId, 1, behitId, addParam);
            return null;
        }
    }

    /**受到伤害上限(阈值) */
    class BattleBuff247 extends BattleBuff {
        onInit() {
            let atrId = NumberUtil.myParseInt(this._config.param4);
            this._ability.beHurtThreshold = NumberUtil.myParseInt(this._config.param3);
            this._ability.beHurtThresholdPer1 =
                this._ability.beHurtThresholdPer2 =
                    this._ability.beHurtThresholdPer3 = 0;
            if (atrId == 2) {
                this._ability.beHurtThresholdPer2 = NumberUtil.myParseInt(this._config.param1);
            }
            else if (atrId == 3) {
                this._ability.beHurtThresholdPer3 = NumberUtil.myParseInt(this._config.param1);
            }
            else {
                this._ability.beHurtThresholdPer1 = NumberUtil.myParseInt(this._config.param1);
            }
        }
        onRemove() {
            super.onRemove();
        }
    }

    /**子弹分裂 */
    class BattleBuff248 extends BattleBuff {
        /**刷新buff加成 */
        updateAbility() {
            if (this._config.param1 && this._config.param2 && this._config.param3) {
                if (!this._ability) {
                    this._ability = {};
                }
                this._ability.bulletDivision = `${this._config.param2}#${this._config.param1}#${this._config.param3}`;
            }
        }
    }

    /**修改buff数量 */
    class BattleBuff249 extends BattleBuff {
        onInit() {
            let paramArr = ArrayUtil.splitToNumberArray(this._config.param1, "#");
            let typeTmp = paramArr.shift();
            if (typeTmp == 1) {
                this._getFunc = this.getBuffById;
            }
            else {
                this._getFunc = this.getBuffsByType;
            }
            this._getKeys = paramArr;
            paramArr = ArrayUtil.splitToNumberArray(this._config.param2, "#");
            this._typeRandomCount = NumberUtil.myParseInt(paramArr.shift());
            this._idRandomCount = NumberUtil.myParseInt(paramArr.shift());
            paramArr = ArrayUtil.splitToNumberArray(this._config.param3, "#");
            typeTmp = paramArr.shift();
            switch (typeTmp) {
                case 1:
                    this._constValue = paramArr;
                    this._execFunc = this.exec1;
                    break;
            }
            paramArr = ArrayUtil.splitToNumberArray(this._config.param4, "#");
            typeTmp = paramArr.shift();
            this._checkValue = paramArr;
            switch (typeTmp) {
                case 1:
                    this._checkFunc = this.checkGreater;
                    break;
            }
        }
        exec(param, inResult) {
            var _a, _b, _c, _d;
            this._execSkillId = this.getAddSkillId();
            if (param.skill) {
                this._execSkillId = param.skill.id;
            }
            let targets = this.findExecTarget(param);
            let behitId = param.beHitUid ? param.beHitUid : "";
            for (let j = 0, lenj = targets.length; j < lenj; j++) {
                let target = targets[j];
                if (!target) {
                    continue;
                }
                // 先获取自身有的buff信息
                let hasTypes = [];
                let hasTypeMap = {};
                let hasIdMap = {};
                for (let i = 0, leni = this._getKeys.length; i < leni; i++) {
                    let buffs = this._getFunc(target, this._getKeys[i]);
                    if (!buffs || buffs.length == 0) {
                        continue;
                    }
                    let buffType = (_b = (_a = buffs[0]) === null || _a === void 0 ? void 0 : _a.getConfig()) === null || _b === void 0 ? void 0 : _b.buffType;
                    if (!buffType) {
                        continue;
                    }
                    hasTypes.push(buffType);
                    hasTypeMap[buffType] = [];
                    for (let k = 0, lenk = buffs.length; k < lenk; k++) {
                        let buffId = (_d = (_c = buffs[0]) === null || _c === void 0 ? void 0 : _c.getConfig()) === null || _d === void 0 ? void 0 : _d.id;
                        if (buffId && !hasIdMap[buffId]) {
                            let buffCount = buffs[k].getCount();
                            if (this._checkFunc(buffCount)) {
                                hasTypeMap[buffType].push(buffId);
                                hasIdMap[buffId] = buffCount;
                            }
                        }
                    }
                }
                // 进行随机
                let changeBuffIds = [];
                if (this._typeRandomCount > 0) {
                    hasTypes = this._owner.battleMgr.getRandom().randomInArr(hasTypes, this._typeRandomCount);
                }
                for (let i = 0, leni = hasTypes.length; i < leni; i++) {
                    changeBuffIds.push(...hasTypeMap[hasTypes[i]]);
                }
                if (this._idRandomCount > 0) {
                    changeBuffIds = this._owner.battleMgr.getRandom().randomInArr(changeBuffIds, this._idRandomCount);
                }
                for (let i = 0, leni = changeBuffIds.length; i < leni; i++) {
                    this._execFunc(target, changeBuffIds[i], hasIdMap[changeBuffIds[i]], behitId);
                }
            }
            return null;
        }
        getBuffById(target, buffId) {
            let buff = target.buffComp.getBuffById(buffId);
            if (!buff) {
                return [];
            }
            return [buff];
        }
        getBuffsByType(target, buffType) {
            let mapTmp = target.buffComp.getBuffsByType(buffType);
            if (mapTmp && mapTmp.size > 0) {
                return Array.from(mapTmp.values());
            }
            else {
                return [];
            }
        }
        /**数量大于 */
        checkGreater(count) {
            if (this._checkValue[0] <= count) {
                return true;
            }
        }
        /**执行方法1：修改为固定值 */
        exec1(target, buffId, count, behitId) {
            let execValue = this._constValue[0];
            if (this._constValue[1]) {
                execValue = this._owner.battleMgr.getRandom().randomInt(this._constValue[1], this._constValue[0]);
            }
            if (count == execValue) {
                return;
            }
            else if (count > execValue) {
                target.buffComp.delBuff(buffId, count - execValue, 0);
            }
            else {
                target.buffComp.recordBuff(this._owner.uid, buffId, this._execSkillId, execValue - count, behitId);
            }
        }
    }

    /**逃跑 */
    class BattleBuff250 extends BattleBuff {
        exec(param, inResult) {
            let targets = this.findExecTarget(param);
            for (let i = 0, leni = targets.length; i < leni; i++) {
                if (targets[i].isDie) {
                    continue;
                }
                targets[i].escape();
            }
            return null;
        }
    }

    /**链接标记（找人1） */
    class BattleBuff251 extends BattleBuff {
        constructor() {
            super(...arguments);
            this._defaultUnitType = "1";
            this._defaultAtrType = 1;
        }
        updateLayerAbility(index, addParam) {
            if (addParam.findTarget1) {
                this._buffTarget = this._owner.battleMgr.getUnit(addParam.findTarget1);
            }
        }
        getExtraParam() {
            if (this._buffTarget && !this._buffTarget.isDie) {
                return { linkTarget: [this._buffTarget.uid] };
            }
            else {
                return null;
            }
        }
    }

    /**找人摊伤害 */
    class BattleBuff252 extends BattleBuff {
        // private _shareType: number;
        onInit() {
            this._sharePer = NumberUtil.myParseInt(this._config.param1);
            // this._shareType = NumberUtil.myParseInt(this._config.param2);
        }
        exec(param, inResult) {
            var _a;
            let actor = this._owner.battleMgr.getUnit(param.actorUid);
            if (!actor) {
                return;
            }
            // // 是否致死伤害
            // if (param.damageValue > this._owner.attrComp.hp) {
            //     if (this._shareType == 1) {
            //         return;
            //     }
            // }
            let skillId = (_a = param.skill) === null || _a === void 0 ? void 0 : _a.id;
            let buffId = param.buffId;
            let targets = this.findExecTarget(param);
            let shareCount = targets.length;
            let onePer = FNumber.value(this._sharePer).div(shareCount).value;
            let oneDamage = FNumber.value(param.damageValue).mul(onePer).div(BattleCommon.AttributeMultiplying).value;
            let sharedPer = this._sharePer;
            // 扣目标的血
            for (let i = 0, leni = targets.length; i < leni; i++) {
                if (targets[i].isDie) {
                    continue;
                }
                if (targets[i].uid == this._owner.uid) {
                    sharedPer -= onePer;
                    continue;
                }
                targets[i].attrComp.subHp(oneDamage, actor.uid, skillId, buffId, { damageType: exports.DamageType.Share });
            }
            // 返回摊出去的系数
            return { sharedPer: sharedPer };
        }
    }

    /**储存值 */
    class BattleBuff253 extends BattleBuff {
        onInit() {
            let paramArr = ArrayUtil.splitToNumberArray(this._config.param1, "#");
            this._per = paramArr[0];
            this._storageType = NumberUtil.myParseInt(this._config.param2);
            paramArr = ArrayUtil.splitToArray(this._config.param4, "#");
            this._atrUnitType = paramArr[0];
            this._atrType = NumberUtil.myParseInt(paramArr[1]);
        }
        exec(param, inResult) {
            let atrUnit = this.getCalcUnit(param);
            let atrValue = this.getAtrValue(atrUnit, this._atrType);
            let storageValue = FNumber.value(atrValue).mul(this._per).div(BattleCommon.AttributeMultiplying).value;
            let targets = this.findExecTarget(param);
            for (let i = 0, len = targets.length; i < len; i++) {
                let target = targets[i];
                if (!target.isDie) {
                    target.attrComp.storageValue(this._storageType, storageValue);
                }
            }
            return null;
        }
        getCalcUnit(abilityParam) {
            let units = this.findExecTarget(abilityParam, this._atrUnitType);
            if (!units) {
                return this._owner;
            }
            let atrUnit = units[0];
            if (!atrUnit) {
                return this._owner;
            }
            return atrUnit;
        }
        getAtrValue(unit, atrId) {
            if (atrId == 2) {
                return unit.attrComp.hp;
            }
            else if (atrId == 3) {
                return unit.attrComp.getMaxHp();
            }
            let base = unit.attrComp.getOriAtrValue(exports.AtrType.Atk);
            let per = unit.attrComp.getOriAtrValue(exports.AtrType.AtkPer);
            let add = unit.attrComp.getOriAtrValue(exports.AtrType.AtkAdd);
            return BattleCommon.calcAtkOrHp(base, per, add);
        }
    }

    /**使用值 */
    class BattleBuff254 extends BattleBuff {
        onInit() {
            let paramArr = ArrayUtil.splitToNumberArray(this._config.param1, "#");
            this._per = paramArr[0];
            this._storageType = NumberUtil.myParseInt(this._config.param2);
        }
        exec(param, inResult) {
            let value = 0;
            let targets = this.findExecTarget(param);
            for (let i = 0, len = targets.length; i < len; i++) {
                let target = targets[i];
                if (!target.isDie) {
                    value += target.attrComp.useStorageValue(this._storageType, 0, this._per);
                    target.attrComp.clearUsedStorageValue(this._storageType);
                }
            }
            value = Math.max(0, value);
            return { storageCure: value };
        }
    }

    /**真实治疗 */
    class BattleBuff255 extends BattleBuff {
        exec(param, inResult) {
            return { realCure: true };
        }
    }

    /**判断条件走分支buff */
    class BattleBuff256 extends BattleBuff {
        onAdd() {
            this._doBuffs = [];
            let buffIds = this._config.param2.split("#");
            for (let i = 0, leni = buffIds.length; i < leni; i++) {
                let config = battle.config.getBuff(NumberUtil.myParseInt(buffIds[i]));
                if (!config) {
                    return;
                }
                let buff = BuffFactory.creatBuff(config.ability);
                buff.initBuff(this._owner, config, true);
                buff.add(this._actorId, this._addSkillId, 1, this._actorId);
                buff.updateAbilityForce();
                this._doBuffs.push(buff);
            }
        }
        exec(param, inResult) {
            let actor = this._owner.battleMgr.getUnit(this._actorId, true);
            let abilityTmp = {};
            let paramTmp = ObjectUtil.deepClone(param);
            if (actor) {
                let conditionParam = {};
                conditionParam.actorUid = this._actorId;
                conditionParam.beHitUid = param.beHitUid;
                let doCount = this.checkCondition(this._config.param1, conditionParam);
                if (doCount > 0) {
                    abilityTmp = BattleCommon.MergeBuffAbilityReturn(abilityTmp, this._doBuffs[0].doAbility(paramTmp, inResult));
                }
                else {
                    abilityTmp = BattleCommon.MergeBuffAbilityReturn(abilityTmp, this._doBuffs[1].doAbility(paramTmp, inResult));
                }
            }
            return abilityTmp;
        }
    }

    /**伤害3(dot) */
    class BattleBuff3 extends BattleBuffDamage {
        onInit() {
            super.onInit();
            this._damageType = exports.DamageType.Dot;
        }
        onAdd() {
            if (this._addSkillId && this._addSkillId > 0) {
                let addSkill = battle.config.getSkill(this._addSkillId);
                if (addSkill) {
                    this._damageSkillType = addSkill.type;
                }
            }
        }
        beforeExec(param, inResult) {
            this._behitUnit = this._owner;
            // 无法选中不受伤害
            if (this._behitUnit.behavior.getNotFind(this._owner.teamId)) {
                return false;
            }
            return true;
        }
        onDamageProcess() {
            if (this._abilityParam.buffLayerIndex) {
                this._actorBuffCondition = {
                    buffId: this._config.id,
                    beHitUid: this._behitUnit.uid,
                };
                for (let i = 0, leni = this._abilityParam.buffLayerIndex.length; i < leni; i++) {
                    let damageValue = this.calcDamage(this._abilityParam.buffLayerIndex[i]);
                    if (damageValue == -2) {
                        return;
                    }
                    else if (damageValue == -1) {
                        continue;
                    }
                    let layerParam = this._layers[this._abilityParam.buffLayerIndex[i]].getLayerParam();
                    this._owner.battleMgr.battleLog(`[时间]${StringUtil.getDateString()}[${layerParam.actorId}]对[${this._behitUnit.uid}]触发Dot[${this._config.id}],造成基本伤害[${damageValue}]`, "DOTDAMAGE");
                    this._behitUnit.beAttack(damageValue, layerParam.actorId, this._addSkillId, this._config.id, { damageType: this._damageType, isDot: true });
                    if (this._behitUnit.isDie) {
                        let conditionParam1 = {
                            beHitUid: this._behitUnit.uid,
                            buffId: this._config.id
                        };
                        this._actorUnit.buffComp.triggerBuff(exports.TriggerEnum.DotKill, conditionParam1, this._abilityParam, null);
                    }
                }
            }
        }
        calcDamage(layerIndex) {
            if (this._behitUnit.isDie) {
                return -2;
            }
            let layerParam = this._layers[layerIndex].getLayerParam();
            this._actorUnit = this._owner.battleMgr.getUnit(layerParam.actorId);
            if (!this._actorUnit) {
                return -1;
            }
            this._beHitBuffReturn = {};
            this._actorBuffReturn = BattleCommon.MergeBuffAbilityReturn(this._actorBuffReturn, this._inBuffReturn);
            this._beHitBuffCondition = {
                buffId: this._config.id,
                actorUid: this._actorUnit.uid,
            };
            // 计算命中之前
            this._actorBuffReturn = BattleCommon.MergeBuffAbilityReturn(this._actorBuffReturn, this._actorUnit.buffComp.triggerBuff(exports.TriggerEnum.DotCalc1, this._actorBuffCondition, this._abilityParam, this._actorBuffReturn));
            this._beHitBuffReturn = BattleCommon.MergeBuffAbilityReturn(this._beHitBuffReturn, this._behitUnit.buffComp.triggerBuff(exports.TriggerEnum.BeDotCalc1, this._beHitBuffCondition, this._abilityParam, this._beHitBuffReturn));
            let damage = this.baseDamage();
            // 伤害加成
            damage = this.addDamage(damage);
            // 流派克制
            damage = this.sectDamage(damage);
            return damage;
        }
        /**结算buff */
        settlement(count) {
            this._actorBuffCondition = {
                buffId: this._config.id,
                beHitUid: this._behitUnit.uid,
            };
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                if (count <= 0) {
                    break;
                }
                let damageValue = this.calcDamage(i);
                if (damageValue == -2) {
                    return;
                }
                else if (damageValue == -1) {
                    continue;
                }
                let layerParam = this._layers[i].getLayerParam();
                let settlementCount = this._layers[i].settlement(count);
                damageValue = FNumber.value(damageValue).mul(settlementCount).value;
                // 结算dot伤害
                this._behitUnit.beAttack(damageValue, layerParam.actorId, this._addSkillId, this._config.id, { damageType: this._damageType, isDot: true });
                this._behitUnit.battleMgr.battleLog(`[时间]${StringUtil.getDateString()}[${layerParam.actorId}]对[${this._owner.uid}]结算[${settlementCount}]次Dot[${this._config.id}],造成基本伤害[${damageValue}]`, "DOTDAMAGE");
                count -= settlementCount;
            }
            return count;
        }
    }

    /**回能 */
    class BattleBuff300 extends BattleBuff {
        onInit() {
            let energys = this._config.param1.split("#");
            if (energys.length > 0) {
                this._energyPer = NumberUtil.myParseInt(energys[0]);
                this._energyConst = NumberUtil.myParseInt(energys[1]);
            }
            else {
                this._energyConst = 0;
                this._energyPer = 0;
            }
        }
        exec(param, inResult) {
            let layerCount = this.getCount();
            if (layerCount <= 0) {
                return null;
            }
            this._owner.attrComp.addEnergy(FNumber.value(this._energyConst).mul(layerCount).value, FNumber.value(this._energyPer).mul(layerCount).value, exports.UnitEnergyUpdateType.Buff);
            return null;
        }
    }

    /**回能增幅 */
    class BattleBuff301 extends BattleBuff {
        onInit() {
            let energys = this._config.param1.split("#");
            if (energys.length > 0) {
                this._energyPer = NumberUtil.myParseInt(energys[0]);
                this._energyConst = NumberUtil.myParseInt(energys[1]);
            }
            else {
                this._energyConst = 0;
                this._energyPer = 0;
            }
        }
        updateAbility() {
            let preEnergyConst = this._curEnergyConst;
            let preEnergyPer = this._curEnergyPer;
            let layerCount = this.getCount();
            this._curEnergyConst = this._energyConst * layerCount;
            this._curEnergyPer = this._energyPer * layerCount;
            if (!this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateEnergyModify(this._curEnergyConst - preEnergyConst, this._curEnergyPer - preEnergyPer);
            }
        }
        onRemove() {
            super.onRemove();
            if (!this.isTriggerBuff()) {
                let preEnergyConst = this._curEnergyConst;
                let preEnergyPer = this._curEnergyPer;
                // 直接改变属性
                this._owner.attrComp.updateEnergyModify(-preEnergyConst, -preEnergyPer);
            }
        }
    }

    /**使用技能耗血 */
    class BattleBuff4 extends BattleBuffDamage {
        onInit() {
            super.onInit();
            this._damageType = exports.DamageType.SkillCost;
        }
        beforeExec(param, inResult) {
            this._actorUnit = this._owner;
            this._behitUnit = this._owner;
            return true;
        }
        onDamageProcess() {
            let damage = this.baseDamage();
            this._behitUnit.beAttack(damage, this._actorUnit.uid, this._damageSkillId, this._config.id, { damageType: this._damageType });
        }
    }

    /**固定比例反伤 */
    class BattleBuff400 extends BattleBuff {
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.damageReturn1 = NumberUtil.myParseInt(this._config.param1);
            this._layers[index].updateAbility(ability);
        }
        /**刷新buff加成 */
        updateAbility() {
            this._ability = { damageReturn1: 0 };
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._ability.damageReturn1 += this._layers[i].getAbility().damageReturn1;
            }
        }
    }

    /**护盾 */
    class BattleBuff401 extends BattleBuff {
        calcShieldValue(actorId, beHitId, addParam) {
            let shieldValue = 0;
            let shieldType = NumberUtil.myParseInt(this._config.param4);
            let actor = this._owner.battleMgr.getUnit(actorId);
            let per = NumberUtil.myParseInt(this._config.param1);
            switch (shieldType) {
                case 0:
                    shieldValue = NumberUtil.myParseInt(this._config.param3);
                    break;
                case 1:
                    if (actor) {
                        shieldValue = FNumber.value(actor.attrComp.getMaxHp()).mul(per).div(BattleCommon.AttributeMultiplying).add(NumberUtil.myParseInt(this._config.param3)).value;
                    }
                    else {
                        shieldValue = 1;
                    }
                    break;
                case 2:
                    if (actor) {
                        let atk = actor.attrComp.getOriAtrValue(exports.AtrType.Atk);
                        shieldValue = FNumber.value(atk).mul(per).div(BattleCommon.AttributeMultiplying).add(NumberUtil.myParseInt(this._config.param3)).value;
                    }
                    else {
                        shieldValue = 1;
                    }
                    break;
                case 3:
                    let behit = this._owner.battleMgr.getUnit(beHitId);
                    if (behit) {
                        let shieldValue1 = behit.buffComp.getShield();
                        shieldValue = FNumber.value(shieldValue1).mul(per).div(BattleCommon.AttributeMultiplying).add(NumberUtil.myParseInt(this._config.param3)).value;
                    }
                    else {
                        let shieldValue1 = this._owner.buffComp.getShield();
                        shieldValue = FNumber.value(shieldValue1).mul(per).div(BattleCommon.AttributeMultiplying).add(NumberUtil.myParseInt(this._config.param3)).value;
                    }
                    break;
                case 4:
                    if (addParam && addParam.damage) {
                        if (!per)
                            per = BattleCommon.AttributeMultiplying;
                        shieldValue = FNumber.value(addParam.damage).mul(per).div(BattleCommon.AttributeMultiplying).add(NumberUtil.myParseInt(this._config.param3)).value;
                    }
                    else {
                        shieldValue = 1;
                    }
                    break;
                case 5:
                    if (addParam && addParam.overflowCure) {
                        if (!per)
                            per = BattleCommon.AttributeMultiplying;
                        shieldValue = FNumber.value(addParam.overflowCure).mul(per).div(BattleCommon.AttributeMultiplying).add(NumberUtil.myParseInt(this._config.param3)).value;
                    }
                    else {
                        shieldValue = 1;
                    }
                    break;
            }
            shieldValue = FNumber.value(shieldValue).mul(this._owner.attrComp.getShieldValueAddPer()).value;
            return shieldValue;
        }
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.shield = this.calcShieldValue(this._layers[index].getLayerParam().actorId, this._layers[index].getLayerParam().beHitId, addParam);
            this._layers[index].updateAbility(ability);
        }
        /**叠加效果 */
        stackAbility(actorId, skillId, addCount, beHitId, addParam) {
            let shieldValue = this.calcShieldValue(actorId, beHitId, addParam);
            shieldValue = FNumber.value(shieldValue).mul(addCount).value;
            this._layers[0].getAbility().shield = this._layers[0].getAbility().shield + shieldValue;
            // this._needUpdate = true;
            this.updateAbility();
        }
        /**刷新buff加成 */
        updateAbility() {
            this._ability = { shield: 0 };
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._ability.shield += this._layers[i].getAbility().shield;
            }
            this._owner.attrComp.updateShield();
        }
        onRemove() {
            super.onRemove();
            this._owner.attrComp.updateShield();
        }
        /**扣除效果值 */
        subAbility(sub) {
            if (this._ability.shield > sub.shield) {
                this._ability.shield = 0;
                let removeIndex = [];
                for (let i = 0, leni = this._layers.length; i < leni; i++) {
                    if (sub.shield <= 0) {
                        this._ability.shield += this._layers[i].getAbility().shield;
                    }
                    else {
                        let abilityTmp = this._layers[i].getAbility();
                        if (abilityTmp.shield > sub.shield) {
                            abilityTmp.shield -= sub.shield;
                            sub.shield = 0;
                            this._ability.shield += this._layers[i].getAbility().shield;
                        }
                        else {
                            sub.shield -= abilityTmp.shield;
                            removeIndex.push(i);
                        }
                    }
                }
                this._layers = this._layers.filter((value, index) => {
                    return !(removeIndex.indexOf(index) >= 0);
                });
                if (this._layers.length <= 0) {
                    this._owner.buffComp.removeBuff(this._config.id, exports.BuffRemoveType.Ability);
                }
            }
            else {
                sub.shield -= this._ability.shield;
                //移除buff
                this._owner.buffComp.removeBuff(this._config.id, exports.BuffRemoveType.Ability);
            }
            return { subAbility: sub };
        }
    }

    /**减护盾 */
    class BattleBuff402 extends BattleBuff {
        exec(param, inResult) {
            let targets = this.findExecTarget(param);
            for (let i = 0, leni = targets.length; i < leni; i++) {
                if (targets[i].isDie) {
                    continue;
                }
                let shieldValue = targets[i].buffComp.getShield();
                shieldValue = FNumber.value(shieldValue).mul(NumberUtil.myParseInt(this._config.param1)).div(BattleCommon.AttributeMultiplying).value;
                targets[i].buffComp.delShield(shieldValue);
            }
            return null;
        }
    }

    /**吸血 */
    class BattleBuff403 extends BattleBuff {
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.leech = NumberUtil.myParseInt(this._config.param1);
            this._layers[index].updateAbility(ability);
        }
        /**刷新buff加成 */
        updateAbility() {
            this._ability = { leech: 0 };
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._ability.leech += this._layers[i].getAbility().leech;
            }
        }
    }

    /**必定暴击 */
    class BattleBuff404 extends BattleBuff {
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.mustCrit = true;
            this._layers[index].updateAbility(ability);
        }
        /**刷新buff加成 */
        updateAbility() {
            this._ability = { mustCrit: true };
        }
    }

    /**必定命中 */
    class BattleBuff405 extends BattleBuff {
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.mustHit = true;
            this._layers[index].updateAbility(ability);
        }
        /**刷新buff加成 */
        updateAbility() {
            this._ability = { mustHit: true };
        }
    }

    /**伤害（技能）并且储存伤害 */
    class BattleBuff5 extends BattleBuff2 {
        constructor() {
            super(...arguments);
            this._defaultUnitType = "2";
            this._defaultAtrType = 3;
            // /**检测命中 */
            // protected checkHit(actor: BattleUnit, beHit: BattleUnit): boolean {
            //     return true;
            // }
            // /**检测暴击 */
            // protected checkCrit(actor: BattleUnit, beHit: BattleUnit, actorResult: BuffAbilityReturn, targetResult: BuffAbilityReturn): boolean {
            //     return false;
            // }
        }
        // /**获取属性值 */
        // protected getAtrBase(unit: BattleUnit, inResult: BuffAbilityReturn, targetResult: BuffAbilityReturn): number {
        //     let base: number = unit.attrComp.getAttr(AtrType.AtrType_Hp);
        //     let per: number = unit.attrComp.getAttr(AtrType.AtrType_HpPercent);
        //     let add: number = unit.attrComp.getAttr(AtrType.AtrType_Hp_Add);
        //     if (inResult && inResult.addAtr) {
        //         base = FNumber.value(base).add(inResult.addAtr.getOriAtrValue(AtrType.AtrType_Hp)).value;
        //         per = FNumber.value(per).add(inResult.addAtr.getOriAtrValue(AtrType.AtrType_HpPercent)).value;
        //         add = FNumber.value(add).add(inResult.addAtr.getOriAtrValue(AtrType.AtrType_Hp_Add)).value;
        //     }
        //     if (targetResult && targetResult.addAtr) {
        //         base = FNumber.value(base).add(targetResult.addAtr.getOriAtrValue(AtrType.AtrType_Hp)).value;
        //         per = FNumber.value(per).add(targetResult.addAtr.getOriAtrValue(AtrType.AtrType_HpPercent)).value;
        //         add = FNumber.value(add).add(targetResult.addAtr.getOriAtrValue(AtrType.AtrType_Hp_Add)).value;
        //     }
        //     return BattleCommon.calcAtkOrHp(base, per, add);
        // }
        /**造成伤害 */
        onAttack(value) {
            // this._owner.attrComp.storageDamage(value);
            this._owner.attrComp.storageValue(exports.StorageType.Damage, value);
        }
    }

    /**增加伤害 */
    class BattleBuff500 extends BattleBuff {
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.damageAddParam = { damageAdd1: NumberUtil.myParseInt(this._config.param1) };
            this._layers[index].updateAbility(ability);
        }
        /**刷新buff加成 */
        updateAbility() {
            let preValue = 0;
            if (this._ability && this._ability.damageAddParam) {
                preValue = this._ability.damageAddParam.damageAdd1;
                this._ability.damageAddParam.damageAdd1 = 0;
            }
            else {
                this._ability = { damageAddParam: { damageAdd1: 0 } };
            }
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._ability.damageAddParam.damageAdd1 += this._layers[i].getAbility().damageAddParam.damageAdd1;
            }
            let changeValue = this._ability.damageAddParam.damageAdd1 - preValue;
            if (!this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateDamageAddParam({ damageAdd1: changeValue });
            }
        }
        onRemove() {
            super.onRemove();
            let preValue = 0;
            if (this._ability && this._ability.damageAddParam) {
                preValue = this._ability.damageAddParam.damageAdd1;
            }
            else {
                this._ability = { damageAddParam: { damageAdd1: 0 } };
            }
            if (preValue != 0 && !this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateDamageAddParam({ damageAdd1: -preValue });
            }
        }
        exec(param, inResult) {
            if (this._ability && this._ability.damageAddParam && this._ability.damageAddParam.damageAdd1) {
                if (param.doCount && param.doCount > 0) {
                    return {
                        damageAddParam: { damageAdd1: FNumber.value(this._ability.damageAddParam.damageAdd1).mul(param.doCount).value }
                    };
                }
                else {
                    return super.exec(param, inResult);
                }
            }
            return null;
        }
    }

    /**加伤害系数 */
    class BattleBuff501 extends BattleBuff {
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.damageAddParam = {
                damageAdd2: NumberUtil.myParseInt(this._config.param1),
                damageAdd3: NumberUtil.myParseInt(this._config.param3)
            };
            this._layers[index].updateAbility(ability);
        }
        /**刷新buff加成 */
        updateAbility() {
            let preValue2 = 0;
            let preValue3 = 0;
            if (this._ability && this._ability.damageAddParam) {
                preValue2 = this._ability.damageAddParam.damageAdd2;
                this._ability.damageAddParam.damageAdd2 = 0;
                preValue3 = this._ability.damageAddParam.damageAdd3;
                this._ability.damageAddParam.damageAdd3 = 0;
            }
            else {
                this._ability = { damageAddParam: { damageAdd2: 0, damageAdd3: 0 } };
            }
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._ability.damageAddParam.damageAdd2 += this._layers[i].getAbility().damageAddParam.damageAdd2;
                this._ability.damageAddParam.damageAdd3 += this._layers[i].getAbility().damageAddParam.damageAdd3;
            }
            let changeValue2 = this._ability.damageAddParam.damageAdd2 - preValue2;
            let changeValue3 = this._ability.damageAddParam.damageAdd3 - preValue3;
            if (!this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateDamageAddParam({ damageAdd2: changeValue2, damageAdd3: changeValue3 });
            }
        }
        onRemove() {
            super.onRemove();
            let preValue2 = 0;
            let preValue3 = 0;
            if (this._ability && this._ability.damageAddParam) {
                preValue2 = this._ability.damageAddParam.damageAdd2;
                preValue3 = this._ability.damageAddParam.damageAdd3;
            }
            else {
                this._ability = { damageAddParam: { damageAdd2: 0, damageAdd3: 0 } };
            }
            if ((preValue2 > 0 || preValue3 > 0) && !this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateDamageAddParam({ damageAdd2: -preValue2, damageAdd3: -preValue3 });
            }
        }
        exec(param, inResult) {
            if (this._ability && this._ability.damageAddParam && (this._ability.damageAddParam.damageAdd2 > 0 || this._ability.damageAddParam.damageAdd3 > 0)) {
                if (param.doCount && param.doCount > 0) {
                    return {
                        damageAddParam: {
                            damageAdd2: FNumber.value(this._ability.damageAddParam.damageAdd2).mul(param.doCount).value,
                            damageAdd3: FNumber.value(this._ability.damageAddParam.damageAdd3).mul(param.doCount).value
                        }
                    };
                }
                else {
                    return super.exec(param, inResult);
                }
            }
            return null;
        }
    }

    /**伤害减免 */
    class BattleBuff502 extends BattleBuff {
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.damageAddParam = { damageReduce1: NumberUtil.myParseInt(this._config.param1) };
            this._layers[index].updateAbility(ability);
        }
        /**刷新buff加成 */
        updateAbility() {
            let preValue = 0;
            if (this._ability && this._ability.damageAddParam) {
                preValue = this._ability.damageAddParam.damageReduce1;
                this._ability.damageAddParam.damageReduce1 = 0;
            }
            else {
                this._ability = { damageAddParam: { damageReduce1: 0 } };
            }
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._ability.damageAddParam.damageReduce1 += this._layers[i].getAbility().damageAddParam.damageReduce1;
            }
            let changeValue = this._ability.damageAddParam.damageReduce1 - preValue;
            if (!this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateDamageAddParam({ damageReduce1: changeValue });
            }
        }
        onRemove() {
            super.onRemove();
            let preValue = 0;
            if (this._ability && this._ability.damageAddParam) {
                preValue = this._ability.damageAddParam.damageReduce1;
            }
            else {
                this._ability = { damageAddParam: { damageReduce1: 0 } };
            }
            if (preValue != 0 && !this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateDamageAddParam({ damageReduce1: -preValue });
            }
        }
        exec(param, inResult) {
            if (this._ability && this._ability.damageAddParam && this._ability.damageAddParam.damageReduce1) {
                if (param.doCount && param.doCount > 0) {
                    return {
                        damageAddParam: { damageReduce1: FNumber.value(this._ability.damageAddParam.damageReduce1).mul(param.doCount).value }
                    };
                }
                else {
                    return super.exec(param, inResult);
                }
            }
            return null;
        }
    }

    /**伤害减免 */
    class BattleBuff503 extends BattleBuff {
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.damageAddParam = {
                damageReduce2: NumberUtil.myParseInt(this._config.param1),
                damageReduce3: NumberUtil.myParseInt(this._config.param3)
            };
            this._layers[index].updateAbility(ability);
        }
        /**刷新buff加成 */
        updateAbility() {
            let preValue2 = 0;
            let preValue3 = 0;
            if (this._ability && this._ability.damageAddParam) {
                preValue2 = this._ability.damageAddParam.damageReduce2;
                this._ability.damageAddParam.damageReduce2 = 0;
                preValue3 = this._ability.damageAddParam.damageReduce3;
                this._ability.damageAddParam.damageReduce3 = 0;
            }
            else {
                this._ability = { damageAddParam: { damageReduce2: 0, damageReduce3: 0 } };
            }
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._ability.damageAddParam.damageReduce2 += this._layers[i].getAbility().damageAddParam.damageReduce2;
                this._ability.damageAddParam.damageReduce3 += this._layers[i].getAbility().damageAddParam.damageReduce3;
            }
            let changeValue2 = this._ability.damageAddParam.damageReduce2 - preValue2;
            let changeValue3 = this._ability.damageAddParam.damageReduce3 - preValue3;
            if (!this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateDamageAddParam({ damageReduce2: changeValue2, damageReduce3: changeValue3 });
            }
        }
        onRemove() {
            super.onRemove();
            let preValue2 = 0;
            let preValue3 = 0;
            if (this._ability && this._ability.damageAddParam) {
                preValue2 = this._ability.damageAddParam.damageReduce2;
                preValue3 = this._ability.damageAddParam.damageReduce3;
            }
            else {
                this._ability = { damageAddParam: { damageReduce2: 0, damageReduce3: 0 } };
            }
            if ((preValue2 > 0 || preValue3 > 0) && !this.isTriggerBuff()) {
                // 直接改变属性
                this._owner.attrComp.updateDamageAddParam({ damageReduce2: -preValue2, damageReduce3: -preValue3 });
            }
        }
        exec(param, inResult) {
            if (param.doCount && param.doCount > 0) {
                if (this._ability && this._ability.damageAddParam && (this._ability.damageAddParam.damageReduce2 > 0 || this._ability.damageAddParam.damageReduce3 > 0)) {
                    return {
                        damageAddParam: {
                            damageReduce2: FNumber.value(this._ability.damageAddParam.damageReduce2).mul(param.doCount).value,
                            damageReduce3: FNumber.value(this._ability.damageAddParam.damageReduce3).mul(param.doCount).value
                        }
                    };
                }
                else {
                    return super.exec(param, inResult);
                }
            }
            return null;
        }
    }

    /**伤害附加 */
    class BattleBuff504 extends BattleBuff {
        /**获取buff ability */
        updateLayerAbility(index, addParam) {
            let ability = {};
            ability.critPer = NumberUtil.myParseInt(this._config.param1);
            ability.critConst = NumberUtil.myParseInt(this._config.param3);
            this._layers[index].updateAbility(ability);
        }
        /**刷新buff加成 */
        updateAbility() {
            this._ability = { critPer: 0, critConst: 0 };
            for (let i = 0, leni = this._layers.length; i < leni; i++) {
                this._ability.critPer += this._layers[i].getAbility().critPer;
                this._ability.critConst += this._layers[i].getAbility().critConst;
            }
        }
        exec(param, inResult) {
            return {
                critPer: FNumber.value(param.doCount).mul(this._ability.critPer).value,
                critConst: FNumber.value(param.doCount).mul(this._ability.critConst).value
            };
        }
    }

    class BattleBuff506 extends BattleBuff {
        constructor() {
            super(...arguments);
            this._defaultUnitType = "1";
            this._defaultAtrType = 3;
        }
        onInit() {
            let paramTmp;
            if (this._config.param1) {
                paramTmp = this._config.param1.split("#");
                this._damagePer = NumberUtil.myParseInt(paramTmp[0]);
                this._damageAdd = NumberUtil.myParseInt(paramTmp[1]);
            }
            else {
                this._damagePer = 0;
                this._damageAdd = 0;
            }
            if (this._config.param4) {
                paramTmp = this._config.param4.split("#");
                this._atrUnitType = paramTmp[0] ? paramTmp[0] : this._defaultUnitType;
                this._atrType = NumberUtil.myParseInt(paramTmp[1]);
            }
            else {
                this._atrUnitType = this._defaultUnitType;
            }
            if (!this._atrType) {
                this._atrType = this._defaultAtrType;
            }
        }
        exec(param, inResult) {
            let atrUnit = this.getAtrUnit(param);
            let atrBase = this.getAtrValue(atrUnit, this._atrType);
            let damageAdd = FNumber.value(atrBase).mul(this._damagePer).div(BattleCommon.AttributeMultiplying).add(this._damageAdd).value;
            return { damageAddParam: { damageAdd4: damageAdd } };
        }
        getCalcUnit(abilityParam, findId) {
            let units = this.findExecTarget(abilityParam, findId);
            if (!units) {
                return this._owner;
            }
            let atrUnit = units[0];
            if (!atrUnit) {
                return this._owner;
            }
            return atrUnit;
        }
        /**获取属性目标(用哪个单位计算属性) */
        getAtrUnit(abilityParam) {
            return this.getCalcUnit(abilityParam, this._atrUnitType);
        }
        getAtrValue(unit, atrId) {
            if (atrId == 2) {
                return unit.attrComp.hp;
            }
            else if (atrId == 3) {
                return unit.attrComp.getMaxHp();
            }
            let base = unit.attrComp.getOriAtrValue(exports.AtrType.Atk);
            let per = unit.attrComp.getOriAtrValue(exports.AtrType.AtkPer);
            let add = unit.attrComp.getOriAtrValue(exports.AtrType.AtkAdd);
            return BattleCommon.calcAtkOrHp(base, per, add);
        }
    }

    /**链接伤害（目标死亡打断） */
    class BattleBuff6 extends BattleBuff1 {
        constructor() {
            super(...arguments);
            this._defaultUnitType = "1";
            this._defaultAtrType = 1;
        }
        updateLayerAbility(index, addParam) {
            this._buffTarget = this._owner.battleMgr.getUnit(addParam.findTarget3[0]);
        }
        exec(param, inResult) {
            if (this._buffTarget && !this._buffTarget.isDie) {
                param.beHitUid = this._buffTarget.uid;
                return super.exec(param, inResult);
            }
            else {
                this._buffTarget = null;
                this._owner.buffComp.removeBuff(this._config.id, exports.BuffRemoveType.None);
                return null;
            }
        }
        onUpdate(dt) {
            this.tryClear();
        }
        tryClear() {
            if (this._buffTarget && !this._buffTarget.isDie) ;
            else {
                this._buffTarget = null;
                this._owner.buffComp.removeBuff(this._config.id, exports.BuffRemoveType.None);
                return null;
            }
        }
        getExtraParam() {
            if (this._buffTarget && !this._buffTarget.isDie) {
                return { linkTarget: [this._buffTarget.uid] };
            }
            else {
                return null;
            }
        }
    }

    /**造成百分比伤害并回血 */
    class BattleBuff7 extends BattleBuffDamage {
    }

    /**斩杀伤害 */
    class BattleBuff9 extends BattleBuffDamage {
    }

    class BuffInit {
        static init() {
            BuffFactory.registerBuffCls(exports.AbilityEnum.Damge1, BattleBuff1);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Damge2, BattleBuff2);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Damge3, BattleBuff3);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Damge4, BattleBuff4);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Damge5, BattleBuff5);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Damge6, BattleBuff6);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Damge7, BattleBuff7);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Damge9, BattleBuff9);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Recover, BattleBuff100);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Recover1, BattleBuff101);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Recover2, BattleBuff102);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Recover3, BattleBuff103);
            BuffFactory.registerBuffCls(exports.AbilityEnum.UseSkill, BattleBuff200);
            BuffFactory.registerBuffCls(exports.AbilityEnum.AddBuff, BattleBuff201);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ChangeBehavior, BattleBuff202);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ClearDebuff, BattleBuff203);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ReplaceSkill, BattleBuff204);
            BuffFactory.registerBuffCls(exports.AbilityEnum.TriggerBuff, BattleBuff205);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DoBuff, BattleBuff206);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DelBuff1, BattleBuff207);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Fear, BattleBuff208);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Blink, BattleBuff209);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DelBuff2, BattleBuff210);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ChangeUnitScale, BattleBuff211);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Repel, BattleBuff212);
            BuffFactory.registerBuffCls(exports.AbilityEnum.SubSkillCD, BattleBuff213);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Pull, BattleBuff214);
            BuffFactory.registerBuffCls(exports.AbilityEnum.SettlementDot, BattleBuff215);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Tuant, BattleBuff216);
            BuffFactory.registerBuffCls(exports.AbilityEnum.AddBuffImmunity, BattleBuff217);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ChangeBuffAddCount, BattleBuff218);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ChangeBuffOverLimit, BattleBuff219);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ReplaceFind, BattleBuff220);
            BuffFactory.registerBuffCls(exports.AbilityEnum.CopyBuff, BattleBuff221);
            BuffFactory.registerBuffCls(exports.AbilityEnum.RefreshBuffTime, BattleBuff222);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Summon, BattleBuff223);
            BuffFactory.registerBuffCls(exports.AbilityEnum.AddSurvivalTime, BattleBuff224);
            BuffFactory.registerBuffCls(exports.AbilityEnum.UpdateBuffTime, BattleBuff225);
            BuffFactory.registerBuffCls(exports.AbilityEnum.AddSkillCD, BattleBuff226);
            BuffFactory.registerBuffCls(exports.AbilityEnum.SubSkillTypeCD, BattleBuff227);
            BuffFactory.registerBuffCls(exports.AbilityEnum.NoCure, BattleBuff228);
            BuffFactory.registerBuffCls(exports.AbilityEnum.FirstBeAttack, BattleBuff229);
            BuffFactory.registerBuffCls(exports.AbilityEnum.IgnoreShield, BattleBuff230);
            BuffFactory.registerBuffCls(exports.AbilityEnum.IgnoreDmage, BattleBuff231);
            BuffFactory.registerBuffCls(exports.AbilityEnum.LinkDamage, BattleBuff232);
            BuffFactory.registerBuffCls(exports.AbilityEnum.AddSkillTypeCD, BattleBuff233);
            BuffFactory.registerBuffCls(exports.AbilityEnum.LockHp, BattleBuff234);
            BuffFactory.registerBuffCls(exports.AbilityEnum.LinkBuff, BattleBuff235);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ChangeAtrs, BattleBuff236);
            BuffFactory.registerBuffCls(exports.AbilityEnum.MoveToUnit, BattleBuff237);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ShieldValueAddPer, BattleBuff238);
            BuffFactory.registerBuffCls(exports.AbilityEnum.AddSkill, BattleBuff239);
            BuffFactory.registerBuffCls(exports.AbilityEnum.BanSkill, BattleBuff240);
            BuffFactory.registerBuffCls(exports.AbilityEnum.NoDie, BattleBuff241);
            BuffFactory.registerBuffCls(exports.AbilityEnum.FindLink, BattleBuff242);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DelBuffNew1, BattleBuff243);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DelBuffNew2, BattleBuff244);
            BuffFactory.registerBuffCls(exports.AbilityEnum.TriggerBuffByWeight, BattleBuff245);
            BuffFactory.registerBuffCls(exports.AbilityEnum.AddAtrBuff, BattleBuff246);
            BuffFactory.registerBuffCls(exports.AbilityEnum.BeHurtThreshold, BattleBuff247);
            BuffFactory.registerBuffCls(exports.AbilityEnum.BulletDivision, BattleBuff248);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ChangeBuffCount, BattleBuff249);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Escape, BattleBuff250);
            BuffFactory.registerBuffCls(exports.AbilityEnum.LinkFind1, BattleBuff251);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ShareDamage, BattleBuff252);
            BuffFactory.registerBuffCls(exports.AbilityEnum.StorageValue, BattleBuff253);
            BuffFactory.registerBuffCls(exports.AbilityEnum.UseStorageValue, BattleBuff254);
            BuffFactory.registerBuffCls(exports.AbilityEnum.RealCure, BattleBuff255);
            BuffFactory.registerBuffCls(exports.AbilityEnum.ConditionDo, BattleBuff256);
            BuffFactory.registerBuffCls(exports.AbilityEnum.EnergyAdd, BattleBuff300);
            BuffFactory.registerBuffCls(exports.AbilityEnum.EnergyModify, BattleBuff301);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DamageReturn1, BattleBuff400);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Shield, BattleBuff401);
            BuffFactory.registerBuffCls(exports.AbilityEnum.SubShield, BattleBuff402);
            BuffFactory.registerBuffCls(exports.AbilityEnum.Leech, BattleBuff403);
            BuffFactory.registerBuffCls(exports.AbilityEnum.MustCrit, BattleBuff404);
            BuffFactory.registerBuffCls(exports.AbilityEnum.MustHit, BattleBuff405);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DamgeAdd1, BattleBuff500);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DamgeAdd2, BattleBuff501);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DamageReduce1, BattleBuff502);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DamageReduce2, BattleBuff503);
            BuffFactory.registerBuffCls(exports.AbilityEnum.CritValue1, BattleBuff504);
            BuffFactory.registerBuffCls(exports.AbilityEnum.DamageAddEx, BattleBuff506);
        }
    }

    class BattleConfig {
        constructor() {
            this._configs = {};
            this._configsKeyIndex = {};
            this._getConfigFn = {};
        }
        initConfig(configName, json) {
            this._configs[configName] = json;
        }
        setGetConfigFn(fns) {
            for (const [key, fn] of Object.entries(fns)) {
                this._getConfigFn[key] = fn;
            }
        }
        getConfig(id, configName) {
            if (!id || id <= 0) {
                // console.error(`${configName} 查找数据传入id为空`);
                return null;
            }
            let item = null;
            if (this._getConfigFn[configName]) {
                item = this._getConfigFn[configName](id);
            }
            else {
                item = this.search(id, configName);
            }
            if (!item) {
                console.error(`${configName} 表格找不到配置id为${id}的配置`);
            }
            return item;
        }
        search(id, configName) {
            var _a;
            let json = this._configs[configName];
            if (!this._configsKeyIndex[configName]) {
                this._configsKeyIndex[configName] = {};
                json.Keys.forEach((key, index) => {
                    this._configsKeyIndex[configName][key] = index;
                });
            }
            const index = (_a = this._configsKeyIndex[configName][id]) !== null && _a !== void 0 ? _a : -1;
            return -1 === index ? null : json.Items[index];
        }
        //技能
        initSkillConfig(json) {
            this.initConfig(exports.BattleConfigName.Skill, json);
        }
        getSkill(id) {
            let item = this.getConfig(id, exports.BattleConfigName.Skill);
            if (item && item.hasAction == 1 && !item.find1) {
                item.find1 = 1;
            }
            return item;
        }
        //buff
        initBuffConfig(json) {
            this._configs[exports.BattleConfigName.Buff] = json;
        }
        getBuff(id) {
            return this.getConfig(id, exports.BattleConfigName.Buff);
        }
        //子弹
        initBulletConfig(json) {
            this._configs[exports.BattleConfigName.Bullet] = json;
        }
        getBullet(id) {
            return this.getConfig(id, exports.BattleConfigName.Bullet);
        }
        //找人
        initFindTargetConfig(json) {
            this._configs[exports.BattleConfigName.FindTarget] = json;
        }
        getFindTarget(id) {
            return this.getConfig(id, exports.BattleConfigName.FindTarget);
        }
        //条件
        initConditionConfig(json) {
            this._configs[exports.BattleConfigName.Condition] = json;
        }
        getCondition(id) {
            return this.getConfig(id, exports.BattleConfigName.Condition);
        }
        //bufftype
        initBuffTypeConfig(json) {
            this._configs[exports.BattleConfigName.BuffType] = json;
        }
        getBuffType(id) {
            return this.getConfig(id, exports.BattleConfigName.BuffType);
        }
        //buffmodify
        initBuffModifyConfig(json) {
            this._configs[exports.BattleConfigName.BuffModify] = json;
        }
        getBuffModify(id) {
            return this.getConfig(id, exports.BattleConfigName.BuffModify);
        }
        //召唤物配置
        initSummonConfig(json) {
            this._configs[exports.BattleConfigName.Summon] = json;
        }
        getSummon(id) {
            return this.getConfig(id, exports.BattleConfigName.Summon);
        }
        //行为逻辑
        initBehaviorConfig(json) {
            this._configs[exports.BattleConfigName.Behavior] = json;
        }
        getBehavior(id) {
            return this.getConfig(id, exports.BattleConfigName.Behavior);
        }
        //公式
        getDamageExpressConfig(id) {
            return this.getConfig(id, exports.BattleConfigName.DamageExpressConfig);
        }
        getDamageExpressDefine(id) {
            return this.getConfig(id, exports.BattleConfigName.DamageExpressDefine);
        }
        getDamageExpressConst(id) {
            return this.getConfig(id, exports.BattleConfigName.DamageExpressConst);
        }
    }

    /**条件检测具体逻辑 */
    class ConditionMethon {
        /**获取条件目标 */
        static getConditionTarget(buff, condition, param) {
            let findId = condition.find ? condition.find.toString() : "1";
            let units = buff.findExecTarget(param, findId);
            return units[0];
            // if (condition.find) {
            //     if (condition.find == 1) {
            //         return buff.getOwner();
            //     } else if (condition.find == 2 && param.beHit) {
            //         return param.beHit;
            //     }
            // } else {
            //     return buff.getOwner();
            // }
        }
        /**比对条件值 */
        static compareConditionValue(buff, condition, checkValue, cache = false, conditionValue) {
            let doCount = 0;
            if (!conditionValue) {
                conditionValue = NumberUtil.myParseInt(condition.param3);
            }
            switch (condition.param4) {
                case "1":
                    if (conditionValue == checkValue) {
                        doCount = 1;
                    }
                    break;
                case "2":
                    if (conditionValue > checkValue) {
                        doCount = 1;
                    }
                    break;
                case "3":
                    if (conditionValue < checkValue) {
                        doCount = 1;
                    }
                    break;
                case "4":
                    if (cache) {
                        let cacheValue = buff.conditionValues[condition.id] ? buff.conditionValues[condition.id] : 0;
                        let countTmp = checkValue - cacheValue;
                        if (conditionValue <= countTmp) {
                            doCount = Math.floor(countTmp / conditionValue);
                            // 记录通过判断时的值
                            buff.conditionValues[condition.id] = cacheValue + (doCount * conditionValue);
                        }
                    }
                    else {
                        if (conditionValue <= checkValue) {
                            doCount = Math.floor(checkValue / conditionValue);
                        }
                    }
                    break;
            }
            return doCount;
        }
        /** 检测技能组id */
        static checkSkillGroupIds(condition, param) {
            if (condition.param2) {
                let checkSkillGroups = [];
                let param1Arr = condition.param2.split("#");
                for (let i = 0, leni = param1Arr.length; i < leni; i++) {
                    checkSkillGroups.push(NumberUtil.myParseInt(param1Arr[i]));
                }
                let skillconfig = battle.config.getSkill(param.skillId);
                if (checkSkillGroups.indexOf(skillconfig.skillGroup) >= 0) {
                    //命中的技能在检测列表中，才能触发
                    return true;
                }
            }
            else if (param.checkSkillId) {
                //如果没有配置命中的技能id，则使用buff归属的技能id判断
                if (param.checkSkillId.indexOf(param.skillId) >= 0) {
                    //命中的技能在检测列表中，才能触发
                    return true;
                }
            }
            return false;
        }
        /**检测技能类型 */
        static checkSkillType(condition, param) {
            let conditionValue = NumberUtil.myParseInt(condition.param2);
            if (param && param.skillId) {
                let skillConfig = battle.config.getSkill(param.skillId);
                if (skillConfig.type == conditionValue) {
                    return true;
                }
            }
            return false;
        }
        /** 检测技能位移id */
        static checkSkillIds(condition, param) {
            if (condition.param2) {
                let checkSkillIds = [];
                let param1Arr = condition.param2.split("#");
                for (let i = 0, leni = param1Arr.length; i < leni; i++) {
                    checkSkillIds.push(NumberUtil.myParseInt(param1Arr[i]));
                }
                if (checkSkillIds.indexOf(param.skillId) >= 0) {
                    //命中的技能在检测列表中，才能触发
                    return true;
                }
            }
            else if (param.checkSkillId) {
                //如果没有配置命中的技能id，则使用buff归属的技能id判断
                if (param.checkSkillId.indexOf(param.skillId) >= 0) {
                    //命中的技能在检测列表中，才能触发
                    return true;
                }
            }
            return false;
        }
        /**技能组判断   1 */
        static CheckSkill(buff, condition, param) {
            if (condition.param1 == "1") {
                if (ConditionMethon.checkSkillGroupIds(condition, param)) {
                    return 1;
                }
            }
            else if (condition.param1 == "2") {
                if (ConditionMethon.checkSkillType(condition, param)) {
                    return 1;
                }
            }
            else if (condition.param1 == "3") {
                if (ConditionMethon.checkSkillIds(condition, param)) {
                    return 1;
                }
            }
            return 0;
        }
        /**buff层数     2 */
        static CheckBuffCount(buff, condition, param) {
            let unit = ConditionMethon.getConditionTarget(buff, condition, param);
            if (!unit) {
                return 0;
            }
            let doCount = 0;
            if (unit) {
                let checkValue = 0;
                let buffKeys = condition.param2.split("#");
                for (let i = 0, leni = buffKeys.length; i < leni; i++) {
                    let buffKey = NumberUtil.myParseInt(buffKeys[i]);
                    switch (condition.param1) {
                        case "1":
                            checkValue += unit.buffComp.getBuffCountById(buffKey);
                            break;
                        case "2":
                            checkValue += unit.buffComp.getBuffCountByType(buffKey);
                            break;
                        case "3":
                            checkValue += unit.buffComp.getBuffCountByAbility(buffKey);
                            break;
                        default:
                            return 0;
                    }
                }
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**伤害值        3 */
        static CheckHurtValue(buff, condition, param) {
            let unit = buff.getOwner();
            let doCount = 0;
            if (unit) {
                let checkValue = 0;
                switch (condition.param1) {
                    case "1":
                        if (condition.param2 == "1") {
                            checkValue = param.hpSub;
                        }
                        else {
                            checkValue = unit.attrComp.converHpToPercent(param.hpSub);
                        }
                        break;
                    case "2":
                        if (condition.param2 == "1") {
                            checkValue = param.hpAdd;
                        }
                        else {
                            checkValue = unit.attrComp.converHpToPercent(param.hpAdd);
                        }
                        break;
                    default:
                        return 0;
                }
                if (checkValue && checkValue > 0) {
                    doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue);
                    if (condition.limit) {
                        doCount = Math.min(doCount, condition.limit);
                    }
                }
            }
            return doCount;
        }
        /**血量变化        4 */
        static CheckChangeHp(buff, condition, param) {
            let unit = buff.getOwner();
            let doCount = 0;
            if (unit) {
                let checkValue = 0;
                switch (condition.param1) {
                    case "1":
                        if (condition.param2 == "1") {
                            checkValue = unit.buffComp.getHpSubTotal();
                        }
                        else {
                            checkValue = unit.buffComp.getHpSubPerTotal();
                        }
                        break;
                    case "2":
                        if (condition.param2 == "1") {
                            checkValue = unit.buffComp.getHpAddTotal();
                        }
                        else {
                            checkValue = unit.buffComp.getHpAddPerTotal();
                        }
                        break;
                    default:
                        return 0;
                }
                if (checkValue && checkValue > 0) {
                    doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                    if (condition.limit) {
                        doCount = Math.min(doCount, condition.limit);
                    }
                }
            }
            return doCount;
        }
        /**自己加buff次数        5 */
        static CheckBuffAddCount(buff, condition, param) {
            let unit = buff.getOwner();
            let doCount = 0;
            if (unit) {
                let checkValue = 0;
                let buffKey = NumberUtil.myParseInt(condition.param2);
                switch (condition.param1) {
                    case "1":
                        checkValue = unit.buffComp.getBuffAddCount(buffKey);
                        break;
                    case "2":
                        checkValue = unit.buffComp.getBuffAddCountByType(buffKey);
                        break;
                    default:
                        return 0;
                }
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**自己减buff次数        6 */
        static CheckBuffDelCount(buff, condition, param) {
            let unit = buff.getOwner();
            let doCount = 0;
            if (unit) {
                let checkValue = 0;
                let buffKey = NumberUtil.myParseInt(condition.param2);
                switch (condition.param1) {
                    case "1":
                        checkValue = unit.buffComp.getBuffDelCount(buffKey);
                        break;
                    case "2":
                        checkValue = unit.buffComp.getBuffDelCountByType(buffKey);
                        break;
                    default:
                        return 0;
                }
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**给别人加buff次数        7 */
        static CheckBuffAdd2OtherCount(buff, condition, param) {
            let unit = buff.getOwner();
            let doCount = 0;
            if (unit) {
                let checkValue = 0;
                let buffKey = NumberUtil.myParseInt(condition.param2);
                switch (condition.param1) {
                    case "1":
                        checkValue = unit.buffComp.getBuffAddCount2Other(buffKey);
                        break;
                    case "2":
                        checkValue = unit.buffComp.getBuffAddCount2OtherByType(buffKey);
                        break;
                    default:
                        return 0;
                }
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**buff触发次数      8 */
        static CheckBuffTriggerCount(buff, condition, param) {
            let unit = buff.getOwner();
            let doCount = 0;
            if (unit) {
                let checkValue = 0;
                let buffKey = NumberUtil.myParseInt(condition.param2);
                switch (condition.param1) {
                    case "1":
                        checkValue = unit.buffComp.getBuffTriggerCount(buffKey);
                        break;
                    case "2":
                        checkValue = unit.buffComp.getBuffTriggerCountByType(buffKey);
                        break;
                    default:
                        checkValue = buff.getTriggerCount();
                        break;
                }
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**暴击(本次伤害)      9 */
        static CheckCrit(buff, condition, param) {
            if (condition.param1 == "1") {
                if (!!param.isCrit) {
                    return 1;
                }
            }
            else if (condition.param1 == "2") {
                if (!param.isCrit) {
                    return 1;
                }
            }
            return 0;
        }
        /**判断buff      10 */
        static CheckBuff(buff, condition, param) {
            let conditionValue = StringUtil.splitStringToMultiArray(condition.param2, ["#"]);
            let checkValue;
            switch (condition.param1) {
                case "1":
                    checkValue = param.buffId;
                    break;
                case "2":
                    checkValue = param.buffType;
                    if (!checkValue) {
                        let buff2 = battle.config.getBuff(param.buffId);
                        if (buff2) {
                            checkValue = buff2.buffType;
                        }
                    }
                    break;
            }
            if (checkValue && checkValue > 0) {
                if (conditionValue.indexOf(checkValue.toString()) >= 0) {
                    return 1;
                }
            }
            return 0;
        }
        /**判断队伍施加给别的队伍buff层数      11 */
        static CheckTeamActBuff(buff, condition, param) {
            let unit = buff.getOwner();
            // let unit: BattleUnit = ConditionMethon.getConditionTarget(buff, condition, param);
            let doCount = 0;
            if (unit) {
                let checkValue = 0;
                let buffKey = NumberUtil.myParseInt(condition.param2);
                switch (condition.param1) {
                    case "1":
                        checkValue = unit.battleMgr.getTeam(unit.teamId).getBuffActCount(buffKey);
                        break;
                    case "2":
                        checkValue = unit.battleMgr.getTeam(unit.teamId).getBuffActCountByType(buffKey);
                        break;
                    default:
                        return 0;
                }
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**判断当前生命百分比      12 */
        static CheckHpPer(buff, condition, param) {
            let unit = ConditionMethon.getConditionTarget(buff, condition, param);
            if (!unit) {
                return 0;
            }
            let doCount = 0;
            if (unit) {
                let owner = buff.getOwner();
                let conditionValue = NumberUtil.myParseInt(condition.param3);
                let checkValue = 0;
                let checkValueTmp = 0;
                let checkType = condition.param1 ? condition.param1 : "1";
                switch (checkType) {
                    case "1":
                        checkValue = unit.attrComp.getHpPer();
                        if (!conditionValue) {
                            conditionValue = owner.attrComp.getHpPer();
                        }
                        break;
                    case "2":
                        checkValue = unit.attrComp.hp;
                        if (!conditionValue) {
                            conditionValue = owner.attrComp.hp;
                        }
                        break;
                    case "3":
                        checkValueTmp = unit.attrComp.getHpPer();
                        checkValue = FNumber.value(BattleCommon.AttributeMultiplying).sub(checkValueTmp).value;
                        if (!conditionValue) {
                            checkValueTmp = owner.attrComp.getHpPer();
                            conditionValue = FNumber.value(BattleCommon.AttributeMultiplying).sub(checkValueTmp).value;
                        }
                        break;
                    case "4":
                        checkValueTmp = unit.attrComp.hp;
                        checkValue = FNumber.value(unit.attrComp.getMaxHp()).sub(checkValueTmp).value;
                        if (!conditionValue) {
                            checkValueTmp = owner.attrComp.hp;
                            conditionValue = FNumber.value(owner.attrComp.getMaxHp()).sub(checkValueTmp).value;
                        }
                        break;
                    default:
                        return 0;
                }
                if (checkValue && checkValue > 0) {
                    doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, false, conditionValue);
                    if (condition.limit) {
                        doCount = Math.min(doCount, condition.limit);
                    }
                }
            }
            return doCount;
        }
        /**判断目标类型      13 */
        static CheckUnitType(buff, condition, param) {
            let unit = ConditionMethon.getConditionTarget(buff, condition, param);
            if (!unit) {
                return 0;
            }
            let checkTypes = condition.param2.split("#");
            if (condition.param4 == "1") {
                if (checkTypes.indexOf(unit.unitData.type.toString()) < 0) {
                    return 1;
                }
            }
            else {
                if (checkTypes.indexOf(unit.unitData.type.toString()) >= 0) {
                    return 1;
                }
            }
            return 0;
        }
        /**技能命中数量(单次结束前)      14 */
        static CheckSkillHitCount(buff, condition, param) {
            let unit = buff.getOwner();
            let checkUnitId = "";
            if (condition.param1 == "1") {
                if (!param.beHitUid) {
                    return 0;
                }
                checkUnitId = param.beHitUid;
            }
            let doCount = 0;
            if (unit) {
                let skillGroupId = NumberUtil.myParseInt(condition.param2);
                if (!skillGroupId) {
                    if (param.checkSkillId.indexOf(param.skillId) < 0) {
                        return 0;
                    }
                    let skillconfig = battle.config.getSkill(param.skillId);
                    skillGroupId = skillconfig.skillGroup;
                }
                let checkValue = unit.skillComp.getSkillHitCount(skillGroupId, checkUnitId);
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, false);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**技能命中数量（总次数）      15 */
        static CheckSkillHitCountTotal(buff, condition, param) {
            let unit = buff.getOwner();
            let checkUnitId = "";
            if (condition.param1 == "1") {
                if (!param.beHitUid) {
                    return 0;
                }
                checkUnitId = param.beHitUid;
            }
            let doCount = 0;
            if (unit) {
                let skillGroupId = NumberUtil.myParseInt(condition.param2);
                if (!skillGroupId) {
                    if (param.checkSkillId.indexOf(param.skillId) < 0) {
                        return 0;
                    }
                    let skillconfig = battle.config.getSkill(param.skillId);
                    skillGroupId = skillconfig.skillGroup;
                }
                let checkValue = unit.skillComp.getSkillHitCountTotal(skillGroupId, checkUnitId);
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**技能命中数量（每次释放）      16 */
        static CheckSkillFindTarget(buff, condition, param) {
            let unit = buff.getOwner();
            let doCount = 0;
            if (unit) {
                let checkValue = 0;
                let countTypeTmp = condition.param1 ? condition.param1 : "3";
                switch (countTypeTmp) {
                    case "1":
                        checkValue = NumberUtil.myParseInt(param.hitCount2);
                        break;
                    case "2":
                        checkValue = NumberUtil.myParseInt(param.hitCount3);
                        break;
                    case "3":
                        let checkValue1 = param.hitCount2 ? NumberUtil.myParseInt(param.hitCount2) : 1;
                        let checkValue2 = param.hitCount3 ? NumberUtil.myParseInt(param.hitCount3) : 1;
                        checkValue = checkValue1 * checkValue2;
                        break;
                }
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**技能击杀      18 */
        static CheckSkillKill(buff, condition, param) {
            let checkSkillGroup;
            if (condition.param1) {
                checkSkillGroup = NumberUtil.myParseInt(condition.param1);
            }
            else {
                if (param.checkSkillId.indexOf(param.skillId) < 0) {
                    return 0;
                }
                let skillconfig = battle.config.getSkill(param.skillId);
                checkSkillGroup = skillconfig.skillGroup;
            }
            let isTotal = condition.param2 != "1";
            let checkValue = buff.getOwner().skillComp.getSkillKillCount(checkSkillGroup, isTotal);
            let doCount = 0;
            doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue);
            if (condition.limit) {
                doCount = Math.min(doCount, condition.limit);
            }
            return doCount;
        }
        /**本次技能有暴击      19 */
        static CheckSkillCrit(buff, condition, param) {
            let critCount = buff.getOwner().skillComp.getSkillCritCount(param.skillId);
            if (critCount > 0) {
                return 1;
            }
            return 0;
        }
        /**护盾总值小于      20 */
        static CheckShieldValueLess(buff, condition, param) {
            let checkValue = 0;
            let checkAtrType = NumberUtil.myParseInt(condition.param1);
            let checkPercent = NumberUtil.myParseInt(condition.param2);
            let shieldValue;
            let unit = ConditionMethon.getConditionTarget(buff, condition, param);
            if (!unit) {
                return 0;
            }
            if (unit) {
                if (checkAtrType == exports.AtrType.Hp) {
                    checkValue = unit.attrComp.getAtrHp();
                }
                else if (checkAtrType == exports.AtrType.Atk) {
                    checkValue = unit.attrComp.getAtrAtk();
                }
                else {
                    checkValue = unit.attrComp.getOriAtrValue(checkAtrType);
                }
                checkValue = FNumber.value(checkValue).mul(checkPercent).div(BattleCommon.AttributeMultiplying).value;
                shieldValue = unit.buffComp.getShield();
                if (checkValue > shieldValue) {
                    return 1;
                }
            }
            return 0;
        }
        /**buff来源      21 */
        static CheckBuffSource(buff, condition, param) {
            let actorId = param.actorUid;
            let owner = buff.getOwner();
            if (owner.uid === actorId) {
                if (!NumberUtil.myParseInt(condition.param1)) {
                    return 1;
                }
            }
            else {
                let actor = owner.battleMgr.getUnit(actorId);
                if (!actor) {
                    return 0;
                }
                if (owner.teamId == actor.teamId) {
                    if (exports.BuffSourceType.Friend == NumberUtil.myParseInt(condition.param1)) {
                        return 1;
                    }
                }
                else {
                    if (exports.BuffSourceType.Enemy == NumberUtil.myParseInt(condition.param1)) {
                        return 1;
                    }
                }
            }
            return 0;
        }
        /**判断流派      22 */
        static CheckSect(buff, condition, param) {
            let unit = ConditionMethon.getConditionTarget(buff, condition, param);
            if (!unit) {
                return 0;
            }
            if (condition.param4 == "1") {
                if (unit.unitData.sect != NumberUtil.myParseInt(condition.param2)) {
                    return 1;
                }
            }
            else {
                if (unit.unitData.sect == NumberUtil.myParseInt(condition.param2)) {
                    return 1;
                }
            }
            return 0;
        }
        /**技能使用次数      23 */
        static CheckSkillUseCount(buff, condition, param) {
            let unit = buff.getOwner();
            let checkValue = 0;
            switch (condition.param1) {
                case "3":
                    // 技能效果类型
                    let skillEffect = NumberUtil.myParseInt(condition.param2);
                    if (!skillEffect) {
                        return 0;
                    }
                    if (unit) {
                        checkValue = unit.skillComp.getSkillUseCountByEffect(skillEffect);
                    }
                    break;
                case "2":
                    // 技能类型
                    let skillType = NumberUtil.myParseInt(condition.param2);
                    if (!skillType) {
                        return 0;
                    }
                    if (unit) {
                        checkValue = unit.skillComp.getSkillUseCountByType(skillType);
                    }
                    break;
                default:
                    // 技能组id
                    let skillGroup = NumberUtil.myParseInt(condition.param2);
                    if (!skillGroup) {
                        return 0;
                    }
                    if (unit) {
                        checkValue = unit.skillComp.getSkillUseCount(skillGroup);
                    }
            }
            let doCount = 0;
            if (checkValue && checkValue > 0) {
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**受击次数      24 */
        static CheckBeHitCount(buff, condition, param) {
            let checkValue = buff.getOwner().buffComp.getBeHitCount();
            let doCount = 0;
            if (checkValue && checkValue > 0) {
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**扣血次数      25 */
        static CheckSubhpCount(buff, condition, param) {
            let checkValue = buff.getOwner().buffComp.getSubhpCount();
            let doCount = 0;
            if (checkValue && checkValue > 0) {
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**闪避次数      26 */
        static CheckMissCount(buff, condition, param) {
            let checkValue = buff.getOwner().buffComp.getMissCount();
            let doCount = 0;
            if (checkValue && checkValue > 0) {
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /** 召唤物数量      27 */
        static CheckSummonCount(buff, condition, param) {
            let unit = ConditionMethon.getConditionTarget(buff, condition, param);
            if (!unit) {
                return 0;
            }
            let summonGroup = NumberUtil.myParseInt(condition.param2);
            let checkValue = unit.getSummonCount(summonGroup);
            let doCount = 0;
            doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue);
            if (condition.limit) {
                doCount = Math.min(doCount, condition.limit);
            }
            return doCount;
        }
        /** 召唤物id      28 */
        static CheckSummonGroup(buff, condition, param) {
            let summonGroup = NumberUtil.myParseInt(condition.param2);
            if (summonGroup == param.summonId) {
                return 1;
            }
            return 0;
        }
        /** 判断伤害类型      30 */
        static CheckDamageType(buff, condition, param) {
            let checkTypes = ArrayUtil.splitToNumberArray(condition.param1);
            if (checkTypes.indexOf(param.damageType) >= 0) {
                return 1;
            }
            return 0;
        }
        /** 致死伤害      31 */
        static CheckToDieDamage(buff, condition, param) {
            if (condition.param1 == "1") {
                return param.isToDieDamage ? 1 : 0;
            }
            else {
                return param.isToDieDamage ? 0 : 1;
            }
        }
        /**队伍技能使用次数      32 */
        static CheckTeamSkillUseCount(buff, condition, param) {
            let unit = buff.getOwner();
            let team = unit.battleMgr.getTeam(unit === null || unit === void 0 ? void 0 : unit.teamId);
            if (!team)
                return 0;
            let checkValue = 0;
            switch (condition.param1) {
                case "3":
                    // 技能效果类型
                    let skillEffect = NumberUtil.myParseInt(condition.param2);
                    if (!skillEffect) {
                        return 0;
                    }
                    if (unit) {
                        checkValue = team.getSkillEffectCountByType(skillEffect);
                    }
                    break;
                case "2":
                    // 技能类型
                    let skillType = NumberUtil.myParseInt(condition.param2);
                    if (!skillType) {
                        return 0;
                    }
                    if (unit) {
                        checkValue = team.getSkillTypeCountByType(skillType);
                    }
                    break;
                default:
                    // 技能组id
                    let skillGroup = NumberUtil.myParseInt(condition.param2);
                    if (!skillGroup) {
                        return 0;
                    }
                    if (unit) {
                        checkValue = team.getSkillGroudCountById(skillGroup);
                    }
            }
            let doCount = 0;
            if (checkValue && checkValue > 0) {
                doCount = ConditionMethon.compareConditionValue(buff, condition, checkValue, true);
                if (condition.limit) {
                    doCount = Math.min(doCount, condition.limit);
                }
            }
            return doCount;
        }
        /**同一个队伍      33 */
        static CheckTeam(buff, condition, param) {
            let owner = buff.getOwner();
            let doCount = 0;
            if (owner.battleMgr.checkSameTeam(owner.uid, param.beHitUid)) {
                doCount = 1;
            }
            return doCount;
        }
        /**buff数量是否最多      39 */
        static CheckBuffCountMost(buff, condition, param) {
            let owner = buff.getOwner();
            let buffIds = condition.param1.split("#");
            let checkBuffId = NumberUtil.myParseInt(condition.param2);
            let checkValue = owner.buffComp.getBuffCountById(checkBuffId);
            let valueTmp = 0;
            for (let i = 0, leni = buffIds.length; i < leni; i++) {
                valueTmp = owner.buffComp.getBuffCountById(NumberUtil.myParseInt(buffIds[i]));
                if (valueTmp > checkValue) {
                    return 0;
                }
            }
            return 1;
        }
    }

    class ConditionInit {
        static init() {
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSkill, ConditionMethon.CheckSkill);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckBuffCount, ConditionMethon.CheckBuffCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckHurtValue, ConditionMethon.CheckHurtValue);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckChangeHp, ConditionMethon.CheckChangeHp);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckBuffAddCount, ConditionMethon.CheckBuffAddCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckBuffDelCount, ConditionMethon.CheckBuffDelCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckBuffAdd2OtherCount, ConditionMethon.CheckBuffAdd2OtherCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckBuffTriggerCount, ConditionMethon.CheckBuffTriggerCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckCrit, ConditionMethon.CheckCrit);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckBuff, ConditionMethon.CheckBuff);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckTeamActBuff, ConditionMethon.CheckTeamActBuff);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckHpPer, ConditionMethon.CheckHpPer);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckUnitType, ConditionMethon.CheckUnitType);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSkillHitCount, ConditionMethon.CheckSkillHitCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSkillHitCountTotal, ConditionMethon.CheckSkillHitCountTotal);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSkillFindTarget, ConditionMethon.CheckSkillFindTarget);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSkillKill, ConditionMethon.CheckSkillKill);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSkillCrit, ConditionMethon.CheckSkillCrit);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckShieldValueLess, ConditionMethon.CheckShieldValueLess);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckBuffSource, ConditionMethon.CheckBuffSource);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSect, ConditionMethon.CheckSect);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSkillUseCount, ConditionMethon.CheckSkillUseCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckBeHitCount, ConditionMethon.CheckBeHitCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSubhpCount, ConditionMethon.CheckSubhpCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckMissCount, ConditionMethon.CheckMissCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSummonCount, ConditionMethon.CheckSummonCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckSummonGroup, ConditionMethon.CheckSummonGroup);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckDamageType, ConditionMethon.CheckDamageType);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckToDieDamage, ConditionMethon.CheckToDieDamage);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckTeamSkillUseCount, ConditionMethon.CheckTeamSkillUseCount);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckTeam, ConditionMethon.CheckTeam);
            ConditionManager.OnConditionCheck(exports.BattleConditionType.CheckBuffCountMost, ConditionMethon.CheckBuffCountMost);
        }
    }

    /**找人筛选逻辑 */
    class FindTargetMethon {
        static PosType1GroupBy(units) {
            let posUnits = [];
            for (let i = 0, leni = units.length; i < leni; i++) {
                let unit = units[i];
                if (!posUnits[unit.posType]) {
                    posUnits[unit.posType] = [];
                }
                posUnits[unit.posType].push(unit);
            }
            posUnits = posUnits.filter(units => !!units);
            return posUnits;
        }
        static PosType2GroupBy(units) {
            let posUnits = FindTargetMethon.PosType1GroupBy(units);
            posUnits = posUnits.reverse();
            return posUnits;
        }
        //-----------------------------------------------------------------------------------------------------
        static RandomFilter(oriPos, units, find, limit, random) {
            units = random.randomInArr(units, limit);
            return units;
        }
        static NearFilter(oriPos, units, find, limit, random) {
            units.sort((a, b) => {
                return BMath.distance(a.pos, oriPos) - BMath.distance(b.pos, oriPos);
            });
            units.splice(limit);
            return units;
        }
        static FarFilter(oriPos, units, find, limit, random) {
            units.sort((a, b) => {
                return BMath.distance(b.pos, oriPos) - BMath.distance(a.pos, oriPos);
            });
            units.splice(limit);
            return units;
        }
        static MinHp1Filter(oriPos, units, find, limit, random) {
            units.sort((a, b) => {
                let per1 = a.attrComp.getHpPer();
                let per2 = b.attrComp.getHpPer();
                if (per1 === per2) {
                    return BMath.distance(a.pos, oriPos) - BMath.distance(b.pos, oriPos);
                }
                return per1 - per2;
            });
            units.splice(limit);
            return units;
        }
        static MaxAtkFilter(oriPos, units, find, limit, random) {
            units.sort((a, b) => {
                return b.attrComp.getAtrAtk() - a.attrComp.getAtrAtk();
            });
            units.splice(limit);
            return units;
        }
        static MaxHp1Filter(oriPos, units, find, limit, random) {
            units.sort((a, b) => {
                return b.attrComp.getHpPer() - a.attrComp.getHpPer();
            });
            units.splice(limit);
            return units;
        }
        static MaxHp2Filter(oriPos, units, find, limit, random) {
            units.sort((a, b) => {
                return b.attrComp.hp - a.attrComp.hp;
            });
            units.splice(limit);
            return units;
        }
        static MinHp2Filter(oriPos, units, find, limit, random) {
            units.sort((a, b) => {
                return a.attrComp.hp - b.attrComp.hp;
            });
            units.splice(limit);
            return units;
        }
    }

    class FindTargetInit {
        static init() {
            BattleSelector.OnTargetGroupBy(exports.TargetGroupBy.PosType1, FindTargetMethon.PosType1GroupBy);
            BattleSelector.OnTargetGroupBy(exports.TargetGroupBy.PosType2, FindTargetMethon.PosType2GroupBy);
            BattleSelector.OnTargetSortBy(exports.TargetSortBy.Random, FindTargetMethon.RandomFilter);
            BattleSelector.OnTargetSortBy(exports.TargetSortBy.Near, FindTargetMethon.NearFilter);
            BattleSelector.OnTargetSortBy(exports.TargetSortBy.Far, FindTargetMethon.FarFilter);
            BattleSelector.OnTargetSortBy(exports.TargetSortBy.MinHp1, FindTargetMethon.MinHp1Filter);
            BattleSelector.OnTargetSortBy(exports.TargetSortBy.MaxAtk, FindTargetMethon.MaxAtkFilter);
            BattleSelector.OnTargetSortBy(exports.TargetSortBy.MaxHp1, FindTargetMethon.MaxHp1Filter);
            BattleSelector.OnTargetSortBy(exports.TargetSortBy.MaxHp2, FindTargetMethon.MaxHp2Filter);
            BattleSelector.OnTargetSortBy(exports.TargetSortBy.MinHp2, FindTargetMethon.MinHp2Filter);
        }
    }

    /**白虎流星 */
    class SkillProcess322100_2 {
        static CastProcesser(runParam) {
            let func = battle.skillMgr.GetProcesserFunc(exports.SkillProcessEnum.Cast);
            let hasTarget = func(runParam);
            if (!hasTarget) {
                runParam.unit.skillComp.finishSkill();
            }
            return hasTarget;
        }
    }

    /**古尔丹吸血 */
    class SkillProcess324100 {
        static CastProcesser(runParam) {
            let unit = runParam.unit;
            let skillId = runParam.skillId;
            let battleSkill = unit.skillComp.getSkill(skillId);
            let skillFirstFind = battleSkill.getContext().getFirstFind();
            if (!skillFirstFind.units || unit.battleMgr.getUnitDie(skillFirstFind.units[0])) {
                // 目标死亡
                unit.skillComp.finishSkill();
                return false;
            }
            let func = battle.skillMgr.GetProcesserFunc(exports.SkillProcessEnum.Cast);
            return func(runParam);
        }
    }

    /**古尔丹给队友奶 */
    class SkillProcess324400 {
        static CastProcesser(runParam) {
            let unit = runParam.unit;
            // 如果储存伤害不够了，停止
            if (!unit.attrComp.hasNoUseStorageValue(exports.StorageType.Damage)) {
                unit.skillComp.finishSkill();
                return false;
            }
            let func = battle.skillMgr.GetProcesserFunc(exports.SkillProcessEnum.Cast);
            return func(runParam);
        }
        static FinishProcesser(runParam) {
            let unit = runParam.unit;
            unit.attrComp.clearStorageValue(exports.StorageType.Damage);
            let func = battle.skillMgr.GetProcesserFunc(exports.SkillProcessEnum.Finish);
            return func(runParam);
        }
    }

    /**重生技能 */
    class SkillProcess4400302 {
        static HitProcesser(runParam) {
            let unit = runParam.unit;
            let skillId = runParam.skillId;
            let target = runParam.target;
            let hitFunc = battle.skillMgr.GetProcesserFunc(exports.SkillProcessEnum.Hit);
            hitFunc(runParam);
            let targetUnit = unit.battleMgr.getUnit(target);
            if (targetUnit) {
                let angle = BMath.getAngleBetweenPos(unit.pos, targetUnit.pos);
                let bindTarget;
                // 判断后方扇形是否有人
                let find = battle.config.getFindTarget(9999006);
                if (find) {
                    let targets = BattleSelector.SelectUnit(targetUnit, { find, oriPos: targetUnit.pos, angle, bulluetTargetUid: target });
                    if (targets.length > 0) {
                        bindTarget = targets[0];
                    }
                }
                if (bindTarget) {
                    targetUnit.buffComp.addBuff(unit.uid, 9999008, skillId, 1, targetUnit.uid);
                    bindTarget.buffComp.addBuff(unit.uid, 9999009, skillId, 1, targetUnit.uid);
                    targetUnit.buffComp.addBuff(unit.uid, 9999010, skillId, 1, targetUnit.uid, { findTarget1: bindTarget.uid });
                }
                else {
                    targetUnit.buffComp.addBuff(unit.uid, 9999007, skillId, 1, targetUnit.uid);
                }
            }
            return true;
        }
    }

    class SkillProcessDefault {
        static DefaultBeforeProcesser(runParam) {
            let unit = runParam.unit;
            let skillId = runParam.skillId;
            let castSkill = unit.skillComp.getSkill(skillId);
            castSkill.onBefore();
            let config = battle.config.getSkill(skillId);
            // 如果有暂停
            if (config.pauseTime > 0) {
                unit.battleMgr.enterSkillPause(config.pauseTime, unit.uid, skillId);
            }
            let skillFirstFind = castSkill.getContext().getFirstFind();
            if (!skillFirstFind) {
                unit.skillComp.interruptSkill();
                return;
            }
            let firstFindPos = castSkill.getContext().getCastTargetPos();
            if (!firstFindPos) {
                let castTargetUid = castSkill.getContext().getCastTargetUid();
                if (castTargetUid) {
                    firstFindPos = unit.battleMgr.getUnitPos(castTargetUid);
                }
            }
            if (!firstFindPos) {
                unit.skillComp.interruptSkill();
                return;
            }
            let angle = BMath.getAngleBetweenPos(unit.pos, firstFindPos);
            castSkill.getContext().updateCastPos(firstFindPos, angle);
            let curPos = unit.pos;
            if (firstFindPos.x - curPos.x > 1) {
                unit.behavior.updateDir(exports.UnitDir.Right);
            }
            else if (firstFindPos.x - curPos.x < -1) {
                unit.behavior.updateDir(exports.UnitDir.Left);
            }
            let result = castSkill.getContext().getSkillAbility();
            let abilityParam = {};
            let castTargetUid = castSkill.getContext().getCastTargetUid();
            if (castTargetUid) {
                abilityParam.beHitUid = castTargetUid;
                result.findTarget1 = castTargetUid;
            }
            unit.buffComp.triggerBuff(exports.TriggerEnum.SkillBefore, { skillId: skillId }, abilityParam, result);
            unit.battleMgr.addRecord(exports.BattleRecordDataType.SkillTimeNode, {
                uid: unit.uid,
                skillTimeNode: {
                    process: exports.SkillProcessEnum.Before,
                    skillId: skillId,
                    skillRate: runParam.skillRate,
                    before: {
                        posx: firstFindPos.x, posy: firstFindPos.y, angle: angle
                    }
                }
            });
            return true;
        }
        static DefaultBeforeOverProcesser(runParam) {
            let unit = runParam.unit;
            let skillId = runParam.skillId;
            let castSkill = unit.skillComp.getSkill(skillId);
            //技能进cd
            castSkill.resetCd();
            let angle = castSkill.getContext().getAngle();
            let result = castSkill.getContext().getSkillAbility();
            let abilityParam = {};
            let firstFindPos = castSkill.getContext().getCastTargetPos();
            let castTargetUid = castSkill.getContext().getCastTargetUid();
            if (castTargetUid) {
                abilityParam.beHitUid = castTargetUid;
                result.findTarget1 = castTargetUid;
            }
            castSkill.getContext().updateSkillAbility(BattleCommon.MergeBuffAbilityReturn(result, unit.buffComp.triggerBuff(exports.TriggerEnum.SkillBeforeOver, { skillId: skillId }, abilityParam, result)));
            castSkill.onBeforeOver();
            unit.battleMgr.addRecord(exports.BattleRecordDataType.SkillTimeNode, {
                uid: unit.uid,
                skillTimeNode: {
                    process: exports.SkillProcessEnum.BeforeOver,
                    skillId: skillId,
                    skillRate: runParam.skillRate,
                    beforeOver: { posx: firstFindPos.x, posy: firstFindPos.y, angle: angle }
                }
            });
            return true;
        }
        static DefaultCastProcesser(runParam) {
            let unit = runParam.unit;
            let skillId = runParam.skillId;
            let cfgParam = runParam.cfgParam;
            let castSkill = unit.skillComp.getSkill(skillId);
            castSkill.onCast();
            let result = castSkill.getContext().getSkillAbility(true);
            let hasTarget = false;
            result = BattleCommon.MergeBuffAbilityReturn(result, unit.buffComp.triggerBuff(exports.TriggerEnum.SkillCast, { skillId: skillId }, null, null));
            let config = battle.config.getSkill(skillId);
            let angle = castSkill.getContext().getAngle();
            let firstFindPos = castSkill.getContext().getCastTargetPos();
            let skillFirstFind = castSkill.getContext().getFirstFind();
            if (!skillFirstFind) {
                return hasTarget;
            }
            unit.battleMgr.addRecord(exports.BattleRecordDataType.SkillTimeNode, {
                uid: unit.uid,
                skillTimeNode: {
                    process: exports.SkillProcessEnum.Cast,
                    skillId: skillId,
                    skillRate: runParam.skillRate,
                    cast: { castIndex: cfgParam.index, posx: firstFindPos.x, posy: firstFindPos.y, angle: angle }
                }
            });
            let bulletParam = { skillId: skillId };
            bulletParam.startPos = unit.pos.ToB3Like();
            bulletParam.startUnitId = unit.uid;
            bulletParam.posType = config.targetType;
            bulletParam.cfgParam = cfgParam;
            bulletParam.findId = config.find3;
            // 创建子弹
            if (skillFirstFind.pos) {
                result.hitCount2 = 1;
                let param = ObjectUtil.deepClone(bulletParam);
                param.abilityResult = ObjectUtil.deepClone(result);
                param.targetPos = skillFirstFind.pos.ToB3Like();
                unit.battleMgr.addBullet(unit.uid, param);
            }
            else {
                if (skillFirstFind.units && skillFirstFind.units.length > 0) {
                    result.hitCount2 = skillFirstFind.units.length;
                    hasTarget = skillFirstFind.units.length > 0;
                    if (config.targetType == 2) {
                        let param = ObjectUtil.deepClone(bulletParam);
                        param.abilityResult = ObjectUtil.deepClone(result);
                        param.targetPos = firstFindPos.ToB3Like();
                        unit.battleMgr.addBullet(unit.uid, param);
                    }
                    else {
                        for (let j = 0, lenj = skillFirstFind.units.length; j < lenj; j++) {
                            let param = ObjectUtil.deepClone(bulletParam);
                            param.abilityResult = ObjectUtil.deepClone(result);
                            param.targetUnitId = skillFirstFind.units[j];
                            unit.battleMgr.addBullet(unit.uid, param);
                        }
                    }
                }
            }
            return hasTarget;
        }
        static DefaultAfterProcesser(runParam) {
            let unit = runParam.unit;
            let skillId = runParam.skillId;
            let castSkill = unit.skillComp.getSkill(skillId);
            castSkill.onAfter();
            let abilityParam = {};
            let castTargetUid = castSkill.getContext().getCastTargetUid();
            if (castTargetUid) {
                abilityParam.beHitUid = castTargetUid;
            }
            unit.buffComp.triggerBuff(exports.TriggerEnum.SkillAfter, { skillId: skillId }, abilityParam, null);
            unit.battleMgr.addRecord(exports.BattleRecordDataType.SkillTimeNode, {
                uid: unit.uid,
                skillTimeNode: {
                    process: exports.SkillProcessEnum.After,
                    skillId: skillId,
                    skillRate: runParam.skillRate,
                }
            });
            return true;
        }
        static DefaultFinishProcesser(runParam) {
            let unit = runParam.unit;
            let skillId = runParam.skillId;
            // delete unit.skillComp.abilityReturn[skillId];
            unit.buffComp.triggerBuff(exports.TriggerEnum.SkillFinish, { skillId: skillId }, null, null);
            unit.skillComp.clearSkillCritCount(skillId);
            let castSkill = unit.skillComp.getSkill(skillId);
            castSkill.onFinish();
            unit.battleMgr.addRecord(exports.BattleRecordDataType.SkillTimeNode, {
                uid: unit.uid,
                skillTimeNode: {
                    process: exports.SkillProcessEnum.Finish,
                    skillId: skillId,
                    skillRate: runParam.skillRate,
                }
            });
            return true;
        }
        static DefaultHitProcesser(runParam) {
            let unit = runParam.unit;
            let skillId = runParam.skillId;
            let exParam = runParam.cfgParam;
            let target = runParam.target;
            let result = runParam.result;
            let castSkill = unit.skillComp.getSkill(skillId);
            castSkill.onSkillHit();
            if (target) {
                unit.battleMgr.addRecord(exports.BattleRecordDataType.SkillTimeNode, {
                    uid: unit.uid,
                    skillTimeNode: {
                        process: exports.SkillProcessEnum.Hit,
                        skillId: skillId,
                        skillRate: runParam.skillRate,
                        hit: { targetUid: target, castIndex: exParam.index }
                    }
                });
                let param = { skillId: skillId, beHitUid: target, hitCount2: result.hitCount2, hitCount3: result.hitCount3 };
                let abilityParam = {
                    calcPercent: exParam.skillPer,
                    beHitUid: target
                };
                castSkill.onRealHit(target);
                unit.buffComp.triggerBuff(exports.TriggerEnum.SkillHit, param, abilityParam, result);
            }
            return true;
        }
        static DefaultHitViaProcesser(runParam) {
            let unit = runParam.unit;
            let skillId = runParam.skillId;
            let exParam = runParam.cfgParam;
            let target = runParam.target;
            let result = runParam.result;
            let castSkill = unit.skillComp.getSkill(skillId);
            castSkill.onSkillHit();
            if (target) {
                unit.battleMgr.addRecord(exports.BattleRecordDataType.SkillTimeNode, {
                    uid: unit.uid,
                    skillTimeNode: {
                        process: exports.SkillProcessEnum.HitVia,
                        skillId: skillId,
                        skillRate: runParam.skillRate,
                        hit: { targetUid: target, castIndex: exParam.index }
                    }
                });
                let param = { skillId: skillId, beHitUid: target, hitCount2: result.hitCount2, hitCount3: result.hitCount3 };
                let abilityParam = {
                    calcPercent: exParam.skillPer,
                    beHitUid: target
                };
                castSkill.onRealHit(target);
                unit.buffComp.triggerBuff(exports.TriggerEnum.SkillHitVia, param, abilityParam, result);
            }
            return true;
        }
    }

    class SkillTimeNode {
        constructor(pt) {
            this._isExced = false; // 是不是已经执行过了;
            this.timePoint = null; // 具体的执行点; 
            this.timePoint = pt;
            this._runTime = FNumber.creat(pt.execTime);
            this._isExced = false;
        }
        get runTime() {
            return this._runTime.value;
        }
        setExced(value) {
            this._isExced = value;
        }
        getExced() {
            return this._isExced;
        }
        update(dt) {
            this._runTime.sub(dt);
        }
    }

    // 可以把每个技能的触发时间点，参数，给他保存起来;
    class SkillTimePoint {
        constructor(execProcess, execTime, execProc, exParam) {
            this.execProcess = execProcess;
            this.execTime = execTime;
            this.execFunc = execProc;
            this.exParam = exParam;
        }
    }

    class SkillManager {
        constructor() {
            this._allSkillTimeLine = {};
        }
        static OnScanSkillProcesser(funcName, fn, funcKey) {
            let processFuncs = null; // skill 有很多的处理节点;
            if (!funcKey)
                funcKey = this._defaultModelKey;
            if (!SkillManager._skillExecMap[funcKey]) {
                processFuncs = {};
                SkillManager._skillExecMap[funcKey] = processFuncs;
            }
            else {
                processFuncs = SkillManager._skillExecMap[funcKey];
            }
            if (processFuncs[funcName] != null) {
                console.log("error funcName conflict: " + funcName);
                return;
            }
            else {
                processFuncs[funcName] = fn;
            }
        }
        init() {
        }
        GetProcesserFunc(funcName, processKey) {
            if (processKey && SkillManager._skillExecMap[processKey] && SkillManager._skillExecMap[processKey][funcName]) {
                return SkillManager._skillExecMap[processKey][funcName];
            }
            else {
                return SkillManager._skillExecMap[SkillManager._defaultModelKey][funcName];
            }
        }
        // 每个Skill都会对应一个 TimePointList(exec);
        // 不用每次都去解析，可以缓存起来;
        ParserExcelTimeLine(config) {
            if (config === null) {
                return null;
            }
            if (this._allSkillTimeLine[config.id]) {
                return this._allSkillTimeLine[config.id];
            }
            let timeTmp = config.before;
            let timeLine = new Array();
            let beforeTime = 0;
            if (config.before && config.before > 0) {
                beforeTime = config.before;
            }
            timeLine.push(new SkillTimePoint(exports.SkillProcessEnum.Before, 0, this.GetProcesserFunc(exports.SkillProcessEnum.Before, config.processKey), {}));
            timeLine.push(new SkillTimePoint(exports.SkillProcessEnum.BeforeOver, beforeTime, this.GetProcesserFunc(exports.SkillProcessEnum.BeforeOver, config.processKey), {}));
            let intervalTmp = ["0"];
            let percentTmp = ["0"];
            if (config.cast) {
                intervalTmp = config.cast.split("#");
            }
            if (config.percent && config.percent != "0") {
                percentTmp = config.percent.split("#");
            }
            for (let i = 0; i < intervalTmp.length; i++) {
                let exParam = {};
                exParam.index = i;
                exParam.skillPer = NumberUtil.myParseInt(percentTmp[i] ? percentTmp[i] : percentTmp[0]);
                let cast = new SkillTimePoint(exports.SkillProcessEnum.Cast, NumberUtil.myParseInt(intervalTmp[i]) + beforeTime, this.GetProcesserFunc(exports.SkillProcessEnum.Cast, config.processKey), exParam);
                timeLine.push(cast);
            }
            timeTmp += NumberUtil.myParseInt(intervalTmp[intervalTmp.length - 1]);
            timeLine.push(new SkillTimePoint(exports.SkillProcessEnum.CastAfter, timeTmp, null, {}));
            if (config.castAfter && config.castAfter > 0) {
                timeTmp += config.castAfter;
            }
            timeLine.push(new SkillTimePoint(exports.SkillProcessEnum.After, timeTmp, this.GetProcesserFunc(exports.SkillProcessEnum.After, config.processKey), {}));
            if (config.after && config.after > 0) {
                timeTmp += config.after;
            }
            timeLine.push(new SkillTimePoint(exports.SkillProcessEnum.Finish, timeTmp, this.GetProcesserFunc(exports.SkillProcessEnum.Finish, config.processKey), {}));
            this._allSkillTimeLine[config.id] = timeLine;
            return timeLine;
        }
        GetSkillTimeNode(config) {
            let timePoints = this.ParserExcelTimeLine(config);
            if (!timePoints) {
                return;
            }
            let ret = new Array();
            for (let i = 0; i < timePoints.length; i++) {
                ret.push(new SkillTimeNode(timePoints[i])); // 对象池优化
            }
            return ret;
        }
    }
    SkillManager._skillExecMap = {};
    SkillManager._defaultModelKey = 'default'; //默认模板类型

    class SkillInit {
        static init() {
            battle.skillMgr = new SkillManager();
            // default
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.Before, SkillProcessDefault.DefaultBeforeProcesser);
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.BeforeOver, SkillProcessDefault.DefaultBeforeOverProcesser);
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.Cast, SkillProcessDefault.DefaultCastProcesser);
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.After, SkillProcessDefault.DefaultAfterProcesser);
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.Finish, SkillProcessDefault.DefaultFinishProcesser);
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.Hit, SkillProcessDefault.DefaultHitProcesser);
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.HitVia, SkillProcessDefault.DefaultHitViaProcesser);
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.Cast, SkillProcess322100_2.CastProcesser, "322100_2");
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.Cast, SkillProcess324100.CastProcesser, "324100");
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.Cast, SkillProcess324400.CastProcesser, "324400");
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.Finish, SkillProcess324400.FinishProcesser, "324400");
            SkillManager.OnScanSkillProcesser(exports.SkillProcessEnum.Hit, SkillProcess4400302.HitProcesser, "4400302");
        }
    }

    class BattleInit {
        static init() {
            battle.config = new BattleConfig();
            SkillInit.init();
            ConditionInit.init();
            BuffInit.init();
            FindTargetInit.init();
        }
    }

    /**
     * 分数类
     */
    class Fraction {
        constructor(numerator, // 分子
        denominator // 分母
        ) {
            this.numerator = numerator;
            this.denominator = denominator;
            if (denominator === 0) {
                throw new Error('Denominator cannot be zero');
            }
            this.simplify();
        }
        /**
         * 化简分数
         */
        simplify() {
            const gcd = this.getGCD(Math.abs(this.numerator), Math.abs(this.denominator));
            this.numerator /= gcd;
            this.denominator /= gcd;
            if (this.denominator < 0) {
                this.numerator = -this.numerator;
                this.denominator = -this.denominator;
            }
        }
        /**
         * 从对象池获取或创建分数
         */
        static create(numerator, denominator = 1) {
            let fraction;
            if (Fraction.pool.length > 0) {
                fraction = Fraction.pool.pop();
                fraction.numerator = numerator;
                fraction.denominator = denominator;
                fraction.simplify(); // 确保调用 simplify
            }
            else {
                fraction = new Fraction(numerator, denominator); // 构造函数中会调用 simplify
            }
            return fraction;
        }
        /**
         * 从数字创建分数
         */
        static fromNumber(num) {
            const str = num.toString();
            const decimal = str.indexOf('.') >= 0;
            if (!decimal)
                return Fraction.create(num, 1);
            const parts = str.split('.');
            parts[1] = parts[1].substring(0, 5);
            const decimalPlaces = parts[1].length;
            const denominator = Fraction._fnumTmp.reset(10).pow(decimalPlaces).value;
            const numerator = parseInt(parts.join(''));
            return Fraction.create(numerator, denominator); // 使用 create 方法确保调用 simplify
        }
        /**
         * 回收分数对象到对象池
         */
        recycle() {
            if (Fraction.pool.length < Fraction.POOL_SIZE) {
                Fraction.pool.push(this);
            }
        }
        /**
         * 转换为数字
         */
        toNumber() {
            // 使用 FNumber 进行精确除法
            return Fraction._fnumTmp.reset(this.numerator).div(this.denominator).value;
        }
        /**
         * 转换为字符串
         */
        toString() {
            return this.toNumber().toString();
        }
        /**
         * 计算最大公约数
         */
        getGCD(a, b) {
            return b === 0 ? a : this.getGCD(b, a % b);
        }
        /**
         * 加法
         */
        add(other) {
            return Fraction.create(this.numerator * other.denominator + other.numerator * this.denominator, this.denominator * other.denominator);
        }
        /**
         * 减法
         */
        subtract(other) {
            return Fraction.create(this.numerator * other.denominator - other.numerator * this.denominator, this.denominator * other.denominator);
        }
        /**
         * 乘法
         */
        multiply(other) {
            return Fraction.create(this.numerator * other.numerator, this.denominator * other.denominator);
        }
        /**
         * 除法
         */
        divide(other) {
            if (other.numerator === 0) {
                throw new Error('Division by zero');
            }
            return Fraction.create(this.numerator * other.denominator, this.denominator * other.numerator);
        }
    }
    Fraction.pool = [];
    Fraction.POOL_SIZE = 100;
    Fraction._fnumTmp = FNumber.get(0);
    /**
     * 数学表达式计算类
     */
    class ExpressUtil {
        /**
         * 获取单例实例
         */
        static getInstance() {
            if (!ExpressUtil.instance) {
                ExpressUtil.instance = new ExpressUtil();
                // ExpressUtil.instance.registerFunction('random', {
                //     handle: (args) => {
                //         return 0.2
                //     }
                // });
            }
            return ExpressUtil.instance;
        }
        constructor() {
            this._operators = new Map();
            this._functions = new Map();
        }
        /**
         * 注册运算符处理器
         */
        registerOperator(op, handler) {
            this._operators.set(op, handler);
        }
        /**
         * 注册函数处理器
         */
        registerFunction(name, handler) {
            this._functions.set(name, handler);
        }
        /** 获取运算符处理器 */
        getOperatorHandler(op) {
            if (this._operators.has(op)) {
                return this._operators.get(op);
            }
            if (ExpressUtil._defaultOperators.has(op)) {
                return ExpressUtil._defaultOperators.get(op);
            }
            throw new Error(`Unknown operator: ${op}`);
        }
        /** 获取函数处理器 */
        getFunctionHandler(name) {
            if (this._functions.has(name)) {
                return this._functions.get(name);
            }
            if (ExpressUtil._defaultFunctions.has(name)) {
                return ExpressUtil._defaultFunctions.get(name);
            }
            throw new Error(`Unknown function: ${name}`);
        }
        /**
         * 执行表达式计算
         */
        execPress(express, obj) {
            if (!express)
                return 0;
            if (typeof express !== 'string')
                return 0;
            let formula = express;
            // 递归处理嵌套函数
            let lastFormula = '';
            while (lastFormula !== formula) {
                lastFormula = formula;
                formula = this.matchFunc(formula, obj);
            }
            // 处理变量替换
            if (obj) {
                const varRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g;
                formula = formula.replace(varRegex, (match) => {
                    if (obj.hasOwnProperty(match) && match !== 'random' && match !== 'max' && match !== 'min') {
                        const value = obj[match];
                        if (typeof value === 'number') {
                            return value.toString();
                        }
                    }
                    return match;
                });
            }
            // 检查括号匹配
            let depth = 0;
            for (const char of formula) {
                if (char === '(')
                    depth++;
                else if (char === ')')
                    depth--;
                if (depth < 0)
                    return 0;
            }
            if (depth !== 0)
                return 0;
            return this.calculateExpression(formula);
        }
        /**
         * 计算基本表达式（不包含括号）
         */
        calculateExpression(expression) {
            // 处理括号内的表达式
            const parenRegex = /\(([^()]+)\)/;
            let formula = expression.trim();
            // 递归处理所有括号
            while (parenRegex.test(formula)) {
                formula = formula.replace(parenRegex, (_, subExpr) => {
                    const result = this.calculateExpression(subExpr);
                    return result.toString();
                });
            }
            // 先处理乘除法
            const mulDivRegex = /(-?\d*\.?\d+)\s*([*/])\s*(-?\d*\.?\d+)/;
            while (mulDivRegex.test(formula)) {
                formula = formula.replace(mulDivRegex, (_, n1, op, n2) => {
                    const num1 = Fraction.fromNumber(parseFloat(n1));
                    const num2 = Fraction.fromNumber(parseFloat(n2));
                    const handler = this.getOperatorHandler(op);
                    if (handler) {
                        const fraction = handler.handle(num1, num2);
                        const result = fraction.toNumber();
                        fraction.recycle();
                        return result.toString();
                    }
                    throw new Error(`Unknown operator: ${op}`);
                });
            }
            // 再处理加减法
            const addSubRegex = /(-?\d*\.?\d+)\s*([+-])\s*(-?\d*\.?\d+)/;
            while (addSubRegex.test(formula)) {
                formula = formula.replace(addSubRegex, (_, n1, op, n2) => {
                    const num1 = Fraction.fromNumber(parseFloat(n1));
                    const num2 = Fraction.fromNumber(parseFloat(n2));
                    const handler = this.getOperatorHandler(op);
                    if (handler) {
                        const fraction = handler.handle(num1, num2);
                        const result = fraction.toNumber();
                        fraction.recycle();
                        return result.toString();
                    }
                    throw new Error(`Unknown operator: ${op}`);
                });
            }
            return parseFloat(formula) || 0;
        }
        matchFunc(text, obj, funcNames = ["max", "min", "random", "clamp"]) {
            let result = text;
            let found = true;
            while (found) {
                found = false;
                for (let funcName of funcNames) {
                    let idx = result.indexOf(funcName + "(");
                    if (idx === -1)
                        continue;
                    // 找到函数名后，定位括号范围
                    let start = idx + funcName.length;
                    if (result[start] !== '(')
                        continue;
                    let left = 1;
                    let end = start + 1;
                    while (end < result.length && left > 0) {
                        if (result[end] === '(')
                            left++;
                        else if (result[end] === ')')
                            left--;
                        end++;
                    }
                    if (left !== 0)
                        continue;
                    // 提取参数字符串
                    let argsStr = result.substring(start + 1, end - 1);
                    // 拆分参数，支持嵌套
                    let args = [];
                    let depth = 0, last = 0;
                    for (let i = 0; i < argsStr.length; i++) {
                        if (argsStr[i] === '(')
                            depth++;
                        else if (argsStr[i] === ')')
                            depth--;
                        else if (argsStr[i] === ',' && depth === 0) {
                            args.push(argsStr.substring(last, i).trim());
                            last = i + 1;
                        }
                    }
                    if (last < argsStr.length)
                        args.push(argsStr.substring(last).trim());
                    // 递归计算每个参数
                    let calcArgs = args.map(arg => this.execPress(arg, obj));
                    // 获取处理器并计算
                    let handler = this.getFunctionHandler(funcName);
                    let value = handler ? handler.handle(calcArgs) : 0;
                    // 替换原始字符串中的函数表达式为结果
                    result = result.substring(0, idx) + value + result.substring(end);
                    found = true;
                    break;
                }
            }
            return result;
        }
    }
    ExpressUtil._defaultOperators = new Map([
        ['+', { handle: (left, right) => left.add(right) }],
        ['-', { handle: (left, right) => left.subtract(right) }],
        ['*', { handle: (left, right) => left.multiply(right) }],
        ['/', { handle: (left, right) => left.divide(right) }]
    ]);
    ExpressUtil._defaultFunctions = new Map([
        ['clamp', {
                handle: (args) => {
                    if (args.length === 0)
                        return 0;
                    if (args.length !== 3)
                        return args[0];
                    const [value, min, max] = args;
                    return Math.min(Math.max(value, min), max);
                }
            }],
        ['max', { handle: (args) => Math.max(...args) }],
        ['min', { handle: (args) => Math.min(...args) }],
        ['random', {
                handle: (args) => {
                    if (args.length === 0)
                        return Math.random();
                    if (args.length === 1)
                        return Math.random() * args[0];
                    const min = Math.min(...args);
                    const max = Math.max(...args);
                    return min + Math.random() * (max - min);
                }
            }]
    ]);

    /**
     * 日志管理类，用于统一日志输出格式
     */
    class TLogger {
        static print(level, styleColor, msg, ...tag) {
            let tagStr = "";
            if (tag && tag.length > 0) {
                for (let i = 0, leni = tag.length; i < leni; i++) {
                    tagStr += `[${tag[i]}] `;
                }
                switch (this.MODE) {
                    case 1:
                        if (this._denyTags[tag[0]]) { // 是不允许输出的tag，直接返回
                            return;
                        }
                        break;
                    case 2:
                        if (!this._allowTags[tag[0]]) { // 不是允许输出的tag，直接返回
                            return;
                        }
                        break;
                }
            }
            else {
                if (this.MODE >= 1) {
                    return;
                }
            }
            let args = [];
            const colorRegex = /<color=(?:#([A-Fa-f0-9]{6})|([a-zA-Z]+))>(.*?)<\/color>/g;
            if (this.DEV) {
                const styles = [];
                if (typeof (msg) == "object") {
                    args.push('%c%s');
                    args.push(`background:${styleColor}; padding: 3px; border-radius: 5px; border: 1px solid black; color: #000; font-weight: normal;`);
                    args.push(`${this.getDateString()} ${tagStr}${this.stack(5)}`);
                    args.push(msg);
                }
                else {
                    msg.toString && (msg = msg.toString());
                    msg = msg.replace(colorRegex, (_, hex, name, content) => {
                        // 如果是十六进制颜色值，使用 #hex
                        // 如果是颜色名称，直接使用名称
                        const color = hex ? `#${hex}` : name;
                        styles.push(`color: ${color}`, '');
                        return `%c${content}%c`;
                    });
                    msg = ' ' + msg;
                    args.push('%c%s%c%s ');
                    args.push(`background:${styleColor}; padding: 3px; border-radius: 5px; border: 1px solid black; color: #000; font-weight: normal;`);
                    args.push(`${this.getDateString()} ${tagStr}${this.stack(5)}`);
                    args.push("");
                    args.push(msg);
                    args.push(...styles);
                }
            }
            else {
                args.push("t-logger");
                if (typeof (msg) == "object") ;
                else {
                    msg.toString && (msg = msg.toString());
                    msg = msg.replace(colorRegex, '$3');
                }
                args.push(`${this.getDateString()} ${tagStr}`);
                args.push(msg);
            }
            console[level](...args);
        }
        static initConsole(cfg) {
            this.MODE = cfg.mode || 0;
            this.DEV = cfg.dev || false;
            this.WECHAT = cfg.wechat || false;
            const logClone = console.log;
            const warnClone = console.warn;
            const errorClone = console.error;
            if (!this.DEV) {
                console.log = function (...args) {
                    if (args.shift() != "t-logger") {
                        return;
                    }
                    logClone(...args);
                };
                console.warn = function (...args) {
                    if (args.shift() != "t-logger") {
                        return;
                    }
                    warnClone(...args);
                };
                console.error = function (...args) {
                    if (args.shift() != "t-logger") {
                        return;
                    }
                    errorClone(...args);
                };
            }
        }
        /**
         * 增加允许输出的tag
         */
        static addAllowTag(tag) {
            this._allowTags[tag] = true;
        }
        /**
         * 增加禁止输出的tag
         */
        static addDenyTag(tag) {
            this._denyTags[tag] = true;
        }
        /**
         * 用于输出一般信息
         */
        static log(msg, ...tag) {
            this.print('log', '#6495ed', msg, 'LOG', ...tag);
        }
        /**
         * 用于输出警告信息
         */
        static warn(msg, ...tag) {
            this.print('warn', '#ff7f50', msg, 'WARN', ...tag);
        }
        /**
         * 用于输出错误信息
         */
        static error(msg, ...tag) {
            this.print('error', '#ff4757', msg, 'ERROR', ...tag);
        }
        /**
         * 用于输出调试信息
         */
        static debug(msg, ...tag) {
            this.print('log', '#A274B8', msg, 'DEBUG', ...tag);
        }
        /**
         * 用于输出成功信息
         */
        static success(msg, ...tag) {
            this.print('log', '#00ae9d', msg, 'SUCC', ...tag);
        }
        /**
         * 自定义tag颜色输出
         */
        static logColor(msg, color, ...tag) {
            this.print('log', color, msg, ...tag);
        }
        static stack(index) {
            if (this.WECHAT) {
                return "";
            }
            var e = new Error();
            var lines = e.stack.split("\n");
            var result = [];
            lines.forEach((line) => {
                line = line.substring(7);
                var lineBreak = line.split(" ");
                if (lineBreak.length < 2) {
                    result.push(lineBreak[0]);
                }
                else {
                    result.push({ [lineBreak[0]]: lineBreak[1] });
                }
            });
            var list = [];
            var splitList = [];
            if (index < result.length - 1) {
                var value;
                for (var a in result[index]) {
                    var splitList = a.split(".");
                    if (splitList.length == 2) {
                        list = splitList.concat();
                    }
                    else {
                        value = result[index][a];
                        var start = value.lastIndexOf("/");
                        var end = value.lastIndexOf(".");
                        if (start > -1 && end > -1) {
                            var r = value.substring(start + 1, end);
                            list.push(r);
                        }
                        else {
                            list.push(value);
                        }
                    }
                }
            }
            if (list.length == 1) {
                return "[" + list[0] + ".ts]";
            }
            else if (list.length == 2) {
                return "[" + list[0] + ".ts->" + list[1] + "]";
            }
            return "";
        }
        static getDateString() {
            let d = new Date();
            let str = d.getHours().toString();
            let timeStr = "";
            timeStr += (str.length == 1 ? "0" + str : str) + ":";
            str = d.getMinutes().toString();
            timeStr += (str.length == 1 ? "0" + str : str) + ":";
            str = d.getSeconds().toString();
            timeStr += (str.length == 1 ? "0" + str : str) + ":";
            str = d.getMilliseconds().toString();
            if (str.length == 1)
                str = "00" + str;
            if (str.length == 2)
                str = "0" + str;
            timeStr += str;
            timeStr = "[" + timeStr + "]";
            return timeStr;
        }
    }
    /**0：都打印 1：被禁止的不打印 3：只打印允许的 */
    TLogger.MODE = 0;
    /**为true简化打印信息并且不打印console.log */
    TLogger.DEV = false;
    TLogger.WECHAT = false;
    TLogger._consoles = {};
    TLogger._allowTags = {}; // 允许输出的tag list
    TLogger._denyTags = {}; // 禁止输出的tag list

    var BulletStatus;
    (function (BulletStatus) {
        BulletStatus[BulletStatus["None"] = 0] = "None";
        BulletStatus[BulletStatus["Move"] = 1] = "Move";
        BulletStatus[BulletStatus["Arrived"] = 2] = "Arrived";
        BulletStatus[BulletStatus["Hit"] = 3] = "Hit";
        BulletStatus[BulletStatus["HitInterval"] = 4] = "HitInterval";
        BulletStatus[BulletStatus["Die"] = 5] = "Die"; // 死亡
    })(BulletStatus || (BulletStatus = {}));

    class BattleBulletBase {
        constructor() {
            this._status = BulletStatus.None;
        }
        initBullet(battleMgr, id, actorId, param) {
            this._battleMgr = battleMgr;
            this._id = id;
            this._actorId = actorId;
            this._param = param;
            this._pos = bv3(param.startPos.x, param.startPos.y);
            switch (this._param.posType) {
                case 1:
                    let actorUnit = this._battleMgr.getUnit(this._actorId);
                    if (actorUnit) {
                        if (!this._arrivePos) {
                            this._arrivePos = bv3();
                        }
                        this._arrivePos.setTo(actorUnit.pos);
                    }
                    break;
                case 2:
                    if (this._param.targetPos) {
                        if (!this._arrivePos) {
                            this._arrivePos = bv3();
                        }
                        this._arrivePos.setTo(this._param.targetPos);
                    }
                    else {
                        let targetUnit = this._battleMgr.getUnit(this._param.targetUnitId);
                        if (targetUnit) {
                            if (!this._arrivePos) {
                                this._arrivePos = bv3();
                            }
                            this._arrivePos.setTo(targetUnit.pos);
                        }
                    }
                    break;
                default:
                    let targetUnit = this._battleMgr.getUnit(this._param.targetUnitId);
                    if (targetUnit) {
                        if (!this._arrivePos) {
                            this._arrivePos = bv3();
                        }
                        this._arrivePos.setTo(targetUnit.pos);
                    }
                    break;
            }
            if (!this._arrivePos) {
                this.toDie();
                return;
            }
            if (this._param.targetPos) {
                if (!this._hitPos) {
                    this._hitPos = bv3();
                }
                this._hitPos.setTo(this._param.targetPos);
            }
            else {
                let targetUnit = this._battleMgr.getUnit(this._param.targetUnitId);
                if (targetUnit) {
                    if (!this._hitPos) {
                        this._hitPos = bv3();
                    }
                    this._hitPos.setTo(targetUnit.pos);
                }
            }
            if (!this._hitPos) {
                this.toDie();
                return;
            }
            this._hitCount = 0;
            this._hitLimit = 1;
            if (this.getSkillCfg().bullet) {
                this._bCfg = battle.config.getBullet(this.getSkillCfg().bullet);
                if (!this._bCfg) {
                    this.toDie();
                    return;
                }
                this._battleMgr.addRecord(exports.BattleRecordDataType.BulletAdd, { uid: this._actorId, bulletAdd: { bulletId: this._id, bulletCfgId: this._bCfg.id, skillId: this._param.skillId, targetUnitId: this._param.targetUnitId, posx: this._arrivePos.x, posy: this._arrivePos.y } });
                if (this._bCfg.time > 0 && this._bCfg.interval > 0) {
                    this._hitLimit = 1 + Math.floor(this._bCfg.time / this._bCfg.interval);
                }
            }
            this.onInit();
        }
        bId() {
            return this._id;
        }
        update(dt) {
            switch (this._status) {
                case BulletStatus.Arrived:
                    this.onArrived(dt);
                    break;
                case BulletStatus.HitInterval:
                    this.onHitInterval(dt);
                    break;
            }
        }
        getSkillCfg() {
            if (!this._skillCfg) {
                this._skillCfg = battle.config.getSkill(this._param.skillId); // TODO: 缓存skillCfg
            }
            return this._skillCfg;
        }
        onInit() {
            this.toArrived();
        }
        toArrived() {
            this._pos.setTo(this._arrivePos);
            this._status = BulletStatus.Arrived;
            this._hitDelay = this.getSkillCfg().hitDelay;
            let actorPos = this._battleMgr.getUnitPos(this._actorId);
            this._angle = BMath.getAngleBetweenPos(actorPos, this._hitPos);
            // this._battleMgr.addRecord(BattleRecordDataType.BulletArrive, [this._id, this._param.startUnitId, this._param.skillId, this._angle, this._param.targetUnitId, posStr2]);
            this._battleMgr.addRecord(exports.BattleRecordDataType.BulletArrive, { uid: this._actorId, bulletArrive: { bulletId: this._id, startUnitId: this._param.startUnitId, skillId: this._param.skillId, angle: this._angle, targetUnitId: this._param.targetUnitId, posx: this._arrivePos.x, posy: this._arrivePos.y } });
        }
        onArrived(dt) {
            this._hitDelay -= dt;
            if (this._hitDelay <= 0) {
                this.toHit();
            }
        }
        toHit() {
            this._hitCount++;
            let actorUnit = this._battleMgr.getUnit(this._actorId);
            if (actorUnit) {
                // this._battleMgr.addRecord(BattleRecordDataType.BulletHit, [this._id, this._param.startUnitId, this._param.skillId, this._angle, this._param.targetUnitId, posStr2]);
                this._battleMgr.addRecord(exports.BattleRecordDataType.BulletHit, { uid: this._actorId, bulletHit: { bulletId: this._id, startUnitId: this._param.startUnitId, skillId: this._param.skillId, angle: this._angle, targetUnitId: this._param.targetUnitId, posx: this._hitPos.x, posy: this._hitPos.y } });
                let targetUnit;
                let skillConfig = battle.config.getSkill(this._param.skillId);
                let hitFunc = battle.skillMgr.GetProcesserFunc(exports.SkillProcessEnum.Hit, skillConfig.processKey);
                let exParam = ObjectUtil.deepClone(this._param.cfgParam);
                let resultTmp = {};
                let hitTargets;
                if (this._param.findId) {
                    let pos = this._pos;
                    let find = battle.config.getFindTarget(NumberUtil.myParseInt(this._param.findId));
                    let findParam = { find, oriPos: pos, angle: this._angle };
                    findParam.bulluetTargetUid = this._param.targetUnitId;
                    //第三次找人要带上角度
                    let targetFinded = BattleSelector.GetSkillTarget(actorUnit, findParam);
                    if (targetFinded && targetFinded.units) {
                        hitTargets = targetFinded.units;
                    }
                }
                else {
                    if (this._param.targetUnitId) {
                        targetUnit = this._battleMgr.getUnit(this._param.targetUnitId);
                        if (targetUnit) {
                            hitTargets = [targetUnit.uid];
                        }
                    }
                }
                if (hitTargets && hitTargets.length > 0) {
                    this._param.abilityResult.hitCount3 = hitTargets.length;
                    let abilityParam = {};
                    abilityParam.beHitUid = this._param.targetUnitId;
                    resultTmp = actorUnit.buffComp.triggerBuff(exports.TriggerEnum.BulletHit, { skillId: this._param.skillId, hitCount2: this._param.abilityResult.hitCount2, hitCount3: this._param.abilityResult.hitCount3 }, abilityParam, null);
                    this._param.abilityResult = BattleCommon.MergeBuffAbilityReturn(this._param.abilityResult, resultTmp);
                    if (skillConfig.shareOut) {
                        exParam.skillPer = FNumber.value(exParam.skillPer).div(hitTargets.length).value;
                    }
                    this._param.abilityResult.findTarget3 = [];
                    for (let i = 0, leni = hitTargets.length; i < leni; i++) {
                        this._param.abilityResult.findTarget3.push(hitTargets[i]);
                    }
                    for (let i = 0, leni = hitTargets.length; i < leni; i++) {
                        hitFunc({
                            unit: actorUnit,
                            skillId: this._param.skillId,
                            cfgParam: exParam,
                            target: hitTargets[i],
                            skillRate: 1,
                            result: this._param.abilityResult,
                        });
                    }
                }
            }
            if (this.checkHitCount()) {
                this._status = BulletStatus.HitInterval;
                this._hitDelay = this._bCfg.interval;
            }
            else {
                this.toDie();
            }
        }
        onHitInterval(dt) {
            this._hitDelay -= dt;
            if (this._hitDelay <= 0) {
                this.toHit();
            }
        }
        /**检测子弹是否还有触发次数 */
        checkHitCount() {
            if (this._hitLimit > this._hitCount) {
                return true;
            }
            return false;
        }
        toDie() {
            this._status = BulletStatus.Die;
        }
        isDie() {
            return this._status === BulletStatus.Die;
        }
    }

    class BattleBulletMove extends BattleBulletBase {
        update(dt) {
            if (this._status == BulletStatus.Move) {
                this.onMove(dt);
            }
            else {
                super.update(dt);
            }
        }
        onInit() {
            this.toMove();
        }
        toMove() {
            this._status = BulletStatus.Move;
        }
        onMove(dt) {
            if (this._param.targetUnitId) {
                let targetUnit = this._battleMgr.getUnit(this._param.targetUnitId);
                if (targetUnit) {
                    this._arrivePos.setTo(targetUnit.pos);
                }
            }
            let moveDis = FNumber.value(this._bCfg.speed).mul(dt).div(1000).value;
            let moveVec = this._arrivePos.Sub(this._pos);
            let disTmp = moveVec.Mag();
            if (disTmp < 100) {
                // 寻找下一个节点
                this.toArrived();
            }
            else {
                moveDis = Math.min(disTmp, moveDis);
                moveVec = moveVec.Normalized().Times(moveDis);
                this._pos.setTo(FNumber.value(this._pos.x).add(moveVec.x).value, FNumber.value(this._pos.y).add(moveVec.y).value);
            }
        }
    }

    class BattleBulletFactory {
        static get instance() {
            if (!this._instance) {
                this._instance = new BattleBulletFactory();
            }
            return this._instance;
        }
        /**获取一个子弹 */
        getBullet(bulletCfg) {
            if (!bulletCfg) {
                return new BattleBulletBase();
            }
            else {
                switch (bulletCfg.moveType) {
                    case 1:
                        return new BattleBulletBase();
                    case 2:
                        return new BattleBulletMove();
                    default:
                        return new BattleBulletBase();
                }
            }
        }
        /**回收一个子弹 */
        putBullet(bullet) {
        }
    }

    class BuffComponent {
        constructor(owner) {
            this._owner = owner;
            this._buffMap = new Map();
            this._debuffMap = new Map();
            this._triggerBuff = new Map();
            // this._triggerDelBuff = new Map();
            this._abilityBuff = new Map();
            this._typeBuff = new Map();
            this._uniqueAbilityBuff = {};
            // this._moveBuff = new Map();
            // this._tauntBuff = new Map();
            this._buffAddDelay = [];
            this._addBuffCount1 = new Map();
            this._addBuffCount2 = new Map();
            this._addBuffFlag = false;
            this._delBuffCount1 = new Map();
            this._delBuffCount2 = new Map();
            this._delBuffFlag = false;
            this._addBuffCount2Other1 = new Map();
            this._addBuffCount2Other2 = new Map();
            this._addBuffFlag2Other = false;
            this._triggerCount1 = new Map();
            this._triggerCount2 = new Map();
            this._triggerCountUpdate = false;
            this._skillKillCount = new Map();
            this._skillKillCountTotal = 0;
            this._skillKillFlag = false;
            this._missCount = 0;
            this._missFlag = false;
            this._beHitCount = 0;
            this._subHpCount = 0;
            this._hitUnitCount = {};
            this._normalHitUnitCount = {};
            this._replaceBuff = {};
            this._hpUpdate = false;
            this._hpSubTotal =
                this._hpSubPerTotal =
                    this._hpAddTotal =
                        this._hpAddPerTotal = 0;
            this._firstBeAttackCount = 0;
            this._noCureCount = 0;
            this._ignoreDamage = new Map();
            this._ignoreDamage.set(exports.DamageType.Normal, 0);
            this._ignoreDamage.set(exports.DamageType.Skill, 0);
            this._ignoreDamage.set(exports.DamageType.Dot, 0);
            this._lockHp = 0;
            this._noDie = 0;
            this._skillUseCountUpdate = false;
        }
        update(dt) {
            for (const buff of this._buffMap.values()) {
                buff.update(dt);
            }
            // this.moveBuff && this.moveBuff.update(dt);
            // this.tauntBuff && this.tauntBuff.update(dt);
            // 触发自己加buff
            if (this._addBuffFlag) {
                this._addBuffFlag = false;
                this.triggerBuff(exports.TriggerEnum.AddBuff2Self, null, null, null);
            }
            // 触发给别人加buff
            if (this._addBuffFlag2Other) {
                this._addBuffFlag2Other = false;
                this.triggerBuff(exports.TriggerEnum.AddBuff2Other, null, null, null);
            }
            // 技能击杀
            if (this._skillKillFlag) {
                this._skillKillFlag = false;
                this.triggerBuff(exports.TriggerEnum.SkillKillCount, null, null, null);
            }
            // 触发buff移除
            if (this._delBuffFlag) {
                this._delBuffFlag = false;
                this.triggerBuff(exports.TriggerEnum.SubBuff, null, null, null);
            }
            // 闪避次数变化
            if (this._missFlag) {
                this._missFlag = false;
                this.triggerBuff(exports.TriggerEnum.MissCountChange, null, null, null);
            }
            // 血量变化
            if (this._hpUpdate) {
                this._hpUpdate = false;
                this.triggerBuff(exports.TriggerEnum.HpChange2, null, null, null);
            }
            // buff触发次数变化
            if (this._triggerCountUpdate) {
                this._triggerCountUpdate = false;
                this.triggerBuff(exports.TriggerEnum.BuffTriggerCount, null, null, null);
            }
            // 使用技能触发次数变化
            if (this._skillUseCountUpdate) {
                this._skillUseCountUpdate = false;
                this.triggerBuff(exports.TriggerEnum.SkillUseCount, null, null, null);
            }
        }
        /**尝试清理单位buff */
        tryClearBuff() {
            for (const buff of this._buffMap.values()) {
                buff.tryClear();
            }
        }
        /**添加buff */
        addBuff(actorId, id, skillId, addCount = 1, beHitId = "", addParam) {
            if (this._owner.isQifen) {
                return;
            }
            if (this._replaceBuff[id]) {
                id = this._replaceBuff[id];
            }
            //如果时间为1，直接触发，不需要添加
            let config = battle.config.getBuff(id);
            if (!config) {
                return;
            }
            // 被免疫不添加
            if (this._owner.attrComp.checkBuffImmunity(config.buffType, config.ability)) {
                this._owner.battleMgr.addRecord(exports.BattleRecordDataType.BuffImmunity, { uid: this._owner.uid, buff: { buffId: id } });
                return;
            }
            if (config.overlap == exports.BuffOverlap.NoHandle && this._buffMap.has(id)) {
                return;
            }
            let actorUnit = this._owner.battleMgr.getUnit(actorId);
            if (!actorUnit) {
                return;
            }
            let buffExtendTime = 0; // buff延长时间
            let conditionParam = {};
            conditionParam.actorUid = actorId;
            conditionParam.beHitUid = this._owner.uid;
            conditionParam.buffId = id;
            conditionParam.buffType = config.buffType;
            let abilityParam = {};
            if (actorId != this._owner.uid) {
                // 施加者触发加buff
                abilityParam.actorUid = actorId;
                if (actorUnit) {
                    actorUnit.buffComp.recordAddBuffCount2Other(id, config.buffType, addCount);
                }
                if (actorUnit.teamId != this._owner.teamId) {
                    this._owner.battleMgr.getTeam(actorUnit.teamId).recordActBuffCount(id, config.buffType, addCount);
                }
            }
            abilityParam.addBuffInfo = { actorId, id, skillId, addCount, beHitId, addParam };
            let result;
            if (!addParam || !addParam.isLink) {
                result = this.triggerBuff(exports.TriggerEnum.BuffAddBefore, conditionParam, abilityParam, null);
                buffExtendTime += result.buffExtendTime || 0;
                result.buffExtendTime = 0;
            }
            if (result) {
                if (result.immunityBuffType && NumberUtil.myParseInt(result.immunityBuffType[config.buffType]) > 0) {
                    this._owner.battleMgr.addRecord(exports.BattleRecordDataType.BuffImmunity, { uid: this._owner.uid, buff: { buffId: id } });
                    return;
                }
                if (result.immunityBuffAbility && NumberUtil.myParseInt(result.immunityBuffAbility[config.ability]) > 0) {
                    this._owner.battleMgr.addRecord(exports.BattleRecordDataType.BuffImmunity, { uid: this._owner.uid, buff: { buffId: id } });
                    return;
                }
            }
            if (actorUnit) {
                abilityParam.beHitUid = this._owner.uid;
                abilityParam.skill = battle.config.getSkill(skillId);
                result = BattleCommon.MergeBuffAbilityReturn(result, actorUnit.buffComp.triggerBuff(exports.TriggerEnum.BuffAddBefore2Other, conditionParam, abilityParam, result));
                buffExtendTime += result.buffExtendTime || 0;
                result.buffExtendTime = 0;
            }
            if (result && result.addCount && result.addCount > 0) {
                addCount += result.addCount;
            }
            // 检测buff类型上限
            let curTypeCount = this.getBuffCountByType(config.buffType);
            let buffTypeInfo = battle.config.getBuffType(config.buffType);
            if (buffTypeInfo && buffTypeInfo.overlapLimit > 0) {
                let overlimit = buffTypeInfo.overlapLimit;
                //加上buff改变的上限
                overlimit += this._owner.attrComp.getBuffOverlimit(config.buffType);
                addCount = Math.min(addCount, overlimit);
                if (addCount > (overlimit - curTypeCount)) {
                    this.delBuffByType(config.buffType, addCount + curTypeCount - overlimit);
                }
            }
            let buff = this._buffMap.get(config.id);
            if (!buff) {
                buff = BuffFactory.creatBuff(config.ability);
                buff.initBuff(this._owner, config);
                if (BuffComponent.UniqueAbility[config.ability]) {
                    let uniqueTag = BuffComponent.UniqueAbility[config.ability];
                    let uniqueBuff = this._uniqueAbilityBuff[uniqueTag];
                    if (uniqueBuff) {
                        this.removeBuff(uniqueBuff.getConfig().id, exports.BuffRemoveType.None);
                    }
                    this._uniqueAbilityBuff[uniqueTag] = buff;
                }
                this._buffMap.set(config.id, buff);
                // 记录debuff
                if (config.isDebuff) {
                    this._debuffMap.set(config.id, buff);
                }
                // 按触发类型分类
                if (config.trigger) {
                    let triggers = config.trigger.split("#");
                    for (let i = 0, leni = triggers.length; i < leni; i++) {
                        let triggerType = NumberUtil.myParseInt(triggers[i]);
                        if (this._triggerBuff.has(triggerType)) {
                            this._triggerBuff.get(triggerType).set(config.id, buff);
                        }
                        else {
                            let triggerBuffMap = new Map();
                            triggerBuffMap.set(config.id, buff);
                            this._triggerBuff.set(triggerType, triggerBuffMap);
                        }
                    }
                }
                // 按效果类型分类
                if (this._abilityBuff.has(config.ability)) {
                    this._abilityBuff.get(config.ability).set(config.id, buff);
                }
                else {
                    let abilityBuffMap = new Map();
                    abilityBuffMap.set(config.id, buff);
                    this._abilityBuff.set(config.ability, abilityBuffMap);
                }
                if (config.buffType) {
                    // 按效果类型分类
                    if (this._typeBuff.has(config.buffType)) {
                        this._typeBuff.get(config.buffType).set(config.id, buff);
                    }
                    else {
                        let typeMap = new Map();
                        typeMap.set(config.id, buff);
                        this._typeBuff.set(config.buffType, typeMap);
                    }
                }
                addCount = buff.add(actorId, skillId, addCount, beHitId, addParam, buffExtendTime);
                this._owner.battleMgr.addRecord(exports.BattleRecordDataType.BuffAdd, {
                    uid: this._owner.uid, buff: { buffId: config.id, add: { actorId: actorId, skillId: skillId, extraParam: buff.getExtraParam() } }
                });
            }
            else {
                addCount = buff.add(actorId, skillId, addCount, beHitId, addParam, buffExtendTime);
            }
            // 自己触发加buff
            this.recordAddBuffCount(id, config.buffType, addCount);
            // 处理衍生buff
            if (config.derive) {
                this.addBuff(actorId, config.derive, skillId, addCount, beHitId);
            }
            // 记录控制
            if (config.isControl) {
                let parentId = this._owner.getParentData() ? this._owner.getParentData().clientId : "";
                this._owner.battleMgr.getResult().updateReport(actorUnit.unitData.clientId, exports.BattleReportType.Control, 1, parentId);
            }
            if (!addParam || !addParam.isLink) {
                result = this.triggerBuff(exports.TriggerEnum.BuffAddAfter, conditionParam, abilityParam, null);
            }
            // if (actorId != this._owner.uid) {
            //     // 施加者触发加buff
            //     let actor: BattleUnit = this._owner.battleMgr.getUnit(actorId);
            //     if (actor) {
            //         actor.buffComp.recordAddBuffCount2Other(id, config.buffType, addCount);
            //     }
            // }
        }
        /**减buff层数 */
        delBuff(buffId, count, percent) {
            if (!count) {
                count = 0;
            }
            if (this._buffMap.has(buffId)) {
                let buff = this._buffMap.get(buffId);
                let hasCount = buff.getCount();
                if (percent) {
                    count = Math.floor(FNumber.value(hasCount).mul(percent).div(BattleCommon.AttributeMultiplying).value);
                    count = Math.max(count, 1);
                }
                let delType = buff.getConfig().buffType;
                let removeCount = 0;
                if (count == 0) {
                    removeCount = hasCount;
                    this.removeBuff(buffId, exports.BuffRemoveType.Del);
                }
                else {
                    removeCount = buff.delCount(count);
                }
                this.recordDelBuffCount(buffId, delType, removeCount);
            }
        }
        /**减buff层数(通过类型) */
        delBuffByType(buffType, count, percent) {
            if (!count) {
                count = 0;
            }
            let typeCount = this.getBuffCountByType(buffType);
            if (percent) {
                count = Math.floor(FNumber.value(typeCount).mul(percent).div(BattleCommon.AttributeMultiplying).value);
                count = Math.max(count, 1);
            }
            if (this._typeBuff.has(buffType)) {
                let mapTmp = this._typeBuff.get(buffType);
                let removeCount = 0;
                if (count == 0) {
                    for (const buff of mapTmp.values()) {
                        removeCount = buff.getCount();
                        this.removeBuff(buff.getConfig().id, exports.BuffRemoveType.Del);
                        this.recordDelBuffCount(buff.getConfig().id, buffType, removeCount);
                    }
                }
                else {
                    for (const buff of mapTmp.values()) {
                        if (count <= 0) {
                            break;
                        }
                        removeCount = buff.delCount(count);
                        count -= removeCount;
                        this.recordDelBuffCount(buff.getConfig().id, buffType, removeCount);
                    }
                }
            }
        }
        /**移除buff */
        removeBuff(id, removeType) {
            let buff = this._buffMap.get(id);
            if (buff) {
                let buffType = buff.getConfig().buffType;
                if (buffType == exports.BuffType.Julongfengyin) {
                    // 巨龙封印全部一起删除
                    let mapTmp = this._typeBuff.get(buffType);
                    for (const buff of mapTmp.values()) {
                        this.doRemoveBuff(buff, removeType);
                    }
                }
                else {
                    this.doRemoveBuff(buff, removeType);
                }
            }
            switch (removeType) {
                case exports.BuffRemoveType.Del:
                    this._owner.battleMgr.battleLog(`[${this._owner.uid}]删除buff[${id}],删除方式=>被删除`, "BUFF");
                    break;
                case exports.BuffRemoveType.Time:
                    this._owner.battleMgr.battleLog(`[${this._owner.uid}]删除buff[${id}],删除方式=>时间到了`, "BUFF");
                    break;
                case exports.BuffRemoveType.Ability:
                    this._owner.battleMgr.battleLog(`[${this._owner.uid}]删除buff[${id}],删除方式=>能力没了`, "BUFF");
            }
        }
        doRemoveBuff(buff, removeType) {
            let id = buff.getConfig().id;
            this._buffMap.delete(id);
            this._debuffMap.delete(id);
            //删除触发分类
            if (buff.getConfig().trigger) {
                let triggers = buff.getConfig().trigger.split("#");
                for (let i = 0, leni = triggers.length; i < leni; i++) {
                    let triggerType = NumberUtil.myParseInt(triggers[i]);
                    if (this._triggerBuff.has(triggerType)) {
                        this._triggerBuff.get(triggerType).delete(id);
                        if (this._triggerBuff.get(triggerType).size === 0) {
                            this._triggerBuff.delete(triggerType);
                        }
                    }
                }
            }
            //删除效果分类
            let ability = buff.getConfig().ability;
            if (this._abilityBuff.has(ability)) {
                this._abilityBuff.get(ability).delete(id);
                if (this._abilityBuff.get(ability).size === 0) {
                    this._abilityBuff.delete(ability);
                }
            }
            //删除buff类型分类
            let buffType = buff.getConfig().buffType;
            if (this._typeBuff.has(buffType)) {
                this._typeBuff.get(buffType).delete(id);
                if (this._typeBuff.get(buffType).size === 0) {
                    this._typeBuff.delete(buffType);
                    let conditionParam = {};
                    conditionParam.buffType = buffType;
                    switch (removeType) {
                        case exports.BuffRemoveType.Del:
                            this.triggerBuff(exports.TriggerEnum.BuffTypeRemove1, conditionParam, null, null);
                            break;
                        case exports.BuffRemoveType.Time:
                            this.triggerBuff(exports.TriggerEnum.BuffTypeRemove2, conditionParam, null, null);
                            break;
                        case exports.BuffRemoveType.Ability:
                            this.triggerBuff(exports.TriggerEnum.BuffTypeRemove3, conditionParam, null, null);
                            break;
                    }
                }
            }
            // if (this._moveBuff.has(id)) {
            //     this._moveBuff.delete(id);
            // }
            // if (this._tauntBuff.has(id)) {
            //     this._tauntBuff.delete(id);
            // }
            buff.remove();
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.BuffRemove, { uid: this._owner.uid, buff: { buffId: buff.getConfig().id } });
        }
        /**记录要增加的buff，在主循环最后来调用增加buff */
        recordBuff(actorId, id, skillId, addCount, beHitId, addParam) {
            if (!id || !skillId) {
                return;
            }
            this._buffAddDelay.push({ actorId, id, skillId, addCount, beHitId, addParam });
        }
        addRecordBuff() {
            let recordTmp = this._buffAddDelay.splice(0);
            for (let i = 0, leni = recordTmp.length; i < leni; i++) {
                this.addBuff(recordTmp[i].actorId, recordTmp[i].id, recordTmp[i].skillId, recordTmp[i].addCount, recordTmp[i].beHitId, recordTmp[i].addParam);
            }
            // this._buffRecord.length = 0;
        }
        // /**刷新属性buff */
        // refreshAtr() {
        //     for (const buff of this._buffMap.values()) {
        //         buff.refreshAtr();
        //     }
        // }
        /**刷新属性buff */
        refreshBehavior() {
            this._owner.behavior.resetOpt();
            if (this._abilityBuff.has(exports.AbilityEnum.ChangeBehavior)) {
                let mapTmp = this._abilityBuff.get(exports.AbilityEnum.ChangeBehavior);
                for (const buff of mapTmp.values()) {
                    buff.refreshBehavior();
                }
            }
        }
        /**结算dot */
        settlementDot(count, buffTypes) {
            if (this._abilityBuff.has(exports.AbilityEnum.Damge3)) {
                let mapTmp = this._abilityBuff.get(exports.AbilityEnum.Damge3);
                for (const buff of mapTmp.values()) {
                    if (count <= 0) {
                        break;
                    }
                    if (!buffTypes || buffTypes.indexOf(buff.getConfig().buffType.toString()) >= 0) {
                        count = buff.settlement(count);
                    }
                }
            }
        }
        /**重置buff时间 */
        resetTime(buffId, buffType) {
            if (buffType) {
                if (this._typeBuff.has(buffType)) {
                    let mapTmp = this._typeBuff.get(buffType);
                    for (const buff of mapTmp.values()) {
                        buff.resetTime();
                    }
                }
            }
            else {
                if (buffId && this.getBuffById(buffId)) {
                    this.getBuffById(buffId).resetTime();
                }
            }
        }
        /**增加buff持续时间 */
        addBuffTime(time, buffId, buffType) {
            if (buffType) {
                if (this._typeBuff.has(buffType)) {
                    let mapTmp = this._typeBuff.get(buffType);
                    for (const buff of mapTmp.values()) {
                        buff.addTime(time);
                    }
                }
            }
            else {
                if (buffId) {
                    this.getBuffById(buffId).addTime(time);
                }
            }
        }
        /**刷新buff持续时间 */
        refreshRemoveTime(buffId, buffType) {
            if (buffType) {
                if (this._typeBuff.has(buffType)) {
                    let mapTmp = this._typeBuff.get(buffType);
                    for (const buff of mapTmp.values()) {
                        buff.refreshRemoveTime();
                    }
                }
            }
            else {
                if (buffId) {
                    this.getBuffById(buffId).refreshRemoveTime();
                }
            }
        }
        /**检测buff触发条件 */
        triggerBuff(type, param, abilityParam, inResult) {
            let rtn = {};
            //触发buff
            if (this._triggerBuff.has(type)) {
                for (const buff of this._triggerBuff.get(type).values()) {
                    if (abilityParam && abilityParam.buffId && abilityParam.buffId == buff.getConfig().id) {
                        continue;
                    }
                    rtn = BattleCommon.MergeBuffAbilityReturn(rtn, buff.checkTrigger(type, ObjectUtil.deepClone(param), ObjectUtil.deepClone(abilityParam), inResult));
                }
            }
            // if (this._owner.getParent()) {
            //     let parent: BattleUnit = this._owner.getParent();
            //     rtn = BattleCommon.MergeBuffAbilityReturn(rtn, parent.buffComp.triggerBuff(type, param, abilityParam, inResult));
            // }
            // //判断移除
            // if (this._triggerDelBuff.has(type)) {
            //     for (const buff of this._triggerDelBuff.get(type).values()) {
            //         buff.checkRemove(type, param);
            //     }
            // }
            return rtn;
        }
        /**
         * 移除debuff
         * @param count 移除的数量，无则移除所有debuff
         */
        clearDebuff(count) {
            if (!count) {
                count = 10000;
            }
            let debuffs = Array.from(this._debuffMap.values());
            let debuffCount = debuffs.length;
            //限制一下次数，做个保险
            let whileCount = 20;
            while (debuffCount > 0 && count > 0 && whileCount > 0) {
                whileCount--;
                let random = Math.floor(this._owner.battleMgr.getRandom().random() * debuffCount);
                let delCount = debuffs[random].delCount(count);
                count -= delCount;
                if (count > 0) {
                    debuffs.splice(random, 1);
                    debuffCount = debuffs.length;
                }
                else {
                    break;
                }
            }
        }
        /**受伤害阈值 */
        getBeHurtThreshold() {
            let value = 0;
            let valueTmp;
            if (this._abilityBuff.has(exports.AbilityEnum.BeHurtThreshold)) {
                for (const buff of this._abilityBuff.get(exports.AbilityEnum.BeHurtThreshold).values()) {
                    valueTmp = buff.getAbility().beHurtThreshold;
                    if (buff.getAbility().beHurtThresholdPer1 > 0) {
                        let atkTmp = this._owner.attrComp.getAtrAtk();
                        atkTmp = FNumber.value(atkTmp).mul(buff.getAbility().beHurtThresholdPer1).div(BattleCommon.AttributeMultiplying).value;
                        valueTmp = FNumber.value(valueTmp).add(atkTmp).value;
                    }
                    if (buff.getAbility().beHurtThresholdPer2 > 0) {
                        let hpTmp = this._owner.attrComp.hp;
                        hpTmp = FNumber.value(hpTmp).mul(buff.getAbility().beHurtThresholdPer2).div(BattleCommon.AttributeMultiplying).value;
                        valueTmp = FNumber.value(valueTmp).add(hpTmp).value;
                    }
                    if (buff.getAbility().beHurtThresholdPer3 > 0) {
                        let maxHpTmp = this._owner.attrComp.getMaxHp();
                        maxHpTmp = FNumber.value(maxHpTmp).mul(buff.getAbility().beHurtThresholdPer3).div(BattleCommon.AttributeMultiplying).value;
                        valueTmp = FNumber.value(valueTmp).add(maxHpTmp).value;
                    }
                    if (value <= 0 || value > valueTmp) {
                        value = valueTmp;
                    }
                }
            }
            return value;
        }
        /**
         * 扣护盾
         * @param value 需要扣除
         * @returns 剩余未扣除（护盾不够）
         */
        delShield(value) {
            let ability = { shield: value };
            if (this._abilityBuff.has(exports.AbilityEnum.Shield)) {
                for (const buff of this._abilityBuff.get(exports.AbilityEnum.Shield).values()) {
                    if (ability.shield <= 0) {
                        break;
                    }
                    ability = buff.subAbility(ability).subAbility;
                }
                this._owner.attrComp.updateShield();
            }
            return ability.shield;
        }
        /**护盾值 */
        getShield() {
            let value = 0;
            if (this._abilityBuff.has(exports.AbilityEnum.Shield)) {
                for (const buff of this._abilityBuff.get(exports.AbilityEnum.Shield).values()) {
                    value += (buff.getAbility().shield || 0);
                }
            }
            return value;
        }
        /**是否有护盾 */
        hasShield() {
            return this._abilityBuff.has(exports.AbilityEnum.Shield);
        }
        /**
         * 通过buffid获取buff
         * @param buffId buffId
         * @returns 数量
         */
        getBuffById(buffId) {
            if (this._buffMap.has(buffId)) {
                return this._buffMap.get(buffId);
            }
            else {
                return null;
            }
        }
        /**
         * 通过buffid获取数量
         * @param buffId buffId
         * @returns 数量
         */
        getBuffCountById(buffId) {
            buffId = NumberUtil.myParseInt(buffId);
            if (this._buffMap.has(buffId)) {
                return this._buffMap.get(buffId).getCount();
            }
            else {
                return 0;
            }
        }
        /**获取类型buff */
        getBuffsByType(type) {
            return this._typeBuff.get(type);
        }
        /**是否处于控制中 */
        checkInControl() {
            if (this._abilityBuff.has(exports.AbilityEnum.ChangeBehavior)) {
                let mapTmp = this._abilityBuff.get(exports.AbilityEnum.ChangeBehavior);
                for (const buff of mapTmp.values()) {
                    if (buff.getConfig().isControl) {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * 通过buff类型获取数量
         * @param ability 效果类型
         * @returns 数量
         */
        getBuffCountByType(type) {
            if (this._typeBuff.has(type)) {
                let count = 0;
                let mapTmp = this._typeBuff.get(type);
                for (const buff of mapTmp.values()) {
                    count += buff.getCount();
                }
                return count;
            }
            else {
                return 0;
            }
        }
        /**
         * 通过buff效果类型获取数量
         * @param ability 效果类型
         * @returns 数量
         */
        getBuffCountByAbility(ability) {
            if (this._abilityBuff.has(ability)) {
                let count = 0;
                let mapTmp = this._abilityBuff.get(ability);
                for (const buff of mapTmp.values()) {
                    count += buff.getCount();
                }
                return count;
            }
            else {
                return 0;
            }
        }
        /**是否被优先攻击 */
        addFirstBeAttack() {
            this._firstBeAttackCount++;
        }
        delFirstBeAttack() {
            this._firstBeAttackCount = Math.max(this._firstBeAttackCount - 1, 0);
        }
        isFirstBeAttack() {
            return this._firstBeAttackCount > 0;
        }
        /**是否禁止治疗 */
        addNoCure() {
            this._noCureCount++;
        }
        delNoCure() {
            this._noCureCount = Math.max(this._noCureCount - 1, 0);
        }
        isNoCure() {
            return this._noCureCount > 0;
        }
        /**免疫伤害类型 */
        addIgnoreDamage(type) {
            if (this._ignoreDamage.has(type)) {
                this._ignoreDamage.set(type, this._ignoreDamage.get(type) + 1);
            }
        }
        delIgnoreDamage(type) {
            if (this._ignoreDamage.has(type)) {
                this._ignoreDamage.set(type, Math.max(this._ignoreDamage.get(type) - 1, 0));
            }
        }
        /**
         * 扣挡伤害次数
         * @param value 需要扣除
         */
        delIgnoreDamageCount(damageType) {
            let subResult = { result: false };
            if (this._abilityBuff.has(exports.AbilityEnum.IgnoreDmage)) {
                let subAbility = { ignoreDamageType: damageType };
                for (const buff of this._abilityBuff.get(exports.AbilityEnum.IgnoreDmage).values()) {
                    subResult = buff.subAbility(subAbility);
                    if (subResult.result) {
                        break;
                    }
                }
            }
            return subResult.result;
        }
        isIgnoreDamage(type) {
            if (this._ignoreDamage.has(type)) {
                return this._ignoreDamage.get(type) > 0;
            }
            return false;
        }
        /**是否锁血 */
        addLockHp() {
            this._lockHp++;
        }
        delLockHp() {
            this._lockHp = Math.max(this._lockHp - 1, 0);
        }
        isLockHp() {
            return this._lockHp > 0;
        }
        /**是否不死 */
        addNoDie() {
            this._noDie++;
        }
        delNoDie() {
            this._noDie = Math.max(this._noDie - 1, 0);
        }
        isNoDie() {
            return this._noDie > 0;
        }
        /**获取最新的移动buff */
        getMoveBuff() {
            if (this._uniqueAbilityBuff[exports.UniqueAbilityTag.Move]) {
                return this._uniqueAbilityBuff[exports.UniqueAbilityTag.Move];
            }
            return null;
        }
        /**获取最新的嘲讽buff */
        getTauntBuff() {
            if (this._uniqueAbilityBuff[exports.UniqueAbilityTag.Taunt]) {
                return this._uniqueAbilityBuff[exports.UniqueAbilityTag.Taunt];
            }
            return null;
        }
        /**记录自己添加buff */
        recordAddBuffCount(id, type, addCount) {
            let preCount = this._addBuffCount1.get(id);
            if (preCount) {
                this._addBuffCount1.set(id, preCount + addCount);
            }
            else {
                this._addBuffCount1.set(id, addCount);
            }
            preCount = this._addBuffCount2.get(type);
            if (preCount) {
                this._addBuffCount2.set(type, preCount + addCount);
            }
            else {
                this._addBuffCount2.set(type, addCount);
            }
            this._addBuffFlag = true;
        }
        /**获取buff的添加次数 */
        getBuffAddCount(id) {
            let preCount = this._addBuffCount1.get(id);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        /**获取buff的添加次数 */
        getBuffAddCountByType(type) {
            let preCount = this._addBuffCount2.get(type);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        /**记录给别人加buff次数 */
        recordAddBuffCount2Other(id, type, addCount) {
            let preCount = this._addBuffCount2Other1.get(id);
            if (preCount) {
                this._addBuffCount2Other1.set(id, preCount + addCount);
            }
            else {
                this._addBuffCount2Other1.set(id, addCount);
            }
            preCount = this._addBuffCount2Other2.get(type);
            if (preCount) {
                this._addBuffCount2Other2.set(type, preCount + addCount);
            }
            else {
                this._addBuffCount2Other2.set(type, addCount);
            }
            this._addBuffFlag2Other = true;
        }
        /**获取给别人加buff的次数 */
        getBuffAddCount2Other(id) {
            let preCount = this._addBuffCount2Other1.get(id);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        /**获取给别人加buff的次数 */
        getBuffAddCount2OtherByType(type) {
            let preCount = this._addBuffCount2Other2.get(type);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        /**记录自己移除buff */
        recordDelBuffCount(id, type, addCount) {
            let preCount = this._delBuffCount1.get(id);
            if (preCount) {
                this._delBuffCount1.set(id, preCount + addCount);
            }
            else {
                this._delBuffCount1.set(id, addCount);
            }
            preCount = this._delBuffCount2.get(type);
            if (preCount) {
                this._delBuffCount2.set(type, preCount + addCount);
            }
            else {
                this._delBuffCount2.set(type, addCount);
            }
            this._delBuffFlag = true;
        }
        getBuffDelCount(id) {
            let preCount = this._delBuffCount1.get(id);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        getBuffDelCountByType(id) {
            let preCount = this._delBuffCount1.get(id);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        /**记录buff触发次数 */
        recordTriggerBuffCount(id, type, addCount) {
            let preCount = this._triggerCount1.get(id);
            if (preCount) {
                this._triggerCount1.set(id, preCount + addCount);
            }
            else {
                this._triggerCount1.set(id, addCount);
            }
            preCount = this._triggerCount2.get(type);
            if (preCount) {
                this._triggerCount2.set(type, preCount + addCount);
            }
            else {
                this._triggerCount2.set(type, addCount);
            }
            this._triggerCountUpdate = true;
        }
        getBuffTriggerCount(id) {
            let preCount = this._triggerCount1.get(id);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        getBuffTriggerCountByType(id) {
            let preCount = this._triggerCount2.get(id);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        /**使用技能次数变化 */
        skillUseCountUpdate() {
            this._skillUseCountUpdate = true;
        }
        // /**记录技能击杀数量 */
        // recordSkillKillCount(id: number, count: number) {
        //     let preCount: number = this._skillKillCount.get(id);
        //     if (preCount) {
        //         this._skillKillCount.set(id, preCount + count);
        //     } else {
        //         this._skillKillCount.set(id, count);
        //     }
        //     this._skillKillCountTotal += count;
        //     this._skillKillFlag = true;
        // }
        // getSkillKillCount(id?: number): number {
        //     if (!id) {
        //         return this._skillKillCountTotal;
        //     } else {
        //         return NumberUtil.myParseInt(this._skillKillCount.get(id));
        //     }
        // }
        /**闪避次数 */
        recordMissCount() {
            this._missCount++;
            this._missFlag = true;
        }
        getMissCount() {
            return this._missCount;
        }
        // /**获取buff触发次数 */
        // getBuffTriggerCount(id: number): number {
        //     if (this._buffMap.has(id)) {
        //         return this._buffMap.get(id).getTriggerCount();
        //     }
        //     return 0;
        // }
        /**受击次数 */
        recordBeHitCount() {
            this._beHitCount++;
        }
        getBeHitCount() {
            return this._beHitCount;
        }
        /**扣血次数 */
        recordSubhpCount() {
            this._subHpCount++;
        }
        getSubhpCount() {
            return this._subHpCount;
        }
        /**记录伤害命中的单位id */
        recordHitUnit(id) {
            let preCount = this._hitUnitCount[id];
            if (preCount) {
                this._hitUnitCount[id] = preCount + 1;
            }
            else {
                this._hitUnitCount[id] = 1;
            }
        }
        /**获取命中次数 */
        getHitUnitCount(id) {
            return this._hitUnitCount[id] ? this._hitUnitCount[id] : 0;
        }
        /**记录普攻命中的单位id */
        recordNormalHitUnit(id) {
            let preCount = this._normalHitUnitCount[id];
            if (preCount) {
                this._normalHitUnitCount[id] = preCount + 1;
            }
            else {
                this._normalHitUnitCount[id] = 1;
            }
        }
        /**获取普攻命中次数 */
        getNormalHitUnitCount(id) {
            return this._normalHitUnitCount[id] ? this._normalHitUnitCount[id] : 0;
        }
        /**记录扣血 */
        recordSubHp(value) {
            if (value <= 0) {
                return;
            }
            this._hpUpdate = true;
            let percent = this._owner.attrComp.converHpToPercent(value);
            this._hpSubPerTotal = FNumber.value(this._hpSubPerTotal).add(percent).value;
            //记录扣血固定值
            this._hpSubTotal = FNumber.value(this._hpSubTotal).add(value).value;
        }
        getHpSubTotal() {
            return this._hpSubTotal;
        }
        getHpSubPerTotal() {
            return this._hpSubPerTotal;
        }
        /**记录回血 */
        recordAddHp(value) {
            if (value <= 0) {
                return;
            }
            this._hpUpdate = true;
            let percent = this._owner.attrComp.converHpToPercent(value);
            this._hpAddPerTotal = FNumber.value(this._hpAddPerTotal).add(percent).value;
            //记录扣血固定值
            this._hpAddTotal = FNumber.value(this._hpAddTotal).add(value).value;
        }
        getHpAddTotal() {
            return this._hpAddTotal;
        }
        getHpAddPerTotal() {
            return this._hpAddPerTotal;
        }
    }
    BuffComponent.UniqueAbility = {
        [exports.AbilityEnum.Tuant]: exports.UniqueAbilityTag.Taunt,
        [exports.AbilityEnum.Fear]: exports.UniqueAbilityTag.Move,
        [exports.AbilityEnum.Repel]: exports.UniqueAbilityTag.Move,
        [exports.AbilityEnum.Pull]: exports.UniqueAbilityTag.Move,
        [exports.AbilityEnum.MoveToUnit]: exports.UniqueAbilityTag.Move,
    };

    class BattleUnitStorageInfo {
        constructor(type) {
            this._type = type;
            this._value =
                this._used = 0;
        }
        getType() {
            return this._type;
        }
        addValue(value) {
            this._value += value;
        }
        getValue() {
            return this._value;
        }
        useValue(value, per) {
            if (per && per > 0) {
                value = FNumber.value(this._value).mul(per).add(value).value;
            }
            this._used += value;
            return value;
        }
        noUseValue() {
            return (this._value - this._used);
        }
        clearUse() {
            this._value = FNumber.value(this._value).sub(this._used).value;
            this._used = 0;
        }
        clear() {
            this._value = 0;
            this._used = 0;
        }
    }

    class BattleAttribute {
        constructor() {
            this.reset();
        }
        init(value) {
            if (!value) {
                return;
            }
            this._data = ObjectUtil.deepClone(value);
        }
        updateAtr(type, value, cover) {
            cover ? (this._data[type] = value) : (this._data[type] = FNumber.value(value).add(this.getOriAtrValue(type)).value);
        }
        reset() {
            this._data = {};
        }
        /**获取属性(原属性) */
        getOriAtrValue(type) {
            return this._data[type] || 0;
        }
        /**合并属性 */
        mergeAttr(attr) {
            for (let key in attr._data) {
                let atrType = Number(key);
                let value = attr.getOriAtrValue(atrType);
                this.updateAtr(atrType, value);
            }
        }
        /**获取数据 */
        getData() {
            return this._data;
        }
    }

    class AttrComponent {
        constructor(owner) {
            this._renducePUpdate = false;
            this._renduceP = 0;
            this._renduceMUpdate = false;
            this._renduceM = 0;
            this._owner = owner;
            this._baseAtr = new BattleAttribute();
            this._modifyAtr = new BattleAttribute();
            this._scale = BattleCommon.AttributeMultiplying;
            this._skillSubCd = {};
            this._skillSubCdPer = {};
            this._skillTypeSubCd = {};
            this._skillTypeSubCdPer = {};
            this._buffOverLimit = {};
            this._immunityBuffType = {};
            this._immunityAbilityType = {};
            this._buffExtendTimeById = {};
            this._buffExtendTimeByType = {};
            this._hp = FNumber.creat();
            this._maxHp = 0;
            this._initHp = true;
            this._storageValue = {};
            this._usedStorageDamage = 0;
            this._shieldValueAddPer = BattleCommon.AttributeMultiplying;
            if (this._owner.unitData.initEnergyPer) {
                this._energyValue = FNumber.value(BattleCommon.EnergyValueMax).mul(this._owner.unitData.initEnergyPer).div(BattleCommon.AttributeMultiplying).value;
            }
            else {
                this._energyValue = 0;
            }
        }
        update(dt) {
            // 生命回复
        }
        /**基础属性初始化之后不变化 */
        initBaseAttr(atr) {
            this._baseAtr.init(atr);
            this._renducePUpdate = true;
            this._renduceMUpdate = true;
            this.refreshHp();
        }
        /**刷新基础属性 */
        updateBaseAttr(atr, positive, fullHp) {
            var _a;
            this._baseAtr.init(atr);
            this._renducePUpdate = true;
            this._renduceMUpdate = true;
            if (fullHp) {
                this.resetHp(positive);
            }
            else {
                this.refreshHp();
            }
            // 根据攻速刷新普攻cd
            let normalSkills = this._owner.skillComp.getSkillByType(exports.SkillType.Skill1);
            for (let i = 0, leni = normalSkills.length; i < leni; i++) {
                (_a = normalSkills[i]) === null || _a === void 0 ? void 0 : _a.updateAtrSpeed();
            }
        }
        /**重置血量 */
        resetHp(positive) {
            let curHp = this._hp.value;
            this._maxHp = this.getAtrHp();
            if (positive) {
                curHp = FNumber.value(curHp).rem(this._maxHp);
            }
            this._hp.reset().add(curHp).add(this._maxHp);
            // this._owner.battleMgr.addRecord(BattleRecordDataType.UnitAttr, [this._owner.uid, this._hp.value, this._maxHp]);
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitAttr, { uid: this._owner.uid, unitAttr: { curHp: this._hp.value, maxHp: this._maxHp } });
        }
        /**刷新动态属性 */
        updateModifyAttr(type, value, refresh) {
            var _a;
            this._modifyAtr.updateAtr(type, value);
            switch (type) {
                case exports.AtrType.Hp:
                case exports.AtrType.HpPer:
                case exports.AtrType.HpAdd:
                    // if (refresh) {
                    this.refreshHp();
                    // }
                    break;
                case exports.AtrType.Def:
                    this._renduceMUpdate = true;
                    this._renducePUpdate = true;
                    break;
                case exports.AtrType.AtkSpeed:
                case exports.AtrType.AtkSpeedPer:
                    let normalSkills = this._owner.skillComp.getSkillByType(exports.SkillType.Skill1);
                    for (let i = 0, leni = normalSkills.length; i < leni; i++) {
                        (_a = normalSkills[i]) === null || _a === void 0 ? void 0 : _a.updateAtrSpeed();
                    }
                    break;
            }
        }
        /**刷新伤害加成 */
        updateDamageAddParam(damageAddParam) {
            if (damageAddParam) {
                if (this._damageAddParam) {
                    this._damageAddParam.damageAdd1 = NumberUtil.myParseInt(this._damageAddParam.damageAdd1) + NumberUtil.myParseInt(damageAddParam.damageAdd1);
                    this._damageAddParam.damageAdd2 = NumberUtil.myParseInt(this._damageAddParam.damageAdd2) + NumberUtil.myParseInt(damageAddParam.damageAdd2);
                    this._damageAddParam.damageAdd3 = NumberUtil.myParseInt(this._damageAddParam.damageAdd3) + NumberUtil.myParseInt(damageAddParam.damageAdd3);
                    this._damageAddParam.damageReduce1 = NumberUtil.myParseInt(this._damageAddParam.damageReduce1) + NumberUtil.myParseInt(damageAddParam.damageReduce1);
                    this._damageAddParam.damageReduce2 = NumberUtil.myParseInt(this._damageAddParam.damageReduce2) + NumberUtil.myParseInt(damageAddParam.damageReduce2);
                    this._damageAddParam.damageReduce3 = NumberUtil.myParseInt(this._damageAddParam.damageReduce3) + NumberUtil.myParseInt(damageAddParam.damageReduce3);
                }
                else {
                    this._damageAddParam = damageAddParam;
                }
            }
        }
        getDamageAddParam() {
            return this._damageAddParam;
        }
        /**刷新技能cd */
        updateSkillSubCd(skillId, cd, per) {
            var _a;
            let preValue = this._skillSubCd[skillId];
            if (preValue) {
                this._skillSubCd[skillId] = preValue + cd;
            }
            else {
                this._skillSubCd[skillId] = cd;
            }
            preValue = this._skillSubCdPer[skillId];
            if (preValue) {
                this._skillSubCdPer[skillId] = preValue + per;
            }
            else {
                this._skillSubCdPer[skillId] = per;
            }
            (_a = this._owner.skillComp.getSkillByGroup(skillId)) === null || _a === void 0 ? void 0 : _a.updateCD();
        }
        /**刷新技能cd(类型) */
        updateSkillTypeSubCd(skillType, cd, per) {
            if (cd) {
                this._skillTypeSubCd[skillType] = NumberUtil.myParseInt(this._skillTypeSubCd[skillType]) + cd;
            }
            if (per) {
                this._skillTypeSubCdPer[skillType] = NumberUtil.myParseInt(this._skillTypeSubCdPer[skillType]) + per;
            }
            let skills = this._owner.skillComp.getSkillByType(skillType);
            for (let skillTmp of skills) {
                skillTmp.updateCD();
            }
        }
        /**获取技能减cd */
        getSkillSubCd(skillGroup, skillType) {
            let sub = 0;
            let subPer = 0;
            if (this._skillSubCd[skillGroup]) {
                sub = NumberUtil.myParseInt(this._skillSubCd[skillGroup]);
            }
            if (this._skillSubCdPer[skillGroup]) {
                subPer = NumberUtil.myParseInt(this._skillSubCdPer[skillGroup]);
            }
            if (this._skillTypeSubCd[skillType]) {
                sub += NumberUtil.myParseInt(this._skillTypeSubCd[skillType]);
            }
            if (this._skillTypeSubCdPer[skillType]) {
                subPer += NumberUtil.myParseInt(this._skillTypeSubCdPer[skillType]);
            }
            return { sub, subPer };
        }
        /**修改buff层数上限 */
        updateBuffOverlimit(buffType, value) {
            let preValue = this._buffOverLimit[buffType];
            if (preValue) {
                this._buffOverLimit[buffType] = preValue + value;
            }
            else {
                this._buffOverLimit[buffType] = value;
            }
        }
        /**获取buff层数上限 */
        getBuffOverlimit(buffType) {
            if (this._buffOverLimit[buffType]) {
                return this._buffOverLimit[buffType];
            }
            return 0;
        }
        /**修改buff时间 */
        updateBuffExtendTime(buffKey, time, isType = false) {
            if (isType) {
                this._buffExtendTimeByType[buffKey] = NumberUtil.myParseInt(this._buffExtendTimeByType[buffKey]) + time;
                this._owner.buffComp.refreshRemoveTime(null, buffKey);
            }
            else {
                this._buffExtendTimeById[buffKey] = NumberUtil.myParseInt(this._buffExtendTimeById[buffKey]) + time;
                this._owner.buffComp.refreshRemoveTime(buffKey, null);
            }
        }
        /**获取buff的修改时间 */
        getBuffExtendTime(buffId, buffType) {
            let time = 0;
            if (buffId) {
                time += NumberUtil.myParseInt(this._buffExtendTimeById[buffId]);
            }
            if (buffType) {
                time += NumberUtil.myParseInt(this._buffExtendTimeByType[buffType]);
            }
            return time;
        }
        /**修改免疫buff类型 */
        updateBuffTypeImmunity(buffType, value) {
            this._immunityBuffType[buffType] = NumberUtil.myParseInt(this._immunityBuffType[buffType]) + value;
        }
        /**修改免疫ability类型 */
        updateBuffAbilityImmunity(ability, value) {
            this._immunityAbilityType[ability] = NumberUtil.myParseInt(this._immunityAbilityType[ability]) + value;
        }
        /**是否免疫buff */
        checkBuffImmunity(buffType, ability) {
            return NumberUtil.myParseInt(this._immunityBuffType[buffType]) > 0 || NumberUtil.myParseInt(this._immunityAbilityType[ability]) > 0;
        }
        /**修改护盾值加成 */
        updateShieldValueAddPer(value) {
            this._shieldValueAddPer += value;
        }
        getShieldValueAddPer() {
            return Math.floor(this._shieldValueAddPer * 100 / BattleCommon.AttributeMultiplying) / 100;
        }
        // /**获取属性 */
        // getAtrValue(type: AtrType): number {
        //     if (type == AtrType.AtrType_Attack) {
        //         //如果是攻击力 （展示 基础攻击力 * （1*攻击力加成） + 附加攻击力）
        //         let atkBase = this._data[AtrType.AtrType_Attack] || 0;
        //         let atkPer = this._data[AtrType.AtrType_AttackPercent] || 0;
        //         let atkAdd = this._data[AtrType.AtrType_Attack_Add] || 0;
        //         return FNumber.value(atkPer).div(BattleCommon.AttributeMultiplying).add(1).mul(atkBase).add(atkAdd).value;
        //     } else if (type == AtrType.AtrType_Hp) {
        //         //如果是血量（展示 基础血量 * （1*血量加成） + 附加血量）
        //         let hpBase = this._data[AtrType.AtrType_Hp] || 0;
        //         let hpPer = this._data[AtrType.AtrType_HpPercent] || 0;
        //         let hpAdd = this._data[AtrType.AtrType_Hp_Add] || 0;
        //         return FNumber.value(hpPer).div(BattleCommon.AttributeMultiplying).add(1).mul(hpBase).add(hpAdd).value;
        //     } else if (type == AtrType.AtrType_Attack_Add || type == AtrType.AtrType_Hp_Add) {
        //         //如果是攻击力附加 或 血量附加 返回数字
        //         let value = this._data[type] || 0;
        //         return value;
        //     } else {
        //         //剩下全部返回万分比
        //         let value = this._data[type] || 0;
        //         return FNumber.value(value).value;
        //     }
        // }
        /**获取基础属性 */
        getBaseAttrData() {
            return this._baseAtr.getData();
        }
        /**获取攻击力 */
        getAtrAtk() {
            // let atk: number = BattleCommon.calcAtkOrHp(this.getAttr(AtrType.AtrType_Attack), this.getAttr(AtrType.AtrType_AttackPercent), this.getAttr(AtrType.AtrType_Attack_Add));// this.getAttr(AtrType.AtrType_Hp);
            // return atk;
            return this.getAtrValue(exports.AtrType.Atk);
        }
        /**获取生命 */
        getAtrHp() {
            // let hp: number = BattleCommon.calcAtkOrHp(this.getAttr(AtrType.Hp), this.getAttr(AtrType.HpPer), this.getAttr(AtrType.HpAdd));// this.getAttr(AtrType.AtrType_Hp);
            // return hp;
            return this.getAtrValue(exports.AtrType.Hp);
        }
        /**获取属性 */
        getOriAtrValue(type) {
            let base = this._baseAtr.getOriAtrValue(type);
            let modify = this._modifyAtr.getOriAtrValue(type);
            return FNumber.value(base).add(modify).value;
        }
        /**获取属性值 */
        getAtrValue(type, exAtr) {
            if (AttrComponent.AtrExpress[type]) {
                let atrs = AttrComponent.AtrExpress[type];
                let atrValues = [];
                if (exAtr) {
                    let valueTmp = 0;
                    for (let i = 0, leni = atrs.length; i < leni; i++) {
                        valueTmp = this.getOriAtrValue(atrs[i]);
                        valueTmp = FNumber.value(valueTmp).add(ObjectUtil.getKVnumberValue(exAtr, atrs[i])).value;
                        atrValues.push(valueTmp);
                    }
                }
                else {
                    for (let i = 0, leni = atrs.length; i < leni; i++) {
                        atrValues.push(this.getOriAtrValue(atrs[i]));
                    }
                }
                switch (atrs.length) {
                    case 3:
                        return FNumber.value(atrValues[1]).div(BattleCommon.AttributeMultiplying).add(1).mul(atrValues[0]).add(atrValues[2]).value;
                    case 2:
                        return FNumber.value(atrValues[1]).div(BattleCommon.AttributeMultiplying).add(1).mul(atrValues[0]).value;
                    default:
                        return atrValues[0];
                }
            }
            else {
                return this.getOriAtrValue(type);
            }
        }
        /**刷新血量 */
        refreshHp() {
            let newMaxHp = this.getAtrHp();
            if (newMaxHp <= 0) {
                return;
            }
            let oldPre = 1;
            if (this._initHp) {
                oldPre = FNumber.value(this._owner.unitData.initHpPer).div(BattleCommon.AttributeMultiplying).value;
            }
            else {
                oldPre = FNumber.value(this._hp.value).div(this._maxHp).value;
            }
            this._maxHp = newMaxHp;
            this._hp.reset(this._maxHp).mul(oldPre);
            // 血量 最大血量 护盾
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitAttr, { uid: this._owner.uid, unitAttr: { curHp: this._hp.value, maxHp: this._maxHp } });
        }
        /**刷新护盾 */
        updateShield() {
            // 血量 最大血量 护盾
            let shield = this._owner.buffComp.getShield();
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitAttr, { uid: this._owner.uid, unitAttr: { shield: shield } });
        }
        /**刷新体型大小 */
        updateScale(value) {
            this._scale = FNumber.value(this._scale).add(value).value;
            // this._owner.battleMgr.addRecordUnitAttr({ uid: this._owner.uid, scale: this._scale });
        }
        /**储存值 */
        storageValue(type, value) {
            let storageInfo = this._storageValue[type];
            if (!storageInfo) {
                storageInfo = new BattleUnitStorageInfo(type);
                this._storageValue[type] = storageInfo;
            }
            storageInfo.addValue(value);
        }
        getStorageValue(type) {
            let storageInfo = this._storageValue[type];
            if (storageInfo) {
                return storageInfo.getValue();
            }
            return 0;
        }
        useStorageValue(type, value, per) {
            value = NumberUtil.myParseInt(value);
            per = FNumber.value(NumberUtil.myParseInt(per)).div(BattleCommon.AttributeMultiplying).value;
            if (!value && !per) {
                return 0;
            }
            let storageInfo = this._storageValue[type];
            if (storageInfo) {
                return storageInfo.useValue(value, per);
            }
            return 0;
        }
        hasNoUseStorageValue(type) {
            let storageInfo = this._storageValue[type];
            if (storageInfo) {
                return storageInfo.noUseValue() > 0;
            }
            return false;
        }
        clearUsedStorageValue(type) {
            let storageInfo = this._storageValue[type];
            if (storageInfo) {
                storageInfo.clearUse();
            }
        }
        clearStorageValue(type) {
            let storageInfo = this._storageValue[type];
            if (storageInfo) {
                storageInfo.clear();
            }
        }
        /**扣血 */
        subHp(value, actorId, skillId, buffid, damageInfo) {
            if (value <= 0) {
                return;
            }
            if (this.isDie) {
                return;
            }
            if (!damageInfo) {
                damageInfo = { damageType: exports.DamageType.None };
            }
            // 受伤害阈值
            let beHurtThreshold = this._owner.buffComp.getBeHurtThreshold();
            if (beHurtThreshold > 0) {
                if (value > beHurtThreshold) {
                    value = beHurtThreshold;
                }
            }
            let delHp = value;
            if (!damageInfo.ignoreShield) {
                // 检测护盾值
                delHp = this._owner.buffComp.delShield(delHp);
                this._owner.battleMgr.battleLog(`[${actorId}]攻击[${this._owner.uid}]==技能[${skillId}]==buff[${buffid}],护盾抵挡[${value - delHp}]`, "DAMAGE");
            }
            // 单位id, 施法者id, 技能id, buffid, 变化血量, 是否暴击, 是否有被格挡, 是否反伤
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitBeHit, { uid: this._owner.uid, unitBeHit: { actorId: actorId, skillId: skillId, buffId: buffid, changeHp: 0 - value, isCrit: !!damageInfo.isCrit, isBlock: !!damageInfo.isBlock, isReturn: !!damageInfo.isReturn } });
            let subHpPer = 0;
            if (delHp > 0) {
                let result = {};
                let conditionParam = { skillId: skillId };
                conditionParam.damageType = damageInfo.damageType;
                let abilityParam = { damageValue: delHp };
                abilityParam.buffId = buffid;
                if (!this._owner.buffComp.isLockHp() && delHp >= this._hp.value) {
                    conditionParam.isToDieDamage = true;
                    abilityParam.beHitUid = this._owner.uid;
                    result = BattleCommon.MergeBuffAbilityReturn(result, this._owner.buffComp.triggerBuff(exports.TriggerEnum.WillDie, null, abilityParam, null));
                }
                result = BattleCommon.MergeBuffAbilityReturn(result, this._owner.buffComp.triggerBuff(exports.TriggerEnum.BeHurt, conditionParam, abilityParam, result));
                if (result.sharedPer > 0) {
                    let damagePer = FNumber.value(BattleCommon.AttributeMultiplying).sub(result.sharedPer).value;
                    delHp = FNumber.value(delHp).mul(damagePer).div(BattleCommon.AttributeMultiplying).value;
                }
                if (delHp <= 0) {
                    return;
                }
                this._owner.battleMgr.battleLog(`[${actorId}]攻击[${this._owner.uid}]==技能[${skillId}]==buff[${buffid}],实际扣血[${delHp}]`, "DAMAGE");
                let actorUnit = this._owner.battleMgr.getUnit(actorId);
                if (actorUnit) {
                    let parentId = actorUnit.getParentData() ? actorUnit.getParentData().clientId : "";
                    //记录伤害，伤害dot，承受伤害
                    if (!!damageInfo.isDot) {
                        this._owner.battleMgr.getResult().updateReport(actorUnit.unitData.clientId, exports.BattleReportType.DamageDot, delHp, parentId);
                    }
                    else {
                        this._owner.battleMgr.getResult().updateReport(actorUnit.unitData.clientId, exports.BattleReportType.Damage, delHp, parentId);
                    }
                    parentId = this._owner.getParentData() ? this._owner.getParentData().clientId : "";
                    this._owner.battleMgr.getResult().updateReport(this._owner.unitData.clientId, exports.BattleReportType.DamageBear, delHp, parentId, this._owner.battleMgr.getRunningTime());
                }
                if (delHp > 0) {
                    this._hp.sub(delHp);
                    if (this._owner.buffComp.isLockHp() || result.lockHp) {
                        this._hp.reset(1);
                    }
                    this._owner.buffComp.recordSubHp(delHp);
                    //记录扣血次数
                    this._owner.buffComp.recordSubhpCount();
                    // 血量 最大血量 护盾
                    this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitAttr, { uid: this._owner.uid, unitAttr: { curHp: Math.max(0, this._hp.value), maxHp: this._maxHp } });
                    if (this._hp.value <= 0) {
                        this._hp.reset(0);
                        this._owner.onDie();
                    }
                }
                subHpPer = this._owner.attrComp.converHpToPercent(delHp, false);
            }
            if (damageInfo.damageType < exports.DamageType.Dot) {
                let addEnergy = this._owner.battleMgr.execExpress(BattleCommon.EnergyAddHitExpress, { subHpPer: subHpPer });
                this._owner.attrComp.addEnergy(addEnergy, 0, exports.UnitEnergyUpdateType.BeHit);
            }
        }
        /**时间到了触发死亡 */
        toDie() {
            this._hp.reset(0);
        }
        /**回血 */
        addHp(value, actorId, skillId, buffid, addHpParam) {
            if (!(addHpParam === null || addHpParam === void 0 ? void 0 : addHpParam.isRealCure) && this._owner.buffComp.isNoCure()) {
                return;
            }
            if (value > 0) {
                let actorUnit = this._owner.battleMgr.getUnit(actorId);
                if (actorUnit) {
                    let parentId = actorUnit.getParentData() ? actorUnit.getParentData().clientId : "";
                    this._owner.battleMgr.getResult().updateReport(actorUnit.unitData.clientId, exports.BattleReportType.Cure, value, parentId);
                }
                this._owner.buffComp.recordAddHp(value);
                this._hp.add(value);
                if (this._hp.value > this._maxHp) {
                    if (addHpParam) {
                        if (addHpParam.addBuffId) {
                            let overflowCure = FNumber.value(this._hp.value).sub(this._maxHp).value;
                            // 溢出回血转护盾
                            this._owner.buffComp.recordBuff(actorId, addHpParam.addBuffId, skillId, 1, this._owner.uid, { overflowCure });
                        }
                    }
                    this._hp.reset(this._maxHp);
                }
                this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitBeHit, { uid: this._owner.uid, unitBeHit: { actorId: actorId, skillId: skillId, buffId: buffid, changeHp: value } });
                // 血量 最大血量 护盾
                this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitAttr, { uid: this._owner.uid, unitAttr: { curHp: this._hp.value, maxHp: this._maxHp } });
                // let param: BattleConditionParam = { hpAdd: value };
                // this._owner.buffComp.triggerBuff(TriggerEnum.HpChange1, param, { beHit: this._owner }, null);
            }
        }
        /**当前最大血量 */
        getMaxHp() {
            return this._maxHp;
        }
        /**当前血量 */
        get hp() {
            return this._hp.value;
        }
        /**当前血量比例 */
        getHpPer() {
            return this.converHpToPercent(this._hp.value);
        }
        /**血量算成万分比 */
        converHpToPercent(value, multiplying = true) {
            if (!multiplying) {
                return FNumber.value(value).div(this.getMaxHp()).value;
            }
            return FNumber.value(value).div(this.getMaxHp()).mul(BattleCommon.AttributeMultiplying).value;
        }
        /**血量清0 */
        clearHp() {
            this._hp.reset(0);
        }
        /**是否死亡 */
        get isDie() {
            return this.hp <= 0;
        }
        /**回能增幅 */
        updateEnergyModify(value, per) {
            if (value) {
                this._energyModifyValue = FNumber.value(this._energyModifyValue).add(value).value;
            }
            if (per) {
                this._energyModifyPer = FNumber.value(this._energyModifyPer).add(per).value;
            }
        }
        /**增加能量值 */
        addEnergy(value, per, energyType) {
            if (this.fullEnergy()) {
                return;
            }
            if (this._energyModifyValue != 0) {
                value = FNumber.value(value).add(this._energyModifyValue).value;
            }
            if (per > 0) {
                value = FNumber.value(BattleCommon.EnergyValueMax).mul(per).div(BattleCommon.AttributeMultiplying).add(value).value;
            }
            if (this._energyModifyPer != 0) {
                value = FNumber.value(value).mul(this._energyModifyPer).div(BattleCommon.AttributeMultiplying).value;
            }
            if (value > 0) {
                this._energyValue = FNumber.value(this._energyValue).add(value).value;
                this._energyValue = Math.min(this._energyValue, BattleCommon.EnergyValueMax);
            }
            // this._energyValue = Math.min(this._energyValue, BattleCommon.EnergyValueMax);
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitAttr, { uid: this._owner.uid, unitAttr: { energy: this._energyValue, energyType: energyType } });
        }
        clearEnergy() {
            this._energyValue = 0;
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitAttr, { uid: this._owner.uid, unitAttr: { energy: this._energyValue, energyType: exports.UnitEnergyUpdateType.UseUltimate } });
        }
        fullEnergy() {
            return this._energyValue >= BattleCommon.EnergyValueMax;
        }
        /**物理免伤率 */
        getReduceP() {
            if (this._renducePUpdate) {
                this._renduceP = this._owner.battleMgr.execExpress(BattleCommon.ReduceExpress, { unit1: this._owner });
                this._renducePUpdate = false;
            }
            return this._renduceP;
        }
        /**魔法免伤率 */
        getReduceM() {
            if (this._renduceMUpdate) {
                this._renduceM = this._owner.battleMgr.execExpress(BattleCommon.MReduceExpress, { unit1: this._owner });
                this._renduceMUpdate = false;
            }
            return this._renduceM;
        }
        /**流派加成 */
        getSectAdd(sect, exAtr) {
            let add = [
                0,
                this.getAtrValue(exports.AtrType.SectDamageAdd1, exAtr),
                this.getAtrValue(exports.AtrType.SectDamageAdd2, exAtr),
                this.getAtrValue(exports.AtrType.SectDamageAdd3, exAtr),
                this.getAtrValue(exports.AtrType.SectDamageAdd4, exAtr),
            ][sect];
            if (!add) {
                add = 0;
            }
            return add;
        }
        /**流派减免 */
        getSectReduce(sect, exAtr) {
            let def = [
                0,
                this.getAtrValue(exports.AtrType.SectDamageDef1, exAtr),
                this.getAtrValue(exports.AtrType.SectDamageDef2, exAtr),
                this.getAtrValue(exports.AtrType.SectDamageDef3, exAtr),
                this.getAtrValue(exports.AtrType.SectDamageDef4, exAtr),
            ][sect];
            if (!def) {
                def = 0;
            }
            return def;
        }
        /**获取移动速度 */
        get moveSpeed() {
            let speed = this.getAtrValue(exports.AtrType.MoveSpeed);
            speed = Math.max(speed, 100);
            return speed;
        }
    }
    AttrComponent.AtrExpress = {
        [exports.AtrType.Atk]: [exports.AtrType.Atk, exports.AtrType.AtkPer, exports.AtrType.AtkAdd],
        [exports.AtrType.Hp]: [exports.AtrType.Hp, exports.AtrType.HpPer, exports.AtrType.HpAdd],
        [exports.AtrType.MoveSpeed]: [exports.AtrType.MoveSpeed, exports.AtrType.MoveSpeedPer],
        [exports.AtrType.AtkSpeed]: [exports.AtrType.AtkSpeed, exports.AtrType.AtkSpeedPer],
    };

    class PosComponent {
        constructor(owner) {
            this._owner = owner;
            this._pos = bv3();
            this._map = this._owner.battleMgr.getMap();
        }
        /**设置坐标 */
        setPos(x, y) {
            // let posTmp: LikeVec3 = this._map.fixToValidPos({ x: x, y: y });
            // if (posTmp) {
            //     this._pos.x = posTmp.x;
            //     this._pos.y = posTmp.y;
            // } else {
            //     console.log(`坐标${x}_${y}无效，不进行设置`);
            // }
            this._pos.x = x;
            this._pos.y = y;
        }
        /**移动坐标 */
        movePos(x, y) {
            x = FNumber.value(this._pos.x).add(x).value;
            y = FNumber.value(this._pos.y).add(y).value;
            this.setPos(x, y);
        }
        /**初始化坐标（通过像素坐标） */
        initPos(x, y) {
            let tile = this._map.convertToTile({ x: x, y: y });
            if (tile) {
                this.updateTile(tile);
            }
            else {
                let pos = { x: x, y: y };
                pos = this._map.fixToValidPos(pos);
                this.setPos(pos.x, pos.y);
            }
        }
        /**初始化坐标（通过格子） */
        initTile(x, y) {
            let z = -x - y;
            let tile = { x: x, y: y, z: z };
            tile = this._map.fixToValidTile(tile);
            if (tile) {
                this.updateTile(tile);
            }
            else {
                let pos = { x: x, y: y };
                pos = this._map.fixToValidPos(pos);
                this.setPos(pos.x, pos.y);
            }
        }
        updateTile(tile) {
            this.setTile(tile.x, tile.y, tile.z);
            // 将格子坐标转换为实际坐标
            let tilePos = this._map.getCellPos(tile);
            this.setPos(tilePos.x, tilePos.y);
        }
        setTile(x, y, z) {
            var _a, _b, _c, _d;
            let preTile;
            if (!this._tile) {
                this._tile = bv3(x, y, z);
            }
            else if (!this._tile.Equal(x, y, z)) {
                preTile = this._tile.Clone();
                this._tile.x = x;
                this._tile.y = y;
                this._tile.z = z;
            }
            else {
                return;
            }
            if (!this._owner.isSpecial()) {
                if (preTile) {
                    (_b = (_a = this._map).notOccupyCell) === null || _b === void 0 ? void 0 : _b.call(_a, preTile);
                }
                (_d = (_c = this._map).occupyCell) === null || _d === void 0 ? void 0 : _d.call(_c, this._tile);
            }
        }
        get pos() {
            return this._pos;
        }
        get tile() {
            return this._tile;
        }
        updateMoveTarget(moveType, pos, dis = 0, checkOccupy, adjustSelf) {
            // 是否需要更新路径
            let needUpdate = true;
            if (this._moveTargetPos) {
                needUpdate = this._owner.battleMgr.getMap().checkMoveTargetUpdate(this._moveTargetPos, this._moveTargetDis, pos, dis);
            }
            this._moveType = moveType;
            // 更新移动路径
            if (needUpdate) {
                this._moveTargetPos = pos.Clone();
                this._moveTargetDis = dis;
                this._movePath = this._owner.battleMgr.getMap().getMovePath(this._pos, this._tile, this._moveTargetPos, this._moveTargetDis, checkOccupy, adjustSelf);
                if (this._movePath && this._movePath.length > 0) {
                    let tile = this._map.convertToTile(this._movePath[this._movePath.length - 1]);
                    if (tile) {
                        this.setTile(tile.x, tile.y, tile.z);
                    }
                }
            }
        }
        /**移动 */
        move(moveDis, updateDir) {
            if (!this.needMove()) {
                this.moveEnd();
                return false;
            }
            let endPos = this._movePath[0];
            let moveVec = endPos.Sub(this._pos);
            let disTmp = moveVec.Mag();
            if (disTmp < 5) {
                // 寻找下一个节点
                this.setPos(endPos.x, endPos.y);
                this._movePath.shift();
                if (!this.needMove()) {
                    this.moveEnd();
                    return false;
                }
            }
            else {
                if (this._owner.behavior.getNotMove()) {
                    return false;
                }
                moveDis = Math.min(disTmp, moveDis);
                moveVec = moveVec.Normalized().Times(moveDis);
                this.movePos(moveVec.x, moveVec.y);
            }
            if (updateDir) {
                if (endPos.x - this._pos.x > 0.1) {
                    this._owner.behavior.updateDir(exports.UnitDir.Right);
                }
                else if (endPos.x - this._pos.x < -0.1) {
                    this._owner.behavior.updateDir(exports.UnitDir.Left);
                }
            }
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitMove, { uid: this._owner.uid, unitMove: { posx: this._pos.x, posy: this._pos.y, moveType: this._moveType } });
            return true;
        }
        moveEnd() {
            this._moveTargetPos = null;
            this._moveTargetDis = null;
            this._movePath = null;
            let tile = this._map.convertToTile(this._pos);
            if (tile) {
                this.setTile(tile.x, tile.y, tile.z);
            }
        }
        needMove() {
            return this._movePath && this._movePath.length > 0;
        }
        clear() {
            var _a, _b;
            if (!this._owner.isSpecial()) {
                (_b = (_a = this._map).notOccupyCell) === null || _b === void 0 ? void 0 : _b.call(_a, this._tile);
            }
        }
        /**移动 */
        moveByControl(moveVec) {
            let curPos = this._pos.Add(moveVec);
            this.setPos(curPos.x, curPos.y);
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitMove, { uid: this._owner.uid, unitMove: { posx: curPos.x, posy: curPos.y, moveType: "" } });
            let tile = this._map.convertToTile({ x: curPos.x, y: curPos.y });
            if (tile) {
                this.setTile(tile.x, tile.y, tile.z);
            }
        }
    }

    /**技能上下文 */
    class SkillContext {
        constructor() {
        }
        updateCastPos(pos, angle) {
            if (pos) {
                if (!this._castTargetPos) {
                    this._castTargetPos = bv3();
                }
                this._castTargetPos.setTo(pos);
            }
            this._angle = NumberUtil.myParseInt(angle);
        }
        getCastTargetUid() {
            return this._castTargetUid;
        }
        getCastTargetPos() {
            return this._castTargetPos;
        }
        getAngle() {
            return this._angle;
        }
        updateFirstFind(skillTarget) {
            this._firstFindTarget = skillTarget;
            if (this._firstFindTarget) {
                if (this._firstFindTarget.units) {
                    this._castTargetUid = this._firstFindTarget.units[0];
                }
                this.updateCastPos(this._firstFindTarget.pos);
            }
        }
        getFirstFind() {
            return this._firstFindTarget;
        }
        updateSkillAbility(ability) {
            this._skillAbility = ability;
        }
        getSkillAbility(clone) {
            if (clone) {
                return ObjectUtil.deepClone(this._skillAbility);
            }
            return this._skillAbility;
        }
        clear() {
            this._firstFindTarget = null;
            this._skillAbility = null;
        }
    }

    /**技能属性 */
    class BattleSkill {
        constructor(owner, skillId) {
            this._owner = owner;
            this._skillId = skillId;
            this._config = battle.config.getSkill(this.skillId);
            this._cdFt = FNumber.creat();
            this._isFirstCD = true;
            this._cdTag = true;
            this._isCd = false;
            /**防止牛逼策划不配冷却 */
            let minCD = Math.max(BattleCommon.MinSkillCD, this._config.pauseTime);
            this._cfgFirstCD = Math.max(this._config.firstCd, minCD);
            this._cfgCD = Math.max(this._config.cd, minCD);
            this._cd = this._cfgFirstCD;
            this._skillRate = 1;
            this._maxSkillRate = FNumber.value(this.config.before).add(this.config.after).div(BattleCommon.MinNormalSkillTime).value;
            this._duration = 0;
            this._duration += (this._config.before + this._config.after);
            if (this._config.cast) {
                let intervalTmp = this._config.cast.split("#");
                this._duration += NumberUtil.myParseInt(intervalTmp[intervalTmp.length - 1]);
            }
            this._hitCount = {};
            this._hitCountTotal = {};
            this._useCount = 0;
            this._killCount = 0;
            this._killCountTotal = 0;
        }
        /** 设置原始技能id */
        setOriSkillId(id) {
            this._oriSkillId = id;
        }
        update(dt) {
            if (this._cfgCD > 0) {
                this.subCd(dt);
            }
            if (this._failTime > 0) {
                this._failTime = FNumber.value(this._failTime).sub(dt).value;
            }
        }
        resetCd() {
            if (this._oriSkillId) {
                let skill = this._owner.skillComp.getSkill(this._oriSkillId);
                skill.resetCd();
                return;
            }
            if (this._cfgCD > 0) {
                this._isCd = false;
                this._cdTag = true;
                // 获取技能cd减免
                this._cdFt.reset();
                // this._cd = this._cfgCD;
                if (this._isFirstCD) {
                    this.updateCD();
                }
            }
        }
        /**防止牛逼策划不配冷却 */
        getSkillFirstCD() {
            return this._cfgFirstCD;
        }
        getSkillCD() {
            return this._cfgCD;
        }
        /**普攻攻速改变 */
        updateAtrSpeed() {
            if (this._config.type == exports.SkillType.Skill1) {
                this.updateNormalCD();
            }
        }
        /**普攻cd */
        updateNormalCD() {
            let timeTmp = 0;
            let atkSpeed = this._owner.attrComp.getAtrValue(exports.AtrType.AtkSpeed);
            atkSpeed = Math.max(atkSpeed, BattleCommon.AttributeMultiplying);
            let atkRate = FNumber.value(atkSpeed).div(BattleCommon.AttributeMultiplying).value;
            // 最小流程时间是前摇+后摇
            let skillTime = FNumber.value(this.config.before).add(this.config.after).value;
            let curSkillTime = Math.ceil(FNumber.value(skillTime).div(atkRate).value);
            if (curSkillTime >= BattleCommon.MinNormalSkillTime) {
                this._skillRate = atkRate;
            }
            else {
                curSkillTime = BattleCommon.MinNormalSkillTime;
                this._skillRate = this._maxSkillRate;
            }
            timeTmp = Math.ceil(FNumber.value(BattleCommon.NormalSkillCD).div(atkRate).value);
            timeTmp = Math.max(timeTmp, BattleCommon.MinSkillCD);
            this._cd = timeTmp;
            this._isCd = this._cdFt.value >= this._cd;
        }
        /**获取技能速度 */
        getSkillRate() {
            return this._skillRate;
        }
        /**改变技能的冷却时间 */
        updateCD() {
            this._isFirstCD = false;
            // 如果是普攻，通过攻速获取cd
            if (this._config.type == exports.SkillType.Skill1) {
                this.updateNormalCD();
            }
            else {
                let timeTmp = 0;
                let subInfo = this._owner.attrComp.getSkillSubCd(this._config.skillGroup, this._config.type);
                if (subInfo.sub || subInfo.subPer) {
                    timeTmp = FNumber.value(this._cfgCD).mul(subInfo.subPer).div(BattleCommon.AttributeMultiplying).add(subInfo.sub).value;
                }
                timeTmp = Math.min(timeTmp, Math.floor(this._cfgCD * 0.9));
                this._cd = FNumber.value(this._cfgCD).sub(timeTmp).value;
                this._isCd = this._cdFt.value >= this._cd;
            }
        }
        /**通过buff减cd */
        subCdByBuff(time, per, force) {
            let leftCdTime = this.getLeftCdTime();
            if (!force && leftCdTime <= BattleCommon.MinSkillCD) {
                return;
            }
            if (!time && !per) {
                return;
            }
            if (per) {
                time = FNumber.value(this._cfgCD).mul(per).div(BattleCommon.AttributeMultiplying).add(time).value;
            }
            time = Math.min(time, (leftCdTime - BattleCommon.MinSkillCD)); // 最多减到100ms
            this.subCd(time);
        }
        /**减少冷却时间 */
        subCd(time) {
            if (!this._cdTag) {
                return;
            }
            if (!time) {
                return;
            }
            this._cdFt.add(time);
            if (this._cdFt.value >= this._cd) {
                this._cdTag = false;
                this._isCd = true;
            }
        }
        /**清除cd，立即冷却 */
        clearCd() {
            this._cdFt.reset().add(this._cd);
        }
        /**是否cd好了 */
        isCoolDown() {
            return this._isCd;
        }
        /**获取剩余冷却时间 */
        get cdFt() {
            return this._cdFt;
        }
        /**获取cd时长 */
        get cd() {
            return this._cd;
        }
        /**是否可以释放 */
        get canUse() {
            if (this._failTime > 0) {
                return false;
            }
            if (this._config.autoUse == 1) {
                return this.isCoolDown();
            }
            else {
                return false;
            }
        }
        /**还差多久冷却好 */
        getLeftCdTime() {
            return this._cd - this._cdFt.value;
        }
        /**技能id */
        get skillId() {
            return this._skillId;
        }
        /**技能配置 */
        get config() {
            return this._config;
        }
        /**技能施法距离 */
        get castRange() {
            return this._config.castRange;
        }
        /**获取技能总时间 */
        getDuration() {
            return this._duration;
        }
        /**获取技能命中次数 */
        getHitCount(unitId) {
            if (unitId) {
                return NumberUtil.myParseInt(this._hitCount[unitId]);
            }
            else {
                let count = 0;
                for (const key in this._hitCount) {
                    count += this._hitCount[key];
                }
                return count;
            }
        }
        getHitCountTotal(unitId) {
            if (unitId) {
                return NumberUtil.myParseInt(this._hitCountTotal[unitId]);
            }
            else {
                let count = 0;
                for (const key in this._hitCountTotal) {
                    count += this._hitCountTotal[key];
                }
                return count;
            }
        }
        getHitUids() {
            let uids = [];
            for (const key in this._hitCount) {
                uids.push(key);
            }
            return uids;
        }
        /**获取技能击杀次数 */
        getKillCount() {
            return this._killCount;
        }
        getKillCountTotal() {
            return this._killCountTotal;
        }
        /**获取技能使用次数 */
        getUseCount() {
            return this._useCount;
        }
        /**记录失败时间 */
        recordFailTime() {
            this._failTime = 2000;
        }
        /**获取上下文信息 */
        getContext() {
            if (this._oriSkillId) {
                let skill = this._owner.skillComp.getSkill(this._oriSkillId);
                return skill.getContext();
            }
            if (!this._context) {
                this._context = new SkillContext();
            }
            return this._context;
        }
        /**技能流程 */
        onBefore() {
            this._useCount++;
            //技能数量变化
            this._owner.battleMgr.getTeam(this._owner.teamId);
            this._owner.buffComp.skillUseCountUpdate();
        }
        onBeforeOver() {
            if (this._config.type == exports.SkillType.Skill2) {
                this._owner.attrComp.clearEnergy();
            }
            else {
                this._owner.attrComp.addEnergy(this._config.energy, 0, exports.UnitEnergyUpdateType.UseSkill);
            }
        }
        onCast() {
        }
        onAfter() {
        }
        onFinish() {
            this._hitCount = {};
            this._killCount = 0;
            if (this._oriSkillId) {
                let skill = this._owner.skillComp.getSkill(this._oriSkillId);
                skill.onFinish();
            }
            this._oriSkillId = null;
            this._context && this._context.clear();
            this._context = null;
        }
        /**技能击中，不一定命中 */
        onSkillHit() {
        }
        /**技能命中，无miss */
        onRealHit(unitId) {
            this._hitCount[unitId] = NumberUtil.myParseInt(this._hitCount[unitId]) + 1;
            this._hitCountTotal[unitId] = NumberUtil.myParseInt(this._hitCountTotal[unitId]) + 1;
        }
        /**技能击杀 */
        onKill(unitType) {
            this._killCount += 1;
            this._killCountTotal += 1;
            this._owner.attrComp.addEnergy(FNumber.value(BattleCommon.EnergyAddKill).mul(1).value, 0, exports.UnitEnergyUpdateType.Kill);
            this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitKill, { uid: this._owner.uid, unitKill: { unitType: unitType } });
        }
    }

    class SkillTimeLine {
        constructor(owner) {
            this._timelineNode = null;
            this._curSkillId = 0;
            this._owner = owner;
            this._curSkillProcess = exports.SkillProcessEnum.Empty;
        }
        /**使用技能，所有技能施法入口 */
        startSkillCast(actor, skillId, skillRate) {
            if (this._curSkillId && skillId == this._curSkillId) {
                //正在使用中
                return false;
            }
            this._timelineNode = null;
            this._curNodeIndex = 0;
            this._goNodeIndex = 0;
            let timeLine = battle.skillMgr.GetSkillTimeNode(battle.config.getSkill(skillId));
            if (!timeLine) {
                return false;
            }
            this._timelineNode = timeLine;
            this._curSkillProcess = exports.SkillProcessEnum.Empty;
            this._curSkillId = skillId;
            this._skillRate = skillRate;
            this.update(0);
            return true;
        }
        update(dt) {
            if (this._timelineNode === null) {
                return;
            }
            this.updateTimeNode(dt);
        }
        updateTimeNode(dt) {
            if (this._curNodeIndex < this._goNodeIndex) {
                let goNode = this._timelineNode[this._goNodeIndex];
                if (goNode) {
                    for (var i = 0; i < this._timelineNode.length; i++) {
                        if (i < this._goNodeIndex) {
                            this._timelineNode[i].setExced(true);
                        }
                    }
                    dt = goNode.runTime;
                }
                this._goNodeIndex = 0;
            }
            else {
                dt *= this._skillRate;
            }
            var endFlag = true;
            let lenTmp = this._timelineNode.length;
            // 遍历所有的timeNode,来检查时间，一次执行
            for (var i = 0; i < lenTmp; i++) {
                if (!this._timelineNode) {
                    return;
                }
                if (this._timelineNode[i].getExced()) {
                    continue;
                }
                endFlag = false;
                this._timelineNode[i].update(dt);
                if (this._timelineNode[i].runTime <= 0) {
                    this.doTimeNode(i);
                }
            }
            // end
            if (endFlag) {
                this.onSkillEnd();
            }
        }
        doTimeNode(index) {
            this._curNodeIndex = index;
            this._timelineNode[index].setExced(true);
            if (this._timelineNode[index].timePoint.execFunc) {
                this._timelineNode[index].timePoint.execFunc({ unit: this._owner, skillId: this._curSkillId, skillRate: this._skillRate, cfgParam: this._timelineNode[index].timePoint.exParam });
            }
            if (this._timelineNode && this._timelineNode[index]) {
                this._curSkillProcess = this._timelineNode[index].timePoint.execProcess;
            }
            else {
                this._curSkillProcess = exports.SkillProcessEnum.Empty;
            }
        }
        /**提前结束，跳到after节点 */
        finishSkill() {
            if (!this._timelineNode) {
                return;
            }
            this._goNodeIndex = this._timelineNode.length - 2;
        }
        /**打断技能，跳到finish节点 */
        interruptSkill() {
            if (!this._timelineNode) {
                return;
            }
            this.doTimeNode(this._timelineNode.length - 1);
            this.onSkillEnd();
        }
        /**技能释放结束 */
        onSkillEnd(doComplete = true) {
            this._timelineNode = null;
            this._curNodeIndex = 0;
            this._goNodeIndex = 0;
            this._curSkillId = 0;
            this._curSkillProcess = exports.SkillProcessEnum.Empty;
        }
        /**获取当前的技能流程状态 */
        getSkillProcess() {
            return this._curSkillProcess;
        }
        /**当前正在释放的技能 */
        getCastSkillId() {
            return this._curSkillId;
        }
    }

    class SkillComponent {
        constructor(owner) {
            /**设置上次获取到技能的时间 */
            this._lastSelectSkillTime = 0;
            /**上次技能初次找人的时间 */
            this._lastSkillFindTime = 0;
            this._banSkills = [];
            this._owner = owner;
            this._skillIdMap = new Map();
            this._skillGroupIdMap = new Map();
            this._autoSkills = [];
            this._mainTimeline = new SkillTimeLine(this._owner);
            this._beidongTimeline = new Map();
            // this._skillFindTarget = {};
            // this.abilityReturn = {};
            this._skillCritCount = {};
        }
        /**刷新技能cd */
        update(dt) {
            for (const skillId of this._skillIdMap.keys()) {
                this._skillIdMap.get(skillId).update(dt);
            }
            if (this._owner.getAutoReleaseSkill() && this._owner.battleMgr.skillUseMode != exports.SkillUseMode.None) {
                // 自动释放被动（无人物动作）
                for (let i = 0, leni = this._autoSkills.length; i < leni; i++) {
                    let skillId = this._autoSkills[i];
                    let skill = this._skillIdMap.get(skillId);
                    if (!skill)
                        continue;
                    if (skill.config.hasAction == 1) {
                        continue;
                    }
                    if (this._banSkills.indexOf(skill.config.skillGroup) >= 0) {
                        continue;
                    }
                    if (!skill.canUse) {
                        continue;
                    }
                    if (!this._owner.behavior.checkCanUseSkill(skill.config.type, 1)) {
                        continue;
                    }
                    this.useNoActionSkill(skill);
                }
            }
            // 无人物动作的技能
            for (const skillId of this._beidongTimeline.keys()) {
                let timeline = this._beidongTimeline.get(skillId);
                let status = timeline.getSkillProcess();
                if (status == exports.SkillProcessEnum.Empty) {
                    this._beidongTimeline.delete(skillId);
                }
                else {
                    timeline.update(dt);
                }
            }
        }
        /**刷新技能流程 */
        updateTimeline(dt) {
            this._mainTimeline.update(dt);
        }
        getSkillProcess() {
            return this._mainTimeline.getSkillProcess();
        }
        /**添加技能 */
        addSkill(skillId) {
            let skillConfig = battle.config.getSkill(skillId);
            if (!skillConfig)
                return;
            if (this._skillIdMap.has(skillId))
                return;
            if (this._skillGroupIdMap.has(skillConfig.skillGroup))
                return;
            let skill = new BattleSkill(this._owner, skillId);
            this._skillIdMap.set(skillId, skill);
            this._skillGroupIdMap.set(skillConfig.skillGroup, skill);
            if (skillConfig.autoUse) {
                if (skillConfig.type == exports.SkillType.Skill2) {
                    this._energySkill = skillId;
                }
                else {
                    this._autoSkills.push(skillId);
                }
            }
            //添加技能时，把所带的buff添加到单位
            let buffs = StringUtil.splitStringToMultiArray(skill.config.buff, ["#"]);
            if (buffs) {
                for (let i = 0, leni = buffs.length; i < leni; i++) {
                    this._owner.buffComp.addBuff(this._owner.uid, NumberUtil.myParseInt(buffs[i]), skillId);
                }
            }
            return skill;
        }
        /**主动设置技能id */
        updateHandleSkill(skillId, target, force) {
            let skill = this._skillIdMap.get(skillId);
            if (!skill)
                return;
            if (this._banSkills.indexOf(skill.config.skillGroup) >= 0) {
                return;
            }
            if (skill.config.hasAction != 1) {
                this.useNoActionSkill(skill, target, force);
                return;
            }
            this._handleSkill = skill;
        }
        /**无表现技能（瞬发） */
        useNoActionSkill(skill, target, force) {
            var _a;
            if (this._beidongTimeline.get(skill.skillId)) {
                // 正在释放
                return;
            }
            // 还没cd
            if (!force && !skill.isCoolDown()) {
                return;
            }
            let timelineTmp = new SkillTimeLine(this._owner);
            this._beidongTimeline.set(skill.skillId, timelineTmp);
            let skillIdTmp = skill.skillId;
            let result = {};
            result = this._owner.buffComp.triggerBuff(exports.TriggerEnum.SkillStart, { skillId: skill.skillId }, null, null);
            if (result && result.realSkillId) {
                skillIdTmp = (_a = this.getSkillByGroup(result.realSkillId)) === null || _a === void 0 ? void 0 : _a.skillId;
                this._owner.skillComp.getSkill(skillIdTmp).setOriSkillId(skill.skillId);
            }
            skill.getContext().updateSkillAbility(result);
            //获取技能移动目标
            let targetTmp;
            if (target) {
                targetTmp = new SkillTarget();
                targetTmp.units.push(target.uid);
            }
            else {
                if (skill.config.find1) {
                    let find = battle.config.getFindTarget(skill.config.find1);
                    targetTmp = BattleSelector.GetSkillTarget(this._owner, { find, oriPos: this._owner.pos });
                }
            }
            if (!targetTmp) {
                return;
            }
            skill.getContext().updateFirstFind(targetTmp);
            if (timelineTmp.startSkillCast(this._owner, skillIdTmp, 1)) {
                return true;
            }
            else {
                return false;
            }
        }
        /**获取主动设置的技能 */
        get handleSkill() {
            return this._handleSkill;
        }
        /**自动选择的技能 */
        updateSelectSkill(skill) {
            if (!skill) {
                this._selectSkill = null;
                return;
            }
            this._selectSkill = skill;
            return this._selectSkill;
        }
        /**清除选中技能 */
        clearSelectSkill() {
            this._handleSkill = null;
            this._selectSkill = null;
        }
        /**获取自动选择的技能 */
        get selectSkill() {
            return this._selectSkill;
        }
        checkCanUse(skill) {
            if (!skill)
                return false;
            if (skill.config.hasAction != 1) {
                return false;
            }
            if (this._banSkills.indexOf(skill.config.skillGroup) >= 0) {
                return false;
            }
            if (!skill.canUse) {
                return false;
            }
            if (!skill.config.find1) {
                return false;
            }
            if (!this._owner.behavior.checkCanUseSkill(skill.config.type, 1)) {
                return false;
            }
            return true;
        }
        /**获取下一个可释放的技能 */
        getNextSkill() {
            if (!this._owner.getAutoReleaseSkill() && this._owner.battleMgr.skillUseMode == exports.SkillUseMode.None) {
                return;
            }
            // 能量技
            if (this._owner.battleMgr.skillUseMode == exports.SkillUseMode.AutoAll && this._energySkill && this._owner.attrComp.fullEnergy()) {
                let skill = this._skillIdMap.get(this._energySkill);
                if (this.checkCanUse(skill)) {
                    return skill;
                }
            }
            // let skill: BattleSkill;
            let coolDownSkills = [];
            //获取最早冷却好的技能，保证技能释放顺序
            for (let i = 0, leni = this._autoSkills.length; i < leni; i++) {
                let skillId = this._autoSkills[i];
                let skill = this._skillIdMap.get(skillId);
                if (!skill)
                    continue;
                if (this.checkCanUse(skill)) {
                    coolDownSkills.push(skill);
                }
            }
            coolDownSkills.sort((a, b) => {
                let disSort = a.config.sort - b.config.sort;
                if (disSort == 0) {
                    disSort = a.getLeftCdTime() - b.getLeftCdTime();
                }
                return Math.sign(disSort);
            });
            // // 获取第一个可以释放的技能
            // for (let i: number = 0, leni: number = coolDownSkills.length; i < leni; i++) {
            //     skill = coolDownSkills[i];
            //     break;
            // }
            return coolDownSkills[0];
        }
        /**当前技能是否可以被打断 */
        checkCanBeInterrupted() {
            return false;
        }
        /**进入技能释放流程 */
        startSkillCast() {
            var _a;
            let skill;
            if (this._handleSkill) {
                skill = this._handleSkill;
            }
            else {
                skill = this._selectSkill;
            }
            this.clearSelectSkill();
            if (!skill) {
                return false;
            }
            let skillIdTmp = skill.skillId;
            let result = skill.getContext().getSkillAbility();
            result = BattleCommon.MergeBuffAbilityReturn(result, this._owner.buffComp.triggerBuff(exports.TriggerEnum.SkillStart, { skillId: skill.skillId }, null, null));
            if (result && result.realSkillId) {
                skillIdTmp = (_a = this.getSkillByGroup(result.realSkillId)) === null || _a === void 0 ? void 0 : _a.skillId;
                let realSkill = this.getSkill(skillIdTmp);
                realSkill.setOriSkillId(skill.skillId);
            }
            // this.abilityReturn[skillIdTmp] = result;
            skill.getContext().updateSkillAbility(result);
            if (this._mainTimeline.startSkillCast(this._owner, skillIdTmp, skill.getSkillRate())) {
                // let firstFindPos: BVec3; //第一次找人的目标位置
                // let firstFind: SkillTarget = realSkill.getContext().getFirstFind();
                // let angle: number = 0;
                // if (firstFind) {
                //     if (firstFind.units && firstFind.units[0]) {
                //         firstFindPos = this._owner.battleMgr.getUnitPos(firstFind.units[0]);
                //     } else {
                //         firstFindPos = firstFind.pos;
                //     }
                // }
                // if (firstFind && firstFind.units && firstFind.units[0]) {
                //     angle = BMath.getAngleBetweenPos(this._owner.pos, firstFindPos);
                // }
                // this._owner.battleMgr.addRecord(BattleRecordDataType.UseSkill, [this._owner.uid, skillIdTmp, angle]);
                this._castSkill = skill;
                return true;
            }
            else {
                return false;
            }
        }
        /**获取当前正在释放的技能 */
        get castSkill() {
            return this._castSkill;
        }
        /**获取所有技能key */
        getSkillIds() {
            return Array.from(this._skillIdMap.keys());
        }
        /**获取技能 */
        getSkill(skillId) {
            return this._skillIdMap.get(skillId);
        }
        /**获取技能(通过组获取) */
        getSkillByGroup(skillGroup) {
            return this._skillGroupIdMap.get(skillGroup);
        }
        /**获取技能(通过类型获取) */
        getSkillByType(skillType) {
            let skills = [];
            for (let skillId of this._skillIdMap.keys()) {
                let skill = this._skillIdMap.get(skillId);
                if (skill.config.type == skillType) {
                    skills.push(skill);
                }
            }
            return skills;
        }
        /**获取技能(通过技能效果类型获取) */
        getSkillByEffect(skillEffect) {
            let skills = [];
            // for (let skillId of this._skillIdMap.keys()) {
            //     let skill: BattleSkill = this._skillIdMap.get(skillId);
            //     if (skill.config.skill_effect == skillEffect) {
            //         skills.push(skill);
            //     }
            // }
            return skills;
        }
        /**打断技能 */
        interruptSkill() {
            if (this._castSkill && this._castSkill.config.notInterrupt) {
                return;
            }
            this._handleSkill = null;
            this._selectSkill = null;
            this._mainTimeline.interruptSkill();
        }
        /**提前结束 */
        finishSkill() {
            this._handleSkill = null;
            this._selectSkill = null;
            this._mainTimeline.finishSkill();
        }
        /**本次技能暴击次数 */
        recordSkillCritCount(skillId) {
            this._skillCritCount[skillId] = NumberUtil.myParseInt(this._skillCritCount[skillId]) + 1;
        }
        clearSkillCritCount(skillId) {
            delete this._skillCritCount[skillId];
        }
        getSkillCritCount(skillId) {
            return NumberUtil.myParseInt(this._skillCritCount[skillId]);
        }
        /**技能单次释放命中次数 */
        getSkillHitCount(skillGroupId, unitId) {
            if (skillGroupId) {
                let skillTmp = this.getSkillByGroup(skillGroupId);
                if (skillTmp) {
                    return skillTmp.getHitCount(unitId);
                }
            }
            return 0;
        }
        /**获取总命中次数 */
        getSkillHitCountTotal(skillGroupId, unitId) {
            if (skillGroupId) {
                let skillTmp = this.getSkillByGroup(skillGroupId);
                if (skillTmp) {
                    return skillTmp.getHitCountTotal(unitId);
                }
            }
            else {
                let count = 0;
                for (let skillId of this._skillIdMap.keys()) {
                    let skill = this._skillIdMap.get(skillId);
                    count += skill.getHitCountTotal(unitId);
                }
                return count;
            }
            return 0;
        }
        /**技能单次释放命中单位id */
        getSkillHitUids(skillGroupId) {
            if (skillGroupId) {
                let skillTmp = this.getSkillByGroup(skillGroupId);
                if (skillTmp) {
                    return skillTmp.getHitUids();
                }
            }
            return null;
        }
        /**技能释放次数 */
        getSkillUseCount(skillGroupId) {
            if (skillGroupId) {
                let skillTmp = this.getSkillByGroup(skillGroupId);
                if (skillTmp) {
                    return skillTmp.getUseCount();
                }
            }
            return 0;
        }
        /**技能释放次数 */
        getSkillUseCountByType(skillType) {
            let count = 0;
            if (skillType) {
                let skills = this._owner.skillComp.getSkillByType(skillType);
                for (let skillTmp of skills) {
                    count += skillTmp.getUseCount();
                }
            }
            return count;
        }
        /**技能释放次数(根据技能效果) */
        getSkillUseCountByEffect(skillEffect) {
            let count = 0;
            if (skillEffect) {
                let skills = this._owner.skillComp.getSkillByEffect(skillEffect);
                for (let skillTmp of skills) {
                    count += skillTmp.getUseCount();
                }
            }
            return count;
        }
        /**技能击杀次数 */
        getSkillKillCount(skillGroupId, isTotal) {
            let count = 0;
            if (skillGroupId) {
                let skillTmp = this.getSkillByGroup(skillGroupId);
                if (skillTmp) {
                    if (isTotal) {
                        count = skillTmp.getKillCountTotal();
                    }
                    else {
                        count = skillTmp.getKillCount();
                    }
                }
            }
            else {
                for (let skillId of this._skillIdMap.keys()) {
                    let skill = this._skillIdMap.get(skillId);
                    count += skill.getKillCountTotal();
                }
            }
            return count;
        }
        /**设置普攻目标 */
        updateNormalTarget(targetId) {
            if (this._normalTarget && targetId != this._normalTarget) {
                // 触发切换普攻目标
                this._owner.buffComp.triggerBuff(exports.TriggerEnum.ChangeNormalTarget, null, null, null);
            }
            this._normalTarget = targetId;
        }
        /**设置禁用技能 */
        banSkill(skillGroup) {
            this._banSkills.push(skillGroup);
        }
        allowSkill(skillGroup) {
            this._banSkills = this._banSkills.filter((value, index) => {
                return skillGroup != value;
            });
        }
        /** 获取技能id列表 */
        getSkillIdList() {
            let skillIdList = [];
            for (let skillId of this._skillIdMap.keys()) {
                skillIdList.push(skillId);
            }
            return skillIdList;
        }
        /**设置上次获取到技能的时间 */
        setLastSelectSkillTime(time) {
            this._lastSelectSkillTime = time;
        }
        getLastSelectSkillTime() {
            return this._lastSelectSkillTime;
        }
        /**上次技能初次找人的时间 */
        setLastSkillFindTime(time) {
            this._lastSkillFindTime = time;
        }
        getLastSkillFindTime() {
            return this._lastSkillFindTime;
        }
    }

    // { name: "技能目标", value: "SkillTarget" },
    // { name: "锁头", value: "LockUnit" },
    // { name: "Buff", value: "Buff" },
    // { name: "手动", value: "Handle" }
    var UnitMoveType;
    (function (UnitMoveType) {
        UnitMoveType["None"] = "";
        UnitMoveType["Buff"] = "Buff";
        UnitMoveType["SkillTarget"] = "SkillTarget";
        UnitMoveType["Handle"] = "Handle";
    })(UnitMoveType || (UnitMoveType = {}));

    /**
     * 单位行为
     */
    class DefaultBehaviorCtl {
        constructor(unit) {
            this._checkCD = 300;
            this._checkTime = 0;
            this._unit = unit;
        }
        initBehavior(param) {
        }
        update(dt) {
            if (this.moveBuff(dt)) {
                return;
            }
            if (this.skillTimeline(dt)) {
                return;
            }
            if (this.tryStartSkill(dt)) {
                return;
            }
            if (this.moveHandle(dt)) {
                return;
            }
            if (this.moveSkill(dt)) {
                return;
            }
            if (this.checkSkill(dt)) {
                return;
            }
            this.idle();
        }
        /**检测技能目标 */
        checkSkillTarget() {
            let moveTarget = this._unit.behavior.getMoveTarget(UnitMoveType.SkillTarget);
            if (moveTarget) {
                return true;
            }
            return false;
        }
        /**buff移动 */
        moveBuff(dt) {
            var _a, _b, _c, _d;
            let moveBuff = this._unit.buffComp.getMoveBuff();
            if (moveBuff) {
                let moveTargetPos = (_a = moveBuff.getAbility()) === null || _a === void 0 ? void 0 : _a.moveTargetPos;
                if (moveTargetPos) {
                    let speed = (_b = moveBuff.getAbility()) === null || _b === void 0 ? void 0 : _b.moveSpeed;
                    if (!speed) {
                        speed = this._unit.attrComp.moveSpeed;
                    }
                    let moveDis = FNumber.value(speed).mul(dt).div(1000).value;
                    this._unit.posComp.updateMoveTarget(UnitMoveType.Buff, moveTargetPos);
                    this._unit.posComp.move(moveDis);
                    return true;
                }
                else {
                    let moveUnit = this._unit.battleMgr.getUnit((_c = moveBuff.getAbility()) === null || _c === void 0 ? void 0 : _c.moveUnit);
                    if (moveUnit) {
                        let speed = (_d = moveBuff.getAbility()) === null || _d === void 0 ? void 0 : _d.moveSpeed;
                        if (!speed) {
                            speed = this._unit.attrComp.moveSpeed;
                        }
                        let moveDis = FNumber.value(speed).mul(dt).div(1000).value;
                        let moveToPos = moveUnit.pos;
                        this._unit.posComp.updateMoveTarget(UnitMoveType.Buff, moveToPos, 100);
                        if (this._unit.posComp.move(moveDis, true)) ;
                        else {
                            this._unit.buffComp.removeBuff(moveBuff.getConfig().id, exports.BuffRemoveType.None);
                        }
                        return true;
                    }
                }
            }
            return false;
        }
        /**施法中 */
        skillTimeline(dt) {
            let status = this._unit.skillComp.getSkillProcess();
            if (status != exports.SkillProcessEnum.Empty) {
                this._unit.skillComp.updateTimeline(dt);
                return true;
            }
            return false;
        }
        /**尝试施法 */
        tryStartSkill(dt) {
            let selectSkill = this._unit.skillComp.selectSkill;
            if (!selectSkill) {
                return false;
            }
            let moveTarget = this._unit.behavior.getMoveTarget(UnitMoveType.SkillTarget);
            if (moveTarget && !this._unit.posComp.needMove()) {
                this._unit.posComp.moveEnd();
                let selectSkill = this._unit.skillComp.selectSkill;
                if (!selectSkill) {
                    //施法失败
                    return false;
                }
                if (!selectSkill.config.notInterrupt && this._unit.behavior.getInterruptSkill()) {
                    this._unit.skillComp.interruptSkill();
                    return false;
                }
                //开始施法
                if (this._unit.skillComp.startSkillCast()) {
                    this._unit.behavior.clearMoveTarget(UnitMoveType.SkillTarget);
                    return true;
                }
            }
            return false;
        }
        /**手动移动 */
        moveHandle(dt) {
            // 这里需要先判断一下是否有移动目标
            let moveTarget = this._unit.behavior.getMoveTarget(UnitMoveType.Handle);
            if (!moveTarget) {
                return false;
            }
            let speed = this._unit.attrComp.moveSpeed;
            let moveDis = FNumber.value(speed).mul(dt).div(1000).value;
            if (this._unit.posComp.move(moveDis, true)) ;
            else {
                this._unit.behavior.clearMoveTarget(UnitMoveType.Handle);
            }
            return true;
        }
        /**检测移动 */
        moveSkill(dt) {
            let moveTarget = this._unit.behavior.getMoveTarget(UnitMoveType.SkillTarget);
            if (moveTarget) {
                let moveToPos = null;
                if (moveTarget.targetId) {
                    let targetUnit = this._unit.battleMgr.getUnit(moveTarget.targetId);
                    if (!targetUnit) {
                        this._unit.skillComp.clearSelectSkill();
                        this._unit.behavior.clearMoveTarget(UnitMoveType.SkillTarget);
                        return false;
                    }
                    moveToPos = targetUnit.pos;
                    this._unit.posComp.updateMoveTarget(UnitMoveType.SkillTarget, moveToPos, moveTarget.moveRange);
                }
                let speed = this._unit.attrComp.moveSpeed;
                let moveDis = FNumber.value(speed).mul(dt).div(1000).value;
                this._unit.posComp.move(moveDis, true);
            }
            return false;
        }
        /**检测技能 */
        checkSkill(dt) {
            if (this._checkTime > 0) {
                this._checkTime -= dt;
                return;
            }
            this._checkTime = this._checkCD;
            if (this._unit.behavior.getNotAttack() || this._unit.behavior.getNotActionSkill()) {
                return false;
            }
            let selectSkill = this._unit.skillComp.selectSkill;
            if (selectSkill) {
                // 已选好技能还没释放
                // TODO 更高优先级的技能要不要释放，有更近的目标要不要改目标
                return false;
            }
            // 选择下一个可释放的技能
            let skill = this._unit.skillComp.handleSkill;
            if (!skill) {
                skill = this._unit.skillComp.getNextSkill();
            }
            if (!skill) {
                return false;
            }
            this._unit.skillComp.updateSelectSkill(skill);
            this.updateSkillTarget();
            return true;
        }
        /**设置技能目标 */
        updateSkillTarget() {
            let curSelectSkill = this._unit.skillComp.selectSkill;
            let castDis = curSelectSkill.castRange;
            if (castDis <= 0) {
                castDis = 1000;
            }
            if (this._unit.getMinCastDis() > 0) {
                castDis = Math.max(castDis, this._unit.getMinCastDis());
            }
            // 技能初始找人
            if (!curSelectSkill.config.find1) {
                this._unit.skillComp.clearSelectSkill();
                curSelectSkill.getContext().updateFirstFind(null);
                return "failure";
            }
            //获取技能移动目标
            let findRtn;
            if (curSelectSkill.config.find1) {
                let result = this._unit.buffComp.triggerBuff(exports.TriggerEnum.SkillFind1Before, { skillId: curSelectSkill.skillId }, null, null);
                let findId = result.skillFind1 ? result.skillFind1 : curSelectSkill.config.find1;
                curSelectSkill.getContext().updateSkillAbility(result);
                let tauntBuff = this._unit.buffComp.getTauntBuff();
                if (tauntBuff) {
                    let tauntUnit = this._unit.battleMgr.getUnit(tauntBuff.getAbility().tauntId);
                    if (tauntUnit) {
                        findRtn = new SkillTarget();
                        findRtn.units = [tauntUnit.uid];
                    }
                }
                if (!findRtn) {
                    let find = battle.config.getFindTarget(findId);
                    findRtn = BattleSelector.GetSkillTarget(this._unit, { find: find, oriPos: this._unit.pos }, true);
                    if (!findRtn) {
                        // 技能无目标
                        curSelectSkill.recordFailTime();
                        this._unit.skillComp.clearSelectSkill();
                        return "failure";
                    }
                    // findRtn.units = [findRtn.units[0]];
                }
                curSelectSkill.getContext().updateFirstFind(findRtn);
                if (findRtn) {
                    this._unit.behavior.setMoveTarget(UnitMoveType.SkillTarget, findRtn.units[0], this._unit.battleMgr.getUnitPos(findRtn.units[0]), castDis, curSelectSkill.skillId);
                }
            }
        }
        idle() {
        }
    }

    class DijingBehaviorCtl extends DefaultBehaviorCtl {
        update(dt) {
            if (this.moveHandle(dt)) {
                return;
            }
            this.randomMoveTarget();
        }
        /**手动移动 */
        moveHandle(dt) {
            // 这里需要先判断一下是否有移动目标
            let moveTarget = this._unit.behavior.getMoveTarget(UnitMoveType.Handle);
            if (!moveTarget) {
                return false;
            }
            // todo 被限制移动
            if (this._unit.behavior.getNotMove()) {
                return false;
            }
            let speed = this._unit.attrComp.moveSpeed;
            let moveDis = FNumber.value(speed).mul(dt).div(1000).value;
            if (this._unit.posComp.move(moveDis, true)) ;
            else {
                this._unit.behavior.clearMoveTarget(UnitMoveType.Handle);
            }
            return true;
        }
        randomMoveTarget() {
            // 随机一个位置
            let randomPos = bv3(this._unit.battleMgr.getRandom().randomInt(250, -250), this._unit.battleMgr.getRandom().randomInt(250, -350));
            // 设置目标位置
            this._unit.behavior.setMoveTarget(UnitMoveType.Handle, "", randomPos, 0);
        }
    }

    class SummonBehaviorCtl extends DefaultBehaviorCtl {
        constructor() {
            super(...arguments);
            this._addTime = 0;
        }
        initBehavior(param) {
            this._addTime = param.addTime || 0;
        }
        update(dt) {
            if (this._addTime > 0) {
                this._addTime -= dt;
                return;
            }
            super.update(dt);
        }
    }

    // /**单位行动逻辑 */
    // export class BattleUnitBehavior {
    //     private _owner: BattleUnit;
    //     private _moveTargetUnitId: number;
    class BattleUnitBehavior {
        constructor(owner) {
            this._handleMoveTarget = [];
            this._owner = owner;
            this._moveOffset = bv3(0, 0);
            this._opt = {
                notMove: false,
                notAttack: false,
                notActionSkill: false,
                notBeidongSkill: false,
                notEnemyFind: false,
                notFriendFind: false,
                interruptSkill: false,
                pauseAction: false
            };
            this._dir = exports.UnitDir.None;
            this._moveTargetId = "";
            let initDir = this._owner.getInitDir();
            if (!initDir) {
                initDir = this._owner.teamId == 1 ? exports.UnitDir.Right : exports.UnitDir.Left;
            }
            this.updateDir(initDir, false);
            // if (this._owner.uid != "1_Servant_1") {
            //     return;
            // }
            //初始化行为树
            // if (this._owner.unitData.behaviorTreeName) {
            //     let treeData: TreeData = getTreeConfig(this._owner.unitData.behaviorTreeName);
            //     if (treeData) {
            //         let env: BattleUnitEnv = new BattleUnitEnv(BattleUnitBehavior.context);
            //         env.unit = owner;
            //         this._treeRunner = new TreeRunner(env, new Tree(BattleUnitBehavior.context, treeData));
            //     }
            // }
            // this._bCtl = new DefaultBehaviorCtl(this._owner);
            switch (this._owner.unitData.behaviorTreeName) {
                case 'BattleDijing':
                    this._bCtl = new DijingBehaviorCtl(this._owner);
                    break;
                default:
                    if (this._owner.unitData.type == exports.UnitType.Summon) {
                        let summonCfg = battle.config.getSummon(this._owner.unitData.configId);
                        this._bCtl = new SummonBehaviorCtl(this._owner);
                        this._bCtl.initBehavior({ addTime: summonCfg.addTime }); //TODO: 这里需要修改
                    }
                    else {
                        this._bCtl = new DefaultBehaviorCtl(this._owner);
                    }
                    break;
            }
        }
        update(dt) {
            this._owner.isIdle = false;
            // if (this._treeRunner) {
            //     this._treeRunner.run(dt);
            // }
            this._bCtl && this._bCtl.update(dt);
        }
        interrupt() {
            //     if (this._treeRunner) {
            //         this._treeRunner.interrupt();
            //     }
        }
        /**刷新单位的行为控制（单个改变） */
        updateOpt(id, bol) {
            let optConfig = battle.config.getBehavior(id);
            if (!optConfig) {
                return;
            }
            this._opt.notMove = this._opt.notMove || !!optConfig.notMove;
            this._opt.notAttack = this._opt.notAttack || !!optConfig.notAttack;
            this._opt.notActionSkill = this._opt.notActionSkill || !!optConfig.notSkill;
            this._opt.notBeidongSkill = this._opt.notBeidongSkill || !!optConfig.notBeidong;
            this._opt.notEnemyFind = this._opt.notEnemyFind || !!optConfig.notEnemyFind;
            this._opt.notFriendFind = this._opt.notFriendFind || !!optConfig.notFriendFind;
            this._opt.interruptSkill = this._opt.interruptSkill || !!optConfig.interruptSkill;
            this._opt.pauseAction = this._opt.pauseAction || !!optConfig.pause;
            if (this._opt.interruptSkill) {
                this._owner.skillComp.interruptSkill();
            }
        }
        /**刷新单位的行为控制（重新计算） */
        resetOpt() {
            this._opt = {
                notMove: false,
                notAttack: false,
                notActionSkill: false,
                notBeidongSkill: false,
                notEnemyFind: false,
                notFriendFind: false,
                interruptSkill: false,
                pauseAction: false
            };
        }
        /**获取行为 */
        /**不能移动 */
        getNotMove() {
            return this._opt.notMove;
        }
        /**不能普攻 */
        getNotAttack() {
            return this._opt.notAttack;
        }
        /**不能技能 */
        getNotActionSkill() {
            return this._opt.notActionSkill;
        }
        /**不能被动 */
        getNotBeidongSkill() {
            return this._opt.notBeidongSkill;
        }
        /**检测技能被禁止 */
        checkCanUseSkill(skillType, action) {
            if (skillType == exports.SkillType.Skill1) {
                return !this.getNotAttack();
            }
            else {
                if (action == 1) {
                    return !this.getNotActionSkill();
                }
                else {
                    return !this.getNotBeidongSkill();
                }
            }
        }
        /**不能被选(敌) */
        getNotEnemyFind() {
            return this._opt.notEnemyFind;
        }
        /**不能被选(友) */
        getNotFriendFind() {
            return this._opt.notFriendFind;
        }
        /**不能被选 */
        getNotFind(team) {
            if (team == this._owner.teamId) {
                return this.getNotFriendFind();
            }
            return this.getNotEnemyFind();
        }
        /**打断技能 */
        getInterruptSkill() {
            return this._opt.interruptSkill;
        }
        /**暂停动作 */
        pauseAction() {
            return this._opt.pauseAction;
        }
        /**设置方向 */
        updateDir(value, record = true) {
            if (this._dir == value) {
                return;
            }
            this._dir = value;
            if (record && this._dir > exports.UnitDir.None) {
                this._owner.battleMgr.addRecord(exports.BattleRecordDataType.UnitDir, { uid: this._owner.uid, unitDir: { dir: this._dir } });
            }
        }
        getDir() {
            return this._dir;
        }
        /** 设置移动目标 */
        setMoveTarget(type, targetId, targetPos, moveRange, skillId, buffId) {
            targetPos = this._owner.battleMgr.getMap().fixToValidPos(targetPos);
            let moveTarget = { targetId, targetPos: bv3(targetPos), moveRange, skillId, buffId };
            let findPath = true;
            let checkOccupy = false;
            if (type === UnitMoveType.SkillTarget) {
                this._skillMoveTarget = moveTarget;
                // this._owner.battleMgr.addRecord(BattleRecordDataType.MoveUnitStart, [this._owner.uid]);
                checkOccupy = true;
            }
            else {
                this._handleMoveTarget.push(moveTarget);
                if (this._handleMoveTarget.length == 1) ;
                else {
                    findPath = false;
                }
            }
            if (findPath) {
                let moveToPos = null;
                if (moveTarget.targetId) {
                    let targetUnit = this._owner.battleMgr.getUnit(moveTarget.targetId);
                    moveToPos = targetUnit.pos;
                }
                else {
                    moveToPos = moveTarget.targetPos;
                }
                this._owner.posComp.updateMoveTarget(type, moveToPos, moveTarget.moveRange, checkOccupy, true);
            }
        }
        getMoveTarget(type) {
            if (type === UnitMoveType.SkillTarget) {
                return this._skillMoveTarget;
            }
            else {
                if (this._handleMoveTarget.length > 0) {
                    return this._handleMoveTarget[0];
                }
                return null;
            }
        }
        clearMoveTarget(type, all) {
            if (type === UnitMoveType.SkillTarget) {
                this._skillMoveTarget = null;
                // this._owner.battleMgr.addRecord(BattleRecordDataType.MoveUnitEnd, [this._owner.uid]);
            }
            else {
                let isEnd = false;
                if (all) {
                    this._handleMoveTarget.length = 0;
                    isEnd = true;
                }
                else {
                    if (this._handleMoveTarget.length > 0) {
                        this._handleMoveTarget.shift();
                        isEnd = this._handleMoveTarget.length == 0;
                    }
                    else {
                        isEnd = true;
                    }
                }
                if (isEnd) {
                    this._owner.buffComp.removeBuff(42, exports.BuffRemoveType.None);
                    // this._owner.battleMgr.addRecord(BattleRecordDataType.MoveUnitEnd, [this._owner.uid]);
                }
                else {
                    let moveTarget = this._handleMoveTarget[0];
                    let moveToPos = null;
                    if (moveTarget.targetId) {
                        let targetUnit = this._owner.battleMgr.getUnit(moveTarget.targetId);
                        moveToPos = targetUnit.pos;
                    }
                    else {
                        moveToPos = moveTarget.targetPos;
                    }
                    this._owner.posComp.updateMoveTarget(UnitMoveType.Handle, moveToPos, moveTarget.moveRange);
                }
            }
        }
    }

    /**单位基础数据 */
    class BattleUnitData {
        constructor() {
            this.clientId = "";
            this.type = this.configId = this.station = 0;
            this.sect = 0;
            this.initHpPer = 10000;
            this.survivalTime = 0;
            this.neverDie = false;
            this.linkKeyDef = "";
            this.minCastDis = 0;
            this.initDir = 0;
            this.initEnergyPer = 0;
        }
    }

    /**
     * 基础战斗单位
     */
    class BattleUnit {
        constructor(battleMgr, id, teamId, campId, data) {
            /**存活时间 */
            this._survivalTime = 0;
            this._survivalTimeOver = false;
            /**逃跑 */
            this._escape = false;
            // // 检测死亡
            // private _triggerDie: boolean = false;
            // 是否是自动释放技能
            this._autoReleaseSkill = false;
            this.isIdle = false;
            this._battleMgr = battleMgr;
            this._sortId = id;
            this._uid = data.clientId ? data.clientId : teamId + "_" + BattleCommon.getUnitPrefix(data.type) + "_" + id;
            this._teamId = teamId;
            this._campId = campId;
            this._unitData = new BattleUnitData();
            for (const key in data) {
                this._unitData[key] = data[key];
            }
            if (this._unitData.type == exports.UnitType.Summon) {
                this._autoReleaseSkill = true;
            }
            this._summonId = 0;
            // this._unitData.type = data.type;
            // this._unitData.configId = data.configId;
            // this._unitData.posType = data.posType;
            // this._unitData.sect = data.sect;
            // this._unitData.neverDie = data.neverDie;
            // this._unitData = data;
            this._survivalTime = data.survivalTime;
            if (data.clientId) {
                this._unitData.clientId = data.clientId;
            }
            if (data.initHpPer) {
                this._unitData.initHpPer = data.initHpPer;
            }
            this._isQifen = false;
            this.dieTime = 0;
            this._survivalTimeOver = false;
            this._dieCount = 0;
            this._attrComp = new AttrComponent(this);
            this._posComp = new PosComponent(this);
            this._skillComp = new SkillComponent(this);
            this._buffComp = new BuffComponent(this);
            this._behavior = new BattleUnitBehavior(this);
        }
        initBaseAttr(attr) {
            if (Array.isArray(attr)) {
                this._attrList = attr;
            }
            else {
                this._attrList = [attr];
            }
            this._attrIndex = 0;
            this.attrComp.initBaseAttr(this._attrList[this._attrIndex]);
        }
        get battleMgr() {
            return this._battleMgr;
        }
        get type() {
            return this._unitData.type;
        }
        get configId() {
            return this._unitData.configId;
        }
        get posType() {
            return this._unitData.station;
        }
        get unitData() {
            return this._unitData;
        }
        get uid() {
            return this._uid;
        }
        get sortId() {
            return this._sortId;
        }
        get teamId() {
            return this._teamId;
        }
        get campId() {
            return this._campId;
        }
        set isQifen(v) {
            this._isQifen = v;
        }
        get isQifen() {
            return this._isQifen;
        }
        switchAutoReleaseSkill() {
            this._autoReleaseSkill = !this._autoReleaseSkill;
        }
        updateAutoReleaseSkill(v) {
            this._autoReleaseSkill = v;
        }
        getAutoReleaseSkill() {
            return this._autoReleaseSkill;
        }
        /**最短施法距离 */
        getMinCastDis() {
            return this._unitData.minCastDis;
        }
        /**单位初始朝向 */
        getInitDir() {
            return this._unitData.initDir;
        }
        update(dt) {
            if (this._escape) {
                this.battleMgr.removeUnit(this.uid, exports.UnitRemoveType.Escape);
                return;
            }
            if (this.isDie) {
                // if (this._triggerDie) {
                //     this._triggerDie = false;
                //     this.behavior.interrupt();
                //     this.skillComp.interruptSkill();
                //     // 触发死亡buff
                //     this._buffComp.triggerBuff(TriggerEnum.Die, null, null, null);
                //     if (this.unitData.type == UnitType.Summon) {
                //         let summonConfig: summon = battle.config.getSummon(this.unitData.configId);
                //         if (summonConfig) {
                //             let conditionParam: BattleConditionParam = { summonId: summonConfig.group };
                //             let abilityParam: BuffAbilityParam = { actorUid: this.uid };
                //             this._parentUnit.buffComp.triggerBuff(TriggerEnum.SummonDie, conditionParam, abilityParam, null);
                //         }
                //         this.clearParentUnit();
                //     }
                // } else {
                if (!this.buffComp.isNoDie()) {
                    let removeType = this._survivalTimeOver ? exports.UnitRemoveType.SurvivalTimeOver : exports.UnitRemoveType.Die;
                    this.battleMgr.unitDie(this.uid, removeType);
                    this._posComp.clear();
                    return;
                }
                // }
            }
            if (this.battleMgr.battleStatus != exports.BattleStatus.SkillPause) {
                // 时停不刷新技能cd
                this._skillComp.update(dt);
                this._buffComp.update(dt);
                if (this._survivalTime > 0) {
                    this._survivalTime = FNumber.value(this._survivalTime).sub(dt).value;
                    if (this._survivalTime <= 0) {
                        if (this.unitData.type == exports.UnitType.Summon) {
                            let summonConfig = battle.config.getSummon(this.unitData.configId);
                            if (summonConfig) {
                                let conditionParam = { summonId: summonConfig.group };
                                let abilityParam = { actorUid: this.uid };
                                this._parentUnit.buffComp.triggerBuff(exports.TriggerEnum.SummonSurvivalTimeOver, conditionParam, abilityParam, null);
                            }
                        }
                        // let conditionParam: BattleConditionParam = {  };
                        // if (this.unitData.type == UnitType.Summon) {
                        //     let summonConfig: summon = battle.config.getSummon(this.unitData.configId);
                        //     if (summonConfig) {
                        //         conditionParam.summonId = summonConfig.group;
                        //     }
                        // }
                        // this.buffComp.triggerBuff(TriggerEnum.UnitSurvivalTimeOver, null, null, null);
                        this._survivalTimeOver = true;
                        // this._triggerDie = true;
                        this.attrComp.toDie();
                        this.triggerDie();
                    }
                }
            }
            this._behavior.update(dt);
        }
        updateLater(dt) {
            this._buffComp.addRecordBuff();
        }
        /**设置所属单位 */
        setParentUnit(unit) {
            this._parentUnit = unit;
        }
        clearParentUnit() {
            if (this._parentUnit) {
                this._parentUnit.delSummon(this);
                this._parentUnit = null;
            }
        }
        /**父单位i */
        getParent() {
            if (this._parentUnit) {
                return this._parentUnit;
            }
            return null;
        }
        /**父单位id */
        getParentUid() {
            if (this._parentUnit) {
                return this._parentUnit.uid;
            }
            return null;
        }
        /**获取父单位数据 */
        getParentData() {
            if (this._parentUnit) {
                return this._parentUnit.unitData;
            }
            return null;
        }
        /**添加召唤物 */
        addSummon(unit) {
            if (!this._summons) {
                this._summons = new Map();
            }
            let summonConfig = battle.config.getSummon(unit.unitData.configId);
            if (!summonConfig) {
                return;
            }
            let summonMap = this._summons.get(summonConfig.group);
            if (!summonMap) {
                summonMap = new Map();
                this._summons.set(summonConfig.group, summonMap);
            }
            if (!summonMap.has(unit.uid)) {
                let abilityParam = { beHitUid: unit.uid };
                let conditionParam = { summonId: summonConfig.group };
                this.buffComp.triggerBuff(exports.TriggerEnum.AddSummon, conditionParam, abilityParam, null);
            }
            summonMap.set(unit.uid, unit);
        }
        getSummon(summonGroup) {
            if (!this._summons) {
                return null;
            }
            let summonMap = this._summons.get(summonGroup);
            return summonMap;
        }
        getSummonCount(summonGroup) {
            let summonMap = this.getSummon(summonGroup);
            if (summonMap) {
                return summonMap.size;
            }
            return 0;
        }
        delSummon(unit) {
            if (this._summons) {
                let summonConfig = battle.config.getSummon(unit.unitData.configId);
                if (!summonConfig) {
                    return;
                }
                let summonMap = this._summons.get(summonConfig.group);
                if (summonMap) {
                    summonMap.delete(unit.uid);
                }
            }
        }
        /**真正死亡 */
        isRealDie() {
            return this.isDie && !this.buffComp.isNoDie();
        }
        /**是否死亡 */
        get isDie() {
            if (this._unitData.type != exports.UnitType.Special && this._unitData.type != exports.UnitType.Dragon) {
                return this.attrComp.isDie;
            }
            return false;
        }
        /**被攻击 */
        beAttack(value, actorId, skillId, buffid, damageInfo) {
            if (!this._battleMgr.checkInvincible(this.teamId)) {
                let isLink = false;
                if (this._unitData.linkKeyDef) {
                    let linkMap = this.battleMgr.getLinkMap(this._unitData.linkKeyDef);
                    if (linkMap && linkMap.size > 1) {
                        isLink = true;
                        let linkValue = FNumber.value(value).div(linkMap.size).value;
                        let linkInfo = ObjectUtil.deepClone(damageInfo);
                        linkInfo.isLink = true;
                        for (const unit of linkMap.values()) {
                            unit.attrComp.subHp(linkValue, actorId, skillId, buffid, linkInfo);
                        }
                    }
                }
                if (!isLink) {
                    this.attrComp.subHp(value, actorId, skillId, buffid, damageInfo);
                }
            }
        }
        /**增加存活时间 */
        addSurvivalTime(time) {
            if (this._survivalTime > 0) {
                this._survivalTime = FNumber.value(this._survivalTime).add(time).value;
            }
        }
        /**单位死亡 */
        onDie() {
            this._dieCount++;
            let len = this._attrList.length - 1;
            if (this._attrIndex >= len) {
                //最后一个属性
                if (!this.unitData.neverDie) {
                    // this._buffComp.triggerBuff(TriggerEnum.Die, null, null, null);
                    // this.battleMgr.unitDie(this.uid);
                    // this._triggerDie = true;
                    this.triggerDie();
                }
                else {
                    this.attrComp.updateBaseAttr(this._attrList[len], true, true);
                }
            }
            else {
                this._attrIndex++;
                this.attrComp.updateBaseAttr(this._attrList[this._attrIndex], true, true);
                if (this.isDie) {
                    this.onDie();
                }
            }
        }
        triggerDie() {
            this.behavior.interrupt();
            this.skillComp.interruptSkill();
            // 触发死亡buff
            this._buffComp.triggerBuff(exports.TriggerEnum.Die, null, null, null);
            if (this.unitData.type == exports.UnitType.Summon) {
                let summonConfig = battle.config.getSummon(this.unitData.configId);
                if (summonConfig) {
                    let conditionParam = { summonId: summonConfig.group };
                    let abilityParam = { actorUid: this.uid };
                    this._parentUnit.buffComp.triggerBuff(exports.TriggerEnum.SummonDie, conditionParam, abilityParam, null);
                }
                this.clearParentUnit();
            }
        }
        /**逃跑 */
        escape() {
            this._escape = true;
        }
        /**获取死亡次数 */
        getDieCount() {
            return this._dieCount;
        }
        /**是否不计数单位 */
        isSpecial() {
            return this._unitData.type == exports.UnitType.Special || this._unitData.type == exports.UnitType.Dragon;
        }
        /**获取所用地图 */
        getMap() {
            return this._battleMgr.getMap();
        }
        getUnitInfo(keys, exAtr) {
            let infoValue = 0;
            switch (keys[0]) {
                case exports.ExpressParamEnum.Atr:
                    let atrType = NumberUtil.myParseInt(keys[1]);
                    infoValue = this.attrComp.getAtrValue(atrType, exAtr);
                    break;
                case exports.ExpressParamEnum.Lv:
                    infoValue = 1;
                    break;
                case exports.ExpressParamEnum.DamageReduceP:
                    infoValue = this.attrComp.getReduceP();
                    break;
                case exports.ExpressParamEnum.DamageReduceM:
                    infoValue = this.attrComp.getReduceM();
                    break;
            }
            return infoValue;
        }
        /**属性相关--------------------------------------------------------------- */
        get attrComp() {
            return this._attrComp;
        }
        /**更新基础属性 */
        updateBaseAttr(attr) {
            this.attrComp.updateBaseAttr(attr, true, false);
        }
        /**属性相关--------------------------------------------------------------- */
        /**坐标相关--------------------------------------------------------------- */
        get posComp() {
            return this._posComp;
        }
        get pos() {
            var _a;
            return (_a = this._posComp) === null || _a === void 0 ? void 0 : _a.pos;
        }
        get tile() {
            var _a;
            return (_a = this._posComp) === null || _a === void 0 ? void 0 : _a.tile;
        }
        setPos(x, y) {
            this._posComp.setPos(x, y);
        }
        /**坐标相关--------------------------------------------------------------- */
        /**技能相关--------------------------------------------------------------- */
        get skillComp() {
            return this._skillComp;
        }
        /**添加技能 */
        addSkill(skillId) {
            let skill = this._skillComp.addSkill(skillId);
            if (skill && skill.config.derive) {
                let deriveSkills = skill.config.derive.split("#");
                for (let i = 0, leni = deriveSkills.length; i < leni; i++) {
                    this._skillComp.addSkill(NumberUtil.myParseInt(deriveSkills[i]));
                }
            }
        }
        /**使用技能 */
        handleSkill(skillId) {
            this._skillComp.updateHandleSkill(skillId, null, true);
        }
        /**技能相关--------------------------------------------------------------- */
        /**buff相关--------------------------------------------------------------- */
        get buffComp() {
            return this._buffComp;
        }
        /**添加buff */
        addBuff(buffId, addCount) {
            if (!addCount) {
                addCount = 1;
            }
            if (buffId) {
                this._buffComp.addBuff(this.uid, buffId, -1, addCount);
            }
        }
        /**buff相关--------------------------------------------------------------- */
        /**行为相关--------------------------------------------------------------- */
        get behavior() {
            return this._behavior;
        }
        /**行为相关--------------------------------------------------------------- */
        /**创建召唤物id */
        createSummonId() {
            return ++this._summonId;
        }
        clear() {
            this._attrComp = null;
            this._behavior = null;
            this._buffComp = null;
            this._posComp = null;
            this._skillComp = null;
        }
    }

    class BattleMapFactory {
        static registerMapCls(mapType, cls) {
            this._mapCls[mapType] = cls;
        }
        static creatMap(mapType) {
            if (this._mapCls[mapType]) {
                return new this._mapCls[mapType]();
            }
            else {
                return new this._mapCls[exports.MapType.Default]();
            }
        }
    }
    BattleMapFactory._mapCls = {};

    class BattleRecordData {
    }

    /**战斗记录 */
    class BattleRecord {
        constructor() {
            this._recordId = 0;
            this._record = [];
        }
        /**初始化 */
        initRecord() {
            this._record.length = 0;
            this._recordId = 0;
            this.updateFrame(0);
        }
        /**更新逻辑帧 */
        updateFrame(value) {
            if (value <= 0) {
                value = 0;
            }
            if (this._curFrame == value) {
                return;
            }
            this._curFrame = value;
            // this._record.set(this._curFrame, new BattleRecordFrame(this._recordId + 1));
        }
        addRecord(type, params) {
            let data = new BattleRecordData();
            data.id = this.createRecordId();
            data.frame = this._curFrame;
            data.type = type;
            data.params = params;
            // let recordFrame: BattleRecordFrame = this._record.get(this._curFrame);
            // recordFrame.pushRecord(data);
            this._record.push(data);
            // Logger.orange("战斗日志", `[帧数]${data.frame}[时间]${StringUtil.getDateString()}[日志类型]${data.type}[日志参数]${data.params?.toString()}`);
        }
        /**获取战斗日志 */
        getRecord(startId, count) {
            // if (!startFrame) {
            //     startFrame = 0;
            // }
            // if (!endFrame) {
            //     endFrame = 1;
            // }
            let records;
            if (count > 0) {
                records = this._record.splice(0, count);
            }
            else {
                records = this._record.slice(0, count);
                this._record.length = 0;
            }
            return records;
            // startId = startId - 1;
            // if (!count || (startId + count) > this._record.length) {
            //     count = this._record.length;
            // } else {
            //     count = startId + count;
            // }
            // let records: BattleRecordData[] = this._record.slice(startId, count);
            // // for (let i: number = startFrame; i < endFrame; i++) {
            // //     if (this._record.get(i)) {
            // //         records.push(...this._record.get(i));
            // //     }
            // // }
            // return records;
        }
        // 创建单位唯一id
        createRecordId() {
            return ++this._recordId;
        }
    }

    class BattleResult {
        constructor() {
            this.reset();
        }
        setLog(log) {
        }
        reset() {
            this.winId = 0;
            this.unitHp = {};
            this.unitInfo = {};
            this.report = {};
        }
        /**更新战报 */
        updateReport(id, type, value, parentId, time) {
            if (!this.report[id]) {
                this.report[id] = new BattleReportData(id);
            }
            this.report[id].parentId = parentId;
            switch (type) {
                case exports.BattleReportType.Damage:
                    this.report[id].damage += value;
                    break;
                case exports.BattleReportType.Cure:
                    this.report[id].cure += value;
                    break;
                case exports.BattleReportType.DamageDot:
                    this.report[id].damageDot += value;
                    break;
                case exports.BattleReportType.Control:
                    this.report[id].control += value;
                    break;
                case exports.BattleReportType.DamageBear:
                    this.report[id].damageBear += value;
                    this.updateBeHurtInfo(id, time);
                    break;
            }
        }
        updateDieCount(id, dieCount) {
            if (!this.unitInfo[id]) {
                this.unitInfo[id] = {};
            }
            this.unitInfo[id].dieCount = dieCount;
        }
        updateBeHurtInfo(id, time) {
            if (!time)
                return;
            if (!this.unitInfo[id]) {
                this.unitInfo[id] = {};
            }
            if (!this.unitInfo[id].beHurtInfo) {
                this.unitInfo[id].beHurtInfo = {};
            }
            if (!this.unitInfo[id].beHurtInfo[time]) {
                this.unitInfo[id].beHurtInfo[time] = 1;
            }
            else {
                this.unitInfo[id].beHurtInfo[time]++;
            }
        }
    }
    class BattleReportData {
        constructor(id) {
            this.id = id;
            this.damage = this.cure = this.damageDot = this.damageBear = this.control = 0;
        }
    }

    class BattleTeam {
        ; // 队伍施加给别的队伍buff次数
        ; // 队伍施加给别的队伍buff次数
        constructor(team) {
            this._units = new Map();
            this._unitSortMap = new Map();
            this._unitsType = new Map();
            this._actBuffCount1 = new Map();
            this._actBuffCount2 = new Map();
            this._skillEffectCount = new Map();
            this._skillTypeCount = new Map();
            this._skillGroupCount = new Map();
            this._teamId = team;
            this._actBuffFlag = false;
            this._skillCountFlag = false;
        }
        get teamId() {
            return this._teamId;
        }
        update(dt) {
            if (this._actBuffFlag) {
                this._actBuffFlag = false;
                for (const unit of this._units.values()) {
                    unit.buffComp.triggerBuff(exports.TriggerEnum.TeamActBuffCount, null, null, null);
                }
            }
            // //队伍释放技能次数 
            if (this._skillCountFlag) {
                this._skillCountFlag = false;
                for (const unit of this._units.values()) {
                    unit.buffComp.triggerBuff(exports.TriggerEnum.TeamSkillUseCount, null, null, null);
                }
            }
        }
        // 获取一个单位
        getUnit(id) {
            return this._units.get(id);
        }
        // 获取一个单位
        getUnitSort(sort) {
            return this._unitSortMap.get(sort);
        }
        // 增加一个单位
        addUnit(unit) {
            this._units.set(unit.uid, unit);
            this._unitSortMap.set(unit.sortId, unit);
            let unitType = unit.type;
            let typeMap = this._unitsType.get(unitType);
            if (!typeMap) {
                typeMap = new Map();
                this._unitsType.set(unitType, typeMap);
            }
            typeMap.set(unit.uid, unit);
        }
        // 移除一个单位
        removeUnit(id) {
            let unit = this._units.get(id);
            let unitType = unit.type;
            let typeMap = this._unitsType.get(unitType);
            if (typeMap) {
                typeMap.delete(unit.uid);
            }
            this._unitSortMap.delete(unit.sortId);
            this._units.delete(id);
        }
        /**获取所有单位 */
        getAllUnits() {
            return Array.from(this._units.values());
        }
        /**获取某类单位 */
        getUnitsByType(unitType) {
            let typeMap;
            if (unitType === exports.UnitType.Skull) {
                // 所有骷髅
                let ret = [];
                let skull1 = this._unitsType.get(exports.UnitType.Role_1);
                skull1 && (ret = ret.concat(Array.from(skull1.values())));
                let skull2 = this._unitsType.get(exports.UnitType.Role_2);
                skull2 && (ret = ret.concat(Array.from(skull2.values())));
                let skull3 = this._unitsType.get(exports.UnitType.Role_3);
                skull3 && (ret = ret.concat(Array.from(skull3.values())));
                let skull4 = this._unitsType.get(exports.UnitType.Role_4);
                skull4 && (ret = ret.concat(Array.from(skull4.values())));
                let skull5 = this._unitsType.get(exports.UnitType.Role_5);
                skull5 && (ret = ret.concat(Array.from(skull5.values())));
                return ret;
            }
            else {
                typeMap = this._unitsType.get(unitType);
            }
            if (typeMap) {
                return Array.from(typeMap.values());
            }
            return [];
        }
        /**所有存活单位数量 */
        get unitCount() {
            return this._units.size;
        }
        /**所有存活单位数量（不包含召唤物和特殊单位） */
        get unitCountNoSummon() {
            let count = 0;
            for (const unitType of this._unitsType.keys()) {
                if (unitType != exports.UnitType.Summon && unitType != exports.UnitType.Special && unitType != exports.UnitType.Dragon) {
                    if (this._unitsType.get(unitType)) {
                        count += this._unitsType.get(unitType).size;
                    }
                }
            }
            return count;
        }
        /**获取所有单位 */
        getUnitsMap() {
            return this._units;
        }
        /**增加给别的队伍加buff的次数 */
        recordActBuffCount(id, type, addCount) {
            let preCount = this._actBuffCount1.get(id);
            if (preCount) {
                this._actBuffCount1.set(id, preCount + addCount);
            }
            else {
                this._actBuffCount1.set(id, addCount);
            }
            preCount = this._actBuffCount2.get(type);
            if (preCount) {
                this._actBuffCount2.set(type, preCount + addCount);
            }
            else {
                this._actBuffCount2.set(type, addCount);
            }
            this._actBuffFlag = true;
        }
        /**获取buff的添加次数 */
        getBuffActCount(id) {
            let preCount = this._actBuffCount1.get(id);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        /**获取buff的添加次数 */
        getBuffActCountByType(type) {
            let preCount = this._actBuffCount2.get(type);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        /**队伍释放技能的次数 */
        recordTeamSkillCount(type, effectType, groudId, addCount = 1) {
            //技能类型
            let preCount = this._skillTypeCount.get(type);
            if (preCount) {
                this._skillTypeCount.set(type, preCount + addCount);
            }
            else {
                this._skillTypeCount.set(type, addCount);
            }
            //技能效果类型
            preCount = this._skillEffectCount.get(effectType);
            if (preCount) {
                this._skillEffectCount.set(effectType, preCount + addCount);
            }
            else {
                this._skillEffectCount.set(effectType, addCount);
            }
            //技能组
            preCount = this._skillGroupCount.get(groudId);
            if (preCount) {
                this._skillGroupCount.set(groudId, preCount + addCount);
            }
            else {
                this._skillGroupCount.set(groudId, addCount);
            }
            this._skillCountFlag = true;
        }
        /**获取【技能类型】的释放次数 */
        getSkillTypeCountByType(type) {
            let preCount = this._skillTypeCount.get(type);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        /**获取【技能效果类型】的释放次数 */
        getSkillEffectCountByType(effectType) {
            let preCount = this._skillEffectCount.get(effectType);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
        /**获取【技能组】的释放次数 */
        getSkillGroudCountById(id) {
            let preCount = this._skillGroupCount.get(id);
            if (preCount) {
                return preCount;
            }
            else {
                return 0;
            }
        }
    }

    /**
     * battlemanager
     */
    class BattleManager {
        constructor(mapType = exports.MapType.Pixel) {
            this._unitIdObj = 0;
            this._bulletId = 0;
            // 已添加的clientId
            this._addedUnitUid = {};
            this._teams = new Map();
            this._camps = new Map();
            this._units = new Map();
            this._dieUnits = new Map();
            this._linkMap = new Map();
            this._unitCountByConfigId = new Map();
            this._bullets = new Map();
            this._map = BattleMapFactory.creatMap(mapType);
            this._dieRemoveDelay = new Map();
            this._dieRemoveType = new Map();
            // this._dieRemoveType.set(UnitType.Servant, 1);
            // this._dieRemoveType.set(UnitType.Servant, 1);
            this._record = new BattleRecord();
            this._battleStatus = exports.BattleStatus.None;
            this._outPauseUnits = [];
            this._outPauseBullets = [];
            this._skillPauseTime = 0;
            this._frameTime = FNumber.creat();
            this._result = new BattleResult();
            this._neverEnd = false;
            this._canSkillPause = true;
            this._preUnitData = {};
            this._random = new BRandom();
        }
        init(width, height, battleTime) {
            this._map.init(width, height, this._random);
            this._unitIdObj = [];
            this._bulletId = 0;
            this._battleFrame = 0;
            this._realBattleFrame = 0;
            this._waveBattleFrame = 0;
            this._record.initRecord();
            this._skillUseMode = exports.SkillUseMode.None;
            this._invincibleTeam = {};
            this._fieldWidth = width;
            this._fieldHeight = height;
            this._battleTime = battleTime;
            this._frameTime.reset();
            this._battleStatus = exports.BattleStatus.None;
            this._outPauseUnits.length = 0;
            this._outPauseBullets.length = 0;
            this._skillPauseTime = 0;
            this._result.reset();
            this._teamWave = {};
            this._teamAllDieCount = {};
            this._record.addRecord(exports.BattleRecordDataType.Init);
        }
        getMap() {
            return this._map;
        }
        getRandom() {
            return this._random;
        }
        /**设置死亡单位移除时间 */
        setDieRemoveDelay(type, time) {
            this._dieRemoveDelay.set(type, time);
        }
        getDieRemoveDelay(type) {
            return NumberUtil.myParseInt(this._dieRemoveDelay.get(type));
        }
        /**设置死亡单位移除类型 */
        setDieRemoveType(type, removeType) {
            this._dieRemoveType.set(type, removeType);
        }
        getDieRemoveType(type) {
            return NumberUtil.myParseInt(this._dieRemoveType.get(type));
        }
        /**设置队伍波次 */
        setTeamWave(teamId, wave) {
            this._teamWave[teamId] = wave;
        }
        /**是否在战斗中 */
        isInBattle() {
            if (this._battleStatus == exports.BattleStatus.None || this._battleStatus == exports.BattleStatus.Finish) {
                // 没战斗
                return false;
            }
            return true;
        }
        /**设置为永不结束战斗 */
        setNeverEnd() {
            this._neverEnd = true;
        }
        /**是否打印log */
        setShowLog(value) {
            this._showLog = value;
        }
        /**是否开启技能暂停 */
        setSkillPause(value) {
            this._canSkillPause = value;
        }
        get battleStatus() {
            return this._battleStatus;
        }
        /**技能释放模式 */
        set skillUseMode(value) {
            this._skillUseMode = value;
        }
        get skillUseMode() {
            return this._skillUseMode;
        }
        /**当前战斗进行了多久 */
        getRunningTime() {
            return this._realBattleFrame * BattleCommon.BattleFrameTime;
        }
        /**本波战斗进行了多久 */
        getWaveRunningTime() {
            return this._waveBattleFrame * BattleCommon.BattleFrameTime;
        }
        get fieldWidth() {
            return this._fieldWidth;
        }
        get fieldHeight() {
            return this._fieldHeight;
        }
        /**获取当前战斗帧 */
        get battleFrame() {
            return this._battleFrame;
        }
        /**设置无敌队伍 */
        setInvincibleTeam(teamId) {
            this._invincibleTeam[teamId] = true;
        }
        delInvincibleTeam(teamId) {
            delete this._invincibleTeam[teamId];
        }
        /**队伍是否无敌 */
        checkInvincible(teamId) {
            return !!this._invincibleTeam[teamId];
        }
        /**开始战斗 */
        startBattle(randomSeed) {
            // 添加单位，为了保证顺序，按照唯一id排个序
            let sortedKeys = Object.keys(this._preUnitData).sort();
            for (const key of sortedKeys) {
                const unitData = this._preUnitData[key];
                this.addUnitToBattle(unitData);
            }
            this.getRandom().setRandomSeed(randomSeed);
            this._battleStatus = exports.BattleStatus.Running;
            this._record.addRecord(exports.BattleRecordDataType.Start);
            // 开始战斗时，检测所有单位的技能入场buff
            for (const unit of this._units.values()) {
                unit.buffComp.triggerBuff(exports.TriggerEnum.StartFight, null, null, null);
            }
        }
        /**开始下一波战斗 */
        startNextWave(waveTime) {
            if (this._battleStatus == exports.BattleStatus.PauseWave) {
                this._battleStatus = exports.BattleStatus.Running;
                this._waveBattleFrame = 0;
                if (waveTime && waveTime > 0) {
                    this._battleTime = waveTime;
                }
            }
        }
        /**战斗主循环 */
        update(dt) {
            if (!this.isInBattle()) {
                return;
            }
            if (this._battleStatus == exports.BattleStatus.Pause || this._battleStatus == exports.BattleStatus.PauseWave) {
                // 暂停中
                return;
            }
            this._frameTime.add(dt);
            this.onSkillPause(dt);
            // 计算当前战斗帧index
            this.updateBattleFrame(FNumber.toFixed(FNumber.value(this._frameTime.value).div(BattleCommon.BattleFrameTime).value, 0));
        }
        /**刷新战斗帧数 */
        updateBattleFrame(frame) {
            if (frame === this._battleFrame) {
                return;
            }
            for (let i = this._battleFrame + 1, leni = frame; i <= leni; i++) {
                if (!this.isInBattle()) {
                    return;
                }
                this._battleFrame++;
                for (const bullet of this._bullets.values()) {
                    if (bullet.isDie()) {
                        this.removeBullet(bullet);
                    }
                }
                if (this._battleStatus != exports.BattleStatus.SkillPause) {
                    this._realBattleFrame++;
                    this._waveBattleFrame++;
                    this._record.updateFrame(this._realBattleFrame);
                    if (this._frameCb) {
                        this._frameCb(this._realBattleFrame);
                    }
                    // 死亡列表
                    // let nowTime: number = this.getRunningTime();
                    for (const unit of this._dieUnits.values()) {
                        let removeType = this.getDieRemoveType(unit.unitData.type);
                        if (removeType == exports.DieRemoveType.Hide) ;
                        else {
                            // let delay: number = 0;
                            // if (unit) {
                            //     delay = this.getDieRemoveDelay(unit.unitData.type);
                            // }
                            // if (nowTime - unit.dieTime > delay) {
                            //     // 移除死亡单位
                            //     this._dieUnits.delete(unit.uid);
                            // }
                            unit.clear();
                            this._dieUnits.delete(unit.uid);
                        }
                    }
                    // update
                    for (const team of this._teams.values()) {
                        let unitsTmp = team.getUnitsMap();
                        for (const unit of unitsTmp.values()) {
                            // 每个unit的update都有可能把状态改成技能暂停，所以这里判断一下
                            // @ts-ignore
                            if (this._battleStatus == exports.BattleStatus.SkillPause) {
                                return;
                            }
                            unit.update(BattleCommon.BattleFrameTime);
                        }
                        team.update(BattleCommon.BattleFrameTime);
                    }
                    // @ts-ignore
                    if (this._battleStatus == exports.BattleStatus.SkillPause) {
                        return;
                    }
                    for (const bullet of this._bullets.values()) {
                        bullet.update(BattleCommon.BattleFrameTime);
                    }
                    //updateLater
                    for (const team of this._teams.values()) {
                        let unitsTmp = team.getUnitsMap();
                        for (const unit of unitsTmp.values()) {
                            // 每个unit的update都有可能把状态改成技能暂停，所以这里判断一下
                            // @ts-ignore
                            if (this._battleStatus == exports.BattleStatus.SkillPause) {
                                return;
                            }
                            unit.updateLater(BattleCommon.BattleFrameTime);
                        }
                    }
                    if (this._battleTime > 0 && this.getWaveRunningTime() >= this._battleTime) {
                        //TODO 时间结束要算对方胜利
                        this.battleFinish(0);
                        break;
                    }
                }
                else {
                    for (let i = 0, leni = this._outPauseUnits.length; i < leni; i++) {
                        let unit = this.getUnit(this._outPauseUnits[i]);
                        if (unit) {
                            unit.update(BattleCommon.BattleFrameTime);
                        }
                    }
                    for (let i = 0, leni = this._outPauseBullets.length; i < leni; i++) {
                        if (this._outPauseBullets[i]) {
                            let bulletTmp = this.getBullet(this._outPauseBullets[i]);
                            bulletTmp && bulletTmp.update(BattleCommon.BattleFrameTime);
                        }
                    }
                }
            }
        }
        /**技能暂停 */
        enterSkillPause(time, unitId, skillId) {
            if (this._canSkillPause) {
                this._skillPauseTime = FNumber.value(this._skillPauseTime).add(time).value;
                this._battleStatus = exports.BattleStatus.SkillPause;
                this._outPauseUnits.push(unitId);
                this.addRecord(exports.BattleRecordDataType.PauseBySkill, { uid: unitId, pauseBySkill: { skillId: skillId } });
            }
        }
        /**技能暂停期间只刷新导致暂停的单位 */
        onSkillPause(dt) {
            if (this._battleStatus == exports.BattleStatus.SkillPause) {
                this._skillPauseTime = FNumber.value(this._skillPauseTime).sub(dt).value;
                if (this._skillPauseTime < 0) {
                    this.exitSkillPause();
                }
            }
        }
        /**退出技能暂停 */
        exitSkillPause() {
            if (this._battleStatus == exports.BattleStatus.SkillPause) {
                this._skillPauseTime = 0;
                this._battleStatus = exports.BattleStatus.Running;
                this._outPauseUnits.length = 0;
                this._outPauseBullets.length = 0;
                this._record.addRecord(exports.BattleRecordDataType.ResumeBySkill);
            }
        }
        /**记录数量 */
        addUnitCount(unitData) {
            let curCount = NumberUtil.myParseInt(this._unitCountByConfigId.get(unitData.configId)) + 1;
            this._unitCountByConfigId.set(unitData.configId, curCount);
        }
        delUnitCount(unitData) {
            let curCount = NumberUtil.myParseInt(this._unitCountByConfigId.get(unitData.configId)) - 1;
            curCount = Math.max(curCount, 0);
            this._unitCountByConfigId.set(unitData.configId, curCount);
        }
        getUnitCountByConfigId(configId) {
            return NumberUtil.myParseInt(this._unitCountByConfigId.get(configId));
        }
        /**添加单位 */
        addUnit(initData) {
            if (this._battleStatus == exports.BattleStatus.Finish) {
                return;
            }
            if (this.isInBattle()) {
                let unit = this.addUnitToBattle(initData);
                if (unit) {
                    unit.buffComp.triggerBuff(exports.TriggerEnum.StartFight, null, null, null);
                    let abilityParam = { beHitUid: unit.uid };
                    let conditionParam = { beHitUid: unit.uid };
                    for (const team of this._teams.values()) {
                        if (initData.teamId == team.teamId) {
                            let unitMap = team.getUnitsMap();
                            for (const unitTmp of unitMap.values()) {
                                if (unitTmp.uid != unit.uid) {
                                    unitTmp.buffComp.triggerBuff(exports.TriggerEnum.FriendEnter, conditionParam, abilityParam, null);
                                }
                            }
                        }
                        else {
                            let unitMap = team.getUnitsMap();
                            for (const unitTmp of unitMap.values()) {
                                unitTmp.buffComp.triggerBuff(exports.TriggerEnum.EnemyEnter, conditionParam, abilityParam, null);
                            }
                        }
                    }
                }
            }
            else {
                if (!this._preUnitData[initData.data.clientId]) {
                    this._preUnitData[initData.data.clientId] = initData;
                }
            }
        }
        addUnitToBattle(initData) {
            if (this._addedUnitUid[initData.data.clientId]) {
                // 已经添加过这个id，要保证唯一
                return null;
            }
            if (initData.data.type != exports.UnitType.Special && initData.data.type != exports.UnitType.Dragon) {
                //血量为0不创建
                if (initData.data.initHpPer <= 0) {
                    return null;
                }
                let checkAtr;
                if (initData.atr instanceof Array) {
                    checkAtr = initData.atr[0];
                }
                else {
                    checkAtr = initData.atr;
                }
                let hpTmp = BattleCommon.calcAtkOrHp(checkAtr[exports.AtrType.Hp], checkAtr[exports.AtrType.HpPer], checkAtr[exports.AtrType.HpAdd]);
                if (hpTmp <= 0) {
                    return null;
                }
            }
            let team = this._teams.get(initData.teamId);
            if (!team) {
                team = new BattleTeam(initData.teamId);
                this._teams.set(team.teamId, team);
            }
            if (!initData.campId) {
                initData.campId = initData.teamId;
            }
            let camps = this._camps.get(initData.campId);
            if (!camps) {
                camps = [];
                this._camps.set(initData.campId, camps);
                camps.push(initData.teamId);
            }
            else {
                if (camps.indexOf(initData.teamId) < 0) {
                    camps.push(initData.teamId);
                }
            }
            let unit = new BattleUnit(this, this.createUnitId(initData.teamId), initData.teamId, initData.campId, initData.data);
            this._addedUnitUid[unit.uid] = true;
            this._units.set(unit.uid, unit);
            if (initData.tile) {
                unit.posComp.initTile(initData.tile.x, initData.tile.y);
            }
            else {
                if (!initData.pos) {
                    initData.pos = { x: 0, y: 0 };
                }
                unit.posComp.initPos(initData.pos.x, initData.pos.y);
            }
            team.addUnit(unit);
            this.addUnitCount(unit.unitData);
            if (unit.unitData.linkKeyDef) {
                this.addUnitIntoLinkMap(unit.unitData.linkKeyDef, unit);
            }
            // this._record.addRecord(BattleRecordDataType.UnitAdd, [unit.uid, unit.configId, unit.pos.x, unit.pos.y, unit.teamId, unit.type, unit.behavior.getDir()]);
            this.addRecord(exports.BattleRecordDataType.UnitAdd, { uid: unit.uid, unitAdd: { configId: unit.configId, posx: unit.pos.x, posy: unit.pos.y, teamId: unit.teamId, type: unit.type, dir: unit.behavior.getDir() } });
            // 属性处理放在添加日志之后
            unit.initBaseAttr(initData.atr);
            // 召唤物设置父单位
            if (initData.parentUnitUid) {
                let parentUnit = this.getUnit(initData.parentUnitUid);
                if (parentUnit) {
                    unit.setParentUnit(parentUnit);
                    parentUnit.addSummon(unit);
                }
            }
            // 添加技能
            if (initData.skills) {
                for (let k = 0, lenk = initData.skills.length; k < lenk; k++) {
                    unit.addSkill(initData.skills[k]);
                }
            }
            // 添加buff
            if (initData.buffs) {
                for (let k = 0, lenk = initData.buffs.length; k < lenk; k++) {
                    unit.addBuff(initData.buffs[k]);
                }
            }
            if (initData.handlePos && initData.handlePos.length > 0) {
                for (let i = 0, leni = initData.handlePos.length; i < leni; i++) {
                    unit.behavior.setMoveTarget(UnitMoveType.Handle, "", bv3(initData.handlePos[i]), 0);
                }
            }
            return unit;
        }
        /**单位死亡 */
        unitDie(unitId, removeType = exports.UnitRemoveType.Die) {
            this.addRecord(exports.BattleRecordDataType.UnitDie, { uid: unitId });
            this.removeUnit(unitId, removeType);
        }
        /**移除单位 */
        removeUnit(unitId, removeType = exports.UnitRemoveType.Die) {
            let unit = this._units.get(unitId);
            if (unit) {
                this.delUnitCount(unit.unitData);
                unit.attrComp.clearHp();
                // 只从队伍中移除，不能再被技能选中，但是manager中保留，有可能会被复活
                this.getTeam(unit.teamId).removeUnit(unitId);
                this.addRecord(exports.BattleRecordDataType.UnitRemove, { uid: unitId, unitRemove: { removeType: removeType } });
                this._units.delete(unitId);
                if (unit.unitData.type == exports.UnitType.Summon) ;
                else {
                    unit.dieTime = this.getRunningTime();
                    this._dieUnits.set(unitId, unit);
                    this.checkTeamWave(unit.teamId);
                    if (this.isInBattle()) {
                        let conditionParam = { beHitUid: unit.uid };
                        for (const team of this._teams.values()) {
                            if (unit.teamId == team.teamId) ;
                            else {
                                // 敌人死亡
                                let unitMap = team.getUnitsMap();
                                for (const unitTmp of unitMap.values()) {
                                    unitTmp.buffComp.triggerBuff(exports.TriggerEnum.EnemyDie, conditionParam, null, null);
                                }
                            }
                        }
                    }
                }
            }
        }
        /**检测战斗结束（只剩一个队伍） */
        checkFinish() {
            //检测战斗结束，剩余单位都是一个队伍时结束
            let leftTeamId = new Map();
            let teamIdTmp = 0;
            this._teams.forEach((team, key) => {
                if (team.unitCountNoSummon > 0) {
                    teamIdTmp = key;
                    leftTeamId.set(teamIdTmp, team.unitCountNoSummon);
                }
            });
            if (leftTeamId.size == 1) {
                // 战斗结束
                this.battleFinish(teamIdTmp);
            }
            else {
                if (leftTeamId.size == 0) ;
            }
        }
        /**检测是否有下一波怪物 */
        checkTeamWave(teamId) {
            var _a;
            let leftUnitCount = (_a = this._teams.get(teamId)) === null || _a === void 0 ? void 0 : _a.unitCountNoSummon;
            if (leftUnitCount && leftUnitCount > 0) {
                return;
            }
            if (this._neverEnd) {
                this.addRecord(exports.BattleRecordDataType.TeamAllDie, { teamAllDie: { teamId: teamId, dieCount: this._teamAllDieCount[teamId] } });
            }
            else {
                this._teamAllDieCount[teamId] = NumberUtil.myParseInt(this._teamAllDieCount[teamId]) + 1;
                if (this._teamWave[teamId] && this._teamWave[teamId] > this._teamAllDieCount[teamId]) {
                    this._battleStatus = exports.BattleStatus.PauseWave;
                    this.addRecord(exports.BattleRecordDataType.TeamAllDie, { teamAllDie: { teamId: teamId, dieCount: this._teamAllDieCount[teamId] } });
                    if (this._teamAllDieCb) {
                        this._teamAllDieCb(teamId, this._teamAllDieCount[teamId]);
                    }
                }
                else {
                    // 检测结束
                    this.checkFinish();
                }
            }
            this.tryClearBuff();
        }
        /**尝试清理单位buff */
        tryClearBuff() {
            // update
            for (const team of this._teams.values()) {
                let unitsTmp = team.getUnitsMap();
                for (const unit of unitsTmp.values()) {
                    if (unit.isDie) {
                        // 死亡单位不清理buff
                        return;
                    }
                    unit.buffComp.tryClearBuff();
                }
            }
        }
        /**删除队伍所有单位 */
        removeTeamAllUnit(teamId) {
            let team = this._teams.get(teamId);
            if (team) {
                let unitsTmp = team.getUnitsMap();
                for (const unit of unitsTmp.values()) {
                    this.removeUnit(unit.uid, exports.UnitRemoveType.Handle);
                }
            }
        }
        /**战斗结束，清理战场 */
        battleFinish(teamIdTmp) {
            let unitTyps = [
                exports.UnitType.Hero,
                exports.UnitType.Monster,
                exports.UnitType.Special,
                exports.UnitType.Dragon,
            ];
            for (const team of this._teams.values()) {
                let unitMap = team.getUnitsMap();
                for (const unitTmp of unitMap.values()) {
                    if (unitTyps.indexOf(unitTmp.unitData.type) >= 0) {
                        unitTmp.buffComp.triggerBuff(exports.TriggerEnum.FinishFight, null, null, null);
                    }
                }
            }
            // 胜利队伍id
            this._result.winId = teamIdTmp;
            this._result.isTimeOver = teamIdTmp == 0 ? 1 : 0;
            // 单位血量
            for (const team of this._teams.values()) {
                let unitsTmp = team.getUnitsMap();
                for (const unit of unitsTmp.values()) {
                    this._result.unitHp[unit.unitData.clientId] = unit.attrComp.getHpPer();
                    this._result.updateDieCount(unit.unitData.clientId, unit.getDieCount()); //unitInfo[unit.unitData.clientId] = { dieCount: unit.getDieCount() };
                }
            }
            // 清除所有的子弹
            for (const bullet of this._bullets.values()) {
                this.removeBullet(bullet);
            }
            this._battleStatus = exports.BattleStatus.Finish;
            this._record.addRecord(exports.BattleRecordDataType.Finish);
            if (this._finishCb) {
                this._finishCb(this._result);
                this._finishCb = null;
            }
        }
        /**获取队伍 */
        getTeam(teamId) {
            return this._teams.get(teamId);
        }
        /**获取单位 */
        getUnit(unitId, ignoreDie) {
            if (!unitId) {
                return null;
            }
            let unitTmp = this._units.get(unitId);
            if (!unitTmp && ignoreDie) {
                unitTmp = this._dieUnits.get(unitId);
            }
            return unitTmp;
        }
        /**获取单位坐标 */
        getUnitPos(unitId) {
            let unit = this.getUnit(unitId);
            if (unit && !unit.isDie) {
                return unit.pos;
            }
            return null;
        }
        getUnitDie(uid) {
            var _a;
            return !!((_a = this.getUnit(uid)) === null || _a === void 0 ? void 0 : _a.isDie);
        }
        /**获取队伍id */
        getTeamId(mode, teamId) {
            if (mode == 1) {
                return teamId;
            }
            else {
                let selectTeam = -1;
                for (const tid of this._teams.keys()) {
                    if (teamId != tid) {
                        selectTeam = tid;
                    }
                }
                return selectTeam;
            }
        }
        /**获取所有队伍 */
        /**获取非己方队伍 */
        getTeamsWithoutSelf(teamId) {
            let rtn = [];
            for (const tid of this._teams.keys()) {
                if (teamId != tid) {
                    rtn.push(this._teams.get(tid));
                }
            }
            return rtn;
        }
        /**获取非己方阵营队伍 */
        getEnmeyTeams(campId) {
            let rtn = [];
            for (const camp of this._camps.keys()) {
                if (camp != campId) {
                    let teamIds = this._camps.get(camp);
                    for (let i = 0, leni = teamIds.length; i < leni; i++) {
                        rtn.push(this._teams.get(teamIds[i]));
                    }
                }
            }
            return rtn;
        }
        /**获取所有队伍 */
        getAllTeams() {
            return Array.from(this._teams.values());
        }
        /**判断是否同个队伍 */
        checkSameTeam(uid1, uid2) {
            let unit1 = this.getUnit(uid1);
            let unit2 = this.getUnit(uid2);
            if (unit1 && unit2) {
                return unit1.teamId == unit2.teamId;
            }
            return false;
        }
        /**获取所有的unit */
        getUnitsByTeamId(teamId, sameTeam) {
            let units = [];
            if (teamId) {
                sameTeam = !sameTeam;
                if (sameTeam) {
                    for (const tid of this._teams.keys()) {
                        if (teamId == tid) {
                            units = this._teams.get(tid).getAllUnits();
                            break;
                        }
                    }
                }
                else {
                    units = [];
                    for (const tid of this._teams.keys()) {
                        if (teamId != tid) {
                            units = units.concat(this._teams.get(tid).getAllUnits());
                        }
                    }
                }
            }
            else {
                units = [];
                for (const tid of this._teams.keys()) {
                    units = units.concat(this._teams.get(tid).getAllUnits());
                }
            }
            return units;
        }
        // 获取一个联结map
        getLinkMap(linkKey, crete) {
            let mapTmp = this._linkMap.get(linkKey);
            if (crete && !mapTmp) {
                mapTmp = new Map();
                this._linkMap.set(linkKey, mapTmp);
            }
            return mapTmp;
        }
        addUnitIntoLinkMap(linkKey, unit) {
            let mapTmp = this.getLinkMap(linkKey, true);
            mapTmp.set(unit.uid, unit);
        }
        /**添加一个子弹 */
        addBullet(actorId, param) {
            let bulletId = `Bullet_${this.createBulletId()}`;
            let skillCfg = battle.config.getSkill(param.skillId);
            let bulletCfg;
            if (skillCfg && skillCfg.bullet) {
                bulletCfg = battle.config.getBullet(skillCfg.bullet);
            }
            let bullet = BattleBulletFactory.instance.getBullet(bulletCfg); // new BattleBulletBase();
            bullet.initBullet(this, bulletId, actorId, param);
            this._bullets.set(bulletId, bullet);
            if (this._battleStatus == exports.BattleStatus.SkillPause) {
                let indexTmp = this._outPauseBullets.indexOf(bulletId);
                if (indexTmp < 0) {
                    this._outPauseBullets.push(bulletId);
                }
            }
        }
        /**获取子弹 */
        getBullet(bulletId) {
            let bullet = this._bullets.get(bulletId);
            if (!bullet) {
                return null;
            }
            return bullet;
        }
        /**移除子弹 */
        removeBullet(bullet) {
            if (bullet) {
                this._bullets.delete(bullet.bId());
            }
            let indexTmp = this._outPauseBullets.indexOf(bullet.bId());
            if (indexTmp >= 0) {
                this._outPauseBullets[indexTmp] = "";
            }
        }
        /**本次战斗限时 */
        getBattleTime() {
            return this._battleTime;
        }
        /**暂停状态 */
        get isPause() {
            return this._pause;
        }
        // 创建单位唯一id
        createUnitId(team) {
            if (!team || team < 0) {
                team = 0;
            }
            if (!this._unitIdObj[team]) {
                this._unitIdObj[team] = 1;
            }
            else {
                this._unitIdObj[team]++;
            }
            return this._unitIdObj[team];
        }
        // 创建子弹唯一id
        createBulletId() {
            return ++this._bulletId;
        }
        /**技能目标有效性 */
        checkSkillTargetValid(target) {
            if (!target) {
                return false;
            }
            if (target.pos) {
                return true;
            }
            else {
                for (let i = 0, leni = target.units.length; i < leni; i++) {
                    let unitTmp = this.getUnit(target.units[i]);
                    if (!unitTmp || unitTmp.isDie) {
                        return false;
                    }
                }
                return true;
            }
        }
        /**获取战斗日志 */
        getRecord(startId, count) {
            return this._record.getRecord(startId, count);
        }
        /**战斗是否结束 */
        isFinish() {
            return this._battleStatus == exports.BattleStatus.Finish;
        }
        /**是否等待下一波刷新 */
        waitNextWave() {
            return this._battleStatus == exports.BattleStatus.PauseWave;
        }
        /**获取战斗结果 */
        getResult() {
            return this._result;
        }
        /**战斗结束回调 */
        onFrame(cb) {
            this._frameCb = cb;
        }
        /**团灭回调 */
        onTeamAllDie(cb) {
            this._teamAllDieCb = cb;
        }
        /**战斗结束回调 */
        onFinish(cb) {
            this._finishCb = cb;
        }
        // private _battleLog: globalThis["tslog"].Logger<any> = new tslog.Logger({ name: "BattleLog", type: "pretty" });
        /**将字符串中的{{}}部分替换 */
        execExpress(str, obj) {
            let reg = /\{\{(.+?)\}\}/;
            let match = reg.exec(str);
            let key;
            let numKey;
            let value;
            let keys;
            while (match) {
                key = match[1];
                numKey = Number(key);
                if (Number.isFinite(numKey)) {
                    key = "";
                    if (obj.keyArrs) {
                        key = obj.keyArrs[numKey];
                    }
                }
                if (!key) {
                    value = 0;
                }
                else {
                    keys = key.split(".");
                    switch (keys[0]) {
                        case exports.ExpressParamEnum.Unit1:
                            value = obj.unit1.getUnitInfo(keys.slice(1), obj.exAttr1);
                            break;
                        case exports.ExpressParamEnum.Unit2:
                            value = obj.unit2.getUnitInfo(keys.slice(1), obj.exAttr2);
                            break;
                        case exports.ExpressParamEnum.ReduceN:
                            value = BattleCommon.ReduceExpressParamN;
                            break;
                        case exports.ExpressParamEnum.ReduceS:
                            value = BattleCommon.ReduceExpressParamS;
                            break;
                        case exports.ExpressParamEnum.Lv:
                            value = obj.unit1.getUnitInfo([exports.ExpressParamEnum.Lv], obj.exAttr1);
                            break;
                        default:
                            if (keys.length == 1) {
                                value = obj[keys[0]];
                            }
                            else {
                                value = obj.unit1.getUnitInfo(keys, obj.exAttr1);
                            }
                            break;
                    }
                    if (!value) {
                        value = 0;
                    }
                }
                str = str.replace(match[0], value.toString());
                match = reg.exec(str);
            }
            return ExpressUtil.getInstance().execPress(str);
        }
        /**战斗日志 */
        addRecord(type, params) {
            this._record.addRecord(type, params);
        }
        battleLog(msg, ...tag) {
            if (!this._showLog) {
                return;
            }
            // TsLogBattleLib.battleLog.info(msg);
            TLogger.log(msg, "BattleLib", ...tag);
        }
    }

    BattleInit.init();

    exports.BMath = BMath;
    exports.Battle = Battle;
    exports.BattleCommon = BattleCommon;
    exports.BattleManager = BattleManager;
    exports.BattleRecordData = BattleRecordData;
    exports.HexUtil = HexUtil;
    exports.NumberUtil = NumberUtil;
    exports.battle = battle;

}));
