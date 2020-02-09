<template>
  <!-- 封装右侧弹出框 -->
  <div>
    <el-drawer
      :wrapperClosable="false"
      :title="thisTitle"
      :visible.sync="visible"
      direction="rtl"
      class="myDrawer"
      :before-close="handleClose"
      size="70%"
    >
    
      <div class="flex_dom drawer_body">
        <div v-if="showLeft" class="left_content">
          <div class="is-scroll-left hgt_100 left_body_div">         
            <slot name="left_content">展示基本信息区域</slot>
          </div>
        </div>
        <div class="right_content" :class="{'no_left':!showLeft}">
          <div class="is-scroll-left hgt_100 right_body_div">
            <slot name="right_content">default left_content</slot>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
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
    showLeft: {
      type: Boolean,
      default: true
    },
    thisTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showDialog: false
    };
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
      this.$emit("update:visible", false);
    }
  }
};
</script>
<style scoped>
.drawer_body {
  overflow: hidden;
  height: 100%;
  width: 100%;
  color: #303133;
  font-size: 14px;
}
.left_content {
  overflow: hidden;
  width: 300px;
  height: 100%;
  margin-left: 10px;
  border: 5px solid #e0e3ea;
  border-right: none;
}
.right_content {
  overflow: hidden;
  width: calc(100% - 320px);
  height: 100%;
  margin-right: 10px;
  border: 5px solid #e0e3ea;
}

.no_left {
  width: calc(100% - 20px);
  margin-left: 10px;
}
.left_body_div {
  overflow-y: scroll;
  width: 100%;
}
.right_body_div {
  width: 100%;
  overflow-y: scroll;
}
.myDrawer /deep/ .el-drawer__header {
  padding: 20px;
  background: #1890ff;
  margin-bottom: 15px;
  color:#ffffff;
}
.myDrawer /deep/ .el-dialog__close {
 color: #ffffff;
}
</style>
