<template>
  <div id="app">

    <div class="main">
      <h1> AI - Depth first search algholithm </h1>
      <header class="maze-header">
        <h2>MazeProblem แก้ปัญหาเขาวงกต ด้วย Depth first search  </h2>
      </header><div class="maze-attr">
        <el-form :inline="true" size="mini">
          <el-form-item label="number of lines">
            <el-input-number
              v-model="form.row"
              :min="limit.min"
              :max="limit.max"
              @blur="inputBlur"
              @change="generateMap"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="number of colum">
            <el-input-number
              v-model="form.col"
              :min="limit.min"
              :max="limit.max"
              @blur="inputBlur"
              @change="generateMap"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button @click="generateMap">RESET</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="calculate">START</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="autoObstacle">Random</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="maze-body">
        <div
          class="maze-row"
          v-for="i of form.row"
          :key="`row${i}`">
          <div
            class="maze-step"
            v-for="j of form.col"
            :class="mazeStyle[displayMaze[i-1][j-1]]"
            :key="`col${j}`"
            @click="changeStatus(i,j)"
          ></div>
        </div>
      </div>
      <footer class="maze-result">
        <br/>
        <card><h5>There are {{result.routeCount}}ways out of the current maze. The figure shows one of the best solutions</h5></card></footer>
    </div>
  </div>
</template>

<script>
  import {initMaze, redisplay, findAllRoutes} from '@/utils'

  /**
   * Rule = 0.) ผ่านได้ 1.) สิ่งกีดขวาง 2.) ผ่านไม่ได้ทางตัน 3.) ขวา 4.) ล่าง 5.) ซ้าย 6.) บน
   */
  export default {
    // --------------------------------------------------------------------------------------------------------------------------
    data() {

      // format data ที่รับมจาก ui 
      
      return {
        form: {
          row: 4,
          col: 4
        },
        //Form restrictions
        limit: {
          min: 2,
          max: 10
        },
         // maze
        maze: [],
        displayMaze: [],
        mazeStyle: [
          '',
          'obstacle',
          '',
          'go-right',
          'go-down',
          'go-left',
          'go-up'
        ],
        //Has it been calculated
        //It has been calculated that when arranging obstacles, depth traversal is required
        calculated: false,
        //Calculated route summary
        result: {routeCount: 0, bestRoute: []}
      }
    },
    watch: {
      maze(val) {
        this.displayMaze = val
      }
    },
    // FUNCTION ONCLICK
    created() {
      this.generateMap()
      this.displayMaze = this.maze
    },
    methods: {
      //Input box loses focus
      inputBlur() {
        //After deletion, the component will not be assigned a default value, which is manually assign
        if (!this.form.row) {
          this.form.row = 5
        } else if (!this.form.col) {
          this.form.col = 5
        }
      },
      //Generate map
      generateMap() {
        this.maze = initMaze(this.form)
      },
      //Dysgenesis
      autoObstacle() {
        this.maze = initMaze(this.form, true)
      },
      // calculation
      calculate() {
        //Settings calculated
        this.calculated = true
        this.result = findAllRoutes(this.maze)

        if (this.result.routeCount === 0) {
          this.$message.error('no way to pass')
        } else {
          this.displayMaze = redisplay(this.maze, this.result.bestRoute).maze
        }
      },
      //Remove or add obstacles at the current location
      changeStatus(i, j) {
        //Exit if first or last
        if ((i === 1 && i === j) || (i === this.form.row && j === this.form.col))
          return

        //Set barriers
        this.maze[i - 1][j - 1] = this.maze[i - 1][j - 1] ? 0 : 1

        //Reset the map
        if (this.calculated) {
          this.calculated = false
          this.maze = this.maze.map(row => row.map(col => col !== 1 ? 0 : 1))
        } else {
          //Simply reshape maze
          this.maze = this.maze.filter(() => true)
        }
      }
    }
  }
</script>

<style lang="scss">
  //Small square border
  $step-border: 1px solid;

  #app {
    display: flex;
    justify-content: center;
  }

  // obstacle
  .obstacle {
    background-image: url("./assets/images/obstacle.png");
  }

  // left.
  .go-left {
    background-image: url("./assets/images/left.png");
  }
  // right
  .go-right {
    background-image: url("./assets/images/right.png");
  }
  // upward
  .go-up {
    background-image: url("./assets/images/up.png");
  }
 // down
  .go-down {
    background-image: url("./assets/images/down.png");
  }

  .main {
    width: flex;

    .maze-header {
      padding: 18px 0;

      h2 {
        display: inline-block;
      }
    }

    .maze-body {
      width: 100%;
      height: 600px;
      padding: 15px;
      margin-bottom: 15px;
      box-sizing: border-box;
      border: 1px solid #cfcfcf;
      display: flex;
      //Let each row be arranged vertically
      flex-direction: column;

      .maze-row {
        //Longitudinal average distribution
        flex: 1;
        //Set yourself up as a flexible container
        display: flex;

        .maze-step {
          cursor: pointer;
          //Horizontal average distribution
          flex: 1;
          //The disease of using div
          display: inline-block;
          box-sizing: border-box;
          background: {
            size: 60%;
            repeat: no-repeat;
            position: center center;
          }

           //So the upper left border is set for the small grid
          border: {
            top: $step-border;
            left: $step-border;
          }

           //Set the right border at the end of each line
          &:last-of-type {
            border: {
              right: $step-border;
            }
          }
        }

        //First row first
        &:first-of-type {
          .maze-step:first-of-type {
            background-image: url("./assets/images/start.png");
          }
        }

        //In the last column, the bottom border is set for each cell
        &:last-of-type {
          .maze-step {
            border-bottom: $step-border;

            &:last-of-type {
              background-image: url("./assets/images/end.png");
            }
          }
        }
      }
    }
  }
</style>
