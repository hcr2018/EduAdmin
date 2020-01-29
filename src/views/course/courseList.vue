<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <!-- 搜索内容-->
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="所属学院">
            <el-select
              class="wid160"
              v-model="collegeIndex"
              @change="collegeChange"
              placeholder="请选择学院"
            >
              <el-option
                :label="item.Label"
                :value="index"
                v-for="(item,index) in collegeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程类别">
            <el-select
              class="wid160"
              v-model="searchCourseKindId"
              @change="getCourseListOfKind"
              placeholder="请选择课程类别"
            >
              <el-option
                :label="item.Label"
                :key="index"
                :value="item.Id"
                v-for="(item,index) in courseKindsOps"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程名称">
            <el-input
              class="wid200"
              v-model="searchCourseLabel"
              @keyup.native.enter="searchSubmit"
              placeholder="请输入课程名称"
            ></el-input>
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
          :data="courseList"
          border
          tooltip-effect="light"
          style="width: 100%"
          height="100%"
          ref="refElTabel"
        >
          <el-table-column label="ID" width="50" prop="Id"></el-table-column>
          <el-table-column label="封面图" width="60" prop="Background">
            <template slot-scope="scope">
              <img
                v-if="scope.row.Background"
                @click="onPreview(scope.row.Background)"
                class="wid20"
                src="/static/img/slice/uploadedIcon.png"
              />
            </template>
          </el-table-column>
          <el-table-column label="教学图" width="60" prop="Jxtx">
            <template slot-scope="scope">
              <img
                v-if="scope.row.Jxtx"
                @click="onPreview(scope.row.Jxtx)"
                class="wid20"
                src="/static/img/slice/uploadedIcon.png"
              />
            </template>
          </el-table-column>
          <el-table-column label="详情图" width="60" prop="Kcxq">
            <template slot-scope="scope">
              <img
                v-if="scope.row.Kcxq"
                @click="onPreview(scope.row.Kcxq)"
                class="wid20"
                src="/static/img/slice/uploadedIcon.png"
              />
            </template>
          </el-table-column>
          <el-table-column label="产品名称" width="260" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span
                class="color-2e77f8 font-w6 cursor"
                @click="openMoreOptationDialog(scope.$index, scope.row)"
              >{{scope.row.Label}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="130" prop="Createtime" :formatter="dateFormat"></el-table-column>
          <el-table-column label="宣传售价" width="70" prop="Price"></el-table-column>
          <el-table-column label="课时量" width="60" prop="CourseNum"></el-table-column>
          <el-table-column label="产品描述" :show-overflow-tooltip="true" prop="Description"></el-table-column>
          <el-table-column label="是否上架" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                :type="scope.row.Open==1?'success':'warning'"
                @click="setIsUpperShelf(scope.$index, scope.row)"
              >{{scope.row.Open==1?"已经上架":"没有上架"}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="m-v-15">
        <el-button type="primary" @click="openCourseDialog(1)">新增课程</el-button>
      </div>
    </div>
    <div>
      <!-- 更多操作弹出框 -->
      <my-dialog
        :visible.sync="isShoworeOptationDialog"
        :closeShow="true"
        :title="courseRowData.Label"
      >
        <!-- 展示站点的基本信息 -->
        <div slot="left_content" class="p_both20 p-b-20">
          <course-row-detail ref="refCourseDetail"></course-row-detail>
          <div class="text-center m-t-30">
            <el-button type="primary" @click="openCourseDialog(0)">编辑</el-button>
          </div>
        </div>
        <div slot="right_content" class="p_both20 p-b-20">
          <el-tabs v-model="activeName" @tab-click="changDialogTab">
            <el-tab-pane label="宣传资料" name="travelBrochure" id="travelBrochure">
              <courseTravelBrochure ref="travelBrochure"></courseTravelBrochure>
            </el-tab-pane>
            <el-tab-pane label="价格设定" name="priceSetting" id="priceSetting">
              <course-price-tab ref="refCoursePriceTab"></course-price-tab>
            </el-tab-pane>
          </el-tabs>
        </div>
      </my-dialog>
      <!-- 课程弹出框 -->
      <course-row-dialog ref="resCourseDialog" @subClickEvent="updataCourseList"></course-row-dialog>
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
 
 import {   
  getCollegeWithCourseKind
} from "@/api/app";
  
export default {
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
      isShoworeOptationDialog: false,
      // 当前操作课程的索引
      currentCourseIndex: null,
      // 课程的表单数据
      courseRowData: {}
    };
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
      let that = this;
      let res = await getCourseList(
        { label: this.searchCourseLabel },
        true
      );
      if (res.code == 200) {
        this.courseList = res.data ? res.data : [];
      }
    },
    // 根据课程大类获取课程列表
    async getCourseListOfKind() {
      let res = await GetCourseOfKind({
        all: 1,
        kindid: this.searchCourseKindId
      });
      if (res.code == 200) {
        this.courseList = res.data ? res.data : [];
      }
    },
    //获取所有学院以及所属的课程大类
    async getAllCollegeWithCourseKind() {
      let res = await  getCollegeWithCourseKind({ include: 1 });
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
      let checked = row.Open == 1 ? 0 : 1;
      let tip = checked == 1 ? "你确认要上架" : "你确认要下架";
      this.$confirm(tip, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await setCourseUpperShelf(
            row.Id,
            {
              open: checked
            },
            true
          );
          if (res.code == 200) {
            this.common.go_alert("设置成功");
            this.$set(this.courseList, index, res.data);
          }
        })
        .catch(() => {});
    },
    // 切换tabs标签页在调用函数
    changDialogTab(tab) {
      if (tab.$attrs.id == "travelBrochure") {
        this.$refs.travelBrochure.getTravelBrochure(this.courseRowData.Id);
      } else if (tab.$attrs.id == "priceSetting") {
        this.$refs.refCoursePriceTab.getCourseRow(this.courseRowData);
      }
    },
    // 打开更多操作的模态框
    openMoreOptationDialog(index, row) {
      this.isShoworeOptationDialog = true;
      this.activeName = "travelBrochure";
      this.currentCourseIndex = index;
      this.courseRowData = { ...row };
      this.$refs.travelBrochure.getTravelBrochure(this.courseRowData.Id);
      this.$refs.refCourseDetail.getCourseRowData(row);
    },
    // 打开课程的模态框
    openCourseDialog(type) {
      if (type) {
        this.$refs.resCourseDialog.getCourseRowData({
          Id: 0,
          Children: [],
          IsCollegeHot: 0,
          Open: 1
        });
      } else {
        this.$refs.resCourseDialog.getCourseRowData(this.courseRowData);
      }
    },
    // 更新课程列表
    updataCourseList(type, row) {
      if (type) {
        this.courseList.unshift(row);
      } else {
        this.courseList.splice(this.currentCourseIndex, 1, row);
        this.courseRowData = { ...row };
        this.$refs.refCourseDetail.getCourseRowData(row);
      }
    },
    // 格式化时间
    dateFormat(row, column) {
      if (row.Createtime) {
        return this.common.dateFormat(row.Createtime, 2);
      }
    }
  },
  mounted() {
    this.getAllCollegeWithCourseKind();
    setTimeout(() => {
      this.$refs.refElTabel.doLayout();
    }, 2000);
  }
};
</script>
<style scoped>
</style>