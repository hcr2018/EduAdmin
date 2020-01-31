
<template>
  <div v-cloak class="font16 hgt_full">
    <div class="flex_column hgt_full">
      <div class="between-center m-b-15">
        <div>
          <span class="m-b-10">当前科目名称：{{ subjectLabel }}</span>
        </div>
      </div>
      <div class="flex_1">
        <vxe-table
          ref="chapterTreeTable"
          border
          row-id="Id"
          show-overflow
          :tree-config="treeConfig"
          :data.sync="chaperListOfBook"
          height="100%"
          :edit-config="{trigger: 'dblclick', mode: 'row',showIcon:true}"
        >
          <vxe-table-column type="index" width="120" title="序号" tree-node />
          <vxe-table-column field="Label" title="名称" :edit-render="{name: 'input'}" />
          <vxe-table-column field="Video" title="视频地址" :edit-render="{name: 'input'}" />
          <vxe-table-column field="TopicNo" :edit-render="{name: 'input'}" title="视频编号" width="130" />
          <vxe-table-column field="Description" title="描述" :edit-render="{name: 'input'}" />
          <vxe-table-column field="Taste" title="允许试读" width="80">
            <template v-slot="{ row}">
              <select v-model="row.Taste" class="quanke">
                <option :value="0">否</option>
                <option :value="1">是</option>
              </select>
            </template>
          </vxe-table-column>
          <vxe-table-column title="操作">
            <template v-slot="{ row }">
              <el-button
                v-show="row.Zhang==1&&(row.Video==''||row.Video==null)"
                type="primary"
                @click="addChildNode(row,true)"
              >添加节</el-button>
              <el-button
                v-show="row.Jie==1&&(row.Video==''||row.Video==null)"
                type="success"
                @click="addChildNode(row,false)"
              >添加视频</el-button>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <div class="between-center m-v-15">
        <el-button type="primary" class="m-r-10" @click="addChapter">新增章</el-button>
        <!-- <el-button type="danger" @click="deleteSelectItems">批量删除</el-button> -->
        <el-button class="m-r-20" type="success" @click="createSubjectChapter">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import $BookHttp from "@/service/BookAPI";
export default {
  name: "AddChapter",
  data() {
    return {
      // 书名称
      subjectLabel: "",
      // 书的Id
      subjectId: null,
      // 书的章节列表
      chaperListOfBook: [],
      //  列表的children数据
      treeConfig: {
        children: "Children"
      }
    };
  },
  mounted() {
    this.subjectId = this.$route.query.Id;
    this.subjectLabel = this.$route.query.Label;
    this.getBookChapter();
  },
  methods: {
    // 编辑章节
    editChapter(row) {
      this.$refs.chapterTreeTable.setActiveRow(row);
    },
    // 新增子级节点
    addChildNode(row, isZhang) {
      const that = this;
      const chapterTreeTable = that.$refs.chapterTreeTable;
      let labelStr = "";
      if (isZhang == true) {
        labelStr = "新的节";
      } else {
        labelStr = "新的视频";
      }
      chapterTreeTable
        .createRow({
          Label: labelStr,
          Id: new Date().getTime(),
          Children: [],
          Taste: 0,
          Video: "",
          TopicNo: "",
          Zhang: 0,
          Jie: 0
        })
        .then(newRow => {
          const rowNode = XEUtils.findTree(
            that.chaperListOfBook,
            item => item.Id === row.Id,
            that.treeConfig
          );
          if (rowNode) {
            rowNode.items.forEach((item, index) => {
              if (isZhang == true) {
                // 如果是章，那么设置为节
                newRow.Jie = 1;
              } else {
                newRow.Jie = 0;
              }
              if (item.Id == row.Id) {
                rowNode.items[index].Children.push(newRow);
                chapterTreeTable
                  .refreshData()
                  .then(() => chapterTreeTable.setActiveRow(newRow));
              }
            });
          }
        });
    },
    // 保存编辑
    saveChapter(row) {
      const that = this;
      row.TBookID = that.subjectId;
      row.Taste = parseInt(row.Taste);
      row.TBookID = parseInt(row.TBookID);
      row.Jie = parseInt(row.Jie);
      row.Zhang = parseInt(row.Zhang);
      that
        .$confirm("确认修改吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async() => {
          if (row.Id > 0) {
            // ID大于零代表修改，否则就是新增
            const res = await $BookHttp.editBookVideo(row.Id, row);
            if (res.code == 200) {
              that.cancelRowEvent();
              that.common.go_alert("修改成功 !");
            }
          } else {
            const res = await $BookHttp.addBookVideo(row);
            if (res.code == 200) {
              that.cancelRowEvent();
              that.common.go_alert("添加成功 !");
              that.getBookChapter();
            }
          }
        })
        .catch(() => {});
    },
    // 取消编辑
    cancelEditChapter(row, index) {
      this.$refs.chapterTreeTable.clearActived();
      this.$refs.chapterTreeTable.revert(row);
      if (row.Id <= 0) {
        this.$refs.chapterTreeTable.remove(row);
      }
    },
    // 新增章
    addChapter() {
      const newItem = {
        Id: new Date().getTime(),
        Label: "新的章",
        Children: [],
        Taste: 0,
        Video: "",
        TopicNo: "",
        Zhang: 1,
        Jie: 0
      };
      this.chaperListOfBook.push(newItem);
    },
    // 批量删除
    deleteSelectItems() {
      const that = this;
      const selectChapterItems = that.$refs.chapterTreeTable.getSelectRecords();
      const ids = [];
      for (const chapterItem of selectChapterItems) {
        ids.push(chapterItem.Id);
      }
      that
        .$confirm("确认删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async() => {
          const res = await $BookHttp.deleBookVideo({
            idlist: ids.toString()
          });
          if (res.code == 200) {
            that.getBookChapter();
            that.common.go_alert("删除成功 !");
          }
        })
        .catch(() => {});
    },
    // 获取章节列表
    async getBookChapter() {
      const res = await $BookHttp.getBookVideo(this.subjectId, {
        limit: 100000,
        offset: 0
      });
      if (res.code == 200 && res.data.Content) {
        this.chaperListOfBook = JSON.parse(res.data.Content);
      }
    },
    // 生成科目章节
    createSubjectChapter: function() {
      const that = this;
      that
        .$confirm("确认保存吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async() => {
          if (that.chaperListOfBook.length > 0) {
            const res = await $BookHttp.createBookStructure(
              that.subjectId,
              that.chaperListOfBook
            );
            if (res.data == 200) {
              that.common.go_alert("保存成功 !");
            }
          }
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
.el-icon-success {
  color: #2e77f8;
  font-size: 24px;
}
.el-icon-error {
  color: #909399;
  font-size: 24px;
}
.quanke {
  width: 40px;
  padding-left: 2px;
  height: 23px;
  border: 1px solid #606266;
  border-radius: 3px;
  color: #606266;
}
</style>
