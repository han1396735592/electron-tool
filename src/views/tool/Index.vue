<template>
  <div>
    <AddChannel ref="addChannelModal" @input="addChannel"></AddChannel>
    <a-row>
      <a-col span="12">
        <a-button type="primary" @click="$refs.addChannelModal.add('left')">添加</a-button>
        <a-tabs type="editable-card" @edit="(key, action)=>{edit(key,action,'left')}">
          <a-tab-pane :key="index" v-for="(item,index) in left" :tab="CHANNEL_NAME_MAP[item.type].name">
<!--            :color="$refs[`left-channel-${index}`] && $refs[`left-channel-${index}`][0] &&  $refs[`left-channel-${index}`][0].connected?'blue':'red'"-->

<!--            <a-tag slot="tab"-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--              {{ // CHANNEL_NAME_MAP[item.type].name }}-->
<!--&lt;!&ndash;            </a-tag>&ndash;&gt;-->

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
        <a-tabs type="editable-card" @edit="(key, action)=>{edit(key,action,'right')}">
          <a-tab-pane :key="index" v-for="(item,index) in right" :tab="CHANNEL_NAME_MAP[item.type].name">
<!--            <a-tag slot="tab"-->
<!--                   :color="$refs[`right-channel-${index}`] &&  $refs[`right-channel-${index}`][0].connected?'blue':'red'">-->
<!--              {{ CHANNEL_NAME_MAP[item.type].name }}-->
<!--            </a-tag>-->
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
import AddChannel from "@views/tool/AddChannel";
import {CHANNEL_NAME_MAP} from './const'

const dynamicComponent = {}
for (let channelNameMapKey in CHANNEL_NAME_MAP) {
  dynamicComponent[CHANNEL_NAME_MAP[channelNameMapKey].component] =
      () => import('@views/tool/' + CHANNEL_NAME_MAP[channelNameMapKey].component)
}
export default {
  data() {
    return {
      CHANNEL_NAME_MAP,
      left: [],
      right: [],
    };
  },
  components: {
    AddChannel,
    ...dynamicComponent
  },
  methods: {
    addChannel(group, param) {
      this[group].push(param)
    },
    edit(key, action, space) {

      console.log(key)
      console.log(action)

      if (action === 'remove') {
        if (space) {
          this[space].splice(key, 1)
        }
      } else if (action === 'add') {
        this.$refs.addChannelModal.add(space)
      }


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
