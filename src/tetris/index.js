export class Tetris {
    constructor(options = {}) {
        const { width = 10, height = 20 } = options
        this.size = { width, height }

        this.cubeInit()
        this.createCube()
        const board = Array(this.cube.length).fill(Array(width).fill(0))
        this.board = this.m2a(board)
    }

    m2a(m) {
        // 矩阵转一维数组
        return m.map(r => +`0b${r.map(i => i ? 1 : 0).join('')}`)
    }

    a2m(a, v = 1) {
        // 一维数组转矩阵
        const t = r => r.toString(2).padStart(10, 0).split('').map(i => +i ? v : 0)
        return a.map(r => Array.isArray(r) ? t(r.join('')) : t(r))
    }

    getRow(target = [], returnNumber = false) {
        const row = Array(this.size.width).fill(0)
        for (const i in row) {
            for (const j of target) {
                if (i == j) {
                    row[i] = 1
                }
            }
        }
        if (returnNumber) {
            return +`0b${row.join('')}`
        }
        return row
    }

    isVoid(a, b) {
        return (a & b) !== 0
    }

    left() {
        const c = this.cube
        const b = this.board
        const _isVoid = c.some((r, i) =>
            r &&
            (this.isVoid(r, 2 ** (this.size.width - 1)) || this.isVoid(r, b[i]))
        )
        if (_isVoid) {
            return;
        }
        this.cubei.position0[0]--
        this.cube = c.map(v => v << 1)
    }
    right() {
        const c = this.cube
        const b = this.board
        const _isVoid = c.some((r, i) =>
            r &&
            (this.isVoid(r, 1) || this.isVoid(r, b[i]))
        )
        if (_isVoid) {
            return;
        }
        this.cubei.position0[0]++
        this.cube = c.map(v => v >> 1)
    }
    spin() {
        let { position0: [x0, y0] } = this.cubei
        const { matrix, length: len } = this.cubei
        const { width, height } = this.size
        const xIsVoid = x0 < 0 || x0 > width - len
        const yIsVoid = y0 < 0 || y0 > height
        console.log('🙂', xIsVoid, yIsVoid, x0, y0)
        if (xIsVoid) {
            while (1) {
                x0 = this.cubei.position0[0]     // 重新获取 x0
                if (x0 > width - len) this.left()
                else if (x0 < 0) this.right()
                else break;
            }
        }
        if (yIsVoid) {
            return;
        }
        const newBoard = new Array(this.cube.length).fill(0)
        const newMatrix = structuredClone(matrix).map(r => r.map(() => 0))
        for (let j in matrix) {
            for (let i in matrix[j]) {
                i = +i, j = +j
                const v = matrix[j][i]
                if (v) {
                    newMatrix[i][len - j - 1] = v
                    const x = (len - j - 1) + x0, y = (i) + y0
                    const row = this.getRow([x])
                    newBoard[y] += +`0b${row.join('')}`
                }
            }
        }
        this.cubei.matrix = newMatrix
        this.cube = newBoard
    }
    down() {
        const b = this.cube
        const i = b.findLastIndex(Boolean)
        if (i === -1) {
            return;
        }
        if (i === b.length - 1 || this.isVoid(b[i], this.board[i + 1])) {
            console.log('😇', i)
            return true;
        }
        this.cubei.position0[1]++
        this.cube = [0, ...b.slice(0, -1)]
    }
    straightDown() {
        const b = this.cube
        const d = this.board
        const i = b.findLastIndex(Boolean)
        const j = d.find(Boolean) ? d.findIndex(Boolean) : d.length - 1
        if (i === -1) {
            return;
        }
        let times
        if (this.isVoid(b[i], d[j])) {
            times = j - i - 1
        } else {
            times = j - i
        }
        for (let i = 0; i < times; i++) {
            this.down()
        }
    }

    cubeInit() {
        const { width, height } = this.size
        this.cubes = [
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


        this.cubes.forEach((cube, index) => {
            const length = cube.matrix.length
            const left = Math.floor((width - length) / 2)
            const moveBoard = Array(height + length).fill()
            moveBoard.forEach((_, i) => moveBoard[i] =
                this.getRow(
                    cube.matrix[i]?.map((m, n) => m * (n + left)).filter(Boolean)
                )
            )
            cube.index = index
            cube.length = length
            cube.position0 = [left, 0]
            cube.t_board = moveBoard
            cube.board = this.m2a(moveBoard)
        })
    }

    createCube() {
        const index = Math.floor(Math.random() * this.cubes.length)
        const color = Math.floor(Math.random() * 5) + 2
        this.cubei = { color, ...this.cubes[index] }
        this.cube = structuredClone(this.cubei.board)
    }

    next() {
        // 落到合适位置进行堆砌
        this.stack()
        // 查找满行并消去
        for (const i in this.board) {
            const e = this.board[i]
            if (e === 2 ** this.size.width - 1) {
                this.eliminate(i)
            }
        }

        this.createCube()
        this.board = this.board.slice(-this.cube.length)
    }

    eliminate(i) {
        const board = structuredClone(this.board)
        board.splice(i, 1)
        board.unshift(0)
        this.board = board
    }

    stack() {
        const b = this.cube
        for (const i in b) {
            const row = b[i];
            if (row) {
                this.board[i] += row
                b[i] = 0
            }
        }
    }

    get t_board() {
        return this.a2m(this.board)
    }
    get t_cube() {
        return this.a2m(this.cube, this.cubei.color)
    }
    get renderBoard() {
        const all = this.t_board.map((r, i) => r.map((c, j) => this.t_cube[i][j] + c))
        return {
            all,
            head: all.slice(0, this.cubei.length),
            body: all.slice(-this.size.height)
        }
    }
}
