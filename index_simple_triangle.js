import {AnimationLoop, Model} from '@luma.gl/engine';
import {Buffer, clear} from '@luma.gl/webgl';

const loop = new AnimationLoop({
  onInitialize({gl}) {
    // Setup logic goes here

    // buffers
    const positionBuffer = new Buffer(gl, new Float32Array([
      -0.5, -0.5,
      0.5, -0.5,
      0.0, 0.5
    ]))

    const colorBuffer = new Buffer(gl, new Float32Array([
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0
    ]))

    // shader 顶点着色器、片元着色器
    const vs = `
      attribute vec2 position;
      attribute vec3 color;

      varying vec3 vColor;

      void main(){
        vColor = color;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    const fs = `
      varying vec3 vColor;
      void main(){
        gl_FragColor = vec4(vColor, 1.0);
      }
    `

    // models
    const model = new Model(gl, {
      vs,
      fs, 
      attributes: {
        position: positionBuffer,
        color: colorBuffer
      },
      vertexCount: 3
    })

    return {model};
  },

  onRender({gl, model}) {
    // Drawing logic goes here
    clear(gl, {color: [0, 0, 0, 1]});
    model.draw();
  }
});

loop.start();