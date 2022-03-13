import Vue from "vue";

/**
 * 将树形数据转换为Tree组件对应的数据
 * @param {需要转换的数据} data 
 * @param {title取对象的哪个内容} titleKey 
 * @param {children取对象的哪个内容} childrenKey 
 * @param {附加的key} metaKey 
 * @returns 
 */
export const parseTree = (data, titleKey="title", childrenKey="children", metaKey=[] ) => {
    return data.map(item=>{
        let hasChildren = ( item[childrenKey] && item[childrenKey].length > 0);
        let node = {
            title: item[titleKey],
            expand: hasChildren,
            children: hasChildren ? parseTree(item[childrenKey], titleKey, childrenKey, metaKey) : []
        };
        metaKey.forEach(key => {
            node[key] = item[key];
        })
        return node;
    })
}

/**
 * 选中树的checked
 * @param {树形数据} data 
 * @param {要根据对象的哪个属性判断} key 
 * @param {属性值列表} values 
 * @param {孩子节点的key} childrenKey 
 */
export const checkTree = (data, key = "nodeKey", values = [], childrenKey = "children") => {
    for(let i = 0; i< data.length; i++) {
        if(data[i][childrenKey] && data[i][childrenKey].length > 0) {
            // 父节点不选中
            Vue.set(data[i], 'checked', false);
            checkTree(data[i][childrenKey], key, values, childrenKey);
        } else {
            Vue.set(data[i], 'checked', values.contains(data[i][key]));
        }
    }
}

/**
 * 将路由数据转换为菜单数据
 * @param {路由数据} data 
 * @param {根据对象的哪个树形来判断是否需要转换} trueKey
 */
export const parseMenu = (data, trueKey="isShow") => {
    let arr = [];
    data.forEach(item=>{
        let child = { ...item };
        if(child[trueKey]) {
            if(item.children && item.children.length) {
                child.children = parseMenu(item.children, trueKey);
            } else {
                child.children = [];
            }
            arr.push(child); 
        }
    })
    return arr;
}