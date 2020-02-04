<template>
  <div>
    <p class="hgt50 l-h-50 border-2b-e0e3ea">基本信息</p>
    <div class="p_both10 p-v-20">
      <div class="flex_dom">
        <p class="color-606266 wid90 text-right">站点名称：</p>
        <p class="fex_1 m-l-5">{{ platformRow.Label }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">负责人：</p>
        <p class="fex_1 m-l-5">{{ platformRow.MasterLabel }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">联系电话：</p>
        <p class="fex_1 m-l-5">{{ platformRow.Telephone }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">地址：</p>
        <p class="fex_1 m-l-5">{{ platformRow.Address }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">备注：</p>
        <p class="fex_1 m-l-5">{{ platformRow.Description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlatformForm',
  data() {
    return {
      //  站点的基本数据
      platformRow: {}
    }
  },
  mounted() {},
  methods: {
    // 获取表单数据
    getPlatformRowData(row) {
      this.platformRow = {}
      this.platformRow = { ...row }
    }
  }
}
</script>
