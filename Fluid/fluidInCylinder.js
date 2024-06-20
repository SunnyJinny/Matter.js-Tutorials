const canvas = document.querySelector("#matter-canvas");
let canvasWidth = innerWidth;
let canvasHeight = innerHeight;

// const stdDeviation = [8, 10];
// const colorMatrix = ["15 -3", "30 -5"];

let circles = [];
let glass;

const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Events = Matter.Events,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Body = Matter.Body,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Composites = Matter.Composites;

let engine = Engine.create({
    constraintIterations: 10,
    positionIterations: 10,
  }),
  world = engine.world;

let render = Render.create({
  //element: document.body,
  canvas: canvas,
  engine: engine,
  options: {
    width: canvasWidth,
    height: canvasHeight,
    wireframes: false,
    background: "transparent",
    pixelRatio: 1,
  },
});
Render.run(render);

// 러너 설정
const runner = Runner.create();
Runner.run(runner, engine);

// 액체를 circle로 만들어서 표현

function createLiquid() {
  const x = 50;
  const y = 350;
  const radius = randomNumBetween(5, 7);
  const body = Bodies.circle(x, y, radius, {
    friction: 0, // 마찰력
    frictionAir: 0, // 공기 마찰력
    density: 1, // 밀도
    restitution: 0.2, // 반발력
    render: {
      fillStyle: "#2065A5",
    },
  });
  Body.applyForce(body, body.position, { x: 1, y: 0 });
  Composite.add(world, body);
  circles.push(body);
}

// 실린더 만들어보자
function Glass() {
  const thickness = 30;
  const radius = 20;
  const wallColor = "#ff0000";
  const done = "#00000000";
  const walls = [
    Bodies.rectangle(300 - 98, 230 - 29, thickness, 180 + 30, {
      chamfer: { radius: [0, 0, radius, radius] },
      isStatic: true,
      render: { fillStyle: done },
    }),
    Bodies.rectangle(220 - 100, 320 - 25, 160 + 30, thickness, {
      chamfer: { radius: [0, 0, radius, 0] },
      isStatic: true,
      render: { fillStyle: done },
    }),
    Bodies.rectangle(140 - 100, 350 - 12, thickness, 60 + 56, {
      isStatic: true,
      render: { fillStyle: done },
    }),
    Bodies.rectangle(220 - 100, 380, 160 + 30, thickness, {
      chamfer: { radius: [0, radius, 0, 0] },
      isStatic: true,
      render: { fillStyle: done },
    }),
    Bodies.rectangle(300 - 98, 420 + 2, thickness, 80 + 30, {
      chamfer: { radius: [0, radius, 0, 0] },
      isStatic: true,
      render: { fillStyle: done },
    }),
    Bodies.rectangle(400 - 99, 460, 200 + 30, thickness, {
      isStatic: true,
      render: { fillStyle: done },
    }),
    Bodies.rectangle(500 - 90, 420 + 2, thickness, 80 + 30, {
      chamfer: { radius: [radius, 0, 0, 0] },
      isStatic: true,
      render: { fillStyle: done },
    }),
    Bodies.rectangle(580 - 90, 380, 160 + 30, thickness, {
      chamfer: { radius: [radius, 0, 0, 0] },
      isStatic: true,
      render: { fillStyle: done },
    }),
    Bodies.rectangle(580 - 90, 320 - 25, 160 + 30, thickness, {
      chamfer: { radius: [0, 0, 0, radius] },
      isStatic: true,
      render: { fillStyle: done },
    }),
    Bodies.rectangle(500 - 90, 230 - 29, thickness, 180 + 30, {
      chamfer: { radius: [0, 0, 0, radius] },
      isStatic: true,
      render: { fillStyle: done },
    }),
  ];
  Composite.add(world, walls);
}
glass = new Glass();

// // 마우스 제약 추가
// const mouse = Mouse.create(render.canvas);
// mouse = Mouse.create(canvas);

// mouseConstraint = MouseConstraint.create(engine, {
//   mouse: mouse,
//   constraint: {
//     stiffness: 0.1,
//     render: { visible: false },
//   },
// });
// const mouse = Mouse.create(render.canvas),
//   mouseConstraint = MouseConstraint.create(engine, {
//     mouse: mouse,
//     constraint: {
//       stiffness: 0.2,
//       render: {
//         visible: false,
//       },
//     },
//   });
// Composite.add(world, mouseConstraint);

// // 클릭 이벤트 추가
// render.canvas.addEventListener("mousedown", function () {
//   mouseClicked();
// });

// function mouseClicked() {

// }
Events.on(runner, "tick", (e) => {
  createLiquid();
  for (let i = circles.length - 1; i >= 0; i--) {
    if (circles[i].position.y - circles[i].circleRadius > canvasHeight) {
      Composite.remove(world, circles[i]);
      circles.splice(i, 1);
    }
  }
});

// function resizeFilter() {
//   const feGaussianBlur = document.querySelector("#gooey feGaussianBlur");
//   const feColorMatrix = document.querySelector("#gooey feColorMatrix");
//   let index;
//   if (canvasWidth < 600) index = 0;
//   else index = 1;
//   feGaussianBlur.setAttribute("stdDeviation", stdDeviation[index]);
//   feColorMatrix.setAttribute(
//     "values",
//     `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${colorMatrix[index]}`
//   );
// }

function randomNumBetween(min, max) {
  return Math.random() * (max - min) + min;
}
