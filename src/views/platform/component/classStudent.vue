<template>
  <div class="p_both10 p-t-5">
    <el-table
      :data="classAllStuList"
      @selection-change="changeSelectStu"
      border
      style="width: 100%"
      tooltip-effect="light"
    >
      <el-table-column type="selection" label="全选" width="55"></el-table-column>
      <el-table-column prop="id" label="学号" width="60"></el-table-column>
      <el-table-column prop="Realname" label="姓名" width="100"></el-table-column>
      <el-table-column prop="Sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="Telephone" label="电话" width="100"></el-table-column>
      <el-table-column prop="Education" label="学历" width="120"></el-table-column>
      <el-table-column prop="FromLabel" label="渠道来源" width="120"></el-table-column>
      <el-table-column label="备注" :show-overflow-tooltip="true"></el-table-column>
    </el-table>
    <div class="m-v-15">
      <!-- <el-button type="danger" @click="removeClassStu" class="border0 m-t-30">移除学员</el-button> -->
      <el-button type="primary" @click="ShowSearchForm=true">添加学员</el-button>
    </div>
    <div class="pad20 border-e0 radius5 m-t-20" v-show="ShowSearchForm">
      <el-form
        :model="stuSearchForm"
        ref="stuSearchForm"
        :rules="stuSearchFormRules"
        label-width="70px"
      >
        <div class="center">
          <el-form-item label="手机号" prop="searchPhone">
            <el-input
              v-model="stuSearchForm.searchPhone"
              @keyup.enter.native="searchStudent"
              placeholder="请输入学员的手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="searchPhone">
            <el-input
              v-model="stuSearchForm.searchName"
              @keyup.enter.native="searchStudent"
              placeholder="请输入学员的姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="30px">
            <el-button type="primary" @click="searchStudent" class="border0">查 询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="m-t-20" v-show="showSrarchStuResult">
        <p>查找结果：</p>
        <div class="m-t-20 center flex_wrap m-l-15">
          <el-checkbox-group v-model="checkBoxAddStu">
            <el-checkbox
              :label="item.id"
              class="m-b-5"
              :key="item.id"
              v-for="item in serachStuList"
            >{{item.Realname}}（{{item.Telephone}}）</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="m-t-30 center-end">
          <el-button type="primary" @click="addStudentToClass" class="border0">加入班级</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getAllClass,
  editClassInfo,
  addClassInfo,
  getOneClass,
  addClassOpenData,
  getClassOpenData,
  getTimeTableByMonth,
  addTimeTableBy,
  addTimeTag,
  getTimeTag,
  addClassStu,
  getClassStu,
  handOutTask,
  getAllClassTaskRecord
} from "@/api/class";
import {
  GetStudentDataTrackAnalysis,
  getCustomTracks,
  addcustomTracks,
  uploadImgInTracks,
  replyTracks,
  receiveSmsTrack,
  getTrackList,
  getCustomBuyCouseRecord,
  addCustomBuyCourseRecord,
  customAllowDoExercise,
  deleteBuyCourse,
  getCustomInfoList,
  addCustomInfo,
  editCustomInfo,
  resetCustomPassword,
  setCustomAccountStatus,
  checkTelephone,
  setStar,
  batchChangeManager
} from "@/api/custom";
import common from "@/utils/common";
export default {
  name: "ClassStudent",
  props: {
    // 校区的表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    }
  },
  watch: {
    formItemData(newval) {
      this.getClassAllStuList();
    }
  },
  data() {
    return {
      common,
      // 搜索表单数据
      stuSearchForm: {
        searchPhone: "",
        searchName: ""
      },
      // 搜索表单验证
      stuSearchFormRules: {
        searchPhone: [
          {
            pattern: /^\d{5,11}$/,
            message: "请输入正确的手机号，且不得少于5位数",
            trigger: "blur"
          }
        ]
      },
      // 查找学员的列表-查找结果
      serachStuList: [],
      // 选中的要加入班级的学员
      checkBoxAddStu: [],
      // 是否显示添加学员模块
      ShowSearchForm: false,
      // 是否显示搜索学员的搜索结果模块
      showSrarchStuResult: false,
      // 获取班级的所有学员
      classAllStuList: [],
      // 复选框所选中的学员ID
      checkBoxStuID: []
    };
  },
  methods: {
    // 获取班级的所有学员
    async getClassAllStuList() {
      this.serachStuList = [];
      this.ShowSearchForm = false;
      this.showSrarchStuResult = false; 
      let res = await getClassStu(this.formItemData.Id);
      this.classAllStuList = res.data ? res.data : [];
    },
    // 查找学员
    searchStudent() {
      // 验证表单数据
      if (!this.stuSearchForm.searchPhone && !this.stuSearchForm.searchName) {
        this.common.go_alert("必须填写学生手机号或姓名之后才能查询哦！");
        return false;
      }
      this.$refs.stuSearchForm.validate(async valid => {
        if (valid) {
          let res = await getCustomInfoList("", {
            limit: 10000,
            tel: this.stuSearchForm.searchPhone,
            realname: this.stuSearchForm.searchName
          });
          if (res.code == 200) {
            if (res.data) {
              this.serachStuList = res.data;
              this.showSrarchStuResult = true;
            } else {
              this.serachStuList = [];
              this.common.go_alert("没有找到该学员哦！");
            }
          }
        } else {
          return false;
        }
      });
    },
    // 向班级添加学员
    async addStudentToClass() {
      if (this.checkBoxAddStu.length < 1) {
        this.common.go_alert("还没有选中要添加的学员哦！");
        return;
      }
      let newStu = [...this.checkBoxAddStu];
      if (this.classAllStuList.length > 0) {
        this.classAllStuList.forEach(stuItem => {
          let index = newStu.indexOf(stuItem.ID);
          if (index != -1) {
            newStu.splice(index, 1);
          }
        });
      }
      if (newStu.length == 0) {
        this.common.go_alert("该学员已经添加过了哦,换个试试吧！");
        this.checkBoxAddStu = [];
        return;
      }
      let res = await addClassStu(this.formItemData.Id, "", newStu);
      if (res.code == 200) {
        this.common.go_alert("添加成功！");
        // 清空搜索和选中的学员数据
        this.checkBoxAddStu = [];
        this.serachStuList = [];
        this.stuSearchForm.searchPhone = "";
        this.ShowSearchForm = false;
        this.showSrarchStuResult = false;
        this.classAllStuList = [];
        if (res.data && res.data.length > 0) {
          this.classAllStuList = res.data;
        }
      }
    },
    // 当复选框发生改变时获取所选中的项
    changeSelectStu(selsetItem) {
      this.checkBoxStuID = [];
      selsetItem.forEach(item => {
        this.checkBoxStuID.push(item.id);
      });
    },
    // 移除班级学员
    removeClassStu() {
      if (this.checkBoxStuID.length == 0) {
        this.common.go_alert("还没有勾选学员哦！");
      } else {
        console.log(this.checkBoxStuID);
      }
    }
  },
  mounted() {}
};
</script> 
<style scoped>
</style> 