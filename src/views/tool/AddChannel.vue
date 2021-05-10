<template>
  <a-modal
      :title="group+' -  add'"
      :visible=" group && true"
      @ok="input"
      @cancel="close"
  >
    <a-form>
      <a-form-item label="连接组件">
        <a-select style="width: 100%" v-model="obj.type">
          <a-select-option v-for="(item,key) in CHANNEL_NAME_MAP" :key="key">
            {{ item.name }}
          </a-select-option>
        </a-select>

      </a-form-item>
      <a-form-item label="name">
        <a-input v-model="obj.name"></a-input>
      </a-form-item>

      <!--      <a-form-item label="自动连接">-->
      <!--        <a-checkbox v-model="obj.autoOpen">自动连接</a-checkbox>-->
      <!--      </a-form-item>-->

      <!--      <template v-if="obj.component==='SerialportHelp'">-->
      <!--        <a-form-item label="path">-->
      <!--          <a-input v-model="initParam[obj.component].path"></a-input>-->
      <!--        </a-form-item>-->
      <!--      </template>-->

      <!--      <template v-else-if="obj.component==='AliIotMqttDtu'">-->
      <!--        <a-form-item label="productKey">-->
      <!--          <a-input v-model="initParam[obj.component].productKey"></a-input>-->
      <!--        </a-form-item>-->
      <!--        <a-form-item label="deviceName">-->
      <!--          <a-input v-model="initParam[obj.component].deviceName"></a-input>-->
      <!--        </a-form-item>-->
      <!--        <a-form-item label="deviceSecret">-->
      <!--          <a-input v-model="initParam[obj.component].deviceSecret"></a-input>-->
      <!--        </a-form-item>-->
      <!--      </template>-->
    </a-form>

  </a-modal>
</template>

<script>

import {CHANNEL_NAME_MAP} from './const'

export default {
  name: "AddChannel",
  data() {
    return {
      CHANNEL_NAME_MAP,
      obj: {
        name: '',
        type: '',
      },
      initParam: {
        'SerialportHelp': {
          path: ''
        },
        AliIotMqttDtu: {}
      },
      group: null
    }
  },
  methods: {
    close() {
      this.group = null
      this.initParam = {
        'SerialportHelp': {
          path: '',
        },
        AliIotMqttDtu: {}
      }
      this.obj.name = null

    },
    input() {
      console.log(this.obj)
      this.$emit("input", this.group, Object.assign(Object.assign({}, this.obj), {
        initParam: this.initParam[this.obj.component]
      }))
      this.close()
    },
    add(group) {
      this.group = group
    }
  }
}
</script>

<style scoped>

</style>
