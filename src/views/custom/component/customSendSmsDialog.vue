<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showSendSMSDialog"
    width="740px"
    :title="'给['+customInfo.Realname+']发送短信'"
  >
    <div class="basicInfo">
      <el-form :model="sendSmsMSG" label-width="100px" class="dialog-body-pad">
        <el-form-item label="短信内容">
          <el-input
            type="textarea"
            :rows="3"
            v-model="sendSmsMSG.Content"
            @input="inputForceUpdate()"
            maxlength="70"
            minlength="3"
            show-word-limit
            placeholder="请输入短信内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="around-center hgt60 bge0e3ea">
        <div>
          <el-button @click="showSendSMSDialog=false">取 消</el-button>
          <el-button type="primary m-l-40" @click="sendSMS">发 送</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      // 是否显示客户模态框
      showSendSMSDialog: false,
      // 客户信息表单数据
      customInfo: {},
      //发送短信的内容。包括电话和短信内容
      sendSmsMSG: {}
    };
  },

  methods: {
    // 获取客户的单条数据
    getCustomRowData(row) {
      // 初始化数据
      this.showSendSMSDialog = true;
      this.customInfo = {};
      this.sendSmsMSG = {};
      this.customInfo = { ...row };
      this.sendSmsMSG.Telephone = this.customInfo.Telephone;
      this.sendSmsMSG.Content =
        this.customInfo.Realname +
        ",你好，你最近还在找工作没。我这边是成都阿多比设计的老师，我们在招UI设计师学徒。不知道你这边有没有兴趣";
    },
    getContent() {
      return this.sendSmsMSG.Content;
    },
    closeDialog() {
      this.showSendSMSDialog = false;
    },

    // 发送短信
    sendSMS() {
      if (
        this.sendSmsMSG.Content.length >= 3 &&
        this.sendSmsMSG.Content.length <= 70
      ) {
        this.$emit("sendSMS", this.sendSmsMSG);
      } else {
        this.common.go_alert("请输入3-70个字符");
      }
    },
    // 强制刷新
    inputForceUpdate() {
      this.$forceUpdate();
    }
  },
  mounted() {}
};
</script> 
<style scoped>
</style>