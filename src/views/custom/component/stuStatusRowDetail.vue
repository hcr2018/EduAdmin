<template>
  <div>
    <p class="hgt50 l-h-50 border-2b-e0e3ea">基本信息</p>
    <div class="p_both10 p-v-20">
      <div class="flex_dom">
        <p class="color-606266 wid90 text-right">真实姓名：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.RealName }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">性别：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.Sex }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">联系电话：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.Telephone }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">电子邮箱：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.Email }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">身份证：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.IDCard }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">报读院校：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.UniversityLabel }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">学历属性：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.XueLiShuXing }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">准考证号：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.ZhunKaoZheng }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">报名层次：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.UniversityLevel }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">报读专业：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.UniversityMajor }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">注册时间：</p>
        <p class="fex_1 m-l-5">{{ this.common.dateFormat(stuStatusRow.RegisterTime) }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">学籍编号：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.XueJi }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">招生站点：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.PlatformLabel }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">实缴学费：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.ShijiPrice }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">签单时间：</p>
        <p class="fex_1 m-l-5">{{ this.common.dateFormat(stuStatusRow.AddTime) }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">是否托管：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.ShiFouTuoGuan }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">户籍所在地：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.Huji }}</p>
      </div>
      <div class="flex_dom m-t-10">
        <p class="color-606266 wid90 text-right">收件人地址：</p>
        <p class="fex_1 m-l-5">{{ stuStatusRow.Address }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  学籍的基本数据
      stuStatusRow: {}
    };
  },
  mounted() {},
  methods: {
    // 获取表单数据
    getStuStatusRowData(row) {
      this.stuStatusRow = {};
      this.stuStatusRow = { ...row };
    }
  }
};
</script>  
