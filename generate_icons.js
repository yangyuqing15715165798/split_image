// 创建 canvas 元素
function createIcon(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 设置背景色
  ctx.fillStyle = '#4CAF50';  // 使用绿色作为背景
  ctx.fillRect(0, 0, size, size);

  // 绘制分割线
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(2, size / 16);
  
  // 绘制十字分割线
  ctx.beginPath();
  ctx.moveTo(size/2, 0);
  ctx.lineTo(size/2, size);
  ctx.moveTo(0, size/2);
  ctx.lineTo(size, size/2);
  ctx.stroke();

  // 添加边框
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(1, size / 32);
  ctx.strokeRect(0, 0, size, size);

  return canvas.toDataURL('image/png');
}

// 生成不同尺寸的图标
const sizes = [16, 32, 48, 128];
sizes.forEach(size => {
  const link = document.createElement('a');
  link.download = `icon${size}.png`;
  link.href = createIcon(size);
  link.click();
}); 