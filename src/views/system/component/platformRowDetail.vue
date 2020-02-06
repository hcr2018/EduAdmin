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
        <el-input v-model="platformInfoData.Telephone" @input="change()" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="platformInfoData.Address" @input="change()" />
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
        <el-input v-model="platformInfoData.Description" @input="change()" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
   
  }
}
</script>
