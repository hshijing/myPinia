/**
 * 重置仓库数据
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} pinia pinia实例
 * @param {string} id 仓库id
 * @returns {Function} 修改仓库数据的函数
 */
export const useReset = (pinia, id) => {
  const store = pinia.store.get(id);
  //拿到用户初始的状态，然后怎么合并
  const initState = {...store.$state};
  return () => {
    //TODO 如果直接使用initState会因为内存问题无法达到预期
    const localState={...initState}
    store.$patch((state) => {
      Object.keys(localState).forEach((key) => {
        state[key] = localState[key];
      });
    });
  };
};
