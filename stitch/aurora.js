(function () {
  "use strict";
  const mount = document.getElementById("stitch-aurora");
  if (!mount) return;

  const canvas = document.createElement("canvas");
  canvas.id = "stitch-aurora-canvas";
  mount.appendChild(canvas);

  function syncSize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(syncSize).observe(canvas);
  }
  syncSize();

  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return;

  const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

  const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float time = u_time * 0.2;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  for(float i = 1.0; i < 4.0; i++) {
    p.x += 0.3 / i * sin(i * 3.0 * p.y + time + i * 0.5);
    p.y += 0.3 / i * cos(i * 3.0 * p.x + time + i * 0.8);
  }
  float mask = smoothstep(0.8, 0.2, uv.y);
  vec3 color1 = vec3(0.0, 0.96, 1.0);
  vec3 color2 = vec3(0.54, 0.36, 0.96);
  vec3 finalColor = mix(color1, color2, uv.x + sin(time) * 0.5);
  finalColor *= 0.15 * mask;
  vec3 bg = vec3(0.02, 0.02, 0.03);
  gl_FragColor = vec4(bg + finalColor, 1.0);
}`;

  function cs(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, "a_position");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(prog, "u_time");
  const uRes = gl.getUniformLocation(prog, "u_resolution");

  function render(t) {
    if (typeof ResizeObserver === "undefined") syncSize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uTime) gl.uniform1f(uTime, t * 0.001);
    if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();
