import {Message} from 'element-ui'


export default {
    handle(vm,response){
        if(response.code === "0000"){
            return true;
        }else if (response.code === "0004") {
            Message.success({
                message:response.data.msg,
                duration:2000
            });
            this.$router.push({path:'/'})
        }else {
            return false;
        }
    }
}
