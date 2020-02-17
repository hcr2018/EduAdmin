<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <question-type-nav :id="subjectId"></question-type-nav>
      <div class="flex_1 m-t-20">
        <el-table :data="mockExamList" border style="width: 100%" height="100%" ref="refElTabel">
          <el-table-column prop="Id" label="ID" width="80"></el-table-column>
          <el-table-column prop="Label" label="考卷名称"></el-table-column>
          <el-table-column prop="Examtime" label="考试时间(分)" width="120"></el-table-column>
          <el-table-column prop="State" label="考卷状态" width="100">
            <template slot-scope="scope">
              <el-tag v-show="scope.row.State==1">上架</el-tag>
              <el-tag type="info" v-show="scope.row.State==0">下架</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="editMockExam(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="warning"
                @click="openExamQuestionListDialog(scope.$index, scope.row)"
              >关联考题</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="between-center m-v-15">
        <div>
          <el-button type="primary" @click="addMockExam">新增组卷</el-button>
        </div>
        <el-pagination
          background
          @current-change="currentPageChange"
          :current-page.sync="nowPage"
          :page-size="rows"
          layout="total,prev, pager, next, jumper"
          :total="allRows"
        ></el-pagination>
      </div>
    </div>
    <div>
      <!-- 修改编辑 -->
      <exam-form ref="refExamForm" @subClick="updateExamData"></exam-form>
      <!-- 关联题库弹窗 -->
      <my-dialog
        :visible.sync="examRelevantQuestionDialog"
        :closeShow="true"
        :closeLeft="false"
        :title="currentMockExamRow.Label"
      >
        <div slot="right_content">
          <related-questions ref="refRelatedQuestions" @subClick="updateExamRow"></related-questions>
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script>
import myDialog from "@/components/myDialog/myDialog";
import questionTypeNav from "@/views/course/question/component/questionTypeNav";
import relatedQuestions from "@/views/course/question/component/relatedQuestions";
import examForm from "@/views/course/question/component/examForm";
import { getExamList} from "@/api/course";
export default {
  name: "mockExam",
  components: {
    myDialog,
    relatedQuestions,
    questionTypeNav,
    examForm
  },
  data() {
    return {
      // 科目ID
      subjectId: "",
      // 组卷-数据总条数
      allRows: 0,
      // 组卷-当前页数
      nowPage: 1,
      // 组卷-每页数据的总条
      rows: 10,
      // 组卷模考的数据
      mockExamList: [],
      // 单条组卷模考数据
      currentMockExamRow: {},
      // 当前编辑模考组卷的索引
      currentMockExamIndex: null,
      // 关联题库模态框
      examRelevantQuestionDialog: false
    };
  },
  methods: {
    // 获取具体章节的考卷
    async getExerciseByMockExam() {
      let urlParams = this.subjectId + "/" + 2;
      let offsetRow = (this.nowPage - 1) * this.rows;
      let res = await getExamList(urlParams, {
        limit: this.rows,
        offset: offsetRow
      });
      if (res.code == 200) {
        this.mockExamList = res.data ? res.data : [];
        this.allRows = res.title;
      }
    },
    // 编辑组卷模考数据
    editMockExam(index, row) {
      this.currentMockExamRow = {};
      this.currentMockExamRow = { ...row };
      this.currentMockExamIndex = index;
      this.$refs.refExamForm.getFormData(row, "编辑组卷模考");
    },
    //添加组卷模考数据
    addMockExam() {
      this.$refs.refExamForm.getFormData(
        {
          Id: 0,
          ExamKind: 2,
          ChapterId: this.subjectId.toString(),
          State: 1
        },
        "新增组卷模考"
      );
    },
    // 打开关联题库的模态框
    openExamQuestionListDialog(index, row) {
      this.currentMockExamIndex = index;
      this.currentMockExamRow = { ...row };
      this.$refs.refRelatedQuestions.getRow(row, this.subjectId);
      this.examRelevantQuestionDialog = true;
    },
    // 关联题库后更新数据
    updateExamRow(rowDate) {
      this.$set(this.mockExamList, this.currentMockExamIndex, rowDate);
    },
    // 新增或编辑之后更新table列表,type=1新增，type=0编辑
    updateExamData(type, rowDate) {
      if (type == 0) {
        this.$set(this.mockExamList, this.currentMockExamIndex, rowDate);
      } else if (type == 1) {
        this.mockExamList.unshift(rowDate);
      }
    },
    // 组卷-分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getExerciseByMockExam();
    }
  },
  mounted() {
    this.subjectId = this.$route.query.Id;
    this.getExerciseByMockExam();
    setTimeout(() => {
      this.$refs.refElTabel.doLayout();
    }, 2000);
  }
};
</script>
<style scope >
</style>