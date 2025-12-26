import { Asset, AssetManager, assetManager, error, sp, sys } from "cc";
import { DEBUG, WECHAT } from "cc/env";

export class LhCCExtensions {
    static init() {
        // -----------------资源相关------------------
        const oldAddRef = Asset.prototype["addRef"];
        Asset.prototype["addRef"] = function (): Asset {
            let rtn = oldAddRef.apply(this);
            gi.resManager?.onAddRef(this.uuid);
            // if (this.uuid == "0661632e-fe4c-4f1d-9e71-18c206fca916@f9941") {
            //     console.log(`com_box_a2 的引用次数增加==${this.refCount}`)
            // }
            return rtn;
        }

        const oldDecRef = Asset.prototype["decRef"];
        Asset.prototype["decRef"] = function (autoRelease = true): Asset {
            let rtn = oldDecRef.apply(this, [autoRelease]);
            gi.resManager?.onDecRef(this.uuid);
            // if (this.uuid == "0661632e-fe4c-4f1d-9e71-18c206fca916@f9941") {
            //     console.log(`com_box_a2 的引用次数减少==${this.refCount}`)
            // }
            return rtn;
        }

        sp.Skeleton.prototype["updateAnimationClone"] = sp.Skeleton.prototype["updateAnimation"];
        sp.Skeleton.prototype["updateAnimation"] = function (deltaTime: number) {
            try {
                // 增强前置条件检查
                if (!this.node?.isValid ||
                    !this._skeleton ||
                    !this._skeleton.data ||
                    !this._skeletonData) {
                    return;
                }
                if (this.node["updateAnimationTime"]) {
                    return;
                }
                // 创建本地引用防止运行时被释放
                const validSkeleton = this._skeleton;
                const validSkeletonData = this._skeletonData;

                // 添加二次有效性检查
                if (!validSkeleton || !validSkeleton.data || !validSkeletonData) {
                    return;
                }
                // if (this.node["deltaTime"]) {      
                if (!this._deltaTime) {
                    this._deltaTime = 0;
                }
                this._deltaTime += deltaTime;
                // spine刷新限制30帧
                if (this._deltaTime < 0.032) {
                    return;
                }
                this.updateAnimationClone(this._deltaTime);
                this._deltaTime = 0;
            } catch (e) {
            }
        };

        //重新微信下载函数
        this.enableWechatMiniOptimizing();
        if (!sys.isNative) {
            this.extensionJsonRespCache();
        }
    }

    // NOTICE 稳定性未知，让测试去测
    // 扩展Json响应缓存
    static extensionJsonRespCache() {
        // if (DEV) return;
        const _jsonRespCache: Map<string, any> = new Map;
        const _unpackCache: Map<string, any> = new Map;
        // @ts-ignore
        const _downloaders = assetManager.downloader._downloaders;
        if (_downloaders['.oldjson']) {
            _downloaders['.json'] = _downloaders['.oldjson'];
        }
        const _oldDownloadJson = _downloaders['.json']
        _downloaders['.oldjson'] = _oldDownloadJson;
        _downloaders['.json'] = (url: string, options: Record<string, any>, onComplete: ((err: Error | null, data?: Record<string, any> | null) => void)): void => {
            // 使用缓存json请求，阻止下载
            const _url = url;
            const dataCache = _jsonRespCache.get(_url);
            if (gi.lhConfig?.gameRunning && dataCache) {
                onComplete(null, dataCache);
                return;
            }
            _oldDownloadJson(_url, options, (err: Error | null, data?: Record<string, any> | null) => {
                if (!err) {
                    if (/remote\/(prefabBundle|slgPrefabBundle)\/import\//.test(_url) || /assets\/(prefabBundle|slgPrefabBundle)\/import\//.test(_url)) {
                        _jsonRespCache.set(url, data);
                    }
                }
                onComplete(err, data);
            });
        }
        // @ts-ignore
        const files = assetManager._files;
        const downloader = assetManager.downloader;
        const transformPipeline = assetManager.transformPipeline;
        function assertIsTrue(expr: unknown, message?: string): asserts expr {
            if (DEBUG && !expr) {
                // eslint-disable-next-line no-debugger
                // debugger;
                throw new Error(`Assertion failed: ${message ?? '<no-message>'}`);
            }
        }
        function transform(input: string | string[] | Record<string, any> | Array<Record<string, any>>, options?: Record<string, any> | null): string | string[] {
            const subTask = AssetManager.Task.create({ input, options });
            const urls: string[] = [];
            try {
                const result: AssetManager.RequestItem[] = transformPipeline.sync(subTask);
                for (const requestItem of result) {
                    const url = requestItem.url;
                    requestItem.recycle();
                    urls.push(url);
                }
            } catch (e) {
                for (const item of subTask.output) {
                    item.recycle();
                }
                error((e as Error).message, (e as Error).stack);
            }
            subTask.recycle();
            return urls.length > 1 ? urls : urls[0];
        }

        // 简单深拷贝（性能略低）
        function deepCloneArray(arr: any[], ignoreArr = []) {
            const clone = [];
            for (var key in arr) {
                const val1 = arr[key];
                let val2 = val1;
                if (Array.isArray(val1)) {
                    if (!ignoreArr.includes(key)) {
                        val2 = deepCloneArray(val1);
                    }
                }
                clone[key] = val2;
            }
            return clone;
        }

        assetManager.packManager.load = function (item: any, options: Record<string, any> | null, onComplete: ((err: Error | null, data?: any) => void)): void {
            // if not in any package, download as uausl
            if (item.isNative || !item.info || !item.info.packs) {
                downloader.download(item.id, item.url, item.ext, item.options, onComplete);
                return;
            }

            if (files.has(item.id)) {
                // const nowTime = Date.now();
                // HACK 不重要的信息不使用深拷贝
                const data = deepCloneArray(files.get(item.id), ['0', '1', '2', '3', '4']);
                // const costTime = Date.now() - nowTime;
                // if (costTime > 5) {
                //     console.log('拷贝过度耗时pos1:', costTime, '    ', item.id);
                // }
                onComplete(null, data);
                return;
            }

            const packs = item.info.packs;

            // find a loading package
            const loadingPack = packs.find((val): boolean => this._loading.has(val.uuid));

            if (loadingPack) {
                const req = this._loading.get(loadingPack.uuid);
                assertIsTrue(req);
                req.push({ onComplete, id: item.id });
                return;
            }

            // download a new package
            const pack = packs[0];
            this._loading.add(pack.uuid, [{ onComplete, id: item.id }]);

            // find the url of pack
            assertIsTrue(item.config);
            const url = transform(pack.uuid, { ext: pack.ext, bundle: item.config.name }) as string;

            downloader.download(pack.uuid, url, pack.ext, item.options, (err, data): void => {
                files.remove(pack.uuid);
                if (err) {
                    error(err.message, err.stack);
                }
                const unpackComplete = (err2, result): void => {
                    if (/remote\/(prefabBundle|slgPrefabBundle)\/import\//.test(url) || /assets\/(prefabBundle|slgPrefabBundle)\/import\//.test(url)) {
                        if (!_unpackCache.has(url)) {
                            _unpackCache.set(url, result);
                        }
                        // for (const id in result) {
                        //     const data = result[id];
                        //     if (data[0] && data[0].preprocessed) {
                        //         data.__oldFileInfo = data[0];
                        //     }
                        // }
                    }
                    if (!err2) {
                        for (const id in result) {
                            files.add(id, result[id]);
                        }
                    }
                    const callbacks = this._loading.remove(pack.uuid);
                    assertIsTrue(callbacks);
                    for (let i = 0, l = callbacks.length; i < l; i++) {
                        const cb = callbacks[i];
                        if (err || err2) {
                            cb.onComplete(err || err2);
                            continue;
                        }

                        // const nowTime = Date.now();
                        // HACK 不重要的信息不使用深拷贝
                        const unpackedData = deepCloneArray(result[cb.id], ['0', '1', '2', '3', '4']);
                        // const costTime = Date.now() - nowTime;
                        // if (costTime > 5) {
                        //     console.log('拷贝过度耗时pos2:', costTime, '    ', cb.id);
                        // }
                        if (!unpackedData) {
                            cb.onComplete(new Error('can not retrieve data from package'));
                        } else {
                            cb.onComplete(null, unpackedData);
                        }
                    }
                }
                // 使用解包缓存，阻止下载
                const resultCache = _unpackCache.get(url);
                if (gi.lhConfig?.gameRunning && resultCache) {
                    // for (let id in resultCache) {
                    //     const data = resultCache[id];
                    //     if (data.__oldFileInfo) {
                    //         data[0] = data.__oldFileInfo;
                    //     }
                    // }
                    unpackComplete(null, resultCache);
                } else {
                    // unpack package
                    this.unpack(pack.packedUuids, data, pack.ext, item.options, unpackComplete);
                }
            });
        }
    }

    // 启用微信小游戏优化
    static enableWechatMiniOptimizing() {
        const wx = window["wx"];
        if (!WECHAT || !wx) {
            return;
        }
        let sendTimeOutCoun = 0;
        // 使用http2
        const _wxdownloadFile = wx.downloadFile;
        wx.downloadFile = function (obj: any) {
            obj.enableHttp2 = true;
            let failClone = obj.fail;
            let successClone = obj.success;
            obj.success = (res) => {
                sendTimeOutCoun = 0;
                if (successClone) {
                    successClone(res)
                }
            },
                obj.fail = (res) => {
                    sendTimeOutCoun++;
                    if (sendTimeOutCoun >= 5) {
                        sendTimeOutCoun = 0;
                        if (failClone) {
                            failClone(res)
                        }
                        // tips.netWorkConfirm('4000031', () => {
                        //     tips.netInstableOpen();
                        //     setTimeout(() => {
                        //         tips.netInstableClose();
                        //         _wxdownloadFile.call(wx, obj);
                        //     }, 1000);
                        // }, '3000006', '3001125', '1000002', () => {
                        //     platform?.platformModel.loginOut(true)
                        //     platform?.PointMgr.SSUser(true)
                        // })
                    } else {
                        setTimeout(() => {
                            _wxdownloadFile.call(wx, obj);
                        }, 1000);
                    }
                };
            _wxdownloadFile.call(wx, obj);
        };
        const _request = wx.request;
        wx.request = function (obj: any) {
            obj.enableHttp2 = true;
            _request.call(wx, obj);
        };
    }
}