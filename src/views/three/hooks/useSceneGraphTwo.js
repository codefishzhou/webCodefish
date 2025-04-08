import * as THREE from 'three';
import { ref, shallowRef } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import TWEEN from '@tweenjs/tween.js';

const initRenderer = (dom) => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x8c8c8c);
    dom.value.appendChild(renderer.domElement);
    return renderer;
};

const initCamera = (dom) => {
    const camera = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        300
    );
    camera.position.set(10, 10, 100);
    camera.lookAt(0, 0, 0);
    return camera;
};

const initScene = () => {
    return new THREE.Scene();
};

const initLight = (scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 2);
    light1.position.set(0, 100, 100);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(-100, 0, -100);
    scene.add(light2);

    return { ambientLight, light1, light2 };
};

const initControls = (camera, renderer) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    return controls;
};

const initModel = (scene) => {
    const gridHelper = new THREE.GridHelper(200, 20);
    scene.add(gridHelper);

    const helper = new THREE.AxesHelper(100);
    scene.add(helper);

    const loader = new STLLoader();
    return new Promise((resolve, reject) => {
        loader.load(
            "./model/wheel.stl", 
            (geometry) => {
                // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 临时测试
                const material = new THREE.MeshPhongMaterial({ 
                    color: 0x0000001c,
                    shininess: 30,
                    specular: 0x111111
                });
                const mesh = new THREE.Mesh(geometry, material);
                
                mesh.rotation.x = -0.5 * Math.PI;
                mesh.scale.set(0.1, 0.1, 0.1);
                mesh.rotation.y = 0.5 * Math.PI;
                geometry.center();
                
                scene.add(mesh);
                console.log('Model loaded successfully');
                resolve(mesh);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('加载出错:', error);
                reject(error);
            }
        );
    });
};

const initModel1 = (scene) => {
    const gridHelper = new THREE.GridHelper(200, 20);
    scene.add(gridHelper);

    const helper = new THREE.AxesHelper(100);
    scene.add(helper);

    const loader = new STLLoader();
    return new Promise((resolve, reject) => {
        loader.load(
            "./model/wheel.stl", 
            (geometry) => {
                const material = new THREE.MeshPhongMaterial({ 
                    color: 0x0000001c,
                    shininess: 30,
                    specular: 0x111111
                });
                const mesh = new THREE.Mesh(geometry, material);
                
                // mesh.rotation.x = 0.5 * Math.PI;
                mesh.scale.set(0.1, 0.1, 0.1);
                mesh.position.set(30, 0, 0);
                mesh.rotation.y = -0.5 * Math.PI;
                // mesh.rotation.z = 0.5 * Math.PI;

                
                
                geometry.center();
                
                scene.add(mesh);
                console.log('Model loaded successfully');
                resolve(mesh);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('加载出错:', error);
                reject(error);
            }
        );
    });
};

// 修改预设视角位置的定义
const ViewPositions = {
    front: {
        position: { x: 0, y: 0, z: 100 },
        target: { x: 0, y: 0, z: 0 }
    },
    side: {
        position: { x: 100, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 0 }
    },
    top: {
        position: { x: 0, y: 100, z: 0 },
        target: { x: 0, y: 0, z: 0 }
    },
    perspective: {
        position: { x: 50, y: 50, z: 50 },
        target: { x: 0, y: 0, z: 0 }
    }
};

// 简化视角切换函数
const initViewControls = (camera, controls) => {
    return (viewName) => {
        console.log('Switching to view:', viewName); // 添加调试日志
        const view = ViewPositions[viewName];
        if (!view) return;

        // 直接设置相机位置
        camera.position.set(view.position.x, view.position.y, view.position.z);
        
        // 设置控制器目标点
        controls.target.set(view.target.x, view.target.y, view.target.z);
        
        // 更新相机和控制器
        camera.lookAt(controls.target);
        controls.update();
    };
};

export const useSceneGraphTwo = (dom) => {
    const scene = new THREE.Scene();
    const camera = initCamera(dom);
    const renderer = initRenderer(dom);
    const lights = initLight(scene);
    const controls = initControls(camera, renderer);

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    let animationFrameId = null;

    // 初始化视角控制
    const switchView = initViewControls(camera, controls);

    // 修改动画循环
    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    // 加载模型并开始动画
    Promise.all([
        initModel(scene),
        initModel1(scene)
    ]).then(() => {
        console.log('Models loaded, switching to perspective view');
        switchView('perspective'); // 初始视角
        animate();
    });

    return {
        scene,
        camera,
        renderer,
        controls,
        switchView,
        dispose: () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
            
            window.removeEventListener('resize', onWindowResize);
            
            renderer.dispose();
            controls.dispose();
            
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
};