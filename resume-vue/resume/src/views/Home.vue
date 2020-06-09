<template>
  <div id="home">
    <el-container>
      <el-header height="200">
        <el-row>
          <el-col :span="19">
            <header>
              <h1>简历</h1>
              <p class>
                <span v-for="i in my_info" :key="i.id">{{ i.id }}：{{ i.value }}</span>
              </p>
              <p>
                <span v-for="i in my_contact" :key="i.id">{{ i.id }}：{{ i.value }}</span>
              </p>
            </header>
          </el-col>
          <el-col :span="5">
            <el-avatar :size="140" :src="circleUrl"></el-avatar>
          </el-col>
        </el-row>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      my_info: [
        {
          id: "姓名",
          value: "邱际达"
        },
        {
          id: "性别",
          value: "男"
        },
        {
          id: "应聘岗位",
          value: "前端开发"
        }
      ],
      my_contact: [
        {
          id: "电话",
          value: "15970868827(微信)"
        },
        {
          id: "邮箱",
          value: "jousindea@163.com"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
#home {
  max-width: 1012px;
  margin-right: auto;
  margin-left: auto;

  .el-container {
    .el-header {
      .el-row {
        .el-col {
          header {
            margin: 20px 0;

            h1 {
              font-weight: bold;
              height: 40px;
              line-height: 40px;
              color: #467b73;

              font-size: 36px;

              margin: 12px 0;
            }

            p {
              font-size: 15px;
              width: 100%;
              display: flex;
              flex-flow: row;

              height: 14px;
              line-height: 14px;

              margin: 6px;

              &:nth-child(2) {
                span {
                  width: 33%;

                  &:nth-child(2) {
                    text-align: center;
                  }

                  &:last-child {
                    text-align: right;
                  }
                }
              }

              &:nth-child(3) {
                span {
                  width: 50%;

                  &:last-child {
                    text-align: right;
                    padding-right: 5px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>