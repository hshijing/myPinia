import { isRef } from "vue";
import { actionsList } from "../global";

/**
 **区分当前创建的仓库是以什么方式创建的   options API||Composition API(setup)
 *@author HuangXinDian <2097294126@qq.com>
 *@param {Array<any>} args 创建store传入的参数
 * @returns {Object} 返回id,setup,options
 */
export const formatArgs = (args) => {
  let id = null;
  let options = null;
  let setup = null;
  //只传入一个对象,id写在对象里的情况
  if (args.length === 1 && typeof args[0] === "object") {
    id = args[0].id;
    options = args[0];
  } else {
    //传入两个参数
    id = args[0];
    isFunction(args[1]) ? (setup = args[1]) : (options = args[1]);
  }
  return {
    id,
    setup,
    options,
  };
};

export const isFunction = (value) => typeof value === "function";

/**
 * 判定当前传入的参数是否是经过vue代理的computed属性
 * @param {*} value
 * @returns {Boolean}
 */
export const isComputed = (value) => !!(isRef(value) && value.effect);

const isObject = (value) => {
  return (
    value &&
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
};
/**
 * 深度合并对象，以用户传入的配置为主
 * @author HuangXinDian <2097294126@qq.com>
 * @param {Object} userOptions 用户传入的配置
 * @param {Object} defaultOptions 默认配置
 */
export const mergeObject = (userOptions, defaultOptions) => {
  for (const key in userOptions) {
    if (!Object.hasOwnProperty.call(userOptions, key)) continue;

    const oldValue = defaultOptions[key];
    const newValue = userOptions[key];

    if (isObject(oldValue) && isObject(newValue)) {
      defaultOptions[key] = mergeObject(newValue, oldValue);
    } else {
      defaultOptions[key] = newValue;
    }
  }
};

/**
 * 简单的发布订阅模式
 * @author HuangXinDian <2097294126@qq.com>
 * @param {Array<Function>} list  订阅者列表
 * @param {Function} cb 订阅者
 * @param {Array<any>} args 发布时传入的参数
 * @returns {void}
 */
export const subscriptions = {
  add(list, cb) {
    list.push(cb);
  },
  run(list, ...args) {
    list.forEach((cb) => cb(...args));
  },
};

export const isPromise = (value) => {
  return value && typeof value.then === "function";
};


