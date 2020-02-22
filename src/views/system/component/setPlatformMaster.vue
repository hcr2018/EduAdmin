<template>
  <div>
    <el-radio-group v-model="currentPlatform.MasterID" :disabled="!currenteditEnable">
      <el-radio :label="item.Id" :key="item.Id"   v-for="item in managerList">{{item.Realname}}</el-radio>
    </el-radio-group>

    <div class="around-center hgt60 bge0e3ea">
      <el-button
        type="warning"
        :disabled="false"
        v-show="!currenteditEnable"
        class="m-l-40"
        @click="currenteditEnable=true"
      >编辑</el-button>
      <el-button
        type="primary"
        :disabled="false"
        v-show="currenteditEnable"
        class="m-l-40"
        @click="saveFormItemData"
      >确 认</el-button>
      <el-button v-show="currenteditEnable" @click="currenteditEnable=false">取 消</el-button>
    </div>
  </div>
</template>

<script>
import common from "@/utils/common";
import { getAllManagerOfPlatform, setPlatformMaster } from "@/api/platform";
export default {
  props: {
    // 校区的表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    platformMaster: {
      type: Number,
      default: function() {
        return 0;
      }
    }
  },
  data() {
    return {
      currentPlatform:{},
      currenteditEnable: false,
      managerList: [],
      
    };
  },
  watch: {
    formItemData(newvar) {
      this.currentPlatform = this.formItemData;
      this.getAllManagerOfThisPlatform();
    }
  },
  mounted() {
    this.currentPlatform = this.formItemData;
  
    this.getAllManagerOfThisPlatform();
  },
  methods: {
    async getAllManagerOfThisPlatform() {
      let res = await getAllManagerOfPlatform(this.currentPlatform.Id, "");
      this.managerList = res.data;
    },
    // 添加或编辑数据
    async saveFormItemData() {
      console.log(this.formItemData,this.currentPlatform);
      let res = await setPlatformMaster(
        this.formItemData.Id,
        { masterid: this.currentPlatform.MasterID,add:1 },
        ""
      ); 
      this.currentPlatform = res.data;
      this.$message({
        message: "修改成功",
        type: "success"
      });
    }
  }
};
</script>  