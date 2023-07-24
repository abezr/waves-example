import * as THREE from "three";
import matcap from "./ocean.jpg";
import t1 from "./1.png";
import t2 from "./2.png";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// init

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10
);
camera.position.z = 2;
camera.position.y = 1.5;
let time = 0;

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(2, 2, 300, 300).rotateX(-Math.PI / 2);

let positions = geometry.attributes.position.array;
let originalPositions = [...geometry.attributes.position.array];

function updateWaves(time) {
  for (let i = 0; i < positions.length; i += 3) {
    let x = originalPositions[i];
    let y = originalPositions[i + 1];
    let z = originalPositions[i + 2];

    positions[i] = x;
    positions[i + 1] = y;

    positions[i] -= 0.07 * Math.sin(x * 2 + time * 0.5);
    positions[i + 1] += 0.12 * Math.cos(x * 2 + time * 0.5);

    positions[i] -= 0.7 * 0.1 * Math.sin(x * 5 + time);
    positions[i + 1] += 0.1 * Math.cos(x * 5 + time);

    positions[i] -= 0.7 * 0.05 * Math.sin(x * 7 + 5 * y + time * 2);
    positions[i + 1] += 0.05 * Math.cos(x * 7 + 5 * y + time * 2);

    positions[i] -= 0.7 * 0.03 * Math.sin(x * 14 + 5 * y + time * 5);
    positions[i + 1] += 0.03 * Math.cos(x * 14 + 5 * y + time * 5);

    positions[i] -= 0.7 * 0.01 * Math.sin(x * 30 + time * 5);
    positions[i + 1] += 0.01 * Math.cos(x * 30  + time * 5);

    // positions[i + 1] += 0.03 * Math.random();
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
}

let matcapTexture = new THREE.TextureLoader().load(matcap);
matcapTexture.colorSpace = THREE.SRGBColorSpace;
let material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
  wiremframe: true,
  side: THREE.DoubleSide,
});

material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  // wireframe: true,
  vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
            vUv = uv;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
  fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture1;
        uniform sampler2D uTexture2;
        uniform float time;
        varying vec3 vNormal;
        void main() {

            vec2 uv = vUv;

            uv.x += 0.1 * sin(uv.y*10. + time * 0.5);
            float curtainMove = 0.5 + 0.5 * sin(time * 0.5);
            float curtain = step(curtainMove, vUv.y);

            vec4 color1 = texture2D(uTexture1, uv);
            vec4 color2 = texture2D(uTexture2, uv);

            vec4 finalColor = mix(color1, color2, curtain);


            vec3 light = normalize(vec3(1., 1., 1.));

            float diffuse = dot(vNormal, light);


            gl_FragColor = vec4(vUv,0., 1.0);
            // gl_FragColor = vec4(vec3(curtain), 1.0);
            // gl_FragColor = finalColor;
            gl_FragColor = vec4(vNormal,1.);
        }`,
  uniforms: {
    time: { value: 0 },
    uTexture1: { value: new THREE.TextureLoader().load(t1) },
    uTexture2: { value: new THREE.TextureLoader().load(t2) },
  },
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

let ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
renderer.setClearColor(0x555555, 1);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
// animation
updateWaves(time);
function animation() {
  time += 0.05;
  updateWaves(time);

  // mesh.rotation.x = time / 2000;
  // mesh.rotation.y = time / 1000;

  material.uniforms.time.value = time;

  renderer.render(scene, camera);
}
