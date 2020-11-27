/**
 * สร้าง Array 2 มิติ 
 *
 * @param form เก็บต่า row col
 * @param random เอาไว้สุ่มค่า
 * @returns {[]}
 */
function initMaze(form, random = false) {
  let maze = []
   // generation line
  for (let i = 1; i <= form.row; i++) {
    let row = []
    for (let j = 1; j <= form.col; j++) {
      // สร้างตัวสุ่มสิ่งกีดขวาง
      // เดินช่องแรก และ ท้าย วางสิ่งกีดจวางไม่ได้
      if ((i === 1 && i === j) || (i === form.row && j === form.col)) {
        row.push(0)
      } else {
        row.push(random ? Math.random() * 1000 > 750 ? 1 : 0 : 0)
      }
    }

    maze.push(row)
  }
  return maze
}

/**
 *Draw a visual map on a known map according to the calculated path
 *
 *@ param basemaze two-dimensional array, containing the map data of obstacles
 *Walking route given by @ param ruleway
 * @returns {{maze: *, ruleWay: *}}
 */
function redisplay(baseMaze, ruleWay = []) {
 //Simple data execution value copy 
  let maze = JSON.parse(JSON.stringify(baseMaze))

  for (let index = 0; index < ruleWay.length; index++) {
    //Next position in path
    const nextIndex = index + 1

    //X coordinate on the map
    const row = ruleWay[index][0]
    //Y coordinate on the map
    const col = ruleWay[index][1]

    //Judge whether the last step still exists
    if (nextIndex !== ruleWay.length) {
      //Right and left ordinates will not change
      if (ruleWay[index][0] === ruleWay[nextIndex][0]) {
        // right
        if (ruleWay[index][1] + 1 === ruleWay[nextIndex][1]) {
          maze[row][col] = 3
        }
        // left
        else {
          maze[row][col] = 5
        }

      } else {
        // down
        if (ruleWay[index][0] + 1 === ruleWay[nextIndex][0]) {
          maze[row][col] = 4
        }
        // up
        else {
          maze[row][col] = 6
        }
      }
    }
  }

  // return to a modified map and path
  return {maze, ruleWay}
}

/**
 *
 *@ param maze map
 *@ param route recursive path
 *Number of @ param routecount paths
 *@ param bestroute
 * @returns {{bestRoute: *, routeCount: *}}
 */

function go(maze = [[]], route = [[]], routeCount = 0, bestRoute = []) {
  let location = route[route.length - 1]

  //If not, return directly  ถ้าหากไม่ใช้ค่าของ Locationให้รีเทริน RouteCountกลับ
  if (!location) {
    return routeCount
  }

  const row = location[0]
  const col = location[1]

  //To the right, the first one does not cross the boundary, the second one can still be to the right, and the third one is feasible on the map
  //โดยกระบวนการจะเริ่มเดินจากทางขวาก่อน 1.การเดินจะไม่มีการเดินข้ามกล่องกัน 2.ยังสามารถที่จะเดินไปทางขวาได้อยู่มั้ย 3.จากตัวmazeการเดินครั้งต่อไปใช่ตัวสุดท้ายหรือไม่
  if (col + 1 !== maze[row].length && maze[row][col + 1] === 0) {
    //Determine if the next step is the last (เป็นการกำหนดสำหรับการเดินครั้งสุดท้าย)
    if (row === maze.length - 1 && col + 1 === maze[row].length - 1) {
      //Number of channels plus 1 (จำนวนของช่องที่จะถูกบวกเพิ่มเข้าไป1)
      routeCount++//.push(baseRoute.concat([[row, col + 1]])) (จะถูก push ค่าไปไว้ที่bestRoute.concat)

       //The current shortest path is empty or the length is greater than the current calculated path, that is, the optimal path is saved
      //เป็นการเช็คว่า pathที่สั้นที่สุดในปัจจุบันยังคงมีอยู่มั้ยหรือว่ามันเป็นเส้นทางที่ดีกว่าpathก่อนที่ถูกคำณวนไว้ ซึ่งถ้าดีกว่าก็จะถูก path ใหม่แทนที่
      if (bestRoute.length === 0 || bestRoute.length > route.length + 1) {
        bestRoute = route.concat([[row, col + 1]])
      }
    }   
    else {
      //Block the current location of the map (อัพเดตค่าบล็อคของmazeปัจจุบัน)
      maze[row][col] = 3
      
      //Put the next step in the stack and continue walking (มูฟไปบล็อคต่อไปเพื่อทำการคำณวนเส้นทางในการเดินต่อ)
       
      route.push([row, col + 1])

      let result = go(maze, route, routeCount, bestRoute)
      routeCount = result.routeCount
      bestRoute = result.bestRoute
    }
  }

  // down 
  if (row + 1 !== maze.length && maze[row + 1][col] === 0) {
    //Determine if the next step is the last (เป็นการกำหนดสำหรับการเดินครั้งสุดท้าย)
    if (row + 1 === maze.length - 1 && col === maze[row].length - 1) {
      //Number of channels plus 1 (จำนวนของช่องที่จะถูกบวกเพิ่มเข้าไป1) 
      routeCount++ //.push(baseRoute.concat([[row + 1, col]])) (จะถูก push ค่าไปไว้ที่bestRoute.concat)

      //The current shortest path is empty or the length is greater than the current calculated path, that is, the optimal path is saved
      //เป็นการเช็คว่า pathที่สั้นที่สุดในปัจจุบันยังคงมีอยู่มั้ยหรือว่ามันเป็นเส้นทางที่ดีกว่าpathก่อนที่ถูกคำณวนไว้ ซึ่งถ้าดีกว่าก็จะถูก path ใหม่แทนที่
      if (bestRoute.length === 0 || bestRoute.length > route.length + 1) {
        bestRoute = route.concat([[row + 1, col]])
      }
    }            
    //Not the next step (เงื่อนไขนี้ไม่ใช่บล็อคต่อไป) 
      //Block the current location of the map (ใส่ค่าสำหรับบล็อคปัจจุบัน) 
      else {
      maze[row][col] = 4

      //Put the next step in the stack and continue walking (+1เพิ่มใน Stack เพื่อมูฟไปยังบล็อคต่อไป)
      route.push([row + 1, col])

      let result = go(maze, route, routeCount, bestRoute)
      routeCount = result.routeCount
      bestRoute = result.bestRoute 
    }
  }

  // left
  if (col - 1 !== -1 && maze[row][col - 1] === 0) {
    //Block the current location of the map (ใส่ค่าสำหรับบล็อคปัจจุบัน)
    maze[row][col] = 5

    //In the current maze, it's impossible to walk left or up. It's the exit (เคอเร้นบล็อคกับทางปัจจุบันไม่มีทางที่จะเดินไปทางซ้ายแล้วถึงเส้นชัยได้)
    //So there's no need to judge if the next step is an exit  (ไม่จำเป็นต้องเช็คเงื่อนไขสำหรับการหาทางออก)
    //Put the next step in the stack and continue walking  (เป็นการเดินถอยหลังเพื่อที่จะคำณวนสำหรับการเดินต่อไป)
    route.push([row, col - 1])

    let result = go(maze, route, routeCount, bestRoute)
    routeCount = result.routeCount
    bestRoute = result.bestRoute
  }

  // upward
  if (row - 1 !== -1 && maze[row - 1][col] === 0) {
    //Block the current location of the map   บล็อคปัจจุับนที่จะถูกเพิ่มค่าเข้าไป
    maze[row][col] = 6

    route.push([row - 1, col])

    let result = go(maze, route, routeCount, bestRoute)
    routeCount = result.routeCount
    bestRoute = result.bestRoute
  }

  route.pop()

  //Release current location  (การกำหนดสำหรับReleaseการทำงานwayใหม่ )
  maze[row][col] = 0

  return {routeCount, bestRoute}
}

/**
 * @param baseMaze
 * @param baseRoute
 * @returns {{bestRoute: *, routeCount: *}}
 */
function findAllRoutes(baseMaze, baseRoute = [[0, 0]]) {
  //This method changes mazes and basic routes 
  //Deep copy required
  //Simple data execution value copy
  let {maze} = redisplay(baseMaze, baseRoute)

  return go(maze, baseRoute, 0, [])
}

export {
  initMaze,
  findAllRoutes,
  redisplay
}
