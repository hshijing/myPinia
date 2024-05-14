//依赖注入key
export const storeProvideKey = Symbol("storeProvideKey");

/**
 * 保存用户在使用$OnAction传递过来的函数
 */
export let actionsList = [];

/**
 * 移除对应仓库数据的响应式
 */
export const removeActionsList = () => {
  actionsList = [];
};
