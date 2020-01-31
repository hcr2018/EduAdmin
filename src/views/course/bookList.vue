<template>
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <!-- 查询表单 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="查询内容">
          <el-input
            v-model="searchContent"
            class="wid150"
            placeholder="请输入科目名称"
            @keyup.enter.native="searchSubmit"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchBookCourseKind"
            class="wid150"
            placeholder="课程大类"
            @keyup.native.enter="searchSubmit"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 科目列表 -->
      <div class="flex_1">
        <el-table
          ref="refSubjectListElTabel"
          :data="subjectList"
          border
          tooltip-effect="light"
          style="width: 100%"
          height="100%"
        >
          >
          <el-table-column prop="Id" label="ID" width="50" />
          <el-table-column prop="Label" label="名称" width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span
                class="color-2e77f8 font-w6 cursor"
                @click="openMoreOptationDialog(scope.$index, scope.row)"
              >{{ scope.row.Label }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Topic" label="章节数" width="60" />
          <el-table-column
            prop="Coursekind"
            label="所属课程类别"
            width="120"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="Description" :show-overflow-tooltip="true" label="描述" />
          <el-table-column label="操作" width="360" fixed="right">
            <template slot-scope="scope">
              <el-button type="success" @click="addChapter(scope.$index, scope.row)">内容管理</el-button>
              <el-button type="warning" @click="questionManager(scope.$index, scope.row)">试题管理</el-button>
              <el-button type="info" @click="gotoBookExercisePage(scope.$index, scope.row)">学员作业</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="between-center m-v-15">
        <el-button type="primary" @click="openSubjectDialog(1)">新增学科</el-button>
        <div>
          <el-pagination
            background
            :current-page.sync="nowPage"
            :page-size="rows"
            layout="total,prev, pager, next, jumper"
            :total="allRows"
            @current-change=" currentPageChange"
          />
        </div>
      </div>
    </div>
    <!-- 新增弹出框 -->
    <div>
      <my-dialog
        :visible.sync="isShowMoreOptationDialog"
        :close-show="true"
        :title="subjectFormData.Label"
      >
        <div slot="left_content" class="p_both20 p-b-20">
          <subject-row-detail ref="refSubjectDetail" />
          <div class="text-center m-t-30">
            <el-button type="primary" @click="openSubjectDialog(0)">编辑</el-button>
          </div>
        </div>
        <div slot="right_content" class="p_both20 p-b-20">暂无其他操作~</div>
      </my-dialog>
      <subject-row-dialog ref="refSubjectDialog" @subClickEvent="updateSubjectList" />
    </div>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog/myDialog";
import subjectRowDialog from "@/views/course/component/subjectRowDialog";
import subjectRowDetail from "@/views/course/component/subjectRowDetail";
import { queryBookList } from "@/api/book";

export default {
  name: "SubjectList",
  components: {
    myDialog,
    subjectRowDialog,
    subjectRowDetail
  },
  data() {
    return {
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 20,
      // 搜索查询-课程大类
      searchBookCourseKind: "",
      // 查询内容
      searchContent: "",
      // 科目的列表数据
      subjectList: [],
      // 控制更多操作模态框的显示和隐藏
      isShowMoreOptationDialog: false,
      // 单条科目的数据
      subjectFormData: {},
      // 当前操作科目的索引
      currentSubjectIndex: null
    };
  },
  mounted() {
    this.getBookList();
    setTimeout(() => {
      this.$refs.refSubjectListElTabel.doLayout();
    }, 2000);
  },
  methods: {
    // 条件搜索
    searchSubmit() {
      this.nowPage = 1;
      this.getBookList();
    },
    // 获取科目列表
    async getBookList() {
      // 取数据的位置
      const offsetRow = (this.nowPage - 1) * this.rows;
      const params = {
        limit: this.rows,
        offset: offsetRow,
        label: this.searchContent,
        coursekind: this.searchBookCourseKind
      };
      const res = await queryBookList(params);
      if (res.code == 200) {
        this.allRows = res.title;
        this.subjectList = res.data ? res.data : [];
      }
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getBookList();
    },

    // 打开更多操作弹出框
    openMoreOptationDialog(index, row) {
      this.currentSubjectIndex = index;
      this.subjectFormData = { ...row };
      this.isShowMoreOptationDialog = true;
      this.$refs.refSubjectDetail.getSubjectRow(row);
    },
    // 打开科目弹出框
    openSubjectDialog(type) {
      if (type) {
        this.$refs.refSubjectDialog.getSubjectRow({ Id: 0 });
      } else {
        this.$refs.refSubjectDialog.getSubjectRow(this.subjectFormData);
      }
    },
    // 添加或编辑之后更新列表数据
    updateSubjectList(type, rowData) {
      if (type) {
        this.subjectList.push(rowData);
      } else {
        this.$set(this.subjectList, this.currentSubjectIndex, rowData);
        this.$refs.refSubjectDetail.getSubjectRow(rowData);
        this.subjectFormData = { ...rowData };
      }
    },
    // 关联章节管理
    addChapter: function(index, row) {
      this.$router.push({
        name: "addChapter",
        query: { Label: row.Label, Id: row.Id }
      });
    },
    // 关联试题管理
    questionManager: function(index, row) {
      this.$router.push({
        name: "questionsList",
        query: { Label: row.Label, Id: row.Id }
      });
    },
    // 学生作业
    gotoBookExercisePage(index, row) {
      this.$router.push({
        name: "chapterExercise",
        query: { Id: row.Id }
      });
    }
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
