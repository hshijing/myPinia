import { actionsList } from "../global";
import { isPromise, subscriptions } from "../utils/utils";

/**
 * 分布式仓库-> 修正自己actions里的函数this指向
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} store 自己的仓库
 * @param {object} actions 自己的仓库的 actions
 */
export const createStoreActions = (store, actions) => {
  const storeActions = {};
  for (const key in actions) {
    if (!actions.hasOwnProperty(key)) continue;
    //TODO: onAction API 捕获错误以及状态
    storeActions[key] = (...args) => {
      const afterList = [];
      const onErrorList = [];
      let result = null;
      const after = (cb) => afterList.push(cb);
      const onError = (cb) => onErrorList.push(cb);
      // 订阅
      subscriptions.run(actionsList, { after, onError });
      try {
        result = actions[key].apply(store, args);
      } catch (error) {
        subscriptions.run(onErrorList, error);
      }
      //处理actions里的异步函数
      if (isPromise(result)) {
        return result
          .then((res) => {
            return subscriptions.run(afterList, res);
          })
          .catch((err) => {
            subscriptions.run(onErrorList, err);
            return Promise.reject(err);
          });
      }

      subscriptions.run(afterList, result);
      return result;
    };
  }
  return storeActions;
};
