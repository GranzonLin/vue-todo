<template>
    <div class="list">
        <div class="user">
            <div class="user-info">
                <div class="user-info-title">
                    <span class="icon"><font-awesome-icon icon="th-list"/></span>
                    <h3>TODOTODO</h3>
                </div>
                <div class="user-info-content">
                    <p class="icon"><font-awesome-icon icon="user"/></p>
                    <h3>user</h3>
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
                            ref="multipleTable"
                            :data="tableData.todo.data"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                        <el-table-column v-for="(item,index) in tableData.todo.columns"
                                         :prop="item.key"
                                         :label="item.title"
                                         :type="item.type"
                                         :sortable="item.sortable"
                                         :key="item.key"
                                         :width="item.width?item.width:''"
                                         :align="item.align?item.align:''">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                label="操作"
                                width="100"
                                align="center"
                                :key="'specialAction'">
                            <template slot-scope="scope">
                                <el-button type="text">修改</el-button>
                                <el-button type="text">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-top: 15px">
                        <el-button type="primary" @click="addTodo()">新建待办</el-button>
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
                            ref="multipleTable"
                            :data="tableData.done.data"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                        <el-table-column v-for="(item,index) in tableData.done.columns"
                                         :prop="item.key"
                                         :label="item.title"
                                         :type="item.type"
                                         :sortable="item.sortable"
                                         :key="item.key"
                                         :width="item.width?item.width:''"
                                         :align="item.align?item.align:'center'">
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
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {Table,TableColumn,Button,Dialog,Form,FormItem,Input,DatePicker} from "element-ui"

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
        },
        data(){
            return{
                dialogFormVisible: false,
                form: {
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
                                title: '到期时间',
                                key: 'deadline',
                                sortable: true
                            }
                        ],
                        data:[
                            {
                                "title":"454545",
                                "publishTime":"444",
                                "deadline":"45485"
                            }
                        ]
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
                        data:[]
                    }
                }
            }
        },
        methods:{
            addTodo(){
                this.dialogFormVisible = true
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style lang="less" scoped>
    .list{
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
                width: 1000px;
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
                }
            }

        }

    }

</style>