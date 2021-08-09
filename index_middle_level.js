import {AnimationLoop} from '@luma.gl/engine';
import {Program, VertexArray, Buffer, clear} from '@luma.gl/webgl';
import {assembleShaders} from '@luma.gl/shadertools';

const colorShaderModule = {
  name: 'color',
  vs: `
    varying vec3 color_vColor;

    void color_setColor(vec3 color){
      color_vColor = color;
    }
  `,
  fs: `
    varying vec3 color_vColor;

    vec3 color_getColor(){
      return color_vColor;
    }
  `

}

const loop = new AnimationLoop({
  onInitialize({gl}) {
    // Setup logic goes here

    // buffers
    const positionBuffer = new Buffer(gl, new Float32Array([
      -0.2, -0.2, 0.2, -0.2, 0.0, 0.2
    ]))

    const colorBuffer = new Buffer(gl, new Float32Array([
      1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0
    ]))

    const offsetBuffer = new Buffer(gl, new Float32Array([0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5]))

    // shader 顶点着色器、片元着色器
    const vs = `
      attribute vec2 position;
      attribute vec3 color; 
      attribute vec2 offset;

      void main(){
        color_setColor(color);
        gl_Position = vec4(position+ offset, 0.0, 1.0);
      }
    `

    const fs = `
      void main(){
        gl_FragColor = vec4(color_getColor(), 1.0);
      }
    `

    // models
    const assembled = assembleShaders(gl, {
      vs,
      fs, 
      modules: [colorShaderModule], 
    })

    const program = new Program(gl, assembled);

    const vertexArray = new VertexArray(gl, {
      program, 
      attributes: {
        position: positionBuffer,
        color: [colorBuffer, {divisor: 1}],
        offset: [offsetBuffer, {divisor: 1}],
      }
    })
    return {program, vertexArray};
  },

  onRender({gl, program, vertexArray}) {
    // Drawing logic goes here
    clear(gl, {color: [0, 0, 0, 1]});
    program.draw({
      vertexArray,
      vertexCount: 3,
      instanceCount: 4,
    });
  }
});

loop.start();