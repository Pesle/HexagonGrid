let points = [];

let centreX = 0;
let centreY = 0;
let probability = 0.3;

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
  stroke(255);
  strokeWeight(10); // Thicker
  point(centreX, centreY);
  
}


function generateMap(){
  xSpace = 20; 
  ySpace = 50;
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
    
    if(centreX == 0){
      if(x+20 > windowWidth/2 && x-20 < windowWidth/2){
        centreX = x;
      }
    }

    //Add points
    cY = 0;
    for(let y = start; y < windowHeight; y+=ySpace){
      
      if(centreX != 0 && centreY == 0){
        if(y+20 > windowHeight/2 && y-20 < windowHeight/2){
          centreY = y;
          console.log(centreX+","+centreY);
        }
      }

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
        points[x][y].addN1(points[x-1][y]);
        c++;
      }
      
      //Join downward lines every second and third row
      if(offset > 1){
        if(y > 0 && x > 0 && points[x-1][y-1] != undefined){
          
          //Join downward left
          points[x][y].addN2(points[x-1][y-1]);
          c++;
          
          //Join downward right
          if(x+2 < points.length){
            points[x+1][y].addN3(points[x+2][y-1]);
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
    this.n1 = null;
    this.n2 = null;
    this.n3 = null;
  }
  
  //Add Neighbours
  //Ensure the centre node is connected on all
  addN1(n1){
    if(n1.x == centreX && n1.y == centreY || this.x == centreX && this.y == centreY){
      this.n1 = n1;
    }else{
      this.n1 = (random(1) > probability ? n1 : null);
    }
  }
  addN2(n2){
    if(this.x == centreX && this.y == centreY){
      this.n2 = n2;
    }else{
      this.n2 = (random(1) > probability ? n2 : null);
    }
  }
  addN3(n3){
    this.n3 = (random(1) > probability ? n3 : null);
  }

  display(){
    stroke(100);
    point(this.x, this.y);
    stroke(160);
    strokeWeight(4); // Thicker
    if(this.n1 != null){
      line(this.x, this.y, this.n1.x, this.n1.y);
    }
    if(this.n2 != null){
      line(this.x, this.y, this.n2.x, this.n2.y);
    }
    if(this.n3 != null){
      line(this.x, this.y, this.n3.x, this.n3.y);
    }
  }
}