<template>
  <a-card style="height: 100%;position: fixed;width: 100%">
    <div slot="title">
      <a-space>
        串口控制
        <a-tag color="#f50">
          {{ port || '请选择' }}
        </a-tag>
        <a-button type="primary" @click="$electronStore.openInEditor()">配置文件</a-button>

      </a-space>
    </div>
    <a-row>
      <a-col :span="8">
        <div class="">
          <a-space>
            <a-button type="primary" :disabled="path==null || (path && port && true) " @click="open">打开
            </a-button>
            <a-button type="primary" :disabled="!port && true" @click="close">关闭</a-button>
            <a-icon type="sync" style="font-size: 24px" @click="init"></a-icon>
            自动
            <a-switch v-model="autoOpen" :disabled="!port && true"></a-switch>
          </a-space>
          <br>
        </div>
        <a-form>
          <a-form-item label="串口">
            <a-select style="width: 100%" v-model="path" :disabled="port && true">
              <a-select-option v-for="item in serialPortList" :key="item.path">
                <a-tag color="blue">
                  {{ item.path }}
                </a-tag>
                {{ item.locationId }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="波特率">
            <a-select style="width: 100%" v-model="config.baudRate" :disabled="port && true">
              <a-select-option v-for="item in [2400,4800,9600,19200,38400,57600,115200]" :key="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="数据位">
            <a-select style="width: 100%" v-model="config.dataBits" :disabled="port && true">
              <a-select-option v-for="item in [8,7,6,5]" :key="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="停止位">
            <a-select style="width: 100%" v-model="config.stopBits" :disabled="port && true">
              <a-select-option v-for="item in [1,1.5,2]" :key="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="校验位">
            <a-select style="width: 100%" v-model="config.parity" :disabled="port && true">
              <a-select-option v-for="item in ['none','odd','even','mark','space']" :key="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!--                        <a-form-item label="流控制">-->
          <!--                            <a-select style="width: 100%">-->
          <!--                                <a-select-option v-for="item in ['xon','xoff','xany','rtscts']" :key="item">-->
          <!--                                    {{item}}-->
          <!--                                </a-select-option>-->
          <!--                            </a-select>-->
          <!--                        </a-form-item>-->
        </a-form>

      </a-col>
      <a-col offset="2" :span="14">

        <a-form>
          <a-form-item label="接收数据">
            <div id="res">
              <a-list style="height: 100%" :dataSource="resData">
                <a-list-item slot="renderItem" style="margin-left: 2px" slot-scope="item, index">
                  <a-tag style="margin-left: 2px" v-if="showTime">
                    {{ moment(timeList[index]).format('hh:mm:ss') }}
                  </a-tag>
                  <a-tag color="pink"> {{ index + 1 }}</a-tag>
                  : {{ receiveHex ? item.toString('hex') : item }}
                </a-list-item>
              </a-list>
            </div>
            <a-button type="primary" @click="resData=[] ,timeList=[]">清除</a-button>
            <a-checkbox v-model="receiveHex">HEX</a-checkbox>
            <a-checkbox v-model="showTime">显示时间</a-checkbox>
          </a-form-item>
          <a-form-item label="发送数据">
            <a-textarea rows="4" v-model="sendText"></a-textarea>
            <a-button type="primary" :disabled=" !port && true" @click="send">发送</a-button>
            <a-checkbox v-model="sendHex">HEX</a-checkbox>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import Serialport from 'serialport'
import moment from 'moment'

export default {
  name: 'App',
  data() {
    const that = this
    return {
      moment,
      port: null,
      serialPortList: [],
      resData: [],
      timeList: [],
      sendHex: false,
      receiveHex: false,
      showTime: true,
      sendText: '',
      path: null,
      config: {
        autoOpen: false,
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
      },
      appAutoStart: false,
      autoOpen: false,
      debugPassword: ''
    }
  },
  watch: {
    autoOpen(value) {
      this.$electronStore.set("serialPort.autoOpen", value)
      this.$message.info("开机启动:" +( value ? "已打开" : "已关闭"))
    }
  },
  methods: {
    open() {
      const that = this
      that.$electronStore.set("serialPort.config", that.config)
      that.$electronStore.set("serialPort.path", that.path)
      this.$electron.ipcRenderer.send("open-serialport")
      that.init()
    },
    send() {
      const that = this
      this.$electron.ipcRenderer.send("send-serialport", that.sendHex ? 'HEX' : 'ascii', that.sendText)
    },
    close() {
      if (this.$electron.ipcRenderer.sendSync('close-serialport')) {
        this.port = false
        this.autoOpen = false
        this.$electronStore.set("serialPort.autoOpen", false)
      }
    },
    init() {
      const that = this
      Serialport.list().then(res => {
        that.serialPortList = res
        console.log(res)
      }, () => {
        this.$message.warn("获取串口列表失败")
      })
      if (this.$electron.remote.app.serialPort) {
        that.port = this.$electron.remote.app.serialPort.path
        that.path = this.$electron.remote.app.serialPort.path
        that.$message.info("已经连接到" + this.$electron.remote.app.serialPort.path)
      } else {
        that.$message.info("未连接串口")
        that.port = null
        that.path = null
        that.autoOpen = false
        that.$electronStore.set("serialPort.autoOpen", false)
      }
      this.config = that.$electronStore.get("serialPort.config", {
        autoOpen: false,
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
      })
      this.autoOpen = that.$electronStore.get("serialPort.autoOpen", false)
    },
  },
  updated() {
    let divscll = document.getElementById('res')
    divscll.scrollTop = divscll.scrollHeight
  },
  beforeMount() {
    this.init()
    let that = this
    this.$electron.ipcRenderer.on("serialport-data-hex", (enent, res) => {
      if (this.receiveHex) {
        that.resData.push(res)
        that.timeList.push(new Date())
      }
    })
    this.$electron.ipcRenderer.on("serialport-data-ascii", (enent, res) => {
      if (!this.receiveHex) {
        that.resData.push(res)
        that.timeList.push(new Date())
      }
    })
  }
}
</script>

<style scoped>
#res {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  height: 300px;
}

button {
  margin-right: 10px;
}
</style>
