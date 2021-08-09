import {AnimationLoop, Model} from '@luma.gl/engine';
import {Buffer, clear} from '@luma.gl/webgl';

const vs1 = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position - vec2(0.5, 0.0), 0.0, 1.0);
  }
`;

const fs1 = `
  uniform vec3 hsvColor;

  void main() {
    gl_FragColor = vec4(color_hsv2rgb(hsvColor), 1.0);
  }
`;

const vs2 = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position + vec2(0.5, 0.0), 0.0, 1.0);
  }
`;

const fs2 = `
  uniform vec3 hsvColor;

  void main() {
    gl_FragColor = vec4(color_hsv2rgb(hsvColor) - 0.3, 1.0);
  }
`;

// Taken from http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
const colorModule = {
  name: 'color',
  fs: `
    vec3 color_hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
  `
};

const loop = new AnimationLoop({
  onInitialize({gl}) {
    const positionBuffer = new Buffer(gl, new Float32Array([-0.3, -0.5, 0.3, -0.5, 0.0, 0.5]));

    const model1 = new Model(gl, {
      vs: vs1,
      fs: fs1,
      modules: [colorModule],
      attributes: {
        position: positionBuffer
      },
      uniforms: {
        hsvColor: [0.7, 1.0, 1.0]
      },
      vertexCount: 3
    });

    const model2 = new Model(gl, {
      vs: vs2,
      fs: fs2,
      modules: [colorModule],
      attributes: {
        position: positionBuffer
      },
      uniforms: { 
        hsvColor: [1.0, 1.0, 1.0]
      },
      vertexCount: 3
    });

    return {model1, model2};
  },

  onRender({gl, model1, model2}) {
    clear(gl, {color: [0, 0, 0, 1]});
    model1.draw();
    model2.draw();
  }
});

loop.start();