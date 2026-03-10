import gsap from "gsap";
import { createBaseScene, type Lesson } from "../router";
import * as THREE from "three";

export default {
  id: "ghost-house",
  title: "鬼屋",
  icon: "House",
  category: "核心",
  init: async (container: HTMLElement) => {
    const { scene, cleanup, gui, renderer, camera } =
      createBaseScene(container);

    camera.position.z = 10;
    camera.position.y = 10;
    camera.position.x = 10;

    // 房子
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshBasicMaterial({ color: 0x8b4513 })
    );
    walls.position.y = 1.25;
    houseGroup.add(walls);

    // 屋顶
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(4.5, 2, 4),
      new THREE.MeshBasicMaterial({ color: 0x663300 })
    );
    roof.position.y = 2.5 + 1;
    roof.rotation.y = Math.PI * 0.25;
    houseGroup.add(roof);

    // 门
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.8),
      new THREE.MeshBasicMaterial({ color: 0x420042 })
    );
    door.position.y = 0.9;
    door.position.z = 2 + 0.01;
    houseGroup.add(door);

    // 灌木丛
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshBasicMaterial({ color: 0x89c854 });
    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(1.5, 0.2, 2.2);
    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.5, 0.5, 0.5);
    bush2.position.set(-1.2, 0.2, 2.2);
    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.2, 0.2, 0.2);
    bush3.position.set(-1.5, 0.2, 2.6);
    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.3, 0.3, 0.3);
    bush4.position.set(1, 0.2, 2.2);
    houseGroup.add(bush1, bush2, bush3, bush4);

    // 地板
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({
        color: 0x969696,
      })
    );
    plane.rotation.x = -Math.PI * 0.5;
    scene.add(plane);
    return cleanup;
  },
} satisfies Lesson;
