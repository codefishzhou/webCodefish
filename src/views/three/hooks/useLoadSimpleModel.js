import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

export const useLoadSimpleModel = (dom) => {
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    dom.value.appendChild(renderer.domElement);

    // 初始化相机
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 40, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 初始化场景
    const scene = new THREE.Scene();

    // 初始化光源
    const ambientLight = new THREE.AmbientLight(0xfff444);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(0, 50, 50);
    light.castShadow = true;
    scene.add(light);

    // 初始化性能监控
    const stats = new Stats();
    dom.value.appendChild(stats.dom);

    // 初始化控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 1;
    controls.maxDistance = 200;
    controls.enablePan = true;

    // 加载模型
    const initModel = () => {
        // 添加坐标轴辅助
        const helper = new THREE.AxesHelper(50);
        scene.add(helper);

        // 加载STL模型
        const loader = new STLLoader();
        loader.load("./model/wheel.stl", (geometry) => {
            console.log(geometry, 'geometry');
            const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = -0.5 * Math.PI;
            mesh.scale.set(0.1, 0.1, 0.1);
            geometry.center();
            scene.add(mesh);
        });
    };

    // 窗口大小变化处理
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    // 渲染函数
    const render = () => {
        renderer.render(scene, camera);
    };

    // 动画循环
    const animate = () => {
        requestAnimationFrame(animate);
        render();
        stats.update();
        controls.update();
    };

    // 初始化模型并开始动画
    initModel();
    animate();

    // 返回清理函数和必要的对象
    return {
        scene,
        camera,
        renderer,
        controls,
        dispose: () => {
            // 清理事件监听
            window.removeEventListener('resize', onWindowResize);
            
            // 清理 DOM
            dom.value.removeChild(renderer.domElement);
            dom.value.removeChild(stats.dom);
            
            // 清理控制器
            controls.dispose();
            
            // 清理渲染器
            renderer.dispose();
        }
    };
};

