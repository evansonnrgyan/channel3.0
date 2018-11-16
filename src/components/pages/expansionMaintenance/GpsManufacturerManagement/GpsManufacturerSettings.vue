<!--GPS厂商配置-->
<template>
    <div class="gps-manufacturer-settings" style="margin-top:40px">
        <div class="channels-common-body">
            <keep-alive>
                <Tabs :animated="false" @on-click="selectTabId">
                    <TabPane v-for="(item,index) in gpsList" :label="item.key" :key="item.value">
                        <Tree v-if="flag" :ref="'treeNode'+index"
                              :data="index===0?data0:index===1?data1:index===2?data2:index===3?data3:index===4?data4:[]"
                              @on-check-change="checkedNodeEvent"
                              multiple show-checkbox></Tree>
                    </TabPane>
                </Tabs>
            </keep-alive>
        </div>
        <!--<poFooter>
          <Button type="primary" size="large" @click="submitGpsConfig">提交</Button>
        </poFooter>-->
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "gpsManufacturerSettings",
        data() {
            return {
                selectTabIndex: 0,
                treeData: [],
                flag: true,
                gpsList: [],
                data0: [],
                data1: [],
                data2: [],
                data3: [],
                data4: [],
                checkedList: [],
                resultList: {}
            }
        },
        created() {
            this.handleSpinCustom();
            this.$http.post('/gpsPolicyController/getGPSCodeName').then(resp => {
                if (resp.data.success) {
                    if (resp.data.data.length > 0) {
                        this.gpsList = resp.data.data;
                        this.loadProvinceList();

                        this.checkedList.length = this.gpsList.length;
                    } else {
                        this.gpsList = [];
                        //this.$Message.warning("暂无数据");
                    }
                } else {
                    //this.$Message.error(resp.data.errorMessage || "请求错误");
                }

            })
        },
        methods: {
            selectTabId(name) {
                this.selectTabIndex = name;
            },
            checkedNodeEvent() {
                /*this.flag = false;
                this.$nextTick(()=>{
                  this.flag = true;
                })*/
            },
            //获取省份
            loadProvinceList() {

                this.$http.post('/gpsPolicyController/getProvinceInfos').then(resp => {
                    if (resp.data.success) {
                        if (resp.data.data.length > 0) {
                            let arr = resp.data.data.map(item => {

                                item.title = item.fullName;

                                if (item.list && item.list.length > 0) {
                                    item.list.map(items => {

                                        items.title = items.fullName;

                                        items.disableCheckbox = true;
                                        return items;
                                    })
                                }
                                item.children = item.list;
                                item.disableCheckbox = true;
                                return item;
                            });
                            /*
                            *
                            * TODO 全国联动效果
                            *
                            * */

                            this.data0 = _.cloneDeep(arr);
                            this.data1 = _.cloneDeep(arr);
                            this.data2 = _.cloneDeep(arr);
                            this.data3 = _.cloneDeep(arr);
                            this.data4 = _.cloneDeep(arr);

                            console.log(this.data0, 'this.data0 ');

                            this.returnTree();

                        } else {
                            //this.$Message.error('暂无数据');
                        }
                    } else {
                        // this.$Message.error('请求错误');
                    }
                })
            },
            submitGpsConfig() {


                console.log(this.$refs.treeNode.getCheckedNodes());

                return false;

                this.resultList = {};
                this.checkedList.map((item, index) => {
                    this.resultList[this.gpsList[index].value] = {
                        "cityCode": item.join(','),// 市编号
                        "gpsCode": this.gpsList[index].value,//gps厂商编码
                        "gpsName": this.gpsList[index].key,// gps厂商名称
                        "nationwide": "0"
                    }
                })

                console.log(this.resultList)

                let params = this.resultList;

                console.log(JSON.stringify(params));

                this.$http.post('/gpsPolicyController/addGPSRelation', JSON.stringify(params)).then(resp => {
                    if (resp.data.success) {
                        this.$Message.success(resp.data.data || "保存成功");
                    } else {
                        this.$Message.error(resp.data.errorMessage || "保存失败");
                    }
                    ;
                })
            },
            returnTree() {
                this.$http.post('/gpsPolicyController/queryGPSRelation').then(resp => {
                    if (resp.data.success) {
                        this.resultList = resp.data.data;

                        //console.log(this.resultList)

                        this.gpsList.map((item, index) => {
                            Object.keys(this.resultList).forEach(items => {
                                if (item.value === items) {
                                    setTimeout(() => {
                                        this.setTreeNode(index, this.resultList[items]);
                                    }, 0)
                                }
                            })
                        })
                        this.$Spin.hide();
                    }
                })

            },
            setTreeNode(index, returnData) {
                /*
                * @params index tabs索引
                * @params returnData 返显的数据
                */
                console.log(returnData.nationwide, '节点树');
                switch (index) {
                    case 0:
                        this.treeData = this.data0;
                        break;
                    case 1:
                        this.treeData = this.data1;
                        break;
                    case 2:
                        this.treeData = this.data2;
                        break;
                    case 3:
                        this.treeData = this.data3;
                        break;
                    case 4:
                        this.treeData = this.data4;
                        break;
                }

                let cityCodeList = returnData.cityCode?returnData.cityCode.split(','):[];

                this.flag = false;

                this.$nextTick(() => {

                    this.treeData = this.treeData.map(item => {
                        if(returnData.nationwide=="1"){
                            item.checked = true;
                            item.expand = true;
                        }
                        item.children.map(items => {
                            if(returnData.nationwide=="1"){
                                items.checked = true;
                                items.expand = true;
                                item.checked = true;
                                item.expand = true;
                            }else{
                                if (cityCodeList.length > 0) {
                                    cityCodeList.map(itemr => {
                                        if (('' + items.regionId) === itemr) {
                                            items.checked = true;
                                            item.expand = true;
                                        }
                                    })
                                }
                            }
                            return items;
                        })
                        return item;
                    });

                    if(returnData.nationwide=="1"){
                        console.log(this.treeData);
                    }

                    this.flag = true;
                    //console.log(this.treeData);
                })
            },
            handleSpinCustom() {
                this.$Spin.show();
            }
        }
    }
</script>

<style lang="less" scoped>
    .ivu-tree ul li {
        margin: 0;
    }
</style>
