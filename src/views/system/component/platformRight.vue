<template>
  <div>
    <div class="flex_column">
      <span class="marg20">请选择该分校对以下资料库的权限等级。 默认为绿色0值表示该校区拥有下载公开资料的权限。最右边表示该校区拥有所有下载权限包括绝密资料</span>
      <br />

      <div v-for="(item,index) in $store.getters.app.collegeWithCourseKind" :key="item.Id">
        <el-form :disabled="currenteditEnable==false">
          <el-form-item label-width="100px" :label="'('+(index+1)+')'+item.Label+'：'">
            <el-slider
              style="width:100%;"
              class="m-l-40"
              v-model="platformRights[item.Id]"
              :marks="marks"
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
      marks: {
        0: {
          style: {
            color: "#27C91E"
          },
          label: "公开资料"
        },
        1: {
          style: {
            color: "#A6B750"
          },
          label: "隐秘资料"
        },
        2: {
          style: {
            color: "#D7CB45"
          },
          label: "内部资料"
        },
        3: {
          style: {
            color: "#E88E4D"
          },
          label: "保密资料"
        },
        4: {
          style: {
            color: "#ff0000"
          },
          label: "绝密资料"
        }
      },
      currentPlatform: {},
      currenteditEnable: false,
      platformRights: []
    };
  },
  watch: {
    formItemData(newvar) {
      this.currentPlatform = this.formItemData; 
    }
  },
  mounted() {
    this.currentPlatform = this.formItemData;
    let index = 0;
    if (this.currentPlatform.Right == "") {
      this.currentPlatform.Right = "[]";
    }
    let thisPlatformRights = JSON.parse(this.currentPlatform.Right);
    this.platformRights = thisPlatformRights;

    thisPlatformRights.forEach(right => {
      let key = Object.keys(right)[0];
      this.platformRights[key] = right[key];
    });
  },
  methods: {
    async getAllManagerOfThisPlatform() {
      let res = await getAllManagerOfPlatform(this.currentPlatform.Id, "");
      this.managerList = res.data;
    },
    // 添加或编辑数据
    async saveFormItemData() {
      console.log(this.formItemData, this.currentPlatform);
      let res = await setPlatformMaster(
        this.formItemData.Id,
        { masterid: this.currentPlatform.MasterID, add: 1 },
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