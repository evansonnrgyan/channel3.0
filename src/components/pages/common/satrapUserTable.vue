<!-- 主管用户 -->
<template>
	<div class="">

        <Table :columns="columns" :data="value"></Table>
         
    </div>
</template>

<script>
    export default {
        props: {
            value:{
                type: Array,
                default: [],
            },
            
        },
        data() {
            return {
                columns: [
                    {
                        title: '账号等级',
                        key: 'accountTypeName',
                    },
                    {
                        title: '姓名',
                        key: 'employeeName',
                    },
                    {
                        title: '账号',
                        key: 'userName',
                    },
                    {
                        title: '手机号',
                        key: 'telephone',
                    },
                    {
                        title: '联系邮箱',
                        key: 'email',
                    },
                    {
                        title: '最近登录时间',
                        key: 'latestLoginTime',
                    },
                    {
                        title: '状态',
                        key: 'accountStatusName',
                    },
                ],
            }
        },
        methods: {
          
           
        }

    } 
</script>
<style type="text/css" scoped>
    .content{
    }
    .line{
        line-height: 2.3
    }
    .title{
        font-size: 16px;
        font-weight: bold
    }

</style>



