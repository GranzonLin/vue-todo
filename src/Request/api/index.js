import api from './api';

let url = new Proxy(api,{
    get(target,key){
        if(key in api){
            return `${process.env.VUE_APP_API_HOST}${api[key]}`;
        }else{
            throw new ReferenceError(`api "${key}" does not exist!`);
        }
    }
});

export default url;
