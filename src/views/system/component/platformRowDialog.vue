<template>
  <el-dialog
    :visible.sync="visible"
    width="740px"
    :before-close="handleClose"
    :title="platformInfoData.Id>0?'编辑校区':'新增校区'"
  >
   
    <div class="around-center hgt60 bge0e3ea" v-show="editEnable">
      <div>
        <el-button @click="isShowPlatformDialog=false">取 消</el-button>
        <el-button type="primary" class="m-l-40" @click="saveplatformInfoData">确 认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  queryPlatform,
  addPlatform,
  updatePlatform,
  setPlatformWorker,
  setNewPlatformWorks,
  getPlatformAboutWorkers,
  getPlatformWorkers,
  setPlatformMaster,
  getWorkersCustomList,
  addWorkersCustom,
  editWorkersCustom
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
    visible: {
      typ: Boolean,
      default: false
    }
    ,
    editEnable: {
      typ: Boolean,
      default: false
    }
  },
  name: "PlatformRowDialog",
  data() {
    return {
      // 校区对应的工作人员
      PlatformWorkers: [],
      // // 校区负责人ID
      // masterID: null,
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
  mounted() {
    console.log("=======",this.editEnable);
    this.getPlatformRowData();
  },
  methods: {
    handleClose(done) {
      console.log("====handleClose===",done);
      this.$emit("update:visible", false);
    },
    change($event) {
      this.$forceUpdate();
    },
    // 获取表单数据
    getPlatformRowData() {
      // 初始化数据
      // this.masterID = null
      // this.platformInfoData = {}
      this.PlatformWorkers = {};
      this.isShowPlatformDialog = true;
      // this.platformInfoData = { ...rowData }
      // this.masterID = this.platformInfoData.MasterID
      if (this.platformInfoData.Id) {
        this.platformWorkers();
      }
    },
    // 保存客户信息
    saveplatformInfoData() {
      this.$refs.refPlatForm.validate(async valid => {
        if (valid) {
          this.platformInfoData.MasterID = this.masterID;
          if (
            this.platformInfoData.Id == null ||
            this.platformInfoData.Id == 0
          ) {
            // 新增
            let res = await  addPlatform(this.platformInfoData);
            if (res.code == 200) {
              // 添加成功之后要触发父组件信息列表修改
              this.$emit("subClickEvent", 1, res.data);
              this.common.go_alert("添加成功 !");
              this.isShowPlatformDialog = false;
            }
          } else {
            // 修改
            let res = await  updatePlatform(
              this.platformInfoData.Id,
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
    },
    // 获取校区的工作人员
    async platformWorkers() {
      // this.PlatformWorkers = [];
      // let res = await $PlatformHttp.getPlatformWorkers(
      //   this.platformInfoData.Id
      // );
      // if (res.code == 200) {
      //   this.PlatformWorkers = res.data;
      // }
    }
  }
};
</script>
