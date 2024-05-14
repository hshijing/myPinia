import { computed } from "vue";

/**
 * 分布式仓库-> 修正自己 getters 里的函数this指向 并变为计算属性
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} store 自己的仓库
 * @param {object} getters 自己的仓库的 getters
 * @returns {object} 修正后的 getters
 */
export const createStoreGetters = (store, getters) => {
  if (!getters) {
    throw new Error("getters is not defined");
  }
  if (typeof getters !== "object") {
    throw new Error("getters must be an object");
  }
  /**
   * 修正自己 getters 里的函数this指向 并变为计算属性
   * {
   *  func:computed(()=>func.call(store))
   * }
   */
  const computedGetters = {};
  for (const key in getters) {
    if (!Object.hasOwnProperty.call(getters, key)) continue;
    computedGetters[key] = computed(() => getters[key].call(store, store));
  }
  return computedGetters;
};
