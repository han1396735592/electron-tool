<template>
  <a-card title="阿里云DTU">
    <a-row>
      <a-col :span="8">
        <a-form>
          <a-form-item label="productKey">
            <a-input v-model="deviceInfo.productKey" :disabled="iotConnected"></a-input>
          </a-form-item>
          <a-form-item label="deviceName">
            <a-input v-model="deviceInfo.deviceName" :disabled="iotConnected"></a-input>
          </a-form-item>
          <a-form-item label="deviceSecret">
            <a-input v-model="deviceInfo.deviceSecret" :disabled="iotConnected"></a-input>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col offset="2" :span="14">
        <div class="">
          <a-button type="primary" @click="open" v-if="!iotConnected">连接</a-button>
          <a-button v-else type="danger" @click="close">关闭</a-button>
          <br>
        </div>
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
            <a-button type="primary" :disabled="!iotConnected || !sendText" @click="send">发送</a-button>
            <a-checkbox v-model="sendHex">HEX</a-checkbox>
            <a-checkbox v-model="timedSending.open">定时发送</a-checkbox>
            <a-input-number v-model="timedSending.time"></a-input-number>
            ms
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>

const iot = require('alibabacloud-iot-device-sdk/dist/alibabacloud-iot-device-sdk');
import moment from 'moment'
import channelMixin from "@views/tool/channelMixin";

export default {
  name: "AliIotMqttDtu",
  mixins: [channelMixin],
  data() {
    return {
      moment,
      deviceInfo: {},
      resData: [],
      timeList: [],
      sendHex: true,
      receiveHex: true,
      showTime: true,
      sendText: '',
      iotDevice: null,
      timedSending: {
        time: 100,
        open: false
      }
    }
  },

  computed: {
    iot_up_raw_topic() {
      let {productKey, deviceName} = this.deviceInfo
      return `/sys/${productKey}/${deviceName}/thing/model/up_raw`
    },
    iot_down_raw_topic() {
      let {productKey, deviceName} = this.deviceInfo
      return `/sys/${productKey}/${deviceName}/thing/model/down_raw`
    },

    iotConnected() {
      if (this.iotDevice) {
        return this.iotDevice.connected
      }
      return false
    }
  },
  watch: {
    iotConnected(flag) {
      this.connected = flag
    }
  },

  methods: {
    close() {
      console.log("close iotDevice")
      if (this.iotDevice) {
        this.iotDevice.end()
      }
    },
    inputData(data) {
      console.log("input ", data)
      let {iotDevice, iot_up_raw_topic} = this
      iotDevice.publish(iot_up_raw_topic, data)
    },

    send() {
      const that = this
      let {iotDevice, iot_up_raw_topic} = that
      let data = Buffer.from(that.sendText, that.sendHex ? 'HEX' : 'ascii')
      iotDevice.publish(iot_up_raw_topic, data)
    },
    init(deviceInfo) {
      this.deviceInfo = deviceInfo
      return true
    },
    open() {
      let that = this
      let device = iot.device({
        ...that.deviceInfo
      });
      this.iotDevice = device
      //监听connect事件
      device.on('connect', () => {
        console.log('connect successfully!');
        this.$message.success("connect successfully!")
      });
      device.on('error', (err) => {
        console.log('error:', err);
      });

      device.on('close', () => {
        this.connected = false
      })

      device.on('offline', () => {
        this.connected = false
      })

      device.on('message', (topic, payload) => {
        if (topic === that.iot_down_raw_topic) {
          that.resData.push(payload)
          that.timeList.push(new Date())
          that.__output(payload)
        }
      });
    }
  },

}
</script>

<style scoped>
#res {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  height: 200px;
}

button {
  margin-right: 10px;
}
</style>
