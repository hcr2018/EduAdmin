<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowTeacherDialog"
    width="740px"
    :title="teacherFormData.Id>0?'编辑用户':'新增用户'"
  >
    <div class="teacherInfo">
      <el-form
        :model="teacherFormData"
        :rules="teacherFormRules"
        ref="refTeacherForm"
        label-width="100px"
        size="small"
        class="dialog-body-pad"
      >
        <el-form-item label="姓名" prop="Realname">
          <el-input v-model="teacherFormData.Realname" placeholder="请输入用户真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="Username">
          <el-input v-model="teacherFormData.Username" placeholder="请输入用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="英文名">
          <el-input v-model="teacherFormData.EnRealname" placeholder="请输入英文名"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="tel">
          <el-input v-model="teacherFormData.tel" placeholder="请输入电话号码"></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="teacherFormData.role" placeholder="请选择角色">
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
            v-model="teacherFormData.platformSelect"
            @change="inputForceUpdate"
            placeholder="请选择归属校区"
          >
            <el-option :value="0" label="全部"></el-option>
            <el-option
              :label="item.Label"
              :key="index"
              :value="item.Id"
              v-for="(item,index) in common.platformList"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="between-center">
          <el-form-item label="性别">
            <el-radio v-model="teacherFormData.Sex" :disabled="teacherFormData.Id>0" label="男">男</el-radio>
            <el-radio v-model="teacherFormData.Sex" :disabled="teacherFormData.Id>0" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="主页显示">
            <el-radio v-model="teacherFormData.IsHot" :label="1">显示</el-radio>
            <el-radio v-model="teacherFormData.IsHot" :label="0">不显示</el-radio>
          </el-form-item>
        </div>
        <el-form-item label="排序">
          <el-input-number v-model="teacherFormData.Sort" :min="1" label="数字越大越靠前"></el-input-number>
        </el-form-item>
        <el-form-item label="照片地址">
          <el-input v-model="teacherFormData.pictrue" placeholder="请填写照片地址"></el-input>
        </el-form-item>
        <el-form-item label="视频地址">
          <el-input v-model="teacherFormData.video" placeholder="请填写视频地址"></el-input>
        </el-form-item>
        <el-form-item label="个人信息">
          <el-input type="textarea" :rows="3" v-model="teacherFormData.info" placeholder="个人信息~"></el-input>
        </el-form-item>
      </el-form>
      <div class="around-center hgt60 bge0e3ea">
        <div>
          <el-button @click="isShowTeacherDialog=false">取 消</el-button>
          <el-button type="primary m-l-40" @click="saveTeacherInfoData">保 存</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  editManager,
   addManager 
} from '@/api/manager'
import common from '@/utils/common'
export default {
  data() {
    return {
      common,
      // 是否显示模态框
      isShowTeacherDialog: false,
      // 老师的表单数据
      teacherFormData: {},
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
      this.teacherFormData = {};
      this.teacherFormData = row;
      this.isShowTeacherDialog = true;

      if (this.teacherFormData.Platform) {
        this.teacherFormData.platformSelect = [];
        this.teacherFormData.platformSelect = this.teacherFormData.Platform.split(
          ","
        ).map(Number);
      }
    },
    //保存用户的基本信息
    saveTeacherInfoData() {
      this.$refs.refTeacherForm.validate(async valid => {
        if (valid) {
          this.teacherFormData.Platform = this.teacherFormData.platformSelect.join(
            ","
          );
          if (this.teacherFormData.Id > 0) {
            let res = await editManager(
              this.teacherFormData.Id,
              this.teacherFormData
            );
            if (res.code == 200) {
              this.common.go_alert("修改成功 !");
              this.teacherFormData = {};
              this.teacherFormData = { ...res.data };
              if (this.teacherFormData.Platform) {
                this.teacherFormData.platformSelect = [];
                this.teacherFormData.platformSelect = this.teacherFormData.Platform.split(
                  ","
                ).map(Number);
              }
              this.$emit("subClickEvent", 0, res.data);
              this.isShowTeacherDialog = false;
            }
          } else {
            let res = await    addManager(this.teacherFormData);
            if (res.code == 200) {
              this.common.go_alert("添加成功，初始密码为:" + res.title);
              this.$emit("subClickEvent", 1, res.data);
              this.isShowTeacherDialog = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    // 强制刷新
    inputForceUpdate() {
      this.$forceUpdate();
    }
  }
};
</script>  
<style scoped>
.teacherInfo >>> .el-select,
.teacherInfo >>> .el-input-number--small {
  width: 100%;
}
</style>