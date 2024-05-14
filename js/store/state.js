import { toRefs } from "vue";

/**
 * 分布式仓库-> 把子仓库的state挂载到父仓库的state上
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} pinia pinia
 * @param {Ref<object>} pinia.state pinia的state
 * @param {Map<string,object>} pinia.store pinia的store
 * @param {string} id 子仓库id
 * @param {Function} state 仓库的数据
 * @returns {object} 子仓库的所有state数据
 */
export const createStoreState = (pinia, id, state) => {
  if (!state) {
    throw new Error("state is required");
  }
  if (typeof state !== "function") {
    throw new Error("state must be a function");
  }
  pinia.state.value[id] = state();
  return toRefs(pinia.state.value[id]);
};

/**
 * 给自己的仓库挂上$state属性
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} pinia pinia
 * @param {string} id 子仓库id
 */
export const storeProxyState = (pinia, id) => {
  const store = pinia.store.get(id);
  if (!store) {
    throw new Error(`store ${id} not found`);
  }
  Object.defineProperty(store, "$state", {
    get() {
      return pinia.state.value[id];
    },
    set(newValue) {
      //TODO 使用$patch 方法来更新state
      store.$patch((state) => {
        Object.assign(state, newValue);
      });
    },
  });
};
