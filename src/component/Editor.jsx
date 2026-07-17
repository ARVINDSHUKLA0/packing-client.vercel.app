"use client";
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Stage, Layer, Group, Rect, Text, Image as KonvaImage, Transformer } from "react-konva";

const CANVAS_WIDTH = 900;

function useHtmlImage(src) {
  const [img, setImg] = useState(null);
  useEffect(() => {
    if (!src) return;
    const image = new window.Image();
    image.src = src;
    image.onload = () => setImg(image);
  }, [src]);
  return img;
}

function ImageNode({ el, onSelect, onChange, dragBoundFunc, setRef }) {
  const img = useHtmlImage(el.src);
  const shapeRef = useRef(null);

  return (
    <KonvaImage
      ref={(node) => {
        shapeRef.current = node;
        setRef(node);
      }}
      image={img}
      x={el.x}
      y={el.y}
      width={el.width}
      height={el.height}
      rotation={el.rotation}
      draggable
      dragBoundFunc={dragBoundFunc}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={() => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(10, node.width() * scaleX),
          height: Math.max(10, node.height() * scaleY),
          rotation: node.rotation(),
        });
      }}
    />
  );
}

function TextNode({ el, onSelect, onChange, dragBoundFunc, onDblClick, setRef }) {
  const shapeRef = useRef(null);

  return (
    <Text
      ref={(node) => {
        shapeRef.current = node;
        setRef(node);
      }}
      x={el.x}
      y={el.y}
      text={el.text}
      fontSize={el.fontSize}
      fontFamily={el.fontFamily}
      fill={el.fill}
      fontStyle={el.fontStyle}
      align={el.align}
      width={el.width}
      rotation={el.rotation}
      draggable
      dragBoundFunc={dragBoundFunc}
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={onDblClick}
      onDblTap={onDblClick}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={() => {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(20, node.width() * scaleX),
          rotation: node.rotation(),
        });
      }}
    />
  );
}

export default function Editor({
  panels,
  viewBox,
  elements,
  activePanelId,
  selectedElementId,
  onSelectPanel,
  onSelectElement,
  onUpdateElement,
  stageRef,
}) {
  const [editingText, setEditingText] = useState(null);
  const transformerRef = useRef(null);
  const selectedShapeRef = useRef(null);
  const containerRef = useRef(null);

  const scale = viewBox.width ? CANVAS_WIDTH / viewBox.width : 1;
  const canvasHeight = viewBox.height * scale;

  const panelPx = useMemo(() => {
    const map = {};
    panels.forEach((p) => {
      map[p.id] = {
        x: p.x * scale,
        y: p.y * scale,
        width: p.width * scale,
        height: p.height * scale,
      };
    });
    return map;
  }, [panels, scale]);

  useEffect(() => {
    if (transformerRef.current && selectedShapeRef.current) {
      transformerRef.current.nodes([selectedShapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElementId, activePanelId]);

  const makeDragBoundFunc = useCallback(
    (panelId) => (pos) => {
      const box = panelPx[panelId];
      if (!box) return pos;
      return {
        x: Math.min(Math.max(pos.x, box.x), box.x + box.width),
        y: Math.min(Math.max(pos.y, box.y), box.y + box.height),
      };
    },
    [panelPx]
  );

  const handleStageMouseDown = (e) => {
    if (e.target === e.target.getStage()) {
      onSelectElement(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-100 h-100 d-flex align-items-center justify-content-center bg-light overflow-auto"
    >
      <Stage
        ref={stageRef}
        width={CANVAS_WIDTH}
        height={canvasHeight}
        onMouseDown={handleStageMouseDown}
        onTouchStart={handleStageMouseDown}
      >
        <Layer listening={false}>
          {panels.map((p) => {
            const box = panelPx[p.id];
            const isActive = p.id === activePanelId;
            return (
              <Rect
                key={p.id}
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                stroke={isActive ? "#2563eb" : "#d1d5db"}
                strokeWidth={isActive ? 2 : 1}
                fill={isActive ? "rgba(37,99,235,0.03)" : "white"}
                shadowColor="rgba(0,0,0,0.15)"
                shadowBlur={6}
                shadowOpacity={0.5}
              />
            );
          })}
        </Layer>

        <Layer>
          {panels.map((p) => {
            const box = panelPx[p.id];
            return (
              <Rect
                key={`hit-${p.id}`}
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                fill="transparent"
                onClick={() => onSelectPanel(p.id)}
                onTap={() => onSelectPanel(p.id)}
              />
            );
          })}

          {panels.map((p) => {
            const box = panelPx[p.id];
            const panelElements = elements[p.id] || [];
            return (
              <Group
                key={`content-${p.id}`}
                x={box.x}
                y={box.y}
                clipFunc={(ctx) => {
                  ctx.rect(0, 0, box.width, box.height);
                }}
              >
                {panelElements.map((el) => {
                  const commonProps = {
                    el,
                    dragBoundFunc: makeDragBoundFunc(p.id),
                    setRef: (node) => {
                      if (el.id === selectedElementId && node) {
                        selectedShapeRef.current = node;
                      }
                    },
                    onSelect: () => {
                      onSelectPanel(p.id);
                      onSelectElement(el.id);
                    },
                    onChange: (patch) => onUpdateElement(p.id, el.id, patch),
                  };

                  if (el.type === "image") {
                    return <ImageNode key={el.id} {...commonProps} />;
                  }
                  return (
                    <TextNode
                      key={el.id}
                      {...commonProps}
                      onDblClick={(e) => {
                        onSelectPanel(p.id);
                        onSelectElement(el.id);
                        setEditingText({ panelId: p.id, elId: el.id, node: e.target });
                      }}
                    />
                  );
                })}
              </Group>
            );
          })}

          <Transformer
            ref={transformerRef}
            rotateEnabled
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 10 || newBox.height < 10) return oldBox;
              return newBox;
            }}
          />
        </Layer>
      </Stage>

      {editingText &&
        createPortal(
          <TextEditOverlay
            editingText={editingText}
            stageRef={stageRef}
            elements={elements}
            onCommit={(newText) => {
              onUpdateElement(editingText.panelId, editingText.elId, { text: newText });
              setEditingText(null);
            }}
            onCancel={() => setEditingText(null)}
          />,
          document.body
        )}
    </div>
  );
}

function TextEditOverlay({ editingText, stageRef, elements, onCommit, onCancel }) {
  const el = elements[editingText.panelId]?.find((e) => e.id === editingText.elId);
  const [value, setValue] = useState(el?.text || "");
  const textareaRef = useRef(null);

  const stage = stageRef.current;
  const stageBox = stage.container().getBoundingClientRect();
  const node = editingText.node;
  const absPos = node.getAbsolutePosition();
  const stageScale = stage.scaleX();

  useEffect(() => {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, []);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onCommit(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onCommit(value);
        }
        if (e.key === "Escape") onCancel();
      }}
      style={{
        position: "fixed",
        top: stageBox.top + absPos.y * stageScale,
        left: stageBox.left + absPos.x * stageScale,
        width: el.width * stageScale,
        fontSize: el.fontSize * stageScale,
        fontFamily: el.fontFamily,
        color: el.fill,
        border: "1px solid #2563eb",
        padding: 0,
        margin: 0,
        overflow: "hidden",
        background: "white",
        resize: "none",
        lineHeight: 1.2,
        zIndex: 1000,
      }}
    />
  );
}