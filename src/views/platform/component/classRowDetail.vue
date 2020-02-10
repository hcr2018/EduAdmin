<template>
  <div>
    <el-form
      :model="formItemData"
      ref="classForm"
      :disabled="currenteditEnable==false"
      :rules="ClassFormRules"
      style="padding:50px 0px 0px 0px"
      label-width="80px"
      size="small"
    >
      <el-form-item label="归属校区" v-show="currenteditEnable" prop="PlatformID">
        <el-select v-model="formItemData.PlatformID" placeholder="请选择归属校区">
          <el-option
            v-show="item.Id!=0"
            :label="item.Label"
            :value="item.Id"
            v-for="item in common.platformList"
            :key="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级名称" prop="Label">
        <el-input v-model="formItemData.Label" placeholder="请输入班级名称"></el-input>
      </el-form-item>
      <el-form-item label="开班时间" prop="OpenTime">
        <el-date-picker
          v-model="formItemData.OpenTime"
          value-format="timestamp"
          style="width:170px"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结课时间" prop="Endtime">
        <el-date-picker
          v-model="formItemData.Endtime"
          value-format="timestamp"
          style="width:170px"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="授课形式">
        <el-select v-model="formItemData.TeachMethod" placeholder="请选择授课形式">
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="createClassTime"
          value-format="timestamp"
          style="width:170px"
          disabled
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="情况备注">
        <el-input type="textarea" :rows="3" v-model="formItemData.Description" placeholder="情况备注~"></el-input>
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
    }
  },
  data() {
    return {
      common,
      currenteditEnable: this.editEnable,
      // 控制班级弹出框
      isShowClassDialog: false,
      // 创建班级的时间
      createClassTime: null,
      // 创建人
      createPerson: null,
      // 表单验证
      ClassFormRules: {
        Label: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 添加或编辑数据
    saveFormItemData() {
      // 验证表单数据
      this.$refs.classForm.validate(async valid => {
        if (valid) {
          if (this.formItemData.Id > 0) {
            // 编辑
            let res = await editClassInfo(
              this.formItemData.Id,
              "",
              this.formItemData
            );
            this.isShowPlatformDialog = false;
            this.formItemData = res.data;
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            // 创建
            let res = await addClassInfo("", "", this.formItemData);
            if (res.code == 200) {
              this.$message({
                message: "创建成功",
                type: "success"
              });
              this.$emit("updateRowData", res.data, 1);
              this.isShowClassDialog = false;
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