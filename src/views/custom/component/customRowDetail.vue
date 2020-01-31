<template>
  <div>
    <p class="hgt50 l-h-50 border-2b-e0e3ea">基本信息</p>
    <div class="p_both10 p-v-20">
      <div class="flex_dom">
        <p class="color-606266 wid90 text-right">客户姓名：</p>
        <p class="fex_1 m-l-5">{{ customRow.Realname }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">性别：</p>
        <p class="fex_1 m-l-5">{{ customRow.Sex }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">联系电话：</p>
        <p class="fex_1 m-l-5">{{ customRow.Telephone }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">微信：</p>
        <p class="fex_1 m-l-5">{{ customRow.Wechat }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">QQ：</p>
        <p class="fex_1 m-l-5">{{ customRow.Qq }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">当前学历：</p>
        <p class="fex_1 m-l-5">{{ customRow.Education }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">意向情况：</p>
        <p
          class="fex_1 m-l-5"
        >{{ common.FormatSelect(common.IntentionalCustomerType,customRow.Kind) }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">意向课程：</p>
        <p class="fex_1 m-l-5">{{ customRow.FocusCourse }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">所属站点：</p>
        <p class="fex_1 m-l-5">{{ common.FormatSelect(common.platformList,customRow.Platform) }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">管理员：</p>
        <p class="fex_1 m-l-5">{{ customRow.ManagerLabel }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">描述：</p>
        <p class="fex_1 m-l-5">{{ customRow.Description }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">备注：</p>
        <p class="fex_1 m-l-5">{{ customRow.Comments }}</p>
      </div>
    </div>
  </div>
</template>

<script>
 
export default {
  name: "PlatformForm",
  data() {
    return {
      //  客户的基本数据
      customRow: {}
    };
  },
  mounted() {},
  methods: {
    // 获取表单数据
    getCustomRowData(row) {
      this.customRow = {};
      this.customRow = { ...row };
    }
  }
};
</script>  
