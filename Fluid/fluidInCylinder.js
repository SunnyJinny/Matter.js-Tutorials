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
  Composites = Matter.Composites,
  Svg = Matter.Svg,
  Vertices = Matter.Vertices;

let engine = Engine.create(),
  world = engine.world;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false,
    background: "#f4f4f4",
  },
});
Render.run(render);

// 러너 설정
const runner = Runner.create();
Runner.run(runner, engine);

// 바닥 설정
// const floor = Bodies.rectangle(400, 580, 810, 60, {
//   isStatic: true,
//   render: { fillStyle: "#060a19" },
// });
// Composite.add(world, floor);

// 실린더 만들어보자
let glass;
function Glass() {
  // const glassImg = document.getElementById("glass");
  this.cx = 300;
  this.cy = 200;
  const thickness = 4;

  const leftDown = Bodies.rectangle(
    this.cx - 110,
    this.cy + 50,
    thickness,
    50,
    {
      isStatic: true,
    }
  );
  const leftUp = Bodies.rectangle(this.cx - 110, this.cy - 50, thickness, 100, {
    isStatic: true,
  });
  const rightDown = Bodies.rectangle(
    this.cx + 10,
    this.cy + 50,
    thickness,
    50,
    {
      isStatic: true,
    }
  );
  const rightUp = Bodies.rectangle(this.cx + 10, this.cy - 50, thickness, 100, {
    isStatic: true,
  });
  const bottom = Bodies.rectangle(this.cx - 50, this.cy + 75, 125, thickness, {
    isStatic: true,
  });
  const leftInA = Bodies.rectangle(this.cx - 148, this.cy, 80, thickness, {
    isStatic: true,
  });
  const leftInB = Bodies.rectangle(this.cx + 48, this.cy + 24, 80, thickness, {
    isStatic: true,
  });
  const rightInA = Bodies.rectangle(this.cx + 48, this.cy, 80, thickness, {
    isStatic: true,
  });
  const rightInB = Bodies.rectangle(
    this.cx - 148,
    this.cy + 24,
    80,
    thickness,
    {
      isStatic: true,
    }
  );
  Composite.add(engine.world, [
    leftDown,
    leftUp,
    rightDown,
    rightUp,
    bottom,
    leftInA,
    leftInB,
    rightInA,
    rightInB,
  ]);
}
glass = new Glass();
// const vertices = [
//   { x: 116, y: 0.5 },
//   { x: 116, y: 102.5 },
//   { x: 0.5, y: 102.5 },
//   { x: 0.5, y: 140 },
//   { x: 116, y: 140 },
//   { x: 116, y: 186.5 },
//   { x: 264.5, y: 186.5 },
//   { x: 264.5, y: 140 },
//   { x: 380, y: 140 },
//   { x: 380, y: 102.5 },
//   { x: 264.5, y: 102.5 },
//   { x: 264.5, y: 0.5 },
// ];

// const glass = Bodies.fromVertices(300, 200, vertices, {
//   isStatic: true,
//   render: {
//     fillStyle: "#00000000",
//     strokeStyle: "#000000",
//     lineWidth: 1,
//   },
// });

// 엔진에 바디 추가
Composite.add(world, glass);

// // 마우스 제약 추가
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
