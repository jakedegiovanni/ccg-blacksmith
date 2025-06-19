import { useEffect, useRef } from "react";
import "./Board.css";

export function Board() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeAndDraw = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const cssWidth = parent.clientWidth;
      const cssHeight = parent.clientHeight;

      // Set canvas backing size for high DPI
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any existing transforms
      ctx.scale(dpr, dpr); // Scale drawing operations to match CSS pixels

      // Load and draw image
      const img = new Image();

      img.onload = () => {
        const { width: imgW, height: imgH } = img;

        // Target area: HALF of canvas dimensions
        const targetW = cssWidth / 2;
        const targetH = cssHeight / 2;

        // Scale to fit *within* half-size canvas area while preserving aspect ratio
        const scale = Math.min(targetW / imgW, targetH / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;

        // Center image
        const offsetX = (cssWidth - drawW) / 2;
        const offsetY = (cssHeight - drawH) / 2;

        ctx.clearRect(0, 0, cssWidth, cssHeight);
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      };
      img.src = "/proxies/proxy_-000.png";
    };

    resizeAndDraw();
    window.addEventListener("resize", resizeAndDraw);
    return () => window.removeEventListener("resize", resizeAndDraw);
  }, []);

  return <canvas ref={canvasRef} />;
}
