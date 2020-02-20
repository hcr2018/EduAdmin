<template>
  <!-- --------------------客户的跟进记录模块----------------------- -->
  
  <div class="p_both10 p-t-5">
       <myImageViewer   v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
    <div class="border-e5ecf7 radius3">
      <div class="m-b-10 bg-f5f9ff p_both20 p-v-15">
        <span>跟进方式：</span>
        <el-radio v-model="trackMethod" label="邀约上门">邀约上门</el-radio>
        <el-radio v-model="trackMethod" label="电话沟通">电话沟通</el-radio>
        <el-radio v-model="trackMethod" label="QQ咨询">QQ咨询</el-radio>
        <el-radio v-model="trackMethod" label="微信咨询">微信咨询</el-radio>
      </div>
      <div class="bg-fff p_both20 p-v-10">
        <textarea
          v-model="trackContent"
          cols="30"
          placeholder="请输入跟进记录"
          rows="8"
          class="yahei wid_100 default-input input-focus default-textarea"
        />
      </div>
      <div class="between-center p_both20 p-v-5 bg-f5f9ff">
        <el-upload
          ref="trackImageUpload"
          :auto-upload="false"
          action
          class="upload-demo"
          :on-change="uploadTrackImg"
        >
          <i class="el-icon-picture-outline" style="font-size:30px;color:#999;" />
        </el-upload>
        <el-button type="success" @click="submitCustomTrack">提交</el-button>
      </div>
    </div>
    <!-- 跟进记录 -->
    <!--  class="wid80 hgt80" :preview-src-list="[img]" :src="img" fit="cover" /> -->

    <div class="m-v-30">
      <div
        v-for="(item,index) in customTrackList"
        :key="index"
        class="m-v-10 radius3 border-e5ecf7"
      >
        <div class="flex_mid p_both20 m-t-10">
          <!-- <my-image
            v-show="item.ManagerFace"
            class="hgt50 wid50"
            :src="item.ManagerFace"
            fit="cover"
          />-->
          <img
            v-if="item.ManagerFace"
            class="wid20"
            src="/static/img/slice/uploadedIcon.png"
            @click="onPreview(item.ManagerFace)"
          />
          <div class="m-l-15">
            <p class="font14 color-666">
              <span>{{ item.ManagerLabel }}</span>
              <span class="font12 m-l-10 color-666">{{ common.dateFormat(item.Createtime, 2) }}</span>
            </p>
            <p class="m-t-10 font14 color-666">{{ item.track_method }}</p>
          </div>
        </div>
        <p v-if="item.Kind==2" class="m-v-15 font14 color-666 p_both20">
          <audio :src="item.Content" controls="controls">你的浏览器太老，不支持显示录音</audio>
        </p>
        <p v-else class="m-v-15 font14 color-666 p_both20">{{ item.Content }}</p>
        <div v-show="item.ImageList.length>0" class="p_both20">
          <div class="flex_dom flex_wrap">
            <div v-for="(img,index) in item.ImageList" :key="index" class="marg10 flex_mid flex_wrap">
              <!--  class="wid80 hgt80" :preview-src-list="[img]" :src="img" fit="cover" /> -->
              <img
                v-if="img"
                class="wid20"
                src="/static/img/slice/uploadedIcon.png"
                @click="onPreview(img)"
              />
            </div>
          </div>
        </div>
        <div class="p_both20 p-b-20">
          <p
            v-for="(replyItem,replyIndex) in item.Reply"
            :key="replyIndex"
            class="color-666 font14 m-b-10"
          >
            <span class="color-1890ff">{{ replyItem.ManagerLabel }}：</span>
            <span>{{ replyItem.Content }}</span>
          </p>
        </div>
        <div class="bg-f5f9ff p-v-10 p_both20">
          <div class="between-center">
            <textarea
              v-model="item.replyContent"
              cols="30"
              placeholder="评论"
              rows="2"
              class="yahei border-e0 radius3 wid_100 default-input input-focus default-textarea p-v-5 p_both10"
            />
            <el-button type="text" class="m-l-20" @click="submitReplyTrack(item,index)">提交评论</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  GetStudentDataTrackAnalysis,
  getCustomTracks,
  addcustomTracks,
  uploadImgInTracks,
  replyTracks,
  receiveSmsTrack,
  getTrackList,
  getCustomBuyCouseRecord,
  addCustomBuyCourseRecord,
  customAllowDoExercise,
  deleteBuyCourse,
  getCustomInfoList,
  addCustomInfo,
  editCustomInfo,
  resetCustomPassword,
  setCustomAccountStatus,
  checkTelephone,
  setStar,
  batchChangeManager,
  getStudentStatustByStudent
} from "@/api/custom";


import $ImgAPI from "@/api/ImgAPI";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
import common from "@/utils/common";
export default {
  name: "CustomBasicInfo",
  components: {
    myImageViewer
  },
  props: {
    // custom数据
    customData: {}
  },
  data() {
    return {
      common,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // 客户
      customFormData: {},
      // 跟进客户的方式
      trackMethod: "邀约上门",
      //  跟进记录的内容
      trackContent: "",
      // 存上传的跟进图片
      trackImgList: [],
      // 该客户所有的跟进记录
      customTrackList: [],
      // 当前回复跟进数据的索引
      currentReplyIndex: null
    };
  },
  watch: {
    customData(newvar){
      this.customFormData = this.customData;
      this.customTrackList = []; 
      this.getCustomId(this.customData.id);
    }
  },
  mounted() {
    this.customFormData = this.customData;
     this.getCustomId(this.customData.id);
  },

  methods: {
    onPreview(src) {
      this.showViewer = true;
      this.imageViewerSrc = src;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },
    // 获取客户的单条数据
    getCustomId(id) {
      this.customFormData.id = id;
      this.getCustomtTracks();
      // 初始化内容
      this.trackContent = "";
      this.trackMethod = "邀约上门";
      this.currentReplyIndex = null;
    },
    // 上传跟进记录的图片
    async uploadTrackImg(file) {
      const res = await $ImgAPI.UploadImg("track",  file.raw);
      if (res.code == 200) {
        this.$message("上传成功！");
        this.trackImgList.push(res.data);
      }
    },
    // 获取客户的跟进记录
    async getCustomtTracks() {
      const res = await getCustomTracks(this.customFormData.id);
      if (res.code == 200) {
        this.customTrackList = res.data ? res.data : [];
        this.customTrackList.forEach(item => {
          if (item.Reply) {
            item.Reply = JSON.parse(item.Reply);
          }
        });
      }
    },
    // 提交客户的跟进信息
    async submitCustomTrack() {
      if (this.trackContent.length < 3) {
        this.$message("跟进记录不得少于3个字符");
        return;
      }
      const trackRow = {};
      trackRow.student_id = this.customFormData.id;
      trackRow.track_method = this.trackMethod;
      trackRow.content = this.trackContent;
      trackRow.filelist = this.trackImgList.toString();
      trackRow.kind = 1;
      const res = await addcustomTracks("", "", trackRow);
      if (res.code == 200 && res.data) {
        this.customTrackList ? this.customTrackList : [];
        this.customTrackList.unshift(res.data);
        this.trackMethod = "邀约上门";
        this.trackContent = "";
        this.trackImgList = [];
        this.$message({
          message: "提交成功",
          type: "success",
          duration: 1500
        });

        this.$refs["trackImageUpload"].clearFiles();
        this.$emit("subClickEvent", res.title);
      }
    },
    // 提交回复评论
    async submitReplyTrack(track, index) {
      const oldtrack = { ...track };
      if (!track.replyContent) {
        this.$message("还没有输入内容哦 ！");
      } else {
        this.currentReplyIndex = index;
        const res = await replyTracks(track.Id, track.replyContent);
        if (res.code == 200) {
          this.$message("评论成功 ！");
          if (res.data) {
            oldtrack.Reply = res.data;
            oldtrack.replyContent = "";
            this.customTrackList.splice(this.currentReplyIndex, 1, oldtrack);
          }
        }
      }
    }
  }
};
</script>
<style scoped>
</style>
