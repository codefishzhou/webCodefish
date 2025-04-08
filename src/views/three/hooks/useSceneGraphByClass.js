import { ref, onMounted, onBeforeUnmount } from 'vue';
import { SceneManager } from './threeClass';

export const useSceneGraphByClass = (containerRef) => {
    let sceneManager = null;

    onMounted(async () => {
        try {
            // 确保容器引用有效
            if (!containerRef.value) {
                throw new Error('Container element not found');
            }
            
            // 初始化场景
            sceneManager = new SceneManager(containerRef);
            
            // 加载模型
            await Promise.all([
                sceneManager.loadModel('./model/wheel.stl', {
                    position: { x: 0, y: 5, z: 0 },
                    rotation: { x: -Math.PI/2, y: Math.PI/2, z: 0 },
                    scale: 0.1
                }),
                // sceneManager.loadModel('./model/wheel.stl', {
                //     position: { x: 30, y: 0, z: 0 },
                //     rotation: { x: 0, y: -Math.PI/2, z: 0 },
                //     scale: 0.1
                // })
            ]);

            // 设置初始视角
            sceneManager.switchView('front');
            
            // 开始动画循环
            sceneManager.animate();
            
            // 添加调试信息
            console.log('Scene ready:', sceneManager);
            sceneManager.cube.material.color.set(0xff0000); // 修改调试立方体颜色

        } catch (error) {
            console.error('Scene initialization failed:', error);
        }
    });

    onBeforeUnmount(() => {
        if (sceneManager) {
            sceneManager.dispose();
        }
    });

    // 返回场景管理器的公共方法
    return {
        switchView: (viewName) => sceneManager?.switchView(viewName),
        lookAt: (arg) => sceneManager?.camera.lookAt(arg)
    };
};