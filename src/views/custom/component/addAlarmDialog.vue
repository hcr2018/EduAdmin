<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowAlarmDialog"
    width="740px"
    title="添加提醒"
  >
    <div class="alarmFormCss">
      <el-form
        :model="alarmFormData"
        ref="refAlarmForm"
        :rules="alarmFormRules"
        class="dialog-body-pad"
         size="small"
        label-width="100px"
      >
        <el-form-item label="标题" prop="Title">
          <el-input v-model="alarmFormData.Title"></el-input>
        </el-form-item>
        <el-form-item label="提醒时间" prop="ExeTime">
          <el-date-picker
            v-model="alarmFormData.ExeTime"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="请选择提醒日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="提醒内容" prop="Content">
          <el-input type="textarea" :rows="3" v-model="alarmFormData.Content" placeholder="请输入提醒内容"></el-input>
        </el-form-item>
      </el-form>
      <div class="around-center hgt60 bge0e3ea">
        <div>
          <el-button @click="isShowAlarmDialog=false">取 消</el-button>
          <el-button type="primary" @click="saveAlarmFormData" class="m-l-40">确 认</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {  
  addAlarm
} from "@/api/alarm";
 
export default {
  data() {
    return {
      // 跟进提醒的表单数据
      alarmFormData: {
        Content: "",
        ExeTime: null,
        Title: ""
      },
      // 控制提醒表单的显隐
      isShowAlarmDialog: false,
      // 表单验证
      alarmFormRules: {
        Title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        ExeTime: [
          { required: true, message: "提醒时间不能为空", trigger: "blur" }
        ],
        Content: [
          { required: true, message: "提醒内容不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 获取客户的基本信息
    getCustomInfo(row) {
      this.alarmFormData = {
        Content: "",
        ExeTime: null,
        Title: ""
      };
      this.alarmFormData.Title =
        row.Realname + "(" + row.Sex + ")-" + row.Telephone + "的跟进提醒";
      this.isShowAlarmDialog = true;
    },
    // 保存添加的提醒
    saveAlarmFormData() {
      // 验证表单数据
      this.$refs.refAlarmForm.validate(async valid => {
        if (valid) {
          if (this.alarmFormData.ExeTime) {
            this.alarmFormData.ExeTime = parseInt(
              this.alarmFormData.ExeTime.getTime() / 1000
            );
          }
          let res = await addAlarm(this.alarmFormData);
          if (res.code == 200) {
            res.title = res.title ? res.title : 0;
            this.$store.dispatch("Alarm", res.title);
            this.common.go_alert("添加成功！");
            this.$emit("subClickEvent");
            this.isShowAlarmDialog = false;
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {}
};
</script> 
<style scoped>
.alarmFormCss >>> .el-select {
  width: 100%;
}
.alarmFormCss >>> .el-date-editor {
  width: 100%;
}
</style> 