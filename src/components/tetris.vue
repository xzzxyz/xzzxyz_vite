<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Tetris } from '../tetris'






const colorG = ['#0f0', '#00f', '#ff0', '#f0f', '#0ff']
const tetris = new Tetris()
const { start, stop } = updateTimer()
const board = ref(tetris.t_board)
function render() {
    board.value = tetris.t_renderBoard
}
function updateTimer() {
    let timer = 0, id
    const start = (fn, interval, t = interval) => {
        id = requestAnimationFrame(t => start(fn, interval, t))
        if (t - timer >= interval) {
            timer = t
            fn()
        }
    }
    return {
        start,
        stop: () => cancelAnimationFrame(id)
    }
}


function game() {
    console.log('🦴', tetris)

    tetris.createCube()


    start(() => {
        const next = tetris.down()

        if (next) {
            tetris.stack()
            tetris.createCube()
        }
        if (tetris.board.some(row => row === 2 ** tetris.size - 1)) {
            for (const i in tetris.board) {
                const e = tetris.board[i]
                if (e === 2 ** tetris.size - 1) {
                    tetris.eliminate(i)
                }
            }
        }

        render()
    }, 1000)
    setTimeout(stop, 50000);
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


onMounted(game)
onUnmounted(stop)
</script>

<template>
    <el-button type="info" @click="start(); startTime = Date.now(); diamondDown()">游戏开始</el-button>
    <el-button type="info" @click="start(); loop()">游戏继续</el-button>
    <el-button type="info" @click="stop()">游戏暂停</el-button>
    游戏进行了{{ time }}秒


    <div class="box">
        <div class="row" v-for="(row, r) in board" :key="r">
            <div class="item" v-for="(item, c) in row" :key="c"
                :style="{ background: item === 1 ? '#555' : colorG[item - 2] }">
                {{ item }}
            </div>
        </div>
    </div>


    <div class="control">
        <el-button type="info" @click="control.ArrowLeft()">左</el-button>
        <el-button type="info" @click="control.ArrowUp()">转</el-button>
        <el-button type="info" @click="control.ArrowRight()">右</el-button>
        <el-button type="info" @click="control.Space()">落</el-button>
        <el-button type="info" @click="control.ArrowDown()">下</el-button>
    </div>
</template>

<style scoped>
.box {
    display: flex;
    flex-direction: column;

    .row {
        display: flex;

        .item {
            width: 20px;
            height: 20px;
            border: 1px solid black;
        }
    }
}
</style>