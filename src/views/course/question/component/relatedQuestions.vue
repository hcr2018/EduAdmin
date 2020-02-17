<template>
  <!-- 关联题库弹窗 -->
  <div class="pad20">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="章：">
        <el-select v-model="selectedZhang" @change="zhangSelectedChange" placeholder="请选择章">
          <el-option label="全部" :value="0"></el-option>
          <el-option
            :label="item.Label"
            v-for="(item,index) in zhangOptions"
            :value="item.Zhang"
            :key="index+1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="节：">
        <el-select v-model="selectedJie" placeholder="请选择节">
          <el-option label="全部" :value="0"></el-option>
          <el-option
            :label="item.Label"
            v-for="(item,index) in jieOptions"
            :value="item.Jie"
            :key="index+1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchQuestionByZhangJie">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="refMockExam"
      :data="examQuestionList"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="mockExamQuestionIdSelectedChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="QuestionType" label="题型" width="100">
        <template slot-scope="scope">
          <el-tag v-show="scope.row.QuestionType==1">单选题</el-tag>
          <el-tag type="success" v-show="scope.row.QuestionType==2">多选题</el-tag>
          <el-tag type="warning" v-show="scope.row.QuestionType==3">判断题</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="QuestionContent" label="题干">
        <template slot-scope="scope">
          <div v-html="scope.row.QuestionContent" class="QuestionContentImg"></div>
        </template>
      </el-table-column>
      <el-table-column prop="ZhangId" label="章" width="50"></el-table-column>
      <el-table-column prop="JieId" label="节" width="50" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TopicId" label="知识点" width="80" show-overflow-tooltip></el-table-column>
    </el-table>
    <div class="between-center m-t-30">
      <el-pagination
        background
        @current-change="currentPageChangeQuestion"
        :current-page.sync="nowPageQuestions"
        :page-size="rowsQuestions"
        layout="total,prev, pager, next, jumper"
        :total="allRowsQuestions"
      ></el-pagination>
      <div>
        <el-button type="primary" @click="saveExamQuestions">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getZhangOfSubject,
  getQuestionOfBook,
  saveExamQuestions
} from "@/api/course";
export default {
  data() {
    return {
      // 科目ID
      subjectId: "",
      //当前编辑题库的组卷数据
      nowExamRow: {},
      //关联的考题的列表数据
      examQuestionList: [],
      //存储当前选中的组卷已经关联的题库ID
      allQuestionsIdSeleted: [],
      // 考题-数据总条数
      allRowsQuestions: 0,
      // 考题-当前页数
      nowPageQuestions: 1,
      // 考题-每页数据的总条
      rowsQuestions: 10,
      //存储当前页所有题的ID
      nowPageQuestionId: [],
      //存储所有的章
      zhangOptions: [],
      //存储所有的节
      jieOptions: [],
      //查询选中的章或节
      selectedZhang: 0,
      selectedJie: 0
    };
  },
  methods: {
    //   获取组卷的数据
    getRow(row, subjectId) {
      // 初始化数据
      this.examQuestionList = [];
      this.allQuestionsIdSeleted = [];
      this.nowPageQuestionId = [];
      this.zhangOptions = [];
      this.jieOptions = [];
      this.allRowsQuestions = 0;
      this.nowPageQuestions = 1;
      this.rowsQuestions = 10;
      this.selectedZhang = 0;
      this.selectedJie = 0;
      this.nowExamRow = {};
      this.nowExamRow = { ...row };
      this.subjectId = subjectId;
      this.getSubjectZhang();
    },
    // 获取科目下所有的章
    async getSubjectZhang() {
      let res = await getZhangOfSubject(this.subjectId);
      if (res.code == 200) {
        this.zhangOptions = res.data ? res.data : [];
      }
      if (this.nowExamRow.QuestionId) {
        this.allQuestionsIdSeleted = this.nowExamRow.QuestionId.split(",").map(
          Number
        );
      }
      this.getSubjectQuestion();
    },
    // 选中的章-下拉列表
    zhangSelectedChange(selVa) {
      if (selVa == 0) {
        this.jieOptions = [];
        this.selectedJie = 0;
      }
      this.zhangOptions.forEach((item, index) => {
        if (item.Zhang == selVa) {
          this.jieOptions = item.Children ? item.Children : [];
        }
      });
    },
    // 获取该科目下的考题
    async getSubjectQuestion() {
      this.nowPageQuestionId = [];
      let offsetRow = (this.nowPageQuestions - 1) * this.rowsQuestions;
      let params = {
        bookid: this.subjectId,
        zhang: this.selectedZhang,
        jie: this.selectedJie,
        limit: this.rowsQuestions,
        offset: offsetRow,
        simple: 1
      };
      let res = await getQuestionOfBook(params);
      if (res.code == 200) {
        this.allRowsQuestions = res.title;
        this.examQuestionList = res.data ? res.data : [];
        this.examQuestionList.forEach(questionItem => {
          this.nowPageQuestionId.push(questionItem.Id);
          this.allQuestionsIdSeleted.forEach(checkedId => {
            if (questionItem.Id == checkedId) {
              this.$nextTick(() => {
                this.$refs.refMockExam.toggleRowSelection(questionItem, true);
              });
            }
          });
        });
      }
    },
    // 选中组卷模考已经关联的ID
    mockExamQuestionIdSelectedChange(seletedItem) {
      let nowSeletedQuestionId = [];
      // 遍历当前页已选中的选项
      seletedItem.forEach(item => {
        nowSeletedQuestionId.push(item.Id);
      });
      // 遍历已选中的所有Id
      this.allQuestionsIdSeleted = this.allQuestionsIdSeleted.filter(
        (value, index) => {
          if (!this.nowPageQuestionId.includes(value)) {
            return value;
          }
        }
      );
      this.allQuestionsIdSeleted = this.allQuestionsIdSeleted.concat(
        nowSeletedQuestionId
      );
    },
    // 保存已经选中的考题
    async saveExamQuestions() {
      let res = await saveExamQuestions(
        this.nowExamRow.Id,
        this.allQuestionsIdSeleted
      );
      if (res.code == 200) {
        this.common.go_alert("保存成功！");
        this.$emit("subClick", res.data);
      }
    },
    //查询数据-章节
    searchQuestionByZhangJie() {
      // 初始化数据分页
      this.allRowsQuestions = 0;
      this.nowPageQuestions = 1;
      this.examQuestionList = [];
      this.getSubjectQuestion();
    },
    // 考题-分页获取数据
    currentPageChangeQuestion(val) {
      this.nowPageQuestions = val;
      this.getSubjectQuestion();
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.refMockExam.doLayout();
    }, 2000);
  }
};
</script>
<style scope >
</style>