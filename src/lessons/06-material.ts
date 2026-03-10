import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { createBaseScene, type Lesson } from "../router";
import * as THREE from "three";

export default {
  id: "material",
  title: "材质",
  icon: "Palette",
  category: "核心",
  init: async (container: HTMLElement) => {
    const { scene, cleanup, camera } = createBaseScene(container);

    // 调整相机位置
    camera.position.set(0, 2, 8);

    // 纹理加载器
    const textureLoader = new THREE.TextureLoader();

    // 加载 matcap 纹理
    const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
    matcapTexture.colorSpace = THREE.SRGBColorSpace;
    matcapTexture.rotation = Math.PI / 2;

    // 加载 door 纹理
    const doorTexture = textureLoader.load("/textures/door/color.jpg");
    doorTexture.colorSpace = THREE.SRGBColorSpace;

    // 环境光遮蔽贴图
    const aoTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");

    // 高度贴图
    const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");

    // 金属贴图
    const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");

    // 粗糙贴图
    const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

    // question: 什么是 法线贴图
    // answer: 法线贴图用于添加表面的细节，而不需要增加多边形的数量。它通过模拟光线在表面的反射方向来工作，从而使对象看起来更真实。
    const normalTexture = textureLoader.load("/textures/door/normal.jpg");

    // question: 什么是 透明贴图
    // answer: 透明贴图用于控制对象的透明度，其中白色表示完全不透明，黑色表示完全透明。它允许对象显示 underlying material 或 texture。
    const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");

    // 加载环境贴图
    const loader = new HDRLoader();
    loader.load("/textures/environmentMap/2k.hdr", (envMap) => {
      // question: 什么是 EquirectangularReflectionMapping？
      // answer: EquirectangularReflectionMapping 是一种映射方式，用于将环境贴图映射到球体上，使其看起来像一个反射环境。
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = envMap;
      scene.background = envMap;
    });
    // const envMap = await loader.loadAsync("/textures/environmentMap/2k.hdr");
    // envMap.mapping = THREE.EquirectangularReflectionMapping;
    // scene.environment = envMap;

    // 材质列表
    const materials = [
      {
        name: "MeshBasicMaterial",
        desc: "基础材质，不受光照影响",
        material: new THREE.MeshBasicMaterial({ color: 0x4ecdc4 }),
      },
      {
        name: "MeshNormalMaterial",
        desc: "法线材质，显示法线颜色",
        material: new THREE.MeshNormalMaterial(),
      },
      {
        name: "MeshMatcapMaterial",
        desc: "Matcap材质，预渲染纹理",
        material: new THREE.MeshMatcapMaterial({ matcap: matcapTexture }),
      },
      {
        name: "MeshLambertMaterial",
        desc: "Lambert材质，漫反射",
        material: new THREE.MeshLambertMaterial({ color: 0xff6b6b }),
      },
      {
        name: "MeshPhongMaterial",
        desc: "Phong材质，有高光",
        material: new THREE.MeshPhongMaterial({
          // color: 0x45b7d1,
          // shininess: 100,
        }),
      },
      {
        name: "MeshStandardMaterial",
        desc: "标准PBR材质",
        material: new THREE.MeshStandardMaterial({
          // color: 0xffeaa7,
          // metalness: 0.9,
          // roughness: 0.1,
          map: doorTexture,
          aoMap: aoTexture,
          // 设置环境光遮蔽贴图强度
          aoMapIntensity: 1,
          // 设置高度贴图强度
          displacementMap: doorHeightTexture,
          displacementScale: 0.2,
          metalnessMap: metalnessTexture,
          roughnessMap: roughnessTexture,
          normalMap: normalTexture,
          normalScale: new THREE.Vector2(0.5, 0.5),
          transparent: true,
          alphaMap: alphaTexture, // 需要设置 transparent 为 true 才有效
        }),
      },
      {
        name: "MeshBasicMaterial + Texture",
        desc: "基础材质 + 纹理",
        material: new THREE.MeshBasicMaterial({ map: doorTexture }),
      },
    ];

    // 创建每个材质的展示
    const columns = 4;
    const spacing = 2.5;

    materials.forEach((item, i) => {
      const row = Math.floor(i / columns);
      const col = i % columns;

      const x = (col - (columns - 1) / 2) * spacing;
      const y = -row * spacing;

      // 创建几何体组合
      const sphere = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 2, 100, 100),
        // new THREE.PlaneGeometry(1, 2),
        item.material
      );
      item.material.side = THREE.DoubleSide;
      sphere.position.set(x, y, 0);
      scene.add(sphere);

      // 创建文字标签（使用 sprite）
      const createLabel = (
        text: string,
        y: number,
        size: number,
        color: string
      ) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = 256;
        canvas.height = 64;

        ctx.fillStyle = color;
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(text, 128, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(x, y, 0);
        sprite.scale.set(2, 0.5, 1);
        return sprite;
      };

      const nameLabel = createLabel(item.name, y + 0.8, 20, "#ffffff");
      scene.add(nameLabel);

      const descLabel = createLabel(item.desc, y - 0.8, 14, "#888888");
      scene.add(descLabel);
    });

    // 添加光源（Lambert、Phong、Standard 材质需要光源）
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 50, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 30, 100);
    pointLight2.position.set(-5, -2, 5);
    scene.add(pointLight2);

    return cleanup;
  },
} satisfies Lesson;
