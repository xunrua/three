import { createBaseScene, type Lesson } from "../router";
import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/Addons.js";

export default {
  id: "light",
  title: "光源",
  icon: "Lightbulb",
  category: "核心",
  init: async (container: HTMLElement) => {
    const { scene, cleanup, gui } = createBaseScene(container);

    // question: 这是什么光源？怎么工作？有什么作用？
    // answer: 环境光，从所有方向照射过来，没有衰减，用于模拟环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.color = new THREE.Color(0xffffff);
    ambientLight.intensity = 0.5;
    scene.add(ambientLight);
    const ambientFolder = gui.addFolder("环境光");
    ambientFolder.add(ambientLight, "intensity").min(0).max(1).step(0.001);
    ambientFolder.add(ambientLight.color, "r").min(0).max(1).step(0.001);
    ambientFolder.add(ambientLight.color, "g").min(0).max(1).step(0.001);
    ambientFolder.add(ambientLight.color, "b").min(0).max(1).step(0.001);
    ambientFolder.add(ambientLight, "visible");

    // question: 这是什么光源？怎么工作？有什么作用？
    // answer: 平行光，从一个方向照射过来，没有衰减，用于模拟太阳光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const directionaHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2
    );
    scene.add(directionalLight, directionaHelper);
    const directFolder = gui.addFolder("平行光");
    directFolder.add(directionalLight, "intensity").min(0).max(1).step(0.001);
    directFolder
      .add(directionalLight.position, "x")
      .min(-10)
      .max(10)
      .step(0.001);
    directFolder
      .add(directionalLight.position, "y")
      .min(-10)
      .max(10)
      .step(0.001);
    directFolder
      .add(directionalLight.position, "z")
      .min(-10)
      .max(10)
      .step(0.001);
    directFolder.add(directionalLight, "visible");

    // question: 这是什么光源？怎么工作？有什么作用？
    // answer: 点光源，从一个点照射过来，有衰减，用于模拟灯泡光
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    const pointHelper = new THREE.PointLightHelper(pointLight, 0.2, 0xff0000);
    scene.add(pointLight, pointHelper);
    const pointFolder = gui.addFolder("点光源");
    pointFolder.add(pointLight, "intensity").min(0).max(1).step(0.001);
    pointFolder.add(pointLight.position, "x").min(-2).max(2).step(0.001);
    pointFolder.add(pointLight.position, "y").min(-2).max(2).step(0.001);
    pointFolder.add(pointLight.position, "z").min(-2).max(2).step(0.001);
    pointFolder.add(pointLight, "visible");

    // question: 这是什么光源？怎么工作？有什么作用？
    // answer: 矩形光源，从一个方向照射过来，有衰减，用于模拟手电筒光
    // note: 矩形光源有四个参数，第一个参数是颜色，第二个参数是强度，第三个参数是宽度，第四个参数是高度
    // note: 矩形光源仅对标准材质、物理材质有效
    const rect = new THREE.RectAreaLight(0x4e00ff, 0.5, 1, 1);
    const rectHelper = new RectAreaLightHelper(rect, 0x00ff00);
    scene.add(rect, rectHelper);
    const rectFolder = gui.addFolder("矩形光源");
    rectFolder.add(rect, "intensity").min(0).max(1).step(0.001);
    rectFolder.add(rect.position, "x").min(-2).max(2).step(0.001);
    rectFolder.add(rect.position, "y").min(-2).max(2).step(0.001);
    rectFolder.add(rect.position, "z").min(-2).max(2).step(0.001);
    rectFolder.add(rect, "visible").setValue(1);

    // question: 这是什么光源？怎么工作？有什么作用？
    // answer: 半球光，从一个方向照射过来，有衰减，用于模拟天空光
    // note: 半球光有三个参数，第一个参数是天空颜色，第二个参数是地平线颜色，第三个参数是强度
    // note：仅对标准材质、物理材质有效
    const hemisphere = new THREE.HemisphereLight(0xff0000, 0x0000ff);
    const hemisphereHelper = new THREE.HemisphereLightHelper(hemisphere, 0.5);
    scene.add(hemisphere, hemisphereHelper);
    const hemisphereFolder = gui.addFolder("半球光");
    hemisphereFolder.add(hemisphere, "intensity").min(0).max(1).step(0.001);
    hemisphereFolder.add(hemisphere.color, "r").min(0).max(1).step(0.001);
    hemisphereFolder.add(hemisphere.color, "g").min(0).max(1).step(0.001);
    hemisphereFolder.add(hemisphere.color, "b").min(0).max(1).step(0.001);
    hemisphereFolder.add(hemisphere, "visible");

    // question: 这是什么光源？怎么工作？有什么作用？
    // answer: 聚光灯，从一个方向照射过来，有衰减，用于模拟手电筒光
    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 2, Math.PI * 0.5);
    const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0xff0000);
    scene.add(spotLight, spotLightHelper);
    const spotFolder = gui.addFolder("聚光灯");
    spotFolder.add(spotLight, "intensity").min(0).max(1).step(0.001);
    spotFolder.add(spotLight.position, "x").min(-2).max(2).step(0.001);
    spotFolder.add(spotLight.position, "y").min(-2).max(2).step(0.001);
    spotFolder.add(spotLight.position, "z").min(-2).max(2).step(0.001);
    spotFolder.add(spotLight, "visible");

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.4;

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      material
    );
    sphere.position.x = -1.5;

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 0.75),
      material
    );

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 32, 64),
      material
    );
    torus.position.x = 1.5;

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;

    scene.add(sphere, cube, torus, plane);

    // camera.position.set(0, 2, 8);

    // const fontLoader = new FontLoader();
    // const matcapTexture = new THREE.TextureLoader().load(
    //   "/textures/matcaps/8.png"
    // );
    // fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    //   const text = new TextGeometry("Hello, Three.js!", {
    //     font: font,
    //     size: 1,
    //     depth: 0, // 文本的深度
    //     curveSegments: 10, // 文本的曲线段数
    //     // question: 什么是 bevel？
    //     // answer: bevel 是一种效果，用于在文本的边缘添加一个斜面，使其看起来更立体。
    //     bevelEnabled: true,
    //     bevelThickness: 1, // bevel 的厚度
    //     bevelSize: 0.02, // bevel 的大小
    //     bevelOffset: 0, // bevel 的偏移量
    //     bevelSegments: 1, // bevel 的段数
    //   });

    //   text.computeBoundingBox();
    //   text.center();
    //   // text.translate(
    //   //   -text.boundingBox?.max?.x * 0.5 || 0,
    //   //   -text.boundingBox?.max?.y * 0.5 || 0,
    //   //   0
    //   // );

    //   const material = new THREE.MeshMatcapMaterial({
    //     // wireframe: true,
    //     matcap: matcapTexture,
    //   });
    //   const mesh = new THREE.Mesh(text, material);

    //   scene.add(mesh);
    //   const torusGeometry = new THREE.TorusGeometry(0.2, 0.1, 32, 64);

    //   for (let i = 0; i < 200; i++) {
    //     const donut = new THREE.Mesh(torusGeometry, material);
    //     // donut.position.set(
    //     //   (Math.random() - 0.5) * 20,
    //     //   (Math.random() - 0.5) * 20,
    //     //   (Math.random() - 0.5) * 20
    //     // );
    //     // donut.position.set(
    //     //   Math.random() * 20 - 10,
    //     //   Math.random() * 20 - 10,
    //     //   Math.random() * 20 - 10
    //     // );
    //     donut.position.set(
    //       (Math.random() - 0.5) * 20,
    //       (Math.random() - 0.5) * 20,
    //       (Math.random() - 0.5) * 20
    //     );

    //     donut.rotation.set(
    //       (Math.random() * Math.PI) / 2,
    //       (Math.random() * Math.PI) / 2,
    //       (Math.random() * Math.PI) / 2
    //     );

    //     donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    //     scene.add(donut);

    //     // gsap.to(mesh.rotation, {
    //     //   y: Math.PI * 2,
    //     //   duration: 1,
    //     //   repeat: -1,
    //     //   ease: "none",
    //     //   yoyo: true,
    //     // });

    //     gsap.to(mesh.position, {
    //       y: 0.5,
    //       duration: 2,
    //       repeat: -1,
    //       yoyo: true,
    //       ease: "sine.inOut",
    //     });
    //   }
    // });

    // 调整相机位置

    // // 加载环境贴图
    // const loader = new HDRLoader();
    // loader.load("/textures/environmentMap/2k.hdr", (envMap) => {
    //   // question: 什么是 EquirectangularReflectionMapping？
    //   // answer: EquirectangularReflectionMapping 是一种映射方式，用于将环境贴图映射到球体上，使其看起来像一个反射环境。
    //   envMap.mapping = THREE.EquirectangularReflectionMapping;
    //   scene.environment = envMap;
    //   scene.background = envMap;
    // });

    return cleanup;
  },
} satisfies Lesson;
