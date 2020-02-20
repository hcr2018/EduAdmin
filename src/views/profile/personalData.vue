<template>
  <section class="main hgt_full flex_column font16" v-cloak>
    <div class="flex_1 overflow_auto bg-f7">
      {{common.userInfo}}
      <div class="pad10 column-center-b">
        <div class="wid_100">
          <el-tabs type="border-card" v-model="activeTabs">
            <el-tab-pane label="个人资料" name="showInfoPage">
              <div class="m-t-40 m-b-30">
                <div v-show="showMineInfo">
                  <div class="flex_dom">
                    <div class="wid200">
                      <img :src="mineData.face" alt class="wid200" />
                    </div>
                    <div class="wid_50">
                      <el-form
                        :model="mineData"
                        label-width="100px"
                        size="small"
                        class="demo-ruleForm"
                      >
                        <el-form-item label="昵称:">
                          <span>{{mineData.Username}}</span>
                        </el-form-item>
                        <el-form-item label="姓名:">
                          <span>{{mineData.Realname}}</span>
                        </el-form-item>
                        <el-form-item label="英文名:">
                          <span>{{mineData.EnRealname}}</span>
                        </el-form-item>
                        <el-form-item label="电话号码:">
                          <span>{{mineData.tel}}</span>
                        </el-form-item>
                        <el-form-item label="性别:">
                          <span>{{mineData.Sex}}</span>
                        </el-form-item>
                        <el-form-item label="个人信息:">
                          <span>{{mineData.info}}</span>
                        </el-form-item>
                      </el-form>
                      <div class="center-end m-t-30">
                        <el-button type="primary" @click="editMineData">编辑</el-button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="!showMineInfo">
                  <div class="flex_dom">
                    <div class="wid200 text-center">
                      <img :src="mineData.face" alt class="wid200" />
                      <el-upload
                        :multiple="false"
                        v-loading="isbusy"
                        class="upload-demo"
                        :on-change="imgUpload"
                        :show-file-list="false"
                        :headers="headers"
                        :auto-upload="false"
                        action
                      >
                        <el-button>上传</el-button>
                      </el-upload>
                    </div>
                    <div class="wid_50">
                      <el-form :model="mineData" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="昵称">
                          <el-input v-model="mineData.Username" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                          <el-input v-model="mineData.Realname" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="英文名">
                          <el-input v-model="mineData.EnRealname" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="电话号码">
                          <el-input v-model="mineData.tel" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                          <el-radio v-model="mineData.Sex" label="男">男</el-radio>
                          <el-radio v-model="mineData.Sex" label="女">女</el-radio>
                        </el-form-item>
                        <el-form-item label="个人信息">
                          <el-input type="textarea" :rows="3" v-model="mineData.info"></el-input>
                        </el-form-item>
                        <div class="center-end m-t-30">
                          <el-button @click="cancelEdit">取消</el-button>
                          <el-button type="primary" @click="saveEdit">保存</el-button>
                        </div>
                      </el-form>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="editPawPage">
              <div class="m-t-40 m-b-30 around-center">
                <div class="wid_50">
                  <el-form label-width="100px" class="demo-ruleForm" @submit.prevent="editPassword">
                    <el-form-item label="旧密码">
                      <el-input
                        v-model="oldPsw"
                        type="password"
                        autocomplete="off"
                        placeholder="请输入旧密码"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                      <el-input
                        v-model="newPsw"
                        autocomplete="off"
                        type="password"
                        placeholder="请输入新密码"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码">
                      <el-input
                        v-model="newPsw1"
                        autocomplete="off"
                        type="password"
                        placeholder="请再次输入新密码"
                        @keyup.enter="editPassword"
                      ></el-input>
                    </el-form-item>
                    <div class="center-end m-t-30">
                      <el-button @click="cancelEdit">取消</el-button>
                      <el-button type="primary" @click="editPassword">保存</el-button>
                    </div>
                  </el-form>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import fileAxios from "axios";
import crypto from "crypto";
import $ from "jquery";
import common from "@/utils/common";
import $ImgAPI from "@/api/ImgAPI";
import { updateMyInfo, getInfo, uploadFace } from "@/api/manager";
export default {
  name: "",
  data() {
    return {
      common,
      headers: {
        "Content-Type": "multipart/form-data;",
        token: sessionStorage.token
      },
      // 修改密码
      oldPsw: "",
      newPsw: "",
      newPsw1: "",
      activeTabs: "showInfoPage",
      mineData: {
        Username: "",
        Realname: "",
        EnRealname: "",
        Sex: "",
        face: "",
        info: "",
        tel: ""
      },
      showMineInfo: true,
      isbusy: false
    };
  },
  methods: {
    async getPersonalInfo() {
      let res = await getInfo("", "", "");
      this.mineData = res.data;
    },
    editMineData: function() {
      this.showMineInfo = !this.showMineInfo;
    },
    cancelEdit: function() {
      this.showMineInfo = !this.showMineInfo;
    },
    async saveEdit() {
      let res = await updateMyInfo("", "", this.mineData);

      this.$message("修改成功！");
      this.showMineInfo = !this.showMineInfo;
      this.mineData = res.data;
      this.common.storageObj(res.data);
    },
    // 图片上传
    async imgUpload(file) {
      this.isbusy = true;

      let res = await $ImgAPI.UploadImg("manager", file.raw);

      this.mineData.face = res.data;
      this.isbusy = false;
    },
    async editPassword() {
      let that = this;
      if (!that.oldPsw || !that.newPsw || !that.newPsw1) {
        this.$message("密码不能为空 ！");
        return false;
      }

      if (that.newPsw != that.newPsw1) {
        this.$message("两次密码不一致 ！");
        return false;
      }
      if (that.newPsw.length > 12 || that.newPsw.length < 6) {
        this.$message("请输入6-12位的密码 !");
        return false;
      }
      // 加密
      let md5 = crypto.createHash("md5");
      md5.update(that.oldPsw);
      let oldPsw1 = md5.digest("hex");
      let nmd5 = crypto.createHash("md5");
      nmd5.update(that.newPsw);
      let newPsw1 = nmd5.digest("hex");
      var formData = new FormData();
      formData.append("oldpswd", oldPsw1);
      formData.append("newpswd", newPsw1);
      let res = await updatePSWD("", formData);
      this.$message("修改成功 ！");
    }
  },
  mounted() {
    // 调用
    this.getPersonalInfo();
    if (this.$route.params.tab) {
      this.activeTabs = this.$route.params.tab;
    }
  }
};
</script>
<style scoped>
</style>