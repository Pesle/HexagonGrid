let points = [];

let probability = 0.4;

let cX = 0;
let cY = 0;

let changeRate = 2;

let count = 202;
let reshuffle = 200;

let mobile = false;

let pg;

function setup() {

  //Check if browser is on mobile
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    mobile = true;
    console.log("mobile");
  }

  frameRate(20);
  
  createCanvas(windowWidth, windowHeight);

  //Create graphics for points of hexagons for better performance
  pg = createGraphics(windowWidth, windowHeight);
  
  //Set graphics for points
  pg.background(0);
  pg.stroke(color('#267F00'));
  if(mobile)
    pg.strokeWeight(4); // Thinner
  else
    pg.strokeWeight(6); // Thicker

  //GENERATE AND DISPLAY MAP
  generateMap();


  //Set graphics for grid
  stroke(color('#267F00'));
  if(mobile)
    strokeWeight(4); // Thinner
  else
    strokeWeight(6); // Thicker
    
}

function draw() {
  //Render display and draw lines
  image(pg, 0, 0);
  for(let x = 0; x < points.length; x++){
    for(let y = 0; y < points[x].length; y++){
      points[x][y].display();
    }
  }
  
  //Do not reshuffle if on mobile
  if(count == 201 && mobile == true){
    noLoop();
    count = 0;
  }

  //Shuffle all lines every couple of seconds
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
  
}


function generateMap(){
  //Dense grid for mobile, bigger for pc
  if(mobile){
    xSpace = 20; 
    ySpace = 50;
  }else{ 
    xSpace = 28; 
    ySpace = 70;
  }
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
      pg.point(x, y);
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

class Point {
  constructor(x, y){
    this.x = x;
    this.y = y;

    this.n1 = null;
    this.n2 = null;
    this.n3 = null;

  }
  
  //Add Neighbours
  addN1(n1){
    this.n1 = new Line(n1);
  }
  addN2(n2){
    this.n2 =  new Line(n2);
  }
  addN3(n3){
    this.n3 =  new Line(n3);
  }

  //Shuffle all lines
  shuffle(){

    //Generate one new random number to shuffle the lines
    let value = random(1);
    let upperValue = value+probability;
    let lowerValue = value-probability;

    if(this.n1 != null)
      this.n1.shuffle(upperValue, lowerValue);
    if(this.n2 != null)
      this.n2.shuffle(upperValue, lowerValue);
    if(this.n3 != null)
      this.n3.shuffle(upperValue, lowerValue);
  }

  //Display points and lines
  display(){
    if(this.n1 != null)
      this.n1.display(this.x, this.y);
    if(this.n2 != null)
      this.n2.display(this.x, this.y);
    if(this.n3 != null)
      this.n3.display(this.x, this.y);
  }
}


class Line{
  constructor(vector){
    this.v = vector;
    this.positive = true;
    this.visible = false;
    this.length = 0;

    //Assign a random value during setup
    this.value = random(1);
  }

  shuffle(upperValue, lowerValue){

    //Compare stored random to new random
    let rand = (this.value < upperValue && this.value > lowerValue ? true : false);

    //Check whether to shrink or grow line
    if(this.visible != rand){
      if(rand == false){
        this.positive = false;
      }else{
        this.length = 1;
        this.positive = true;
      }
      this.visible = rand;
    }
  }

  display(x, y){
    //If length is longer than 1, display lines
    if(this.length > 0 && this.v != null){

      //Calculate length of line based on start, end and line length
      let tempX = map(this.length, 0, 100, x, this.v.x, 1);
      let tempY = map(this.length, 0, 100, y, this.v.y, 1);

      //Grow if positive and not already fully grown
      if(this.positive && this.length < 130)
        this.length += changeRate;

      //Shrink if meant to be hidden
      else if(this.positive == false){
        this.length -= changeRate;
      }
      line(x, y, tempX, tempY);
    }
  }

}