<template>
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <el-form label-width="80px" class="demo-ruleForm" size="small">
        <el-form-item label="收件号码">
          <el-input
            v-model="payload.telephoneList"
            type="textarea"
            :rows="12"
            placeholder="可以输入多个号码，用英文逗号,隔开"
          />
        </el-form-item>
        <el-form-item label="短信内容">
          <el-input v-model="payload.smsContent" type="textarea" :row="3" placeholder="短信内容，不宜太长。" />
        </el-form-item>
      </el-form>
      <div class="around-center m-v-15">
        <div>
          <el-button @click="payload.telephoneList='';payload.smsContent='';responseData={}">重 置</el-button>
          <el-button type="primary" class="m-l-40" @click="sendSMS">确认</el-button>
        </div>
      </div>
      <div v-show="responseData.code==200" class="font14 color-606266 m-l-15">
        <span>发送成功的个数：</span>
        <span class="color-303133 m-r-10">{{ responseData.title }}</span>
        <span v-show="responseData.data">发送失败的号码：</span>
        <span class="color-303133 m-r-10">{{ responseData.data }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sendSMS',
  data() {
    return {
      payload: {
        // 电话号码
        telephoneList: '',
        // 短信内容
        smsContent: ''
      },
      // 发送之后的相应结果
      responseData: {}
    }
  },
  mounted() {},
  methods: {
    // 发送短信
    async sendSMS() {
      this.$store.dispatch('app/getPlatformList', this.payload).then(() => {
        this.responseData = res
        this.common.go_alert('发送成功')
      })
    }
  }
}
</script>
