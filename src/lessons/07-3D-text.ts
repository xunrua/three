import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { createBaseScene, type Lesson } from "../router";
import * as THREE from "three";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

export default {
  id: "3DText",
  title: "3D文本",
  icon: "Text",
  category: "核心",
  init: async (container: HTMLElement) => {
    const { scene, cleanup, camera } = createBaseScene(container);

    const fontLoader = new FontLoader();
    const matcapTexture = new THREE.TextureLoader().load(
      "/textures/matcaps/8.png"
    );
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const text = new TextGeometry("Hello, Three.js!", {
        font: font,
        size: 1,
        depth: 0, // 文本的深度
        curveSegments: 10, // 文本的曲线段数
        // question: 什么是 bevel？
        // answer: bevel 是一种效果，用于在文本的边缘添加一个斜面，使其看起来更立体。
        bevelEnabled: true,
        bevelThickness: 1, // bevel 的厚度
        bevelSize: 0.02, // bevel 的大小
        bevelOffset: 0, // bevel 的偏移量
        bevelSegments: 1, // bevel 的段数
      });

      text.computeBoundingBox();
      text.center();
      // text.translate(
      //   -text.boundingBox?.max?.x * 0.5 || 0,
      //   -text.boundingBox?.max?.y * 0.5 || 0,
      //   0
      // );

      const material = new THREE.MeshMatcapMaterial({
        // wireframe: true,
        matcap: matcapTexture,
      });
      const mesh = new THREE.Mesh(text, material);

      scene.add(mesh);
      const torusGeometry = new THREE.TorusGeometry(0.2, 0.1, 32, 64);

      for (let i = 0; i < 200; i++) {
        const donut = new THREE.Mesh(torusGeometry, material);
        // donut.position.set(
        //   (Math.random() - 0.5) * 20,
        //   (Math.random() - 0.5) * 20,
        //   (Math.random() - 0.5) * 20
        // );
        // donut.position.set(
        //   Math.random() * 20 - 10,
        //   Math.random() * 20 - 10,
        //   Math.random() * 20 - 10
        // );
        donut.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );

        donut.rotation.set(
          (Math.random() * Math.PI) / 2,
          (Math.random() * Math.PI) / 2,
          (Math.random() * Math.PI) / 2
        );

        donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        scene.add(donut);

        // gsap.to(mesh.rotation, {
        //   y: Math.PI * 2,
        //   duration: 1,
        //   repeat: -1,
        //   ease: "none",
        //   yoyo: true,
        // });

        gsap.to(mesh.position, {
          y: 0.5,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    // 调整相机位置
    camera.position.set(0, 2, 8);

    // 加载环境贴图
    const loader = new HDRLoader();
    loader.load("/textures/environmentMap/2k.hdr", (envMap) => {
      // question: 什么是 EquirectangularReflectionMapping？
      // answer: EquirectangularReflectionMapping 是一种映射方式，用于将环境贴图映射到球体上，使其看起来像一个反射环境。
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = envMap;
      scene.background = envMap;
    });

    return cleanup;
  },
} satisfies Lesson;
