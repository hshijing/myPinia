<template>
  <input type="text" v-model="store.inputVal" />
  <button type="button" @click="removeInp">清除文本</button>
  <hr />

  <div>{{ store1.count }}</div>
  <button @click="addCount">+1</button>
  <button @click="reset">重置</button>

  <button @click="removeComp">停止监听</button>
  {{ store1.list.length }}
</template>

<script setup lang="ts">
import { text1, testStore } from "./test/Mypinia";
const store1 = testStore();
const store = text1();

const removeInp = () => {
  store.resetVal();
  console.log(store.inputValue);
};

const reset = () => {
  store1.$reset();
};

const addCount = () => {
  store1.increment();
  store1.pushList(123);
};

const removeComp = () => {
  store1.$dispose();
};

/**
 * actions 侦听器，可以检测错误
 */
store1.$onAction((...args) => {
  const { after, onError } = args[0];
  after(() => {
    console.log("after");
  });
  onError((err) => {
    console.log("onError", err);
  });
});
</script>

<style scoped lang="scss"></style>
