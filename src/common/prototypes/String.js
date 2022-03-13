
/**
 * 是否以某个字符串结尾
 * @param {结尾字符串} endStr 
 * @returns 
 */
String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d)
}

/**
 * 生成uuid
 * @param {分割字符}} split 
 * @returns 
 */
String.prototype.uuid = function (split='') {
    return S4()+S4()+split+S4()+split+S4()+split+S4()+split+S4()+S4()+S4();
}
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

/**
 * repleaceAll
 */
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (src, target) {
        
    }
}
