var local = window.localStorage;
// 生成local key
function createLocalKey() {

}

/**
 * 获取本地消息
 * @param {string} key 
 * @param {string} value 
 * @param {string} category 
 */
export function getLocal(category,key) {
    let data = {};
    let result = window.localStorage.getItem(`${category}-${key}`);
    if (typeof result == 'string') {
        try {
            var obj=JSON.parse(result);
            if(obj && typeof obj == 'object' ){
                data = obj;
            }else{
                data = result;
            }
        } catch(e) {
            data = result;
        }
    }
    return data;
}
/**
 * 存储本地消息
 * @param {string} category 
 * @param {string} key 
 * @param {string} value 
 */
export function setLocal(category,key,value) {
    let data ="";
    if(typeof value == "string"){
        data =  value;
    }else{
        data = JSON.stringify(value);
    }
    window.localStorage.setItem(`${category}-${key}`,data);
}

// 清除本地消息
export function cleanLocal() {

}

