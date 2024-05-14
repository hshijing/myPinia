import { formatArgs, isFunction } from "../utils/utils";
import { createOptionsStore, createSetupStore } from "./createStore";
import { createPinia } from "./createpinia";

/**
 * 创建pinia仓库
 * @author HuangXinDian <2097294126@qq.com>
 * @param  {[string,object]|[string,function]|[object]} args 用户传入的配置项
 * @returns {()=>object} 返回一个函数，函数返回一个仓库
 */
export const definePinia = (...args) => {
  const userToStore = formatArgs(args);
  return () => {
    //获取到pinia实例
    const piniaStore = createPinia();
    //获取当前仓库
    return getPiniaStore(piniaStore, userToStore);
  };
};
/**
 * 获取pinia仓库
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} piniaStore  pinia实例
 * @param {Map<string,object>} piniaStore.store  pinia总仓库
 * @param {object} userToStore  用户创建仓库时传入的配置项
 * @param {string} userToStore.id  仓库id
 * @param {function} userToStore.setup  仓库的setup函数
 * @param {object} userToStore.options  仓库的options配置项
 */
const getPiniaStore = (piniaStore, userToStore) => {
  const storeMap = piniaStore.store;
  const id = userToStore.id;
  const setup = userToStore.setup;
  const options = userToStore.options;
  if (!storeMap.has(id)) {
    //当前仓库是什么类型 setup API|| options API
    if (isFunction(setup)) {
      //setup API
      createSetupStore(piniaStore, id, setup);
    } else {
      //options API
      createOptionsStore(piniaStore, id, options);
    }
  }
  return storeMap.get(id);
};
