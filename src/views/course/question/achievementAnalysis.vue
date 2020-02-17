<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <div class="my_tabs">
        <div class="center font14 hgt40 my_tab_bars relative">
          <div
            :class="{'tab_bar_active':index==activeMyTab}"
            class="cursor color-606266 relative hgt_100 text-center my_tab_header_bar"
            v-for="(item,index) in myTabsData"
            :key="index"
            @click="activeMyTab=index"
          >{{item.title}}</div>
        </div>
      </div>
      <!-- 错的最多的学员 -->
      <div v-show="activeMyTab==0" class="flex_1">
        <div class="flex_column hgt_full">
          <div class="m-b-10 m-t-20 between-center">
            <!-- 查询表单 -->
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item :label="chapterName"></el-form-item>
              <el-form-item label="日期范围">
                <el-date-picker
                  v-model="startingTime"
                  type="daterange"
                  value-format="timestamp"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width:220px;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="badGrade">差成绩</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getChpaterExerciseRecord">查询</el-button>
              </el-form-item>
            </el-form>
            <vxe-button @click="exportStuWoringQues">导出Excel</vxe-button>
          </div>
          <div class="flex_1">
            <el-table
              :data="studentAchievementList"
              tooltip-effect="light"
              border
              id="idWrongStu"
              style="width: 100%"
              height="100%"
            >
              <el-table-column prop="StudentName" label="学生姓名" width="100"></el-table-column>
              <el-table-column prop="Tel" label="学生电话" width="100"></el-table-column>
              <el-table-column prop="Label" label="练习的内容" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="TotalNum" sortable width="100" label="题目总数"></el-table-column>
              <el-table-column prop="AnswerNum" sortable width="100" label="答题总数"></el-table-column>
              <el-table-column prop="RightNum" sortable width="90" label="正确数"></el-table-column>
              <el-table-column prop="Score" sortable label="得分" width="80"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 高频错题 -->
      <div v-show="activeMyTab==1" class="flex_1">
        <div class="flex_column hgt_full">
          <div class="m-b-10 m-t-20 between-center">
            <!-- 查询表单 -->
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item :label="chapterName"></el-form-item>
              <el-form-item label="日期范围">
                <el-date-picker
                  v-model="startingTimeQuestion"
                  value-format="timestamp"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width:220px;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-radio v-model="isWrongRate" :label="false">错误数较高</el-radio>
                <el-radio v-model="isWrongRate" :label="true">错误率较高</el-radio>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getTopWrongNumQuestionByChapter">查询</el-button>
              </el-form-item>
            </el-form>
            <vxe-button @click="exportTopWrongQues">导出Excel</vxe-button>
          </div>
          <div class="flex_1">
            <el-table
              :data="TopWrongNumQuestionLIst"
              tooltip-effect="light"
              border
              id="idTopWrongQues"
              style="width: 100%"
              height="100%"
            >
              <el-table-column prop="ID" label="ID" width="50"></el-table-column>
              <el-table-column prop="QuestionType" label="题型" width="65">
                <template slot-scope="scope">
                  <span v-show="scope.row.QuestionType==1">单选题</span>
                  <span v-show="scope.row.QuestionType==2">多选题</span>
                  <span v-show="scope.row.QuestionType==3">判断题</span>
                </template>
              </el-table-column>
              <el-table-column prop="QuestionContent" label="题干" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="AnswerNum" sortable width="100" label="回答次数"></el-table-column>
              <el-table-column prop="WrongNum" sortable width="100" label="答错次数"></el-table-column>
              <el-table-column prop="WrongNum" sortable width="90" label="错误率">
                <template slot-scope="scope">
                  <span>{{(scope.row.WrongNum/scope.row.AnswerNum*100).toFixed(2)+"%"}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDoWrongQuseStuList, getTopWrongQuseList } from "@/api/course";
export default {
  name: "",
  data() {
    return {
      // 导航菜单的数据
      myTabsData: [
        { title: "错的最多的学员", name: "chapterExercise" },
        { title: "高频错题", name: "mockExam" }
      ],
      // 当前激活菜单的索引
      activeMyTab: 0,
      // 当前的章节名称-学生
      chapterName: "",
      // 是否按差成绩查询
      badGrade: false,
      // 获取章节ID
      BookId: null,
      startingTime: null,
      ZhangId: null,
      JieId: null,
      // 学生成绩列表
      studentAchievementList: [],
      // 高频错题筛选的时间范围
      startingTimeQuestion: null,
      // 按错误数还是错误率排序
      isWrongRate: false,
      // 高频错题的数据
      TopWrongNumQuestionLIst: []
    };
  },
  created() {},

  methods: {
    // 获取做题错的较多的学生的数据
    async getChpaterExerciseRecord() {
      let from = 0;
      let end = parseInt(new Date().getTime() / 1000);
      if (this.startingTime != null) {
        if (this.startingTime[0]) {
          from = parseInt(this.startingTime[0] / 1000);
        }
        if (this.startingTime[1]) {
          end = parseInt(this.startingTime[1] / 1000);
        }
      }
      let urlParams = this.BookId + "-" + this.ZhangId + "-" + this.JieId;
      let res = await getDoWrongQuseStuList(urlParams, {
        from: from,
        end: end,
        badest: this.badGrade
      });
      if (res.code == 200) {
        this.chapterName = res.data.Label;
        this.studentAchievementList = res.data.Children;
      }
    },
    // 获取高频错题的数据
    async getTopWrongNumQuestionByChapter() {
      let from = 0;
      let end = parseInt(new Date().getTime() / 1000);
      if (this.startingTimeQuestion != null) {
        if (this.startingTimeQuestion[0]) {
          from = parseInt(this.startingTimeQuestion[0] / 1000);
        }
        if (this.startingTimeQuestion[1]) {
          end = parseInt(this.startingTimeQuestion[1] / 1000);
        }
      }
      let urlParams = this.BookId + "-" + this.ZhangId + "-" + this.JieId;
      let res = await getTopWrongQuseList(urlParams, {
        from: from,
        end: end,
        isWrongRate: this.isWrongRate
      });
      if (res.code == 200) {
        this.TopWrongNumQuestionLIst = res.data ? res.data : [];
      }
    },
    // 导出数据
    exportStuWoringQues() {
      this.common.exportExcel("idWrongStu", this.chapterName);
    },
    // 导出数据
    exportTopWrongQues() {
      this.common.exportExcel("idTopWrongQues", this.chapterName);
    }
  },
  mounted() {
    this.BookId = this.$route.query.BookID;
    this.ZhangId = this.$route.query.ZhangID;
    this.JieId = this.$route.query.JieID;
    this.getChpaterExerciseRecord();
    this.getTopWrongNumQuestionByChapter();
  }
};
</script>
<style scope >
</style>