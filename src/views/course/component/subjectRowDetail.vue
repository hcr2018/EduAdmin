<template>
  <div>
    <p class="hgt50 l-h-50 border-2b-e0e3ea">基本信息</p>
    <div class="p_both10 p-v-20">
      <div class="flex_dom">
        <p class="color-606266 wid90 text-right">科目名称：</p>
        <p class="fex_1 m-l-5">{{ subjectRow.Label }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">课程类别：</p>
        <p class="fex_1 m-l-5">{{ subjectRow.Coursekind }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">章节数：</p>
        <p class="fex_1 m-l-5">{{ subjectRow.Topic }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">描述：</p>
        <p class="fex_1 m-l-5">{{ subjectRow.Description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  科目的基本数据
      subjectRow: {}
    };
  },
  mounted() {},
  methods: {
    // 获取表单数据
    getSubjectRow(row) {
      this.subjectRow = {};
      this.subjectRow = { ...row };
    }
  }
};
</script>  
