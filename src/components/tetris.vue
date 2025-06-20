<script setup>
import { onMounted } from 'vue'



class Tetris {
  constructor() {
    this._board = new Array(20).fill(0)
    this.init()
  }

  getRow(row = []) {
    const arr = new Array(10).fill().map((_, i) => +row.includes(i) && 1)
    return +`0b${arr.join('')}`
  }

  init() {
    const diamonds = [
      {
        matrix: [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0]
        ]
      },
      {
        matrix: [
          [1, 1],
          [1, 1]
        ]
      },
      {
        matrix: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ]
      },
      {
        matrix: [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0]
        ]
      },
      {
        matrix: [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0]
        ]
      },
      {
        matrix: [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0]
        ]
      },
      {
        matrix: [
          [0, 0, 1],
          [1, 1, 1],
          [0, 0, 0]
        ]
      },
    ]
    diamonds.forEach(diamond => {
      const size = diamond.matrix.length
      const ix = Math.floor((10 - size) / 2)
      const board = new Array(20).fill(0)

      diamond.matrix.forEach((row, i) => board[i] =
        this.getRow(
          row.map((m, n) => m * (n + ix)).filter(Boolean)
        )
      )

      diamond.size = size
      diamond.position0 = [ix, 0]
      diamond.defaultBoard = board
    })
    this._diamonds = diamonds
  }

  createMoveBoard() {
    const len = this._diamonds.length
    const index = Math.floor(Math.random() * len)
    const { defaultBoard, ...diamond } = structuredClone(this._diamonds[index])
    this._diamond = { index, ...diamond }
    this._moveBoard = defaultBoard
    // this._moveBoard2 = this._moveBoard.map(i => i)
    // this._moveBoard3 = this._moveBoard.map(i => this.shi2er(i))
  }

  shi2er(p) {
    const _to = n => '0b' + (+n).toString(2).padStart(10, 0)
    if (Array.isArray(p)) {
      return p.map(i => _to(i))
    } else return _to(p)
  }

  get s_Board() {
    return this.shi2er(this._board)
  }

  get s_MoveBoard() {
    return this.shi2er(this._moveBoard)
  }

  spin() {
    let { position0: [x0, y0] } = this._diamond
    const { matrix, size } = this._diamond
    const xIsVoid = x0 < 0 || x0 > 10 - size
    const yIsVoid = y0 < 0 || y0 > 20 - size
    if (xIsVoid) {
      while (1) {
        x0 = this._diamond.position0[0]     // 重新获取 x0
        if (x0 < 0) {
          this.rightMove()
        } else if (x0 > 10 - size) {
          this.leftMove()
        } else {
          break
        }
      }
    }
    if (yIsVoid) {
      return;
    }
    const newBoard = new Array(20).fill(0)
    const newMatrix = structuredClone(matrix)
    for (let j in matrix) {
      for (let i in matrix[j]) {
        i = +i, j = +j
        const v = matrix[j][i]
        newMatrix[i][size - j - 1] = v
        if (v) {
          const x = (size - j - 1) + x0, y = (i) + y0
          const row = this.getRow([x])
          newBoard[y] += row
        }
      }
    }
    this._diamond.matrix = newMatrix
    this._moveBoard = newBoard
  }
  leftMove(reject) {
    const isVoid = (Math.max(...this._moveBoard) & this.getRow([0])) !== 0
    if (isVoid) {
      reject && reject()
      return;
    }
    this._diamond.position0[0]--
    this._moveBoard = this._moveBoard.map(i => i && (i << 1))
  }
  rightMove(reject) {
    const isVoid = (Math.min(...this._moveBoard.filter(Boolean)) & 1) !== 0
    if (isVoid) {
      reject && reject()
      return;
    }
    this._diamond.position0[0]++
    this._moveBoard = this._moveBoard.map(i => i && (i >> 1))
  }
  downMove() {
    const i = this._moveBoard.findLastIndex(Boolean)
    if (i === -1) {
      return true;
    }
    const isVoid = (i === this._moveBoard.length - 1) || ((this._moveBoard[i] & this._board[i + 1]) !== 0)
    if (isVoid) {
      this.stack()
      return true;
    }
    this._diamond.position0[1]++
    this._moveBoard = [0, ...this._moveBoard.slice(0, -1)]
  }

  stack() {
    console.log('stack', this._diamond.index, ...this._diamond.matrix)
    this._moveBoard.forEach((row, i) => {
      if (row) {
        this._board[i] += row
        this._moveBoard[i] = 0
      }
    })
    this.clear()
  }

  clear() {
    this._diamond = {}
  }


  start() {
    this.createMoveBoard()


    // let n = 0;
    // function test() {
    //   n++;
    //   console.log(`hello ~ requestAnimationFrame ${n}`);
    //   requestAnimationFrame(test)
    // };
    // requestAnimationFrame(test)
    let now = Date.now()
    function test(timestamp) {
      console.log(`hello ~ requestAnimationFrame ${timestamp}`);
      if (Date.now() - now === 1000) { requestAnimationFrame(test) }
    }
    requestAnimationFrame(test)

  }
}



const tetris = new Tetris()
onMounted(() => {
  tetris.start()
  console.log('😓', tetris)
})


</script>

<template>

</template>

<style scoped></style>
