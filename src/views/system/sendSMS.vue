<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <el-form label-width="80px" class="demo-ruleForm" size="small">
        <el-form-item label="收件号码">
          <el-input
            type="textarea"
            :rows="12"
            v-model="payload.telephoneList"
            placeholder="可以输入多个号码，用英文逗号,隔开"
          ></el-input>
        </el-form-item>
        <el-form-item label="短信内容">
          <el-input type="textarea" :row="3" v-model="payload.smsContent" placeholder="短信内容，不宜太长。"></el-input>
        </el-form-item>
      </el-form>
      <div class="around-center m-v-15">
        <div>
          <el-button @click="payload.telephoneList='';payload.smsContent='';responseData={}">重 置</el-button>
          <el-button type="primary" @click="sendSMS" class="m-l-40">确认</el-button>
        </div>
      </div>
      <div v-show="responseData.code==200" class="font14 color-606266 m-l-15">
        <span>发送成功的个数：</span>
        <span class="color-303133 m-r-10">{{responseData.title}}</span>
        <span v-show="responseData.data">发送失败的号码：</span>
        <span class="color-303133 m-r-10">{{responseData.data}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "sendSMS",
  data() {
    return {
      payload: {
        // 电话号码
        telephoneList: "",
        // 短信内容
        smsContent: ""
      },
      // 发送之后的相应结果
      responseData: {}
    };
  },
  methods: {
    // 发送短信
    async sendSMS() {
      this.$store.dispatch("app/getPlatformList", this.payload).then(() => {
        this.responseData = res;
        this.common.go_alert("发送成功");
      });
    }
  },
  mounted() {}
};
</script> 