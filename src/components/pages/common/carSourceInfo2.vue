<!-- 车源信息-经销商 -->
<template>

    <div>
        <Form ref="formValidate" :model="defaultValue" :rules="ruleValidate" :label-width="130">
                     
            <Row>
                <Col span="24">
                    <FormItem label="车辆类型" prop="type">
                        <CheckboxGroup  v-model="defaultValue.type">
                            <Checkbox label="049500000" disabled>新车</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span="24">
                    <FormItem label="车辆来源" prop="source">
                        <CheckboxGroup  v-model="defaultValue.source">
                            <Checkbox label="049400001" disabled>非资源车</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </Col>
            </Row>
                
            <Row>
                <Col span="24">
                    <FormItem label="车辆品牌" prop="brandType">
                        <RadioGroup v-if="edit"  v-model="defaultValue.brandType" @on-change="changeBrand">
                            <Radio label="1">不限品牌</Radio>
                            <Radio label="0">限定品牌</Radio>
                        </RadioGroup>
                        <span v-else>{{defaultValue.brandType}}</span>
                        <Button  v-if="xiandingFlag" type="primary" @click="addBrand">添加品牌</Button>
                    </FormItem>
                </Col>
            </Row>
            <Row v-if="xiandingFlag">
                <Col span="24">
                    <FormItem label="" prop="">
                        <Table :columns="columns1" :data="defaultValue.brandList"></Table>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Modal
        v-model="addBrandFlag"
        :title="modalTitle"
         width="600"
         @on-cancel="cancel"
        >
        <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="130">
            <Row>
                <Col span="24">
                    <FormItem label="选择品牌" prop="brand">
                         <Cascader v-model="formValidate2.brand"  :data="data4" :load-data="loadData" class="input-width" @on-change="handleChange"></Cascader>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem v-if="timeDiv" label="品牌授权时间" :prop="formValidate2.timeFlag? null : 'time'">
                        <DatePicker  :disabled="formValidate2.timeFlag" v-model="formValidate2.time"  type="daterange" placement="bottom-end" placeholder="请选择授权时间" class="input-width"></DatePicker>
                        <Checkbox v-model="formValidate2.timeFlag" @on-change="changeTimeFlag">不限</Checkbox>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="品牌授权书" prop="img">
                        <oneFile :value.sync="formValidate2.img" attachmentCode="0000000003" :btns="['show','down','again']" @clearValidate="clearValidate"></oneFile>
                    </FormItem>
                </Col>
            </Row>
           
        </Form>
        <div slot="footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary"  @click="ok">确认</Button>
        </div>
    </Modal>
    <Modal title="查看图片" v-model="visible">
      <img :src="imgSrc" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
    </div>
	

</template>

<script>
    export default {
        props: {
            value:{
                type: Object,
                default: {},
            },
            flag:{
                type:Boolean ,
                default:false
            },
            edit:{
                type:Boolean ,
                default:false
            },
        },
        data() {
            return {
                defaultValue:{
                    type: ['049500000'],
                    source:['049400001'],
                    brandType: '',
                    brandList: [],
                },
                columns1: [
                    {
                        type:'index',
                        title:'序号'
                    },
                    {
                        title: '主品牌',
                        key: 'mainBrand',
                        render: (h, params) => {
                            return h('div',params.row.brandName[0])                        
                        }
                    },
                    {
                        title: '品牌',
                        key: 'brand',
                        render: (h, params) => {
                            return h('div',params.row.brandName[1])                        
                        }
                    },
                    {
                        title: '品牌授权时间',
                        key: 'time',
                        render: (h, params) => {
                            return h('div',params.row.time[0] + ' 至 ' + params.row.time[1])                        
                        }
                    },
                    {
                        title: '品牌授权书',
                        key: 'img',
                        render: (h, params) => {

                            return h('a',{
                                on:{
                                    click: () => {
                                      this.showImg(params.row.img)
                                    }
                                }
                            },params.row.img.attachmentName)                        
                        }
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                          return h('div', [
                            h('a', {
                              style: {
                                marginRight: '10px',
                              },
                              on: {
                                click: () => {
                                  this.Edit(params.row)
                                }
                              }
                            }, '编辑'),
                            h('a', {
                         
                              on: {
                                click: () => {
                                  this.Deleted(params.index)
                                }
                              }
                            }, '删除')
                          ]);
                        }
                    }
                ],
                data1:[],
                ruleValidate:{
                    type: [
                        { required: true, type:'array', message: '请选择车辆类型', trigger: 'change' }
                    ],
                    source: [
                        { required: true, type:'array', message: '请选择车辆来源', trigger: 'change' }
                    ],

                    brandType: [
                        { required: true, message: '请选择车辆品牌', trigger: 'change' }
                    ],
                },
                xiandingFlag:false,
                addBrandFlag:false,
                data4: [],
                modalTitle: '',
                formValidate2: {
                    brand:[],
                    brandName:[],
                    time:[],
                    timeFlag:false,
                    img:{}
                },
                ruleValidate2:{
                    brand: [
                        { required: true, type: 'array', message: '请选择品牌', trigger: 'change' }
                    ],
                    time: [{
                        type: 'array',required:true,
                        fields:{
                            0:{type:'date',required:true,message: '请选择开始结束时间'},
                            1:{type:'date',required:true,message: '请选择开始结束时间'}
                        },
                        message: '请选择开始结束时间'
                    }],
                    img: {
                        type: "object", required: true,
                        fields: {
                          attachmentName: {type: "string", trigger: 'change', message: '请选择上传文件！', required: true},
                        }
                    },
                },
                visible: false,
                imgSrc: '',
                timeDiv:true,

            }
        },
        watch:{

            defaultValue: {
                handler: function (newVal) {
                    this.$emit('update:value', newVal);

                  },
                deep: true
            },
        },
        methods: {
            clearValidate(){
                this.$refs['formValidate2'].validateField('img');
            },
            returnArr(item){
                let v = item.checkedValueList;
                let arr = item.childFieldList;
                return arr.filter(elem => {
                    return !v.includes(elem.value)
                })
            },
            // 编辑图片
            Edit(o){
                this.modalTitle = '编辑品牌';
                this.addBrandFlag = true;
                this.formValidate2 = o;
            },
            // 删除
            Deleted(index){
                this.defaultValue.brandList.splice(index,1)
            },
            // 查看图片
            showImg(img){
                this.imgSrc = this.$viewURL_PATH + img.serverFileName;
                // this.visible = true;
                this.$showImg(this.imgSrc);
            },
            // 点击不限
            changeTimeFlag(v){
                this.timeDiv = false;
                this.$nextTick(()=>{
                    this.timeDiv = true;
                })
            },
            // 点击下拉框品牌
            handleChange (value, selectedData) {
                this.formValidate2.brandName = [];
                selectedData.map(item => {
                    this.formValidate2.brandName.push(item.label)
                })
            },

            changeBrand(v){
                if(v === '1'){
                    this.xiandingFlag = false;
                }else{
                    this.xiandingFlag = true;
                }
            },
            // 添加品牌
            addBrand(){
                this.modalTitle = '新增品牌';
                this.addBrandFlag = true;
            },
        
            // 主品牌
            getMainBrand(){
                this.$http.get("/api/vehicleLib/masterBrand").then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        this.data4 = [];
                        data.map(item => {
                            this.data4.push({
                                value: item.id,
                                label: item.name,
                                children: [],
                                loading: false
                            })
                        })
                    };
                })
            },
            // 获取品牌
            loadData (item, callback) {
                item.loading = true;
                this.$http.get("/api/vehicleLib/brand?masterId=" + item.value).then((resp)=>{
                    if(resp.data.success){
                        let data = resp.data.data;
                        item.children = [];
                        data.map(elem => {
                            item.children.push({
                                value: elem.id,
                                label: elem.name,
                            })
                        })
                        
                        item.loading = false;
                        callback();
                    };
                })
            },
            // 确认
            ok (){
                this.$refs['formValidate2'].validate((valid) => {
                    if (valid) {
                        this.saveBrand();
                    } else {

                        this.$Message.error('Fail!');
                    }
                })
            },
            // 取消
            cancel() {
                this.$refs['formValidate2'].resetFields();
                this.addBrandFlag = false;
            },
            // 保存新增
            saveBrand(){
                this.defaultValue.brandList.push({
                    brand: this.formValidate2.brand,
                    brandName: this.formValidate2.brandName,
                    time: this.returnTime(this.formValidate2.time),
                    timeFlag:this.formValidate2.timeFlag,
                    img: this.formValidate2.img
                })
                this.addBrandFlag = false;
            },
            returnTime(arr){
                let newArr = [];
                arr.map(item => {
                    newArr.push(this.$formatDate(item))
                })
                return newArr;
            },
             // 验证
            handleSubmit(){
                return new Promise((resolve, reject)=>{
                    this.$refs['formValidate'].validate((valid) => {
                        if (valid) {
                            resolve();
                        } else{
                            reject();
                        }
                    })
                })
            }

        },
        mounted(){
            
            // 父组件有值
            if(!$.isEmptyObject(this.value)){
                
            }


            this.getMainBrand();
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



