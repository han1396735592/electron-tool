<template>
  <div>
    <AddChannel ref="addChannelModal" @input="addChannel"></AddChannel>
    <a-row>
      <a-col span="12">
        <a-button type="primary" @click="$refs.addChannelModal.add('left')">添加</a-button>
        <a-tabs>
          <a-tab-pane :key="index" :tab="CHANNEL_NAME_MAP[item.type].name" v-for="(item,index) in left">
            <div v-if="$refs[`left-channel-${index}`]">
              {{ $refs[`left-channel-${index}`][0].connected }}
            </div>
            <component
                v-bind:is="CHANNEL_NAME_MAP[item.type].component"
                :initParam="item.param"
                :autoOpen="item.autoOpen"
                :ref="`left-channel-${index}`"
                @output="(data)=>{toOutput('right',data)}"
            ></component>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col span="12">
        <a-button type="primary" @click="$refs.addChannelModal.add('right')">添加</a-button>
        <a-tabs>
          <a-tab-pane :key="index" :tab="CHANNEL_NAME_MAP[item.type].name" v-for="(item,index) in right">
            <div v-if="$refs[`left-channel-${index}`]">
              {{ $refs[`left-channel-${index}`][0].connected }}
            </div>
            <component
                v-bind:is="CHANNEL_NAME_MAP[item.type].component"
                :initParam="item.param"
                :autoOpen="item.autoOpen"
                :ref="`right-channel-${index}`"
                @output="(data)=>{toOutput('left',data)}"
            ></component>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>

</template>
<script>
import AliIotMqttDtu from "@views/tool/AliIotMqttDtu";
import SerialportHelp from "@views/tool/SerialportHelp";
import AddChannel from "@views/tool/AddChannel";
import TcpServer from "@views/tool/TcpServer";
import TcpClient from "@views/tool/TcpClient";
import {CHANNEL_NAME_MAP} from './const'
export default {
  data() {
    return {
      CHANNEL_NAME_MAP,
      left: [],
      right: [],
    };
  },
  components: {
    AliIotMqttDtu,
    SerialportHelp,
    AddChannel,
    TcpServer,
    TcpClient
  },
  methods: {
    addChannel(group, param) {
      this[group].push(param)
    },
    toOutput(turn, data) {
      console.log(turn, data)
      for (let $refsKey in this.$refs) {
        if ($refsKey.startsWith(turn)) {
          if (this.$refs[$refsKey]) {
            this.$refs[$refsKey].forEach(comment => {
              if (comment && comment.connected) {
                if (comment.inputData) {
                  console.log("send to", comment)
                  comment.inputData(data)
                }
              }
            })
          }
        }
      }
    }
  }
}

</script>
