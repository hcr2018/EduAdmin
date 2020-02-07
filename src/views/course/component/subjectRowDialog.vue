<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowSubjectDialog"
    width="740px"
    title="创建科目"
  >
    <!-- 高校专业的表单 -->
    <div class="subjectInfo">
      <el-form
        ref="refSubjectElForm"
        :model="subjectRowData"
        :rules="subjectFormRules"
        label-width="100px"
        size="small"
        class="dialog-body-pad"
      >
        <el-form-item label="名称" prop="Label">
          <el-tooltip class="item" effect="dark" content="学科教材的名字一经填写,不允许再修改" placement="top-start">
            <el-input v-model="subjectRowData.Label" :disabled="subjectRowData.Id>0" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="章节数" prop="Topic">
          <el-input v-model.number="subjectRowData.Topic" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="subjectRowData.Description" />
        </el-form-item>

        <el-form-item label="学院">
          <el-select v-model="collegeIndex" placeholder="请选择学院" @change="collegeChange">
            <el-option
              v-for="(item,index) in common.collegeWithCouseKindList"
              :key="index"
              :label="item.Label"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程大类">
          <el-select v-model="subjectRowData.Coursekind" placeholder="请选择课程分类">
            <el-option
              v-for="(item,index) in courseKindsOps"
              :key="index"
              :label="item.Label"
              :value="item.Label"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="around-center hgt60 bge0e3ea">
        <div>
          <el-button @click="isShowSubjectDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveSubjectFormData">确 认</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { editBook, addBook } from '@/api/book'
import common from '@/utils/common'
export default {
  data() {
    return {
      common,
      // 显示科目弹窗
      isShowSubjectDialog: false,
      // 科目的表单数据
      subjectRowData: {},
      // 选中的学院的index
      collegeIndex: 0,
      courseKindsOps: [],
      // 表单验证
      subjectFormRules: {
        Label: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        Topic: [{ required: true, message: '请输入章节数', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  methods: {
    // 获取获取科目数据
    getSubjectRow(row) {
      this.collegeIndex = 0
      this.subjectRowData = {}
      this.courseKindsOps = []
      this.subjectRowData = row
      if (this.subjectRowData.Id == 0) {
        this.collegeChange(0)
        this.subjectRowData.Content = '[]'
      }
      this.isShowSubjectDialog = true
    },
    // 保存添加或编辑数据
    saveSubjectFormData() {
      // 验证表单数据
      this.$refs.refSubjectElForm.validate(async valid => {
        if (valid) {
          let res
          if (this.subjectRowData.Id > 0) {
            // 编辑科目
            res = await editBook(
              this.subjectRowData.Id,
              this.subjectRowData
            )
            if (res.code == 200) {
              this.common.go_alert('修改成功！')
              this.isShowSubjectDialog = false
              this.$emit('subClickEvent', 0, res.data)
            }
          } else {
            // 创建科目
            res = await addBook(this.subjectRowData)
            if (res.code == 200) {
              this.common.go_alert('创建成功！')
              this.$emit('subClickEvent', 1, res.data)
              this.subjectRowData = {}
              this.isShowSubjectDialog = false
            }
          }
        } else {
          return false
        }
      })
    },
    // 选中学院后回调选中课程大类
    collegeChange(selVa) {
      this.subjectRowData.Coursekind = ''
      if (this.common.collegeWithCouseKindList[selVa].Children) {
        this.courseKindsOps = [
          ...this.common.collegeWithCouseKindList[selVa].Children
        ]
        if (this.courseKindsOps.length > 0) {
          this.subjectRowData.Coursekind = this.courseKindsOps[0].Label
        }
      }
    }
  }
}
</script>
<style scoped>
.subjectInfo >>> .el-select {
  width: 100%;
}
.subjectInfo >>> .el-date-editor {
  width: 100%;
}
</style>
