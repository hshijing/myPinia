import { EffectScope, watch } from "vue";

/**
 * 订阅仓库数据变化
 * 如何监听pinia仓库数据变化？并且随着effectsStop的停止而停止监听？
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} pinia pinia实例
 * @param {string} id 仓库id
 * @param {EffectScope} scope effect作用域    
 * @returns {Function} 订阅仓库数据变化函数
 */
export const useSubscribe = (pinia, id,scope) => {
  return (callback, options = {}) => {
    scope.run(() =>
      watch(
        pinia.store.get(id).$state,
        (newState) => {
          callback(pinia.store.get(id), newState);
        },
        options
      )
    );
  };
};
