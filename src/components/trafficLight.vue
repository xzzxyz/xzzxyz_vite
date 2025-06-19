<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import $ from "jquery";
import { useStore } from '@/pinia'
import { ElMessage } from "element-plus";
import { ofetch } from "ofetch";
// import { get } from '@/alova'


class classLight {
  constructor(lights) {
    this._lights = lights
    this._index = 0
    this._sTime = Date.now()
  }

  get _current() {
    return this._lights[this._index]
  }

  get _lTime() {
    return Date.now() - this._sTime
  }

  _update() {
    while (1) {
      if (this._lTime < this._current.time) {
        break;
      }
      this._sTime += this._current.time
      this._index = (this._index + 1) % this._lights.length
    }
  }

  getCurData() {
    this._update()
    return {
      color: this._current.color,
      time: this._current.time - this._lTime,
      index: this._index
    }
  }
}


const light = new classLight([
  {
    color: 'green',
    time: 15000
  },
  {
    color: 'yellow',
    time: 5000
  },
  {
    color: 'red',
    time: 30000
  }
])


const time = ref(0)
let rAFId
onMounted(() => {
  function render() {
    const { index, color, time: t } = light.getCurData()
    const list = $('.c')
    for (const i in light._lights) {
      let c = color
      if (i != index) {
        c = '#ddd'
      }
      list[i].style.backgroundColor = c
    }
    time.value = (t / 1000).toFixed(1) + 's'
  }


  function start() {
    rAFId = requestAnimationFrame(start)
    render()
  }
  start()
})
onUnmounted(() => rAFId && cancelAnimationFrame(rAFId))
</script>

<template>
  <div class="flex-cc">
    <div class="box">
      <div class="c"></div>
      <div class="c"></div>
      <div class="c"></div>
    </div>
    <div class="time">
      {{ time }}
    </div>
  </div>
</template>

<style scoped>
.flex-cc {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min-content;

  .box {
    display: flex;
    position: relative;

    .c {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #ddd;
      margin: 10px;
    }
  }

  .time {
    font-size: 48px;
    font-family: fantasy;
  }
}
</style>
