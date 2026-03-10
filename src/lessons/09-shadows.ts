import gsap from "gsap";
import { createBaseScene, type Lesson } from "../router";
import * as THREE from "three";

export default {
  id: "shadows",
  title: "阴影",
  icon: "AlignHorizontalSpaceAround",
  category: "核心",
  init: async (container: HTMLElement) => {
    const { scene, cleanup, gui, renderer, camera } =
      createBaseScene(container);

    camera.position.z = 3;

    // 阴影
    // 平行光、点光、聚光灯 可以使用阴影

    // question: 这是什么光源？怎么工作？有什么作用？
    // answer: 环境光，从所有方向照射过来，没有衰减，用于模拟环境光
    // 提供基础亮度
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
    scene.add(ambientLight);

    // question: 这是什么光源？怎么工作？有什么作用？
    // answer: 平行光，从一个方向照射过来，没有衰减，用于模拟太阳光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(2, 2, -1);
    // 激活阴影
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    const shadowCamera = directionalLight.shadow.camera;
    shadowCamera.near = 1;
    shadowCamera.far = 6;
    shadowCamera.top = 2;
    shadowCamera.bottom = -2;
    shadowCamera.left = -2;
    shadowCamera.right = 2;
    directionalLight.shadow.radius = 10;

    gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
    gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
    gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
    gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
    scene.add(directionalLight);
    const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    shadowHelper.visible = false;
    scene.add(shadowHelper);

    // 聚光灯
    const spotLight = new THREE.SpotLight(0xffffff, 1, 10, Math.PI * 0.3);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.fov = 30;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;

    spotLight.position.set(0, 2, 2);
    scene.add(spotLight);
    scene.add(spotLight.target);
    const spotCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    spotCameraHelper.visible = false;
    scene.add(spotCameraHelper);

    const point = new THREE.PointLight(0xffffff, 0.4);
    point.castShadow = true;
    point.shadow.mapSize.width = 1024;
    point.shadow.mapSize.height = 1024;
    point.shadow.camera.near = 0.1;
    point.shadow.camera.far = 5;
    point.position.set(-1, 1, 0);
    scene.add(point);
    const pointCameraHelper = new THREE.CameraHelper(point.shadow.camera);
    pointCameraHelper.visible = false;
    scene.add(pointCameraHelper);

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.7;
    material.metalness = 0;

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      // new THREE.BoxGeometry(1, 1, 1),
      material
    );
    sphere.castShadow = true;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      material
      // new THREE.MeshBasicMaterial({ map: bakedShadow })
    );
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;

    const textureLoader = new THREE.TextureLoader();
    // 烘焙阴影
    // const bakedShadow = textureLoader.load("/textures/shadow/bakedShadow.jpg");
    const simpleShadow = textureLoader.load(
      "/textures/shadow/simpleShadow.jpg"
    );
    const sphereShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
      })
    );
    sphereShadow.rotation.x = -Math.PI * 0.5;
    sphereShadow.position.y = plane.position.y + 0.01;
    scene.add(sphereShadow);

    // 接收阴影
    plane.receiveShadow = true;
    // 启用阴影
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    scene.add(sphere, plane);

    gsap.ticker.add(() => {
      const t = gsap.ticker.time;
      sphere.position.x = Math.cos(t);
      sphere.position.z = Math.sin(t);
      sphere.position.y = Math.abs(Math.sin(t));

      sphereShadow.position.x = sphere.position.x;
      sphereShadow.position.z = sphere.position.z;
      sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;
    });
    return cleanup;
  },
} satisfies Lesson;
