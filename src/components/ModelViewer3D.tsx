import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RotateCcw, Pause, Play, AlertTriangle } from 'lucide-react';
import { assetUrl } from '../utils/assets';

export type MaterialMode = 'clay' | 'pla' | 'bronze' | 'wireframe';

interface ModelViewer3DProps {
  glbPath: string;
  title: string;
  paused?: boolean;
  compact?: boolean;
  initialMaterial?: MaterialMode;
}

const MATERIAL_PRESETS: Record<
  MaterialMode,
  { label: string; color: number; roughness: number; metalness: number; wireframe: boolean }
> = {
  clay: {
    label: 'Sculpt Clay',
    color: 0xc2c8d1,
    roughness: 0.56,
    metalness: 0.06,
    wireframe: false,
  },
  pla: {
    label: 'Charcoal PLA',
    color: 0x353b45,
    roughness: 0.62,
    metalness: 0.05,
    wireframe: false,
  },
  bronze: {
    label: 'Bronze',
    color: 0x9b7b56,
    roughness: 0.36,
    metalness: 0.72,
    wireframe: false,
  },
  wireframe: {
    label: 'CAD Wire',
    color: 0x2dd4bf,
    roughness: 0.45,
    metalness: 0.2,
    wireframe: true,
  },
};

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  glbPath,
  title,
  paused = false,
  compact = false,
  initialMaterial = 'clay',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [materialMode, setMaterialMode] = useState<MaterialMode>(initialMaterial);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRootRef = useRef<THREE.Group | null>(null);
  const activeMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const pausedRef = useRef(paused);
  const autoRotateRef = useRef(autoRotate);

  pausedRef.current = paused;
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const mat = activeMaterialRef.current;
    if (!mat) return;
    const preset = MATERIAL_PRESETS[materialMode];
    mat.color.setHex(preset.color);
    mat.roughness = preset.roughness;
    mat.metalness = preset.metalness;
    mat.wireframe = preset.wireframe;
    mat.needsUpdate = true;
  }, [materialMode]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate && !paused;
    }
  }, [autoRotate, paused]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let cancelled = false;
    let rafId = 0;

    setIsLoading(true);
    setLoadProgress(0);
    setLoadError(null);

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 300);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.05, 50);
    camera.position.set(1.9, 1.45, 3.1);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 1.4;
    controls.maxDistance = 6.2;
    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = Math.PI * 0.52;
    controls.target.set(0, 0.96, 0);
    controls.autoRotate = autoRotateRef.current && !pausedRef.current;
    controls.autoRotateSpeed = 1.45;
    controls.update();
    controlsRef.current = controls;

    // 3-point studio lighting
    const keyLight = new THREE.DirectionalLight(0xfff8ef, 2.3);
    keyLight.position.set(2.8, 4.5, 3.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7be8dc, 1.35);
    rimLight.position.set(-3.2, 2.8, -2.6);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xf6c37b, 0.65);
    fillLight.position.set(2.4, 0.9, -2.5);
    scene.add(fillLight);

    const hemi = new THREE.HemisphereLight(0xcbd5e1, 0x0f172a, 0.55);
    scene.add(hemi);

    // Studio turntable pedestal
    const pedestalGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(1.08, 1.18, 0.09, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x151b24,
      roughness: 0.48,
      metalness: 0.35,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.045;
    baseMesh.receiveShadow = true;
    pedestalGroup.add(baseMesh);

    const ringGeo = new THREE.RingGeometry(1.05, 1.075, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.002;
    pedestalGroup.add(ringMesh);
    scene.add(pedestalGroup);

    const preset = MATERIAL_PRESETS[materialMode];
    const sharedMat = new THREE.MeshStandardMaterial({
      color: preset.color,
      roughness: preset.roughness,
      metalness: preset.metalness,
      wireframe: preset.wireframe,
    });
    activeMaterialRef.current = sharedMat;

    const loadMesh = async () => {
      try {
        await MeshoptDecoder.ready;
        if (cancelled) return;

        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        const url = assetUrl(glbPath);

        loader.load(
          url,
          (gltf) => {
            if (cancelled) return;
            const root = gltf.scene;
            root.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = sharedMat;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                if (!mesh.geometry.attributes.normal) {
                  mesh.geometry.computeVertexNormals();
                }
              }
            });

            // Re-center precisely on Y=0 pedestal
            const box = new THREE.Box3().setFromObject(root);
            const center = new THREE.Vector3();
            box.getCenter(center);
            root.position.set(-center.x, -box.min.y, -center.z);

            const size = new THREE.Vector3();
            box.getSize(size);
            const targetY = Math.max(size.y * 0.48, 0.75);
            controls.target.set(0, targetY, 0);
            camera.position.set(1.75, targetY + 0.45, 3.05);
            controls.update();

            modelRootRef.current = root;
            scene.add(root);
            setIsLoading(false);
            setLoadProgress(100);
          },
          (evt) => {
            if (cancelled) return;
            if (evt.total > 0) {
              setLoadProgress(Math.min(99, Math.round((evt.loaded / evt.total) * 100)));
            }
          },
          (err) => {
            if (cancelled) return;
            console.error('GLB load failed:', err);
            setLoadError('Unable to load 3D geometry.');
            setIsLoading(false);
          }
        );
      } catch (err) {
        if (!cancelled) {
          console.error('Meshopt init failed:', err);
          setLoadError('WebGL mesh decoder initialization failed.');
          setIsLoading(false);
        }
      }
    };

    loadMesh();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 100);
        const h = Math.max(entry.contentRect.height, 100);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (pausedRef.current) return;
      controls.autoRotate = autoRotateRef.current;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      controls.dispose();
      if (modelRootRef.current) {
        modelRootRef.current.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            (obj as THREE.Mesh).geometry.dispose();
          }
        });
      }
      baseGeo.dispose();
      baseMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      sharedMat.dispose();
      envTarget.dispose();
      roomEnv.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [glbPath]);

  const handleResetView = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    ctrl.target.set(0, 0.96, 0);
    cam.position.set(1.75, 1.4, 3.05);
    ctrl.update();
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-slate-700/70 bg-gradient-to-b from-[#11161F] via-[#0E131B] to-[#080B0F] ${
        compact ? 'h-[380px] sm:h-[440px]' : 'h-[430px] sm:h-[520px]'
      }`}
    >
      {/* Subtle studio crosshair background */}
      <div className="pointer-events-none absolute inset-0 studio-grid-bg opacity-45" />

      {/* Three.js mount */}
      <div
        ref={mountRef}
        aria-label={`Interactive 3D viewer for ${title}`}
        className="relative z-10 h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0B0E13]/70 backdrop-blur-sm">
          <div className="w-56 rounded-xl border border-slate-700/80 bg-[#11161F] p-4 text-center shadow-xl">
            <p className="font-mono-tech text-xs uppercase tracking-wider text-[#2DD4BF]">
              Loading 3D Mesh… {loadProgress > 0 ? `${loadProgress}%` : ''}
            </p>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-[#2DD4BF] transition-all duration-200"
                style={{ width: `${Math.max(12, loadProgress)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-[#0B0E13]/85 p-6 text-center">
          <AlertTriangle className="h-7 w-7 text-[#F59E0B]" />
          <p className="text-sm font-medium text-[#F1F5F9]">{loadError}</p>
        </div>
      )}

      {/* Top-left hint */}
      <div className="pointer-events-none absolute top-3 left-3 z-20 hidden sm:flex items-center gap-2 rounded-md border border-slate-700/60 bg-[#0B0E13]/80 px-2.5 py-1 text-[11px] font-mono-tech text-[#94A3B8] backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
        Drag to orbit · Scroll to zoom
      </div>

      {/* Bottom control bar */}
      <div className="absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700/70 bg-[#0B0E13]/85 p-2 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1">
          {(Object.keys(MATERIAL_PRESETS) as MaterialMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setMaterialMode(mode)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                materialMode === mode
                  ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] ring-1 ring-[#2DD4BF]/40'
                  : 'text-[#94A3B8] hover:bg-slate-800/80 hover:text-[#F1F5F9]'
              }`}
            >
              {MATERIAL_PRESETS[mode].label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAutoRotate((v) => !v)}
            title={autoRotate ? 'Pause turntable' : 'Auto-rotate turntable'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-[#18202C] px-2.5 py-1 text-xs font-medium text-[#E2E8F0] transition hover:border-[#2DD4BF]/50 hover:text-[#2DD4BF]"
          >
            {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{autoRotate ? 'Pause' : 'Spin'}</span>
          </button>
          <button
            type="button"
            onClick={handleResetView}
            title="Reset camera angle"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-[#18202C] px-2.5 py-1 text-xs font-medium text-[#E2E8F0] transition hover:border-[#2DD4BF]/50 hover:text-[#2DD4BF]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
