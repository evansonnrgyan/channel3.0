<template>
  <div class="channelApprovalPro">
    <i-table border :columns="pendingColumns" :data="pendingData"></i-table>
    <div class="channelApprovalPro_pages" v-if="pendingData.length>0">
      <Page  v-ref:pagess4 :total="total" :current="current" @on-change="changePage" @on-page-size-change="changeSize" show-total show-elevator show-sizer class="page" ></Page>
    </div>
  </div>
</template>
<style lang="less">

  .channelApprovalPro table i[class~="ivu-icon"]{
    display:inline-block;
    font-size:24px;
  }
  .channelApprovalPro table i[class~="ivu-icon"]:first-child{
    margin:0 10px 0 0;
  }
</style>
<script>
  export default{
    props: ['alllist'],
    data(){
      return{
				businessId:'',
        self:this,
        data4:[],
        id:'',
        tableHeight:0,
        allResp:'',
        key:"2",//审批拒绝
        allLen: 0, //全部數量
        rejectLen: 0, // 审批拒绝数量
        pendingLen: 0, // 审批中数量
        passedLen : 0, // 审批数量
        total:0,//总页数
        current:1,//当前页码默认为1,
        rowCount:10,
        pendingColumns: [
          {
            title: '渠道编号',
            key: 'channelCode'
          },
          {
            title: '渠道名称',
            key: 'channelName',
            width:300
          },
          {
            title: '渠道类型',
            key: 'clModelName'
          },
          {
            title: '申请人',
            key: 'applyUserName'
          },
          {
            title: '申请事项',
            key: 'applyTypeName'
          },
          {
            title: '处理情况',
            key: 'approveStatusName'
          },
          {
            title: '操作',
            key: 'options',
            width:100,
            render(row, column, index){
              let toUrl = '';
              let id = row.id; // 流程任务ID
              let channelCode = row.channelCode;
              let channelId = row.channelId;
              let applyType = row.applyType;
              let isChange = "";
              let businessId = row.businessId;

              if (applyType == '001' || applyType == '004') {
                if (applyType == '001') {
                  isChange = "0";
                } else {
                  isChange = "1";
                }
                // 渠道申请 or 变更业务信息
                toUrl = "{path:'/channelAccess/baseInfo?isView=0&isChange="+isChange+"&bussId=" + id + "&channelCode=" + channelCode + "&channelId=" + channelId+"&businessId=" + businessId+"'}";

              } else if (applyType == '002' || applyType == '003' ) {
                // 申请停用or 申请启用
                toUrl = "{path:'/auditInfo/applyForStop?isView=0&bussId=" + id + "&channelCode=" + channelCode + "&channelId=" + channelId+"'}";

              } else if (applyType == '005' ){
                // 变更基本信息
                toUrl = "{path:'/auditInfo/changesbaseInfo?isView=0&bussId="+id+"&channelCode=" + channelCode + "&channelId=" + channelId+"'}";

              } else if (applyType == '006' ){
                // 变更渠道主体
                toUrl = "{path:'/auditInfo/channelMain?isView=0&bussId=" + id + "&channelCode=" + channelCode + "&channelId=" + channelId + "&applyType=" + applyType+"'}";

              } else if (applyType == '007' ){
                // 变更纳税资质
                toUrl = "{path:'/auditInfo/taxQualification?isView=0&bussId=" + id +"&channelCode=" + channelCode + "&channelId=" + channelId+"'}";

              } else if (applyType == '008' ){
                // 变更银行信息
                toUrl = "{path:'/auditInfo/bankInformation?isView=0&bussId=" + id + "&channelCode=" + channelCode + "&channelId=" + channelId+"'}";
              }
              return "<a v-link="+toUrl+">查看</a>";
            }
          }
        ],
        pendingData: []
      }
    }, watch:{
      alllist(val){
        if(!!val){
          this.search();
        }
      }
    },
    methods:{
      //表格数据列表
      search(){
        if(!!this.alllist){
          this.$nextTick(()=>{
             this.$refs['pagess4']?this.$refs['pagess4'].current=1:""
          })
          var list = JSON.parse(this.alllist);
          list.rowCount = this.rowCount;
          list.tabType = '2';
        }else{
          var list = {
            "current": this.current,
            "rowCount": this.rowCount,
            // 审批拒绝标签页
            "tabType": '2',
          };
        }
        this.$http.post('/channel-web/clChannelApprovalController/queryApprovalInfo.do',list).then(function(resp){
          if (!resp.data.hasErrors && resp.data.data != null) {
            this.total = resp.data.data.total;
            this.$set('pendingData',resp.data.data.data);
          }
        },function(error){
          console.log(error.errorMessage);
        });

        this.$http.post('/channel-web/clChannelApprovalController/queryApprovalInfoNum.do', list).then(function(resp){
          if (!resp.data.hasErrors && resp.data.data != null) {
            this.$dispatch('allLen', resp.data.data.allLen);
            this.$dispatch('pendingLen', resp.data.data.pendingLen);
            this.$dispatch('rejectLen', resp.data.data.rejectLen);
            this.$dispatch('passedLen', resp.data.data.passedLen);
          }
        },function(error){
          console.log(error.errorMessage);
        });
      },

      //改变筛选数量
      changeSize(count){
        this.rowCount = count;
        this.search();
      },

      //改变页码触发事件
      changePage(num){
        if(!!this.alllist){
          var list = JSON.parse(this.alllist);
          list.rowCount = this.rowCount;
          list.tabType = '2';
        }else{
          var list = {
            "current": this.current,
            "rowCount": this.rowCount,
            // 审批拒绝标签页
            "tabType": '2',
          };
        }

        this.$http.post('/channel-web/clChannelApprovalController/queryApprovalInfo.do',list).then(function(resp){
          if (!resp.data.hasErrors && resp.data.data != null) {
            this.total = resp.data.data.total;
            this.$set('pendingData', resp.data.data.data);
          }
        },function(error){
          console.log(error.errorMessage);
        })
      },

      // 点击空白处隐藏弹窗
      rowClickHide(){
        function getElementByClassName(classnames){
          var objArray= new Array();//定义返回对象数组
          var tags=document.getElementsByTagName("*");//获取页面所有元素
          var index = 0;
          for(var i in tags){
            if(tags[i].nodeType==1){
              if(tags[i].getAttribute("class") == classnames){ //如果某元素的class值为所需要
                objArray[index]=tags[i];
                index++;
              }
            }
          }
          return objArray;
        };
        let hide = getElementByClassName("ivu-poptip-content");
        for(var i=0;i<hide.length;i++){
          hide[i].parentNode.style.display='none'
        }
        this.tableHeight=0;
      }
    },
    ready(){
      this.search();
      var _this = this;
      //点击空白处隐藏弹窗
      document.body.onclick = function(){
        _this.rowClickHide();
      }
    }
  }

</script>
