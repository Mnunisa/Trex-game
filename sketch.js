var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;
var obstacle,Obstacle1,Obstacle2,Obstacle3,Obstacle4,Obstacle5,Obstacle6,obstaclegroup;
var score;
var newImage,gameoverimage,restartimage,gameover,restart;
var diesound,checkpoints,jumpsound;
var PLAY =1;
var END = 0;
var gamestate = PLAY;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  Obstacle1= loadImage("obstacle1.png");
  Obstacle2= loadImage("obstacle2.png");
  Obstacle3= loadImage("obstacle3.png");
  Obstacle4= loadImage("obstacle4.png");
  Obstacle5= loadImage("obstacle5.png");
  Obstacle6= loadImage("obstacle6.png");
 
  gameoverimage= loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  
  diesound = loadSound("die.mp3");
  checkpoints = loadSound("checkPoint.mp3");
  jumpsound = loadSound("jump.mp3");
 
}

function setup() {
  createCanvas(600, 200);
 
  localStorage["highestscore"]=0;
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  // trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
   gameover= createSprite(300,100,50,50);
    gameover.scale=0.75;
    restart = createSprite(300,150,50,50);
    restart.scale=0.5;
    gameover.addImage(gameoverimage);
    restart.addImage(restartimage);
    
  //creating groups
  cloudsGroup= new Group();
  obstaclegroup = new Group();
 // console.log("Hello"+ 5)
  score= 0;
  //to check the radius of the trex
  trex.debug=false;
  //to change the radius of the trex
  trex.setCollider("rectangle",0,0,100,100);
  
  //var a = " hello";
  
}

function draw() {
  background("yellow");
  //console.log(a);
  
  fill("black");
  textSize(15);
  text("SCORE: "+score,500,20);
  trex.collide(invisibleGround);
  if (gamestate===PLAY){
    restart.visible= false;
    gameover.visible = false;
  
    ground.velocityX = -(4+3*(score/100));
    
    //to give score as the number of frames are created
    score = score+ Math.round(frameRate()/30);
    
    if(localStorage["highestscore"]<score) {
     localStorage["highestscore"]=score;
  }
  console.log(localStorage["highestscore"]);
    //to make the ground seem endless
    if (ground.x < 0){
    ground.x = ground.width/2;
    }
    
    //to make the trex jump
    if(keyDown("space")&& trex.y >= 160) {
    trex.velocityY = -10;
     jumpsound.play() ;
  }
    //to make the trex get back to the ground after jumping
    trex.velocityY = trex.velocityY + 0.6;
    
    //spawn the clouds
    spawnClouds();
    //create the obstacles
    createobs();
    
    if(score>0 && score%100===0){
      checkpoints.play();
      
    }
    
    if(trex.isTouching(obstaclegroup)){
     // trex.velocityY=-6;
      //jumpsound.play()
     gamestate=END;
     diesound.play();
    }
  }
  
  else if(gamestate===END) {
    gameover.visible= true;
    restart.visible= true;
    if(mousePressedOver(restart)){
    reset();
  }
    
    ground.velocityX=0;
    cloudsGroup.setVelocityXEach(0);
    obstaclegroup.setVelocityXEach(0);
    
    trex.addAnimation("collided",trex_collided);
    cloudsGroup.setLifetimeEach(-1);
    obstaclegroup.setLifetimeEach(-1);
    trex.velocityY=0;
    
    
    
  }
  //console.log(frameRate());   
  //console.log(trex.y);
  //console.log("This is",gamestate);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10,120));
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    // adding the cloud in the group 
    cloudsGroup.add(cloud);
    
    //assigning lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    }
}

function createobs(){
     
    if (frameCount%90===0){
     obstacle = createSprite(580,162,10,30);
     obstacle.velocityX=-(4+score/100);
     var rand  = Math.round(random(1,6));
      switch(rand){
        case 1:obstacle.addImage(Obstacle1);
        break;
        case 2:obstacle.addImage(Obstacle2);
        break;
        case 3:obstacle.addImage(Obstacle3);
        break;
        case 4:obstacle.addImage(Obstacle4);
        break;
        case 5:obstacle.addImage(Obstacle5);
        break;
        case 6:obstacle.addImage(Obstacle6);
        break;
      }
      //to adding the obstacle in a group 
      obstaclegroup.add(obstacle);
      obstacle.scale=0.475;
      obstacle.lifetime=150;
     }  
}
 
function reset(){
    gamestate= PLAY;
    gameover.visible=false;
    restart.visible= false;
    obstaclegroup.destroyEach();
    cloudsGroup.destroyEach();
    score = 0;
}






