/* Created by Claude · INTERNAL */
"use client";

import { useEffect, useRef } from "react";
import { useMotionOff } from "@/components/Reveal";

/* The sanal band's background, drawn instead of sanal-bg.webp (owner,
   2026-10-16: "build a similar shader that's very light weight to animate
   the background very subtly").

   The palette and the glow positions are sampled off the comp's render:
   a navy field (#150d32) lit from the left edge (#6630a0 at 30% down),
   with a faint lift in the top-left and the bottom-right corners. The
   shader drifts those glows a few percent on slow, unrelated periods and
   breathes a low-frequency noise through the field, so it never reads as
   a loop.

   Kept cheap on purpose: one full-screen triangle, a two-octave value
   noise, drawn at half resolution (a soft gradient loses nothing to the
   upscale), capped at 30fps, paused off-screen and in hidden tabs.
   ≤767 / reduced motion draw one frame and stop. No WebGL → the CSS
   gradient on `.dbc-sanal` underneath stays as it is.

   Pointer: a soft violet glow trails the cursor across the band (owner,
   2026-10-16: "the blur subtly follows cursor"). It eases toward the
   pointer and fades in/out on enter/leave, so it never snaps; mouse only. */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float mi;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float g(vec2 uv,vec2 c,vec2 s){vec2 d=(uv-c)/s;return exp(-dot(d,d));}
void main(){
vec2 uv=gl_FragCoord.xy/r;
float a=r.x/r.y;
vec2 w=vec2(n(uv*2.2+vec2(t*.031,-t*.017)),n(uv*2.2+vec2(-t*.023,t*.027)+7.3))-.5;
uv+=w*.06;
vec3 base=vec3(.082,.051,.196);
vec3 c1=vec3(.40,.19,.63);
vec3 c2=vec3(.27,.13,.45);
vec3 c3=vec3(.24,.13,.40);
float g1=g(uv,vec2(-.06+.035*sin(t*.11),.70+.05*sin(t*.07+1.)),vec2(.52/a*1.5,.55));
float g2=g(uv,vec2(.06+.03*sin(t*.09+2.),1.02),vec2(.30,.22));
float g3=g(uv,vec2(1.02+.02*sin(t*.08+4.),-.04+.03*sin(t*.13)),vec2(.22,.16));
vec3 col=mix(base,c1,g1);
col=mix(col,c2,g2*.6);
col=mix(col,c3,g3*.9);
vec2 dm=(uv-m)*vec2(a,1.)/.38;
col=mix(col,vec3(.45,.24,.72),exp(-dot(dm,dm))*.42*mi);
col*=.96+.08*n(uv*3.+t*.02);
col+=(h(gl_FragCoord.xy+fract(t))-.5)/255.;
gl_FragColor=vec4(col,1.);
}`;

const SCALE = 0.5;
const FRAME_MS = 1000 / 30;

export default function SanalShader() {
  const ref = useRef<HTMLCanvasElement>(null);
  const still = useMotionOff();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // one triangle that covers the viewport
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "r");
    const uTime = gl.getUniformLocation(prog, "t");
    const uMouse = gl.getUniformLocation(prog, "m");
    const uMouseOn = gl.getUniformLocation(prog, "mi");
    // pointer, in uv (y up); eased every frame toward its target
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, on: 0, ton: 0 };

    // a fixed offset so the still frame isn't the glows' t=0 pose
    const t0 = performance.now() - 40000;
    let raf = 0;
    let last = 0;
    let visible = false;

    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.on += (mouse.ton - mouse.on) * 0.05;
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseOn, mouse.on);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
      draw(performance.now());
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      draw(now);
    };
    const start = () => {
      if (still || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    canvas.dataset.ready = "";

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    // the canvas sits under the content, so the section takes the pointer
    const host = canvas.parentElement!;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const b = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - b.left) / b.width;
      mouse.ty = 1 - (e.clientY - b.top) / b.height;
      if (!mouse.ton) {
        // first contact: start the glow where the pointer is, not mid-band
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      mouse.ton = 1;
    };
    const onLeave = () => (mouse.ton = 0);
    if (!still) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      delete canvas.dataset.ready;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [still]);

  return <canvas ref={ref} className="dbc-sanal__shader" aria-hidden="true" />;
}
