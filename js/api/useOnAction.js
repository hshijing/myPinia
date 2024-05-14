import { subscriptions } from "../utils/utils";
import {actionsList} from '../global'

/**
 * 监听actions里的方法执行以及错误捕获
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} pinia pinia实例
 * @param {string} id 仓库id
 */
export const useOnAction = (pinia, id) => {
  return (cb) => {
    subscriptions.add(actionsList, cb);
  };
};
