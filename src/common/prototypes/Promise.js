/**
 * 扩展原生Promise对象
 */

/**
 * 最后一步执行
 * @param {回调函数，正常时传入data，异常时传入err}} callback 
 * @returns 
 */
Promise.prototype.finally = function (callback) {
    'use strict';
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback(value)),
        err => P.resolve(callback(err))
    );
};

/**
 * 在执行promise之前调用
 * @param {回调函数} callback 
 * @returns 
 */
Promise.prototype.before = function (callback) {
    'use strict';
    // let P = this.constructor;
    return this.then(
        value => {
            callback();
            return this;
        },
        err =>{
            callback();
            return this;
        });
};
