<template>
  <a-card title="TCP Server">
    <a-row>
      <a-col :span="8">
        <a-form>
          <a-form-item label="监听地址">
            <a-input v-model="host"></a-input>
          </a-form-item>
          <a-form-item label="监听端口">
            <a-input-number v-model="port" :min="1024" :max="65536"></a-input-number>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col offset="2" :span="14">
        <div class="">
          <a-button type="primary" :disabled="port==null || connected " @click="open">打开
          </a-button>
          <a-button type="primary" :disabled="!connected" @click="close">关闭</a-button>
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
            <a-button type="primary" :disabled=" !connected" @click="send">发送</a-button>
            <a-checkbox v-model="sendHex">HEX</a-checkbox>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

  </a-card>
</template>

<script>
import channelMixin from "@views/tool/channelMixin";

import net from 'net'
import moment from 'moment'

export default {
  name: "TcpServer",
  mixins: [channelMixin],
  data() {
    let clientSet = new Set()
    return {
      moment,
      port: 12345,
      host: '127.0.0.1',
      resData: [],
      timeList: [],
      sendHex: false,
      receiveHex: false,
      showTime: true,
      sendText: '',
      tcpServer: null,
      clientSet: clientSet
    }
  },
  updated() {
    let divscll = document.getElementById('res')
    divscll.scrollTop = divscll.scrollHeight
  },
  methods: {
    init({port = 12345, sendHex = true, receiveHex = true}) {
      this.port = port
      this.sendHex = sendHex
      this.receiveHex = receiveHex
      return true
    },
    DealConnect(socket) {
      let that = this
      that.clientSet.add(socket)
      socket.on('data', function (data) {
        that.resData.push(data)
        that.timeList.push(new Date())
        that.__output(data)
        console.log('received data %s', data);
      })
      // 客户端正常断开时执行
      socket.on('close', function () {
        console.log('client disconneted!');
        that.clientSet.delete(socket)
      })
// 客户端正异断开时执行
      socket.on("error", function (err) {
        console.log('client error disconneted!');
      });

    },
    send() {
      const that = this
      console.log(that.tcpServer)
      this.clientSet.forEach(socket => {
        socket.write(Buffer.from(that.sendText, that.sendHex ? 'HEX' : 'ascii'))
      })
    },
    close() {
      if (this.tcpServer) {
        this.tcpServer.close()
        this.clientSet.forEach(socket => {
          socket.end()
        })
      }
    },

    open() {
      let tcp_server = net.createServer();  // 创建 tcp server
      this.tcpServer = tcp_server
      let that = this
      let port = this.port
      tcp_server.listen(port, function () {
        console.log('tcp_server listening ' + port);
        that.$message.info("tcp_server listening " + port)
        that.connected = true
      });

      tcp_server.on('connection', function (socket) {
        console.log(socket.address());
        that.DealConnect(socket)
      })

      tcp_server.on('error', function () {
        console.log('tcp_server error!');
      })

      tcp_server.on('close', function () {
        console.log('tcp_server close!');
        that.connected = false
        that.clientSet.clear()
        console.log(tcp_server)
      })
    }
  }
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

