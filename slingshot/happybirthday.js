const URL = "../images/shot.png";

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

// 이미지 로드
const img = new Image();
img.crossOrigin = "Anonymous"; // 크로스 오리진 문제 해결
img.src = URL;
img.onload = () => {
  // 이미지가 로드된 후 렌더링 설정
  console.log("Image loaded");
  setup();
};
img.onerror = (e) => {
  console.error("Image load error", e);
};

let engine = Engine.create(),
  world = engine.world;
let confettis = [];

const COLORS = [
  "#4d089a",
  "#323edd",
  "#dc2ade",
  "#e8f044",
  "#fd5e53",
  "#FF0565",
  "#b0eacd",
  "#21bf73",
];

function setup() {
  // 렌더링 설정
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      wireframes: false,
      //background: "#fff",
    },
  });

  // 이미지 배경 추가
  Events.on(render, "beforeRender", function () {
    const context = render.context;
    //context.clearRect(0, 0, render.options.width, render.options.height);
    context.drawImage(
      img,
      render.options.width / 2 - img.width / 2,
      render.options.height / 2 - img.height / 2
    );
  });

  Render.run(render);

  // 러너 설정
  const runner = Runner.create();
  Runner.run(runner, engine);

  // 바닥 설정
  const floor = Bodies.rectangle(400, 580, 810, 60, {
    isStatic: true,
    render: { fillStyle: "#060a19" },
  });
  Composite.add(world, floor);

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

  // 클릭 이벤트 추가
  render.canvas.addEventListener("mousedown", function () {
    mouseClicked();
  });

  // ?????? 애니메이션 루프 설정
  (function animate() {
    Engine.update(engine, 1000 / 60);
    requestAnimationFrame(animate);
  })();
}

function mouseClicked() {
  let amount = Math.floor(Math.random() * (10 - 3) + 3);
  for (let i = 0; i < amount; i++) {
    let length = Math.random() * (6 - 1) + 1;
    let force = {
      x: Math.random() * (100 - 30) + 30,
      y: Math.random() * (-30 + 100) - 100,
    };
    let confetti = new Confetti(length, force);
    confetti.shoot();
    confettis.push(confetti);
  }
}

function Particle(x, y, w, h, color) {
  let options = {
    frictionAir: 0.1, // 공기 저항
  };
  this.body = Bodies.rectangle(x, y, w, h, options);
  this.w = w;
  this.h = h;
  this.color = color;
  Composite.add(world, this.body);

  this.isOffScreen = function () {
    let pos = this.body.position;
    return (
      pos.y > render.canvas.height + 100 || pos.x > render.canvas.width + 100
    );
  };
  this.removeFromWorld = function () {
    Composite.remove(world, this.body);
  };
}

function RoundParticle(x, y, r, color) {
  let options = {
    frictionAir: 0.04, // 공기 저항
  };
  this.body = Bodies.circle(x, y, r, options);
  this.r = r;
  this.color = color;
  Composite.add(world, this.body);

  this.isOffScreen = function () {
    let pos = this.body.position;
    return (
      pos.y > render.canvas.height + 100 || pos.x > render.canvas.width + 100
    );
  };

  this.removeFromWorld = function () {
    Composite.remove(world, this.body);
  };
}

// particle 조각을 생성, 물리엔진에서 처리
function Confetti(length, force) {
  this.particles = [];
  this.particles2 = [];
  this.shoot = function () {
    let p;
    let p2;
    let prev;
    let k = Math.floor(Math.random() * 7);
    for (let i = 0; i <= length; i++) {
      let offset = {
        x: Math.random() * (350 - 250) + 250,
        y: Math.random() * (20 + 20) - 20,
      };
      p = new Particle(offset.x + i * 10, 300 + offset.y, 12, 8, COLORS[k]);
      this.particles.push(p); // 파티클을 생성, 배열에 추가

      if (prev) {
        let contraintOptions = {
          bodyA: p.body,
          bodyB: prev.body,
          pointA: { x: -p.w / 2, y: 0 }, // 첫번째 바디의 제약조건에 연결될 지점.
          pointB: { x: prev.w / 2, y: 0 }, // 두번째 바디의 제약조건이 연결될 지점.
          length: 1, // 두 바디 사이의 초기 거리를 지정.
          stiffness: 0.1, // 제약 조건의 강성. 제약조건이 얼마나 단단하게 연결되는 지 결정. 0.1 은 비교적 유연한 연결. 1에 가까울 수록 단단한 연결.
        };
        let constraint = Constraint.create(contraintOptions);
        Composite.add(world, constraint);
      }
      prev = p;

      p2 = new RoundParticle(offset.x + 10, 300 + offset.y, 5, COLORS[k]);
      this.particles2.push(p2);
    }
    // 특정 파티클의 속도 설정
    Body.setVelocity(this.particles[0].body, force);
    for (let i = 0; i < this.particles2.length; i++) {
      let force2 = { x: force.x / 2, y: force.y / 2 };
      Body.setVelocity(this.particles2[i].body, force2);
    }
  };
}
