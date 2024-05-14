import { removeActionsList } from "../global";

/**
 * 关闭指定仓库的数据响应式
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} pinia pinia实例
 * @param {string} id 仓库id
 * @param {EffectScope} scope effect作用域
 */
export const useDispose = (pinia, id,scope) => {
  return () => {
    removeActionsList();
    pinia.store.delete(id);
    scope.stop()
  };
};
