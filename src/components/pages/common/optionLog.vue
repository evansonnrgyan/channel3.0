<!-- 操作日志 -->
<template>
  <div >
  <div>
    <Row >
        <Col span="12">
          <Row>
            <Col span="10">创建人：{{forms.creatorName}}</Col>
            <Col span="14">
              创建时间：{{forms.createTime}}
            </Col>
          </Row>
        </Col>
        <Col span="12">
          <Row>
            <Col  span="10">最近更新人：{{forms.updatorName}}</Col>
            <Col span="14">最近更新时间：{{forms.updateTime}}</Col>
          </Row>
        </Col>
      </Row>
  </div>
  

    <tableNoPage url="/log/queryAllLog" :params="{channelId: params}" :columns="columns" />
    <!--  -->
        <Modal
          v-model="modal"
          width="600"
           class-name="modal-padding"
            title="详细审批记录">
             <Table :columns="columns1" :data="data1"></Table>
             <div slot="footer"></div>
        </Modal>
  </div>
</template>

<script>
  export default {
    name: "",
    props:["params"],
    data() {
      return {
      	modal:false,
      	forms:{},
        columns:[
          {
            title:"发生时间",
            key:"createTime",
          },
          {
            title:"操作人",
            key:"creatorName"
          },
          {
            title:"操作事件",
            key:"eventTypeName"
          },
          {
            title:"处理结果",
            key:"eventStatusName"
          },
          {
            title:"操作",
            key:"email",
            render: (h, params) => {
            	let v = params.row.eventDetails;
            	if(v.substring(0,3) === 'UID'){
            		return h('a',{
            			on: {
	                      click: () => {
	                        this.show(v.substring(4,v.length))
	                      }
	                    }
            		},'查看')
            	}else{
            		return h('span',v)
            	}
            	
            }
          },
          
        ],

        columns1:[
          {
            title:"时间",
            key:"createTime",
            width:180,
          },
          {
            title:"操作人",
            key:"creatorName"
          },
          {
            title:"操作事件",
            key:"eventStatusName"
          },
          {
            title:"备注",
            key:"eventDetails"
          },
          
        ],
        data1:[]
      }
    },
    methods:{
    	returnOne(){
                let json = {
                    id: this.params,
                } 
                this.$http.post('/tbChannelBusiness/getChannelBusiness',json).then(resp => {
                    if (resp.data.success) {
                        this.forms = resp.data.data;
                    }
                })
            },
    	show(id){
    		this.modal = true;
    		this.$http.post('/log/queryApproveDetails', {id: id}).then( resp=> {
              if(resp.data.success) {
                  let data = resp.data;
                  this.data1 = data.data;
              }
          })
    	}
    },
    mounted(){
    	this.returnOne();
    }
  }
</script>