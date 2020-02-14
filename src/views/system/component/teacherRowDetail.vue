<template>
  <div>
    <el-form
      :model="formItemData"
      :disabled="currenteditEnable==false"
      :rules="teacherFormRules"
      ref="formUI"
      style="padding:50px 0px 0px 0px"
      label-width="80px"
      size="small"
    >
      <el-form-item label="姓名" prop="Realname">
        <el-input v-model="formItemData.Realname" placeholder="请输入用户真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="Username">
        <el-input v-model="formItemData.Username" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item label="英文名">
        <el-input v-model="formItemData.EnRealname" placeholder="请输入英文名"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="tel">
        <el-input v-model="formItemData.tel" placeholder="请输入电话号码"></el-input>
      </el-form-item>

      <el-form-item label="角色" prop="role">
        <el-select v-model="formItemData.role" placeholder="请选择角色">
          <el-option
            :label="item.Label"
            :key="index"
            :value="item.value"
            v-for="(item,index) in common.managerRoleList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="归属校区" prop="platformSelect">
        <el-select multiple v-model="formItemData.platformSelect" placeholder="请选择归属校区">
          <el-option :value="0" label="全部"></el-option>
          <el-option
            :label="item.Label"
            :key="index"
            :value="item.Id"
            v-for="(item,index) in $store.getters.app.platformList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="formItemData.Sex" :disabled="formItemData.Id>0" label="男">男</el-radio>
        <el-radio v-model="formItemData.Sex" :disabled="formItemData.Id>0" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="主页显示">
        <el-radio v-model="formItemData.IsHot" :label="1">显示</el-radio>
        <el-radio v-model="formItemData.IsHot" :label="0">不显示</el-radio>
      </el-form-item>

      <el-form-item label="照片地址">
        <el-input v-model="formItemData.pictrue" placeholder="请填写照片地址"></el-input>
      </el-form-item>
      <el-form-item label="视频地址">
        <el-input v-model="formItemData.video" placeholder="请填写视频地址"></el-input>
      </el-form-item>
      <el-form-item label="个人信息">
        <el-input type="textarea" :rows="3" v-model="formItemData.info" placeholder="个人信息~"></el-input>
      </el-form-item>
    </el-form>
    <div>
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
      <!-- 

      <el-button @click="isShowTeacherDialog=false">取 消</el-button>
      <el-button type="primary m-l-40" @click="saveFormItemData">保 存</el-button>-->
    </div>
  </div>
</template>

<script>
import { editManager, addManager } from "@/api/manager";
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
      // 是否显示模态框
      isShowTeacherDialog: false,
      // 表单验证
      teacherFormRules: {
        Realname: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          { min: 2, message: "姓名至少两个字符", trigger: "blur" }
        ],
        Username: [
          { required: true, message: "昵称不能为空", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        role: [
          { required: true, message: "必须选择身份角色", trigger: "blur" }
        ],
        platformSelect: [
          { required: true, message: "至少选择一个校区", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 获取表单数据
    getTeacherRowData(row) {
      this.teacherRow = {};
      this.teacherRow = row;
    },
    async saveFormItemData() {
      this.$refs.formUI.validate(async valid => {
        if (valid) {
          this.formItemData.MasterID = this.masterID;
          if (this.formItemData.Id == null || this.formItemData.Id == 0) {
            // 新增
            let res = await addManager("", "", this.formItemData);
            if (res.code == 200) {
              // 添加成功之后要触发父组件信息列表修改
              this.isShowPlatformDialog = false;
              this.formItemData = res.data;
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
          } else {
            // 修改
            let res = await editManager(
              this.formItemData.Id,
              "",
              this.formItemData
            );
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.$message({
                message: "修改成功",
                type: "success"
              });
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