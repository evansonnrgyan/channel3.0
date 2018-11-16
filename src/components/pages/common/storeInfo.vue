<!-- 店面信息 -->
<template>
    <Row>
        <Col span="24">
            <div class="line">
                <span class="title">
                    {{storeInfo.channelCode}}
                    {{storeInfo.shopName}}
                </span>
            </div>
            <div class="line">
                <Tag v-for="item in storeInfo.businessConfigModelNames" style="cursor: default;" type="border" :key="item.busiStatus" :color="returnColor(item.busiStatus)">{{item.businessModelName}}</Tag>
            </div>
            <div class="line" v-show="!flag">
                <span >{{storeInfo.province || ''}}</span>
                <span>{{storeInfo.city || ''}}</span>
                <span>{{storeInfo.district || ''}}</span>
                <span>{{storeInfo.detailAddress || ''}}</span>
            </div>
            <div class="line" v-show="!flag"><span class="">企业名称：</span>{{storeInfo.mainName}} </div>

          <div v-show="flag">
            <div class="line"><span class="store-title">店面经营地址：</span>{{storeInfo.province || ''}} 
              {{storeInfo.city || ''}}
              {{storeInfo.district || ''}}
              {{storeInfo.detailAddress || ''}}
            </div>
            <div class="line"><span class="store-title">店面属性：</span>{{storeInfo.shopAttributeName}}</div>
            <div class="line"><span class="store-title" style="float:left;">店头照片：</span>
              <oneFile style="padding-top:1px" :value.sync="storeInfo.shopHeadAttachmentObj" attachmentCode="0000000003" :btns="['show','down']"></oneFile>
            </div>
            <div class="line"><span class="store-title"></span>{{storeInfo.updatorName | exNull}} {{' 更新于： ' + storeInfo.updateTime}}</div>
            <div class="line"><span class="store-title"></span>{{storeInfo.creatorName | exNull}} {{' 创建于： '+ storeInfo.createTime}}</div>

            <Divider />

            <div class="line"><span class="store-title">主体类型：</span>{{storeInfo.mainInfo.mainType === '0'? '企业': '个人'}}</div>

            <div v-if="storeInfo.mainInfo.mainType === '0'">
              <div class="line"><span class="store-title">企业名称：</span>{{storeInfo.mainInfo.mainName}}</div>
              <div class="line"><span class="store-title">统一社会信用代码：</span>{{storeInfo.mainInfo.creditCode}}</div>
              <div class="line"><span class="store-title">注册地址：</span>{{storeInfo.mainInfo.registeredAddress}}</div>
              <div class="line"><span class="store-title">法定代表人：</span>{{storeInfo.mainInfo.legalPersonName}}</div>
              <div class="line"><span class="store-title">注册资本：</span>{{ storeInfo.mainInfo.registeredCapital? storeInfo.mainInfo.registeredCapital + storeInfo.mainInfo.registeredCapitalUnit : ''}}</div>
              <div class="line"><span class="store-title">营业期限：</span>{{businessTimes}} </div>
              <div class="line"><span class="store-title"></span>{{'最近更新于： ' + storeInfo.mainInfo.updateTime}}</div>
              <!-- <div class="line"><span class="store-title" style="float:left;">营业执照：</span>
                <oneFile style="padding-top:1px" :value.sync="storeInfo.mainInfo.businessAttachmentObj" attachmentCode="0000000003" :btns="['show','down']"></oneFile>
              </div> -->
            </div>
            <div v-else>
              <div class="line"><span class="store-title">个人姓名：</span>{{storeInfo.mainInfo.mainName}}</div>
              <div class="line"><span class="store-title">身份证号：</span>{{storeInfo.mainInfo.creditCode}}</div>
              <div class="line"><span class="store-title">性别：</span>{{storeInfo.mainInfo.sexual === 'M'? '男': '女'}} </div>
              <div class="line"><span class="store-title">最后更新时间：</span>{{storeInfo.mainInfo.updateTime}} </div>
              <div class="line"><span class="store-title" style="float:left;">身份证电子版：</span>
                <oneFile style="padding-top:1px" :value.sync="storeInfo.mainInfo.idCardAttachmentObj" attachmentCode="0000000003" :btns="['show','down']"></oneFile>
              </div>
            </div>
            
          </div>

        </Col>
        <div class="float-right more" @click="moreInfoEvent">
          <div v-if="!flag">展开更多 <Icon type="ios-arrow-down" size="18" /></div>
          <div v-else>收起 <Icon type="ios-arrow-up" size="18" /></div>
        </div>
    </Row>
</template>

<script>
    export default {
        props: {
          pid:{
              type: String,
              default: '',
          },
          channelId:{
              type: String,
              default: '',
          },
          workFlowId:{
              type: String,
              default: '',
          },
          type:{
              type: String,
              default: '',
          }
        },
        data() {
            return {
              flag: false,
              businessTimes:'',
              storeInfo:{
                shopCode:'',
                shopName:'',
                businessConfigModelNames:[],
                province:'',
                city:'',
                district:'',
                detailAddress:'',
                mainName:'',
                shopAttribute:'',
                shopHeadAttachmentObj:{},
                mainInfo:{
                  mainType: '',
                  mainName:'',
                  creditCode:'',
                  registeredAddress:'',
                  legalPersonName:'',
                  registeredCapital:'',
                  registeredCapitalUnit:'',
                  sexual:'',
                  updateTime:'',
                  businessAttachmentObj:{},
                  idCardAttachmentObj:{}
                },

              },
            }
        },
        watch:{
          pid(newValue){
            if(newValue !== ''){

              this.initShop();

            }
          }
        },
        filters: {
          exNull: function (value) {
            if (value){
              return value
            }else{
              return ''
            }
          }
        },
        methods: {
          
          returnColor(status){
                if(status === '050200000'){
                    return 'success'
                }else
                if(status === '050200004'){
                    return 'default'
                }else
                if(status === '050200001' || status === '050200002'){
                    return 'error'
                }
            },
          moreInfoEvent (){
            this.flag = !this.flag;
          },
          dealTime(time){
            if(time){
              return this.$formatDate(time)
            }else{
              return '无'
            }
          },
          // 获取店面信息  编辑
          initShop(){
                
              this.$http.get('/tbChannelShopInfo/selectShopInfoByIdAndChannelId?id='+ this.pid +'&channelId=' + this.channelId + '&type=' + this.type).then(resp => {
                  if (resp.data.success) {
                      this.storeInfo = resp.data.data;
                      if(!this.storeInfo.mainInfo.busiStartTime && !this.storeInfo.mainInfo.busiEndTime){
                        this.businessTimes = '无'
                      }else{
                        this.businessTimes = this.dealTime(this.storeInfo.mainInfo.busiStartTime) + ' 至 ' + this.dealTime(this.storeInfo.mainInfo.busiEndTime)
                      }
                  }
              })
          },


        },
        mounted(){
        }

    }
</script>
<style type="text/css" scoped>
    .content{
        border-bottom: 1px solid #ededed;
    }
    .line{
        line-height: 2.3;
    }
    .store-title{
      display: inline-block;
      width:120px;
      text-align: right;
    }
    .title{
        font-size: 15px;
        font-weight: bold
    }
    .more{
        color:#127efc;
      cursor: pointer;
    }
</style>



