<template>
  <div>
    <p class="hgt50 l-h-50 border-2b-e0e3ea">基本信息</p>
    <div class="p_both10 p-v-20">
      <div class="flex_dom">
        <p class="color-606266 wid90 text-right">产品名称：</p>
        <p class="fex_1 m-l-5">{{ travelBrochureData.Label }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">产品特征：</p>
        <p class="fex_1 m-l-5">{{ travelBrochureData.Comments }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">宣传售价：</p>
        <p class="fex_1 m-l-5">{{ travelBrochureData.Price }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">课时量：</p>
        <p class="fex_1 m-l-5">{{ travelBrochureData.CourseNum }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">产品描述：</p>
        <p class="fex_1 m-l-5">{{ travelBrochureData.Description }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">创建时间：</p>
        <p class="fex_1 m-l-5">{{ this.common.dateFormat(travelBrochureData.Createtime) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import common from '@/utils/common'
export default {
  props: {
    // 宣传资料的数据
    travelBrochureData: {}
  },
  data() {
    return {
      common
    }
  },
  mounted() {},
  methods: {

  }
}
</script>
