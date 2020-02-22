<template>
  <div v-cloak class="font16 hgt_full">
          <myImageViewer v-if="showViewer" :on-close="closeViewer" :url-list="[imageViewerSrc]" />
    <div class="flex_column hgt_full">
      <div class="flex_1 overflow_hide border-e0 m-t-20">
        <div class="hgt_100 overflow_auto">
          <div class="p_both20 p-v-10">
            <div v-for="(item,index) in logList" :key="index" class="m-v-10 radius3 border-e5ecf7">
              <div class="flex_mid p_both20 m-t-10">
                <div class="m-l-15">
                  <p class="font14 color-666">
                    <span class="color-1890ff">客户：{{ item.StudentLabel }}</span>
                    <span class="font12 color-1890ff">{{ item.StudentTel }}</span>
                  </p>
                  <p class="m-t-10 font14 color-666">
                    <span>{{ item.ManagerLabel }}：{{ item.track_method }}</span>
                    <span
                      class="font12 m-l-10 color-666"
                    >{{ common.dateFormat(item.Createtime, 2) }}</span>
                  </p>
                </div>
              </div>
              <p v-if="item.Kind==2" class="m-v-15 font14 color-666 p_both20">
                <audio :src="item.Content" controls="controls">你的浏览器太老，不支持显示录音</audio>
              </p>
              <p v-else class="m-v-15 font14 color-666 p_both20">{{ item.Content }}</p>
              <div v-show="item.ImageList.length>0" class="p_both20">
                <div class="flex_dom flex_wrap">
                  <div
                    v-for="(img,index) in item.ImageList"
                    :key="index"
                    class="marg10 flex_mid flex_wrap"
                  >
                    <img
                      v-if="img"
                      class="wid20"
                      src="/assets/slice/uploadedIcon.png"
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
            </div>
          </div>
        </div>
      </div>
      <div class="between-center m-v-15">
        <div>
          <el-pagination
            background
            :current-page.sync="nowPage"
            :page-size="rows"
            layout="total,prev, pager, next, jumper"
            :total="allRows"
            @current-change=" getChangePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getManagerLogs } from "@/api/manager";
import common from "@/utils/common";
import myImageViewer from "@/components/myImageViewer/myImageViewer";
export default {
  name: "CustomBasicInfo",
  components: {
    myImageViewer
  },
  data() {
    return {
      common,
      // 预览图片的图片地址
      imageViewerSrc: "",
      // 显示图片查看器
      showViewer: false,
      // 数据总条数  
      allRows: 0,
      // 当前页数
      nowPage: 1,
      // 每页获取数据的总条数
      rows: 10,
      // 存上传的跟进图片
      trackImgList: [],
      //日志数组
      logList: [],
      // 当前回复跟进数据的索引
      currentReplyIndex: null
    };
  },
  mounted() {},

  methods: {
    // 图片预览
    onPreview(src) {
      this.showViewer = true;
      this.imageViewerSrc = src;
    },
    // 获取客户的跟进记录
    getLogs() {
      const offsetRow = (this.nowPage - 1) * this.rows;
      getManagerLogs(0, {
        limit: this.rows,
        offset: offsetRow
      })
        .then(res => {
          this.allRows = res.title;
          this.logList = res.data ? res.data : [];
          this.logList.forEach(item => {
            if (item.Reply) {
              item.Reply = JSON.parse(item.Reply);
            }
          });
        })
        .catch(err => {});
    },
    // 分页获取数据
    getChangePage(val) {
      this.nowPage = val;
      this.getLogs();
    }
  }
};
</script>
<style scoped>
</style>
