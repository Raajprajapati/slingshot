var {Engine ,Render, Runner,Events, Bodies, World, Mouse,MouseConstraint,Constraint,Composites} = Matter
// set the matter engine
var engine = Engine.create();
// setting up the canvas
var render = Render.create({
  element: document.querySelector('.canvas'),
  engine: engine,
  options: {
    wireframes: false,
    hasBounds:true,
    width:900,
    height:600
  }
});

// creates a platform for the stack
var platform =  Bodies.rectangle(140, 400, 200, 20, { isStatic: true });

// creates a stack of rectangles
var stack = Composites.stack(50, 200, 6, 6, 0.5, 0.5, function(x, y) {
  return (Bodies.rectangle(x, y, 30, 30))
});
// intial ball
var ball = Bodies.circle(100,100 ,20)
ball.mass = 5

// setting options for the constraint of the ball
var conOptions = {
  bodyB :ball,
  pointA :{ x: 550, y:400 },
  length:30,
  stiffness : 0.7
}
// creating a constraint for the ball
var constraint = Constraint.create(conOptions)

// creates a mouse object linked to the canvas
var mouse = Mouse.create(render.canvas)
render.mouse = mouse
var options = {
  mouse: mouse,
  constraint: {
    stiffness: 0.5,
    render: {
      visible: false // set the mouse interactions 
    }
  }
}
var mouseConstraint = MouseConstraint.create(engine, options);

// function for creating a new ball after 1.5 seconds of launching the ball
function newBall(){
  setTimeout(()=>{
    World.remove(engine.world,constraint.bodyB)
    var newBall = Bodies.circle(100,100 ,20 );
    newBall.mass = 5
    constraint.pointA = { x: 550, y:380 };
    constraint.bodyB = newBall;
    World.add(engine.world, newBall);

  },1500)
  
}
// handling the launching event 
Events.on(mouseConstraint, 'enddrag', function() {
  if(Math.abs(mouse.position.x-550) > 100 || Math.abs(mouse.position.y - 380) > 100){
    setTimeout(()=>{
		constraint.pointA = null
    },10)
    newBall()
  }

});
//  adding all the items to the world
World.add(engine.world, [stack,mouseConstraint,ball,constraint,platform]);
Runner.run(engine); // running the matter engine
Render.run(render); // rendering the canvas

