import "./style.css";
import { Router } from "./router";
import type { Lesson, IconName } from "./router";
import { createIcons, icons } from "lucide";

// 导入所有学习模块
import firstScene from "./lessons/01-first-scene";
import animation from "./lessons/02-animation";
import camera from "./lessons/03-camera";
import geometry from "./lessons/04-geometry";
import textures from "./lessons/05-textures";
import material from "./lessons/06-material";
import threeDText from "./lessons/07-3D-text";
import light from "./lessons/08-light";
import shadows from "./lessons/09-shadows";

// 学习模块列表
const lessons: Lesson[] = [
  firstScene,
  animation,
  camera,
  geometry,
  textures,
  material,
  threeDText,
  light,
  shadows,
];

// 分类图标映射
const categoryIcons: Record<string, IconName> = {
  基础: "BookOpen",
  核心: "Layers",
};

// 创建侧边栏 HTML
function createSidebar(): string {
  const categories = [...new Set(lessons.map((l) => l.category))];

  const navHTML = categories
    .map((category) => {
      const items = lessons.filter((l) => l.category === category);
      const categoryIcon = categoryIcons[category] || "folder";
      return `
        <div class="nav-section">
          <div class="nav-section-header expanded" data-category="${category}">
            <i data-lucide="chevron-right" class="chevron"></i>
            <i data-lucide="${categoryIcon}" class="category-icon"></i>
            <span class="nav-section-title">${category}</span>
          </div>
          <div class="nav-section-items expanded">
            ${items
              .map(
                (item) => `
              <div class="nav-item" data-id="${item.id}">
                <i data-lucide="${item.icon}" class="nav-item-icon"></i>
                <span class="nav-item-text">${item.title}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="sidebar collapsed" id="sidebar">
      <div class="sidebar-header">
        <div>
          <h1>Three.js 学习</h1>
        </div>
        <button class="toggle-btn collapsed" id="toggle-btn" title="收起菜单">
          <i data-lucide="panel-right-close" style="width: 20px; height: 20px;"></i>
        </button>
      </div>
      <nav class="sidebar-nav">
        ${navHTML}
      </nav>
    </div>
  `;
}

// 初始化应用
function init() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  // 创建布局
  app.innerHTML = `
    ${createSidebar()}
    <div class="main-content">
      <div id="canvas-container"></div>
    </div>
  `;

  // 初始化 lucide 图标
  createIcons({ icons });

  // 创建画布容器
  const canvasContainer =
    document.querySelector<HTMLElement>("#canvas-container")!;

  // 初始化路由
  const router = new Router(canvasContainer);

  // 注册所有学习模块
  lessons.forEach((lesson) => router.register(lesson));

  // 启动路由
  router.start();

  // 导航点击事件
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-id");
      if (id) {
        window.location.hash = id;
      }
    });
  });

  // 二级菜单展开/收起
  document.querySelectorAll(".nav-section-header").forEach((el) => {
    el.addEventListener("click", () => {
      const header = el as HTMLElement;
      const items = header.nextElementSibling as HTMLElement;

      header.classList.toggle("expanded");
      items.classList.toggle("expanded");
    });
  });

  // 侧边栏收起/展开
  const sidebar = document.getElementById("sidebar")!;
  const toggleBtn = document.getElementById("toggle-btn")!;

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    const isCollapsed = sidebar.classList.contains("collapsed");
    toggleBtn.title = isCollapsed ? "展开菜单" : "收起菜单";
    toggleBtn.innerHTML = isCollapsed
      ? '<i data-lucide="panel-left-open" style="width: 20px; height: 20px;"></i>'
      : '<i data-lucide="panel-left-close" style="width: 20px; height: 20px;"></i>';
    createIcons({ icons });
    setTimeout(() => {
      // 触发窗口 resize 事件，让画布更新大小
      window.dispatchEvent(new Event("resize"));
    }, 300);
  });
}

init();
