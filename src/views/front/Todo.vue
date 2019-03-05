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
                                <el-button type="danger" size="mini" style="width:140px;margin-left:0;">注销</el-button>
                            </div>
                            <div slot="reference" style="cursor: pointer">Lin</div>
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
                                        <span>{{ props.row.content }}</span>
                                    </el-form-item>
                                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="modifyTodo(props.row,props.$index)">修改</el-button>
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
                                <el-checkbox v-model="scope.row.status" @change="handleTodo(scope.row,scope.$index)"></el-checkbox>
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
                                        <span>{{ props.row.content }}</span>
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
                                <el-checkbox v-model="scope.row.status" :disabled="scope.row.status"></el-checkbox>
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
                <el-form-item label="到期时间" :label-width="formLabelWidth">
                    <el-date-picker style="width: 100%"
                            v-model="form.deadTime"
                            type="datetime"
                            placeholder="选择过期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTodo">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改待办" :visible.sync="dialogFormVisible" width="35%">
            <el-form :model="modifyForm">
                <el-form-item label="标题" :label-width="formLabelWidth">
                    <el-input v-model="modifyForm.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="modifyForm.content" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="到期时间" :label-width="formLabelWidth">
                    <el-date-picker style="width: 100%"
                                    v-model="modifyForm.deadTime"
                                    type="datetime"
                                    placeholder="选择过期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTodo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {Table,TableColumn,Button,Dialog,Form,FormItem,Input,DatePicker,Checkbox,MessageBox,Message,Popover} from "element-ui"
    import dateFormat from 'dateformat';

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
                form: {
                    title:"",
                    content:"",
                    deadTime:""
                },
                modifyForm:{
                    title:"",
                    content:"",
                    deadTime:""
                },
                formLabelWidth: '70px',
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
                                key: 'title',
                            },
                            {
                                title: '发布时间',
                                key: 'publishTime',
                                sortable: true
                            },
                            {
                                title: '完成时间',
                                key: 'finishTime',
                                sortable: true
                            },
                            {
                                title: '到期时间',
                                key: 'deadline',
                                sortable: true
                            }
                        ],
                        data:[
                            {
                                "todoId":"1",
                                "title":"454545",
                                "content":"今天干啥好呢天干啥好呢",
                                "publishTime":"444",
                                "finishTime":"444",
                                "deadline":"45485",
                                "status":false
                            },
                            {
                                "todoId":"2",
                                "title":"sadas",
                                "content":"今天去买台思域吧",
                                "publishTime":"asd",
                                "finishTime":"asd",
                                "deadline":"123456",
                                "status":false
                            },
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
                                key: 'title',
                            },
                            {
                                title: '发布时间',
                                key: 'publishTime',
                                sortable: true
                            },
                            {
                                title: '完成时间',
                                key: 'finishTime',
                                sortable: true
                            },
                            {
                                title: '到期时间',
                                key: 'deadline',
                                sortable: true
                            }
                        ],
                        data:[
                            {
                                "title":"454545",
                                "publishTime":"444",
                                "deadline":"45485",
                                "finishTime":"asd",
                                "status":true
                            },
                            {
                                "title":"sadas",
                                "publishTime":"asd",
                                "deadline":"huah",
                                "finishTime":"asd",
                                "status":true
                            },
                        ]
                    }
                }
            }
        },
        methods:{
            // 格式化时间
            formatDate(dateStr){
                if(dateStr)
                    return dateFormat(new Date(dateStr*1000).getTime(),"mm月dd");
                else return false;
            },
            //打开添加todo的弹窗
            openAddTodoDialog(){
                this.dialogFormVisible = true
            },
            // 添加待办
            addTodo(){
                let arr = [];
                arr["title"] = this.form.title;
                arr["content"] = this.form.content;
                arr["deadline"] = this.formatDate(this.form.deadTime.getTime()/1000);
                arr["status"] = false;
                arr["publishTime"] =  this.formatDate(new Date().getTime()/1000);
                console.log(this.form.deadTime.getTime()/1000);
                this.tableData.todo.data.push(arr);
                this.dialogFormVisible = false;
                this.form.title = "";
                this.form.content = "";
                this.form.deadTime = "";
            },
            //todo变done
            handleTodo(row,index){
                row.status = true;
                this.tableData.todo.data.splice(index,1);
                this.tableData.done.data.push(row);
                this.$forceUpdate()
            },
            // 打开修改todo的弹窗
            modifyTodo(row,index){
                this.dialogFormVisible = true;
                this.modifyForm.title = row.title;
                this.modifyForm.content = row.content;
                this.modifyForm.deadTime = row.deadline;
            },
            // 删除待办
            deleteTodo(row,index){
                MessageBox.confirm('此操作将永久删除该条记录, 是否继续?', '提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableData.todo.data.splice(index,1);
                    Message.success({
                        message: '删除成功!',
                        duration:"1000"
                    });
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
                }).then(() => {
                    this.tableData.done.data.splice(index,1);
                    Message.success({
                        message: '删除成功!',
                        duration:"1000"
                    });
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