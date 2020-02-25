<template>
  <div>
    <el-form
      :model="currentFormData"
      :disabled="currenteditEnable==false"
      :rules="teacherFormRules"
      ref="formUI"
      style="padding:50px 0px 0px 0px"
      label-width="80px"
      size="small"
    >
      <el-form-item label="姓名" prop="Realname">
        <el-input v-model="currentFormData.Realname" placeholder="请输入用户真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="Username">
        <el-input v-model="currentFormData.Username" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item label="英文名">
        <el-input v-model="currentFormData.EnRealname" placeholder="请输入英文名"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="tel">
        <el-input v-model="currentFormData.tel" placeholder="请输入电话号码"></el-input>
      </el-form-item>

      <el-form-item label="角色" prop="role">
        <el-select v-model="currentFormData.role" placeholder="请选择角色">
          <el-option
            :label="item.Label"
            :key="index"
            :value="item.value"
            v-for="(item,index) in common.managerRoleList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="归属校区" prop="platformSelect">
        <el-select
          multiple
          v-model="currentFormData.platformSelect"
          @change="$forceUpdate()"
          placeholder="请选择归属校区"
        >
          <el-option :value="0" label="全部"></el-option>
          <el-option
            :label="item.Label"
            :key="index"
            :value="item.Id"
            v-for="(item,index) in $store.getters.app.myPlatformList"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="currentFormData.Sex" :disabled="currentFormData.Id>0" label="男">男</el-radio>
        <el-radio v-model="currentFormData.Sex" :disabled="currentFormData.Id>0" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="主页显示">
        <el-radio v-model="currentFormData.IsHot" :label="1">显示</el-radio>
        <el-radio v-model="currentFormData.IsHot" :label="0">不显示</el-radio>
      </el-form-item>

      <el-form-item label="宣传照片">
        <el-input v-model="currentFormData.pictrue" placeholder="请填写照片地址"></el-input>
      </el-form-item>
      <el-form-item label="宣传视频">
        <el-input v-model="currentFormData.video" placeholder="请填写视频地址"></el-input>
      </el-form-item>
      <el-form-item label="个人介绍">
        <el-input type="textarea" :rows="3" v-model="currentFormData.info" placeholder="个人信息~"></el-input>
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
        @click="savecurrentFormData"
      >确 认</el-button>
      <el-button v-show="currenteditEnable" @click="currenteditEnable=false">取 消</el-button>
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
      currentFormData: {},
      currenteditEnable: this.editEnable,
      //当前操作者所属的校区。
      OperatorPlatformList: [],
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
  watch: {
    formItemData(newval) {
      this.currentFormData = this.formItemData;
    }
  },
  mounted() {
    this.currentFormData = this.formItemData;
     
  },
  methods: {
    async savecurrentFormData() {
      this.$refs.formUI.validate(async valid => {
        if (valid) {
          this.currentFormData.MasterID = this.masterID;
          this.currentFormData.Platform = this.currentFormData.platformSelect.join(
            ","
          );
          if (this.currentFormData.Id == null || this.currentFormData.Id == 0) {
            // 新增
            let res = await addManager("", "", this.currentFormData);
            if (res.code == 200) {
              // 添加成功之后要触发父组件信息列表修改
              this.isShowPlatformDialog = false;
              this.currentFormData = res.data;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.$emit("subClickEvent", 0, res.data);
            }
          } else {
            // 修改
            let res = await editManager(
              this.currentFormData.Id,
              "",
              this.currentFormData
            );
            if (res.code == 200) {
              this.isShowPlatformDialog = false;
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$emit("subClickEvent", 1, res.data);
            }
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>  