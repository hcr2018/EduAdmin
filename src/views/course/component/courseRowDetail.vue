<template>
  <div>
    <el-form
      ref="refCourseForm"
      :model="currentItemData"
      :rules="courseFormRules"
      style="padding:10px 0px 0px 0px"
      label-width="100px"
      size="small"
    >
      <div class="between-center">
        <el-form-item label="所属学院" class="flex_1">
          <el-select
            v-model="collegeIndex"
            placeholder="请选择学院"
            @change="collegeChangeGetCourseKind"
          >
            <el-option
              v-for="(item,index) in $store.getters.app.collegeWithCourseKind"
              :key="index"
              :label="item.Label"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程类别" class="flex_1">
          <el-select
            v-model="currentItemData.TCourseKindID"
            placeholder="请选择课程类别"
            @change="getBookList"
          >
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
          <el-input v-model="currentItemData.Price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="课时量" prop="CourseNum" class="flex_1">
          <el-input v-model.number="currentItemData.CourseNum" autocomplete="off" />
        </el-form-item>
      </div>

      <div class="between-center">
        <el-form-item label="热门课程" class="flex_1">
          <el-radio v-model="currentItemData.IsCollegeHot" :label="1">是</el-radio>
          <el-radio v-model="currentItemData.IsCollegeHot" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="全科购买" class="flex_1">
          <el-radio v-model="currentItemData.MustAllBook" label="1">是</el-radio>
          <el-radio v-model="currentItemData.MustAllBook" label="0">否</el-radio>
        </el-form-item>
      </div>
      <el-form-item label="产品名称" prop="Label">
        <el-input v-model="currentItemData.Label" required autocomplete="off" />
      </el-form-item>
      <div class="between-center">
        <el-form-item label="产品特征" class="flex_1">
          <el-input v-model="currentItemData.Comments" autocomplete="off" />
        </el-form-item>
        <el-form-item label="展示排序" prop="Sort" class="flex_1">
          <el-input v-model.number="currentItemData.Sort" autocomplete="off" />
        </el-form-item>
      </div>
      <el-form-item label="产品描述">
        <el-input
          v-model="currentItemData.Description"
          type="textarea"
          :rows="4"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="产品缩略图">
        <div class="center">
          <el-input v-model="currentItemData.Background" disabled class="m-r-12 flex_1" />
          <div>
            <el-upload
              v-loading="isbusy1"
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file, fileList){return uploadCourseImgFunc(file, fileList,1)}"
            >
              <el-button>上传</el-button>
            </el-upload>
          </div>
          <span
            class="m-l-15 wid60 cursor color-1890ff"
            @click="onPreview(currentItemData.Background)"
          >预览</span>
        </div>
      </el-form-item>
      <el-form-item label="教学体系图">
        <div class="center">
          <el-input v-model="currentItemData.Jxtx" disabled class="m-r-12 flex_1" />
          <div>
            <el-upload
              v-loading="isbusy2"
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file, fileList){return uploadCourseImgFunc(file, fileList,2)}"
            >
              <el-button>上传</el-button>
            </el-upload>
          </div>
          <span class="m-l-15 wid60 cursor color-1890ff" @click="onPreview(currentItemData.Jxtx)">预览</span>
        </div>
      </el-form-item>
      <el-form-item label="产品详情图">
        <div class="center">
          <el-input v-model="currentItemData.Kcxq" disabled class="m-r-12 flex_1" />
          <div class="color-1890ff">
            <el-upload
              v-loading="isbusy3"
              :auto-upload="false"
              action
              :show-file-list="false"
              :on-change="function(file, fileList){return uploadCourseImgFunc(file, fileList,3)}"
            >
              <el-button>上传</el-button>
            </el-upload>
          </div>
          <span class="m-l-15 wid60 cursor color-1890ff" @click="onPreview(currentItemData.Kcxq)">预览</span>
        </div>
      </el-form-item>
      <el-form-item label="查找教材">
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
    </el-form>
  </div>
</template>

<script>
import common from "@/utils/common";
 
import { queryBookList } from "@/api/book";
import $ImgAPI from "@/api/ImgAPI";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
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
      common,
      // 课程的表单数据
      currentItemData: {},
      // 是否显示模态框
      isShowCourseDialog: false,
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
      // 搜索科目时通过课程大类的名称查找
      courseKindLabel: "",
      // 课程的选项数据
      CourseKindsOps: [],
      // 存储课程大类下查找的科目
      subjectListOps: [],
      // 查找教材搜索内容
      searchSubjectContent: "",
      // 图片加载
      isbusy1: false,
      isbusy2: false,
      isbusy3: false
    };
  },
  watch: {
    formItemData(newvar) {
      this.currentItemData = this.formItemData;
    }
  },
  mounted() {
    this.currentItemData = this.formItemData; 
    if (this.currentItemData.Id > 0) {
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
      const res = await $ImgAPI.UploadImg("course",  file.raw);
 
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
      this.subjectListOps = [];
      this.currentItemData.TCourseKindID = null;
      this.currentItemData.TCollegeID = this.$store.getters.app.collegeWithCourseKind[
        index
      ].Id;
      this.CourseKindsOps = [
        ...this.$store.getters.app.collegeWithCourseKind[index].Children
      ];
      if (this.CourseKindsOps.length > 0) {
        this.currentItemData.TCourseKindID = this.CourseKindsOps[0].Id;
        this.courseKindLabel = this.CourseKindsOps[0].Label;
        this.getBookList();
      }
    },
    // 查找课程大类下的教材
    async getBookList() {
      this.subjectListOps = [];
      let params = { coursekind: this.courseKindLabel };
      if (this.searchSubjectContent) {
        params = { label: this.searchSubjectContent };
      }
      const res = await queryBookList("", params);
      if (res.code == 200) {
        this.subjectListOps = res.data ? res.data : [];
      }
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
            console.log(this.currentItemData.Children,"============",has)
    }
  }
};
</script>
