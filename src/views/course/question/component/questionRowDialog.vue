<template>
  <div class="pad20" v-cloak>
    <el-form
      :model="currentItemData"
      label-width="80px"
      ref="refQuestionForm"
      :rules="questionFormRules"
    >
      <div class="between-center">
        <el-form-item label="章" class="flex_1" prop="ZhangId">
          <el-input v-model.number="currentItemData.ZhangId" :disabled="currentItemData.Id>0"></el-input>
        </el-form-item>
        <el-form-item label="节" class="flex_1" prop="JieId">
          <el-input v-model.number="currentItemData.JieId" :disabled="currentItemData.Id>0"></el-input>
        </el-form-item>
        <el-form-item label="知识点" class="flex_1" prop="TopicId">
          <el-input v-model.number="currentItemData.TopicId" :disabled="currentItemData.Id>0"></el-input>
        </el-form-item>
      </div>
      <div class="between-center">
        <el-form-item label="题型" class="flex_1">
          <el-select
            v-model="currentItemData.QuestionType"
            :disabled="currentItemData.Id>0"
            placeholder="请选择题型"
          >
            <el-option
              :label="item.Label"
              :key="index"
              :value="item.ID"
              v-for="(item,index) in common.AllQuestionTypes"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分值" prop="QuestionScore" class="flex_1">
          <el-input v-model.number="currentItemData.QuestionScore"></el-input>
        </el-form-item>
        <el-form-item class="flex_1 center">
          <el-radio v-model="currentItemData.State" :label="1">上架</el-radio>
          <el-radio v-model="currentItemData.State" :label="0">下架</el-radio>
        </el-form-item>
      </div>
      <el-form-item label="题干" prop="QuestionContent">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="currentItemData.QuestionContent"
        ></el-input>
      </el-form-item>
      <el-form-item label="解析" prop="QuestionAnalyse">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入解析内容"
          v-model="currentItemData.QuestionAnalyse"
        ></el-input>
      </el-form-item>
      <!-- 单选题,判断题 -->
      <el-form-item label="选项">
        <div v-show="currentItemData.QuestionType==1||currentItemData.QuestionType==3">
          <div class="center flex_wrap" style="width:100%">
            <div
              :key="index"
              v-for="(option,index) in quesAnswerOptions"
              class="center m-l-20 m-v-5 optionAnswer"
            >
              <el-radio
                v-model="currentItemData.QuestionAnswer"
                :label="option.tag"
                :value="option.tag"
              ></el-radio>
              <el-input type="textarea" :rows="2" placeholder="请输入选项内容" v-model="option.content"></el-input>
            </div>
          </div>
        </div>
        <!-- 多选题-编辑-->
        <div v-show="currentItemData.QuestionType==2">
          <div class="flex_dom flex_wrap">
            <div
              :key="index"
              v-for="(option,index) in quesAnswerOptions"
              class="center m-l-20 m-v-5 optionAnswer"
            >
              <el-checkbox v-model="quesCheckboxAnswer" :label="option.tag">{{option.tag}}</el-checkbox>
              <el-input type="textarea" :rows="2" placeholder="请输入选项内容" v-model="option.content"></el-input>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="选项操作">
        <!-- 添加选项 -->
        <div class="center flex_dom">
          <el-button @click="addQuestionOption">添加选项</el-button>
          <el-button @click="deleteQuestionOption">删除最后项</el-button> 
        </div>
  </el-form-item>
      <el-form-item label="附加图片">

        <div class="center flex_dom">
            <el-upload
            :auto-upload="false"
            action
            class="m-l-10"
            v-loading="isbusy"
            :show-file-list="false"
            :on-change="function(file, fileList){return ImgUploadQuestion(file, fileList)}"
          >
            <el-button>上传图片</el-button>
          </el-upload> 
            <el-tooltip class="item cursor" effect="dark" content="点击文本复制" placement="top">
              <span class="tag-read" :data-clipboard-text="ImgAddr" @click="copyText">{{ImgAddr}}</span>
            </el-tooltip>
          </div>
      </el-form-item>
      <div class="between-center">
        <el-form-item label="答题次数" class="flex_1">
          <el-input v-model.number="currentItemData.AnswerNum"></el-input>
        </el-form-item>
        <el-form-item label="答错次数" class="flex_1">
          <el-input v-model.number="currentItemData.WrongNum"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="m-v-15 text-right">
      <el-button @click="questionFormDialog = false">取 消</el-button>
      <el-button type="primary" @click="saveQuestion">确 认</el-button>
    </div>
  </div>
</template>

<script>
import $ImgHttp from "@/api/ImgAPI";
import { editQuestion, addQuestion } from "@/api/question";
import common from "@/utils/common";
export default {
  props: {
    // 表单数据
    formItemData: {
      type: Object,
      default: function() {
        return { Id: 0 };
      }
    }
  },
  data() {
    return {
      common,
      // 上传图片加载中的状态
      isbusy: false,
      // 图片地址
      ImgAddr: "",
      // 选项字母
      words: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
      // 题型信息
      currentItemData: {},
      // 多选题答案
      quesCheckboxAnswer: [],
      // 存放题的选项
      quesAnswerOptions: [
        {
          tag: "A",
          content: ""
        }
      ],
      // 表单验证
      questionFormRules: {
        ZhangId: [{ required: true, message: "请填写章编号", trigger: "blur" }],
        JieId: [{ required: true, message: "请填写节编号", trigger: "blur" }],
        TopicId: [{ required: true, message: "请填写知识点", trigger: "blur" }],
        QuestionScore: [
          { required: true, message: "请填写题的分值", trigger: "blur" }
        ],
        QuestionContent: [
          { required: true, message: "请填写题干内容", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    formItemData(newval) {
      this.currentItemData = this.formItemData;
      this.getQuestionRow();
    }
  },
  mounted() {
    this.currentItemData = this.formItemData;
    this.getQuestionRow();
  },
  methods: {
    // 从父组件获取的值
    getQuestionRow() { 
      // 初始化值
      this.isbusy = false;
      this.ImgAddr = "";
      this.quesCheckboxAnswer = [];
      // this.currentItemData = { ...row };
      // this.currentItemData.Options = [];
      if (this.currentItemData.Id > 0) {
        if (this.currentItemData.QuestionType == 2) {
          this.quesCheckboxAnswer = this.currentItemData.QuestionAnswer.split(
            ""
          );
        }
        // 遍历选项
        let Options = [];
        this.words.forEach(word => {
          for (let keyName in this.currentItemData) {
            if (keyName == word && this.currentItemData[keyName].length > 0) {
              Options.push({
                content: this.currentItemData[keyName],
                tag: keyName
              });
            }
          }
        });
        this.quesAnswerOptions = Options;
      } else {
        this.quesCheckboxAnswer = ["A"];
        this.quesAnswerOptions = [
          {
            tag: "A",
            content: ""
          }
        ];
      }
    },
    // 复制文本
    copyText() {
      let clipboard = new this.clipboard(".tag-read");
      clipboard.on("success", e => {
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        clipboard.destroy();
      });
    },
    // 题库上传图片
    async ImgUploadQuestion(file, fileList) {
      this.isbusy = true;
       let res = await $ImgHttp.UploadImg("exercise", file.raw);
      // let res = await $ImgHttp.UploadImgExercise(
      //   this.currentItemData.BookId,
      //   file.raw
      // );
      if (res.code == 200) {
        this.$message("上传成功");
        this.ImgAddr = `<img src="${res.data}" />`;
        this.isbusy = false;
      }
    },
    // 修改数据
    saveQuestion() {
      this.$refs.refQuestionForm.validate(async valid => {
        if (valid) { 
          if (!this.currentItemData.Options){
            this.currentItemData.Options = [];
          } 
          // 处理选项
          this.quesAnswerOptions.forEach(item => {
            if (item.content) {
              this.currentItemData.Options.push(item.content);
            }
          }); 
          // 处理多选题答案
          if (this.currentItemData.QuestionType == 2) {
            this.currentItemData.QuestionAnswer = this.quesCheckboxAnswer.join(
              ""
            );
          } 
          // 修改数据
          if (this.currentItemData.Id > 0) {
            let res = await editQuestion(
              this.currentItemData.Id,"",
              this.currentItemData
            );
            if (res.code == 200) {
              this.$message("修改成功 !");
              this.$emit("subClickEvent", 1, res.data);
            }
          } else if (!this.currentItemData.Id||this.currentItemData.Id == 0) {
     
            let res = await addQuestion("","",this.currentItemData);
            if (res.code == 200) {
              this.$emit("subClickEvent", 0, res.data);
              this.$message("添加成功 !");
            }
          }
        } else {
          console.log("没通过")
          return false;
        }
      });
    },
    // 添加选项
    addQuestionOption() {
      let addTag = 65 + this.quesAnswerOptions.length;
      if (addTag < 74) {
        let tagName = String.fromCharCode(addTag);
        this.quesAnswerOptions.push({ tag: tagName, content: "" });
      }
    },
    // 删除选项
    deleteQuestionOption() {
      if (this.quesAnswerOptions.length > 0) {
        let obj = this.quesAnswerOptions[this.quesAnswerOptions.length - 1];
        if (this.currentItemData.QuestionType == 2) {
          let index = this.quesCheckboxAnswer.indexOf(obj.tag);
          if (index != -1) {
            this.quesCheckboxAnswer.splice(index, 1);
          }
        } else {
          if (this.currentItemData.QuestionAnswer == obj.tag) {
            this.currentItemData.QuestionAnswer = "";
          }
        }
        this.quesAnswerOptions.pop();
      }
    }
  }
};
</script>
<style scope>
.optionAnswer >>> .el-checkbox:last-of-type {
  margin-right: 5px;
}
.optionAnswer >>> .el-radio {
  margin-right: 5px;
}
</style>

