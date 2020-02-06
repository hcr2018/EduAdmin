<template>
  <div>
    <el-form
      ref="refPlatForm"
      :disabled="editEnable==false"
      :model="platformInfoData"
      :rules="platFormInfoRules" 
       style="padding:50px 0px 0px 0px"
       label-width="80px"
      size="small" 
    >
      <el-form-item label="名称" prop="Label">
        <el-input v-model="platformInfoData.Label" :disabled="platformInfoData.Id>0" />
      </el-form-item>
      <el-form-item label="联系电话" prop="Telephone">
        <el-input v-model="platformInfoData.Telephone" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="platformInfoData.Address" />
      </el-form-item>
      <!-- 校区负责人 -->
      <el-form-item label="负责人">
        <el-radio-group v-model="platformInfoData.MasterID">
          <el-radio-button
            v-for="item in PlatformWorkers"
            :key="item.Id"
            :label="item.Id"
          >{{ item.Realname }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="platformInfoData.Description" />
      </el-form-item>

    <el-form-item label="">
         
            <el-button type="primary" class="m-l-40" @click="saveplatformInfoData">确 认</el-button>
   </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  addPlatform,
  updatePlatform
} from '@/api/platform'
export default {
   props: {
    // 校区的表单数据
    platformInfoData: {
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
  name: 'PlatformForm',
  data() {
    return {
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
    }
  },
  mounted() {},
  methods: {
       // 保存客户信息
    async saveplatformInfoData() {
      this.$refs.refPlatForm.validate(async valid => {
        if (valid) {
          this.platformInfoData.MasterID = this.masterID;
          if (
            this.platformInfoData.Id == null ||
            this.platformInfoData.Id == 0
          ) {
            // 新增
            let res = await addPlatform("","",this.platformInfoData);
            if (res.code == 200) {
              // 添加成功之后要触发父组件信息列表修改
              this.$emit("subClickEvent", 1, res.data);
              this.common.go_alert("添加成功 !");
              this.isShowPlatformDialog = false;
            }
          } else {
            // 修改
            let res = await updatePlatform(
              this.platformInfoData.Id,"",
              this.platformInfoData
            );
            if (res.code == 200) {
              this.platformInfoData = res.data;
              // 修改成功之后要触发父组件信息列表修改
              this.$emit("subClickEvent", 0, res.data);
              this.common.go_alert("修改成功");
              this.isShowPlatformDialog = false;
            }
          }
        } else {
          return false;
        }
      });
    }
  }
}
</script>
