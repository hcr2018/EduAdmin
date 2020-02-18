<template>
  <div class="font16 hgt_full" v-cloak>
    <div class="flex_column hgt_full">
      <question-type-nav :id="subjectId"></question-type-nav>
      <div class="m-t-20 flex_1">
        <vxe-table
          border
          row-id="Id"
          show-overflow
          ref="chapterTreeTable"
          :tree-config="chaperTreeConfig"
          height="100%"
          size="mini"
          :data.sync="chaperTreeTableList"
        >
          <vxe-table-column type="index" width="120" title="序号" tree-node></vxe-table-column>
          <vxe-table-column field="Label" title="名称"></vxe-table-column>
          <vxe-table-column field="TopicNo" title="总题数"></vxe-table-column>
          <vxe-table-column title="操作">
            <template v-slot="{ row }">
              <el-button type="warning" @click="achievementAnalysis(row)">成绩分析</el-button>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getSubjectChapter} from "@/api/question";
import questionTypeNav from "@/views/course/question/component/questionTypeNav";
export default {
  name: "chapterExercises",
  components: {
    questionTypeNav
  },
  data() {
    return {
      // 科目ID
      subjectId: null,
      // 章节练习的列表
      chaperTreeTableList: [],
      // 子列表的配置
      chaperTreeConfig: {
        children: "Children"
      }
    };
  }, 
  methods: {
    // 获取章节列表
    async getChapters() {
      let res = await  getSubjectChapter(this.subjectId);
      if (res.code == 200) {
        this.chaperTreeTableList = res.data;
      }
    },
    // 去查看成绩分析的页面
    achievementAnalysis(row) {
      this.$router.push({
        name: "achievementAnalysis",
        query: { BookID: row.TBookID, ZhangID: row.Zhang, JieID: row.Jie }
      });
    }
  },
  mounted() {
    this.subjectId = this.$route.query.Id;
    this.getChapters();
  }
};
</script>
<style scope >
</style>