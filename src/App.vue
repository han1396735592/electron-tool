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
  },

}
</script>
<style>
#app {
  height: 100%;
}
</style>
