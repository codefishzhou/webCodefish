import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import TWEEN from '@tweenjs/tween.js';

// 预设视角位置
const VIEW_POSITIONS = {
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

export class SceneManager {
    constructor(container) {
        console.log('Initializing scene with container:', container);
        
        // 验证容器有效性
        if (!container?.value) {
            throw new Error('Invalid container reference');
        }

        this.container = container.value; // 直接存储 DOM 元素
        this.scene = new THREE.Scene();
        this.camera = this.#initCamera();
        this.renderer = this.#initRenderer();
        this.controls = this.#initControls();
        this.lights = this.#initLights();
        this.animationFrameId = null;

        // 添加调试立方体
        // this.#addDebugCube();
        
        // 添加辅助网格和坐标轴（只加一次）
        this.#addHelpers();

        // 绑定方法
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.onWindowResize);

        console.log('Scene initialized:', this);
    }

    // 添加调试用立方体
    #addDebugCube() {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            wireframe: true 
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    // 添加辅助对象
    #addHelpers() {
        // 网格辅助
        this.gridHelper = new THREE.GridHelper(200, 20);
        this.scene.add(this.gridHelper);
        
        // 坐标轴辅助
        this.axesHelper = new THREE.AxesHelper(100);
        this.scene.add(this.axesHelper);
    }

    #initCamera() {
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            300
        );
        camera.position.set(10, 10, 100);
        camera.lookAt(0, 0, 0);
        return camera;
    }

    #initRenderer() {
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true // 添加透明背景支持
        });
        
        // 设置像素比
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x8c8c8c);
        
        // 使用现代方式添加元素
        this.container.append(renderer.domElement);
        
        console.log('Renderer initialized:', renderer);
        return renderer;
    }

    #initControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        return controls;
    }

    #initLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        const light1 = new THREE.DirectionalLight(0xffffff, 2);
        light1.position.set(0, 100, 100);
        this.scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 1);
        light2.position.set(-100, 0, -100);
        this.scene.add(light2);

        return { ambientLight, light1, light2 };
    }

    async loadModel(modelPath, options = {}) {
        const {
            position = { x: 0, y: 0, z: 0 },
            rotation = { x: 0, y: 0, z: 0 },
            scale = 0.1 // 修改为统一缩放比例
        } = options;

        // 加载模型
        const loader = new STLLoader();
        return new Promise((resolve, reject) => {
            loader.load(
                modelPath,
                (geometry) => {
                    // 添加错误边界检查
                    if (!geometry.boundingBox) geometry.computeBoundingBox();

                    const material = new THREE.MeshPhongMaterial({
                        color: 0x00ff00, // 改为可见颜色用于调试
                        shininess: 30,
                        specular: 0x111111,
                        // wireframe: true // 添加线框模式用于调试
                    });

                    const mesh = new THREE.Mesh(geometry, material);

                    // 设置缩放比例
                    mesh.scale.set(scale, scale, scale);
                    
                    // 设置旋转和平移
                    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
                    mesh.position.set(position.x, position.y, position.z);

                    // 自动居中模型
                    const center = new THREE.Vector3();
                    geometry.boundingBox.getCenter(center);
                    mesh.geometry.translate(-center.x, -center.y, -center.z);

                    this.scene.add(mesh);
                    console.log('Model loaded at:', position);
                    resolve(mesh);
                },
                (xhr) => {
                    console.log(`模型加载进度: ${(xhr.loaded / xhr.total * 100).toFixed(1)}%`);
                },
                (error) => {
                    console.error('模型加载失败:', error);
                    reject(new Error(`无法加载模型: ${modelPath}`));
                }
            );
        });
    }

    switchView(viewName) {
        const view = VIEW_POSITIONS[viewName];
        if (!view) return;

        this.camera.position.set(view.position.x, view.position.y, view.position.z);
        this.controls.target.set(view.target.x, view.target.y, view.target.z);
        this.camera.lookAt(this.controls.target);
        this.controls.update();
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    dispose() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }

        window.removeEventListener('resize', this.onWindowResize);
        this.renderer.dispose();
        this.controls.dispose();

        if (this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
    }
}