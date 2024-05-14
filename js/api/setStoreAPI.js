import {useDispose} from './useDispose'
import {useOnAction} from './useOnAction'
import {usePatch} from './usePatch'
import {useReset} from './useReset'
import {useSubscribe} from './useSubscribe'

/**
 * 为仓库挂载各种API
 * @author HuangXinDian <2097294126@qq.com>
 * @param {object} piniaStore pinia
 * @param {string} id 仓库id
 * @param {EffectScope} scope effect作用域   
 */
export const setStoreAPI = (piniaStore, id,scope) => {
  const store=piniaStore.store.get(id)
  store.$patch = usePatch(piniaStore, id);
  store.$reset = useReset(piniaStore, id);
  store.$subscribe = useSubscribe(piniaStore, id,scope);
  store.$onAction = useOnAction(piniaStore, id);
  store.$dispose = useDispose(piniaStore, id,scope);
};
