import { useState, useRef, type MouseEvent, type TouchEvent } from "react";

interface UseImageZoomProps {
    minZoom?: number;
    maxZoom?: number;
    zoomStep?: number;
}

export const useImageZoom = ({
    minZoom = 1,
    maxZoom = 3,
    zoomStep = 0.5
}: UseImageZoomProps = {}) => {
    const [zoom, setZoom] = useState(minZoom);
    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // Internal refs
    const dragStart = useRef({ x: 0, y: 0 });
    const pinchStartDist = useRef<number | null>(null);
    const pinchStartZoom = useRef<number>(minZoom);

    const resetZoom = () => {
        setZoom(minZoom);
        setPanPosition({ x: 0, y: 0 });
        setIsDragging(false);
    };

    const handleZoomIn = (e?: MouseEvent) => {
        e?.stopPropagation();
        setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
    };

    const handleZoomOut = (e?: MouseEvent) => {
        e?.stopPropagation();
        const newZoom = Math.max(zoom - zoomStep, minZoom);
        setZoom(newZoom);
        if (newZoom === minZoom) setPanPosition({ x: 0, y: 0 });
    };

    const getTouchDistance = (touches: React.TouchList) => {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    };

    // Mouse handlers
    const handleMouseDown = (e: MouseEvent) => {
        if (zoom <= minZoom) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        dragStart.current = { x: e.clientX - panPosition.x, y: e.clientY - panPosition.y };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || zoom <= minZoom) return;
        e.preventDefault();
        e.stopPropagation();
        setPanPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch handlers
    const handleTouchStart = (e: TouchEvent) => {
        e.stopPropagation();
        if (e.touches.length === 2) {
            const dist = getTouchDistance(e.touches);
            pinchStartDist.current = dist;
            pinchStartZoom.current = zoom;
            return;
        }

        if (zoom <= minZoom) return;
        const touch = e.touches[0];
        setIsDragging(true);
        dragStart.current = { x: touch.clientX - panPosition.x, y: touch.clientY - panPosition.y };
    };

    const handleTouchMove = (e: TouchEvent) => {
        e.stopPropagation();
        if (e.touches.length === 2 && pinchStartDist.current !== null) {
            const dist = getTouchDistance(e.touches);
            const scale = dist / pinchStartDist.current;
            const newZoom = Math.min(Math.max(pinchStartZoom.current * scale, minZoom), maxZoom);
            setZoom(newZoom);
            if (newZoom === minZoom) setPanPosition({ x: 0, y: 0 });
            return;
        }

        if (!isDragging || zoom <= minZoom) return;
        const touch = e.touches[0];
        setPanPosition({
            x: touch.clientX - dragStart.current.x,
            y: touch.clientY - dragStart.current.y
        });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        pinchStartDist.current = null;
    };

    return {
        zoom,
        panPosition,
        isDragging,
        resetZoom,
        handleZoomIn,
        handleZoomOut,
        handlers: {
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseUp,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        },
        containerHandlers: {
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseUp,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        }
    };
};
