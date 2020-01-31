<template>
  <div class="xbb-view">
    <template v-if="isWebsocketWorking && isChrome">
      <!-- 正常状态 -->
      <div v-if="currentStatus === 0" class="normal-status">
        <div class="dial">
          <el-input
            v-model="callForm.phoneNum"
            placeholder="请输入电话号码"
            class="input-with-select"
            @keyup.native.enter="makeCall(callForm.phoneNum)"
          >
            <el-button slot="append" type="primary" @click="makeCall(callForm.phoneNum)">拨号</el-button>
          </el-input>
        </div>
        <div class="call-log">
          <h4 class="title">最近通话</h4>
          <ul class="call-list">
            <li
              v-for="(item, index) in callLogList"
              :key="index"
              class="item"
            >
              <span class="status" :class="{red: !item.result}">
                <i :class="[item.type ? 'web-icon-callout' : 'web-icon-callin']" />
              </span>
              <div class="infos">
                <p class="phone-num" @click="makeCall(item.anotherPhoneNum)">{{ item.hiddenPhoneNum }}</p>
                <p class="name">{{ item.refName }}</p>
              </div>
              <span class="date">{{ item.callTimeShow | formatDate }}</span>
            </li>
            <li v-if="!callLogList.length" class="empty">暂无通话记录</li>
          </ul>
        </div>
      </div>

      <div v-else class="incall-status">
        <div class="calling">
          <div v-if="btnNumShow&&currentStatus===3" class="box btn-num">
            <div class="tap-content"><span ref="tapTarget" /></div>
            <div class="numeric-keyboard">
              <!-- *样式需要单独调整 -->
              <span v-for="item in btnNum" :key="item" class="btn-key" @click="numTap($event)"><i>{{ item }}</i></span>
            </div>
          </div>
          <div v-else class="box info">
            <div class="tap-content">{{ phoneNumForShow }}</div>
            <div class="owner-name">{{ callForm.customerName }}</div>
            <div class="call-status">{{ statusName }}</div>
          </div>
          <div class="btn-group">
            <span class="web-icon-dial hang-up" @click="handleOption(7)" />
            <span v-if="currentStatus === 1" class="web-icon-dial pick-up" @click="handleOption(6)" />
            <span v-if="currentStatus===3" class="to-btn" @click="btnNumShow=!btnNumShow"><i :class="btnNumShow?'el-icon-close':'web-icon-Oval'" /></span>
          </div>
        </div>
      </div>
    </template>
    <div v-else-if="isWebsocketWorking && !isChrome" class="is-not-chrome">
      <p class="text">抱歉，您的浏览器不支持呼叫中心，请使用Chrome浏览器进行访问 </p>
    </div>
    <div v-else class="websocket-error">
      <h4 class="title">呼叫中心连接异常</h4>
      <p class="text">1. 请检查话机盒子是否已连接，相关线缆是否插牢；</p>
      <p class="text">2. 请检查call应用是否已经安装并启用（客户端下载地址:  ）；</p>
      <p class="text">3. 如以上问题排查后，问题仍未解决，请联系管理员或客服解决。</p> 
    </div>
    <audio ref="ring" loop>
      <source src="./imgs/ring.mp3" type="audio/mp3">
    </audio>
  </div>
</template>

<script>
import * as api from 'src/api'
import { mapActions } from 'vuex'
import { Message } from 'element-ui'

// websocket
let websocket = null

// 监听窗口关闭事件，当窗口关闭时，主动关闭websocket链接
window.onbeforeunload = function() {
  console.log('界面异常关闭，断开WebSocket连接')
  if (websocket !== null) {
    websocket.close()
  }
}

export default {
  name: 'XbbView',

  filters: {
    formatDate(val) {
      const seconds = new Date(val).getTime() / 1000
      return utils.formatTimeCompare(seconds)
    }
  },

  data() {
    return {
      callLogList: [], // 通话记录列表
      currentStatus: 0, // 当前状态 0空闲, 1来电, 2呼叫中, 3通话中
      callForm: {
        phoneNum: '', // 电话号码
        customerName: '' // 客户
      },
      refInfos: {}, // 号码关联信息
      isWebsocketWorking: false, // websocket链接状态
      // 发送给服务端的基本参数
      basicParams: {
        corpid: this.$cookies.get('corpid') || '1',
        userId: this.$cookies.get('userid') || '1',
        messageType: '1',
        message: {}
      },
      phoneNumForShow: '',
      timeout: null,
      // 滚动的标题
      scrollTitle: '',
      // 弹窗提醒的实例
      notify: null,
      isChrome: navigator.userAgent.indexOf('Chrome') > -1,
      btnNumShow: false, // 控制小键盘是否显示
      btnNum: [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#']
    }
  },

  computed: {
    statusName() {
      if (this.currentStatus === 1) {
        return '来电...'
      } else if (this.currentStatus === 2) {
        return '呼叫中...'
      } else if (this.currentStatus === 3) {
        return '通话中...'
      } else {
        return ''
      }
    }
  },

  watch: {
    // 监听当前呼叫状态
    currentStatus(val) {
      // 来电
      if (val === 1) {
        this.checkNotification()
      } else {
        this.closeNotify()
      }
    },
    btnNumShow(val) {
      if (val) {
        document.addEventListener('keyup', this.keyboardEvent)
      } else {
        document.removeEventListener('keyup', this.keyboardEvent)
      }
    }
  },

  mounted() {
    this.initWebSocket()
    this.getCalllog()
    this.resetCallme()
  },

  methods: {
    ...mapActions([
      'updateMissCallCount' // 更新未接来电数
    ]),
    // 初始化websocket
    initWebSocket() {
      // 判断当前浏览器是否支持Websocket
      if ('WebSocket' in window) {
        /* eslint-disable no-undef */
        websocket = new WebSocket('wss://localhost:4649/Echo') // 本地 WebSocket 地址

        // 链接发生错误
        websocket.onerror = event => {
          console.warn('WebSocket 连接失败，请注意！')
          this.isWebsocketWorking = false
        }

        // 连接成功建立的回调方法
        websocket.onopen = event => {
          console.log('建立 WebSocket 连接成功！')
          this.isWebsocketWorking = true
          setTimeout(() => {
            websocket.send(JSON.stringify(this.basicParams))

            this.getCurrentCalllog()
          }, 200)
        }

        // 接收到消息的回调方法
        websocket.onmessage = event => {
          if (!event.data) {
            return
          }
          const data = JSON.parse(event.data)

          // 事件回调
          if (!data.code) {
            const callbackType = data.callbackType // 回调类型
            if (callbackType !== 0) {
              this.handleCallback(callbackType, data.message)
            }
          } else if (data.code !== 1) {
            console.warn('error', data.code, data.msg)
          }
        }

        // 连接关闭的回调方法
        websocket.onclose = event => {
          // console.log('关闭了WebSocket连接')
          websocket = null
          // console.log('尝试重新连接 WebSocket')
          this.initWebSocket()
        }
      } else {
        this.$message({
          type: 'error',
          message: '当前浏览器不支持 WebSocket，请升级或更换浏览器！'
        })
      }
    },

    // 键盘联动
    keyboardEvent(evt) {
      if (evt.shiftKey) {
        if (evt.keyCode === 51 || evt.keyCode === 56) {
          this.numTap(evt)
        }
      } else {
        if (evt.keyCode >= 48 && evt.keyCode <= 57) {
          this.numTap(evt)
        }
      }
    },

    numTap(evt) {
      const val = evt.key ? evt.key : evt.target.innerText
      // 显示用户输入的内容
      this.$refs.tapTarget.innerText += val
      // 长度超过9显示省略号
      if (this.$refs.tapTarget.innerText.length > 9) {
        const str = this.$refs.tapTarget.innerText
        this.$refs.tapTarget.innerText = '...' + str.slice(str.length - 9, str.length)
      }
      this.handleOption(9, val)
    },

    // 监听用户主动操作
    handleOption(type, phoneNum = this.callForm.phoneNum) {
      // @type 5拨打 6接听 7挂断
      const sendData = Object.assign({}, this.basicParams)
      sendData.messageType = type
      // 拨打电话
      if (type === 5) {
        // 格式化电话号码
        const tel = phoneNum.replace(/[\s, \-, (, )]/g, '')

        // 获取客户信息
        this.getCustomerInfo(tel)

        sendData.message = {
          phoneNumber: tel
        }
        this.currentStatus = 2
      // 拨打电话
      } else if (type === 6) {
        this.currentStatus = 3
      // 挂断电话
      } else if (type === 7) {
        this.currentStatus = 0

        // 挂断后，清空相关信息
        this.clearInfos()
      // 小键盘
      } else if (type === 9) {
        sendData.message = {
          number: phoneNum
        }
      }

      this.emitCallStatus(type, phoneNum)
      websocket.send(JSON.stringify(sendData))

      this.getCurrentCalllog()
    },

    // 重置呼叫方法
    resetCallme() {
      // 拨打电话
      window.CALL_CENTER.callme = tel => {
        this.makeCall(tel)
      }
    },

    // 防骚扰请求
    disturb(phone, cb) {
      const url = '/callcenter/customer/disturb.do'
      api.post(url, { phone }, (data) => {
        cb(phone)
      })
    },

    // 拨打电话
    makeCall(phone) {
      phone = phone.trim()
      if (!phone) {
        Message({
          type: 'error',
          message: '您所拨打的号码不存在'
        })
        return
      }

      // 防骚扰请求
      this.disturb(phone, () => {
        this.handleOption(5, phone)
      })
    },

    // 监听被动操作
    handleCallback(type, message) {
      // 来电
      if (type === 1) {
        console.log('来电回���', message)
        this.currentStatus = type

        this.$set(this.callForm, 'phoneNum', message.phoneNumber)
        // 获取客户信息
        this.getCustomerInfo(message.phoneNumber)

      // 挂断
      } else if (type === 2) {
        // 挂断后，清空相关信息
        console.log('挂断回调', message)
        this.currentStatus = 0
        this.clearInfos()
      // 通话结束
      } else if (type === 3) {
        console.log('通话结束回调', message)
        const callLog = {
          moduleType: 305,
          startTime: new Date(message.startTime).getTime() / 1000,
          endTime: new Date(message.endTime).getTime() / 1000,
          answerTime: message.answerTime ? new Date(message.answerTime).getTime() / 1000 : null,
          anotherPhoneNum: message.number,
          type: message.callType === '来电' ? 0 : 1,
          recordUrl: message.recordUrl, // 录音文件
          connectTime: '', // 拿不到
          agentPhoneNum: '' // 拿不到
        }
        this.currentStatus = 0
        // connectState
        this.saveCalllog(callLog)
      // 通话接听回调
      } else if (type === 6) {
        this.currentStatus = 3
        console.log('接听通话')

      // 获取客户端软硬件信息
      } else if (type === 101) {
        this.sendClientInfo(message)
        return
      }
      this.emitCallStatus(type, message.phoneNumber)
    },

    // 将xbb的呼叫状态格式化后，向上提交
    emitCallStatus(type, phoneNum) {
      console.log('emit', type)
      // 通话状态 0 来电 1 呼出 2 通话中 3 正常
      if (type === 1) {
        this.$emit('callStatus', 0, phoneNum)
        this.$emit('openCallPanel', true)
      } else if (type === 5) {
        this.$emit('callStatus', 1, phoneNum)
        this.$emit('openCallPanel', true)
      } else if (type === 6) {
        this.$emit('callStatus', 2)
      } else if (type === 7 || type === 2) {
        this.$emit('callStatus', 3)
      }
    },

    // 保存通话记录
    saveCalllog(callLog) {
      const url = '/callcenter/callLog/save.do'
      const params = Object.assign({}, callLog, this.refInfos)
      api.post(url, params, (response) => {
        // 更新未接来电数量
        const missCallLogSum = response.missCallLogSum
        if (missCallLogSum) {
          this.updateMissCallCount(missCallLogSum)
        }
        this.getCalllog()

        // 清空关联信息
        this.refInfos = {}
      })
    },

    // 获取近期通话
    getCalllog() {
      const url = '/callcenter/callLog/list.do'
      const params = {
        moduleType: 305,
        page: 1,
        pageSize: 5
      }
      api.post(url, params, (data) => {
        this.callLogList = data.result.callLogList
      })
    },

    // 获取客户信息
    getCustomerInfo(phoneNum) {
      const url = '/callcenter/findRef.do'
      const params = {
        mobile: phoneNum
      }
      api.post(url, params, (data) => {
        this.refInfos = {
          refName: data.result.refName,
          refId: data.result.refId,
          refType: data.result.refType
        }
        this.phoneNumForShow = data.result.hiddenRefMobile
        // 设置客户名
        if (this.refInfos.refType === 3) {
          this.callForm.customerName = `${data.result.customerName}(${this.refInfos.refName})`
        } else {
          this.callForm.customerName = this.refInfos.refName
        }
      })
    },

    // 清空已有信息
    clearInfos() {
      this.callForm = {
        phoneNum: '',
        customerName: ''
      }
      this.phoneNumForShow = ''
    },

    // 获取当日通话统计，并通过websocket发送给话机
    getCurrentCalllog() {
      const url = '/callcenter/account/socketReckon.do'
      const params = { timeType: 1, type: 1 }
      api.post(url, params, (data) => {
        const callLog = data.callCenterAccountPojoList
        const sendData = {
          messageType: '99',
          message: {}
        }
        sendData.message.callTime = callLog.getCallTime
        sendData.message.callCount = callLog.totalCount
        sendData.message.successCallCount = callLog.successCount

        websocket.send(JSON.stringify(sendData))
        // 考虑到websocket有可能会丢包，2秒钟后再发一次
        setTimeout(() => {
          websocket.send(JSON.stringify(sendData))
        }, 2000)
      })
    },

    // 检查Notification APi
    checkNotification() {
      // 先检查浏览器是否支持
      if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification')

      // 检查用户是否同意接受通知
      } else if (Notification.permission === 'granted') {
        // If it's okay let's create a notification
        this.openNotify()

      // 否则我们需要向用户获取权限
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
          // 如果用户同意，就可以向他们发送通知
          if (permission === 'granted') {
            this.openNotify()
          }
        })
      }
    },

    // 关闭提醒
    closeNotify() {
      // 停止播放来电铃声
      this.controlRing(false)

      // 先检查浏览器是否支持
      if ('Notification' in window && this.notify) {
        this.notify.close()
      }
      clearTimeout(this.timeout)
      document.title = '教育中心'
    },

    // 弹出提醒
    openNotify() {
      const message = `${this.callForm.phoneNum} 正在呼入，请及时接听`
      this.notify = new Notification('呼入提醒', {
        lang: 'zh-CN',
        icon: '/static/img/slice/logo_title.png',
        body: message
      })

      // 滚动title
      this.scrollTitle = message
      this.scrollStart()

      // 播放来电铃声
      this.controlRing()
    },

    // 滚动title
    scrollStart() {
      clearTimeout(this.timeout)
      document.title = this.scrollTitle.substring(1, this.scrollTitle.length) + this.scrollTitle.substring(0, 1)
      this.scrollTitle = document.title.substring(0, this.scrollTitle.length)
      this.timeout = setTimeout(this.scrollStart, 100)
    },

    // 控制来电铃声
    controlRing(play = true) {
      const audio = this.$refs.ring
      if (play) {
        audio.play()
      } else {
        audio.pause()
        audio.currentTime = 0
      }
    },

    // 发送客户端信息
    sendClientInfo(clientInfo) {
      const params = Object.assign({ moduleType: 305 }, clientInfo)
      const url = '/callcenter/account/updateAccount.do'
      api.post(url, params, (data) => {
        console.log('发送客户端信息成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .xbb-view {
    height: 432px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    .normal-status {
      padding: 20px;
      overflow: hidden;
      .dial {
        padding: 10px 0;
      }
      .call-log {
        .title {
          line-height: 1;
          font-size: 14px;
          color: #666666;
          padding: 10px 0;
        }
        .call-list {
          border-bottom: 1px solid #E5ECF7;
          .item {
            display: flex;
            height: 50px;
            border-top: 1px solid #E5ECF7;
            box-sizing: border-box;
            .status {
              width: 35px;
              flex: 0 0 35px;
              text-indent: 5px;
              color: #C0C8D8;
              padding-top: 8px;
              &.red {
                color: red;
              }
            }
            .infos {
              flex: 1 1 auto;
              font-size: 12px;
              padding-top: 8px;
              overflow: hidden;
              text-overflow: ellipsis;
              .phone-num {
                color: #344762;
                margin-bottom: 7px;
                cursor: pointer;
              }
              .name {
                color: #929292;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            .date {
              width: 50px;
              flex: 0 0 50px;
              text-align: right;
              color: #929292;
              font-size: 12px;
              line-height: 1.4;
              padding-top: 6px;
            }
          }
          .empty {
            height: 50px;
            border-top: 1px solid #E5ECF7;
            line-height: 50px;
            text-align: center;
            font-size: 14px;
          }
        }
      }
    }
    .incall-status {
      background: url('./imgs/xbb-call-bg.png') center center no-repeat;
      background-size: 100% 100%;
      height: 100%;
      text-align: center;
      color: #ffffff;
      .calling{
        position: relative;
        padding: 30px 0;
        height: 100%;
        box-sizing: border-box;
        .box{
          height: 240px;
          box-sizing: border-box;
          &.info{
            padding-top: 15px;
          }
          &.btn-num{
            position: absolute;
            width: 100%;
          }
          .tap-content{
            font-size: 23px;
            letter-spacing: 2px;
            height: 24px;
            position: relative;
            overflow: hidden;
          }
          .owner-name {
            font-size: 12px;
            margin: 10px auto 0;
            text-align: center;
          }
          .call-status {
            margin-top: 40px;
            font-size: 16px;
            opacity: 0.8;
          }
          .numeric-keyboard{
            width: 204px;
            overflow: hidden;
            margin: 18px auto 0;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            .btn-key{
              border: 0;
              background: rgba(255, 255, 255, .3);
              width: 32px;
              height: 32px;
              text-align: center;
              line-height: 32px;
              border-radius: 50%;
              font-size: 20px;
              color: #fff;
              margin: 9px 18px;
              outline: none;
              position: relative;
              cursor: pointer;
              &:hover{
                background: rgba(255, 255, 255, .2);
              }
              i{
                font-style: normal;
              }
              &:nth-of-type(10){
                i{
                  position: absolute;
                  top: 3px;
                  left: 8px;
                  font-size: 28px;
                }
              }
            }
          }
        }
        .btn-group {
          position: absolute;
          width: 100%;
          bottom: 30px;
          .web-icon-dial {
            font-size: 60px;
            margin: 0 28px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            display: inline-block;
            cursor: pointer;
            position: relative;
            transition: all 0.3s;
            &:after {
              content: "";
              position: absolute;
              width: 40px;
              height: 40px;
              background-color: #fff;
              left: 10px;
              top: 10px;
              z-index: -1;
              transition: all 0.3s;
            }
            &.pick-up {
              color: #65B35A;
              transform: rotate(-90deg);
            }
            &.hang-up {
              color: #FF6161;
              transform: rotate(136deg);
            }
          }
          .to-btn{
            background: rgba(255, 255, 255, .3);
            width: 30px;
            height: 30px;
            display: block;
            line-height: 30px;
            border-radius: 50%;
            position: absolute;
            top: 15px;
            right: 65px;
            cursor: pointer;
            &:hover{
              background: rgba(255, 255, 255, .2);
            }
            .web-icon-Oval{
              font-size: 12px;
            }
          }
        }
      }
    }
    .websocket-error {
      padding: 20px;
      .title {
        padding-bottom: 20px;
        font-size: 16px;
        color: #222222;
        text-align: center;
      }
      .text {
        font-size: 13px;
        color: #666666;
        line-height: 1.6;
        margin-bottom: 10px;
      }
      .tel {
        color: #333333;
        font-size: 14px;
        margin-top: 10px;
      }
    }
    .is-not-chrome {
      position: relative;
      height: 100%;
      box-sizing: border-box;
      text-align: center;
      .text {
        position: absolute;
        top: 50%;
        left: 20px;
        right: 20px;
        margin-top: -20px;
        line-height: 1.6;
        color: #fc484f;
      }
    }
  }
</style>
 
