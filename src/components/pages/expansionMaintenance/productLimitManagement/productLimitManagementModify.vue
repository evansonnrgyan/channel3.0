<!-- 产品范围设置 -->
<template>
    <div ref="productLimit" class="product-limit-management expension-mainterance">
        <div class="product-limit-baseInfo">
            <div class="product-limit-title">
                店面信息
            </div>
            <div class="info-content">
                <storeInfo :pid="pid" :channelId="channelId"></storeInfo>
            </div>
        </div>

        <div class="product-limit-self">
             <div class="product-limit-title">
                 自营产品范围
             </div>
             <div class="info-content">
                 <Transfer
                         :data="data1"
                         :target-keys="targetKeys1"
                         filterable
                         :operations="['撤销','加入']"
                         :list-style="listStyle"
                         @on-change="handleChange1"></Transfer>
             </div>
         </div>

        <div class="product-limit-platform">
            <div class="product-limit-title">
                平台产品范围
            </div>
            <div class="info-content" style="padding:0 0 180px 37px">
                <Transfer
                        :data="data2"
                        :target-keys="targetKeys2"
                        filterable
                        :operations="['撤销','加入']"
                        :list-style="listStyle"
                        @on-change="handleChange2"></Transfer>
            </div>
        </div>
        <poFooter>
            <Button :loading="bloading" type="primary" @click="submitProductLimit">提交</Button>
        </poFooter>
        <Spin fix v-if="spinShow"></Spin>
    </div>
</template>
;
<script>
    export default {
        name: "",
        data() {
            return {
                bloading:false,
                flag1: true,
                flag2: true,
                spinShow: false,
                propParams: {},
                pid:"",
                channelId:"",
                data1: [],
                targetKeys1: [],
                targetList1: [],
                data2: [],
                targetKeys2: [],
                targetList2: [],
                listStyle: {
                    width: '500px',
                    height: '400px'
                }
            }
        },
        methods: {
            getMockData1() {

                let params = {
                    "channelId": this.propParams.channelId,
                    "productSource": "0"
                };

                return new Promise((resolve, reject)=>{
                    this.$http.post("/productScopeController/queryAlixProductScope", params).then(resp=>{
                        if(resp.data.success){
                            this.data1 = resp.data.data.map(item => {
                                item.key = item.productCode;
                                item.label = item.productName;
                                return item;
                            });

                            this.returnDatas("0", (data) => {

                                this.data1 = [...this.data1, ...data];


                                let hash = {};
                                this.data1 = this.data1.reduce(function(item, next) {
                                    hash[next.productCode] ? '' : hash[next.productCode] = true && item.push(next);
                                    return item
                                }, [])

                                this.targetKeys1 = data.map(item => {
                                    return item.productCode
                                });
                                this.targetList1 = data;
                                resolve(this.targetList1);
                            })
                        }
                    })
                })

                return this.$promise({
                    url: "/productScopeController/queryAlixProductScope",
                    params: params,
                    success:(resp)=>{
                        this.data1 = resp.data.data.map(item => {
                            item.key = item.productCode;
                            item.label = item.productName;
                            return item;
                        });
                        this.returnDatas("0", (data) => {
                            this.data1 = [...this.data1, ...data];
                            this.targetKeys1 = data.map(item => {
                                return item.productCode
                            });
                            this.targetList1 = data;
                        })
                    }
                });
            },
            handleChange1(newTargetKeys) {
                let selectedArr = [];
                debugger
                this.data1.map(item => {
                    newTargetKeys.map(items => {
                        if (item.productCode === items) {
                            selectedArr.push(item)
                        }
                    })
                });

                this.targetKeys1 = newTargetKeys;
                this.targetList1 = selectedArr;
            },
            getMockData2() {

                let params = {
                    "channelId": this.propParams.channelId,
                    "productSource": "1"
                };
                this.bloading = true;
                return this.$promise({
                    url: "/productScopeController/queryOAProductScope",
                    params: params,
                    success:(resp)=>{
                        this.data2 = resp.data.data.map(item => {
                            item.key = item.productCode;
                            item.label = item.productName;
                            return item;
                        });
                        this.returnDatas("1", (data) => {
                            this.data2 = [...this.data2, ...data];
                            this.targetKeys2 = data.map(item => {
                                return item.productCode
                            });

                            let hash = {};
                            this.data2 = this.data2.reduce(function(item, next) {
                                hash[next.productCode] ? '' : hash[next.productCode] = true && item.push(next);
                                return item
                            }, [])


                            this.targetList2 = data;
                            this.bloading = false;
                        })
                    }
                });
            },
            handleChange2(newTargetKeys) {
                let selectedArr = [];

                this.data2.map(item => {
                    newTargetKeys.map(items => {
                        if (item.productCode === items) {
                            selectedArr.push(item)
                        }
                    })
                });

                this.targetKeys2 = newTargetKeys;
                this.targetList2 = selectedArr;
            },
            submitProductLimit() {

                let _this = this;
                this.bloading = true;
                let params = {
                    "channelId": this.propParams.channelId,
                    "0": function () {
                        let paramsArr = [];
                        _this.targetList1.map(item => {
                            paramsArr.push({
                                code: item.productCode,
                                name: item.productName
                            });
                        });

                        let obj = {};

                        paramsArr = paramsArr.reduce((cur,next) => {
                            obj[next.code] ? "" : obj[next.code] = true && cur.push(next);
                            return cur;
                        },[]);

                        return paramsArr;
                    }(),
                    "1": function () {
                        let paramsArr = [];
                        _this.targetList2.map(item => {
                            paramsArr.push({
                                code: item.productCode,
                                name: item.productName
                            });
                        });

                        let obj = {};

                        paramsArr = paramsArr.reduce((cur,next) => {
                            obj[next.code] ? "" : obj[next.code] = true && cur.push(next);
                            return cur;
                        },[]);

                        return paramsArr;
                    }(),
                };

                this.$http.post('/productScopeController/saveProductScope', params).then(resp => {
                    if (resp.data.success) {
                        this.$Message.success("保存成功");
                        this.$bus.$emit('productLimitManagementIndex', {
                            id: 'productLimitManagementIndex',
                            isShow: true,
                            name: '产品范围管理',
                            closeName: 'productLimitManagementModify'
                        });
                    } else {
                        //this.$Message.error(resp.data.errorMessage || "保存失败");
                    }
                    this.bloading = false;
                })
            },
            //返显
            returnDatas(num, fn) {

                let params = {
                    "channelId": this.propParams.channelId,
                    "productSource": '' + num
                }

                this.$http.post('/productScopeController/queryProductScopeListById', params).then(resp => {
                    if (resp.data.success) {
                        let data = [];
                        if (num === "0" && resp.data.data.length > 0) {
                            data = resp.data.data.map(item => {
                                item.key = item.productCode;
                                item.label = item.productName || item.productCode;
                                return item;
                            });

                        } else if (num === "1" && resp.data.data.length > 0) {
                            data = resp.data.data.map(item => {
                                item.productCode;
                                item.key = item.productCode;
                                item.label = item.productName || item.productCode;
                                return item;
                            });
                        }
                        fn && fn(data);
                    } else {
                        //this.$Message.error(resp.data.errorMessage || "保存失败");
                    }
                })
            }
        },
        mounted() {
            this.$nextTick(()=>{
                this.propParams = Object.assign({}, this.$attrs.params);

                console.log(this.propParams, 'this.propParams');
                this.channelId = this.propParams.channelId;
                this.pid = this.propParams.shopId;
            });

            Promise.all([this.getMockData1(), this.getMockData2()]).then((resp) => {

            console.log(resp, '多异步请求');
            this.bloading = false;
            })

            /*Promise.all([this.getMockData2()]).then((resp) => {

                console.log(resp, '多异步请求');
            })*/


        }
    }
</script>

<style lang="less" scoped>
    .product-limit-management {
        position: relative;
        margin: 50px 20px 20px;
        padding: 20px;
        background: #fff;
        width:1200px;
    }

    .product-limit-title {
        padding: 0 0 0 30px;
        font-size: 12px;
        font-weight: bold;
        color: #333;
        &::before {
            display: inline-block;
            content: "";
            width: 4px;
            height: 10px;
            background: #000;
        }
    }

    .info-content {
        padding: 0 0 0 37px;
        .info-title {
            font-size: 16px;
            color: #333;
            font-weight: bold;
            line-height: 21px;
            span.info-subtitle {
                display: inline-block;
                padding: 1px 3px;
                border-radius: 4px;
                border: 1px solid #F4B9A0;
                color: #F4B9A0;
                font-size: 12px;
                line-height: 18px;
            }
        }
        .info-address {
            padding: 10px 0 0;
            font-size: 12px;
            line-height: 18px;
        }
        .info-name {
            padding: 5px 0 0;
            font-size: 12px;
            line-height: 18px;
        }
    }

    .element-fixed-bottom-scroll {
        position: fixed;
        bottom: 0px;
        width: 100%;
        z-index: 999999;
        margin: 0;
        left: 200px;
    }
</style>
