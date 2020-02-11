<template>
  <div>
    <el-form
      ref="currentForm"
      :model="formItemData"
      :rules="subjectFormRules"
      label-width="100px"
      size="small"
      class="dialog-body-pad"
    >
      <el-form-item label="名称" prop="Label">
        <el-tooltip class="item" effect="dark" content="学科教材的名字一经填写,不允许再修改" placement="top-start">
          <el-input v-model="formItemData.Label" :disabled="formItemData.Id>0" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="章节数" prop="Topic">
        <el-input v-model.number="formItemData.Topic" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="formItemData.Description" />
      </el-form-item>

      <el-form-item label="学院">
        <el-select v-model="collegeIndex" placeholder="请选择学院" @change="collegeChange">
          <el-option
            v-for="(item,index) in $store.getters.app.collegeWithCourseKind"
            :key="index"
            :label="item.Label"
            :value="index"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程大类">
        <el-select v-model="formItemData.Coursekind" placeholder="请选择课程分类">
          <el-option
            v-for="(item,index) in courseKindsOps"
            :key="index"
            :label="item.Label"
            :value="item.Label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div>
      <el-button
        type="warning"
        v-show="!currenteditEnable"
        class="m-l-40"
        @click="currenteditEnable=true"
      >编辑</el-button>
      <el-button
        type="primary"
        v-show="currenteditEnable"
        class="m-l-40"
        @click="saveFormItemData"
      >确 认</el-button>
      <el-button v-show="currenteditEnable" @click="currenteditEnable=false">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { editBook, addBook } from "@/api/book";
export default {
  props: {
    // 校区的表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    editEnable: {
      typ: Boolean,
      default: false
    }
  },
  data() {
    return {
      currenteditEnable: this.editEnable,
      // 选中的学院的index
      collegeIndex: 0,
      //  科目的基本数据
      currentItemData: {},
      courseKindsOps: [],
      // 表单验证
      subjectFormRules: {
        Label: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        Topic: [{ required: true, message: "请输入章节数", trigger: "blur" }]
      }
    };
  },
  watch: {
    formItemData(newvar) {
      this.currentItemData = this.formItemData;
    }
  },

  mounted() {
    this.currentItemData = this.formItemData;
    this.collegeChange(0);
  },
  methods: {
    // 选中学院后回调选中课程大类
    collegeChange(selVa) {
      this.currentItemData.Coursekind = "";
      if (this.$store.getters.app.collegeWithCourseKind[selVa].Children) {
        this.courseKindsOps = [
          ...this.$store.getters.app.collegeWithCourseKind[selVa].Children
        ];
        if (this.courseKindsOps.length > 0) {
          this.currentItemData.Coursekind = this.courseKindsOps[0].Label;
        }
      }
    },
    // 保存添加或编辑数据
    saveFormItemData() {
      // 验证表单数据
      this.$refs.currentForm.validate(async valid => {
        if (valid) {
          let res;
          if (this.currentItemData.Id > 0) {
            // 编辑科目
            res = await editBook(this.currentItemData.Id, this.currentItemData);
            this.isShowPlatformDialog = false;
            this.formItemData = res.data;
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            // 创建科目
            res = await addBook("", "", this.currentItemData);
            this.isShowPlatformDialog = false;
            this.formItemData = res.data;
            this.$message({
              message: "添加成功",
              type: "success"
            });
          }
        } else {
          this.$message({
            message: "请完善表单",
            type: "warning"
          });
        }
      });
    },
    // 获取表单数据
    getSubjectRow(row) {
      this.currentItemData = {};
      this.currentItemData = row;
    }
  }
};
</script>
