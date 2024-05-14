import { EffectScope, effectScope, isReactive, isRef, reactive } from "vue";
import { isComputed } from "../utils/utils";
import { createStoreState, storeProxyState } from "../store/state";
import { createStoreActions } from "../store/actions";
import { createStoreGetters } from "../store/getters";
import { setStoreAPI } from "../api/setStoreAPI";
/**
 * 创建一个setup函数式仓库
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} piniaStore pinia实例
 * @param {Map<string,object>} piniaStore.store pinia总仓库
 * @param {string} id 仓库id
 * @param {Function} setup 仓库的setup函数
 * @returns {object} 返回setup函数式仓库
 */
export function createSetupStore(piniaStore, id, setup) {
  //获得用户函数的返回值
  const setupFn = setup();
  const store = reactive({});
  //自己的作用域
  let storeScope = null;
  const result = piniaStore.scope.run(() => {
    //创建一个子作用域
    storeScope = effectScope();
    return storeScope.run(() => compSetup(piniaStore, id, setupFn));
  });

  //先把子仓库的state挂载到父仓库的state上 自己在挂载自己的数据
  return setStore({
    piniaStore,
    store,
    id,
    result,
    isSetup: true,
    storeScope,
  });
}

/**
 * 创建一个options组合式仓库
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} piniaStore pinia实例
 * @param {Map<string,object>} piniaStore.store pinia总仓库
 * @param {EffectScope} piniaStore.scope pinia作用域
 * @param {string} id 仓库id
 * @param {object} options 仓库的配置项
 * @param {Function} options.state 仓库的数据
 * @param {object} options.getters 仓库的计算属性
 * @param {object} options.actions 仓库的方法
 */
export function createOptionsStore(piniaStore, id, options) {
  const store = reactive({});
  //自己的作用域
  let storeScope = null;
  const result = piniaStore.scope.run(() => {
    storeScope = effectScope();
    return storeScope.run(() => compOptions(piniaStore, store, id, options));
  });
  return setStore({
    piniaStore,
    store,
    id,
    result,
    isSetup: false,
    storeScope,
  });
}

/**
 * 组合式仓库->把子仓库的state挂载到父仓库的state上
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} pinia pinia
 * @param {Ref<object>} pinia.state pinia的state
 * @param {Map<string,object>} pinia.store pinia的store
 * @param {string} id 子仓库id
 * @param {object} setup 子仓库的state
 */
const compSetup = (pinia, id, setup) => {
  if (!pinia.state.value[id]) {
    pinia.state.value[id] = {};
  }
  Object.keys(setup).forEach((key) => {
    const value = setup[key];
    //只挂载state的属性到总仓库的state上
    if ((isRef(value) && !isComputed(value)) || isReactive(value)) {
      pinia.state.value[id][key] = value;
    }
  });
  return setup;
};
/**
 * 分布式仓库-> 把子仓库的属性挂载到父仓库的属性上 统一管理
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} pinia pinia
 * @param {Ref<object>} pinia.state pinia的state
 * @param {Map<string,object>} pinia.store pinia的store
 * @param {object} store 自己的仓库
 * @param {string} id 子仓库id
 * @param {object} options 子仓库的所有配置项
 * @param {Function} options.state 仓库的数据
 * @param {object} options.getters 仓库的计算属性
 * @param {object} options.actions 仓库的方法
 * @returns {object} 返回经过处理后的仓库数据属性
 */
const compOptions = (pinia, store, id, options) => {
  const { state, getters, actions } = options;
  if (!pinia.state.value[id]) {
    pinia.state.value[id] = {};
  }
  const storeState = createStoreState(pinia, id, state);
  const storeGetters = createStoreGetters(store, getters);
  const storeActions = createStoreActions(store, actions);
  return {
    ...storeState,
    ...storeGetters,
    ...storeActions,
  };
};

/**
 * 设置仓库属性
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} options 配置传入的对象
 * @param {object} options.piniaStore  pinia
 * @param {Map<string,object>} options.piniaStore.store pinia的store
 * @param {object} options.store 自己的仓库
 * @param {string} options.id 子仓库id
 * @param {object} options.result 处理过后的属性,最后挂载到自己的store
 * @param {boolean} options.isSetup 是否是setup组合式API仓库
 * @param {EffectScope} options.storeScope effect作用域
 */
const setStore = (options) => {
  const { piniaStore, store, id, result, isSetup, storeScope } = options;
  piniaStore.store.set(id, store);
  Object.assign(store, result, {
    $id: id,
    _isSetupAPI: isSetup,
  });
  storeProxyState(piniaStore, id);
  setStoreAPI(piniaStore, id, storeScope);
  initPiniaPlugins(piniaStore, id);
};

/**
 * 初始化pinia的插件
 * @param {*} pinia
 * @param {Array<Function>} pinia.plugins 插件列表
 * @param {string} id 仓库id
 */
const initPiniaPlugins = (pinia, id) => {
  const plugins = pinia.plugins;
  const store = pinia.store.get(id);
  plugins.forEach((plugin) => {
    const res = plugin({ store });
    if (res) {
      Object.assign(store, res);
    }
  });
};
