<template>
  <a-card>
    <div slot="title">
      <a-space>
        {{ name }}
        <a-button @click="start" :disabled="running" type="primary">启动</a-button>
        <a-button @click="stopServer" :disabled="!running" type="primary">停止</a-button>
        <a-button @click="logType='info'" type="primary">日志</a-button>
        {{ serverProcess && serverProcess.pid }}
      </a-space>
    </div>
    <div>
      <a-row>
        <a-col span="16">
          <a-input v-model="path" addonBefore="目录">
            <span style="color: blue" slot="addonAfter" :disabled="running" @click="changePath">选择</span>
          </a-input>
        </a-col>
        <a-col span="8">
          <a-input v-model="cmd" :disabled="running" addonBefore="命令"></a-input>
        </a-col>
      </a-row>
    </div>

    <a-modal :visible="logType && true" @ok="logType=null" :footer="null" :width="window.outerWidth*0.8"
             @cancel="logType=null">
      <a-radio-group v-model="logType" button-style="solid" slot="title">
        <a-radio-button value="info">
          info
        </a-radio-button>
        <a-radio-button value="error">
          error
        </a-radio-button>
      </a-radio-group>
      <a-textarea :value="logs[logType]" id="logArea" :auto-size="{ minRows: 20, maxRows: 30 }" disabled>
      </a-textarea>
    </a-modal>
  </a-card>
</template>

<script>
export default {
  name: "Program",
  props: {
    name: {
      default: ""
    },
    commandPath: {},
    command: {},
    autoRun: {
      default: false
    }
  },
  data() {
    let that = this
    return {
      path: that.commandPath,
      running: false,
      cmd: that.command,
      serverProcess: null,
      logType: null,
      logs: {
        info: '',
        error: ''
      },
      window
    }
  },
  updated() {
    let divscll = document.getElementById('logArea')
    if (divscll) {
      divscll.scrollTop = divscll.scrollHeight
    }
  },
  destroyed() {
    this.stopServer()
  },

  created() {
    if (this.autoRun) {
      this.start()
    }
  },
  methods: {
    // 关闭项目中的所有进程，主要是为了关闭刚刚启动的服务器进程。
    stopServer() {
      console.log("Kill server process.....")
      let that = this
      const kill = require('tree-kill'); //  tree-kill是一个插件，需要安装，在项目中已经用 yarn add tree-kill 命令安装。
      if (that.serverProcess) {
        kill(that.serverProcess.pid, 'SIGTERM', function (err) { //终止进程树，杀死所有进程，包括根进程。
          console.log('Killed');
          that.serverProcess = null;
        })
      }
    },
    changePath() {
      let that = this
      this.$electron.remote.dialog.showOpenDialog({
        title: '选择路径',
        message: '666',
        defaultPath: that.commandPath,
        properties: ['openDirectory']
      }).then(result => {
        if (!result.canceled) {
          this.path = result.filePaths[0]
        }
      }).catch(err => {
        console.log(err)
      })
    },
    start() {

      this.logs = {
        info: '',
        error: ''
      }
      this.logType = 'info'
      const that = this
      let serverProcess = require('child_process').exec(this.cmd, {cwd: this.path})
      that.serverProcess = serverProcess
      serverProcess.on('message', console.log)
      serverProcess.stdout.on('data', function (data) {
        console.log("server stdout:" + data)// 打印正常的后台可执行程序输出
        that.logs.info += data
        if (!that.running) {
          that.running = true
          that.$emit('opened')
          that.$notification.success({
            key: "serverProcess." + serverProcess.pid,
            message: '服务启动成功',
            description: that.name,
            placement: 'bottomRight'
          });
        }
        // else {
        //   that.$notification.info({
        //     key: "serverProcess.out" + serverProcess.pid,
        //     message: '服务运作中' + that.name,
        //     // description: <a-textarea value={data} rows={5}>,
        //     placement: 'bottomRight'
        //   });
        // }
      })
      serverProcess.stderr.on('data', function (data) {
        console.error('stderr:' + data) //打印错误的后台可执行程序输出
        that.logs.error += data
        that.$notification.error({
          key: "serverProcess.err." + serverProcess.pid,
          message: '服务运行遇到错误' + that.name,
          description: data,
          placement: 'bottomRight'
        });
      })
      serverProcess.on('close', function (code, signal) {
        console.log('out code:' + code, signal) // 退出之后的输出
        that.running = false
        that.$emit('close', code)
        that.$notification.warn({
          key: "serverProcess." + serverProcess.pid,
          message: '服务停止' + that.name,
          description: '程序退出:' + code,
          placement: 'bottomRight'
        });
      })
    }
  }
}
</script>

<style scoped>

</style>
