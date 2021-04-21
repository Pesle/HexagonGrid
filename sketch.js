let points = [];
let lines = [];
let space;
let centreX;
let centreY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateMap();
}

function draw() {
  background(0);
  for(let x = 0; x < points.length; x++){
    for(let y = 0; y < points[x].length; y++){
      points[x][y].display();
    }
  }
  for(let x = 0; x < lines.length; x++){
    lines[x].display();
  }
}


function generateMap(){
  xSpace = 20; 
  ySpace = 50;
  probability = 0.1;
  let offset = 1;
  
  let cX = 0;
  let cY = 0;
  
  
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
  offset = 1;
  for(let x = 0; x < points.length; x++){
    
    for(let y = 0; y < points[x].length; y++){
      
      //Join top rows
      if(x > 0 && points[x-1][y] != undefined){
        lines[c] = new Line(points[x][y], points[x-1][y]);
        c++;
      }
      
      //Join downward lines every second and third row
      if(offset > 1){
        if(y > 0 && x > 0 && points[x-1][y-1] != undefined){
          
          //Join downward left
          lines[c] = new Line(points[x][y], points[x-1][y-1]);
          c++;
          
          //Join downward right
          if(x+2 < points.length){
            lines[c] = new Line(points[x+1][y], points[x+2][y-1]);
            c++;
          }
        }
      }
      if(offset == 3){
        offset = -1;
      }
    }
    offset++;
  }
}

class Point {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  
  display(){
    stroke(100);
    point(this.x, this.y);
  }
}

class Line {
  constructor(point1, point2){
    this.point1 = point1;
    this.point2 = point2;
    this.path = (random(1) > 0.3 ? true : false);
  }
  
  display(){
    if(this.path){
      stroke(160);
      strokeWeight(4); // Thicker
      line(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
    }
  }
}