<template>
  <div v-cloak class="font16 hgt_full">
       <router-view />
    <div class="flex_column hgt_full">
      <!-- 查询表单 -->
      <div class="m-t-20">
        <el-form :inline="true">
          <el-form-item label="查询内容">
            <el-input
              v-model="searchContent"
              placeholder="请输入科目名称"
              @keyup.enter.native="searchSubmit"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="searchBookCourseKind"
              placeholder="课程大类"
              @keyup.native.enter="searchSubmit"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
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
                class="color-1890ff font-w6 cursor"
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
          <el-table-column label="操作" width="300" fixed="right">
            <template slot-scope="scope">
              <el-button type="success" @click="addChapter(scope.$index, scope.row)">内容管理</el-button>
              <el-button type="warning" @click="questionManager(scope.$index, scope.row)">试题管理</el-button>
              <el-button type="info" @click="gotoBookExercisePage(scope.$index, scope.row)">学员作业</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="between-center m-v-15">
        <el-button type="primary" @click="openSubjectDialog(1)">新增教材</el-button>
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
        :visible.sync="moreOperationDialog"
        :close-show="true"
        :title="customFormData.Label"
      >
        <div slot="left_content" class="p_both20 p-b-20">
          <bookRowDetail @itemModify="updateListItem" :formItemData="customFormData" />
        </div>
        <div slot="right_content" class="p_both20 p-b-20">
          <el-tabs>
            <el-tab-pane id="gjjl" label="跟进记录" name="gjjl"></el-tab-pane>
            <el-tab-pane id="gmjl" label="购买记录" name="gmjl"></el-tab-pane>
            <el-tab-pane id="htdd" label="合同订单" name="htdd"></el-tab-pane>
            <el-tab-pane id="cjlr" label="成绩录入" name="cjlr"></el-tab-pane>
            <el-tab-pane id="dazl" label="档案资料" name="dazl"></el-tab-pane>
          </el-tabs>~
        </div>
      </my-dialog>
      <el-dialog
        :visible.sync="editDialog"
        width="500px"
        :title="customFormData.Id>0?'编辑'+customFormData.Label:'新增校区'"
      >
        <bookRowDetail
          @itemModify="updateListItem"
          :editEnable="true"
          :formItemData="customFormData"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Layout from "@/layout";
import myDialog from "@/components/myDialog/myDialog";
import bookRowDetail from "@/views/course/component/bookRowDetail";
import { queryBookList } from "@/api/book";

export default {
  name: "SubjectList",
  components: {
    myDialog,
    bookRowDetail
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
      // 更多操作弹窗
      moreOperationDialog: false,
      // 更多操作弹窗
      editDialog: false,
      // 模态框获得的单条数据
      customFormData: {},
      // 当前操作平台的索引
      currentRowIndex: null
    };
  },
  mounted() {
    this.getBookList();
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
      const res = await queryBookList("", params);
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
      this.customFormData = row;
      this.moreOperationDialog = true;
      // this.$refs.refSubjectDetail.getSubjectRow(row);
    },
    // 打开科目弹出框
    openSubjectDialog(type) {
      this.editDialog = true;
      this.customFormData = {};
    },
    // 添加或编辑之后更新列表数据
    updateListItem(type, rowData) {
      if (type == 0) {
        this.subjectList.push(rowData);
      } else {
        this.$set(this.subjectList, this.currentSubjectIndex, rowData);
      }
      this.editDialog = false;
    },
    // 关联章节管理
    addChapter: function(index, row) {
      this.$router.push({
        name: "bookAdpter", 
        query:{Id:row.Id}
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
  color: #1890ff;
}
</style>
