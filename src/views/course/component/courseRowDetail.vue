<template>
  <div>
    <myImageViewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
    <el-form
      ref="refCourseForm"
      :disabled="currenteditEnable==false"
      :model="currentItemData"
      :rules="courseFormRules"
      style="padding:10px 0px 0px 0px"
      label-width="80px"
      size="small"
    >
      <el-form-item label="产品名称" prop="Label">
        <el-input v-model="currentItemData.Label" required autocomplete="off" />
      </el-form-item>

      <el-form-item label="产品特征" class="flex_1">
        <el-input v-model="currentItemData.Comments" autocomplete="off" />
      </el-form-item>
      <el-form-item label="宣传售价" prop="Price" class="flex_1">
        <el-input v-model="currentItemData.Price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="课时量" prop="CourseNum" class="flex_1">
        <el-input v-model.number="currentItemData.CourseNum" autocomplete="off" />
      </el-form-item>

      <el-form-item label="热门课程" class="flex_1">
        <el-radio v-model="currentItemData.IsCollegeHot" :label="1">是</el-radio>
        <el-radio v-model="currentItemData.IsCollegeHot" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="全科购买" class="flex_1">
        <el-radio v-model="currentItemData.MustAllBook" label="1">是</el-radio>
        <el-radio v-model="currentItemData.MustAllBook" label="0">否</el-radio>
      </el-form-item>

      <el-form-item label="展示排序" prop="Sort" class="flex_1">
        <el-input v-model.number="currentItemData.Sort" autocomplete="off" />
      </el-form-item>

      <el-form-item label="产品描述">
        <el-input
          v-model="currentItemData.Description"
          type="textarea"
          :rows="4"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="缩略图">
        <div style="display: flex">
          <el-upload
            v-loading="isbusy1"
            :auto-upload="false"
            action
            :show-file-list="false"
            :on-change="function(file, fileList){return uploadCourseImgFunc(file, fileList,1)}"
          >
            <el-input v-model="currentItemData.Background" disabled style="width:auto;" />
            <span
              class="m-l-15 wid60 cursor color-1890ff"
              @click="onPreview(currentItemData.Background)"
            >预览</span>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="体系图">
        <div style="display: flex">
          <el-upload
            v-loading="isbusy2"
            :auto-upload="false"
            action
            :show-file-list="false"
            :on-change="function(file, fileList){return uploadCourseImgFunc(file, fileList,2)}"
          >
            <el-input v-model="currentItemData.Jxtx" disabled style="width:auto; " />
          </el-upload>
          <span class="m-l-15 wid60 cursor color-1890ff" @click="onPreview(currentItemData.Jxtx)">预览</span>
        </div>
      </el-form-item>
      <el-form-item label="详情图">
        <div style="display: flex">
          <div class="color-1890ff">
            <el-upload
              v-loading="isbusy3"
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file, fileList){return uploadCourseImgFunc(file, fileList,3)}"
            >
              <el-input v-model="currentItemData.Kcxq" disabled style="width:auto; " />
            </el-upload>
          </div>
          <span class="m-l-15 wid60 cursor color-1890ff" @click="onPreview(currentItemData.Kcxq)">预览</span>
        </div>
      </el-form-item>

      <!-- <el-form-item label="查找教材">
        <div class="center">
          <el-input
            v-model="searchSubjectContent"
            placeholder="请输入教材名称"
            class="m-r-12 flex_1"
            @keyup.native.enter="getBookList"
          />
          <el-button type="primary" @click="getBookList">查询</el-button>
        </div>
      </el-form-item>
      <el-form-item label="已关联科目">
        <div class="flex_dom flex_wrap">
          <el-tag v-for="(item) in currentItemData.Children" :key="item.Id">{{ item.Label }}</el-tag>
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
      <el-form-item>
        <el-button @click="$emit('subClickEvent', 2, '') ">取 消</el-button>
        <el-button type="primary" class="m-l-40" @click="saveCourse">保 存</el-button>
      </el-form-item>-->
    </el-form>
    <div class="around-center hgt60">
      <div>
        <el-button
          type="warning"
          :disabled="false"
          v-show="!currenteditEnable"
          class="m-l-40"
          @click="currenteditEnable=true"
        >编辑</el-button>
        <el-button
          type="primary"
          :disabled="false"
          v-show="currenteditEnable"
          class="m-l-40"
          @click="saveCourse"
        >确 认</el-button>

        <el-button v-show="currenteditEnable" @click="currenteditEnable=false">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import common from "@/utils/common";
import { addCourse, editCourse } from "@/api/course";

import $ImgAPI from "@/api/ImgAPI";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import { number } from "echarts/lib/export";
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
    },
    courseKindIdProp: {
      type: Number,
      default: 0
    }
  },
  components: {
    myImageViewer
  },

  data() {
    return {
      myImageViewer,
      common,
      currenteditEnable: this.editEnable,
      // 课程的表单数据
      currentItemData: {},
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // 学院默认选中第一项
      collegeIndex: 0,
      // 表单验证
      courseFormRules: {
        Price: [{ required: true, message: "价格不能为空", trigger: "blur" }],
        CourseNum: [
          { required: true, message: "课时不能为空", trigger: "blur" }
        ],
        Sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        Label: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ]
      },
      // 搜索科目时通过课程类别的名称查找
      courseKindLabel: "",
      courseKindId: 0,
      // 课程的选项数据
      courseKindList: [],

      // 图片加载
      isbusy1: false,
      isbusy2: false,
      isbusy3: false
    };
  },
  watch: {
    formItemData(newvar) {
      this.currentItemData = this.formItemData;
      if (this.courseKindIdProp > 0) {
        this.courseKindId = this.courseKindIdProp;
      }
      this.currentItemData.TCourseKindID = this.courseKindId;
      this.collegeChangeGetCourseKind(0);
    }
  },
  mounted() {
    this.currentItemData = this.formItemData;
    if (this.currentItemData.TCourseKindID > 0) {
      this.courseKindId = this.currentItemData.TCourseKindID;
    } else {
      this.courseKindId = this.courseKindIdProp;
    }
    this.currentItemData.TCourseKindID = this.courseKindId;
    if (this.currentItemData.Id > 0) {
      if (this.$store.getters.app.collegeWithCourseKind) {
        this.$store.getters.app.collegeWithCourseKind.forEach(item => {
          if (item.Children) {
            item.Children.forEach(courseKind => {
              if (courseKind.Id == this.currentItemData.TCourseKindID) {
                this.courseKindList = item.Children;
              }
            });
          }
        });
      }
    } else {
      this.collegeChangeGetCourseKind(0);
    }
  },
  methods: {
    // 上传课程图片
    async uploadCourseImgFunc(file, fileList, type) {
      if (type == 1) {
        this.isbusy1 = true;
      } else if (type == 2) {
        this.isbusy2 = true;
      } else if (type == 3) {
        this.isbusy3 = true;
      }
      const res = await $ImgAPI.UploadImg("course", file.raw);

      if (res.code == 200) {
        if (type == 1) {
          this.currentItemData.Background = res.data;
          this.isbusy1 = false;
        } else if (type == 2) {
          this.currentItemData.Jxtx = res.data;
          this.isbusy2 = false;
        } else if (type == 3) {
          this.currentItemData.Kcxq = res.data;
          this.isbusy3 = false;
        }
      }
    },
    // 图片预览
    onPreview(src) {
      this.showViewer = true;
      this.imageViewerSrc = src;
    },
    // 关闭图片查看器
    closeViewer() {
      this.showViewer = false;
    },
    //  选中学院后回调
    collegeChangeGetCourseKind(index) {
      this.currentItemData.TCollegeID = this.$store.getters.app.collegeWithCourseKind[
        index
      ].Id;
      this.courseKindList = this.$store.getters.app.collegeWithCourseKind[
        index
      ].Children;
      if (this.courseKindList && this.courseKindList.length > 0) {
        this.currentItemData.TCourseKindID = this.courseKindList[0].Id;
        this.courseKindLabel = this.courseKindList[0].Label;
        // this.getBookList();
      }
    },

    // 保存课程数据
    saveCourse: function() {
      this.$refs.refCourseForm.validate(async valid => {
        if (valid) {
          this.currentItemData.CourseNum = parseInt(
            this.currentItemData.CourseNum
          );
          if (this.currentItemData.Children) {
            this.currentItemData.Children.forEach(item => {
              item.Id = parseInt(item.Id);
            });
          }
          if (this.currentItemData.Id > 0) {
            const res = await editCourse(
              this.currentItemData.Id,
              "",
              this.currentItemData
            );
            if (res.code == 200) {
              this.$message("修改成功 !");
              this.$emit("subClickEvent", 1, res.data);
            }
          } else {
            const res = await addCourse("", "", this.currentItemData);
            if (res.code == 200) {
              this.$message("添加成功 !");
              this.$emit("subClickEvent", 0, res.data);
            }
          }
        } else {
          return false;
        }
      });
    },
    // 给课程关联教材
    addSubjectToSourse(subjectItem, index) {
      let has = false;
      this.currentItemData.Children = this.currentItemData.Children
        ? this.currentItemData.Children
        : [];
      this.currentItemData.Children.forEach(item => {
        if (item.TBookId == subjectItem.Id) {
          has = true;
        }
      });

      if (!has) {
        const courseBookitem = {};
        courseBookitem.Label = subjectItem.Label;
        courseBookitem.TBookId = subjectItem.Id;
        courseBookitem.TCourseId = this.currentItemData.Id;
        courseBookitem.TopicNum = subjectItem.Topic;
        this.currentItemData.Children.push(courseBookitem);
      }
      this.$forceUpdate();
    }
  }
};
</script>
