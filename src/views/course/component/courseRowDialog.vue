<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowCourseDialog"
    width="740px"
    :title="courseRow.Id>0?'编辑课程':'新增课程'"
  >
    <el-form
      ref="refCourseForm"
      :model="courseRow"
      :rules="courseFormRules"
      label-width="110px"
      size="small"
      class="dialog-body-pad"
    >
      <div class="between-center">
        <el-form-item label="所属学院" class="flex_1">
          <el-select
            v-model="collegeIndex"
            placeholder="请选择学院"
            @change="collegeChangeGetCourseKind"
          >
            <el-option
              v-for="(item,index) in common.collegeWithCouseKindList"
              :key="index"
              :label="item.Label"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程类别" class="flex_1">
          <el-select v-model="courseRow.TCourseKindID" placeholder="请选择课程类别" @change="getBookList">
            <el-option
              v-for="(item,index) in CourseKindsOps"
              :key="index"
              :label="item.Label"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="between-center">
        <el-form-item label="宣传售价" prop="Price" class="flex_1">
          <el-input v-model="courseRow.Price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课时量" prop="CourseNum" class="flex_1">
          <el-input v-model.number="courseRow.CourseNum" autocomplete="off" />
        </el-form-item>
      </div>

      <div class="between-center">
        <el-form-item label="热门课程" class="flex_1">
          <el-radio v-model="courseRow.IsCollegeHot" :label="1">是</el-radio>
          <el-radio v-model="courseRow.IsCollegeHot" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="全科购买" class="flex_1">
          <el-radio v-model="courseRow.MustAllBook" label="1">是</el-radio>
          <el-radio v-model="courseRow.MustAllBook" label="0">否</el-radio>
        </el-form-item>
      </div>
      <el-form-item label="产品名称" prop="Label">
        <el-input v-model="courseRow.Label" required autocomplete="off" />
      </el-form-item>
      <div class="between-center">
        <el-form-item label="产品特征" class="flex_1">
          <el-input v-model="courseRow.Comments" autocomplete="off" />
        </el-form-item>
        <el-form-item label="展示排序" prop="Sort" class="flex_1">
          <el-input v-model.number="courseRow.Sort" autocomplete="off" />
        </el-form-item>
      </div>
      <el-form-item label="产品描述">
        <el-input v-model="courseRow.Description" type="textarea" :rows="4" autocomplete="off" />
      </el-form-item>
      <el-form-item label="产品缩略图">
        <div class="center">
          <el-input v-model="courseRow.Background" disabled class="m-r-12 flex_1" />
          <div>
            <el-upload
              v-loading="isbusy1"
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file, fileList){return uploadCOurseImg(file, fileList,1)}"
            >
              <el-button>上传</el-button>
            </el-upload>
          </div>
          <span class="m-l-15 wid60 cursor color-1890ff" @click="onPreview(courseRow.Background)">预览</span>
        </div>
      </el-form-item>
      <el-form-item label="教学体系图">
        <div class="center">
          <el-input v-model="courseRow.Jxtx" disabled class="m-r-12 flex_1" />
          <div>
            <el-upload
              v-loading="isbusy2"
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file, fileList){return uploadCOurseImg(file, fileList,2)}"
            >
              <el-button>上传</el-button>
            </el-upload>
          </div>
          <span class="m-l-15 wid60 cursor color-1890ff" @click="onPreview(courseRow.Jxtx)">预览</span>
        </div>
      </el-form-item>
      <el-form-item label="产品详情图">
        <div class="center">
          <el-input v-model="courseRow.Kcxq" disabled class="m-r-12 flex_1" />
          <div class="color-1890ff">
            <el-upload
              v-loading="isbusy3"
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file, fileList){return uploadCOurseImg(file, fileList,3)}"
            >
              <el-button>上传</el-button>
            </el-upload>
          </div>
          <span class="m-l-15 wid60 cursor color-1890ff" @click="onPreview(courseRow.Kcxq)">预览</span>
        </div>
      </el-form-item>
      <el-form-item label="查找学科">
        <div class="center">
          <el-input
            v-model="searchSubjectContent"
            placeholder="请输入学科名称"
            class="m-r-12 flex_1"
            @keyup.native.enter="getBookList"
          />
          <el-button type="primary" @click="getBookList">查询</el-button>
        </div>
      </el-form-item>
      <el-form-item label="已关联科目">
        <div class="flex_dom flex_wrap">
          <el-tag v-for="(item) in courseRow.Children" :key="item.Id">{{ item.Label }}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="可选科目">
        <div class="addSubject flex_dom flex_wrap">
          <p v-for="(item,index) in subjectListOps" :key="item.Id">
            {{ item.Label }}
            <i class="el-icon-circle-plus" @click="addSubjectToSourse(item,index)" />
          </p>
        </div>
      </el-form-item>
    </el-form>
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
import { queryBookList } from '@/api/book'
import { UploadImgCourse } from '@/api/upload'
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
      // 搜索科目时通过课程大类的名称查找
      courseKindLabel: '',
      // 课程的选项数据
      CourseKindsOps: [],
      // 存储课程大类下查找的科目
      subjectListOps: [],
      // 查找学科搜索内容
      searchSubjectContent: '',
      // 图片加载
      isbusy1: false,
      isbusy2: false,
      isbusy3: false
    }
  },
  mounted() {},
  methods: {
    // 从父组件获取信息
    getCourseRowData(row) {
      this.imageViewerSrc = ''
      this.showViewer = false
      this.courseKindLabel = ''
      this.subjectListOps = []
      this.courseRow = { ...row }
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
    //  选中学院后回调
    collegeChangeGetCourseKind(index) {
      this.subjectListOps = []
      this.CourseKindsOps = []
      this.courseRow.TCourseKindID = null
      this.courseRow.TCollegeID = this.common.collegeWithCouseKindList[
        index
      ].Id
      this.CourseKindsOps = []
      this.CourseKindsOps = [
        ...this.common.collegeWithCouseKindList[index].Children
      ]
      console.log('=====', this.common.collegeWithCouseKindList)
      if (this.CourseKindsOps.length > 0) {
        this.courseRow.TCourseKindID = this.CourseKindsOps[0].Id
        this.courseKindLabel = this.CourseKindsOps[0].Label
        this.getBookList()
      }
    },
    // 给课程关联学科
    addSubjectToSourse(subjectItem, index) {
      let has = false
      this.courseRow.Children = this.courseRow.Children
        ? this.courseRow.Children
        : []
      this.courseRow.Children.forEach(item => {
        if (item.TBookId == subjectItem.Id) {
          has = true
        }
      })
      if (!has) {
        const courseBookitem = {}
        courseBookitem.Label = subjectItem.Label
        courseBookitem.TBookId = subjectItem.Id
        courseBookitem.TCourseId = this.courseRow.Id
        courseBookitem.TopicNum = subjectItem.Topic
        this.courseRow.Children.push(courseBookitem)
      }
    },
    // 查找课程大类下的学科
    async getBookList() {
      this.subjectListOps = []
      let params = { coursekind: this.courseKindLabel }
      if (this.searchSubjectContent) {
        params = { label: this.searchSubjectContent }
      }
      const res = await queryBookList(params)
      if (res.code == 200) {
        this.subjectListOps = res.data ? res.data : []
      }
    },
    // 保存课程数据
    saveCourse: function() {
      this.$refs.refCourseForm.validate(async valid => {
        if (valid) {
          this.courseRow.CourseNum = parseInt(this.courseRow.CourseNum)
          if (this.courseRow.Id > 0) {
            const res = await editCourse(this.courseRow.Id, this.courseRow)
            if (res.code == 200) {
              this.common.go_alert('修改成功 !')
              this.$emit('subClickEvent', 0, res.data)
              this.isShowCourseDialog = false
            }
          } else {
            const res = await addCourse(this.courseRow)
            if (res.code == 200) {
              this.common.go_alert('添加成功 !')
              this.$emit('subClickEvent', 1, res.data)
              this.isShowCourseDialog = false
            }
          }
        } else {
          return false
        }
      })
    },
    // 上传课程图片
    async uploadCOurseImg(file, fileList, type) {
      if (type == 1) {
        this.isbusy1 = true
      } else if (type == 2) {
        this.isbusy2 = true
      } else if (type == 3) {
        this.isbusy3 = true
      }
      const res = await UploadImgCourse(this.courseRow.Id, file.raw)
      if (res.code == 200) {
        if (type == 1) {
          this.courseRow.Background = res.data
          this.isbusy1 = false
        } else if (type == 2) {
          this.courseRow.Jxtx = res.data
          this.isbusy2 = false
        } else if (type == 3) {
          this.courseRow.Kcxq = res.data
          this.isbusy3 = false
        }
      }
    },
    // 图片预览
    onPreview(src) {
      this.showViewer = true
      this.imageViewerSrc = src
    },
    // 关闭图片查看器
    closeViewer() {
      this.showViewer = false
    }
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
