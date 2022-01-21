<template>
  <div id="add-apply">
    <des-head @handleClick="handleClick($event)">借阅申请表</des-head>
    <div class="slots"></div>
    <div class="main">
      <div>
        <div class="item">
          <p>部门</p>
          <p>{{ readData.departmentName }}</p>
        </div>
        <div class="item">
          <p>申请人</p>
          <p>{{ readData.username }}</p>
        </div>
      </div>
      <div>
        <div class="item1">
          <p>申请原因</p>
          <textarea
            maxlength="200"
            v-model="addData.applyReason"
            :class="{ errorClass: reasonErr }"
            :placeholder="applyReason"
          ></textarea>
        </div>
        <div class="item1">
          <p>申请内容</p>
          <textarea
            maxlength="200"
            :placeholder="applyContent"
            v-model="addData.applyContent"
            :class="{ errorClass: contentErr }"
          ></textarea>
        </div>
      </div>
      <div class="btn">
        <div @click="submit(0)">暂存</div>
        <div @click="submit(1)">提交</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DesHead from "@/components/des-com/index/des-head.vue";
import MsgBox from "@/components/public-com/MsgBox/Msg";

interface write {
  applyContent: string;
  applyReason: string;
  status: number;
  [key: string]: string | number;
}
interface read {
  username: string;
  departmentName: string;
  [key: string]: string;
}
@Component({
  components: {
    DesHead,
  },
})
export default class AddApply extends Vue {
  private contentErr: boolean = false;
  private reasonErr: boolean = false;
  private applyContent: string = "（内容200字以内）";
  private applyReason: string = "（内容200字以内）";
  private readData: read = {
    username: "",
    departmentName: "",
    applyContent: "",
    applyReason: "",
  };
  private addData: write = {
    applyContent: "",
    applyReason: "",
    status: 0,
  };
  created() {
    this.initData();
  }
  initData() {
    this.readData.username = localStorage.getItem("username") || "";
    (this as any).$request
      .get("/api/api/department/getDepartmentTree", {
        id: localStorage.getItem("departmentId"),
      })
      .then((res: any) => {
        this.readData.departmentName = res.data.data.departmentName;
      });

    if (this.$route.params && this.$route.params.type === "编辑") {
      (this as any).$request
        .get("/api/api/use/getUseApplyDetail", {
          id: this.$route.params.id,
        })
        .then((res: any) => {
          this.addData.applyContent = res.data.data.applyContent;
          this.addData.applyReason = res.data.data.applyReason;
        });
    }
  }
  handleClick(event: any) {
    let obj = {};
    if (event.clickType === "left") {
      if(this.$route.query.type && this.$route.query.type == "add") {
        this.$router.go(-1)
        // this.$store.commit("setDetailPage")
        return
      }
      this.$router.push({
        name: 'editApply',
        query: {id: this.$route.params.iditem,indexId: this.$route.params.idIndex}
      })
      
    }
  }
  submit(num: number) {
    if (!this.addData.applyReason || !this.addData.applyContent) {
      !this.addData.applyReason
        ? (this.applyReason = "请输入申请原因！")
        : this.applyReason;
      !this.addData.applyReason ? (this.reasonErr = true) : this.applyReason;
      !this.addData.applyContent
        ? (this.applyContent = "请输入申请内容！")
        : this.applyReason;
      !this.addData.applyContent ? (this.contentErr = true) : this.applyReason;
      MsgBox.error("请完善内容!")
    } else {
      this.reasonErr = this.contentErr = false;
      if (this.$route.params && this.$route.params.type === "编辑") {
        let dothing = new Map([
          [
            0,
            () => {
              (this as any).$request
                .post("/api/api/use/updateUseApply", {
                  id: this.$route.params.id,
                  departmentId: localStorage.getItem("departmentId"),
                  ...this.addData,
                })
                .then((res: any) => {
                  if (res.data.success === true) {
                    this.$router.push({ name: "apply" });
                    MsgBox.success("暂存成功");
                    return;
                  }
                  throw new Error();
                })
                .catch((err: any) => {
                  MsgBox.error("暂存失败");
                });
            },
          ],
          [
            1,
            () => {
              (this as any).$request
                .post("/api/api/use/updateUseApply", {
                  id: this.$route.params.id,
                  departmentId: localStorage.getItem("departmentId"),
                  ...this.addData,
                })
                .then(() => {
                  (this as any).$request.get("/api/api/use/submitUseApply", {
                    id: this.$route.params.id,
                  });
                })
                .then((res: any) => {
                  // if (res.data.success === true) {
                    console.log(res);
                    
                    this.$router.push({ name: "apply" });
                    MsgBox.success("提交成功");
                    return;
                  // }
                  throw new Error();
                })
                .catch((err: any) => {
                  console.log(err);
                  
                  MsgBox.error("提交失败");
                });
            },
          ],
        ]);
        let action: any = dothing.get(num);
        action.call(this);
      } else {
        this.addData.status = num;
        (this as any).$request
          .post("/api/api/use/useApply", this.addData)
          .then((res: any) => {
            if (res.data.success === true) {
              this.$router.go(-1);
              MsgBox.success("上传成功");
              return;
            }
            throw new Error();
          })
          .catch((err: any) => {
            MsgBox.error("上传失败");
          });
      }
    }
  }
}
</script>
<style lang="scss">
#add-apply {
  background: #e2ecfc;
  min-height: 100vh;
  width: 100vw;
  .main {
    background: #fff;
    width: 700.4px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 27px 63px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      > p:nth-of-type(1) {
        color: #666;
        font-size: 28px;
        margin-bottom: 51px;
      }
      > p:nth-of-type(2) {
        width: 430px;
        padding-bottom: 25px;
        border-bottom: 1px solid #e1e1e1;
        color: #444;
        font-size: 28px;
      }
    }
    .item1 {
      > p:nth-of-type(1) {
        color: #666;
        font-size: 28px;
      }
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      textarea {
        margin: 19px 0 24px 0;
        width: 100%;
        height: 212px;
        font-size: 20px;
        color: #444 !important;
        border: none;
        border-bottom: 1px solid #e1e1e1;
      }
      .errorClass {
        color: #f00;
        border-bottom: 1px solid #f00;
      }
      .errorClass::-webkit-input-placeholder {
        /* WebKit browsers */
        /* placeholder颜色  */
        color: #ff0000;
        /* placeholder字号  */
      }
      .errorClass:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #ff0000;
      }
      .errorClass::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #ff0000;
      }
      .errorClass::-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #ff0000;
      }
    }
    .btn {
      display: flex;
      justify-content: space-between;
      margin-top: 300px;
      > div:nth-of-type(1) {
        box-sizing: border-box;
        border: 3px solid #8ebefe;
        color: #8ebefe;
      }
      > div:nth-of-type(2) {
        background: #85b8fd;
        color: #fff;
      }
      > div:nth-of-type(1),
      > div:nth-of-type(2) {
        width: 162px;
        height: 75px;
        box-shadow: 0px 3px 7px 0px rgba(74, 135, 218, 0.35);
        border-radius: 8px;
        font-size: 42px;
        text-align: center;
        line-height: 75px;
      }
    }
  }
  .slots {
    height: 124px;
  }
}
</style>