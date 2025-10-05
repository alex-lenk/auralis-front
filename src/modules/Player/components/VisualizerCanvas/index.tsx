import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import useStore from '@/stores/StoreContext';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

export const VisualizerCanvas = observer(() => {
  const { audioStore } = useStore();
  const { analyser, isPlaying } = audioStore;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const smoothDataRef = useRef<number[]>([]);

  useEffect(() => {
    if (!analyser || !isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
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

    // Количество столбиков (можно изменить для большей/меньшей детализации)
    const barCount = 64;
    const barWidth = (canvas.width / dpr / barCount) * 0.7;
    const barSpacing = (canvas.width / dpr) / barCount;
    const centerX = canvas.width / (2 * dpr);
    const halfBars = barCount / 2;

    // начальные нули для сглаживания
    smoothDataRef.current = new Array(barCount).fill(0);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const gradient = ctx.createLinearGradient(0, canvas.height / dpr, 0, 0);
      gradient.addColorStop(0, '#00ccff');
      gradient.addColorStop(0.4, '#6600ff');
      gradient.addColorStop(0.8, '#ff00cc');
      gradient.addColorStop(1, '#ff66aa');

      ctx.shadowColor = '#bb66ff';
      ctx.shadowBlur = 5;

      const centerY = canvas.height / (2 * dpr);
      const smoothing = 0.6; // чем выше — тем плавнее

      for (let i = 0; i < halfBars; i++) {
        const dataIndex = Math.floor((i * bufferLength) / halfBars);
        const target = (dataArray[dataIndex] / 255) * (canvas.height / dpr / 2) * 0.9;

        // сглаживание колебаний
        const prev = smoothDataRef.current[i];
        const value = prev + (target - prev) * (1 - smoothing);
        smoothDataRef.current[i] = value;

        const xRight = centerX + i * barSpacing;
        const xLeft = centerX - (i + 1) * barSpacing;
        const barHeight = value;

        ctx.fillStyle = gradient;

        const barRadius = 8;
        ctx.fillStyle = gradient;

        roundRect(ctx, xRight, centerY - barHeight, barWidth, barHeight * 2, barRadius);
        roundRect(ctx, xLeft, centerY - barHeight, barWidth, barHeight * 2, barRadius);
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'transparent',
      }}
    />
  );
});
