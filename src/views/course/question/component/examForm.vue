<template>
  <!-- 子菜单 -->
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="examFormDialog"
      width="740px"
       size="small"
      :title="formTitle"
    >
      <el-form :model="examForm" label-width="105px" size="small" class="dialog-body-pad">
        <el-form-item
          label="名称"
          prop="Label"
          :rules="[
      { required: true, message: '名称不能为空', trigger: 'blur'}
    ]"
        >
          <el-input v-model="examForm.Label" autocomplete="off" placeholder="请输入组卷名称"></el-input>
        </el-form-item>
        <el-form-item
          label="考试时间(分)"
          prop="Examtime"
          :rules="[
      { required: true, message: '请输入考试时间', trigger: 'blur' },
    ]"
        >
          <el-input v-model="examForm.Examtime" autocomplete="off" placeholder="请输入考试时间"></el-input>
        </el-form-item>
        <el-form-item label="是否上架">
          <el-radio v-model="examForm.State" :label="1">上架</el-radio>
          <el-radio v-model="examForm.State" :label="0">下架</el-radio>
        </el-form-item>
      </el-form>
      <div class="around-center hgt60 bge0e3ea">
        <div>
          <el-button @click="examFormDialog=false">取 消</el-button>
          <el-button type="primary" @click="editOKMockExamIten" class="m-l-40">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addExam,editExam} from "@/api/course";
export default {
  data() {
    return {
      // 考卷的表单数据
      examForm: {},
      //  组卷的模态框
      examFormDialog: false,
      // 表单的名称
      formTitle: ""
    };
  },
  methods: {
    // 获取子组件传递过来的表单数据
    getFormData(rowData, title) {
      this.examForm = {};
      this.examForm = { ...rowData };
      this.examFormDialog = true;
      this.formTitle = title;
    },
    // 编辑或者新增卷子
    async editOKMockExamIten() {
      if (this.examForm.Id == 0) {
        let res = await  addExam(1, this.examForm);
        if (res.code == 200) {
          this.examFormDialog = false;
          this.common.go_alert("添加成功 !");
          this.$emit("subClick", 1, res.data);
        }
      } else if (this.examForm.Id > 0) {
        let res = await  editExam(this.examForm.Id, this.examForm);
        if (res.code == 200) {
          this.examFormDialog = false;
          this.common.go_alert("修改成功 !");
          this.$emit("subClick", 0, res.data);
        }
      }
    }
  }
};
</script>
<style scoped >
</style>
