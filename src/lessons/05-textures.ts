import { createBaseScene } from "../router";
import type { Lesson } from "../router";
import * as THREE from "three";

export default {
  id: "textures",
  title: "纹理",
  icon: "Image",
  category: "核心",
  init: (container: HTMLElement) => {
    const { scene, cleanup } = createBaseScene(container);

    // 创建纹理
    const textures = [
      "/textures/door/color.jpg", // 颜色
      "/textures/door/alpha.jpg", // 透明度
      "/textures/door/height.jpg", // 高度
      "/textures/door/normal.jpg", // 法线
      "/textures/door/ambientOcclusion.jpg", // 环境遮挡
      "/textures/door/metalness.jpg", // 金属ness
      "/textures/door/roughness.jpg", // 粗糙度
    ];

    // 创建Matcap纹理
    const matcaps = (i: number) => `/textures/matcaps/${i + 1}.png`;

    // 创建纹理加载器
    const textureLoader = new THREE.TextureLoader();
    // const matcapTexture = textureLoader.load(matcaps[0]);
    // matcapTexture.colorSpace = THREE.SRGBColorSpace;

    textures.forEach((texturePath, i) => {
      // 加载纹理
      const texture = textureLoader.load(texturePath);

      // q: 为什么需要设置纹理颜色空间？
      // a: 纹理颜色空间默认为线性颜色空间，需要设置为sRGB颜色空间
      texture.colorSpace = THREE.SRGBColorSpace;

      // 设置纹理过滤器
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.NearestFilter;
      const matcapTexture = textureLoader.load(matcaps(i));

      // 创建材质
      // q:这是什么材质，有什么作用？
      // a: MeshBasicMaterial会根据纹理信息生成颜色，从而实现更真实的材质效果
      // const material = new THREE.MeshBasicMaterial({ map: texture });

      // q:这是什么材质，有什么作用？
      // a: MeshNormalMaterial会根据顶点法线信息生成颜色，从而实现更真实的材质效果
      // const material = new THREE.MeshNormalMaterial({});

      // q:这是什么材质，有什么作用？
      // a: MeshMatcapMaterial会根据Matcap纹理信息生成颜色，从而实现更真实的材质效果
      const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

      // q:这是什么材质，有什么作用？
      // a: MeshStandardMaterial会根据物理标准信息生成颜色，从而实现更真实的材质效果
      // const material = new THREE.MeshStandardMaterial({ map: texture });

      // 设置材质双面
      // material.side = THREE.DoubleSide;

      // 创建网格对象
      const boxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1, 0),
        material
      );
      const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.25),
        material
      );
      const torusMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.05),
        material
      );

      boxMesh.position.x = i - 3;

      sphereMesh.position.x = i - 3;
      sphereMesh.position.y = -1;

      torusMesh.position.x = i - 3;
      torusMesh.position.y = 1;

      scene.add(boxMesh, sphereMesh, torusMesh);
    });

    // q: 这是什么光源，有什么作用？
    // a: 环境光会均匀地照亮场景中的所有对象
    // const light = new THREE.AmbientLight(0xffffff, 10);
    // scene.add(light);

    // q: 这是什么光源，有什么作用？
    // a: 点光源会从一个点向各个方向发射光线，照亮场景中的对象
    const pointLight = new THREE.PointLight(0xffffff, 10, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // 坐标轴辅助器
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    return cleanup;
  },
} satisfies Lesson;
