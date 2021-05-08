<template>
  <div>
    <a-button @click="downloadZip">下载压缩包</a-button>
    <program name="nacos"
             style="width: 800px"
             command="startup.cmd -m standalone"
             command-path="D:\\myProgram\\dev\\nacos-server-1.3.2\\nacos\\bin"
             ref="nacosProgram"
    ></program>
    <program name="frp"
             style="width: 800px"
             command="frpc.exe -h"
             :command-path="frpPath"></program>
  </div>
</template>


<script>
import Program from "@/config/Program";
const path = require('path')
export default {
  name: "ExternalProgram",
  components: {Program},
  data() {
    return {
      frpPath: path.join(this.$resourcesPath, 'lib/frp'),
    }
  },
  methods: {
    downloadZip() {
      const that = this
      this.$webContents.session.on('will-download', (event, item, webContents) => {
        console.log("====")
        console.log(item)
        const filePath = path.join(that.$electronApp.getPath('downloads'), item.getFilename());
        item.setSavePath(filePath);
        console.log(filePath)
      })
      this.$webContents.openDevTools()
      this.$webContents.downloadURL("http://searchbox.bj.bcebos.com/miniapp/demo-1.0.1.zip");
    },
    openNacos() {
      let that = this
      let key = 'nacos'
      this.$notification.success({
        message: '服务启动',
        duration: 0, key,
        description: '打开控制台',
        btn: h => {
          return h(
              'a-button',
              {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                on: {
                  click: () => {
                    const {shell} = require('electron')
                    shell.openExternal('http://localhost:8848/nacos')
                  },
                },
              },
              '打开控制台',
          );
        },
        onClose() {
          that.$refs.nacosProgram.stopServer()
        }
      })
    }
  }

}
</script>

<style scoped>

</style>
