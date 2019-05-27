import axios from 'axios'
import Jwt from "@/utils/Jwt";

axios.defaults.timeout = 10000; // 超时时间

//http request 拦截器
axios.interceptors.request.use(
    config => {
        if(Jwt.hasToken()){//判断本地是否存在token，如果存在，则为每个http请求的header都加上token
            config.headers.Authorization = Jwt.getToken();
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
export default axios;