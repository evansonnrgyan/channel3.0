<template>
    <div class="more-selections">
        <Row>
            <Col span="8">
                <Row>
                    <span>渠道科目</span>
                    <div class="input-width margin-L-8 inline-block">
                            <Select
                                    v-model.trim="more.firstSubjectId"
                                    @on-change="change_first"
                                    placeholder="点击下拉框" style="width:48%">
                                <Option v-for="item in firstSubjectList" :value="item.itemCode" :key="item.id">{{item.itemName}}</Option>
                            </Select>
                            <Select v-model.trim="more.secondSubjectId" multiple placeholder="二级多选" style="width:48%; margin-left: 6px;">
                                <Option v-for="item in secondSubjectList" :value="item.itemCode" :key="item.id">{{ item.itemName }}
                                </Option>
                            </Select>
                    </div>
                </Row>
            </Col>
            <Col span="8">
                <span>业务类型</span>
                <Select v-model.trim="more.busiType" multiple placeholder="初始为空下拉多选" class="input-width margin-L-8">
                    <Option value="01300000" key="01300000">消费贷</Option>
                    <Option value="0130000100000" key="0130000100000">车抵贷</Option>
                    <Option value="0130000200000" key="0130000200000">库存融资</Option>
                    <Option value="0130000300000" key="0130000300000">联合贷</Option>
                    <Option value="0130000500000" key="0130000500000">经营性租赁</Option>
                </Select>
            </Col>
            <Col span="8">
                <span>合作项目</span>
                <Input v-model.trim="more.cooperationName" placeholder="按关键字查询" class="input-width margin-L-8"></Input>
            </Col>
        </Row>

        <Row>
            <Col span="8">
                <span>店面省市</span>
                <Cascader v-model.trim="more.address" :data="loadProvinceDataList" :load-data="loadCityList"
                              :render-format="format" @on-change="handlerSelected" class="input-width margin-L-8 inline-block"></Cascader>
                
            </Col>
            <Col span="8">
                <span style="margin-left:-12px">所属分公司</span>
                <Input v-model.trim="more.branchOffice" placeholder="按关键字查询" class="input-width margin-L-8"></Input>
            </Col>
            <Col span="8">
                <span style="margin-left:-24px">租赁代理等级</span>
                <Select v-model.trim="more.agentLevel" placeholder="不限" class="input-width margin-L-8">
                    <Option v-for="item in agentLevelList" :value="item.itemCode" :key="item.id">{{ item.itemName
                        }}
                    </Option>
                </Select>
            </Col>
        </Row>

        <Row>
            <Col span="8">
                <span>负责员工</span>
                <Input v-model.trim="more.employeee" placeholder="请输入负责员工" class="input-width margin-L-8"></Input>
            </Col>
            <Col span="8">
                <span>车辆类型</span>
                <Select v-model.trim="more.carType" placeholder="不限" class="input-width margin-L-8">
                    <Option v-for="item in carTypeList" :value="item.itemCode" :key="item.id">{{ item.itemName}}</Option>
                </Select>
            </Col>
            <Col span="8">
                <span>车辆来源</span>
                <Select v-model.trim="more.carSource" placeholder="不限" class="input-width margin-L-8">
                    <Option v-for="item in carSourceList" :value="item.itemCode" :key="item.id">{{ item.itemName}}</Option>
                </Select>
            </Col>
        </Row>

        <Row>
            <Col span="8">
                <span>合作开始</span>
                <DatePicker @on-change="startTimeFn" :value="more.startTime" type="daterange" split-panels
                                placeholder="合作开始时间" class="input-width margin-L-8"></DatePicker>
            </Col>
            <Col span="8">
                <span>合作结束</span>
                <DatePicker @on-change="endTimeFn" :value="more.endTime" type="daterange" split-panels
                            placeholder="合作结束时间" class="input-width margin-L-8"></DatePicker>
            </Col>
            <Col span="8">
                <span>特殊状态</span>
                <Select v-model.trim="more.specialStatus" placeholder="不限" class="input-width margin-L-8">
                    <Option value="" key="0">不限</Option>
                    <Option value="1" key="1">无人监管</Option>
                </Select>
            </Col>
        </Row>

        <Row>
            <span>当前状态</span>
            <RadioGroup v-model.trim="more.status" type="button" class="margin-L-8">
                <Radio label="050200000">合作中</Radio>
                <Radio label="050200001">已停用</Radio>
                <Radio label="050200002">已退网</Radio>
                <Radio label="050200006">已到期</Radio>
                <Radio label="">不限</Radio>
            </RadioGroup>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            value: {
                type: Object,
                default: {}
            },
        },
        watch: {
            value:{
                handler:function(val){
                    if(Object.keys(val).length===0){

                        this.more = {
                            firstSubjectId: "",
                            secondSubjectId: [],
                            busiType: [],
                            cooperationName: "",
                            address: [],
                            addressIds: [],
                            branchOffice: "",
                            agentLevel: "",
                            employeee: "",
                            carType: "",
                            carSource: "",
                            startTime: [],
                            endTime: [],
                            specialStatus: "",
                            status: ""
                        }
                        console.log(this.more ,'重置操作');
                    }
                },
                deep:true
            },
            more: {
                handler: function (newVal) {
                    this.$emit('update:value', newVal);
                },
                deep: true
            }
        },
        data() {
            return {
                loading1: false,
                firstSubjectList: [],
                secondSubjectList: [],
                businessTypeList: [],
                loadProvinceDataList: [],
                agentLevelList: [],
                carTypeList: [],
                carSourceList: [],
                options1: [],

                form: {},
                model2: "",
                loadProvince: "",
                more: {
                    // 一级科目
                    firstSubjectId: "",
                    // 二级科目
                    secondSubjectId: [],
                    // 业务类型
                    busiType: [],
                    // 合作项目
                    cooperationName: "",
                    //省市
                    address: [],
                    addressIds: [],
                    //所属分公司
                    branchOffice: "",
                    //租赁代理等级
                    agentLevel: "",
                    //负责员工
                    employeee: "",
                    //车辆类型
                    carType: "",
                    //车辆来源
                    carSource: "",
                    // 开始时间范围
                    startTime: "",
                    // 结束时间范围
                    endTime: "",
                    //特殊状态
                    specialStatus: "",
                    //当前状态
                    status: "",//"050200000"

                }


            }
        },
        methods: {
            // 一级科目
            getFirstSubjectList() {
                this.firstSubjectList = [];
                this.$http.get('/dict/getSubGroup?dictGroupCode=0497').then(resp => {
                    if (resp.data.success) {
                        this.firstSubjectList = resp.data.data;
                    }
                })
            },
            change_first(data) {
                this.more.secondSubjectId=[];
                this.getSecondSubjectList(data);
                console.log(data, '选择的一级科目');
            },
            //二级科目
            getSecondSubjectList(firstValue) {
                this.secondSubjectList = [];
                this.$http.get('/dict/getDict?itemCode=' + firstValue).then(resp => {
                    if (resp.data.success) {
                        this.secondSubjectList = resp.data.data
                    }
                })
            },
            // 省
            loadProvinceData() {
                this.loadProvinceData = [];

                this.$http.post("/api/basicRegion/getProvinces").then((resp) => {
                    if (resp.data.success) {
                        let data = resp.data.data;
                        data.map(item => {
                            this.loadProvinceDataList.push({
                                value: item.regionId,
                                label: item.fullName,
                                children: [],
                                level: item.level,
                                loading: false
                            })
                        })
                    }
                    ;
                })
            },
            // 市
            loadCityList(item, callback) {
                console.log(item)
                item.loading = true;
                this.$http.get("/api/basicRegion/getSubRegions?regionId=" + item.value).then((resp) => {
                    if (resp.data.success) {
                        let data = resp.data.data;
                        item.children = [];
                        data.map(elem => {
                            item.children.push({
                                value: elem.regionId,
                                label: elem.fullName,
                            })
                        })
                        item.loading = false;
                        callback();
                    }
                    ;
                })
            },
            // 租赁代理等级
            getAgentLevelList() {
                this.$http.get('/dict/getDict?itemCode=0504').then(resp => {
                    if (resp.data.success) {
                        this.agentLevelList = resp.data.data;
                    }
                })
            },
            // 车辆类型
            getCarTypeCList() {
                this.$http.get('/dict/getDict?itemCode=0495').then(resp => {
                    if (resp.data.success) {
                        this.carTypeList = resp.data.data;
                    }
                })
            },
            // 车辆来源
            getCarSource() {
                this.$http.get('/dict/getDict?itemCode=0494').then(resp => {
                    if (resp.data.success) {
                        this.carSourceList = resp.data.data;
                    }
                })
            },
            startTimeFn(data) {
                console.log(data);
                this.more.startTime = data;
            },

            endTimeFn(data) {
                console.log(data);
                this.more.endTime = data;
            },
            format(label) {
                return label.join(' - ');
            },
            handlerSelected(value, selectedData) {

                this.more.addressIds = selectedData.map(item => {
                    return item.value
                }).join(',');
                this.more.address = value;

            },
            changeCompany() {

            },
            remoteMethod1(query) {
                if (query !== '') {
                    this.loading1 = true;

                    this.handleTime = new Date().getTime();

                    setTimeout(() => {
                        if (new Date().getTime() - this.handleTime >= 500) {
                            this.$http.post("/tbMultipleNode/queryBranchCompany?nodeName=" + query).then((resp) => {
                                if (resp.data.success) {
                                    this.loading1 = false;
                                    this.options1 = resp.data.data;
                                }
                                ;
                            })
                        }
                    }, 500)

                } else {
                    this.options1 = [];
                }
            },
            remoteMethod2(query) {
                if (query !== '') {
                    this.loading2 = true;
                    setTimeout(() => {
                        this.loading2 = false;
                        const list = this.list.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options2 = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.options2 = [];
                }
            }
        },
        mounted() {
            this.getFirstSubjectList();
            this.loadProvinceData();
            this.getAgentLevelList();
            this.getCarTypeCList();
            this.getCarSource();
        }
    }
</script>
