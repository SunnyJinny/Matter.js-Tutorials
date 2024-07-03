// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Events = Matter.Events,
  World = Matter.World,
  Body = Matter.Body,
  Bodies = Matter.Bodies,
  Composites = Matter.Composites,
  Common = Matter.Common,
  Svg = Matter.Svg,
  Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 800,
    background: "transparent",
    wireframes: false,
    showVelocity: true,
  },
});

// run the renderer
Render.run(render);

var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
var ground = Bodies.rectangle(400, 810, 1000, 60, {
  isStatic: true,
  friction: 0, // 마찰력
  angle: Math.PI * 0.001,
  render: { fillStyle: "#060a19" },
});
var vertexSets = [],
  color = Common.choose(["#FF6B6B", "#4ECDC4", "#C44D58"]);

$("#svg")
  .find("path")
  .each(function (i, path) {
    let v = Bodies.fromVertices(
      100 + i * 80,
      600,
      Svg.pathToVertices(path, 20),
      {
        friction: 0, // 마찰력
        frictionAir: 0,
        inertia: "Infinity", // 관성  "Infinity"
        render: {
          fillStyle: color,
          strokeStyle: color,
          lineWidth: 1,
        },
      },
      true
    );
    console.log(v);
    vertexSets.push(v);
    // World.add(engine.world, v);
  });
vertexSets.push(ground);

Events.on(runner, "tick", (e) => {
  vertexSets.forEach((v) => {
    const force = {
      x: 0.05, // 이 값을 바꾸면 미끄러지는 속도를 바꿀수 있다.
      y: 0,
    };
    Body.applyForce(v, { x: 400, y: 810 }, force);
  });
});
// render.canvas.addEventListener("click", function () {
//   vertexSets.forEach((v) => {
//     const force = {
//       x: 10, // 이 값을 바꾸면 미끄러지는 속도를 바꿀수 있다.
//       y: 0,
//     };
//     Body.applyForce(v, { x: 400, y: 810 }, force);
//   });
// });

// add all of the bodies to the world
World.add(engine.world, vertexSets);
