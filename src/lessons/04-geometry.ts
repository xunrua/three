import { createBaseScene } from "../router";
import type { Lesson } from "../router";
import * as THREE from "three";

export default {
  id: "geometry",
  title: "几何体",
  icon: "Hexagon",
  category: "核心",
  init: (container: HTMLElement) => {
    const { scene, cleanup } = createBaseScene(container);

    // 创建多种几何体
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1), // 立方体
      new THREE.SphereGeometry(0.5, 32, 32), // 球体
      new THREE.ConeGeometry(0.5, 1, 32), // 圆锥
      new THREE.TorusGeometry(0.4, 0.2, 16, 100), // 环面
      new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16), // 莫比乌斯带
    ];

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff6b6b, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x4ecdc4, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x45b7d1, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x96ceb4, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0xffeaa7, wireframe: true }),
    ];

    const meshes: THREE.Mesh[] = [];
    geometries.forEach((geo, i) => {
      const mesh = new THREE.Mesh(geo, materials[i]); // 创建网格对象
      mesh.position.x = (i - 2) * 2;
      scene.add(mesh);
      meshes.push(mesh);
    });

    // 坐标轴辅助器
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    return cleanup;
  },
} as const satisfies Lesson;
