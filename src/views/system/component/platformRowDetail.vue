<template>
  <div>
    <el-form
      ref="formUI"
      :disabled="currenteditEnable==false"
      :model="currentFormData"
      :rules="platFormInfoRules"
      style="padding:50px 0px 0px 0px"
      label-width="80px"
      size="small"
    >
      <el-form-item label="名称" prop="Label">
        <el-input v-model="currentFormData.Label" />
      </el-form-item>
      <el-form-item label="联系电话" prop="Telephone">
        <el-input v-model="currentFormData.Telephone" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="currentFormData.Address" />
      </el-form-item>
      <!-- 校区负责人 -->
      <el-form-item label="负责人">
        
       {{currentFormData.MasterLabel}}
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="currentFormData.Description" />
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
import { addPlatform, updatePlatform } from "@/api/platform";
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
  name: "PlatformForm",
  data() {
    return {
      currentFormData: {},
      currenteditEnable: this.editEnable,
      // 校区对应的工作人员
      PlatformWorkers: [],
      // 表单验证
      platFormInfoRules: {
        Label: [
          { required: true, message: "校区名称不能为空", trigger: "blur" }
        ],
        Telephone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /^\d{11}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    formItemData(newval) {
      this.currentFormData = this.formItemData; 
    }
  },
  created() {
    this.currentFormData = this.formItemData;
  },
  methods: {
    // 保存客户信息
    async savecurrentFormData() {
      this.$refs.formUI.validate(async valid => {
        if (valid) {
          this.currentFormData.MasterID = this.masterID;
          if (this.currentFormData.Id == null || this.currentFormData.Id == 0) {
            // 新增
            let res = await addPlatform("", "", this.currentFormData);
            this.$emit("subClickEvent", 0, res.data);
            // 添加成功之后要触发父组件信息列表修改
            this.$store.dispatch("app/pushPlatform", res.data).then(() => {
              this.isShowPlatformDialog = false;
              this.currentFormData = res.data;
              this.$message({
                message: "添加成功",
                type: "success"
              });
            });
          } else {
            // 修改
            let res = await updatePlatform(
              this.currentFormData.Id,
              "",
              this.currentFormData
            );
            this.$emit("subClickEvent", 1, res.data);
            this.$store.dispatch("app/pushPlatform", res.data).then(() => {
              this.isShowPlatformDialog = false;
              this.$message({
                message: "修改成功",
                type: "success"
              });
            });
          }
        } else {
          this.$message({
            message: "请完善表单",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
