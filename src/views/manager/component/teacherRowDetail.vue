<template>
  <div>
    <p class="hgt50 l-h-50 border-2b-e0e3ea">基本信息</p>
    <div class="p_both10 p-v-20">
      <div class="flex_dom">
        <p class="color-606266 wid90 text-right">昵称：</p>
        <p class="fex_1 m-l-5">{{teacherRow.Username}}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">真实姓名：</p>
        <p class="fex_1 m-l-5">{{teacherRow.Realname}}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">联系电话：</p>
        <p class="fex_1 m-l-5">{{teacherRow.tel}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  老师的基本数据
      teacherRow: {}
    };
  },
  methods: {
    // 获取表单数据
    getTeacherRowData(row) {
      this.teacherRow = {};
      this.teacherRow = row;
    }
  },
  mounted() {}
};
</script>  