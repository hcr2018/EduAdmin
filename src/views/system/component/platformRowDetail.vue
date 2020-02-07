<template>
  <div>
    <el-form
      ref="formUI"
      :disabled="currenteditEnable==false"
      :model="formItemData"
      :rules="platFormInfoRules"
      style="padding:50px 0px 0px 0px"
      label-width="80px"
      size="small"
    >
      <el-form-item label="名称" prop="Label">
        <el-input v-model="formItemData.Label" :disabled="formItemData.Id>0" />
      </el-form-item>
      <el-form-item label="联系电话" prop="Telephone">
        <el-input v-model="formItemData.Telephone" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="formItemData.Address" />
      </el-form-item>
      <!-- 校区负责人 -->
      <el-form-item label="负责人">
        <el-radio-group v-model="formItemData.MasterID">
          <el-radio-button
            v-for="item in PlatformWorkers"
            :key="item.Id"
            :label="item.Id"
          >{{ item.Realname }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formItemData.Description" />
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
  mounted() {},
  methods: {
    
    // 保存客户信息
    async saveFormItemData() {
      this.$refs.formUI.validate(async valid => {
        if (valid) {
          this.formItemData.MasterID = this.masterID;
          if (this.formItemData.Id == null || this.formItemData.Id == 0) {
            // 新增
            let res = await addPlatform("", "", this.formItemData);
            if (res.code == 200) {
              // 添加成功之后要触发父组件信息列表修改
              this.$store.dispatch("app/pushPlatform", res.data).then(() => {
                this.isShowPlatformDialog = false;
                this.formItemData = res.data;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
              });
            }
          } else {
            // 修改
            let res = await updatePlatform(
              this.formItemData.Id,
              "",
              this.formItemData
            );
            if (res.code == 200) {
              this.$store.dispatch("app/pushPlatform", res.data).then(() => {
                this.isShowPlatformDialog = false;
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
              });
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
