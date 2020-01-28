<template>
  <div class="p_both10 p-t-5">
    <el-table ref="refElTabel" :data="alarmList" border tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="AddTime" width="90" label="告警时间"></el-table-column>
      <el-table-column label="告警名称"></el-table-column>
      <el-table-column prop="QiankuanPrice" width="100" label="告警人"></el-table-column>
      <el-table-column prop="Comments" label="告警内容"></el-table-column>
    </el-table>
    <div class="between-center m-t-20">
      <div>
        <el-pagination
          background
          @current-change=" currentPageChange"
          :current-page.sync="nowPage"
          :page-size="rows"
          layout="total,prev, pager, next, jumper"
          :total="allRows"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 数据总条数
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页数据的总条
      rows: 10,
      // 客户合同信息列表
      alarmList: []
    };
  },

  methods: {
    // 条件搜索
    searchSubmit() {
      this.nowPage = 1;
      this.getAlarmList();
    },
    // 分页获取数据
    currentPageChange(val) {
      this.nowPage = val;
      this.getAlarmList();
    },
    //获取消息列表
    async getAlarmList() {
      this.alarmList = [];
    }
  },

  mounted() {
    setTimeout(() => {
      this.$refs.refElTabel.doLayout();
    }, 2000);
    this.getAlarmList();
  }
};
</script> 
<style scoped>
</style>