import { effectScope, ref } from "vue";
import { storeProvideKey } from "../global";
/* pinia实例的挂载属性 */
//仓库集合
const store = new Map();
//作用域->处理响应式数据以及事件监听
const scope = effectScope();

//所有仓库的state数据
const state = scope.run(() => ref({}));
//pinia插件列表
const plugins = [];

/**
 * 创建一个Pinia实例
 * @returns {Object}  Pinia实例数据
 *
 */
export const createPinia = () => {
  //返回this以便支持链式调用
  function use(cb) {
    plugins.push(cb);
    return this;
  }
  function install(app) {
    app.provide(storeProvideKey, this);
    return this
  }
  return {
    store,
    scope,
    state,
    plugins,
    install,
    use,
  };
};
