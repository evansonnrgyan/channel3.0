<!-- 业务标签管理 -->
<template>
    <div class="configuration-policy-package">
        <div class="channels-common-body">
            <div class="channels-common-body-button font-right paddingtop7">
                <div class="float-left"><b>列表总数：{{total}}</b></div>
                <Button type="primary" icon="md-add" size="large" @click="add">添加业务标签</Button>
            </div>
            <Table :loading="loading" :columns="columns" :data="tableData"></Table>
            <Page :total="total" :current="current" :page-size="pageSize" @on-change="change_page" @on-page-size-change="change_page_size" show-total show-sizer show-elevator />
        </div>
    </div>
</template>

<script>
    export default {
        data() {

            return {
                loading: true,
                columns: [{
                    title: '序号',
                    type: 'index',
                    width: 100,
                }, {
                    title: '业务标签名称',
                    key: 'businessModelName',
                }, {
                    title: '自定义说明',
                    key: 'remarks',
                    ellipsis: true,
                    tooltip:true
                }, {
                    title: '更新人',
                    key: 'updatorName',
                }, {
                    title: '最近操作时间',
                    key: 'updateTime',
                }, {
                    title: '操作',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                style: {
                                    color: "#2d8cf0"
                                },
                                on: {
                                    click: () => {
                                        this.setting(params.row.id)
                                    }
                                }
                            }, '设置')
                        ]);
                    }
                }],
                tableData: [],

                total: 0,
                current: 1,
                pageSize: 10,
            }
        },
        methods: {

            // 加载数据
            loadTable() {
                this.loading = true;
                let obj = {
                    current: this.current,
                    rowCount: this.pageSize,
                    businessModelName: ""
                };
                this.$http.post('/businessConfigure/listBusinessConfigure',obj).then( resp=> {
                    this.loading = false;
                    if(resp.data.success) {
                        let data = resp.data.data;
                        this.tableData = data.data;
                        this.total = data.total;
                        this.pageSize = data.pageSize;
                    }
                })
            },

            //添加业务包
            add() {
                this.$bus.$emit("businessManagementAdd", {
                    id: "businessManagementAdd",
                    name: "新增业务包",
                    refresh: true,
                    params: {
                        id: 'no'
                    }
                });
            },

            change_page(c) {
                this.current = c;
                this.loadTable();
            },
            change_page_size(p) {
                this.current = 1;
                this.pageSize = p;
                this.loadTable();
            },

            //设置
            setting(id) {
                this.$bus.$emit("businessManagementEdit", {
                    id: "businessManagementEdit",
                    name: "设置业务包",
                    refresh: true,
                    params: {
                        id: id
                    }
                });
            },
        },
        mounted() {
            this.loadTable();
        }

    }
</script>

<style lang="less" scoped>


 
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .padding5{
    padding:0;
  }
  .paddingtop7{
    padding-top: 7px;
  }
</style>
