import { createBaseScene } from "../router";
import type { Lesson } from "../router";
import * as THREE from "three";

export default {
  id: "first-scene",
  title: "第一个场景",
  icon: "Box",
  category: "基础",
  init: (container: HTMLElement) => {
    const { scene, cleanup } = createBaseScene(container);

    // 创建一个简单的立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 添加坐标轴辅助器
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    return cleanup;
  },
} as const satisfies Lesson;