<template>
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <!-- 搜索内容-->
      <div class="p-t-20">
        <el-form :inline="true">
          <el-form-item label="所属学院">
            <el-select
              v-model="collegeIndex"
              class="wid160"
              placeholder="请选择学院"
              @change="collegeChange"
            >
              <el-option
                v-for="(item,index) in collegeList"
                :key="index"
                :label="item.Label"
                :value="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="课程类别">
            <el-select
              v-model="searchCourseKindId"
              class="wid160"
              placeholder="请选择课程类别"
              @change="getCourseListOfKind"
            >
              <el-option
                v-for="(item,index) in courseKindsOps"
                :key="index"
                :label="item.Label"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="课程名称">
            <el-input
              v-model="searchCourseLabel"
              placeholder="请输入课程名称"
              @keyup.native.enter="searchSubmit"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 列表 -->
      <!-- 图片预览 -->
      <my-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
      <div class="flex_1">
        <el-table
          ref="refElTabel"
          :data="courseList"
          border
          tooltip-effect="light"
          style="width: 100%"
          height="100%"
        >
          <el-table-column label="ID" width="50" prop="Id" />
          <el-table-column label="封面图" width="60" prop="Background">
            <template slot-scope="scope">
              <img
                v-if="scope.row.Background"
                class="wid20"
                src="/static/img/slice/uploadedIcon.png"
                @click="onPreview(scope.row.Background)"
              />
            </template>
          </el-table-column>
          <el-table-column label="教学图" width="60" prop="Jxtx">
            <template slot-scope="scope">
              <img
                v-if="scope.row.Jxtx"
                class="wid20"
                src="/static/img/slice/uploadedIcon.png"
                @click="onPreview(scope.row.Jxtx)"
              />
            </template>
          </el-table-column>
          <el-table-column label="详情图" width="60" prop="Kcxq">
            <template slot-scope="scope">
              <img
                v-if="scope.row.Kcxq"
                class="wid20"
                src="/static/img/slice/uploadedIcon.png"
                @click="onPreview(scope.row.Kcxq)"
              />
            </template>
          </el-table-column>
          <el-table-column label="产品名称" width="260" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span
                class="color-1890ff font-w6 cursor"
                @click="openMoreOptationDialog(scope.$index, scope.row)"
              >{{ scope.row.Label }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="130" prop="Createtime" :formatter="dateFormat" />
          <el-table-column label="宣传售价" width="70" prop="Price" />
          <el-table-column label="课时量" width="60" prop="CourseNum" />
          <el-table-column label="产品描述" :show-overflow-tooltip="true" prop="Description" />
          <el-table-column label="是否上架" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                :type="scope.row.Open==1?'success':'warning'"
                @click="setIsUpperShelf(scope.$index, scope.row)"
              >{{ scope.row.Open==1?"已经上架":"没有上架" }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="m-v-15">
        <el-button type="primary" @click="openCourseDialog(0)">新增课程</el-button>
      </div>
    </div>
    <div>
      <!-- 更多操作弹出框 -->
      <my-dialog
        :visible.sync="moreOperationDialog"
        :close-show="true"
        :title="customFormData.Label"
      >
        <!-- 展示校区的基本信息 -->
        <div slot="left_content" class="p_both20 p-b-20">
          <course-row-detail @itemModify="updateListItem" :formItemData="customFormData" />
        </div>
        <div slot="right_content" class="p_both20 p-b-20">
          <el-tabs v-model="activeName" @tab-click="changDialogTab">
            <el-tab-pane id="travelBrochure" label="宣传资料" name="travelBrochure">
              <courseTravelBrochure :travel-brochure-data="customFormData" />
            </el-tab-pane>
            <el-tab-pane id="priceSetting" label="价格设定" name="priceSetting">
              <course-price-tab :course-row-data="customFormData" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </my-dialog>
      <!-- 课程弹出框 -->
      <el-dialog
        :visible.sync="editDialog"
        width="600px"
        :title="customFormData.Id>0?'编辑'+customFormData.Label:'新增课程'"
      >
        <course-row-detail
          @itemModify="updateListItem"
          :editEnable="true"
          :formItemData="customFormData"
        />
      </el-dialog>
      <!-- <course-row-dialog :travel-brochure-data="customFormData" :visible.sync="editDialog" @subClickEvent="updataCourseList" /> -->
    </div>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog/myDialog";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import courseTravelBrochure from "@/views/course/component/courseTravelBrochure";
import coursePriceTab from "@/views/course/component/coursePriceTab";
import courseRowDialog from "@/views/course/component/courseRowDialog";
import courseRowDetail from "@/views/course/component/courseRowDetail";
import common from "@/utils/common";
import {
  getCourseList,
  GetCourseOfKind,
  setCourseUpperShelf,
  addCourse,
  editCourse,
  GetSubjectByCourse,
  getCourseTravelBrochure,
  updateCourseTravelBrochure,
  getCoursePriceList,
  saveCoursePriceList,
  getSubjectChapter,
  getExamList,
  addExam,
  editExam,
  getZhangOfSubject,
  getQuestionsOfSubject,
  saveExamQuestions,
  getDoWrongQuseStuList,
  getTopWrongQuseList
} from "@/api/course";

import { getCollegeWithCourseKind } from "@/api/app";

export default {
  name: "courseList",
  components: {
    myDialog,
    myImageViewer,
    courseTravelBrochure,
    coursePriceTab,
    courseRowDialog,
    courseRowDetail
  },
  data() {
    return {
      editDialog: false,
      common,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // 课程列表数据
      courseList: [],
      // 默认选中的学院
      collegeIndex: 0,
      // 搜索内容-课程名称
      searchCourseLabel: "",
      // 搜索内容-课程大类的Id
      searchCourseKindId: null,
      // 学院的选项数据
      collegeList: [],
      // 课程大类的选项数据
      courseKindsOps: [],
      // 当前所在面板的名称
      activeName: "travelBrochure",
      // 控制更多操作的模态框
      moreOperationDialog: false,
      // 当前操作课程的索引
      currentCourseIndex: null,
      // 课程的表单数据
      customFormData: {}
    };
  },
  mounted() {
    this.getAllCollegeWithCourseKind();
  },
  methods: {
    // 图片预览
    onPreview(src) {
      this.showViewer = true;
      this.imageViewerSrc = src;
    },
    // 关闭图片查看器
    closeViewer() {
      this.showViewer = false;
    },
    
    // 通过搜索具体内容查询获取列表
    async searchSubmit() {
      const that = this;
      const res = await getCourseList("",{ label: this.searchCourseLabel });
      if (res.code == 200) {
        this.courseList = res.data ? res.data : [];
      }
    },
    // 根据课程大类获取课程列表
    async getCourseListOfKind() {
      const res = await GetCourseOfKind(
        "",
        {
          all: 1,
          kindid: this.searchCourseKindId
        },
        ""
      );
      if (res.code == 200) {
        this.courseList = res.data ? res.data : [];
      }
    },
    // 获取所有学院以及所属的课程大类
    async getAllCollegeWithCourseKind() {
      const res = await getCollegeWithCourseKind("", { include: 1 });
      if (res.code == 200) {
        this.collegeList = res.data ? res.data : [];
        this.collegeChange(0);
      }
    },
    // 选中学院类别后回调
    collegeChange(selVa) {
      // 清空数据
      this.courseKindsOps = [];
      this.courseList = [];
      this.searchCourseKindId = null;
      if (this.collegeList[selVa].Children) {
        this.courseKindsOps = this.collegeList[selVa].Children;
        this.searchCourseKindId = this.courseKindsOps[0].Id;
        this.getCourseListOfKind();
      }
    },
    // 设置是否上架
    setIsUpperShelf(index, row) {
      const checked = row.Open == 1 ? 0 : 1;
      const tip = checked == 1 ? "你确认要上架" : "你确认要下架";
      this.$confirm(tip, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await setCourseUpperShelf(
            row.Id,
            {
              open: checked
            },
            true
          );
          if (res.code == 200) {
            this.$message("设置成功");
            this.$set(this.courseList, index, res.data);
          }
        })
        .catch(() => {});
    },
    // 切换tabs标签页在调用函数
    changDialogTab(tab) {
      if (tab.$attrs.id == "travelBrochure") {
        // this.$refs.travelBrochure.getTravelBrochure(this.customFormData.Id);
      } else if (tab.$attrs.id == "priceSetting") {
        // this.$refs.refCoursePriceTab.getCourseRow(this.customFormData);
      }
    },
     // 添加或编辑之后更新列表数据
    updateListItem(type, rowData) {
      if (type==0) {
        this.subjectList.push(rowData);
      } else {
        this.$set(this.subjectList, this.currentSubjectIndex, rowData); 
      }
      this.editDialog = false;
    },
    // 打开更多操作的模态框
    openMoreOptationDialog(index, row) {
      this.moreOperationDialog = true;
      this.activeName = "travelBrochure";
      this.currentCourseIndex = index;
      this.customFormData = row;
      // this.$refs.travelBrochure.getTravelBrochure(this.customFormData.Id);
      // this.$refs.refCourseDetail.getCourseRowData(row);
    },
    // 打开课程的模态框
    openCourseDialog(type) {
      this.editDialog = true;
      this.customFormData = {};
      // if (type) {
      //   this.$refs.resCourseDialog.getCourseRowData({
      //     Id: 0,
      //     Children: [],
      //     IsCollegeHot: 0,
      //     Open: 1
      //   });
      // } else {
      //   this.$refs.resCourseDialog.getCourseRowData(this.customFormData);
      // }
    },
    // 更新课程列表
    updataCourseList(type, row) {
      if (type) {
        this.courseList.unshift(row);
      } else {
        this.courseList.splice(this.currentCourseIndex, 1, row);
        this.customFormData = row;
        // this.$refs.refCourseDetail.getCourseRowData(row);
      }
    },
    // 格式化时间
    dateFormat(row, column) {
      if (row.Createtime) {
        return this.common.dateFormat(row.Createtime, 2);
      }
    }
  }
};
</script>
<style scoped>
</style>
