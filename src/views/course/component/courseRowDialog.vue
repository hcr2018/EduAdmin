<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowCourseDialog"
    width="740px"
    :title="courseRow.Id>0?'编辑课程':'新增课程'"
  >
   
    <div class="around-center hgt60 bge0e3ea">
      <div>
        <el-button @click="isShowCourseDialog=false">取 消</el-button>
        <el-button type="primary" class="m-l-40" @click="saveCourse">保 存</el-button>
      </div>
    </div>
    <!-- 图片预览 -->
    <my-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
  </el-dialog>
</template>
<script>
import fileAxios from 'axios'
import myImageViewer from '@/components/myImageViewer/myImageViewer'
import { addCourse, editCourse } from '@/api/course'
import common from '@/utils/common'
export default {
  components: {
    myImageViewer
  },
  data() {
    return {
      common,
      // 课程的表单数据
      courseRow: {},
      // 是否显示模态框
      isShowCourseDialog: false,
      // 预览图片的图片地址
      imageViewerSrc: '',
      // 显示图片查看器
      showViewer: false,
      // 学院默认选中第一项
      collegeIndex: 0,
      // 表单验证
      courseFormRules: {
        Price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
        CourseNum: [
          { required: true, message: '课时不能为空', trigger: 'blur' }
        ],
        Sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        Label: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ]
      },
     
    }
  },
  
  methods: {
    // 从父组件获取信息
    getCourseRowData(row) {
      this.imageViewerSrc = ''
      this.showViewer = false
      this.courseKindLabel = ''
      this.subjectListOps = []
      this.courseRow = row
      if (this.courseRow.Id > 0) {
        this.common.collegeWithCouseKindList.forEach((item, index) => {
          if (this.courseRow.TCollegeID == item.Id) {
            this.collegeIndex = index
          }
        })
      } else {
        this.collegeIndex = 0
      }
      this.collegeChangeGetCourseKind(this.collegeIndex)
      this.isShowCourseDialog = true
    },
   
   
    // 保存课程数据
    saveCourse: function() {
      this.$refs.refCourseForm.validate(async valid => {
        if (valid) {
          this.courseRow.CourseNum = parseInt(this.courseRow.CourseNum)
          if (this.courseRow.Id > 0) {
            const res = await editCourse(this.courseRow.Id, this.courseRow)
            if (res.code == 200) {
              this.$message('修改成功 !')
              this.$emit('subClickEvent', 0, res.data)
              this.isShowCourseDialog = false
            }
          } else {
            const res = await addCourse(this.courseRow)
            if (res.code == 200) {
              this.$message('添加成功 !')
              this.$emit('subClickEvent', 1, res.data)
              this.isShowCourseDialog = false
            }
          }
        } else {
          return false
        }
      })
    },
   
  }
}
</script>
<style scoped>
.el-tag {
  margin-right: 10px;
  margin-bottom: 5px;
}
.addSubject > p {
  margin-right: 10px;
}
</style>
