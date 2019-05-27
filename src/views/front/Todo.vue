<template>
    <div class="list-vue">
        <div class="user">
            <div class="user-info">
                <div class="user-info-title">
                    <span class="icon"><font-awesome-icon icon="th-list"/></span>
                    <h3>TODOTODO</h3>
                </div>
                <div class="user-info-content">
                    <p class="icon"><font-awesome-icon icon="user"/></p>
                    <h3>
                        <el-popover
                                placement="bottom"
                                width="30"
                                trigger="hover">
                            <div style="text-align: center; margin: 0;line-height: 34px;">
                                <el-button type="primary" size="mini" style="width:140px;margin-left:0;">个人中心</el-button>
                                <el-button type="danger" size="mini" style="width:140px;margin-left:0;" @click="logout">注销</el-button>
                            </div>
                            <div slot="reference" style="cursor: pointer">{{userName}}</div>
                        </el-popover>
                    </h3>

                </div>
            </div>
        </div>
        <div class="list-container">
            <div class="todo-list">
                <div class="todo-list-title">
                    <span class="icon"><font-awesome-icon icon="clock"/></span>
                    <h3>待办事项</h3>
                </div>
                <div class="list-table">
                    <el-table
                            :data="tableData.todo.data"
                            tooltip-effect="dark"
                            style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" class="demo-table-expand">
                                    <el-form-item label="待办内容:">
                                        <span>{{ props.row.todo_content }}</span>
                                    </el-form-item>
                                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="openModifyTodoDialog(props.row,props.$index)">修改</el-button>
                                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteTodo(props.row,props.$index)">删除</el-button>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(item,index) in tableData.todo.columns"
                                         :prop="item.key"
                                         :label="item.title"
                                         :type="item.type"
                                         :sortable="item.sortable"
                                         :key="item.key"
                                         :width="item.width?item.width:''"
                                         :align="item.align?item.align:'center'">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                width="100"
                                align="center">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.todo_status" @change="handleTodo(scope.row,scope.$index)"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-top: 15px">
                        <el-button type="primary" @click="openAddTodoDialog()">新建待办</el-button>
                    </div>
                </div>
            </div>
            <div class="todo-list">
                <div class="todo-list-title">
                    <span class="icon"><font-awesome-icon icon="check"/></span>
                    <h3>已办事项</h3>
                </div>
                <div class="list-table">
                    <el-table
                            :data="tableData.done.data"
                            tooltip-effect="dark"
                            style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" class="demo-table-expand">
                                    <el-form-item label="待办内容:">
                                        <span>{{ props.row.todo_content }}</span>
                                    </el-form-item>
                                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteDone(props.row,props.$index)">删除</el-button>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(item,index) in tableData.done.columns"
                                         :prop="item.key"
                                         :label="item.title"
                                         :type="item.type"
                                         :sortable="item.sortable"
                                         :key="item.key"
                                         :width="item.width?item.width:''"
                                         :align="item.align?item.align:'center'">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                width="100"
                                align="center">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.todo_status" :disabled="scope.row.todo_status"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <el-dialog title="新建待办" :visible.sync="dialogFormVisible" width="35%">
            <el-form :model="form">
                <el-form-item label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.content" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTodo">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改待办" :visible.sync="modifyDialogFormVisible" width="35%">
            <el-form :model="modifyForm">
                <el-form-item label="标题" :label-width="formLabelWidth">
                    <el-input v-model="modifyForm.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="modifyForm.content" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modifyDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyTodo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {Table,TableColumn,Button,Dialog,Form,FormItem,Input,DatePicker,Checkbox,MessageBox,Message,Popover} from "element-ui"
    import dateFormat from 'dateformat';
    import Jwt from '@/utils/Jwt'
    import api from '@/Request/api';
    import Request from '@/Request';
    import qs from 'qs';

    export default {
        name: "Todo",
        components:{
            ElTable:Table,
            ElTableColumn:TableColumn,
            ElButton:Button,
            ElDialog:Dialog,
            ElForm:Form,
            ElFormItem:FormItem,
            ElInput:Input,
            ElDatePicker:DatePicker,
            ElCheckbox:Checkbox,
            ElPopover:Popover,
        },
        data(){
            return{
                dialogFormVisible: false,
                modifyDialogFormVisible: false,
                // 新建todo的表单
                form: {
                    title:"",
                    content:""
                },
                // 修改todo的表单
                modifyForm:{
                    todoId:"",
                    title:"",
                    content:""
                },
                formLabelWidth: '70px',

                todoId:"",
                // 用户名
                userName:"",
                // 表格数据
                tableData:{
                    todo:{
                        columns: [
                            {
                                title: '序号',
                                key: 'specialOrder',
                                type:'index',//自动排序
                                width:'80'
                            },
                            {
                                title: '标题',
                                key: 'todo_title',
                            },
                            {
                                title: '发布时间',
                                key: 'todo_publish_time',
                                sortable: true
                            }
                        ],
                        data:[

                        ],
                    },
                    done:{
                        columns: [
                            {
                                title: '序号',
                                key: 'specialOrder',
                                type:'index',//自动排序
                                width:'60'
                            },
                            {
                                title: '标题',
                                key: 'todo_title',
                            },
                            {
                                title: '发布时间',
                                key: 'todo_publish_time',
                                sortable: true
                            },
                            {
                                title: '完成时间',
                                key: 'todo_finish_time',
                                sortable: true
                            }
                        ],
                        data:[]
                    }
                }
            }
        },
        created(){
            this.userName = Jwt.getName();
            this.getTodoList();
            this.getDoneList();
        },
        methods:{
            logout(){
                Jwt.cleanToken();
                this.$router.push({path:'/'})
            },
            // 格式化时间
            formatDate(dateStr){
                if(dateStr)
                    return dateFormat(new Date(dateStr*1000).getTime(),"mm月dd");
                else return false;
            },
            //获取todo列表
            async getTodoList(){
                let response;
                try{
                    response = await this.$axios.get(api.getTodoList)
                }catch (e) {
                    if(process.env.NODE_ENV === 'development'){
                        console.error(e);
                    }
                    return;
                }
                if(Request.handleException(this,response.data)){
                    this.tableData.todo.data = response.data.data;
                    for(let item of this.tableData.todo.data){
                        item.todo_publish_time = this.formatDate(item.todo_create_time)
                    }
                }
            },

            //获取已办列表
            async getDoneList(){
                let response;
                try{
                    response = await this.$axios.get(api.getDoneList)
                }catch (e) {
                    if(process.env.NODE_ENV === 'development'){
                        console.error(e);
                    }
                    return;
                }
                if(Request.handleException(this,response.data)){
                    this.tableData.done.data = response.data.data;
                    for(let item of this.tableData.done.data){
                        item.todo_publish_time = this.formatDate(item.todo_create_time);
                        item.todo_finish_time = this.formatDate(item.todo_finish_time);
                        if(item.todo_status === 1){
                            item.todo_status = true;
                        }
                    }
                }
            },
            //打开添加todo的弹窗
            openAddTodoDialog(){
                this.dialogFormVisible = true
            },
            // 添加待办
            async addTodo(){
                let response;
                try{
                    response = await this.$axios.post(api.addTodo,qs.stringify({
                        todo_title:this.form.title,
                        todo_content:this.form.content,
                    }))
                }catch (e) {
                    if(process.env.NODE_ENV === 'development'){
                        console.error(e);
                    }
                    return;
                }
                if(Request.handleException(this,response.data)){
                    Message.success({
                        message:response.data.msg,
                        duration:2000
                    });
                    this.getTodoList();
                    this.dialogFormVisible = false;
                    this.form.title="";
                    this.form.content="";
                }
            },
            //todo变done
            async handleTodo(row,index){
                if(row.todo_status){
                    let response;
                    try{
                        response = await this.$axios.post(api.finishTodo,qs.stringify({
                            todo_id:row.todo_id
                        }))
                    }catch (e) {
                        if(process.env.NODE_ENV === 'development'){
                            console.error(e);
                        }
                        return;
                    }
                    if(Request.handleException(this,response.data)){
                        Message.success({
                            message:response.data.msg,
                            duration:2000
                        });
                        this.getTodoList();
                        this.getDoneList();
                        this.$forceUpdate()
                    }
                }
            },
            // 打开修改todo的弹窗
            async openModifyTodoDialog(row,index){
                console.log(row);
                this.modifyDialogFormVisible = true;
                this.modifyForm.todoId = row.todo_id;
                this.modifyForm.title = row.todo_title;
                this.modifyForm.content = row.todo_content;

                /**/
            },
            // 修改待办
            async modifyTodo(){
                let response;
                try{
                    response = await this.$axios.post(api.modifyTodo,qs.stringify({
                        todo_id:this.modifyForm.todoId,
                        todo_title:this.modifyForm.title,
                        todo_content:this.modifyForm.content
                    }))
                }catch (e) {
                    if(process.env.NODE_ENV === 'development'){
                        console.error(e);
                    }
                    return;
                }
                if(Request.handleException(this,response.data)){
                    Message.success({
                        message:response.data.msg,
                        duration:2000
                    });
                    this.getTodoList();
                    this.modifyDialogFormVisible = false;
                }
            },
            // 删除待办
            deleteTodo(row,index){
                MessageBox.confirm('此操作将永久删除该条记录, 是否继续?', '提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let response;
                    try{
                        response = await this.$axios.post(api.deleteItem,qs.stringify({
                            todo_id:row.todo_id
                        }))
                    }catch (e) {
                        if(process.env.NODE_ENV === 'development'){
                            console.error(e);
                        }
                        return;
                    }
                    if(Request.handleException(this,response.data)){
                        Message.success({
                            message:response.data.msg,
                            duration:2000
                        });
                        this.getTodoList();
                    }
                }).catch(() => {
                    Message.info({
                        type: 'info',
                        message: '已取消删除',
                        duration:"1000"
                    });
                });
            },
            //删除已完成
            deleteDone(row,index){
                MessageBox.confirm('此操作将永久删除该条记录, 是否继续?', '提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let response;
                    try{
                        response = await this.$axios.post(api.deleteItem,qs.stringify({
                            todo_id:row.todo_id
                        }))
                    }catch (e) {
                        if(process.env.NODE_ENV === 'development'){
                            console.error(e);
                        }
                        return;
                    }
                    if(Request.handleException(this,response.data)){
                        Message.success({
                            message:response.data.msg,
                            duration:2000
                        });
                        this.getDoneList();
                    }
                }).catch(() => {
                    Message.info({
                        type: 'info',
                        message: '已取消删除',
                        duration:"1000"
                    });
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .list-vue{
        width: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;

        .user{
            position: fixed;
            width: 100%;
            height: 80px;
            background: #99CCCC;
            z-index: 20;
            display: flex;
            justify-content: center;

            .user-info{
                width: 60%;
                min-width: 1000px;
                height: 100%;
                display: flex;
                color: #666;
                font-size: 16px;

                .user-info-title{
                    position: relative;
                    z-index: 21;
                    flex: 1;
                    display: flex;
                    align-items: center;

                    span{
                        position: absolute;
                        left: 22px;
                    }

                    h3{
                        position: absolute;
                        left: 40px;
                    }
                }

                .user-info-content{
                    position: relative;
                    width: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    p{
                        width: 32px;
                        height: 32px;
                        background: #fff;
                        border-radius: 50%;
                        right: 0;
                        margin-right: 7px;
                        text-align: center;
                        line-height: 32px;
                        color: #99CCCC;
                    }

                    h3{
                        font-weight: 500;
                    }

                }
            }
        }

        .list-container{
            min-width: 1000px;
            position: relative;
            width: 60%;
            height: 100%;
            background: #e9e9e9;
            margin-top: 80px;

            .todo-list{

                .todo-list-title{
                    width: 100%;
                    height: 60px;
                    border-bottom: 1px solid #666666;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    color: #666666;

                    .icon{
                        position: absolute;
                        margin-left: 23px;
                    }

                    h3{
                        margin-left: 43px;
                    }
                }

                .list-table{
                    padding: 19px;

                    .list{
                        background: #fff;
                        display: flex;
                        padding: 5px;

                        .list-left{
                            flex: 1;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }

                        .list-right{
                            width: 150px;
                            display: flex;
                            justify-content: center;
                        }
                    }
                }
            }

        }

    }

</style>
