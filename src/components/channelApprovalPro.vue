<template>
  <div class="channelApprovalPro info-bg">
    <div class="crumbs">
      <crumbs :items="crumbsItems"></crumbs>
    </div>
    <Row class="info-shadow info-box">
      <Col span="24">
        <Col span="7" class="marR3">
          <div class="rowbuttom clearfix">
            <Col span="5"><span class="channelTitle">渠道名称</span></Col>
            <Col span="19">
              <Input v-model="channelName"></Input>
            </Col>
          </div>
          <!-- <div class="rowbuttom clearfix">
            <Col span="5"><span class="channelTitle">申请事项</span></Col>
            <Col span="19">
              <Select v-model="applyType">
                <Option v-for="item in applyTypelist" :value="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
          </div> -->
        </Col>
        <Col span="7" class="marR3">
          <div class="rowbuttom clearfix">
            <Col span="5"><span class="channelTitle">渠道编号</span></Col>
            <Col span="19">
              <Input v-model="channelNumber"></Input>
            </Col>
          </div>
        </Col>
        <Col span="7" class="marR3">
          <div class="rowbuttom clearfix">
            <Col span="5"><span class="channelTitle">申请人</span></Col>
            <Col span="19">
              <Input v-model="applyUserName"></Input>
            </Col>
          </div>
        </Col>
      </Col>
      <Col span="24" class="btnTextCenter marginB0 clearfix" style="text-align: center">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="cancel" type="ghost">重置</Button>
      </Col>
    </Row>
    <Row class="info-shadow info-box">
      <div class="pageTabs" >
        <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select='MenuSelect'>
          <MenuItem name="1">
            <Badge :count="pendingLen" overflow-count="9999999999999999999999">
              待
            </Badge>
          </MenuItem>
          <MenuItem name="2" >
            <Badge :count="passedLen" overflow-count="9999999999999999999999">
              已
            </Badge>
          </MenuItem>
          <!-- <MenuItem name="3" v-link="{path:'/channelApprovalPro/rejectApprovalPro'}">
            <Badge :count="rejectLen" overflow-count="9999999999999999999999">
              已
            </Badge>
          </MenuItem> -->
          <MenuItem name="4">
            <Badge :count="allLen" overflow-count="9999999999999999999999">
              全部
            </Badge>
          </MenuItem>
        </Menu>
      </div>
      <div class="wrap">
        <router-view :alllist="alllist" ref='child'></router-view>
      </div>
    </Row>
  </div>
</template>
<style lang="less">
html,body{
overflow: auto;
}
.ivu-badge-count {
    right: -11px;
    transform: translateX(65%);
}
  .clearfix,
  .clearfix:after {
    content: '';
    display: block;
    width: 100%;
    clear: both;
  }
	.marR3 {
    margin-right: 3%;
	}
  .pull-right {
    float:right;
  }
  .tableContent {
    margin-top:10px;
  }

  .channelApprovalPro .rowbuttom {
    margin: 0 0 14px 0;
  }

  .channelApprovalPro .channelTitle {
    display: block;
    text-align: right;
    line-height: 28px;
    padding: 0 8px 0 0;
    color: #666;
  }
  .channelApprovalPro .cityItems {
    width: 68.3%;
    margin-bottom: 4px;
  }
  .channelApprovalPro .cityItems .citylabels{
    width: 9%; float: left; text-align: left;
    line-height: 1; font-size: 12px; color: #000;
  }
  .channelApprovalPro .cityItems .citycontents{
    width: 82.5%; float: left; text-align: left;
    line-height: 1; font-size: 12px; color: #666;
  }
  .channelApprovalPro .cityItems .citycontents>div{
    width: 32%;float:left;margin-right: 8px;
  }
  .channelApprovalPro .cityItems .citycontents>div:last-child{
    margin:0;
  }

  /*tab切换样式修改*/
  .pageTabs {
    position: relative;
    margin:0 0 20px 0;
  }

  .pageTabs ul{
    border-bottom: 2px solid #c0dfff;
  }

  .pageTabs ul li.ivu-menu-item-selected{
    border-bottom: 4px solid #1d86f4 !important;
  }


  .pageTabs .optionArea {
    position: absolute;
    right: 5px;
    bottom: 5px;
    z-index: 2;
  }

  .marginLeft10 {
    margin-left: 10px;
  }

  .pageTabs .optionArea span {
    display: inline-block;
    color: #39f;
    text-decoration: underline;
    cursor: pointer;
  }

  .pageTabs .optionArea span:first-child {
    padding: 0 10px 0 0;
  }

  .businessTypeLists {
    margin: 0 10px 10px 0;
    padding: 5px 10px;
    float: left;
    border: 1px solid #cccccc;
    border-radius: 4px;
    background: #f3f3f3;
    cursor: pointer;
  }

</style>
<script>
  import crumbs from './commen/crumbs';
  export default {
    data() {
      return {
        crumbsItems: [ //导航
          {
            name: '新平台架构组',
            url: '',
          },
          {
            name: '审批',
            url: '',
          }
        ],
        disCity: true,//控制省市县选中
        disCounty: true,//控制省市县选中
        busiName:'',
        loading: true,
        reviseNum: 0,
        progressNum: 0,
        progressTotal: '',
        alllist: "", //路由传参
        key: "",
        current: 1,
        pagesize: 10,

        // 查询条件传参 ---------
        channelName: '', //渠道名称
        channelNumber: "", //渠道编号
        applyUserName:"", // 申请人
        applyType:"",//申请类型

        responseEmployee: "", //负责员工
        channelTypeVal: "", //渠道类型
        province: "", //省
        city: "", //市
        county: "", //县
        provinceList: [], //省
        cityList: [], //市
        countyList: [], //县
        menudataFirst: [], //渠道类型 一级
        menudataSecond: [], //渠道类型 二级
        changeBusinessLines: [], //模态框变更业务线
        changeBusinessLinesVal: "",
        approvalStatusList: [], //情况
        approvalStatus: "", //情况
        businessTypeOfusers: [], //业务类型
        businessTypeName: '默认值', //业务类型名字
        businessTypeOfusersArr:[],
        businessTypeOfusersArr2:[],
        businessTypeOfusersArr3:'',
        subordinateCompanies: "", //所属公司
        subordinateCompaniesVal: "",
        subordinateCompanyId: "",
        subordinateCompanyIdVal: "",

        startStatus: "", //启用情况
        allLen: "0", //全部數量
        rejectLen: "0", // 拒绝数量
        pendingLen: "0", // 中数量
        passedLen : "0", // 数量
        theme1: 'light',
        channelType: false, //渠道类型模态框
        departmentModal: false, //所在部门模态框
        companymodal: false, //所属公司模态框
        businessType: false, //业务类型模态框
        companylist:[
          {
              title: '序号',
              key: 'id'
          },
          {
              title: '公司名称',
              key: 'name'
          }
        ],
        applyTypelist:[
          {
            label: '请选择',
            value: ''
          },
          {
            label: '渠道准入',
            value: '001'
          },
          {
            label: '申请启用',
            value: '002'
          },
          {
            label: '申请停用',
            value: '003'
          },
          {
            label: '变更业务信息',
            value: '004'
          },
          {
            label: '变更基本信息',
            value: '005'
          },
          {
            label: '变更渠道主体',
            value: '006'
          },
          {
            label: '变更纳税资质',
            value: '007'
          },
          {
            label: '变更银行信息',
            value: '008'
          }
        ],
        companyTabelLists:[]
      }
    },

    methods: {
      changeValue() {
        this.businessTypeOfusersArr3 = '';
        this.businessTypeOfusersArr2 = this.businessTypeOfusersArr;
        for(var i=0;i<this.businessTypeOfusersArr2.length;i++){
          for(var j=0;j<this.businessTypeOfusers.length;j++){
            if(this.businessTypeOfusersArr2[i] == this.businessTypeOfusers[j].id){
              this.businessTypeOfusersArr3+= this.businessTypeOfusers[j].name+',';
            }
          }
        }
        this.businessType = false;
      },
      MenuSelect(name){
        // v-link="{path:'/channelApprovalPro/allApprovalPro'}"
        //v-link="{path:'/channelApprovalPro/passedApprovalPro'}"
        //v-link="{path:'/channelApprovalPro/pendingApprovalPro'}" @
        console.log(name);
        if(name==1){
            this.$router.push({path: "pendingApprovalPro"});
        }else if(name==2){
            this.$router.push({path: "passedApprovalPro"});
        }else if(name==4){
            this.$router.push({path: "allApprovalPro"});
        }
      },
      // 点击渠道类型menu
      getChannelModelSecond(id) {
        this.menudataSecond = [];
        let list = {
          'firstTypeId': id
        }
        this.$http.post('/channel-web/clChannel/queryChannelModel.do', list).then(function(resp) {
          for(var i = 0; i < resp.data.data.length; i++) {
            this.menudataSecond.push({
              'id': resp.data.data[i].secondTypeId,
              'name': resp.data.data[i].secondTypeName
            });
          }
          console.log(this.menudataSecond.name);
        }, function(error) {
          console.log(error.errorMessage);
        })
      },

      // 点击渠道类型 值转换
      toValue(item) {
        this.channelTypeVal = item.name;
        this.channelTypeIdVal = item.id
      },

      // 渠道类型对话框-确定
      channelTypeOk() {
        // this.$Message.info('渠道类型确定');
      },

      // 渠道类型对话框-取消
      channelTypeCancel() {
        // this.$Message.info('渠道类型取消');
      },

      closeBuss(){
        this.businessTypeOfusersArr = [];
        this.businessType = false;
      },

      // 获取业务类型
      getbusiness() {
        let list = {
          'relationRoleId': "2"
        }
        this.$http.post('/channel-web/clInfoSearchController/getbusiness.do', list).then(function(resp) {
          if(resp.data.data != null) {
            for(var i = 0; i < resp.data.data.length; i++) {
              this.businessTypeOfusers.push({
                'id': resp.data.data[i].id,
                'name': resp.data.data[i].busiName
              });
            }
          }
        }, function(error) {
          console.log(error.errorMessage);
        })
      },

      // 下拉选-根据省份id获取市
      getSubRegions(val) {
        this.disCity = false;
        this.cityList = [];
        let list = {
          'regionId': val
        }
        this.$http.post('/channel-web/clBaseRegion/getSubRegions.do', list).then(function(resp) {
          for(var i = 0; i < resp.data.data.length; i++) {
            this.cityList.push({
              'value': resp.data.data[i].RegionId,
              'label': resp.data.data[i].FullName
            });
          }
        }, function(error) {
          console.log(error.errorMessage);
        })
      },

      // 下拉选-获取县
      getSubRegion(val) {
        this.disCounty = false;
        this.countyList = [];
        let list = {
          'regionId': val
        }
        // 根据RegionId获取所有省
        this.$http.post('/channel-web/clBaseRegion/getSubRegions.do', list).then(function(resp) {
          for(var i = 0; i < resp.data.data.length; i++) {
            this.countyList.push({
              'value': resp.data.data[i].RegionId,
              'label': resp.data.data[i].FullName
            });
          }
        }, function(error) {
          console.log(error.errorMessage);
        })
      },

      // 业务类型对话框-取消
      closeBizModel() {
        this.businessTypeOfusersArr = [];
        this.businessType = false;
      },

      // 业务类型对话框-确认
      confirmBizModel() {
        this.businessTypeOfusersArr3 = '';
        this.businessTypeOfusersArr2 = this.businessTypeOfusersArr;
        for(var i=0; i<this.businessTypeOfusersArr2.length; i++){
          for(var j=0; j<this.businessTypeOfusers.length; j++){
            if(this.businessTypeOfusersArr2[i] == this.businessTypeOfusers[j].id){
              this.businessTypeOfusersArr3 += this.businessTypeOfusers[j].name+',';
            }
          }
        }
        this.businessType = false;
      },

      // 搜索按钮传参
      search() {
        let _this = this;
        let businessTypeOfusersArr = this.businessTypeOfusersArr2.join(',');
        let list = {
          'current': this.current,
          'rowCount': this.pagesize,
          "channelName": this.channelName, //渠道名称
          "channelCode": this.channelNumber, //渠道编号
          "applyType": this.applyType, //申请事项
          "applyUserName": this.applyUserName, //申请人
          "tabType": this.key // 标签页  全部 中
        }
        this.alllist = JSON.stringify(list); //JSON.stringify
        this.$refs.child.search();
      },

      // 重置按钮
      cancel(){
        this.channelName = "", //渠道名称
        this.channelNumber = "", //渠道编号
        this.applyType =  "", //申请事项
        this.applyUserName = "" //申请人
      },

      // 渠道类型模态窗
      confirmChannelType(){
        this.channelType = !this.channelType;
      },

      // 取消渠道类型模态窗
      cancelChannelType(){
        this.channelType = !this.channelType;
      },

      // 确认所属公司
      confirmCompany(){
        this.companymodal = !this.companymodal;
      },

      // 取消 所属公司
      closeCompany(){
        this.subordinateCompanyIdVal = "";
        this.subordinateCompaniesVal = "";
        this.companymodal = !this.companymodal;
      },

      // 点击所属公司列表
      companyData(data) {
        this.subordinateCompanies = data.name;
        this.subordinateCompaniesVal = data.name;
        this.subordinateCompanyIdVal = data.id;
      },

      // 所属公司分页事件
      changePageCompany(num) {
        this.current = num;
        this.$http.post('/channel-web/clChannel/queryXZDepartmentList.do', {
          "current": this.current,
          "pagesize": this.pagesize,
          "searchPhrase": "",
          "departmentName": ""
        }).then(function(resp) {
          let data = resp.data;
          if(data.success == true) {
            this.companyTabelLists = resp.body.data.data;
          }
        }, function(error) {
        })
      },

      // 查询关联所属公司
      departmentList() {
        this.$http.post('/channel-web/clChannel/queryXZDepartmentList.do', {
          "current": this.current,
          "pagesize": this.pagesize,
          "searchPhrase": "",
          "departmentName": ""
        }).then(function(resp) {
          let data = resp.data;
          if(data.success == true) {
            this.companyTabelLists = resp.body.data.data;
            this.resultcount = resp.body.data.resultCount;
          }
        }, function(error) {
          console.log(error.errorMessage);
        })
      },
    },
    watch: {
      // alllist(val){
      //   if(!!val){
      //     this.search();
      //   }
      // }
    },
    computed: {	},
    events: {
      pendingLen(val) {
        this.pendingLen = val;
      },
      passedLen(val) {
        this.passedLen = val;
      },
      rejectLen(val) {
        this.rejectLen = val;
      },
      allLen(val) {
        this.allLen = val;
      }
    },
    components: {
      crumbs
    },
    created() {
      // 查询业务类型
      this.getbusiness();

      // 查询关联所属公司
      this.departmentList();

      // 获取所有省
      this.$http.post('/channel-web/clBaseRegion/getProvinces.do').then(function(resp) {
        for(var i = 0; i < resp.data.data.length; i++) {
          this.provinceList.push({
            'value': resp.data.data[i].RegionId,
            'label': resp.data.data[i].FullName
          });
        }
      }, function(error) {
        console.log(error.errorMessage);
      });
      this.MenuSelect(1);
      // 获取渠道类型
      this.$http.post('/channel-web/clChannel/queryChannelModel.do').then(function(resp) {
        for(var i = 0; i < resp.data.data.length; i++) {
          this.menudataFirst.push({
            'id': resp.data.data[i].firstTypeId,
            'name': resp.data.data[i].firstTypeName
          });
        }
      }, function(error) {
        console.log(error.errorMessage);
      });
    }
  }
</script>


