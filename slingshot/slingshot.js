// 1 module aliases
const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Events = Matter.Events,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Composites = Matter.Composites;

// 2 create an engine
const engine = Engine.create(),
  world = engine.world;

// 3-1 create a renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    showAngleIndicator: true, // 각도 표시
  },
});
// 3-2 렌더러 실행
Render.run(render);

// 4 create runner
const runner = Runner.create();
Runner.run(runner, engine);

// 5 create bodies (ground, ball, slingshot)
let ground = Bodies.rectangle(395, 600, 815, 50, {
    isStatic: true,
    render: { fillStyle: "#060a19" },
  }),
  rockOption = { density: 0.004 },
  rock = Bodies.polygon(170, 450, 8, 20, rockOption),
  anchor = { x: 170, y: 450 },
  elastic = Constraint.create({
    pointA: anchor,
    bodyB: rock,
    length: 0.01,
    damping: 0.01, // 제동
    stiffness: 0.05, // 단단함
  });
let pyramid = Composites.pyramid(500, 300, 9, 10, 0, 0, function (x, y) {
  return Bodies.rectangle(x, y, 25, 40);
});

// 6 add all of the bodies to the world
Composite.add(world, [ground, rock, elastic, pyramid]);

// ++ 상호작용 추가
// 이벤트 리스너 추가
Events.on(engine, "afterUpdate", function () {
  // 마우스 버튼이 눌려있지 않고, rock의 위치가 특정 조건을 만족할 때,
  if (
    mouseConstraint.mouse.button === -1 &&
    (rock.position.x > 190 || rock.position.y < 430)
  ) {
    // 현재 Rock의 속도가 45를 초과하면 속도를 45로 제한
    if (Body.getSpeed(rock) > 45) {
      Body.setSpeed(rock, 45);
    }
    // rock을 던지고 나면 현재의 rock을 해제하고, 새로운 rock을 생성
    rock = Bodies.polygon(170, 450, 7, 20, rockOption);
    Composite.add(world, rock);
    elastic.bodyB = rock;
  }
});

// create mouse control
const mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.98, // 강성, 단단함
      render: {
        visible: false,
      },
    },
  });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// 렌더러의 뷰포트를 장면에 맞게 조정하고, 필요한 컨텍스트를 반환
Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: 800, y: 600 },
});

// context for MatterTools.Demo
// return {
//   engine: engine,
//   runner: runner,
//   render: render,
//   canvas: render.canvas,
//   stop: function () {
//     Matter.Render.stop(render);
//     Matter.Runner.stop(runner);
//   },
// };
