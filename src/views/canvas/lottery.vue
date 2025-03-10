<template>
    <div>
        <canvas id="myCanvas" ref="canvas" width="400" height="400" class="rotate-90"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const canvas = ref(null);
const ctx = ref(null);
const initCanvas = (count, [x, y]) => {
    ctx.value = canvas.value.getContext("2d");
    const width = canvas.value.width;
    const height = canvas.value.height;
    
    ctx.value.translate(width/2, height/2);
    
    const sectorCount = count;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];
    const texts = ['奖品1', '奖品2', '奖品3', '奖品4', '奖品5', '奖品6', '奖品7'];
    
    const anglePerSector = (2 * Math.PI) / sectorCount;
    const radius = 100;  // 外圆半径
    const innerRadius = 60;  // 内圆半径，用于放置图片
    
    // 加载图片
    const img = new Image();
    img.src = 'https://avatars.githubusercontent.com/u/91311533?s=400&u=d28ebc4b677d3b5a7c354d73ca100d910a398084&v=4';  // 替换为你的图片路径
    
    img.onload = () => { 
        for (let i = 0; i < sectorCount; i++) {
            const startAngle = i * anglePerSector;
            const endAngle = startAngle + anglePerSector;
            const middleAngle = startAngle + (anglePerSector / 2);
            
            // 绘制扇形
            ctx.value.beginPath();
            ctx.value.moveTo(x, y);
            ctx.value.arc(x, y, radius, startAngle, endAngle, false);
            ctx.value.closePath();
            ctx.value.fillStyle = colors[i];
            ctx.value.fill();
            ctx.value.strokeStyle = '#fff';
            ctx.value.stroke();
            
            // 绘制文字（在外圈）
            ctx.value.save();
            ctx.value.translate(
                x + (radius * 0.75) * Math.cos(middleAngle),
                y + (radius * 0.75) * Math.sin(middleAngle)
            );
            ctx.value.rotate(middleAngle + Math.PI/2);
            ctx.value.fillStyle = '#000';
            ctx.value.font = '14px Arial';
            ctx.value.textAlign = 'center';
            ctx.value.fillText(texts[i], 0, 0);
            ctx.value.restore();
            

            // ctx.value.save();
            // ctx.value.beginPath();
            // ctx.value.arc(x, y, innerRadius, startAngle, endAngle, false);
            // ctx.value.clip();
            // 绘制图片（在内圈）
            ctx.value.save();
            const imgSize = 30;  // 图片大小
            const imgX = x + (innerRadius * 0.8) * Math.cos(middleAngle) - imgSize/2;
            const imgY = y + (innerRadius * 0.8) * Math.sin(middleAngle) - imgSize/2;
            
            // 创建圆形裁剪区域
            ctx.value.beginPath();
            ctx.value.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2, 0, Math.PI * 2);
            ctx.value.clip();
            
            ctx.value.drawImage(img, imgX, imgY, imgSize, imgSize);
            ctx.value.restore();
        }
    };
}

onMounted(() => { 
    initCanvas(8, [0, 0]);
})
</script>
