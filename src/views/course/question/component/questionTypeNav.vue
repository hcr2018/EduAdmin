<template>
  <!-- 子菜单 -->
  <div class="my_tabs p-t-20">
    <div class="flex_mid font14 hgt40 my_tab_bars relative">
      <router-link
        exact
        :to="{name: item.name,query:{Id:id}}"
        tag="div"
        active-class="tab_bar_active"
        class="cursor color-606266 relative hgt_100 text-center my_tab_header_bar"
        v-for="(item,index) in myTabsData"
        :key="index"
      >{{item.title}}</router-link>
    </div>
  </div>
</template>
<script>
export default {
  props: ["id"],
  data() {
    return {
      myTabsData: [
        { title: "章节练习", name: "chapterExercise" },
        { title: "组卷模考", name: "mockExam" },
        { title: "高频组卷", name: "highFrequencyExam" },
        { title: "svip组卷", name: "svipExam" },
        { title: "作业组卷", name: "taskExam" }
      ]
    };
  }
};
</script>
<style scoped >

</style>
