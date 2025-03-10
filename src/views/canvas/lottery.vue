<template>
    <div>
        <canvas id="myCanvas" ref="canvas" width="400" height="400"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const canvas = ref(null);
const ctx = ref(null);
const initCanvas = () => {
    ctx.value = canvas.value.getContext("2d");
    const width = canvas.value.width;
    const height = canvas.value.height;
    
    // 将坐标原点移到画布中心
    ctx.value.translate(width/2, height/2);
    
    // 绘制扇形
    ctx.value.beginPath();
    // 参数说明：arc(x, y, radius, startAngle, endAngle, anticlockwise)
    // x,y: 圆心坐标（因为已经移动到中心，所以是0,0）
    // radius: 半径
    // startAngle: 开始角度（弧度制）
    // endAngle: 结束角度（弧度制）
    // anticlockwise: 是否逆时针（默认false）
    ctx.value.moveTo(0, 0);  // 移动到圆心
    ctx.value.arc(0, 0, 100, 0, Math.PI/4, false);
    ctx.value.arc(0, 0, 100, 45/2, Math.PI/2, false);
    // ctx.value.arc(0, 0, 100, 90, Math.PI, false);
    ctx.value.closePath();  // 闭合路径（连接到圆心）
    
    // 设置样式并填充
    ctx.value.fillStyle = 'orange';
    ctx.value.fill();
    ctx.value.strokeStyle = 'black';
    ctx.value.stroke();
}
onMounted(() => { 
    initCanvas();
 })
</script>
