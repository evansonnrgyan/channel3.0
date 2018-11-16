<!--合作协议及附件-->
<template>
  <div class="cooperation-accessories">
    <div class="content">
      <div class="channels-common-body">
        <div class="channels-common-body-content">
          <div class="channels-common-body-title">
            <span></span>合作协议及附件
          </div>
          <div class="channels-common-body-cont">
            <Row class="padding5">
              <Col class="font-right font-style" span="2">合作期限</Col>
              <Col class="font-style" span="21">2019年7月14日 至 2019年7月14日</Col>
            </Row>
            <Row class="padding5">
              <Col class="font-right font-style" span="2">合作协议</Col>
              <Col span="21">
                <img class="imgView" :src="imgSrc" />
              </Col>
            </Row>
            <Row class="padding5">
              <Col class="font-right font-style" span="2">账号申请表</Col>
              <Col span="21">
                <img class="imgView" :src="imgSrc" />
              </Col>
            </Row>
            <Row class="padding5">
              <Col class="font-right font-style" span="2">其他附件</Col>
              <Col span="21">
                <img class="imgView" :src="imgSrc" />
                <img class="imgView" :src="imgSrc" />
                <img class="imgView" :src="imgSrc" />

              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import imgSrc from '../../../assets/images/img_002.png'
  export default {
    name: "cooperationAccessories",
    data () {
      return {
        imgSrc: imgSrc
      }
    }
  }
</script>

<style lang="less" scoped>
  .cooperation-accessories{
    .font-style{
      color:#333;
      font-size:12px;
      line-height: 14px;
    }
    .imgView{
      width:141px;
      height:95px;
    }
    .padding5{
      padding:5px;
    }
  }
</style>
