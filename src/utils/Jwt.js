const AUTH_TOKEN = 'AUTH_TOKEN';

export default {
    /**
     * 设置 token 用于发送请求
     * @param {string} token
     */
    setToken(token){
        localStorage.setItem('AUTH_TOKEN',`Bearer ${token}`);
    },

    // 删除登录认证token
    cleanToken(){
        localStorage.removeItem('AUTH_TOKEN');
    },

    /**
     * 判断是否已经有 token 了
     * @returns {boolean}
     */
    hasToken(){
        if(localStorage.getItem('AUTH_TOKEN')!==null){
            return true;
        }
        return false;
    },

    /**
     * 获取请求用的 token，如果获取不到将抛出错误
     * @returns {string} token
     */
    getToken(){
        if(!this.hasToken()){
            throw "当前还未登录";
        }
        return localStorage.getItem('AUTH_TOKEN');
    },

    // 读取登录用户的名称
    getName(){
        let token = this.getToken();
        return computePayload(token).userName;
    },


}

function computePayload(token){
    let payload = token.split(".")[1];
    return JSON.parse(atob(payload));

}