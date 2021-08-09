import {polyfillContext} from '@luma.gl/gltools'

const canvas = document.createElement('canvas')
canvas.width = 800
canvas.height = 600
document.body.appendChild(canvas)

const gl = polyfillContext(canvas.getContext('webgl'))
gl.clearColor(0, 0, 0, 1)

// shader 顶点着色器、片元着色器
const vs = `
  attribute vec2 position;
  attribute vec3 color; 
  attribute vec2 offset;

  varying vec3 vColor;

  void main(){
    vColor = color;
    gl_Position = vec4(position + offset, 0.0, 1.0);
  }
`

const fs = `
  precision highp float;

  varying vec3 vColor;
  void main(){
    gl_FragColor = vec4(vColor, 1.0);
  }
`
const vShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vShader, vs)
gl.compileShader(vShader)

const fShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fShader, fs)
gl.compileShader(fShader)

const program = gl.createProgram()
gl.attachShader(program, vShader)
gl.attachShader(program, fShader)
gl.linkProgram(program)

const vertexArray = gl.createVertexArray()
gl.bindVertexArray(vertexArray)

// buffers
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-0.2, -0.2, 0.2, -0.2, 0.0, 0.2]),
  gl.STATIC_DRAW
)

const positionLocation = gl.getAttribLocation(program, 'position')
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(positionLocation)

const colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
  ]),
  gl.STATIC_DRAW
)

const colorLocation = gl.getAttribLocation(program, 'color')
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0)
gl.vertexAttribDivisor(colorLocation, 1)
gl.enableVertexAttribArray(colorLocation)

const offsetBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer)
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5]),
  gl.STATIC_DRAW
)

const offsetLocation = gl.getAttribLocation(program, 'offset')
gl.vertexAttribPointer(offsetLocation, 2, gl.FLOAT, false, 0, 0)
gl.vertexAttribDivisor(offsetLocation, 1)
gl.enableVertexAttribArray(offsetLocation)

gl.bindVertexArray(null)

requestAnimationFrame(function draw() {
  requestAnimationFrame(draw)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.bindVertexArray(vertexArray)
  gl.useProgram(program)
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, 4)
})
