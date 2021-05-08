<template>
  <div>

    <a-input v-model="deviceInfo.productKey"></a-input>
    <a-input v-model="deviceInfo.deviceName"></a-input>
    <a-input v-model="deviceInfo.deviceSecret"></a-input>

    <a-button @click="init">连接</a-button>
  </div>
</template>

<script>

// node引入包名
const iot = require('alibabacloud-iot-device-sdk');


export default {
  name: "AliIotMqttDtu",

  data() {
    return {
      deviceInfo: {
        productKey: '<productKey>', //将<productKey>修改为实际产品的ProductKey
        deviceName: '<deviceName>',//将<deviceName>修改为实际设备的DeviceName
        deviceSecret: '<deviceSecret>',//将<deviceSecret>修改为实际设备的DeviceSecret
      },
      iotDevice: null,
    }
  },

  methods: {
    init() {
      //创建iot.device对象将会发起到阿里云IoT的连接
      const device = iot.device(this.deviceInfo);
      this.iotDevice = device
      //监听connect事件
      device.on('connect', () => {
        let {productKey, deviceName} = this.deviceInfo
        //将<productKey> <deviceName>修改为实际值
        device.subscribe(`/${productKey}/${deviceName}/user/get`);
        console.log('connect successfully!');
        device.publish(`/${productKey}/${deviceName}/user/update`, 'hello world!');
      });

//监听message事件
      device.on('message', (topic, payload) => {
        console.log(topic, payload.toString());
      });
    }

  },

  created() {


  }


}
</script>

<style scoped>

</style>
