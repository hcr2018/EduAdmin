<template>
  <!-- 封装右侧弹出框 -->
  <div>
    <el-drawer
      title="thisTitle"
      :visible.sync="visible"
      direction="rtl"
      :before-close="handleClose"
    >
      <div ref="msk" class="body_div flex_column" :style="style">
        <p class="dialog_header">{{ thisTitle }}</p>
        <div v-if="closeLeft" class="left_content" :class="{'no_title':!thisTitle}">
          <div class="is-scroll-left hgt_100 left_body_div">
            <slot name="left_content">展示基本信息区域</slot>
          </div>
        </div>
        <div class="right_content" :class="{'no_title':!thisTitle,'no_left':!closeLeft}">
          <div class="is-scroll-left hgt_100 right_body_div">
            <slot name="right_content">default left_content</slot>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
  <!-- <div class="mask" v-show="visible">
    <div class="flex-end" style="height:100%">
      <div @click="close" v-if="closeShow">
        <i class="el-icon-close closePopupIcon"></i>
      </div>
      <div class="body_div flex_column" :style="style" ref="msk">
        <p class="dialog_header" v-show="title">{{title}}</p>
        <div class="left_content" v-if="closeLeft" :class="{'no_title':!title}">
          <div class="is-scroll-left hgt_100 left_body_div">
            <slot name="left_content">展示基本信息区域</slot>
          </div>
        </div>
        <div class="right_content" :class="{'no_title':!title,'no_left':!closeLeft}">
          <div class="is-scroll-left hgt_100 right_body_div">
            <slot name="right_content">default left_content</slot>
          </div>
        </div>
      </div>
    </div>
  </div>-->
</template>
<script>
export default {
  props: {
    // 是否显示模态框
    visible: {
      type: Boolean,
      default: false
    },
    closeShow: {
      type: Boolean,
      default: true
    },
    closeLeft: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: "70%"
    },
    thisTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    style() {
      const style = {};
      if (this.width) {
        style.width = this.width;
      }
      return style;
    }
  },
  mounted() {},
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.drawer = false;
        })
        .catch(_ => {});
    }
    // close() {
    //   this.$emit("update:visible", false);
    // }
    // 点击遮罩关闭弹窗
    //       ClickMaskclose(ev){
    //         if (!this.$refs.msk.contains(ev.target)) {
    // 　　　　　　  this.$emit('update:visible', false)
    // 　　　　}
    //       }
  }
};
</script>
<style scoped>
.p-t-20 {
  padding-top: 20px;
}
.mask {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0px;
  background: rgba(0, 0, 0, 0.4);
}

.body_div {
  position: relative;
  width: 70%;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.flex-end {
  display: flex;
  display: -webkit-flex;
  align-items: flex-start;
  -webkit-align-items: flex-start;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
}

.closePopupIcon {
  display: block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #303133;
  background: #e0e3ea;
  font-size: 18px;
  margin-right: 1px;
}
.closePopupIcon:hover {
  color: #2e77f8;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.dialog_header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #e0e3ea;
  color: #303133;
  padding: 0 30px;
  line-height: 60px;
}

.left_content {
  position: absolute;
  width: 300px;
  top: 70px;
  left: 10px;
  bottom: 10px;
  border: 5px solid #e0e3ea;
  border-right: none;
  color: #303133;
  font-size: 14px;
}
.right_content {
  position: absolute;
  top: 70px;
  left: 315px;
  right: 10px;
  bottom: 10px;
  border: 5px solid #e0e3ea;
  color: #303133;
  font-size: 14px;
}
.no_title {
  top: 10px !important;
}
.no_left {
  left: 10px !important;
}
.left_body_div {
  overflow-y: scroll;
  width: 100%;
}
.right_body_div {
  width: 100%;
  overflow-y: scroll;
}
</style>
