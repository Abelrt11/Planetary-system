import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

// Variables globales
let scene, renderer;

// Cámaras
let camera;
let cameraShip;
let activeCamera;

// Estado escena
let info;
let estrella;
let Planetas = [];
let Lunas = [];
let objetos = [];
let nave = null;
let controlsSystem;

// Tiempo
let t0 = 0;
let accglobal = 0.001;
let timestamp = 0;

// Movimiento nave
let velocidadAdelante = 0;
const VELOCIDAD_MAX = 0.1;
const ACELERACION = 0.002;
const GIRO_VELOCIDAD = 0.03;
const ROLL_VELOCIDAD = 0.009;

// Orientación nave
let yaw = 0;
let roll = 0;
let pitch = 0;

let teclas = {
  w: false,
  s: false,
  a: false,
  d: false,
  q: false,
  e: false,
};

init();
animationLoop();

function init() {
  info = document.createElement("div");
  info.style.position = "absolute";
  info.style.top = "30px";
  info.style.width = "100%";
  info.style.textAlign = "center";
  info.style.color = "#fff";
  info.style.fontWeight = "bold";
  info.style.backgroundColor = "transparent";
  info.style.zIndex = "1";
  info.style.fontFamily = "Monospace";
  info.innerHTML =
    "three.js - Sistema solar<br>[1] Vista de Sistema  [2] Modo Nave <br>Controles: w Adelante / s atras /<br>/ a d girar nave / q e girar el morro /";
  document.body.appendChild(info);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 50);

  cameraShip = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, -300);
  cameraShip.position.set(0, 0, 0);

  activeCamera = camera;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  controlsSystem = new OrbitControls(camera, renderer.domElement);

  // Luces
  const Lamb = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(Lamb);

  const Ldir = new THREE.PointLight(0xffffff, 1.2, 500);
  Ldir.position.set(0, 0, 0);
  Ldir.castShadow = true;
  scene.add(Ldir);

  // Texturas
  const txSol = new THREE.TextureLoader().load("src/texturas/sol.jpg");
  const txPlaneta1 = new THREE.TextureLoader().load(
    "src/texturas/Timger Hearth.png"
  );
  const txPlaneta2 = new THREE.TextureLoader().load(
    "src/texturas/giantsDeep.png"
  );
  const txPlaneta3 = new THREE.TextureLoader().load(
    "src/texturas/Dark bamble.png"
  );
  const txPlaneta4 = new THREE.TextureLoader().load(
    "src/texturas/Subtle hollow.png"
  );
  const txFondo = new THREE.TextureLoader().load("src/texturas/fondo.jpg");
  const txLuna = new THREE.TextureLoader().load("src/texturas/moon.jpg");
  const txPlaneta5 = new THREE.TextureLoader().load("src/texturas/gassy.png");

  fondo(txFondo);
  estrellaFn(35, 0xffff00, txSol);
  planeta({
    radio: 10.5,
    dist: 58,
    vel: 0.02,
    color: 0xffffff,
    f1: 1.0,
    f2: 0.8,
    texture: txPlaneta1,
  });

  planeta({
    radio: 15.5,
    dist: 113,
    vel: 0.01,
    color: 0xffffff,
    f1: 1.2,
    f2: 1.2,
    texture: txPlaneta2,
  });

  planeta({
    radio: 12.2,
    dist: 118,
    vel: 0.01,
    color: 0xffffff,
    f1: 1.5,
    f2: 0.6,
    texture: txPlaneta3,
  });

  planeta({
    radio: 10.1,
    dist: 123,
    vel: 0.0199,
    color: 0xffffff,
    f1: 0.8,
    f2: 1.6,
    texture: txPlaneta4,
  });

  planeta({
    radio: 7.8,
    dist: 230,
    vel: 0.0099,
    color: 0xffffff,
    f1: 1.0,
    f2: 1.0,
    texture: txPlaneta5,
  });

  luna({
    planeta: Planetas[0],
    radio: 1.3,
    dist: 15.0,
    vel: 0.5,
    color: 0xcccccc,
    angle: 0.4,
    texture: txLuna,
  });

  luna({
    planeta: Planetas[2],
    radio: 2.3,
    dist: 25.0,
    vel: 0.0005,
    color: 0xcccccc,
    angle: 0.4,
    texture: txLuna,
  });

  luna({
    planeta: Planetas[2],
    radio: 1.3,
    dist: 20.0,
    vel: 0.05,
    color: 0xcccccc,
    angle: 0.4,
    texture: txLuna,
  });

  // Nave
  naveModelo().then(() => {
    nave.position.x = 0;
    nave.position.y = -100;
    nave.position.z = -10;
  });

  t0 = Date.now();

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("keydown", onKeyDown, false);
  window.addEventListener("keyup", onKeyUp, false);
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  cameraShip.aspect = aspect;
  cameraShip.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
  if (e.key === "1") {
    activeCamera = camera;
  } else if (e.key === "2") {
    activeCamera = cameraShip;
  }

  if (e.key in teclas) {
    teclas[e.key] = true;
  }
}

function onKeyUp(e) {
  if (e.key in teclas) {
    teclas[e.key] = false;
  }
}

function Esfera(
  parent,
  px,
  py,
  pz,
  radio,
  nx,
  ny,
  col,
  texture = undefined,
  texbump = undefined,
  texspec = undefined,
  texalpha = undefined,
  sombra = false
) {
  const geometry = new THREE.SphereGeometry(radio, nx, ny);
  const material = new THREE.MeshPhongMaterial({
    color: col,
  });

  if (texture !== undefined) {
    material.map = texture;
  }
  if (texbump !== undefined) {
    material.bumpMap = texbump;
    material.bumpScale = 1;
  }
  if (texspec !== undefined) {
    material.specularMap = texspec;
    material.specular = new THREE.Color("orange");
  }
  if (texalpha !== undefined) {
    material.alphaMap = texalpha;
    material.transparent = true;
    material.side = THREE.DoubleSide;
    material.opacity = 1.0;
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(px, py, pz);

  if (sombra) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }

  parent.add(mesh);
  objetos.push(mesh);
  return mesh;
}

// Sol
function estrellaFn(rad, col, texture = undefined) {
  const geom = new THREE.SphereGeometry(rad, 32, 32);
  let mat;

  if (texture !== undefined) {
    mat = new THREE.MeshBasicMaterial({
      map: texture,
    });
  } else {
    mat = new THREE.MeshBasicMaterial({ color: col });
  }

  estrella = new THREE.Mesh(geom, mat);
  estrella.position.set(0, 0, 0);
  scene.add(estrella);
}

// Fondo
function fondo(textureFondo) {
  const geoFondo = new THREE.SphereGeometry(500, 64, 64);
  const matFondo = new THREE.MeshBasicMaterial({
    map: textureFondo,
    side: THREE.BackSide,
  });
  const esferaFondo = new THREE.Mesh(geoFondo, matFondo);
  scene.add(esferaFondo);
}

function planeta({
  radio = 1,
  dist = 10,
  vel = 0.001,
  color = 0xffffff,
  f1 = 1,
  f2 = 1,
  texture = undefined,
  bump = undefined,
  spec = undefined,
  alpha = undefined,
}) {
  const p = Esfera(
    scene,
    dist,
    0,
    0,
    radio,
    40,
    40,
    color,
    texture,
    bump,
    spec,
    alpha,
    true
  );

  p.userData = {
    dist: dist,
    speed: vel,
    f1: f1,
    f2: f2,
  };

  Planetas.push(p);
  return p;
}

function luna({
  planeta,
  radio = 0.2,
  dist = 2,
  vel = 0.002,
  color = 0xffffff,
  angle = 0,
  texture = undefined,
  bump = undefined,
  spec = undefined,
  alpha = undefined,
}) {
  const pivote = new THREE.Object3D();
  pivote.rotation.x = angle;
  planeta.add(pivote);

  const l = Esfera(
    pivote,
    dist,
    0,
    0,
    radio,
    32,
    32,
    color,
    texture,
    bump,
    spec,
    alpha,
    true
  );

  l.userData = {
    dist: dist,
    speed: vel,
    pivote: pivote,
  };

  Lunas.push(l);
  return l;
}

function naveModelo() {
  return new Promise((resolve, reject) => {
    const mtlLoader = new MTLLoader();
    const basePath = "src/models/";

    mtlLoader.setResourcePath(basePath);
    mtlLoader.setPath(basePath);

    mtlLoader.load("Spitfire.mtl", (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(basePath);

      objLoader.load("Spitfire.obj", (obj) => {
        nave = obj;

        nave.scale.set(0.1, 0.1, 0.1);
        nave.rotation.x = -Math.PI / 2;
        nave.rotation.z = Math.PI;

        scene.add(nave);
        resolve(nave);
      });
    });
  });
}

function animationLoop() {
  timestamp = (Date.now() - t0) * accglobal;
  requestAnimationFrame(animationLoop);

  // Órbita de planetas
  for (let planeta of Planetas) {
    planeta.position.x =
      Math.cos(timestamp * planeta.userData.speed) *
      planeta.userData.f1 *
      planeta.userData.dist;
    planeta.position.y =
      Math.sin(timestamp * planeta.userData.speed) *
      planeta.userData.f2 *
      planeta.userData.dist;
  }

  // Órbita de lunas
  for (let luna of Lunas) {
    luna.position.x =
      Math.cos(timestamp * luna.userData.speed) * luna.userData.dist;
    luna.position.y =
      Math.sin(timestamp * luna.userData.speed) * luna.userData.dist;
  }

  // Rotación propia
  for (let object of objetos) {
    object.rotation.y += 0.003;
  }

  // Control nave
  if (nave) {
    if (activeCamera === cameraShip) {
      // Girar rumbo
      if (teclas.a) {
        nave.rotation.z += GIRO_VELOCIDAD;
      }
      if (teclas.d) {
        nave.rotation.z -= GIRO_VELOCIDAD;
      }

      // Normalizar
      if (nave.rotation.z > Math.PI) {
        nave.rotation.z -= Math.PI * 2;
      }
      if (nave.rotation.z < -Math.PI) {
        nave.rotation.z += Math.PI * 2;
      }

      // Girar morro
      if (teclas.q) {
        roll += ROLL_VELOCIDAD;
      }
      if (teclas.e) {
        roll -= ROLL_VELOCIDAD;
      }

      nave.rotation.y = roll;

      // Acelerar / frenar
      if (teclas.w) {
        velocidadAdelante += ACELERACION;
        if (velocidadAdelante > VELOCIDAD_MAX) {
          velocidadAdelante = VELOCIDAD_MAX;
        }
      } else if (teclas.s) {
        velocidadAdelante -= ACELERACION;
        if (velocidadAdelante < -VELOCIDAD_MAX) {
          velocidadAdelante = -VELOCIDAD_MAX;
        }
      } else {
        velocidadAdelante *= 0.95;
      }

      // Dirección adelante
      const adelanteLocal = new THREE.Vector3(0, 0, 1);

      const adelanteMundo = adelanteLocal
        .clone()
        .applyQuaternion(nave.quaternion)
        .normalize();

      // Mover nave
      nave.position.addScaledVector(adelanteMundo, velocidadAdelante);

      // Cámara follow
      if (cameraShip) {
        const distanciaDetras = 5.0;
        const alturaCam = 1.5;

        const camPos = new THREE.Vector3()
          .copy(nave.position)
          .addScaledVector(adelanteMundo, -distanciaDetras)
          .add(new THREE.Vector3(0, 0, alturaCam));

        cameraShip.position.copy(camPos);

        const lookTarget = new THREE.Vector3()
          .copy(nave.position)
          .addScaledVector(adelanteMundo, 10);

        cameraShip.lookAt(lookTarget);
      }
    }
  }

  renderer.render(scene, activeCamera);
}
