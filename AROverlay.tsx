'use client';


import React, { useRef, useEffect, useState } from 'react';

interface AROverlayProps {
    instruction: string; // 'forward', 'left', 'right', 'back', 'finish'
}

export default function AROverlay({ instruction }: AROverlayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (canvasRef.current && canvasRef.current.parentElement) {
                const { clientWidth, clientHeight } = canvasRef.current.parentElement;
                setDimensions({
                    width: clientWidth,
                    height: clientHeight
                });
            }
        };

        // Initial set
        updateDimensions();

        // Observer
        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
        });

        if (canvasRef.current && canvasRef.current.parentElement) {
            resizeObserver.observe(canvasRef.current.parentElement);
        }

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw settings
        ctx.strokeStyle = '#00FF00'; // Green arrow
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h * 0.75; // Move to bottom (Ground level)

        // Parse direction from instruction or use direct mapping
        const lower = instruction.toLowerCase();

        ctx.save();
        ctx.translate(cx, cy);
        // "Horizontal on ground" effect:
        // Widen (x) and Squash (y) significantly to simulate looking at a flat object on the floor
        ctx.scale(1.5, 0.25);

        ctx.beginPath();

        if (lower.includes('forward') || lower.includes('straight') || lower.includes('go to')) {
            // Up arrow (pointing "into" the screen)
            ctx.moveTo(0, 100);
            ctx.lineTo(0, -100);
            ctx.lineTo(-50, -50);
            ctx.moveTo(0, -100);
            ctx.lineTo(50, -50);
        } else if (lower.includes('left')) {
            // Left arrow
            ctx.moveTo(100, 0);
            ctx.lineTo(-100, 0);
            ctx.lineTo(-50, -50);
            ctx.moveTo(-100, 0);
            ctx.lineTo(-50, 50);
        } else if (lower.includes('right')) {
            // Right arrow
            ctx.moveTo(-100, 0);
            ctx.lineTo(100, 0);
            ctx.lineTo(50, -50);
            ctx.moveTo(100, 0);
            ctx.lineTo(50, 50);
        } else if (lower.includes('back') || lower.includes('u-turn')) {
            // Down Arrow (Reverse) - Pointing "towards" user
            ctx.moveTo(0, -100);
            ctx.lineTo(0, 100);
            ctx.lineTo(-50, 50);
            ctx.moveTo(0, 100);
            ctx.lineTo(50, 50);
        } else if (lower.includes('finish') || lower.includes('arrived') || lower.includes('here')) {
            // Target Circle on ground
            ctx.scale(1, 0.5); // Squash more for circle
            ctx.beginPath();
            ctx.arc(0, 0, 80, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.fill();
            ctx.stroke();
        }

        ctx.stroke();
        ctx.restore();

    }, [instruction, dimensions]);

    if (dimensions.width === 0) return null; // Don't render on server

    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
    );
}
