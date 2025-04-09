/**
 * 情緒追蹤頁面互動功能
 * 實現情緒選擇、強度調整和數據視覺化
 */

document.addEventListener('DOMContentLoaded', function() {
  // 情緒選擇功能
  initEmotionSelector();
  
  // 強度滑塊功能
  initIntensitySlider();
  
  // 提交按鈕功能
  initSubmitButton();
  
  // 視覺化模擬數據
  initVisualizations();
});

/**
 * 初始化情緒選擇器
 */
function initEmotionSelector() {
  const emotionItems = document.querySelectorAll('.emotion-item');
  
  emotionItems.forEach(item => {
    item.addEventListener('click', function() {
      // 移除其他情緒的選中狀態
      emotionItems.forEach(otherItem => {
        otherItem.classList.remove('selected');
      });
      
      // 為當前情緒添加選中狀態
      this.classList.add('selected');
      
      // 儲存選中的情緒類型
      const emotionType = this.getAttribute('data-emotion');
      document.documentElement.style.setProperty('--selected-emotion', `var(--emotion-${emotionType})`);
      
      // 輕微的觸覺反饋
      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }
      
      // 添加自然的動畫效果
      animateSelection(this);
    });
  });
}

/**
 * 為選中的情緒添加動畫效果
 */
function animateSelection(element) {
  // 創建波紋效果
  const ripple = document.createElement('span');
  ripple.classList.add('emotion-ripple');
  element.querySelector('.emotion-icon').appendChild(ripple);
  
  // 移除之前的波紋元素
  setTimeout(() => {
    ripple.remove();
  }, 700);
}

/**
 * 初始化情緒強度滑塊
 */
function initIntensitySlider() {
  const track = document.querySelector('.intensity-track');
  const thumb = document.querySelector('.intensity-thumb');
  const progress = document.querySelector('.intensity-progress');
  let isDragging = false;
  
  // 處理點擊軌道事件
  track.addEventListener('click', function(e) {
    updateSliderPosition(e);
  });
  
  // 處理拖動滑塊事件
  thumb.addEventListener('mousedown', function() {
    isDragging = true;
  });
  
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      updateSliderPosition(e);
    }
  });
  
  document.addEventListener('mouseup', function() {
    isDragging = false;
  });
  
  // 處理觸摸事件（移動設備）
  thumb.addEventListener('touchstart', function(e) {
    isDragging = true;
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', function(e) {
    if (isDragging && e.touches.length > 0) {
      const touch = e.touches[0];
      updateSliderPosition(touch);
    }
  });
  
  document.addEventListener('touchend', function() {
    isDragging = false;
  });
  
  function updateSliderPosition(e) {
    const trackRect = track.getBoundingClientRect();
    let position = (e.clientX - trackRect.left) / trackRect.width;
    
    // 限制在 0 到 1 之間
    position = Math.max(0, Math.min(1, position));
    
    // 更新滑塊和進度條位置
    const percent = position * 100;
    thumb.style.left = `${percent}%`;
    progress.style.width = `${percent}%`;
    
    // 根據強度更新顏色
    updateColorBasedOnIntensity(position);
  }
  
  function updateColorBasedOnIntensity(position) {
    let color;
    
    // 根據位置計算顏色漸變
    if (position < 0.33) {
      // 淺色到中等
      color = 'var(--emotion-calm)';
    } else if (position < 0.66) {
      // 中等到深色
      color = 'var(--emotion-joy)';
    } else {
      // 最深色
      color = 'var(--emotion-angry)';
    }
    
    // 更新滑塊邊框顏色
    thumb.style.borderColor = color;
  }
}

/**
 * 初始化提交按鈕功能
 */
function initSubmitButton() {
  const submitButton = document.querySelector('.btn-primary');
  const emotionItems = document.querySelectorAll('.emotion-item');
  const notesTextarea = document.querySelector('.emotion-notes');
  
  submitButton.addEventListener('click', function() {
    // 獲取選中的情緒
    const selectedEmotion = document.querySelector('.emotion-item.selected');
    const emotionType = selectedEmotion ? selectedEmotion.getAttribute('data-emotion') : null;
    
    // 獲取情緒強度
    const intensityProgress = document.querySelector('.intensity-progress');
    const intensityValue = parseInt(intensityProgress.style.width) || 50;
    
    // 獲取備註內容
    const notes = notesTextarea.value.trim();
    
    // 驗證數據
    if (!emotionType) {
      showFeedback('請選擇一個情緒類型', 'warning');
      highlightSection('.emotion-selector');
      return;
    }
    
    // 模擬數據提交
    console.log('提交情緒記錄:', {
      type: emotionType,
      intensity: intensityValue,
      notes: notes,
      timestamp: new Date().toISOString()
    });
    
    // 顯示成功提示
    showFeedback('情緒記錄已保存！', 'success');
    
    // 重置表單
    resetForm();
  });
  
  function showFeedback(message, type) {
    // 創建通知元素
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.textContent = message;
    
    // 添加到頁面
    document.body.appendChild(feedback);
    
    // 動畫顯示
    setTimeout(() => {
      feedback.classList.add('show');
    }, 10);
    
    // 自動消失
    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => {
        feedback.remove();
      }, 300);
    }, 3000);
  }
  
  function highlightSection(selector) {
    const section = document.querySelector(selector);
    section.classList.add('highlight-section');
    
    setTimeout(() => {
      section.classList.remove('highlight-section');
    }, 1500);
  }
  
  function resetForm() {
    // 重置情緒選擇
    emotionItems.forEach(item => {
      item.classList.remove('selected');
    });
    
    // 重置強度滑塊
    const thumb = document.querySelector('.intensity-thumb');
    const progress = document.querySelector('.intensity-progress');
    thumb.style.left = '50%';
    progress.style.width = '50%';
    
    // 清空備註
    notesTextarea.value = '';
  }
}

/**
 * 初始化視覺化圖表
 */
function initVisualizations() {
  // 這裡使用模擬數據，實際項目中應從API獲取
  animateEmotionChart();
}

/**
 * 為情緒圖表添加動畫效果
 */
function animateEmotionChart() {
  const emotionDays = document.querySelectorAll('.emotion-day');
  
  emotionDays.forEach((day, index) => {
    // 延遲依次顯示每個柱子
    setTimeout(() => {
      const originalHeight = day.style.height;
      
      // 先設置高度為0
      day.style.height = '0';
      
      // 然後動畫過渡到目標高度
      setTimeout(() => {
        day.style.height = originalHeight;
      }, 50);
    }, index * 100);
  });
}

// 為CSS添加動態樣式
const style = document.createElement('style');
style.textContent = `
  .emotion-ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    animation: ripple 0.6s ease-out;
  }
  
  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 0.5;
    }
    100% {
      width: 90px;
      height: 90px;
      opacity: 0;
    }
  }
  
  .highlight-section {
    animation: highlight 1.5s ease;
  }
  
  @keyframes highlight {
    0%, 100% { box-shadow: none; }
    50% { box-shadow: 0 0 0 2px var(--primary-color); }
  }
  
  .feedback {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    padding: 12px 20px;
    border-radius: var(--radius-md);
    background-color: white;
    box-shadow: var(--shadow-lg);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    z-index: 1000;
  }
  
  .feedback.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  
  .feedback-success {
    border-left: 4px solid var(--success-color);
  }
  
  .feedback-warning {
    border-left: 4px solid var(--warning-color);
  }
`;

document.head.appendChild(style);