<template>
  <div class="scene-container">
    <div ref="container"></div>
    <!-- 添加视角切换按钮 -->
    <div class="view-buttons">
      <button @click="handleViewChange('front')">正视图</button>
      <button @click="handleViewChange('side')">侧视图</button>
      <button @click="handleViewChange('top')">俯视图</button>
      <button @click="handleViewChange('perspective')">透视图</button>
      <button @click="lookAt">透视图</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from "three";
import { useSimpleCube } from "./hooks/useSimpleCube";
import {useSimpleLine} from './hooks/useSimpleLine'
import {useLoadSimpleModel} from './hooks/useLoadSimpleModel'
import {useSceneGraph} from './hooks/useSceneGraph'
import {useSceneGraphTwo} from './hooks/useSceneGraphTwo'
import {useSceneGraphByClass} from './hooks/useSceneGraphByClass'

const container = ref(null);
let sceneInstance = null;

// 视角切换处理函数
const handleViewChange = (viewName) => {
    if (sceneInstance && sceneInstance.switchView) {
        sceneInstance.switchView(viewName);
    }
};

const init = () => {
  // useSimpleCube(container);
  // useSimpleLine(container);
  // useLoadSimpleModel(container);
  // useSceneGraph(container)
  sceneInstance = useSceneGraphByClass(container)
};

const lookAt = () => {
  if (sceneInstance) {
    sceneInstance.lookAt(new THREE.Vector3(0, 10, 0));
  }
};

init();
onBeforeUnmount(() => {
  if (sceneInstance) {
    sceneInstance.dispose();
  }
});
</script>

<style scoped>
.scene-container {
    position: relative;
    width: 100%;
    height: 100vh;
}

.view-buttons {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

button {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background: rgba(255, 255, 255, 1);
}
</style>
