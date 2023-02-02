export type namespaced = string;

export interface storageOpts {
 /** 命名空间  `rs-namespaced` */
 namespaced: namespaced;
 /** 缓存状态 */
 memory: object;
}