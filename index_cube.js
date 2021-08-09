import {AnimationLoop, Model, CubeGeometry} from '@luma.gl/engine';
import {Texture2D, clear} from '@luma.gl/webgl';
import {setParameters} from '@luma.gl/gltools';
import {Matrix4} from '@math.gl/core';
const vs = `\
  attribute vec3 positions;
  attribute vec2 texCoords;

  uniform mat4 uMVP;

  varying vec2 vUV;

  void main(void) {
    gl_Position = uMVP * vec4(positions, 1.0);
    vUV = texCoords;
  }
`;

const fs = `\
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec3 uEyePosition;

  varying vec2 vUV;

  void main(void) {
    gl_FragColor = texture2D(uTexture, vec2(vUV.x, 1.0 - vUV.y));
  }
`; 

const loop = new AnimationLoop({
  onInitialize({gl}) {
    setParameters(gl, {
      depthTest: true,
      depthFunc: gl.LEQUAL
    });

    const texture = new Texture2D(gl, {
      data: 'vis-logo.jpg'
    });

    const eyePosition = [0, 0, 5];
    const viewMatrix = new Matrix4().lookAt({eye: eyePosition});
    const mvpMatrix = new Matrix4();

    const model = new Model(gl, {
      vs,
      fs,
      geometry: new CubeGeometry(),
      uniforms: {
        uTexture: texture
      }
    });

    return {
      model,
      viewMatrix,
      mvpMatrix
    };
  },

  onRender({gl, aspect, tick, model, mvpMatrix, viewMatrix}) {
    mvpMatrix.perspective({fov: Math.PI / 3, aspect})
      .multiplyRight(viewMatrix)
      .rotateX(tick * 0.01)
      .rotateY(tick * 0.013);

    clear(gl, {color: [1, 1, 1, 1]});

    model.setUniforms({uMVP: mvpMatrix})
      .draw();
  }
});

loop.start();