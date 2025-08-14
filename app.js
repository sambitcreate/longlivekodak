'use strict';

let currentImage = null;
let canvas = null;
let ctx = null;
let frameParams = {
  thickness: 25,
  roughness: 0.8,
  scratches: 8,
  texture: 15,
  variations: 10,
  imperfections: 15,
  asymmetry: 5,
};

// Presets
const presets = {
  minimal: {
    thickness: 15,
    roughness: 0.2,
    scratches: 2,
    texture: 5,
    variations: 3,
    imperfections: 5,
    asymmetry: 1,
  },
  classic: {
    thickness: 25,
    roughness: 0.8,
    scratches: 8,
    texture: 15,
    variations: 10,
    imperfections: 15,
    asymmetry: 5,
  },
  vintage: {
    thickness: 35,
    roughness: 1.2,
    scratches: 12,
    texture: 20,
    variations: 15,
    imperfections: 20,
    asymmetry: 8,
  },
  distressed: {
    thickness: 45,
    roughness: 2.0,
    scratches: 18,
    texture: 25,
    variations: 18,
    imperfections: 25,
    asymmetry: 12,
  },
};

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const controlsToolbar = document.getElementById('controls-toolbar');
  const toolbarToggle = document.getElementById('toolbar-toggle');

  canvas = document.getElementById('result-canvas');
  ctx = canvas.getContext('2d');

  // Upload area click
  uploadArea.addEventListener('click', () => fileInput.click());

  // File input change
  fileInput.addEventListener('change', handleFileSelect);

  // Drag and drop
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('dragleave', handleDragLeave);
  uploadArea.addEventListener('drop', handleDrop);

  // Control buttons
  document.getElementById('regenerate-btn').addEventListener('click', regenerateFrame);
  document.getElementById('download-jpg').addEventListener('click', () => downloadImage('jpg'));
  document.getElementById('download-png').addEventListener('click', () => downloadImage('png'));
  document.getElementById('new-image').addEventListener('click', newImage);

  // Toolbar toggle
  toolbarToggle.addEventListener('click', () => {
    controlsToolbar.classList.toggle('show');
  });

  // Initialize live controls
  initializeLiveControls();
});

function initializeLiveControls() {
  // Set up sliders
  const sliders = [
    'thickness',
    'roughness',
    'scratches',
    'texture',
    'variations',
    'imperfections',
    'asymmetry',
  ];

  sliders.forEach((param) => {
    const slider = document.getElementById(`${param}-slider`);
    const valueDisplay = document.getElementById(`${param}-value`);

    slider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      frameParams[param] = value;
      valueDisplay.textContent = param === 'roughness' ? value.toFixed(1) : Math.round(value);

      // Debounced live update
      clearTimeout(window.updateTimeout);
      window.updateTimeout = setTimeout(() => {
        if (currentImage) generateFramedImage();
      }, 100);
    });
  });

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const preset = e.target.dataset.preset;
      applyPreset(preset);

      // Update active state
      document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
}

function applyPreset(presetName) {
  const preset = presets[presetName];
  if (!preset) return;

  // Update parameters
  Object.assign(frameParams, preset);

  // Update sliders and displays
  Object.keys(preset).forEach((param) => {
    const slider = document.getElementById(`${param}-slider`);
    const valueDisplay = document.getElementById(`${param}-value`);

    if (slider) {
      slider.value = preset[param];
      valueDisplay.textContent =
        param === 'roughness' ? preset[param].toFixed(1) : Math.round(preset[param]);
    }
  });

  // Generate new frame
  if (currentImage) generateFramedImage();
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    processFile(file);
  }
}

function processFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB.');
    return;
  }

  const loading = document.getElementById('loading');
  loading.classList.add('show');

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      currentImage = img;
      setTimeout(() => {
        generateFramedImage();
        showResults();
        loading.classList.remove('show');
      }, 1200);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function generateFramedImage() {
  if (!currentImage) return;

  // Calculate dimensions
  const maxWidth = 800;
  const maxHeight = 600;
  let { width, height } = currentImage;

  // Scale down if too large
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  width *= scale;
  height *= scale;

  // Variable frame thickness with asymmetry
  const baseThickness = frameParams.thickness;
  const asymmetry = frameParams.asymmetry;

  const frameTop = baseThickness + (Math.random() - 0.5) * asymmetry;
  const frameRight = baseThickness + (Math.random() - 0.5) * asymmetry;
  const frameBottom = baseThickness + (Math.random() - 0.5) * asymmetry;
  const frameLeft = baseThickness + (Math.random() - 0.5) * asymmetry;

  const totalWidth = width + frameLeft + frameRight;
  const totalHeight = height + frameTop + frameBottom;

  canvas.width = totalWidth;
  canvas.height = totalHeight;

  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Draw sophisticated frame
  drawAuthenticFrame(
    totalWidth,
    totalHeight,
    frameTop,
    frameRight,
    frameBottom,
    frameLeft,
    width,
    height
  );

  // Draw the image
  ctx.drawImage(currentImage, frameLeft, frameTop, width, height);

  // Add frame imperfections and details based on parameters
  addFrameImperfections(totalWidth, totalHeight, frameTop, frameRight, frameBottom, frameLeft);
  addSubtleTexture(totalWidth, totalHeight);
  addOrganicEdgeVariations(totalWidth, totalHeight, frameTop, frameRight, frameBottom, frameLeft);
}

function drawAuthenticFrame(
  totalWidth,
  totalHeight,
  frameTop,
  frameRight,
  frameBottom,
  frameLeft,
  imgWidth,
  imgHeight
) {
  // Base frame - solid black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Create inner cutout for image with roughness parameter
  ctx.globalCompositeOperation = 'destination-out';

  // Draw irregular inner rectangle
  ctx.beginPath();
  const innerX = frameLeft;
  const innerY = frameTop;
  const innerW = imgWidth;
  const innerH = imgHeight;

  // Create path with micro-variations based on roughness
  const points = [];
  const segments = 100;
  const roughnessScale = frameParams.roughness;

  // Top edge
  for (let i = 0; i <= segments; i++) {
    const x = innerX + (i / segments) * innerW;
    const y = innerY + (Math.random() - 0.5) * roughnessScale;
    points.push([x, y]);
  }

  // Right edge
  for (let i = 1; i <= segments; i++) {
    const x = innerX + innerW + (Math.random() - 0.5) * roughnessScale;
    const y = innerY + (i / segments) * innerH;
    points.push([x, y]);
  }

  // Bottom edge
  for (let i = segments - 1; i >= 0; i--) {
    const x = innerX + (i / segments) * innerW;
    const y = innerY + innerH + (Math.random() - 0.5) * roughnessScale;
    points.push([x, y]);
  }

  // Left edge
  for (let i = segments - 1; i > 0; i--) {
    const x = innerX + (Math.random() - 0.5) * roughnessScale;
    const y = innerY + (i / segments) * innerH;
    points.push([x, y]);
  }

  // Draw the path
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';
}

function addFrameImperfections(totalWidth, totalHeight, frameTop, frameRight, frameBottom, frameLeft) {
  // Add thickness variations based on variations parameter
  ctx.fillStyle = '#1a1a1a';

  const variations = Math.floor(frameParams.variations);

  for (let i = 0; i < variations; i++) {
    const side = Math.floor(Math.random() * 4);
    const variation = Math.random() * 3 + 1;

    ctx.beginPath();

    if (side === 0) {
      // Top
      const x = Math.random() * totalWidth;
      const w = Math.random() * 40 + 10;
      ctx.rect(x, 0, w, variation);
    } else if (side === 1) {
      // Right
      const y = Math.random() * totalHeight;
      const h = Math.random() * 40 + 10;
      ctx.rect(totalWidth - frameRight, y, variation, h);
    } else if (side === 2) {
      // Bottom
      const x = Math.random() * totalWidth;
      const w = Math.random() * 40 + 10;
      ctx.rect(x, totalHeight - frameBottom, w, variation);
    } else {
      // Left
      const y = Math.random() * totalHeight;
      const h = Math.random() * 40 + 10;
      ctx.rect(0, y, variation, h);
    }

    ctx.fill();
  }
}

function addSubtleTexture(totalWidth, totalHeight) {
  if (frameParams.texture === 0) return;

  // Create texture based on texture parameter
  const imageData = ctx.getImageData(0, 0, totalWidth, totalHeight);
  const data = imageData.data;
  const textureIntensity = frameParams.texture;

  for (let i = 0; i < data.length; i += 4) {
    // Only affect black frame areas
    if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
      const noise = (Math.random() - 0.5) * textureIntensity;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function addOrganicEdgeVariations(
  totalWidth,
  totalHeight,
  frameTop,
  frameRight,
  frameBottom,
  frameLeft
) {
  // Add organic imperfections based on imperfections parameter
  ctx.fillStyle = '#000000';

  const imperfections = Math.floor(frameParams.imperfections);

  for (let i = 0; i < imperfections; i++) {
    const side = Math.floor(Math.random() * 4);
    const size = Math.random() * 2 + 0.5;

    ctx.beginPath();

    if (side === 0) {
      // Top edge
      const x = Math.random() * totalWidth;
      ctx.arc(x, Math.random() * 2, size, 0, Math.PI * 2);
    } else if (side === 1) {
      // Right edge
      const y = Math.random() * totalHeight;
      ctx.arc(totalWidth - Math.random() * 2, y, size, 0, Math.PI * 2);
    } else if (side === 2) {
      // Bottom edge
      const x = Math.random() * totalWidth;
      ctx.arc(x, totalHeight - Math.random() * 2, size, 0, Math.PI * 2);
    } else {
      // Left edge
      const y = Math.random() * totalHeight;
      ctx.arc(Math.random() * 2, y, size, 0, Math.PI * 2);
    }

    ctx.fill();
  }

  // Add scratches based on scratches parameter
  if (frameParams.scratches > 0) {
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;

    const scratches = Math.floor(frameParams.scratches);

    for (let i = 0; i < scratches; i++) {
      ctx.beginPath();
      const x1 = Math.random() * totalWidth;
      const y1 = Math.random() * totalHeight;
      const length = Math.random() * 20 + 5;
      const angle = Math.random() * Math.PI * 2;
      const x2 = x1 + Math.cos(angle) * length;
      const y2 = y1 + Math.sin(angle) * length;

      // Only draw on frame areas
      if (
        x1 < frameLeft ||
        x1 > totalWidth - frameRight ||
        y1 < frameTop ||
        y1 > totalHeight - frameBottom
      ) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }
}

function regenerateFrame() {
  if (currentImage) {
    generateFramedImage();
  }
}

function downloadImage(format) {
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = `kodak-frame-${Date.now()}.${format}`;

  if (format === 'jpg') {
    link.href = canvas.toDataURL('image/jpeg', 0.95);
  } else {
    link.href = canvas.toDataURL('image/png');
  }

  link.click();
}

function showResults() {
  document.getElementById('upload-modal').style.display = 'none';
  document.getElementById('results-area').classList.add('show');
  document.getElementById('controls-toolbar').classList.add('show');
  document.getElementById('toolbar-toggle').classList.add('show');
}

function newImage() {
  document.getElementById('upload-modal').style.display = 'block';
  document.getElementById('results-area').classList.remove('show');
  document.getElementById('controls-toolbar').classList.remove('show');
  document.getElementById('toolbar-toggle').classList.remove('show');
  document.getElementById('file-input').value = '';
  currentImage = null;
}
