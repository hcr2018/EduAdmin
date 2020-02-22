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
      <el-form-item label="备注">
        <el-input v-model="currentFormData.Descritpion" />
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
import { updateCollege,addCollege } from "@/api/college";
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
  name: "CollegeForm",
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
          this.$confirm("确定保存吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            let res;
            if (this.currentFormData.Id > 0) {
              res = await updateCollege(
                this.currentFormData.Id,
                "",
                this.currentFormData
              );

              this.$message("修改成功 !");
            } else {
              res = await addCollege("", "", this.currentFormData);
              this.currentFormData = res.data;
              if (!this.currentFormData.Children) {
                this.currentFormData.Children = [];
              }
              this.currentFormData.Children.push(res.data);
              this.$message("添加成功 !");
            }

            this.$store.dispatch("app/getCollegeWithCourseKind");
          });
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
