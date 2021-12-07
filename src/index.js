import * as THREE from 'three'
window.THREE = THREE
// import * as package  from '../package.json'
import { Model } from './scenes/model'

export * from './constants'
export * from './utils'




export const z3d = {
  // version: package.version,
  Model
}

if (typeof window !== 'undefined') {
  if (window.z3d) {
    console.warn('WARNING: Multiple instances of z3d being imported.');
  } else {
    window.z3d = z3d;
  }
}


window.zz = new z3d.Model()
zz.loadGLTF('./园区渲染重命名02.gltf')