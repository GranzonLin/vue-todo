import {Message} from 'element-ui'


export default {
    handle(vm,response){
        if(response.code === "0000000"){
            return true;
        }else if(response.code === "2000002"){
            console.log(response.msg);
            Message.error({
                message:response.msg,
                duration:1000
            });
            vm.$router.push({name:"login"});
            return false;
        }else if(response.code === "2000006"){
            console.log(response.msg);
            Message.error({
                message:response.msg,
                duration:1000
            });
            vm.$router.push({path:"/"});
            return false;
        }
        return false;
    }
}