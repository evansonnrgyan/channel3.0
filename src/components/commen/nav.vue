<template>
    <div class="po-left" :style="{ width: navStyle.width}" v-slimScroll="scrollConfig">
        <!-- <div class="po-left" :style="{ width: navStyle.width}"> -->
        <!-- <ul class="po-content-scroll" :style="{ height: fourHeight }"> -->
        <ul class="po-content-scroll">
            <li
                    class="firstNav clearfix"
                    v-for="(item,index) in navOne(data)"
                    :key="item.id"
                    @click="navTwo(item.id, index, $event)">

                <a @mouseover.stop="navTowHover(item.name)" @mouseout.stop="navTowOut(item.name)" :class="{ active: classNun === index }">

				    <span v-if="item.name==='销售渠道管理'">
                        <span class="iconlogo po-pic default" v-if="(!showTwo || classNun !== index) && isHover1">
						    <img :src="iconList.saleChannel.default">
                        </span>
                        <span class="iconlogo po-pic hover" v-else-if="(!showTwo || classNun !== index) && !isHover1 || showTwo">
                            <img :src="iconList.saleChannel.hover">
                        </span>
                    </span>

                    <span v-if="item.name==='拓展功能维护'">
                        <span class="iconlogo po-pic" v-if="(!showTwo || classNun !== index) && isHover2">
						    <img :src="iconList.expand.default">
                        </span>
                        <span class="iconlogo po-pic" v-else-if="(!showTwo || classNun !== index) && !isHover2 || showTwo">
                            <img :src="iconList.expand.hover">
                        </span>
                    </span>

                    <span v-if="item.name==='经销商分级管理'">
                        <span class="iconlogo po-pic" v-if="(!showTwo || classNun !== index) && isHover3">
						    <img :src="iconList.agency.default">
                        </span>
                        <span class="iconlogo po-pic" v-else-if="(!showTwo || classNun !== index) && !isHover3 || showTwo">
                            <img :src="iconList.agency.hover">
                        </span>
                    </span>

                    <span v-if="item.name==='基础配置管理'">
                        <span class="iconlogo po-pic" v-if="(!showTwo || classNun !== index) && isHover4">
						    <img :src="iconList.baseConfig.default">
                        </span>
                        <span class="iconlogo po-pic" v-else-if="(!showTwo || classNun !== index) && !isHover4 || showTwo">
                            <img :src="iconList.baseConfig.hover">
                        </span>
                    </span>

                    <span class="po-noimg">{{ item.name }}</span>
                    <span class="po-plus" v-if="!showTwo || classNun !== index"></span>
                    <span class="po-close" v-else></span>
                </a>
                <!-- 第二层 -->
                <ul v-if="showTwo" class="secondNav" @mouseleave="navTwoOut()">
                    <li class="clearfix" v-for="(n, index) in dataTwo" :key="n.id" v-if="item.id === n.pId"
                        @mouseover="navThree(n.id, index)" id="animationTwo" @click.stop="handleTabsAdd(n)">
                        <a>
                            <span class="po-noimg po-margin">{{ n.name }}</span>
                        </a>
                        <div v-if="n.children.length>0" style="position: absolute;right:8px;top:3px;z-index:999999;"> > </div>

                        <!-- 第三层 -->
                        <ul class="thirdNav" v-if="showThree" @mouseleave="navThreeOut()">
                            <li :class="{ nav3: code !== m.id, nav4: navFourStatus }" class="clearfix"
                                v-for="(m,index) in dataThree" :key="m.id" v-if="n.id === m.pId" id="animationThree"
                                @click.stop="handleTabsAdd(m)">
                                <a>
									<span class="po-noimg po-margin" v-if="code === m.id">
										<b>{{ m.name }}</b>
									</span>
                                    <span class="po-noimg po-margin" v-else>
										{{ m.name }}
									</span>
                                    <span class="thirdNavPoint" v-if="code === m.id">></span>
                                </a>
                                <!-- 四级菜单 -->
                                <div id="fourNav" class="fourNav"
                                     v-if="o && o.parentIds && o.parentIds.indexOf(m.id)>-1"
                                     v-for="(o,index) in dataFour" @click.stop="handleTabsAdd(o)">
                                    <span> {{ o.name }} <a v-if="(!(index===dataFour.length-1))">|</a></span>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
        <loading :show="loading"></loading>
    </div>
</template>
<script>
    import loading from '../loading';
    import slimScroll from '../../utils/slimscroll.js';
    //机构
    import agency from '../../assets/images/Icon/agency.png';
    import agencyHover from '../../assets/images/Icon/agency_hover.png';
    //基础配置
    import baseConfig from '../../assets/images/Icon/base_config.png';
    import baseConfigHover from '../../assets/images/Icon/base_config_hover.png';
    //业务包管理
    import busi from '../../assets/images/Icon/busi.png';
    import busiHover from '../../assets/images/Icon/busi_hover.png';
    //拓展管理
    import expand from '../../assets/images/Icon/expand.png';
    import expandHover from '../../assets/images/Icon/expand_hover.png';
    //销售渠道管理
    import saleChannel from '../../assets/images/Icon/sale_channel.png';
    import saleChannelHover from '../../assets/images/Icon/sale_channel_hover.png';
    export default {
        name: "",
        data() {
            return {
                iconList:{
                    agency:{
                        default: agency,
                        hover: agencyHover
                    },
                    baseConfig:{
                        default: baseConfig,
                        hover: baseConfigHover
                    },
                    busi:{
                        default: busi,
                        hover: busiHover
                    },
                    expand:{
                        default: expand,
                        hover: expandHover
                    },
                    saleChannel:{
                        default: saleChannel,
                        hover: saleChannelHover
                    }
                },
                isHover1: true,
                isHover2: true,
                isHover3: true,
                isHover4: true,
                data: [],
                loading: false,
                dataTwo: [],
                dataThree: [],
                dataFour: [],
                code: "",
                showTwo: false,
                fourNavStatus: false,
                scrollConfig: false,
                fourHeight: "auto",
                navStyle: {
                    width: "auto",
                    border: "1px solid rgb(247, 247, 248)"
                },
                navFourStatus: false,
                showThree: false,
                id: "",
                classNun: null
            }
        },
        methods: {
            handleTabsAdd(item) {
                if (item.children.length == 0) {
                    this.$bus.$emit("openNewTab", item);
                }
                ;
                return false;
            },
            navTwostop() {
                // 二级菜单阻止事件
                this.showTwo = !this.showTwo;
            },
            //处理接口菜单数据
            resultMenusData(arr1) {
                var newArr = [];
                (function deal(arr) {
                    arr.map(item => {
                        newArr.push(item);
                        if (item.children) {
                            deal(item.children)
                        }
                    })
                })(arr1);
                return newArr;
            },
            list() {
                this.loading = false;
                this.$ajax.post('/user/menus').then(res => {
                    //对接口数据的 处理
                    let _data = res.data.data;
                    if (_data.length) {
                        var resultArr = (this.resultMenusData(_data[0].menu));
                        if (resultArr.length) {
                            resultArr.map((item, i) => {
                                //新增属性
                                item.pId = item.parentId;
                                item.hostname = item.url;
                                if (item.children.length == 0) {
                                    item.isParent = '0'
                                }
                            });
                        }
                        ;
                        this.data = resultArr;
                        this.$bus.$emit('menu', false);
                        this.loading = false;
                    }
                    ;
                    this.loading = false;
                });
            },
            navOne(data) {
                return data.filter(res => res.pId == 0);
            },
            navTwo(id, index, e) {
                // 显隐判断依据
                this.id = index;
                this.showTwo = !this.showTwo;
                // 右边＋号显隐
                this.classNun = index;
                this.dataTwo = this.data.filter(res => res.pId === id);
                // 左侧border
                if (!this.showTwo) this.classNun = null;
                // 重置三级菜单
                this.dataThree = [];
            },
            navTowHover(name){
                this.navStatus(name, false);
            },
            navTowOut(name){
                this.navStatus(name, true);
            },
            navStatus(name,flag){
                if(name==='销售渠道管理'){
                    this.isHover1 = flag;
                }else if(name==='拓展功能维护'){
                    this.isHover2 = flag;
                }else if(name==='经销商分级管理'){
                    this.isHover3 = flag;
                }else if(name==='基础配置管理'){
                    this.isHover4 = flag;
                }
            },
            goFour(id) {
                this.dataFour = [];
                let arr = [];
                //   this.data.map((item, index) => {
                //     if (item.parentIds !== null) {
                //     if (item.parentIds.split("/").length ===4  && item.parentIds.indexOf('/'+id+'/')>-1) {
                //       arr.push(item);
                //     }
                //   }
                // })
                var filterData = this.data.filter(x => x.pId == id);
                this.dataFour = arr;
            },
            navThree(id, index) {
                this.dataThree = this.data.filter(res => res.pId === id);
                // 加载第四季菜单(过滤四级菜单所处的二级菜单的位置，并通过watch监听区分属于哪个三级菜单)
                this.goFour(id);
                this.showThree = true;
                this.navStyle.border = 'none';
            },
            navThreeOut() {
                this.showThree = !this.showThree;
                this.navStyle.width = '200px';
                this.navStyle.border = '1px solid rgb(247, 247, 248)';
                this.fourHeight = "auto";
            },
            navTwoOut() {
                this.navStyle.width = '200px';
                this.navStyle.border = '1px solid rgb(247, 247, 248)';
            }
        },
        watch: {
            id(index) {
                this.showTwo = true;
                this.classNun = index;
            },
            showTwo(val) {
                if (!val) {
                    this.navStyle.width = '200px';
                    this.navStyle.border = '1px solid rgb(247, 247, 248)';
                }
            },
            dataThree(val) {
                if (val.length === 0) this.navStyle.width = '200px';
            },
            dataFour(val) {
                let a = `${document.documentElement.clientHeight + 570}px`;
                this.fourHeight = a;
                if (val.length > 0) {
                    this.navStyle.width = '800px';
                    this.navFourStatus = true;
                } else {
                    this.navStyle.width = '400px';
                    this.navFourStatus = false;
                }
            }
        },
        directives: {//滚动条组件
            slimScroll
        },
        created() {
            this.list();
            this.scrollConfig = !this.scrollConfig;
        },
        components: {
            loading
        },
        mounted() {
            let navHeight = $(window).height() - $('.po-header').outerHeight() - 40;
            $('.po-left').css({"height": navHeight});
        },

    }
</script>
<style lang="less" scoped>
    .thirdNavPoint {
        color: #4f4f4f;
    }

    .fourNav {
        span {
            display: inline-block;
            padding-left: 50px;
            cursor: pointer;
            a {
                color: #4f4f4f;
            }
        }
        float: left;
    }

    .fourNav:hover {
        color: #3687fb;
    }

    .nav3 {
        span:hover {
            color: #3687fb;
        }
    }

    .nav4 {
        width: 600px !important;
    }

    .nav4 > a {
        display: block;
    }

    .firstNav {
        > a {
            > span.po-noimg {
                display: inline-block;
                /*margin-left: 35px;*/
            }
        }
        > a.active {
            > span.po-noimg {
                display: inline-block;
                /*margin-left: 35px;*/
            }
        }
    }
    .secondNav {
        background: #FFF;
        li {
            position: relative;
            ul {
                position: absolute;
                left: 183px;
                top: 0;
            }
        }
        > li:hover {
            a {
                background: #edeff0;
            }
        }
    }

    .thirdNav {
        margin: 5px 0 0;
        background: #fff;
        box-shadow: 2px 0px 6px 1px rgba(0, 0, 0, 0.08);
        > li {
            margin-bottom: 5px;
            > a {
                background: #fff !important;
                margin: 5px 0;
                position: absolute;
                left: 0;
                width: 100%;
                height: inherit;
                transition: all 0.1s ease-in-out;

            }
        }
    }

    .po-content-scroll {
        position: relative;
        top: 10px;
        .active {
            display: block;
            background: #465885;
        }
        li {
            margin-left: 17px;
            width: 183px;
            height: auto;
            min-height: 35px;
            line-height: 35px;
            color: rgb(79, 79, 79);
            font-weight: 300;
            font-size: 12px;
            position: relative;
        }
        li:hover {
            cursor: pointer;
        }
        > li {
            height: auto;
            min-height: 35px;
            line-height: 35px;
            color: rgb(79, 79, 79);
            font-weight: 300;
            font-size: 12px;
            position: relative;
            left: -17px;
            > a {
                position: absolute;
                left: 17px;
                width: 100%;
                height: inherit;
                transition: all 0.1s ease-in-out;
                border-top-left-radius: 18px;
                border-bottom-left-radius: 18px;
                transition: all .2s ease-in ;
            }
            > ul {
                margin-top: 35px;
                > li {
                    > a {
                        margin: 5px 0;
                        position: absolute;
                        left: 0;
                        width: 100%;
                        height: inherit;
                        transition: all 0.1s ease-in-out;
                        border-top-left-radius: 18px;
                        border-bottom-left-radius: 18px;
                    }
                }
            }
        }
        > li:hover {
            > a {
                background: #465885;
                > span {
                    color: #FFF;
                }
            }
        }
        .po-pic {
            display: inline-block;
            width: 18px;
            height: 18px;
            vertical-align: middle;
            margin-left: 10px;
            margin-top: -13px;
            img {
                height: 100%;
                width: 100%;
            }
        }
        .po-noimg {
            margin-left: 8px;
            color: #4f4f4f;
            font-weight: bolder;
        }
        a.active {
            .po-noimg {
                margin-left: 8px;
                color: #FFF;
            }
            .po-close {
                color: #FFF;
            }
            .po-close:after {
                color: #FFF;
            }
        }
    }

    .po-left {
        width: 200px;
        overflow-y: scroll;
        top: 70px;
        position: fixed;
        height: 100%;
        z-index: 99;
        //background: #FFF;
    }

    .po-left::-webkit-scrollbar {
        display: none;
    }

    .po-plus {
        font-family: "pictos";
    }

    .po-close {
        font-family: "pictos";
    }

    .po-plus:after {
        content: "\e901";
        color: #C9CDD6;
        position: absolute;
        left: 164px;
        top: 0;
        z-index: 99;
        font-size: 14px;
        fomt-weight: bold;
    }

    .po-close:after {
        content: "\e900";
        color: #C9CDD6;
        position: absolute;
        left: 164px;
        top: 0;
        z-index: 99;
        font-size: 14px;
        fomt-weight: bold;
    }

    .po-content-scroll .po-margin {
        margin-left: 40px;
    }

    #animationTwo {
        -webkit-animation: fadeInDown 1s .1s ease both;
        -moz-animation: fadeInDown 1s .1s ease both;
    }

    @-webkit-keyframes fadeInDown {
        0% {
            opacity: 0;
            -webkit-transform: translateY(-20px)
        }
        100% {
            opacity: 1;
            -webkit-transform: translateY(0)
        }
    }

    @-moz-keyframes fadeInDown {
        0% {
            opacity: 0;
            -moz-transform: translateY(-20px)
        }
        100% {
            opacity: 1;
            -moz-transform: translateY(0)
        }
    }

    #animationThree {
        -webkit-animation: fadeInLeft 1s .1s ease both;
        -moz-animation: fadeInLeft 1s .1s ease both;
    }

    @-webkit-keyframes fadeInLeft {
        0% {
            opacity: 0;
            -webkit-transform: translateX(-20px)
        }
        100% {
            opacity: 1;
            -webkit-transform: translateX(0)
        }
    }

    @-moz-keyframes fadeInLeft {
        0% {
            opacity: 0;
            -moz-transform: translateX(-20px)
        }
        100% {
            opacity: 1;
            -moz-transform: translateX(0)
        }
    }
</style>
