<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <question-type-nav :id="subjectId"></question-type-nav>
      <div class="flex_1 m-t-20">
        <el-table
          :data="highFrequencyList"
          border
          style="width: 100%"
          ref="refElTabel"
          height="100%"
        >
          <el-table-column prop="Id" label="ID" width="80"></el-table-column>
          <el-table-column prop="Label" label="组卷名称"></el-table-column>
          <el-table-column prop="Examtime" label="考试时间(分)" width="120"></el-table-column>
          <el-table-column prop="State" label="组卷状态" width="100">
            <template slot-scope="scope">
              <el-tag v-show="scope.row.State==1">上架</el-tag>
              <el-tag type="info" v-show="scope.row.State==0">下架</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="editHighFrequency(scope.$index, scope.row)">编辑</el-button>
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
          <el-button type="primary" @click="addHighFrequency">新增高频组卷</el-button>
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
      <!-- 修改编辑-->
      <exam-form ref="refExamForm" @subClick="updateExamData"></exam-form>
      <!-- 关联题库弹窗 -->
      <my-dialog
        :visible.sync="examRelevantQuestionDialog"
        :closeShow="true"
        :closeLeft="false"
        :title="currentHighFrequencyRow.Label"
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
import { getExamList} from "@/api/question";
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
      // 高频组卷的数据
      highFrequencyList: [],
      // 单条高频组卷数据
      currentHighFrequencyRow: {},
      // 当前编辑高频组卷的索引
      currentHighFrequencyIndex: null,
      // 关联题库模态框
      examRelevantQuestionDialog: false
    };
  },
  methods: {
    // 获取具体章节的组卷
    async getExerciseByHighFrequency() {
      let urlParams = this.subjectId + "/" + 3;
      let offsetRow = (this.nowPage - 1) * this.rows;
      let res = await  getExamList(urlParams, {
        limit: this.rows,
        offset: offsetRow
      });
      if (res.code == 200) {
        this.highFrequencyList = res.data ? res.data : [];
        this.allRows = res.title;
      }
    },
    // 编辑组卷模考数据
    editHighFrequency(index, row) {
      this.currentHighFrequencyRow = {};
      this.currentHighFrequencyRow = { ...row };
      this.currentHighFrequencyIndex = index;
      this.$refs.refExamForm.getFormData(row, "编辑高频组卷");
    },
    //添加组卷模考数据
    addHighFrequency() {
      this.$refs.refExamForm.getFormData(
        {
          Id: 0,
          ExamKind: 3,
          ChapterId: this.subjectId.toString(),
          State: 1
        },
        "新增高频组卷"
      );
    },
    // 打开关联题库的模态框
    openExamQuestionListDialog(index, row) {
      this.currentHighFrequencyIndex = index;
      this.currentHighFrequencyRow = { ...row };
      this.$refs.refRelatedQuestions.getRow(row, this.subjectId);
      this.examRelevantQuestionDialog = true;
    },
    // 关联题库后更新数据
    updateExamRow(rowDate) {
      this.$set(
        this.highFrequencyList,
        this.currentHighFrequencyIndex,
        rowDate
      );
    },
    // 新增或编辑之后更新table列表,type=1新增，type=0编辑
    updateExamData(type, rowDate) {
      if (type == 0) {
        this.$set(
          this.highFrequencyList,
          this.currentHighFrequencyIndex,
          rowDate
        );
      } else if (type == 1) {
        this.highFrequencyList.unshift(rowDate);
      }
    },
    // 组卷-分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getExerciseByHighFrequency();
    }
  },
  mounted() {
    this.subjectId = this.$route.query.Id;
    this.getExerciseByHighFrequency();
    setTimeout(() => {
      this.$refs.refElTabel.doLayout();
    }, 2000);
  }
};
</script>
<style scope >
</style>