const canvas = document.querySelector("#matter-canvas");
let canvasWidth = innerWidth;
let canvasHeight = innerHeight;

const stdDeviation = [8, 10];
const colorMatrix = ["15 -3", "30 -5"];

window.addEventListener("DOMContentLoaded", () => {
  const {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    Mouse,
    MouseConstraint,
    Events,
    Body,
  } = Matter;

  let engine, render, runner, mouse, mouseConstraint;

  let circles = [];
  let glass;

  function init() {
    engine = Engine.create({
      constraintIterations: 10,
      positionIterations: 10,
    });

    render = Render.create({
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

    mouse = Mouse.create(canvas);

    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false },
      },
    });

    runner = Runner.create();

    Render.run(render);
    Runner.run(runner, engine);

    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    Composite.add(engine.world, mouseConstraint);
  }

  function createLiquid() {
    const x = 105;
    const y = 105;
    const radius = randomNumBetween(6, 7);
    const body = Bodies.circle(x, y, radius, {
      friction: 0,
      density: 1,
      frictionAir: 0,
      restitution: 0.7,
      render: { fillStyle: "#fff" },
    });
    Body.applyForce(body, body.position, { x: 1, y: 0 });
    Composite.add(engine.world, body);
    circles.push(body);
  }

  function Glass() {
    const glassImg = document.querySelector("#glass");
    this.cx = canvasWidth * 0.3;
    this.cy = canvasHeight * 0.8;
    const thickness = 25;
    const wallColor = "#00000000";

    const left = Bodies.rectangle(this.cx - 60, this.cy, thickness, 150, {
      chamfer: { radius: 10 },
      isStatic: true,
      angle: (Math.PI / 180) * -15,
      render: { fillStyle: wallColor },
    });
    const right = Bodies.rectangle(this.cx + 37, this.cy, thickness, 150, {
      chamfer: { radius: 10 },
      isStatic: true,
      angle: (Math.PI / 180) * 15,
      render: { fillStyle: wallColor },
    });
    const bottom = Bodies.rectangle(
      this.cx - 10,
      this.cy + 72,
      85,
      thickness * 2,
      {
        chamfer: { radius: 20 },
        isStatic: true,
        render: { fillStyle: wallColor },
      }
    );
    glassImg.style.transform = `translate(${this.cx - canvasWidth / 2}px, ${
      this.cy - canvasHeight / 2
    }px)`;

    Composite.add(engine.world, [left, right, bottom]);
  }

  init();
  glass = new Glass();

  Events.on(runner, "tick", (e) => {
    createLiquid();
    for (let i = circles.length - 1; i >= 0; i--) {
      if (circles[i].position.y - circles[i].circleRadius > canvasHeight) {
        Composite.remove(engine.world, circles[i]);
        circles.splice(i, 1);
      }
    }
  });
});

function randomNumBetween(min, max) {
  return Math.random() * (max - min) + min;
}
