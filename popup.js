document.addEventListener('DOMContentLoaded', function() {
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  const splitButton = document.getElementById('splitButton');
  const status = document.getElementById('status');
  let originalImage = null;
  let originalFileName = '';

  function showStatus(message) {
    status.textContent = message;
    console.log(message);
  }

  imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      originalFileName = file.name.replace(/\.[^/.]+$/, '');
      showStatus('正在加载图片...');
      
      const reader = new FileReader();
      reader.onload = function(event) {
        preview.src = event.target.result;
        preview.style.display = 'block';
        originalImage = new Image();
        originalImage.src = event.target.result;
        originalImage.onload = function() {
          splitButton.disabled = false;
          showStatus(`图片已加载，尺寸: ${originalImage.width}x${originalImage.height}`);
        };
      };
      reader.readAsDataURL(file);
    }
  });

  splitButton.addEventListener('click', async function() {
    try {
      if (!originalImage) {
        showStatus('请先选择图片');
        return;
      }

      splitButton.disabled = true;
      showStatus('开始分割图片...');

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const partWidth = Math.floor(originalImage.width / 2);
      const partHeight = Math.floor(originalImage.height / 2);
      
      canvas.width = partWidth;
      canvas.height = partHeight;

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            originalImage,
            col * partWidth, row * partHeight,
            partWidth, partHeight,
            0, 0,
            partWidth, partHeight
          );

          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          const url = URL.createObjectURL(blob);
          
          try {
            await chrome.downloads.download({
              url: url,
              filename: `${originalFileName}_split_${row+1}x${col+1}.png`,
              saveAs: false  // 直接下载到默认文件夹
            });
            showStatus(`已完成 ${row * 2 + col + 1}/4 张图片`);
          } catch (error) {
            console.error('下载失败:', error);
            showStatus(`下载失败: ${error.message}`);
          } finally {
            URL.revokeObjectURL(url);
          }
        }
      }

      showStatus('所有图片分割完成！');
    } catch (error) {
      console.error('处理过程出错:', error);
      showStatus(`处理出错: ${error.message}`);
    } finally {
      splitButton.disabled = false;
    }
  });
}); 