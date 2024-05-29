const URL = "../images/shot.png";
const BG_URL = "../images/shot_bg.png";

Engine = Matter.Engine;
Render = Matter.Render;
Runner = Matter.Runner;
Events = Matter.Events;
Constraint = Matter.Constraint;
MouseConstraint = Matter.MouseConstraint;
Mouse = Matter.Mouse;
Body = Matter.Body;
Bodies = Matter.Bodies;
Composite = Matter.Composite;
Composites = Matter.Composites;

let engine = Engine.create(),
  world = engine.world;

// 재생 속도를 느리게 설정
engine.timing.timeScale = 0.5; // 0.5배속으로 느리게 설정 (원래 속도의 절반)

// function setup() {
// 렌더링 설정
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false,
    background:
      "transparent  url(../images/shot_bg.png) no-repeat center center",
  },
});

Render.run(render);

// 러너 설정
const runner = Runner.create();
Runner.run(runner, engine);

// 바닥 설정
const floor = Bodies.rectangle(400, 530, 810, 10, {
  isStatic: true,
  render: { fillStyle: "#060a19" },
});
Composite.add(world, floor);

// 기울어진 타원형 과녁 생성
const targetWidth = 15;
const targetHeight = 95;
const targetX = 511;
const targetY = 434;
const targetAngle = Math.PI / 4; // 타원의 기울기 (30도)

// 타원형 과녁의 정점 정의 (단순화된 다각형)
const createEllipseVertices = (
  centerX,
  centerY,
  width,
  height,
  segments = 50
) => {
  const vertices = [];
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    const x = centerX + (width / 2) * Math.cos(theta);
    const y = centerY + (height / 2) * Math.sin(theta);
    vertices.push({ x, y });
  }
  return vertices;
};

const ellipseVertices = createEllipseVertices(0, 0, targetWidth, targetHeight);

// 타원형 과녁 객체 생성
const target = Bodies.fromVertices(targetX, targetY, [ellipseVertices], {
  isStatic: true,
  render: {
    fillStyle: "white",
    strokeStyle: "red",
    lineWidth: 8,
  },
});

// 타원형 과녁을 기울임
Body.rotate(target, targetAngle);

// 월드에 과녁 추가
Composite.add(world, target);

// 마우스 제약 추가
const mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });
Composite.add(world, mouseConstraint);

// 공의 발사 위치
const launchX = 74;
const launchY = 403;
// 클릭 이벤트 추가
render.canvas.addEventListener("click", function () {
  //console.log("Mouse Clicked at:", event.clientX, event.clientY); // 74 403
  // 공 생성
  const ball = Bodies.circle(launchX, launchY, 20, {
    restitution: 0, // 충돌시 반발계수
    render: {
      fillStyle: "#FF0000", // 공 색상 설정
    },
  });

  // 초기 힘 설정
  const forceMagnitude = 0.11;
  const angle = Math.PI / 5; // 45도 각도로 발사
  const force = {
    x: forceMagnitude * Math.cos(angle),
    y: -forceMagnitude * Math.sin(angle), // 위쪽으로 발사되도록 음수
  };
  Body.applyForce(ball, { x: launchX, y: launchY }, force);

  // 월드에 공 추가
  Composite.add(world, ball);
});

// 충돌 이벤트 처리
Events.on(engine, "collisionStart", (event) => {
  const pairs = event.pairs;

  // 충돌한 모든 쌍에 대해 검사
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];

    // 공이 과녁에 닿았을 때 처리
    if (
      (pair.bodyA === target && pair.bodyB.label === "Circle Body") ||
      (pair.bodyB === target && pair.bodyA.label === "Circle Body")
    ) {
      const ball = pair.bodyA.label === "Circle Body" ? pair.bodyA : pair.bodyB;

      // 공의 속도와 각속도를 0으로 설정하여 붙도록 함
      Body.setVelocity(ball, { x: 0, y: 0 });
      Body.setAngularVelocity(ball, 0);

      // 공을 고정시킴
      Body.setStatic(ball, true);
    }
  }
});

// ?????? 애니메이션 루프 설정
(function animate() {
  Engine.update(engine, 1000 / 60);
  requestAnimationFrame(animate);
})();
// }
