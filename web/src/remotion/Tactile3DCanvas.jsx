import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCurrentFrame, useVideoConfig } from 'remotion';

/* ── Deterministic Three.js Tactile Atlas Stage (02 Paper Pop-Up / 03 Soft Clay / 04 Diorama / 09 Marble Run) ── */
export const Tactile3DCanvas = ({ stylePreset = 'PAPER_POPUP' }) => {
    const canvasRef = useRef(null);
    const sceneStateRef = useRef(null);
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const [webglUnavailable, setWebglUnavailable] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: true,
            });
        } catch {
            setWebglUnavailable(true);
            return undefined;
        }

        renderer.setSize(width, height, false);
        renderer.setPixelRatio(1);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
        camera.position.set(0, 3.4, 7.6);
        camera.lookAt(0, 0.4, 0);

        const ambient = new THREE.AmbientLight('#FFF8F0', 0.9);
        scene.add(ambient);

        const keyLight = new THREE.DirectionalLight('#FFE4B8', 1.6);
        keyLight.position.set(4.5, 7, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(1024, 1024);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight('#FF6F00', 0.55);
        rimLight.position.set(-5, 3, -4);
        scene.add(rimLight);

        // Floor / Plinth (Atlas #02 wood/paper, #04 diorama tile, #09 walnut base)
        const isWalnut = stylePreset === 'MARBLE_RUN';
        const isDiorama = stylePreset === 'TINY_DIORAMA';
        const baseColor = isWalnut ? '#5D4037' : isDiorama ? '#4CAF50' : '#F6E6D4';
        const baseGeo = isDiorama
            ? new THREE.BoxGeometry(5.8, 0.7, 4.2)
            : new THREE.CylinderGeometry(3.9, 4.1, 0.45, 32);
        const baseMat = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: isWalnut ? 0.55 : 0.85,
            metalness: 0.04,
        });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.y = -0.6;
        baseMesh.receiveShadow = true;
        scene.add(baseMesh);

        // Tactile orbiting geometry elements representing SOE rhythm blocks & harmonic notes
        const group = new THREE.Group();
        const palette = ['#FF6F00', '#FFB300', '#4CAF50', '#5BA4C9', '#9C27B0', '#C4785A', '#9678C4'];
        const items = [];

        for (let i = 0; i < 7; i += 1) {
            const angle = (i / 7) * Math.PI * 2;
            const geo =
                stylePreset === 'PAPER_POPUP'
                    ? new THREE.BoxGeometry(0.95, 1.35, 0.14)
                    : stylePreset === 'MARBLE_RUN'
                      ? new THREE.SphereGeometry(0.46, 28, 28)
                      : stylePreset === 'SOFT_CLAY'
                        ? new THREE.TorusGeometry(0.42, 0.2, 16, 32)
                        : new THREE.CylinderGeometry(0.42, 0.48, 0.9, 16);

            const mat = new THREE.MeshStandardMaterial({
                color: palette[i],
                roughness: stylePreset === 'MARBLE_RUN' ? 0.18 : 0.78,
                metalness: stylePreset === 'MARBLE_RUN' ? 0.25 : 0.02,
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(Math.cos(angle) * 2.35, 0.35, Math.sin(angle) * 1.65);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);
            items.push({ mesh, angle, idx: i });
        }

        scene.add(group);
        sceneStateRef.current = { renderer, scene, camera, group, items };

        return () => {
            items.forEach(({ mesh }) => {
                mesh.geometry.dispose();
                mesh.material.dispose();
            });
            baseGeo.dispose();
            baseMat.dispose();
            renderer.dispose();
            sceneStateRef.current = null;
        };
    }, [stylePreset, width, height]);

    useEffect(() => {
        const state = sceneStateRef.current;
        if (!state || webglUnavailable) return;

        const { renderer, scene, camera, group, items } = state;
        const t = frame / Math.max(1, fps);

        group.rotation.y = t * 0.42;
        items.forEach(({ mesh, angle, idx }) => {
            const beatWave = Math.sin(t * 3.14 + idx * 0.9) * 0.28;
            mesh.position.y = 0.42 + beatWave;
            if (stylePreset === 'PAPER_POPUP') {
                mesh.rotation.y = -group.rotation.y + angle * 0.2;
            } else {
                mesh.rotation.x = t * 0.65 + idx;
                mesh.rotation.z = Math.sin(t + idx) * 0.25;
            }
        });

        camera.position.x = Math.sin(t * 0.35) * 0.45;
        camera.lookAt(0, 0.35, 0);
        renderer.render(scene, camera);
    }, [frame, fps, stylePreset, webglUnavailable]);

    if (webglUnavailable) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                opacity: 0.42,
                pointerEvents: 'none',
            }}
        />
    );
};

