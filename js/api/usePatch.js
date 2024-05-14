import {mergeObject} from '../utils/utils'
/**
 * 修改仓库数据
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} pinia pinia实例
 * @param {string} id 仓库id
 * @returns {Function} 修改仓库数据的函数
 */
export const usePatch = (pinia, id) => {
  /**
   * @param {object|Function} stateOrFn 用户调用函数时传入的配置
   */
  return (stateOrFn) => {
    if (typeof stateOrFn === "function") {
      //是函数我对应的state给你 ,你爱怎么玩怎么玩
      stateOrFn(pinia.state.value[id])
    } else {
      //是对象我直接合并,用户传入的配置优先级最高,同时保证深层次也能修改
      mergeObject(stateOrFn,pinia.state.value[id])
    }
  };
};
