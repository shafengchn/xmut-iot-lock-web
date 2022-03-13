/**
 * 扩展原生的Array
 */

/**
 * 数组是否包含某一元素
 * @param {元素} obj 
 * @returns true or false
 */
Array.prototype.contains = function (obj) {
    let index = this.length;
    if (index==0) return false;
    if (obj instanceof Array) {
        let objIndex = obj.length;
        while(objIndex--) {
            if( ! this.contains(obj[objIndex]) ) return false;
        }
        return true;
    } else {
        
        while (index--) {
            if (this[index] === obj) {
                return true;
            }
        }
        return false;
    }
};


/**
 * 根据索引删除一个元素
 * @param {索引} index 
 * @returns 删除的元素
 */
Array.prototype.deleteByIndex = function (index) {
    return this.splice(index,1);
}

/**
 * 适用于对象数组，根据传入的键判断是否相等，删除相等的元素，
 *   例如删除id为1的元素：
 *   [].removeByKey("id", 1);
 * 
 * @param {键} key 
 * @param {值} id 
 * @returns 删除的元素
 */
Array.prototype.removeByKey = function (key,id) {
    for (let i=0;i<this.length;i++) {
        if(this[i][key] && this[i][key]==id) {
            return this.deleteByIndex(i)
        }
    }
}

/**
 * 删除数组内第一个相同的值
 * @param {值} data 
 * @returns 删除的元素
 */
Array.prototype.remove = function (data) {
    for (let i=0;i<this.length;i++) {
        if(this[i]==data) {
            return this.deleteByIndex(i);
        }
    }
}

/**
 * 向数组特定位置插入一个值
 * @param {索引} index 
 * @param {值} data 
 * @returns 修改后的数组
 */
Array.prototype.insert = function (index, data) {
    this.splice(index,0,data);
    return this;
}

/**
 * 替换指定索引位置的数据
 * @param {索引} index 
 * @param {值} data 
 * @returns 未替换前的数组
 */
Array.prototype.replace = function (index,data) {
    let oldData = this.splice(index, 1);
    this.splice(index, 0, data);
    return oldData;
}

/**
 * 适用于对象数组，替换指定键的数据
 *   例如替换id为1的数据为新数据
 *   [].replaceByKey("id", 1, {id:"1",name:'李四'})
 * @param {键} keyName 
 * @param {值} keyValue 
 * @param {数据} data 
 */
Array.prototype.replaceByKey = function (keyName, keyValue, data) {
    for(let i=0;i<this.length;i++) {
        if(this[i][keyName]==keyValue) {
            this.replace(i, data)
        }
    }
}

/**
 * 提取数组中的数值并组成新数据
 * @returns 转换后的数据
 */
Array.prototype.parseNumber=function(){
    let newArr = new Array();
    this.map(val=>{
        if(Number(val)){
            newArr.push(Number(val));
        }
    })
    return newArr;
}

/**
 * 适用于Number数组，排序
 * @returns 排序后的数组
 */
Array.prototype.sortInt=function(){
    return this.sort((a,b) => a-b );
}

/**
 * 向数组内比对添加某一对象
 *  例如：如果数组中包含1，则添加2
 *  [].comparePush(2, item => item == 1 );
 * @param {*} data 
 * @param {*} compare 
 */
Array.prototype.comparePush = function(data,compare = loopItem =>{ return false; }){
    let index = this.length;
    let canPush = false;
    if(compare.length==0) {
        canPush = compare();
    }
    while (index--) {
        if(compare(this[index])){
            canPush = true;
            break;
        }
    }
    if(canPush) this.push(data);
}

/**
 * 向数组内比对连接一个新数组
 * @param {*} arr 
 * @param {*} compare 
 */
Array.prototype.compareConcat = function(arr, compare = item => !this.contains(item)){ //连接数组,默认比较方法为不包含当前项的就放入
    arr.map(item => {
        if (compare(item)) this.push(item);
    });
}

/**
 * 适用于对象数组，获取数组中特定键的对象
 *   例如获取id为1的数据
 *   [].getByKey("id", 1, "1")
 * @param {键} keyName
 * @param {值} keyValue 
 * @param {默认值} defaultObj 
 * @returns 
 */
Array.prototype.getByKey = function(keyName, keyValue, defaultObj) {
    
    for(let i=0;i<this.length;i++) {
        if(this[i][keyName]==keyValue) return this[i];
    }
    return defaultObj;
}

/**
 * 统计某个元素的出现次数
 * @param {filter} func 
 * @returns 
 */
Array.prototype.count = function(func = () => true) {
    return this.filter(func).length;
}

/**
 * 适用于Number数组，对数组元素求和
 * @param {每个元素遍历一次，可修改数值}} func 
 * @returns 
 */
Array.prototype.sum = function(func=(i)=>{return i}) {
    let sum = 0;
    this.forEach(item=>{
        let num = func(item);
        if(num instanceof Number) {
            sum += num;
        }
    })
    return sum;
}