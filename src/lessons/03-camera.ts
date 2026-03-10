import { createBaseScene } from "../router";
import type { Lesson } from "../router";
import * as THREE from "three";

export default {
  id: "camera",
  title: "相机控制",
  icon: "Camera",
  category: "基础",
  init: (container: HTMLElement) => {
    const { scene, camera, cleanup } = createBaseScene(container);

    // 创建物体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 坐标轴辅助器
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    // 鼠标控制相机
    const cursor = { x: 0, y: 0 };
    const onMouseMove = (event: MouseEvent) => {
      cursor.x = event.clientX / container.clientWidth - 0.5;
      cursor.y = -(event.clientY / container.clientHeight - 0.5);
    };
    container.addEventListener("mousemove", onMouseMove);

    // 动画循环中更新相机位置
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
      camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
      camera.position.y = cursor.y * 5;
      camera.lookAt(mesh.position);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousemove", onMouseMove);
      cleanup();
    };
  },
} as const satisfies Lesson;