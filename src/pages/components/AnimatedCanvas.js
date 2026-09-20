import React, { useEffect, useRef } from "react";

const AnimatedCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const CSIZE = 400;
    canvas.width = canvas.height = 2 * CSIZE;
    ctx.translate(CSIZE, CSIZE);
    ctx.lineCap = "round";

    const TP = 2 * Math.PI;
    const color = {
      getRGB: (ct) => {
        let red = Math.round(144 + (111 * Math.cos(ct / 720)));
        let green = Math.round(144 + (111 * Math.cos(ct / 580)));
        let blue = Math.round(144 + (111 * Math.cos(ct / 640)));
        return `rgb(${red},${green},${blue})`;
      }
    };

    let ca = [];
    let tt = Math.random() * 1000;
    let stopped = false;

    class Circle {
      constructor(p = null, cont = false, dir = false) {
        this.p = p;
        this.cont = cont;
        this.dir = dir;
        this.r = p ? p.r * 0.8 : 80;
        this.ka2 = 200;
      }

      setRA() {
        this.a2 = TP / 4 + 1.57 * (1 + Math.sin(tt / this.ka2)) / 2;
        if (this.dir) this.a2 = -this.a2;
      }

      setPath2() {
        if (this.p) {
          this.a = TP / 2 + this.p.a - this.p.a2;
          this.x = this.p.x + (this.p.r - this.r) * Math.cos(this.p.a - this.p.a2);
          this.y = this.p.y + (this.p.r - this.r) * Math.sin(this.p.a - this.p.a2);
        } else {
          this.a = 0;
          this.x = this.r * Math.cos(this.a);
          this.y = this.r * Math.sin(this.a);
        }
        this.path = new Path2D();
        this.path.arc(this.x, this.y, this.r, TP / 2 + this.a, this.a - this.a2, this.dir);
      }
    }

    function reset() {
      ca = [new Circle()];
      ca[0].setRA();
      ca[0].x = ca[0].r * Math.cos(ca[0].a);
      ca[0].y = ca[0].r * Math.sin(ca[0].a);
    }

    function addCircle(c) {
      let c2 = new Circle(c, false, !c.dir);
      let c3 = new Circle(c, true, c.dir);
      ca.push(c2, c3);
    }

    function draw() {
      tt++;
      ca[0].a = tt / 1000;
      ca.forEach((c) => c.setRA());
      ca.forEach((c) => c.setPath2());

      ctx.clearRect(-CSIZE, -CSIZE, 2 * CSIZE, 2 * CSIZE);
      ctx.strokeStyle = color.getRGB(tt);
      ctx.lineWidth = 3;
      ca.forEach((c) => ctx.stroke(c.path));

      if (!stopped) requestAnimationFrame(draw);
    }

    reset();
    for (let i = 0; i < 127; i++) addCircle(ca[i]);
    draw();

    return () => {
      stopped = true;
    };
  }, []);

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <canvas ref={canvasRef} style={{ width: "100%", maxWidth: "400px", height: "auto" }} />
    </div>
  );
};

export default AnimatedCanvas;
