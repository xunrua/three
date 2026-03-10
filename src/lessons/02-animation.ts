import { createBaseScene } from "../router";
import type { Lesson } from "../router";
import * as THREE from "three";
import gsap from "gsap";

export default {
  id: "animation",
  title: "动画基础",
  icon: "Play",
  category: "基础",
  init: (container: HTMLElement) => {
    const { scene, cleanup } = createBaseScene(container);

    // 创建立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 坐标轴辅助器
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    // GSAP 动画
    gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
    gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });
    gsap.to(mesh.rotation, { duration: 2, delay: 1, y: Math.PI * 2 });

    return cleanup;
  },
} as const satisfies Lesson;