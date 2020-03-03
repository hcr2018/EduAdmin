<template>
  <div>
    <div class="flex_column">
      <span class="marg20">请选择该分校对以下资料库的权限等级。 默认为绿色0值表示该校区拥有下载公开资料的权限。最右边表示该校区拥有所有下载权限包括绝密资料</span>
      <br />

      <div v-for="(item,index) in $store.getters.app.collegeWithCourseKind" :key="item.Id">
        <el-form  >
          <el-form-item label-width="100px" :label="'('+(index+1)+')'+item.Label+'：'">
            <el-slider
              style="width:100%;"
              class="m-l-40"
              v-model="platformRights[item.Id]"
              :format-tooltip="formatTooltipFunc"
              :marks="common.docRightmarks"
              :min="0"
              :max="5"
            ></el-slider>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="around-center marg20">
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
import { addPlatform, updatePlatform } from "@/api/platform";
export default {
  props: {
    // 校区的表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    }
  },
  data() {
    return {
      value: 1,
     common,
      currentPlatform:  this.formItemData,
      currenteditEnable: false,
      platformRights: []
    };
  },
  watch: {
    formItemData(newvar) {
      this.setData();
    }
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      this.currentPlatform = this.formItemData;
      let index = 0;
      if (this.currentPlatform.Right == "") {
        this.currentPlatform.Right = "[]";
      }
      let thisPlatformRights = JSON.parse(this.currentPlatform.Right);

      this.platformRights = [];
      thisPlatformRights.forEach(right => {
        if (right.constructor == Object) {
          let key = Object.keys(right)[0];
          this.platformRights[key] = right[key];
        }
      });
    },
    formatTooltipFunc(value) {
      if (this.common.docRightmarks[value]) {
        return "允许下载" + this.common.docRightmarks[value].label + "的资料";
      }
      return "";
    },
    // 添加或编辑数据
    async saveFormItemData() {
      // this.currentPlatform.Right = JSON.stringify(this.platformRights);
      let temp = [];
      for (let i = 0; i < this.platformRights.length; i++) {
        if (this.platformRights[i]) { 
          let obj = {};
          obj[i] = this.platformRights[i];
          temp.push(obj);
        }
      }
      this.currentPlatform.Right = JSON.stringify(temp);
      console.log(this.currentPlatform);
      let res = await updatePlatform(
        this.formItemData.Id,
        "",
        this.currentPlatform
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