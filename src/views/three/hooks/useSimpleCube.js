import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    dom.value.appendChild(renderer.domElement);
    return renderer;
};

const initCamera = (dom) => {
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    return camera;
};

const initScene = () => {
    return new THREE.Scene();
};

const initControls = (camera, renderer) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    return controls;
};

const initObjects = (scene) => {
    // 创建立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 创建线框
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);

    return { cube, line };
};

export const useSimpleCube = (dom) => {
    const scene = new THREE.Scene();
    const camera = initCamera(dom);
    const renderer = initRenderer(dom);
    const controls = initControls(camera, renderer);
    const { cube, line } = initObjects(scene);

    // 窗口大小变化处理
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.clientWidth, dom.value.clientHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // 动画循环
    let animationFrameId = null;
    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        // 旋转动画
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        line.rotation.z += 0.01;

        controls.update();
        renderer.render(scene, camera);
    };

    // 开始动画
    animate();

    return {
        scene,
        camera,
        renderer,
        controls,
        objects: { cube, line },
        dispose: () => {
            // 停止动画
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }

            // 移除事件监听
            window.removeEventListener('resize', onWindowResize);

            // 清理资源
            renderer.dispose();
            controls.dispose();
            cube.geometry.dispose();
            cube.material.dispose();
            line.geometry.dispose();
            line.material.dispose();

            // 从DOM中移除canvas
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
};
