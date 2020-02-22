<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <!-- 查询表单 -->
      <div class="m-b-10">
        <el-form :inline="true">
          <el-form-item label="年级">
            <el-date-picker
              style="width:100px"
              v-model="searchGrade"
              value-format="yyyy"
              type="year"
              placeholder="选择年"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="班级名称">
            <el-input
              v-model="searchClassLabel"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入班级名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
 
        <el-table
          tooltip-effect="light"
          :data="classList"
          border
          style="width: 100%"
          height="100%"
          ref="refElTabel"
        >
          <el-table-column prop="Id" label="ID" width="50"></el-table-column>
          <el-table-column
            label="班级名称"
            :formatter="TimeFormatter"
            :show-overflow-tooltip="true"
            width="260"
          >
            <template slot-scope="scope">
              <span
                class="color-2e77f8 font-w6 cursor"
                @click="openMoreOptationDialog(scope.$index, scope.row)"
              >{{scope.row.Label}}</span>
            </template>
          </el-table-column>
          <el-table-column label="授课方式" width="120">
            <template slot-scope="scope">
              <span>{{common.FormatSelect(common.teachingForm,scope.row.TeachMethod)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="StudentNum" label="学员人数" width="70"></el-table-column>
          <el-table-column prop="CreaterLabel" label="创建人员" width="100"></el-table-column>
          <el-table-column prop="Createtime" label="创建时间" width="90" :formatter="TimeFormatter"></el-table-column>
          <el-table-column prop="Description" label="情况备注" :show-overflow-tooltip="true"></el-table-column>
        </el-table> 
      <div class="between-center m-v-10">
        <el-button type="primary" @click="openClassDialog()">创建班级</el-button>
        <div>
          <el-pagination
            background
            @current-change=" currentPageChange"
            :current-page.sync="nowPage"
            :page-size="rows"
            layout="total,prev, pager, next, jumper"
            :total="allRows"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <div>
      <!-- 班级相关操作的模态框 -->
      <my-dialog :visible.sync="moreOperationDialog" :closeShow="true" :title="classFormData.Label">
        <div slot="left_content" class="p_both20 p-b-20">
          <class-row-detail :formItemData="classFormData"></class-row-detail>
        </div>
        <div slot="right_content" class="p_both20 p-b-20">
          <el-tabs v-model="activeClassTabs" @tab-click="changDialogClassTabs">
            <el-tab-pane label="班级学员" name="bjxy" id="bjxy">
              <ClassStudent :formItemData="classFormData"></ClassStudent>
            </el-tab-pane>
            <el-tab-pane label="课程表" name="kcb" id="kcb">
              <SchoolTimeTable ref="refClassTimeTable"></SchoolTimeTable>
            </el-tab-pane>
          </el-tabs>
        </div>
      </my-dialog>
      <!-- 班级的模态框 -->
      <el-dialog
        :visible.sync="editDialog"
        width="500px"
        :title="classFormData.Id>0?'编辑'+classFormData.Label:'新增校区'"
      >
        <class-row-detail :editEnable="true" :formItemData="classFormData" />
      </el-dialog>
    </div>
  </div>
</template> 
<script> 
import classRowDetail from "@/views/platform/component/classRowDetail";
import ClassStudent from "@/views/platform/component/classStudent";
import SchoolTimeTable from "@/views/platform/component/schoolTimeTable"; 
import myDialog from "@/components/myDialog/myDialog";
import common from "@/utils/common";
import {
  getAllClass,
  editClassInfo,
  addClassInfo,
  getOneClass,
  addClassOpenData,
  getClassOpenData,
  getTimeTableByMonth,
  addTimeTableBy,
  addTimeTag,
  getTimeTag,
  addClassStu,
  getClassStu,
  handOutTask,
  getAllClassTaskRecord
} from "@/api/class";
import { isDate } from "xe-utils/methods";
export default {
  name: "classList",
  components: {
    myDialog,
    classRowDetail,
    ClassStudent,
    SchoolTimeTable
  },
  data() {
    return {
      common,
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 50,
      // 班级的列表数据
      classList: [],
      // 模态框获得的单条班级数据
      classFormData: {},
      // 当前操作的班级数据的索引
      currentIndex: 0,
      // 模态框当前激活的标签页
      activeClassTabs: "bjxy",
      // 控制班级更多操作的弹出框
      moreOperationDialog: false,
      searchClassLabel: "",
      searchGrade: 0,
      // 当前的校区id
      currentPlatform: null,
      // 更多操作弹窗
      editDialog: false,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false
    };
  },
  methods: {
    // 获取所有班级的列表
    async getAllClass() {
      let that = this;
      let year = 0;
      if (isDate(that.searchGrade)) {
        year = that.searchGrade.getFullYear();
      } else {
        year = that.searchGrade;
      }
      // 取数据的位置
      let offsetRow = (that.nowPage - 1) * that.rows;
      let res = await getAllClass("", {
        label: that.searchClassLabel,
        currentPlatform: that.currentPlatform,
        grade: year,
        limit: that.rows,
        offset: offsetRow
      });
      if (res.code == 200) {
        that.classList = res.data ? res.data : [];
        that.allRows = res.title;
      }
    },
    // 打开更多操作模态框
    openMoreOptationDialog(index, row) {
      this.classFormData = row;
      this.classFormData.OpenTime = row.OpenTime * 1000;
      this.classFormData.Endtime = row.Endtime * 1000;
      this.classFormData.Createtime = row.Createtime * 1000;

      this.moreOperationDialog = true;
      this.activeClassTabs = "bjxy";
      this.currentIndex = index;
    },
    //打开班级信息模态框
    openClassDialog(type) {
      this.editDialog = true;
    },
    // 添加班级成功之后更新表格数据-班级列表
    updateClassList(rowData, type) {
      // type==1添加,type=0编辑
      if (type == 1) {
        this.classList.unshift(rowData);
      } else if (type == 0) {
        this.classFormData = { ...rowData };
        this.$set(this.classList, this.currentIndex, rowData);
        this.$refs.refClassRowDetail.getClassRow(rowData);
      }
    },
    // 切换tabs标签页在调用函数
    changDialogClassTabs(tab) {
      if (tab.$attrs.id == "bjxy") {
        this.$refs.refClassStudent.getClassRow(this.classFormData);
      } else if (tab.$attrs.id == "kcb") {
        this.$refs.refClassTimeTable.getClassRow(this.classFormData);
      }
    },
    // 格式化日期
    TimeFormatter(row, column, cellValue) {
      return this.common.dateFormat(cellValue);
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getAllClass();
    },
    // 条件搜索
    searchSubmit() {
      this.nowPage = 1;
      this.getAllClass();
    }
  },
  mounted() {
    let paths = this.$router.currentRoute.path.split("/");
    this.currentPlatform = paths[paths.length - 1];
    if (isNaN(this.currentPlatform)) {
      this.currentPlatform = 0;
    }
    this.nowPage = 1;
    this.getAllClass();
  }
};
</script>
<style scope>
.el-dialog.exerciseSitaution {
  width: 70% !important;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 30% !important;
  height: 100%;
  min-width: 600px;
  position: relative;
  overflow: auto;
}
.closeDialog:hover {
  color: #2e77f8;
}
</style>