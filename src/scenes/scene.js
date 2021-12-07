
import { fov, near, far } from '../constants'
import Stats from 'three/examples/jsm/libs/stats.module'

function init (container, dev = true) {
  var scene, camera, renderer, stats
  container = container || document.body

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.outputEncoding = THREE.sRGBEncoding;

  window.addEventListener('resize', () => {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });


  if (dev) {
    const axesHelper = new THREE.AxesHelper(far);
    scene.add(axesHelper);

    stats = new Stats();

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '0px';
    document.body.appendChild(stats.domElement);
  }

  container.appendChild(renderer.domElement);

  return { scene, camera, renderer, stats };
}


export { init, }
