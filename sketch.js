let points = [];
let players = [];

let playerCount = 1;
let probability = 0.4;

let cX = 0;
let cY = 0;

let changeRate = 2;

let count = 202;
let reshuffle = 200;

let mobile = false;

function setup() {
  frameRate(20);
  //GENERATE AND DISPLAY MAP
  createCanvas(windowWidth, windowHeight);
  generateMap();

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    mobile = true;
    console.log("mobile");
  }
}

function draw() {
  // image(pg, 0, 0);
  background(0);
  for(let x = 0; x < points.length; x++){
    for(let y = 0; y < points[x].length; y++){
      points[x][y].display();
    }
  }
  if(count == 301 && mobile == true){
    noLoop();
  }

  if(count > reshuffle){
    console.log("reshuffle");
    for(let x = 0; x < points.length; x++){
      for(let y = 0; y < points[x].length; y++){
         points[x][y].shuffle();
      }
    }
    count = 0;
  }

  count++;

  // for(let i = 0; i < playerCount; i++){
  //   // players[i].move();
  //   // players[i].display();
  // }
  
}


function generateMap(){
  xSpace = 20; 
  ySpace = 50;
  let offset = 1;
  
  //Create grid of points
  for(let x = xSpace; x < windowWidth; x+=xSpace){
    
    points[cX] = [];
    
    //Offset every second and third row
    let start = ySpace;
    if(offset > 1){
      start = ySpace/2;
    }
    if(offset == 3){
      offset = -1;
    }
    offset++;

    //Add points
    cY = 0;
    for(let y = start; y < windowHeight; y+=ySpace){

      points[cX][cY] = new Point(x, y);
      cY++;
    }
    
    cX++;
  }
  
  //Join points as grid
  let c = 0;
  offset1 = 1;
  offset2 = 1;
  for(let x = 0; x < points.length; x++){
    
    if(offset1 == 3){
      offset1 = -1;
    }
    offset1++;

    for(let y = 0; y < points[x].length; y++){
      
      
      if(x > 0){
        //Join top rows
        if(offset1 == 2 || offset1 == 0){
          points[x][y].addN1(points[x-1][y]);

        //Join top lefts
        }else if(offset1 == 3){
          points[x][y].addN2(points[x-1][y]);

        //Join top rights
        }else{
          points[x][y].addN3(points[x-1][y]);
        }
        
        c++;
      }
      
      //Join downward lines every second and third row
      if(offset2 > 1){
        if(y > 0 && x > 0){
          
          //Join downward left
          points[x][y].addN3(points[x-1][y-1]);
          c++;
          
          //Join downward right
          if(x+2 < points.length){
            points[x+1][y].addN2(points[x+2][y-1]);
            c++;
          }
        }
      }
      if(offset2 == 3){
        offset2 = -1;
      }
    }
    offset2++;
  }
}

// class Player {
//   constructor(color, start){
//     this.color = color;
//     this.position = start;
//     this.lastRandom = 1;
//   }

//   move(){
    
//     let newPosition = null;
//     let move = int(random(3));
    
//     //Reshuffle
//     if(move == this.lastRandom)
//       int(random(3));

//     if(move == 0 && this.position.n1 != null){
//       console.log(this.position.n1);
//       newPosition = this.position.n1;
//     }else if(move == 1 && this.position.n2 != null){
//       console.log(this.position.n2);
//       newPosition = this.position.n2;
//     }else if(this.position.n3 != null){
//       console.log(this.position.n3);
//       newPosition = this.position.n3;
//     }
//     if(newPosition != null){
//       this.lastRandom = move;
//       this.position = newPosition;
//     }
//   }

//   display(){
//     stroke(this.color);
//     strokeWeight(15); // Thicker
//     point(this.position.x, this.position.y);
//   }

// }

class Point {
  constructor(x, y){
    this.x = x;
    this.y = y;

    this.n1Positive = true;
    this.n1 = null;
    this.n1Display = false;
    this.n1Angle = 0;

    this.n2Positive = true;
    this.n2 = null;
    this.n2Display = false;
    this.n2Angle = 0;

    this.n3Positive = true;
    this.n3 = null;
    this.n3Display = false;
    this.n3Angle = 0;
  }
  
  //Add Neighbours
  //Ensure the centre node is connected on all
  addN1(n1){
    this.n1 =  n1;
  }
  addN2(n2){
    this.n2 =  n2;
  }
  addN3(n3){
    this.n3 =  n3;
  }

  shuffle(){
    let newN1 = (random(1) > probability ? true : false);
    let newN2 = (random(1) > probability ? true : false);
    let newN3 = (random(1) > probability ? true : false);

    if(this.n1Display != newN1){
      if(newN1 == false){
        this.n1Positive = false;
      }else{
        this.n1Angle = 1;
        this.n1Positive = true;
      }
      this.n1Display = newN1;
    }

    if(this.n2Display != newN2){
      if(newN2 == false){
        this.n2Positive = false;
      }else{
        this.n2Angle = 1;
        this.n2Positive = true;
      }
      this.n2Display = newN2;
    }

    if(this.n3Display != newN3){
      if(newN3 == false){
        this.n3Positive = false;
      }else{
        this.n3Angle = 1;
        this.n3Positive = true;
      }
      this.n3Display = newN3;
    }
  }

  display(){
    stroke(150);
    point(this.x, this.y);
    
    strokeWeight(4); // Thicker
    if(this.n1Angle > 0 && this.n1 != null){
      stroke(150);
      let tempX = map(this.n1Angle, 0, 100, this.x, this.n1.x, 1);
      let tempY = map(this.n1Angle, 0, 100, this.y, this.n1.y, 1);
      if(this.n1Positive && this.n1Angle < 150)
        this.n1Angle += changeRate;
      else if(this.n1Positive == false){
        this.n1Angle -= changeRate;
      }
      line(this.x, this.y, tempX, tempY);
    }

    if(this.n2Angle > 0 && this.n2 != null){
      stroke(150);
      let tempX = map(this.n2Angle, 0, 100, this.x, this.n2.x, 1);
      let tempY = map(this.n2Angle, 0, 100, this.y, this.n2.y, 1);
      if(this.n2Positive && this.n2Angle < 150)
        this.n2Angle += changeRate;
      else if(this.n2Positive == false){
        this.n2Angle -= changeRate;
      }
      line(this.x, this.y, tempX, tempY);
    }
    if(this.n3Angle > 0 && this.n3 != null){
      stroke(150);
      let tempX = map(this.n3Angle, 0, 100, this.x, this.n3.x, 1);
      let tempY = map(this.n3Angle, 0, 100, this.y, this.n3.y, 1);
      if(this.n3Positive && this.n3Angle < 150)
        this.n3Angle += changeRate;
      else if(this.n3Positive == false){
        this.n3Angle -= changeRate;
      }
      line(this.x, this.y, tempX, tempY);
    }
  }
}