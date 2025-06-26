<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Tetris } from '../pages/tetris'


const colorG = ['#0f0', '#00f', '#ff0', '#f0f', '#0ff']
function updateTimer() {
    let old = 0, frequency = 0, id
    const start = (fn, interval, t = interval) => {
        id = requestAnimationFrame(t => start(fn, interval, t))
        if (t - old >= interval) {
            fn()
            old = t
            frequency++
        }
    }
    return {
        start,
        stop: () => id && cancelAnimationFrame(id),
        get frequency() {
            return frequency
        }
    }
}


const tetris = new Tetris()
const timer = updateTimer()
const { start, stop } = timer
const head = ref([])
const board = ref(tetris.renderBoard.body)
function render() {
    head.value = tetris.renderBoard.head
    board.value = tetris.renderBoard.body
}


const control = {
    ArrowLeft() {
        tetris.left()
    },
    ArrowRight() {
        tetris.right()
    },
    ArrowDown() {
        tetris.down()
    },
    ArrowUp() {
        tetris.spin()
    },
    Space() {
        tetris.straightDown()
    }
}
window.addEventListener('keydown', e => {
    const { code } = e
    if (control[code]) {
        e.preventDefault()
        control[code]()
        render()
    }
})


const time = ref(0)
const game = () => {
    timer.frequency && tetris.down() && tetris.next()
    render()
    time.value++
}
const isStop = ref()
const gameStart = () => {
    isStop.value = false
    start(game, 1000)
}
const pause = () => {
    isStop.value = true
    stop()
}
onMounted(() => {
    console.log('🦴', tetris)
})
onUnmounted(stop)
</script>

<template>
    <el-button v-if="!timer.frequency" type="info" @click="gameStart">游戏开始</el-button>
    <el-button v-else-if="isStop" type="info" @click="gameStart">游戏继续</el-button>
    <template v-else>
        <el-button type="info" @click="pause">游戏暂停</el-button>
        <span>游戏进行了{{ time }}秒</span>
    </template>


    <div class="box">
        <div class="head">
            <div class="row" v-for="(row, r) in head" :key="r">
                <div class="item" v-for="(item, c) in row" :key="c"
                    :style="{ background: item === 1 ? '#555' : colorG[item - 2] }">
                    <!-- {{ item }} -->
                </div>
            </div>
        </div>
        <div class="body">
            <div class="row" v-for="(row, r) in board" :key="r">
                <div class="item" v-for="(item, c) in row" :key="c"
                    :style="{ background: item === 1 ? '#555' : colorG[item - 2] }">
                    <!-- {{ item }} -->
                </div>
            </div>
        </div>
    </div>


    <!-- <div class="control">
        <el-button type="info" @click="control.ArrowLeft()">左</el-button>
        <el-button type="info" @click="control.ArrowUp()">转</el-button>
        <el-button type="info" @click="control.ArrowRight()">右</el-button>
        <el-button type="info" @click="control.Space()">落</el-button>
        <el-button type="info" @click="control.ArrowDown()">下</el-button>
    </div> -->
</template>

<style scoped>
.box {
    .row {
        display: flex;

        .item {
            width: 20px;
            height: 20px;
            border-color: black;
            border-style: solid;
            border-width: 0 1px 1px 0;

            &:first-child {
                border-left-width: 1px;
            }
        }

        &:first-child>.item {
            border-top-width: 1px;
        }
    }

    .head {
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: end;

        .item {
            border-color: #fff;
        }

        .row:last-child>.item {
            border-bottom: none;
        }
    }
}
</style>