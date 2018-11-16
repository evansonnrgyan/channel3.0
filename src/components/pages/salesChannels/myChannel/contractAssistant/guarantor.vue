<!-- 担保人 -->

<template>
    <div class="guarantor">

        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="144">
            <FormItem label="请选择易鑫签约方" prop="contractValue">
                <Select v-model="formValidate.contractValue" @on-change="changeContractFn" style="width: 600px">
                    <Option v-for="item in contractorList" :value="item.key" :key="item.key">{{ item.title }}</Option>
                </Select>
            </FormItem>
        </Form>

        <commonTitle title="保证人一">
            <Row>
                <Col span="2" class="font-right">企业名称</Col>
                <Col span="22">{{mainName}}</Col>
            </Row>

            <Row>
                <Col span="2" class="font-right">法定代表人</Col>
                <Col span="22">{{legalPersonName}}</Col>
            </Row>

            <Row>
                <Col span="2" class="font-right">地址</Col>
                <Col span="22">{{registeredAddress}}</Col>
            </Row>
        </commonTitle>

        <Divider/>

        <Form ref="personDefault" :model="personDefault" :rules="ruleDefault" :label-width="80">
            <commonTitle title="保证人二"/>
            <Row>
                <FormItem label="企业法人" prop="name">
                    <Col span="24">{{personDefault.name}}</Col>
                </FormItem>
            </Row>

            <Row>

                <Col span="22">
                    <FormItem label="身份证号" prop="card" >
                        <Input v-model.sync="personDefault.card" :maxlength="18" placeholder="身份证号"
                               style="width:400px"/>
                        <limitLength :value="personDefault.card" :max="18"/>
                    </FormItem>
                </Col>
            </Row>

            <Row>

                <Col span="22">
                    <FormItem label="地址" prop="address">
                        <Input v-model.sync="personDefault.address" :maxlength="80" placeholder="地址"
                               style="width:649px"/>
                        <limitLength :value="personDefault.address" :max="80"/>
                    </FormItem>
                </Col>
            </Row>
        </Form>


        <Divider/>

        <Form ref="formDynamic" :model="formDynamic" :label-width="100" style="width: 600px">
            <div
                    v-for="(item, index) in formDynamic.items"
                    v-if="item.status"
                    :key="index">
                <Row>
                    <Col span="6" class="font-right">
                        <commonTitle :title="'保证人' + (item.index+2===3?'三':item.index+2===4?'四':'五')"/>
                    </Col>
                    <Col span="4">
                        <Button type="error" ghost @click="handleRemove(index)" class="delete-button">删除</Button>
                    </Col>
                </Row>
                <FormItem
                        label="保证人"
                        :prop="'items.' + index + '.companyName'"
                        :rules="{required: true, message: '保证人不能为空', trigger: 'blur'}">
                    <Row>
                        <Col span="18">
                            <Input type="text" v-model.trim="item.companyName" :maxlength="10" placeholder="保证人姓名"
                                   style="width: calc(100% - 50px);"></Input>
                            <limitLength :value="item.companyName" :max="10"/>
                        </Col>
                    </Row>
                </FormItem>

                <FormItem
                        label="身份证号"
                        :prop="'items.' + index + '.leaderName'"
                        :rules="{required: true, validator: idCardPass, trigger: 'blur'}">
                    <Row>
                        <Col span="18">
                            <Input type="text" v-model="item.leaderName" :maxlength="18" placeholder="身份证号"
                                   style="width: calc(100% - 50px);"></Input>
                            <limitLength :value="item.leaderName" :max="18"/>
                        </Col>
                    </Row>
                </FormItem>

                <FormItem
                        label="地址"
                        :prop="'items.' + index + '.address'"
                        :rules="{required: true, message: '地址不能为空', trigger: 'blur'}">
                    <Row>
                        <Col span="18">
                            <Input type="text" v-model.trim="item.address" :maxlength="50" placeholder="地址"
                                   style="width: calc(100% - 50px);"></Input>
                            <limitLength :value="item.address" :max="50"/>
                        </Col>
                    </Row>
                </FormItem>

            </div>
        </Form>

        <Row v-if="isAddStatus">
            <Col span="3">
                <Button type="primary" @click="handleAdd" icon="md-add">添加保证人</Button>
            </Col>
            <Col span="12">最多支持添加五名保证人</Col>
        </Row>

        <Divider/>

        <div class="rules-remark">
            <Form ref="remarkValidate" :model="remarkValidate" :rules="remarkRules" :label-width="0">
                <Row>
                    <Col span="24">
                        鉴于：
                    </Col>
                    <Col span="24" style="padding: 10px 100px 0 0">
                        1、债权人与保证人一就汽车融资租赁业务合作事宜于
                        <FormItem prop="info" style="display: inline-block">
                            <Input v-model.trim="remarkValidate.info" placeholder="最多可输入20字" :maxlength="20" clearable
                                   style="width: 100px"/>
                        </FormItem>
                        签署
                        <FormItem prop="indexs" style="display: inline-block">
                            <!--<Select v-model="remarkValidate.indexs" style="width:100px">
                                <Option v-for="item in 4" :value="(item+3)" :key="item+3">{{ item+3 }}</Option>
                            </Select>-->
                            <Input v-model.trim="remarkValidate.indexs" placeholder="大于0,小于100整数" :maxlength="3" clearable
                                   style="width: 180px"/>
                        </FormItem>
                        份《代理合作协议》，据此，保证人作为债权人的业务合作商，向债权人推介汽车融资租赁客户并协助办妥相应的合同签约、资料收集等事项；
                    </Col>
                </Row>

                <Divider/>

                <Row>
                    <Col span="24">
                        第一条 被担保的主合同
                    </Col>
                </Row>

                <Row>
                    <Col span="24" style="padding: 10px 100px 0 0">
                        本合同所担保的主合同为自
                        <FormItem prop="startTimes" style="display: inline-block">
                            <DatePicker :options="startTimeLimited" transfer v-model="remarkValidate.startTimes" type="date"
                                        placeholder="开始日期" style="width: 150px"></DatePicker>
                        </FormItem>
                        起至
                        <FormItem prop="endTimes" style="display: inline-block">
                            <DatePicker :options="endTimeLimited" transfer v-model="remarkValidate.endTimes" type="date"
                                        transfertype="date" placeholder="结束日期" style="width: 150px"></DatePicker>
                        </FormItem>
                        止，由保证人一（以下简称“合作商”）提交融资租赁申请的债务人（承租人）与本合同债权人（出租人）就债权人“放鑫融”产品所签订的融资租赁合同（无论融资租赁合同中是否包含保证人）。
                    </Col>

                    <Col span="24" style="padding: 10px 100px 0 0">
                        本合同项下，保证人担保的最高债权额为
                        <FormItem prop="money" style="display: inline-block">
                            <Input v-model.trim="remarkValidate.money" placeholder="" clearable style="width: 100px"/>
                        </FormItem>
                        亿元人民币 ，上述期间内，保证人通过行使追索权等方式实现的债权额不计算在该担保额上限内。
                    </Col>
                </Row>
            </Form>

            <Divider/>

        </div>

    </div>
</template>

<script>

    export default {
        name: "guarantor",
        props:{
            getFormChannelCode:{
                type:Object,
                default:{}
            }
        },
        data() {
            let _this = this;
            const idCardPass = (rule, value, callback) => {
                let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (value === '') {
                    callback(new Error('身份证号不能为空'));
                }else if(!reg.test(value)){
                    callback(new Error('请输入正确的身份证号'));
                }else{
                    callback()
                }
            };

            const validateMoney = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('最高债权额不能为空'));
                }
                if (!(/(^[1-9]\d*$)/.test(value))) {
                    callback(new Error('最高债权额必须为正整数'));
                } else {
                    callback();
                }
            };

            const validateNumber = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('不能为空'));
                }

                if (!Number.isInteger(value*1)) {
                    callback(new Error('大于0,小于100整数'));
                } else {
                    if (!(0 < value*1 && value*1 <= 100)) {
                        callback(new Error('大于0,小于100整数'));
                    } else {
                        callback();
                    }
                }
            };

            return {
                idCardPass: idCardPass,
                index: 0,
                isAddStatus: true,
                userName: "",
                number: "",
                money: "",
                mainName: "",
                legalPersonName: "",
                registeredAddress: "",
                addList:[],
                personDefault: {
                    name: '',
                    card: '',
                    address: ''
                },
                ruleDefault: {
                    name: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
                    card: [{required: true, validator: idCardPass, trigger: 'blur'}],
                    address: [{required: true, message: '地址不能为空', trigger: 'blur'}],
                },
                formDynamic: {
                    items: []
                },
                contractorList: [
                    {
                        key: "01",
                        title: "上海易鑫融资租赁有限公司"
                    }
                ],
                formValidate: {
                    contractValue: "01"
                },
                ruleValidate: {
                    contractValue: [{required: true, message: '请选择合同模板', trigger: 'change'}]
                },
                remarkValidate: {
                    info: "",
                    indexs: '',
                    startTimes: "",
                    endTimes: "",
                    money: ""
                },
                remarkRules: {
                    info: [{required: true, message: '汽车融资租赁业务合作事宜不能为空', trigger: 'blur'}],
                    indexs:[{validator: validateNumber, trigger: 'blur'}],
                    startTimes: [{required: true, type: 'date', message: '开始日期不能为空', trigger: 'change'}],
                    endTimes: [{required: true, type: 'date', message: '结束日期不能为空', trigger: 'change'}],
                    money: [{validator: validateMoney, trigger: 'blur'}]
                },
                startTimeLimited: {
                    disabledDate(date) {
                        return date && date.valueOf() > new Date(_this.remarkValidate.endTimes).getTime();
                    }
                },
                endTimeLimited: {
                    disabledDate(date) {
                        return date && date.valueOf() < new Date(_this.remarkValidate.startTimes).getTime();
                    }
                }
            }
        },
        watch: {
            index(val) {
                if (val === 3) {
                    this.isAddStatus = false;
                } else {
                    this.isAddStatus = true;
                }
            }
        },
        methods: {
            changeContractFn(data) {
                console.log(data);
            },
            formValidateFn() {
                return new Promise((resolve, reject) => {
                    this.$refs['formValidate'].validate((valid) => {
                        if (valid) {
                            resolve();
                            //this.$Message.success('Success!');
                        } else {
                            //this.$Message.error('Fail!');
                        }
                    })
                })
            },
            personDefaultFn() {
                return new Promise((resolve, reject) => {
                    this.$refs['personDefault'].validate((valid) => {
                        if (valid) {
                            resolve();
                            //this.$Message.success('Success!');
                        } else {
                            //this.$Message.error('Fail!');
                        }
                    })
                })
            },
            formDynamicFn() {
                return new Promise((resolve, reject) => {

                    if(this.formDynamic.items.length===0){
                        resolve();
                    }else{
                        this.$refs['formDynamic'].validate((valid) => {
                            if (valid) {
                                resolve();
                                //this.$Message.success('Success!');
                            } else {
                                //this.$Message.error('Fail!');
                            }
                        })
                    }

                })
            },
            remarkValidateFn() {
                return new Promise((resolve, reject) => {
                    this.$refs['remarkValidate'].validate((valid) => {
                        if (valid) {
                            resolve();
                            //this.$Message.success('Success!');
                        } else {
                            this.$Message.error('必填项不能为空!');
                        }
                    })
                })
            },
            handleSubmit() {
                console.log(this.formDynamic.items, 'this.formDynamic.items.length');
                return new Promise((resolve, reject) => {
                    Promise.all([this.formValidateFn(), this.personDefaultFn(), this.remarkValidateFn(), this.formDynamicFn()]).then((data) => {
                        //this.formValidate
                        //this.formDynamic
                        //this.personDefault
                        //this.remarkValidate

                        let firstPerson = [
                            {
                                "guaranteeNum": "1",
                                "guaranteePersonTitle": "保证人一：" + this.mainName,
                                "guaranteePersonName": "法定代表人：" + this.legalPersonName,
                                "guaranteePersonAddress": "地址：" + this.registeredAddress,
                                "guaranteePersonTitleTail": "保证人一："+this.legalPersonName+"（盖章）"
                            },
                            {
                                "guaranteeNum": "2",
                                "guaranteePersonTitle": "保证人二："+this.personDefault.name,
                                "guaranteePersonName": "身份证号："+this.personDefault.card,
                                "guaranteePersonAddress": "地址："+this.personDefault.address,
                                "guaranteePersonTitleTail":"保证人二："+this.personDefault.name+"(签字)"
                            }
                        ]

                        this.addList = [];

                        this.formDynamic.items.map((item, index)=>{
                            var num = index+3;
                            var indexs = "";
                            if(num===3){
                                indexs = "三";
                            }else if(num===4){
                                indexs = "四";
                            }else if(num===5){
                                indexs = "五";
                            }
                            this.addList.push({
                                "guaranteeNum": ''+num,
                                "guaranteePersonTitle": "保证人"+indexs+"：" + item.companyName,
                                "guaranteePersonName": "身份证号：" + item.leaderName,
                                "guaranteePersonAddress": "地址："+ item.address,
                                "guaranteePersonTitleTail":"保证人"+indexs+"："+item.companyName+"（签字） "
                            })
                        })


                        let params = {
                            "channelCode": this.getFormChannelCode.channelCode,
                            "contractTempNo": "004",
                            "yxcontractParty": "01",
                            "warrantors": [...firstPerson, ...this.addList],
                            "description": this.remarkValidate.info,
                            "contractNumber": ''+this.remarkValidate.indexs,
                            "startDate": this.$formatDate(this.remarkValidate.startTimes),
                            "endDate": this.$formatDate(this.remarkValidate.endTimes),
                            "highestAmt": this.remarkValidate.money
                        }


                        console.log(params, '拼装的参数');
                        this.$bus.$emit('fourThParmas' ,params);
                        resolve(params)
                    })
                })
            },
            handleAdd() {
                this.index++;
                this.formDynamic.items.push({
                    value: '',
                    index: this.index,
                    status: 1
                });
            },

            handleRemove(index) {
                this.index--;
                this.formDynamic.items.splice(index,1);

            }
        },
        mounted() {
            this.$nextTick(()=>{
                console.log(this.getFormChannelCode, 'this.getFormChannelCode');
                let params = this.getFormChannelCode.channelId;
                this.$http.get('/tbChannelMainInfo/selectMainInfoByChannelId?channelId=' + params).then(resp => {
                    if (resp.data.success) {
                        let datas = resp.data.data;

                        this.mainName = datas.mainName;
                        this.legalPersonName = datas.legalPersonName;
                        this.registeredAddress = datas.registeredAddress;
                        this.personDefault.name = datas.legalPersonName;


                    }
                })
            })
        }
    }
</script>

<style scoped>
    .delete-button {
        position: relative;
        top: 15px;
        left: -22px;
    }
</style>
