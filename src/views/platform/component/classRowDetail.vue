<template>
  <div>
    <el-form
      :model="currentItemData"
      ref="classForm"
      :disabled="currenteditEnable==false"
      :rules="ClassFormRules"
      style="padding:20px 10px 10px 10px"
      label-width="80px"
      size="small"
    >
      <el-form-item label="班级名称" prop="Label">
        <el-input v-model="currentItemData.Label" placeholder="请输入班级名称"></el-input>
      </el-form-item>
      <el-form-item label="开班时间" prop="OpenTime">
        <el-date-picker v-model="currentItemData.OpenTime" style="width:170px" type="date"></el-date-picker>
      </el-form-item>
      <el-form-item label="结课时间" prop="Endtime">
        <el-date-picker v-model="currentItemData.Endtime" style="width:170px" type="date"></el-date-picker>
      </el-form-item>
      <el-form-item label="授课形式">
        <el-select v-model="currentItemData.TeachMethod" placeholder="请选择授课形式">
          <el-option
            :label="item.Label"
            :value="item.value"
            v-for="item in common.teachingForm"
            :key="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建人员">
        <el-input v-model="createPerson" disabled></el-input>
      </el-form-item>
      <el-form-item label="年级">
        <el-date-picker
          style="width:100px"
          v-model="searchGrade"
          value-format="yyyy"
          type="year"
          placeholder="选择年"
        ></el-date-picker>届
      </el-form-item>
      <el-form-item label="情况备注">
        <el-input
          type="textarea"
          :rows="3"
          v-model="currentItemData.Description"
          placeholder="情况备注~"
        ></el-input>
      </el-form-item>
    </el-form>
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
import common from "@/utils/common";
import { isDate } from 'xe-utils/methods';
export default {
  props: {
    // 校区的表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    },
    editEnable: {
      typ: Boolean,
      default: false
    },
    platform: {
      typ: Number,
      default: 0
    }
  },
  data() {
    return {
      common,
      searchGrade: new Date(),
      currenteditEnable: this.editEnable,
      // 控制班级弹出框
      isShowClassDialog: false,
      // 创建班级的时间
      createClassTime: null,
      // 创建人
      createPerson: null,
      currentItemData: {},
      // 表单验证
      ClassFormRules: {
        Label: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    formItemData(newvar) {
      this.setData();
    }
  },
  mounted() {
    if (isDate(this.searchGrade)) {
      this.currentItemData.Grade = this.searchGrade.getFullYear();
    }
    this.setData();
  },
  methods: {
    setData() {
      this.currentItemData = this.formItemData;
    },
    // 添加或编辑数据
    saveFormItemData() {
      this.currentItemData.PlatformID = parseInt(this.platform);
      if (isDate(this.searchGrade)) {
        this.currentItemData.Grade = this.searchGrade.getFullYear();
      }

      // 验证表单数据
      this.$refs.classForm.validate(async valid => {
        if (valid) {
          let rowdata = { ...this.currentItemData };
          if (isNaN(this.currentItemData.OpenTime)) {
            rowdata.OpenTime = Math.floor(
              this.currentItemData.OpenTime.getTime() / 1000
            );
          } else {
            rowdata.OpenTime = this.currentItemData.OpenTime / 1000;
          }
          if (isNaN(this.currentItemData.Endtime)) {
            rowdata.Endtime = Math.floor(
              this.currentItemData.Endtime.getTime() / 1000
            );
          } else {
            rowdata.Endtime = this.currentItemData.Endtime / 1000;
          }
          if (rowdata.Id > 0) {
            // 编辑
            let res = await editClassInfo(rowdata.Id, "", rowdata);
            this.isShowPlatformDialog = false;
            this.currentItemData = res.data; 
            this.$emit("subClickEvent", 1, res.data);
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            // 创建
            let res = await addClassInfo("", "", rowdata);
            if (res.code == 200) {
              this.$message({
                message: "创建成功",
                type: "success"
              });
              this.$emit("subClickEvent", 0, res.data); 
            }
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {}
};
</script>  