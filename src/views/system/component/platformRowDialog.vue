<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isShowPlatformDialog"
    width="740px"
    :title="platformInfoData.Id>0?'编辑站点':'新增站点'"
  >
    <el-form
      :model="platformInfoData"
      :rules="platFormInfoRules"
      ref="refPlatForm"
      label-width="100px"
      size="small"
      class="dialog-body-pad"
    >
      <el-form-item label="名称" prop="Label">
        <el-input v-model="platformInfoData.Label" :disabled="platformInfoData.Id>0"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="Telephone">
        <el-input v-model="platformInfoData.Telephone" @input="change()"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="platformInfoData.Address" @input="change()"></el-input>
      </el-form-item>
      <!-- 站点负责人 -->
      <el-form-item label="负责人">
        <el-radio-group v-model="masterID">
          <el-radio-button
            :label="item.Id"
            v-for="item in PlatformWorkers"
            :key="item.Id"
          >{{item.Realname}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="platformInfoData.Description" @input="change()"></el-input>
      </el-form-item>
    </el-form>
    <div class="around-center hgt60 bge0e3ea">
      <div>
        <el-button @click="isShowPlatformDialog=false">取 消</el-button>
        <el-button type="primary" @click="saveplatformInfoData" class="m-l-40">确 认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script> 
export default {
  name: "platformRowDialog",
  data() {
    return {
      // 是否显示平台弹出框
      isShowPlatformDialog: false,
      // 站点的表单数据
      platformInfoData: {},
      // 站点对应的工作人员
      PlatformWorkers: [],
      // 校区负责人ID
      masterID: null,
      // 表单验证
      platFormInfoRules: {
        Label: [
          { required: true, message: "站点名称不能为空", trigger: "blur" }
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
  methods: {
    change($event) {
      this.$forceUpdate();
    },
    // 获取表单数据
    getPlatformRowData(rowData) {
      // 初始化数据
      this.masterID = null;
      this.platformInfoData = {};
      this.PlatformWorkers = {};
      this.isShowPlatformDialog = true;
      this.platformInfoData = { ...rowData };
      this.masterID = this.platformInfoData.MasterID;
      if (this.platformInfoData.Id) {
        this.platformWorkers();
      }
    },
    // 保存客户信息
    saveplatformInfoData() {
      // this.$refs.refPlatForm.validate(async valid => {
      //   if (valid) {
      //     this.platformInfoData.MasterID = this.masterID;
      //     if (
      //       this.platformInfoData.Id == null ||
      //       this.platformInfoData.Id == 0
      //     ) {
      //       // 新增
      //       let res = await $PlatformHttp.addPlatform(this.platformInfoData);
      //       if (res.code == 200) {
      //         // 添加成功之后要触发父组件信息列表修改
      //         this.$emit("subClickEvent", 1, res.data);
      //         this.common.go_alert("添加成功 !");
      //         this.isShowPlatformDialog = false;
      //       }
      //     } else {
      //       // 修改
      //       let res = await $PlatformHttp.updatePlatform(
      //         this.platformInfoData.Id,
      //         this.platformInfoData
      //       );
      //       if (res.code == 200) {
      //         this.platformInfoData = res.data;
      //         // 修改成功之后要触发父组件信息列表修改
      //         this.$emit("subClickEvent", 0, res.data);
      //         this.common.go_alert("修改成功");
      //         this.isShowPlatformDialog = false;
      //       }
      //     }
      //   } else {
      //     return false;
      //   }
      // });
    },
    // 获取站点的工作人员
    async platformWorkers() {
      // this.PlatformWorkers = [];
      // let res = await $PlatformHttp.getPlatformWorkers(
      //   this.platformInfoData.Id
      // );
      // if (res.code == 200) {
      //   this.PlatformWorkers = res.data;
      // }
    }
  },
  mounted() {}
};
</script>  