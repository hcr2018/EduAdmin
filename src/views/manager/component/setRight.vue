<template>
  <div class="p_both10 setright">
    <div v-for="(items,key,index) in managerRightsObj" :key="index" class="p-v-10">
      <div class="center m-b-10">
        <span class="splitLine m-r-10"></span>
        <span>{{setRighTitle[key]}}</span>
      </div>
      <div class="flex_wrap center p-b-5 border-b-e0">
        <div v-for="item in items" :key="item.Value" class="quan_xian_item m-b-10">
          <el-checkbox
            @change="checked=>changeRight(checked,item)"
            v-model="item.Selected"
          >{{item.Label}}</el-checkbox>
        </div>
      </div>
    </div>
    <div class="around-center m-v-15">
      <el-button type="primary" @click="saveRight">保 存</el-button>
    </div>
  </div>
</template>
<script>
import {
  setManagerPower 
} from '@/api/manager'
export default {
  name: "setRight",
  data() {
    return {
      // 老师的表单数据
      teacherFormData: {},
      // 所有的权限数据
      managerRightsObj: {},
      // 权限名称
      setRighTitle: {
        book: "学科(教材)相关权限",
        class: "班级相关权限",
        course: "课程相关权限",
        exercise: "考试相关权限",
        manager: "管理员相关权限",
        news: "新闻相关权限",
        student: "学员相关权限",
        system: "系统相关权限"
      },
      // 存储已选中的权限
      currentManagerRights: []
    };
  },
  methods: {
    // 获取表单数据和权限
    getRowDataAddPower(row, power) {
      this.teacherFormData = {};
      this.managerRightsObj = {};
      this.teacherFormData = row;
      this.managerRightsObj = { ...power };
    },
    changeRight(checked, itemObj) {
      let item = { index: itemObj.Value };
      if (checked) {
        item.Selected = 1;
      } else {
        item.Selected = -1;
      }
      this.currentManagerRights[itemObj.Value] = item;
    },
    //保存用户的权限设置
    async saveRight() {
      let res = await  setManagerPower(
        this.teacherFormData.Id,
        this.currentManagerRights
      );
      if (res.code == 200) {
        this.$message("设置成功!");
        this.$emit("subClickEvent", 0, res.data);
      }
    }
  }
};
</script>  
<style scoped>
.splitLine {
  width: 2px;
  height: 14px;
  background-color: #1890ff;
  border-radius: 1px;
  display: inline-block;
}
.quan_xian_item {
  width: calc(100% / 4);
}
</style>