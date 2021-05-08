<template>
  <div>
    <a-row type="flex" justify="center" align="top">
      <a-col :span="8">
        <span style="font-size: 18px">
                  软件名称:
          <span style="font-size: 24px;color: #2eabff">
            electron-tool
          </span>
        </span>
      </a-col>
      <a-col :span="8">
        版本:
        <a-tag color="blue">{{ version }}</a-tag>
        <a-button type="primary" @click="checkUpdate">检查更新</a-button>
      </a-col>

      <a-col :span="4">
        开机启动:
        <a-switch v-model="loginSetting.openAtLogin" @change="openAtLogin">
        </a-switch>
      </a-col>

    </a-row>

    <a-divider></a-divider>
    <a-card title="进程信息">
      <a-row>
        <a-col :span="8" v-for="metrics in getAppMetrics" :key="metrics.pid">
          <a-card :title="`pid : 【${metrics.pid}】`">
            <a-space>
              <a-statistic title="CPU使用率百分比" :value="`${(metrics.cpu.percentCPUUsage ).toFixed(3)}(%)`"/>
              <a-statistic title="使用内存" :value="`${(metrics.memory.workingSetSize/1000).toFixed(3)}(MB)`"/>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>

export default {
  name: "AppInfo",
  data() {
    let execPath = this.$electron.remote.process.execPath;
// 获取可执行文件位置
    return {
      appName: this.$electronApp.name,
      version: this.$electronApp.getVersion(),
      getAppMetrics: this.$electronApp.getAppMetrics(),
      execPath: execPath,
      loginSetting: this.$electronApp.getLoginItemSettings()
    }
  },
  mounted() {
    setInterval(() => {
      this.getAppMetrics = this.$electronApp.getAppMetrics()
      this.loginSetting = this.$electronApp.getLoginItemSettings()
    }, 1000)
  }, methods: {
    checkUpdate() {
      this.$message.info("已经是最新版本")
    },
    openAtLogin(flag) {
      this.$electronApp.setLoginItemSettings({
        openAtLogin: flag,
        path: this.execPath,
        args: []
      });
      this.loginSetting = this.$electronApp.getLoginItemSettings()
      this.$message.info("开机启动:【" + (flag ? "打开" : "关闭") + "】")
    }
  }

}
</script>

<style scoped>

</style>
