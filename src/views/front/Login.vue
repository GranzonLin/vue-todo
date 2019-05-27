<template>
    <div class="login-container">
        <div class="login-form">
            <h2 class="title"><i><font-awesome-icon icon="calendar-check"/></i>todo</h2>
            <form v-on:submit.prevent>
                <div class="login-input">
                    <input placeholder="账号" v-model="loginForm.account"/>
                    <span></span>
                    <label><font-awesome-icon icon="user"/></label>
                </div>
                <div class="login-input">
                    <input type="password" placeholder="密码" v-model="loginForm.password"/>
                    <span></span>
                    <label><font-awesome-icon icon="lock"/></label>
                </div>
                <button class="button" @click="login">登录</button>
            </form>
        </div>
    </div>
</template>

<script>
    import {Button,Form,FormItem,Input,Message} from 'element-ui'
    import api from '@/Request/api';
    import Request from '@/Request';
    import Jwt from '@/utils/Jwt';
    import qs from 'qs';
    export default {
        name: "Login",
        components:{
            ElButton:Button,
            ElForm:Form,
            ElFormItem:FormItem,
            ElInput:Input,
        },
        data(){
            return{
                loginForm:{
                    account:"",
                    password:""
                }
            }
        },
        methods:{
            async login(){
                if(this.loginForm.account === "" || this.loginForm.password === ""){
                    Message.error({
                        message:"请输入账号或者密码",
                        duration:2000
                    });
                }else {
                    let response;
                    try{
                        response = await this.$axios.post(api.login,qs.stringify({
                            account:this.loginForm.account,
                            password:this.loginForm.password,
                        }))
                    }catch (e) {
                        if(process.env.NODE_ENV === 'development'){
                            console.error(e);
                        }
                        return;
                    }
                    if(Request.handleException(this,response.data)){
                        let token = response.data.data.token;
                        Jwt.setToken(token);
                        Message.success({
                            message:response.data.msg,
                            duration:2000
                        });
                        this.$router.push({name: "Todo"});
                    }else {
                        Message.error({
                            message:response.data.msg,
                            duration:2000
                        });
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>

.login-container{
    width: 100%;
    height: 100%;
    background: #F7F7F7;
    display: flex;
    justify-content: center;

    .login-form{
        padding: 80px;
        width: 350px;
        height: 250px;
        background: #fff;
        display: flex;
        flex-direction: column;
        margin-top: 130px;

        .title{
            color: #99CCCC;
            text-align: center;

            i{
                margin-right: 10px;
            }
        }

        form{

            .login-input{
                position: relative;
                margin-top: 20px;

                input{
                    width: 308px;
                    padding: 15px 0 15px 35px;
                    outline: none;
                    background: #F5F5F5;
                    border: none;
                    color:#777;

                    &:hover ~ label,
                    &:focus ~ label {
                        color: #99CCCC
                    }

                    &:hover ~ span,
                    &:focus ~ span {
                        left: 0;
                        width: 98%;
                    }
                }

                span {
                    position: absolute;
                    display: block;
                    width: 0;
                    left: 50%;
                    border-bottom: 1px solid #99CCCC;
                    transition: all .3s ease;
                }

                label{
                    transition: all .28s cubic-bezier(.4, 0, .2, 1);
                    position: absolute;
                    color: #ddd;
                    top: 12px;
                    left: 12px;
                }
            }

            .button{
                margin-top: 35px;
                width: 343px;
                padding: 12px 0;
                background: #99CCCC;
                text-align: center;
                font-size: 14px;
                color: #fff;
                border: none;
                outline: none;
                border-radius: 20px;
                cursor: pointer;
            }
        }
    }

}

</style>