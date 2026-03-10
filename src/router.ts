import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { icons } from "lucide";
import GUI from "lil-gui";

// lucide 图标名称类型
export type IconName = keyof typeof icons;

// 定义学习模块的类型
export interface Lesson {
  id: string;
  title: string;
  icon: IconName; // lucide 图标名称，有类型提示
  category: string;
  init: (container: HTMLElement) => (() => void) | Promise<() => void>;
}

// 调试管理器
class DebugManager {
  private gui: GUI | null = null;

  create(): GUI {
    this.destroy();
    this.gui = new GUI({ title: "Debug" });
    return this.gui;
  }

  destroy() {
    if (this.gui) {
      this.gui.destroy();
      this.gui = null;
    }
  }

  getGui(): GUI | null {
    return this.gui;
  }
}

export const debugManager = new DebugManager();

// 场景管理器
class SceneManager {
  private cleanup: (() => void) | null = null;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async load(lesson: Lesson) {
    // 清理之前的场景
    if (this.cleanup) {
      this.cleanup();
    }

    // 清空容器
    this.container.innerHTML = "";

    // 初始化新场景（支持异步）
    this.cleanup = await lesson.init(this.container);
  }

  destroy() {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
  }
}

// 路由器
export class Router {
  private sceneManager: SceneManager;
  private currentLesson: string | null = null;
  private lessons: Map<string, Lesson> = new Map();
  private isReady = false;

  constructor(container: HTMLElement) {
    this.sceneManager = new SceneManager(container);
    window.addEventListener("hashchange", () => this.handleRoute());
  }

  register(lesson: Lesson) {
    this.lessons.set(lesson.id, lesson);
  }

  // 所有模块注册完成后调用
  start() {
    this.isReady = true;
    this.handleRoute();
  }

  private handleRoute() {
    if (!this.isReady) return;

    const hash = window.location.hash.slice(1) || "";
    const lesson = this.lessons.get(hash);

    if (lesson) {
      this.currentLesson = hash;
      this.sceneManager.load(lesson);
      this.updateActiveNav(hash);
    } else {
      // 默认显示第一个
      const first = Array.from(this.lessons.values())[0];
      if (first) {
        window.location.hash = first.id;
      }
    }
  }

  private updateActiveNav(id: string) {
    document.querySelectorAll(".nav-item").forEach((el) => {
      el.classList.toggle("active", el.getAttribute("data-id") === id);
    });
  }

  getCurrentLesson() {
    return this.currentLesson;
  }
}

// 创建基础场景的工具函数
export function createBaseScene(container: HTMLElement) {
  const canvas = document.createElement("canvas");
  canvas.className = "webgl";
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const sizes = {
    width: container.clientWidth,
    height: container.clientHeight,
  };

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(1, 1, 2);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0a0a0f);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // 创建调试面板
  const gui = debugManager.create();

  // 窗口大小变化
  const onResize = () => {
    sizes.width = container.clientWidth;
    sizes.height = container.clientHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
  };
  window.addEventListener("resize", onResize);

  // 动画循环
  let animationId: number;
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // 返回清理函数和场景元素
  return {
    scene,
    camera,
    renderer,
    controls,
    canvas,
    gui,
    cleanup: () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      controls.dispose();
      scene.clear();
      debugManager.destroy();
    },
  };
}
