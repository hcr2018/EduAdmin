<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowTeacherDialog"
    width="740px"
    :title="teacherFormData.Id>0?'编辑用户':'新增用户'"
  >
    <div class="teacherInfo">
     
      <div class="around-center hgt60 bge0e3ea">
        <div>
          <el-button @click="isShowTeacherDialog=false">取 消</el-button>
          <el-button type="primary m-l-40" @click="saveFormItemData">保 存</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  editManager,
   addManager 
} from '@/api/manager'
import common from '@/utils/common'
export default {
 
  data() {
    return {
      common,
      // 是否显示模态框
      isShowTeacherDialog: false,
      // 老师的表单数据
      teacherFormData: {},
      // 表单验证
      teacherFormRules: {
        Realname: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2, message: "姓名至少两个字符", trigger: "blur" }
        ],
        Username: [
          { required: true, message: "昵称不能为空", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        role: [
          { required: true, message: "必须选择身份角色", trigger: "blur" }
        ],
        platformSelect: [
          { required: true, message: "至少选择一个校区", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 获取表单数据
    getTeacherRowData(row) {
      this.teacherFormData = {};
      this.teacherFormData = row;
      this.isShowTeacherDialog = true;

      if (this.teacherFormData.Platform) {
        this.teacherFormData.platformSelect = [];
        this.teacherFormData.platformSelect = this.teacherFormData.Platform.split(
          ","
        ).map(Number);
      }
    },
    
    // 强制刷新
    inputForceUpdate() {
      this.$forceUpdate();
    }
  }
};
</script>  
<style scoped>
.teacherInfo >>> .el-select,
.teacherInfo >>> .el-input-number--small {
  width: 100%;
}
</style>