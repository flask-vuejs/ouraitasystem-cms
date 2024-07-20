<template>
  <div class="frame">
    <el-container class="frame-container">
      <el-header class="header">
        <a href="/" class="brand"><strong>AITASystem</strong>后台</a>
        <div class="header-content">
          <div class="greet">欢迎,chl</div>
          <div class="signout">回到首页</div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <el-row class="menu-row">
            <el-col :span="24">
              <el-menu
                default-active="1"
                background-color="#545c64"
                active-text-color="#fff"
                text-color="#ddd"
                :router="true"
              >
                <el-menu-item index="1" :route="{name:'home'}">
                  <template #title>
                    <el-icon><House /></el-icon>
                    <span>首页</span>
                  </template>
                </el-menu-item>

                <el-menu-item index="2" :route="{name:'papers'}">
                  <template #title>
                    <el-icon><Reading /></el-icon>
                    <span>论文管理</span>
                  </template>
                </el-menu-item>

                <el-menu-item index="3" :route="{name:'datasets'}">
                  <template #title>
                    <el-icon><DataLine /></el-icon>
                    <span>数据集管理</span>
                  </template>
                </el-menu-item>

                <el-sub-menu index="4">
                  <template #title>
                    <el-icon><FolderChecked /></el-icon>
                    <span>项目管理</span>
                  </template>
                  <el-menu-item index="4.1" :route="{name:'hxxm'}">
                    <template #title>
                      <el-icon><FolderChecked /></el-icon>
                      <span>横向项目</span>
                    </template>
                  </el-menu-item>
                  <el-menu-item index="4.2" :route="{name:'zxxm'}">
                    <template #title>
                      <el-icon><FolderChecked /></el-icon>
                      <span>纵向项目</span>
                    </template>
                  </el-menu-item>
                </el-sub-menu>


                <el-menu-item index="5" :route="{name:'news'}">
                  <template #title>
                    <el-icon><Connection /></el-icon>
                    <span>新闻动态管理</span>
                  </template>
                </el-menu-item>

                <el-menu-item index="6" :route="{name:'groups'}">
                  <template #title>
                    <el-icon><UserFilled /></el-icon>
                    <span>团队信息管理</span>
                  </template>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-container>
          <el-main class="main">
            <router-view></router-view>
          </el-main>
          <el-footer class="footer">Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.frame-container {
  height: 100vh;
}
.header {
  height: 60px;
  background: #00a65a;
  display: flex;
}

.header .brand {
  width: 200px;
  margin-left: -20px;
  background-color: #008d4c;
  font-size: 20px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header .header-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 20px;
  color: #fff;
}

.header-content .signout {
    cursor: pointer;
  }

.aside {
  background-color: #545c64;
}

.aside .el-menu .is-active {
  background-color: #434a50 !important;
}

.footer {
  background: gray;
}
</style>

<style scoped>
.el-menu{
  border-right: none;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
  text-decoration: none;
  vertical-align: baseline;
}
</style>
