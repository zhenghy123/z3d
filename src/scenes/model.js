import { init } from "./scene";
import { LoadingManager, Box3, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module'



export class Model {
  constructor() {

    const { scene, camera, renderer,stats } = init()
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.stats=stats

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    let box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'red' }))
    this.scene.add(box)


    {
      // 环境光
      const light = new THREE.AmbientLight(0x404040, 0.8); // soft white light
      scene.add(light);

      // 平行光-默认在上方
      const directionalLight = new THREE.DirectionalLight(0xffffff);
      scene.add(directionalLight);
    }

    this.update = this.update.bind(this)
    this.update()
  }

  loadGLTF (url) {
    // 通过 unpkg 可以访问 three 的静态资源
    const THREE_PATH = `https://unpkg.com/three@0.${THREE.REVISION}.x`;
    const MANAGER = new LoadingManager()
    const DRACO_LOADER = new DRACOLoader(MANAGER).setDecoderPath(`${THREE_PATH}/examples/js/libs/draco/gltf/`)
    const KTX2_LOADER = new KTX2Loader(MANAGER).setTranscoderPath(`${THREE_PATH}/examples/js/libs/basis/`)

    const baseURL = THREE.LoaderUtils.extractUrlBase(url);
    // set只是表示设置这些扩展loader，具体是否使用会根据模型返回扩展信息判断
    const loader = new GLTFLoader(MANAGER)
      .setCrossOrigin('anonymous')
      .setDRACOLoader(DRACO_LOADER)
      .setKTX2Loader(KTX2_LOADER.detectSupport(this.renderer))
      .setMeshoptDecoder(MeshoptDecoder)

    // MANAGER.setURLModifier((url, path) => {
    //   return path || '' + url
    // })

    loader.load(url, (glb) => {
      console.error(glb)
      const root = glb.scene || glb.scenes[0]
      const ratio = 0.001
      root.scale.set(ratio, ratio, ratio)
      this.scene.add(root)

      const { boxSize, boxCenter } = this.getModelSize(root)
      console.log(boxSize, boxCenter);

      this.setFitPosition(boxSize, boxCenter)

    },
      (xhr) => {
        // console.log((xhr.loaded / (xhr.total + 0.001)) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error happened on load glb :', error);
      })
  }


  loadFBX () { }

  loadOBJ () { }

  getModelSize (model) {
    const box = new Box3().setFromObject(model)
    const boxSize = box.getSize(new Vector3())
    const boxCenter = box.getCenter(new Vector3())

    return { boxSize, boxCenter }
  }

  setFitPosition (boxSize, boxCenter) {
    const sizeToFitOnScreen = boxSize.length() * 0.15
    // const fov = THREE.MathUtils.degToRad(this.camera.fov * 0.5)
    // const distance = sizeToFitOnScreen / Math.tan(fov)

    // const dirction = new Vector3().subVectors(this.camera.position, boxCenter)
    //   .multiply(new Vector3(0, -1, 1))
    //   .normalize()

    // this.camera.position.copy(dirction.multiplyScalar(distance)).add(boxCenter)
    this.camera.position.set(0, sizeToFitOnScreen, sizeToFitOnScreen)
    this.camera.target = boxCenter
    // this.camera.far = boxSize.length() * 2
    this.controls.target.copy(boxCenter)

    this.camera.lookAt(boxCenter)
    this.camera.updateProjectionMatrix()

  }

  update (time) {
    this.stats.update()
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.update)
  }


}