<template>
  <a-layout style="height: 100%;width: 100%">
    <a-layout-header class="header">
      <a-menu
          theme="dark"
          mode="horizontal"
          :default-selected-keys="['2']"
          :style="{ lineHeight: '64px' }"
          :selectedKeys="[$route.path]"
      >
        <a-menu-item :key="route.path" v-for="route  in $router.options.routes[0].children"
                     @click="to(route)">
          {{ route.meta.title }}
        </a-menu-item>
      </a-menu>
    </a-layout-header>


    <a-layout style="background: white">
      <a-layout style="padding: 48px 24px 24px;height: 90%;width: 100%">
        <router-view>

        </router-view>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>

export default {
  data() {
    let that = this
    return {
      collapsed: false,
    };
  },
  methods: {
    to(route) {
      this.$router.push(route)
    }
  }
};
</script>

<style>
</style>
