<template>
  <div id="app">
    <router-view></router-view>
    <!--    <a-popover title="Title" style="position: fixed;bottom: 40px;right: 40px">-->
    <!--      <template slot="content">-->
    <!--      </template>-->
    <a-button type="primary" @click="$router.push({path:'/'})" style="position: fixed;bottom: 40px;right: 40px">
      首页
    </a-button>
    <!--    </a-popover>-->
  </div>
</template>
<script>
import {autoUpdater} from "electron-updater";

export default {
  data() {
    return {}
  }, methods: {
    showConfirm() {
      let that = this
      this.$confirm({
        title: '请输入调试密码?',
        content: h => <a-input-password
            value={that.debugPassword}
            placeholder="input password"
            onchange={(e) => {
              that.debugPassword = e.target.value
            }
            }/>,
        onOk() {
          if (that.debugPassword === process.env.VUE_APP_DEBUG_PASS) {
            that.$electron.ipcRenderer.send('open-debug')
          } else {
            that.$message.warn("密码错误")
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
  },
  components: {},
  created() {
    setInterval(() => {
      if (this.$electronStore.get("autoUpdater")) {
        this.$electron.ipcRenderer.send("check-for-update", "http://al.oss.qqhxj.cn/public/electron-tool/")
      }
    }, 10000)
    let that = this
    this.$electron.ipcRenderer.on("autoUpdaterMessage", (event, args) => {
      if (args) {
        let action = args.action
        if (action) {
          let type = null
          let config = {
            key: args.key || args.action
          }
          switch (action) {
            case 'error':
              type = 'error'
              config.message = '更新遇到错误'
              config.description = args.msg
              break
            case 'update-available':
              type = 'success'
              config.message = '发现新版本'
              config.description = "已经在后台自动下载"
              break;
            case 'update-not-available':
              type = 'info'
              config.message = '更新提示'
              config.description = "当没有可用更新"
              break
            case 'checkResult':
              type = 'info'
              config.message = '版本说明'
              config.description = "版本:" + args.msg.version + " 时间:" + args.msg.releaseDate
              break
            case 'update-downloaded':
              type = 'success'
              config.message = '更新提示'
              config.description = "新版本下载成功"
              if (this.$electronStore.get("autoUpdater")) {
                config.description = "新版本下载成功,将自动退出并安装"
                this.$electron.ipcRenderer.send("quitAndInstall")
              } else {
                config.onClick = () => {
                  that.$message.info("软件将自动退出并安装")
                  this.$electron.ipcRenderer.send("quitAndInstall")
                }
                config.btn = h => {
                  return h(
                      'a-button',
                      {
                        props: {
                          type: 'primary',
                          size: 'small',
                        }
                      },
                      '立即安装',
                  );
                }
              }
              break;
          }
          if (type) {
            that.$notification[type](config)
          }
        }
      }
    })
  },

}
</script>
<style>
#app {
  height: 100%;
}
</style>
