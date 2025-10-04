import { useEffect, useRef } from 'react';
import { musicMode } from '@/shared/enum/playlist.ts';
import useStore from '@/stores/StoreContext.ts';
import { observer } from 'mobx-react-lite';

enum VisualizerShape {
  Wave = 'wave',
  Circle = 'circle',
  Bars = 'bars',
  Spiral = 'spiral',
  Blob = 'blob',
  Orbit = 'orbit',
  Grid = 'grid'
}

const modeStyles: Record<musicMode, { color: string; shape: VisualizerShape }> = {
  focus: { color: '#66ccff', shape: VisualizerShape.Wave },
  alanwatts: { color: '#f5deb3', shape: VisualizerShape.Circle },
  grimes: { color: '#ff00cc', shape: VisualizerShape.Bars },
  jamesblake: { color: '#444488', shape: VisualizerShape.Spiral },
  plastikman: { color: '#00ff99', shape: VisualizerShape.Blob },
  recovery: { color: '#0072ff', shape: VisualizerShape.Wave },
  relax: { color: '#96e6a1', shape: VisualizerShape.Wave },
  sleep: { color: '#141e30', shape: VisualizerShape.Blob },
  sleep_rain: { color: '#485563', shape: VisualizerShape.Spiral },
  spatial_orbit: { color: '#9d50bb', shape: VisualizerShape.Orbit },
  study: { color: '#ffe29f', shape: VisualizerShape.Bars },
  wintersleep: { color: '#b6fbff', shape: VisualizerShape.Grid },
};

export const VisualizerCanvas = observer(() => {
  const { audioStore } = useStore();
  const { analyser, isPlaying, mode } = audioStore;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number | null>(null);

  useEffect(() => {
    if (!analyser || !isPlaying) {
      if (animationId.current) cancelAnimationFrame(animationId.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const { color, shape } = modeStyles[mode] || { color: '#fff', shape: VisualizerShape.Wave };

    const draw = () => {
      animationId.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // fallback for low activity
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
      const boost = avg < 5;
      if (boost) {
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = 50 + Math.sin(i * 0.3 + Date.now() * 0.002) * 20;
        }
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.fillStyle = color;

      if (shape === VisualizerShape.Wave) {
        ctx.beginPath();
        for (let i = 0; i < bufferLength; i++) {
          const x = (i / bufferLength) * canvas.width;
          const y = canvas.height / 2 + (dataArray[i] - 128);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

      } else if (shape === VisualizerShape.Bars) {
        const barWidth = canvas.width / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
          const x = i * barWidth;
          const barHeight = (dataArray[i] / 255) * canvas.height;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        }

      } else if (shape === VisualizerShape.Circle) {
        const radius = Math.max(...dataArray) * 1.5;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();

      } else if (shape === VisualizerShape.Spiral) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(canvas.width, canvas.height) / 2;
        ctx.beginPath();
        for (let i = 0; i < bufferLength; i++) {
          const angle = i * 0.2;
          const radius = (i / bufferLength) * maxRadius + (dataArray[i] / 255) * 20;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

      } else if (shape === VisualizerShape.Blob) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const baseRadius = 50;
        ctx.beginPath();
        for (let i = 0; i <= bufferLength; i++) {
          const angle = (i / bufferLength) * Math.PI * 2;
          const radius = baseRadius + (dataArray[i % bufferLength] / 255) * 30;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();

      } else if (shape === VisualizerShape.Orbit) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const numCircles = 5;
        for (let i = 0; i < numCircles; i++) {
          const radius = 20 + (i * 20) + (dataArray[i * 4] / 255) * 10;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }

      } else if (shape === VisualizerShape.Grid) {
        const rows = 8;
        const cols = 16;
        const cellWidth = canvas.width / cols;
        const cellHeight = canvas.height / rows;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const i = (row * cols + col) % bufferLength;
            const val = dataArray[i];
            const intensity = val / 255;
            ctx.fillStyle = `rgba(255,255,255,${intensity})`;
            ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth - 1, cellHeight - 1);
          }
        }
      }
    };

    draw();

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [analyser, isPlaying, mode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        display: 'block',
      }}
    />
  );
});
