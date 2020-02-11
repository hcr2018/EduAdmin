<template>
  <!-- --------------------课程宣传资料模块----------------------- -->
  <div class="p_both10 p-t-5">
    <!-- 展示图片 -->
    <div>
      <p class="font16 color-1890ff border-b-e0 p-b-10 font-w6">展示图片</p>
      <div class="flex_dom flex_wrap p-v-20">
        <div
          v-for="(item,index) in travelBrochureData.ImageList"
          :key="index"
          class="relative marg15"
        >
          <my-image
            class="wid80 hgt80"
            :preview-src-list="[item.List]"
            :src="item.List"
            fit="cover"
          />
          <div class="between-center m-v-5 wid80">
            <span class="text-center color-1890ff font14 m-r-5">{{ item.Label }}</span>
            <el-upload
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file, fileList){return updatePicture(file, fileList,index,1)}"
            >
              <i class="el-icon-edit color-333" />
            </el-upload>
          </div>

          <div class="deleImgIcon cursor" @click="deleImg(index,1)">
            <img src="/static/img/slice/deleteIcon.png" alt>
          </div>
        </div>
        <el-upload
          :auto-upload="false"
          action
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="function(file, fileList){return uploadPicture(file, fileList,1)}"
        >
          <i class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </div>
    </div>
    <!-- 任课老师 -->
    <my-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[imageViewerSrc]"
    />
    <div class="m-t-20">
      <p class="font16 color-1890ff border-b-e0 p-b-10 font-w6">任课老师</p>
      <div class="flex_dom flex_wrap p-v-20">
        <div
          v-for="(item,index) in travelBrochureData.TeacherList"
          :key="index"
          class="relative marg15"
        >
          <!-- <my-image
            class="wid80 hgt80"
            :preview-src-list="[item.List]"
            :src="item.List"
            fit="cover"
          ></my-image> -->
          <img
            v-if="item.List"
            class="wid20"
            src="/static/img/slice/uploadedIcon.png"
            @click="onPreview(item.List)"
          >
          <div class="between-center m-v-5 wid80">
            <span class="text-center color-1890ff font14 m-r-5">{{ item.Label }}</span>
            <el-upload
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file, fileList){return updatePicture(file, fileList,index,2)}"
            >
              <i class="el-icon-edit color-333" />
            </el-upload>
          </div>
          <div class="deleImgIcon cursor" @click="deleImg(index,2)">
            <img src="/static/img/slice/deleteIcon.png" alt>
          </div>
        </div>
        <el-upload
          :auto-upload="false"
          action
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="function(file, fileList){return uploadPicture(file, fileList,2)}"
        >
          <i class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </div>
    </div>
    <!-- 宣传视频 -->
    <div class="m-t-20">
      <p class="font16 color-1890ff border-b-e0 p-b-10 font-w6">宣传视频</p>
      <div class="m-t-30">
        <el-form
          ref="refvideoForm"
          :model="videoRowData"
          label-width="100px"
          size="small"
          :rules="videoFormRules"
        >
          <div class="center">
            <el-form-item label="视频名称:" prop="Label">
              <el-input v-model="videoRowData.Label" />
            </el-form-item>
            <el-form-item label="视频地址:" prop="List">
              <el-input v-model="videoRowData.List" />
            </el-form-item>
            <el-form-item>
              <el-button v-show="!isEditVideo" type="primary" @click="saveVideoUrl(1)">添加视频</el-button>
              <el-button v-show="isEditVideo" type="primary" @click="saveVideoUrl(0)">保 存</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="p-v-10">
        <el-table
          ref="refElTabel"
          :data="travelBrochureData.VideoList"
          :border="true"
          style="width: 100%"
        >
          <el-table-column prop="Label" label="视频名称" width="180" />
          <el-table-column prop="List" label="视频地址" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="clickEditVideoUrl(scope.$index,scope.row)">编辑</el-button>
              <el-button type="danger" @click="clickDeletVideoUrl(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="m-v-15 center-end">
      <el-button type="primary" @click="saveTravelBrochureData">保存宣传资料</el-button>
    </div>
  </div>
</template>

<script>

import myImageViewer from '@/components/myImageViewer/myImageViewer'

import { getCourseTravelBrochure, updateCourseTravelBrochure } from '@/api/course'

import { UploadImgCourseTravelBrochure } from '@/api/upload'

export default {

  name: 'CourseTravelBrochure',
  components: {
    myImageViewer
  },
  props: {
    // 宣传资料的数据
    travelBrochureData: {}
  },
  data() {
    return {

      // 预览图片的图片地址
      imageViewerSrc: '',
      // 显示图片查看器
      showViewer: false,

      // 课程ID
      courseId: null,
      // 视频的表单信息
      videoRowData: {},
      // 当前编辑的视频地址的index
      videoRowIndex: null,
      // 是否编辑视频地址，控制按钮的显示或者隐藏
      isEditVideo: false,
      // 表单验证
      videoFormRules: {
        Label: [{ required: true, message: '请输入视频名称', trigger: 'blur' }],
        List: [{ required: true, message: '请输入视频地址', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.refElTabel.doLayout()
    }, 2000)
  },
  methods: {
    // 图片预览
    onPreview(src) {
      this.showViewer = true
      this.imageViewerSrc = src
    },
    // 获取课程宣传资料
    async getTravelBrochure() {
      const res = await getCourseTravelBrochure(this.travelBrochureData.courseId)
      if (res.code == 200) {
        if (res.data) {
          this.travelBrochureData = res.data
        }
      }
    },
    // 上传图片
    async uploadPicture(file, fileList, type) {
      const res = await UploadImgCourseTravelBrochure(
        this.travelBrochureData.courseId, '',
        file.raw
      )
      if (res.code == 200) {
        if (!this.travelBrochureData.ImageList) {
          this.travelBrochureData.ImageList = []
        }
        if (!this.travelBrochureData.TeacherList) {
          this.travelBrochureData.TeacherList = []
        }
        if (type == 1) {
          // 上传展示图片
          this.travelBrochureData.ImageList.push({
            Label: res.title,
            List: res.data
          })
        } else if (type == 2) {
          // 上传老师图片
          this.travelBrochureData.TeacherList.push({
            Label: res.title,
            List: res.data
          })
        }
      }
    },
    // 删除图片
    deleImg(index, type) {
      if (type == 1) {
        // 删除展示图片
        this.travelBrochureData.ImageList.splice(index, 1)
      } else if (type == 2) {
        // 删除老师图片
        this.travelBrochureData.TeacherList.splice(index, 1)
      }
    },
    // 更换图片
    async updatePicture(file, fileList, index, type) {
      const res = await UploadImgCourseTravelBrochure(
        this.travelBrochureData.courseId,
        file.raw
      )
      if (res.code == 200) {
        if (type == 1) {
          // 修改展示图片
          this.$set(this.travelBrochureData.ImageList, index, {
            Label: res.title,
            List: res.data
          })
        } else if (type == 2) {
          // 修改老师图片
          this.$set(this.travelBrochureData.TeacherList, index, {
            Label: res.title,
            List: res.data
          })
        }
      }
    },
    // 保存视频信息
    saveVideoUrl(type) {
      this.$refs.refvideoForm.validate(valid => {
        if (valid) {
          if (type) {
            if (!this.travelBrochureData.VideoList) {
              this.travelBrochureData.VideoList = []
            }
            this.travelBrochureData.VideoList.push(this.videoRowData)
          } else {
            this.$set(
              this.travelBrochureData.VideoList,
              this.videoRowIndex,
              this.videoRowData
            )
            this.isEditVideo = false
          }
          this.videoRowData = {}
        } else {
          return false
        }
      })
    },
    // 点击编辑视频地址按钮
    clickEditVideoUrl(index, row) {
      this.videoRowData = row
      this.videoRowIndex = index
      this.isEditVideo = true
    },
    // 删除视频
    clickDeletVideoUrl(index, row) {
      this.travelBrochureData.VideoList.splice(index, 1)
    },
    // 保存所有的宣传资料
    async saveTravelBrochureData() {
      const res = await updateCourseTravelBrochure(
        this.travelBrochureData.courseId,
        this.travelBrochureData
      )
      if (res.code == 200) {
        if (res.data) {
          this.travelBrochureData = res.data
          this.$message('保存成功！')
        }
      }
    }
  }
}
</script>
<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  margin-top: 15px;
  height: 80px;
  box-sizing: border-box;
  line-height: 80px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.deleImgIcon {
  position: absolute;
  top: -10px;
  right: -3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  z-index: 10;
}
.videoIitem {
  background: #f4f4f5;
  padding: 5px 10px;
  border-radius: 2px;
}
</style>
