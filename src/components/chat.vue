<template>
      <el-container style="height: 100%;">
        <el-main class="chat-main">
          <div class="friend-list">
            <el-row  style="height: 100%;">
              <el-col :span="4" class= "row">
                <el-card class="chatting-roster-content">
                  <span class="title"><i class="el-icon-s-custom"></i>好友</span>
                  <div class="chatting-roster-group-list">
                    <ul >
                      <li class="friend-item"  v-for="(roster, index) in rosterList" :key="index" :style="{background:(imTo.toName == roster.name)?'#3a3f45':''}" @click="toChats(roster)">
                        <!--未读消息数 -->
                        <el-badge :value="roster.unread" >
                        <div class="friend-name">
                        <i class="el-icon-s-comment"></i>
                        <div>
                          <div class="item" type="info" :class="(roster.name=='')?'':''"  size="small">{{roster.name}}</div>
                        </div>
                        </div>
                        <div class="msg">
                          <span v-if="roster.lastMsg" v-html="roster.lastMsg.sourceMsg"></span>
                        </div>
                        </el-badge>
                      </li>
                    </ul>
                  </div>
                </el-card>
              </el-col>
              <!-- 聊天信息 -->
              <el-col :span="20" class="chatting-main">
                    <div class="chatting-title">
                      <span style="font-size:25px;"> {{imTo.toName}} </span>
                    </div>
                    <el-scrollbar v-on:scroll.native="scrollHandler"  ref="chattingContent" class="chatting-content">
   
                      <div v-for="(item, index) in charts" :key="index" >
                        <div v-if="item.from" class="chatting-item clearfix" :class="item.className">
                          <div class="msg-date">
                            {{ item.timeStr }}
                          </div>
                          <div class="msg-from">
                            <span class="msg-author">{{ item.from}}</span>
                            <!-- 未读状态提醒？ -->
                            <!-- <img src="/static/images/im/kf-default.png" alt=""> -->
                          </div>
                          <div class="msg-content">
                            <Aplayer
                              v-if="item.objectURL && item.fileType == 'audio'"
                              mini
                              :music="{
                               src: item.objectURL
                              }"
                            ></Aplayer>
                            <Viewer v-if="item.url && item.fileType == 'image'" :images="[item.url]">
                              <img :src="item.url" width="200px"/>
                            </Viewer>
                            <span v-if="item.sourceMsg" v-html="item.sourceMsg"></span>
                          </div>
                        </div>
                      </div>
                     
                    </el-scrollbar>
                <!-- 输入区域 -->
                <div v-if="!!imTo.toName" class="chatting-input">
                  <el-row>
                    <el-col :span="2" >
                      <label class="chatting-btn-file">
                        <input @change="sendImageMessage($event)" ref="imageInput"
                              type="file"
                              multiple="false">
                        <i style="font-size:30px;" class="el-icon-folder-add"></i>
                      </label>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-row :span="20" class="left">
                        <el-input type="textarea" @keyup.enter.native="sendMessage" ref="textarea" v-model.trim="txt"></el-input>
                    </el-row>
                    <el-row :span="4" class="left">
                      <span>按Enter键快送发送!</span>
                      <el-button style="width:120px;" @click="sendMessage">发送</el-button>
                    </el-row>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-main>
      </el-container> 
</template>

<script>
import Viewer from '@/components/viewer'
import Easemob from '@/utils/easemob'
import {mapGetters} from 'vuex'
export default {
  name: 'HelloWorld',
  components: {
    Viewer
  },
  data () {
    return {
      msg: '?????',
      im: new Easemob(),
      txt: '',
      wrap: null,
      imTo: {
        chatType: '',
        toName: '',
        toId: ''
      },
      fileTrigger: true
    }
  },
  created () {
    // 初始im
    this.initIm()
  },
  mounted () {
    const chatsScrollBar = this.$refs['chatsScrollBar']
    if (chatsScrollBar) {
      this.wrap = chatsScrollBar.$refs['wrap']
      this.wrap.addEventListener('scroll', this.scrollHandler)
    }
  },
  computed: {
    // 用户
    rosterList () {
      return this.GET_IM_CHART_ROSTERLIST || []
    },
    groupList () {
      return this.GET_IM_CHART_GROUPLIST || []
    },
    // 聊天数据
    charts () {
      return this.GET_IM_CHART_DIALOG_GROUP_MESSAGE(this.imTo.toId) || []
    },
    // // 获取用户未读消息数
    // unread () {
    //   return this.GET_IM_CHART_DIALOG_UN_READ_LENGTH("chennan1");
    // },
    ...mapGetters({
      GET_IM_CHART_DIALOG_UN_READ_LENGTH:"GET_IM_CHART_DIALOG_UN_READ_LENGTH",
      GET_IM_CHART_ROSTERLIST: 'GET_IM_CHART_ROSTERLIST',
      GET_IM_CHART_GROUPLIST: 'GET_IM_CHART_GROUPLIST',
      GET_IM_CHART_DIALOG_GROUP_MESSAGE: 'GET_IM_CHART_DIALOG_GROUP_MESSAGE',
      GET_IM_CHART_DIALOG_GROUP_ID: 'GET_IM_CHART_DIALOG_GROUP_ID'
    })
  },
  watch: {
    charts (val, oldVal) {
      this.scrollToBottom()
    },
    // unread () {
    //   //更新未读消息数
    //   this.GET_IM_CHART_ROSTERLIST.forEach(element => {
    //       element.unread = this.GET_IM_CHART_DIALOG_UN_READ_LENGTH(element.name);
    //   });
    // }
  },
  methods: {
    initIm () {
      console.info(this.$route);
      let uname = this.$route.query.uname;
      let pwd = this.$route.query.pwd;
      // im 登陆
      this.im.login(uname, pwd)
    },
    // 发送消息
    sendMessage () {
      if (this.imTo.chatType === 'single') {
        // 会话
        // this.imTo.toId = "chennan1";   //test  给陌生人发消息
        this.im.sendTextMessage(this.txt, this.imTo.toId, () => {
        this.txt = ''
        })
      } else {
        // 组
        this.im.sendTextMessageGroup(this.txt, this.imTo.toId, () => {
          this.txt = ''
        })
      }
      
    },
    // 发送图片消息
    sendImageMessage () {
      if (!this.imTo.toId) {
        alert('发送对象必须')
        return
      }
      this.im.sendGroupImageMessage(this.$refs.imageInput, this.imTo.toId, () => {
        this.fileTrigger = !this.fileTrigger
        this.$nextTick(_ => {
          this.fileTrigger = !this.fileTrigger
        })
      },()=>{},'singleChat')
    },
    toChats (opt) {
      if (opt.groupid) {
        this.imTo = {
          chatType: 'group',
          toId: opt.groupid,
          toName: opt.groupname
        }
      } else {
        this.imTo = {
          chatType: 'single',
          toId: opt.name,
          toName: opt.name
        }
      }
      this.$store.dispatch("SET_IM_CHART_DIALOG_GROUP_ID",this.imTo.toName);
    },
    scrollHandler () {},
    // 滚动到底
    scrollToBottom () {
      this.$nextTick(_ => {
        this.$refs['chattingContent'].wrap.scrollTop = this.$refs['chattingContent'].wrap.scrollHeight
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>



