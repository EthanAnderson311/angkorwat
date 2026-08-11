import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { StoryChapter } from '../../data/angkorHistoryData';
import { Orbit, Compass, Sun, Moon, Eye, Layers } from 'lucide-react';

interface AngkorWat3DCanvasProps {
  currentChapter: StoryChapter;
  activeHotspotId: string | null;
  onSelectHotspot: (hotspotId: string) => void;
  timeOfDay: number; // 0 to 1 (0: Dawn, 0.25: Morning, 0.5: Noon, 0.75: Sunset, 1.0: Night)
  isOrbitMode: boolean;
  onToggleOrbitMode: (orbit: boolean) => void;
}

export const AngkorWat3DCanvas: React.FC<AngkorWat3DCanvasProps> = ({
  currentChapter,
  activeHotspotId,
  onSelectHotspot,
  timeOfDay,
  isOrbitMode,
  onToggleOrbitMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Controls & Animation
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: 0.8, phi: 0.6, radius: 100 });
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 45, 120));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 10, 0));
  const currentCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 45, 120));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 10, 0));

  // Lighting & Sky references
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const skyMeshRef = useRef<THREE.Mesh | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);

  // Hotspot Screen Positions
  const [screenHotspots, setScreenHotspots] = useState<{ id: string; label: string; x: number; y: number; visible: boolean }[]>([]);
  const [wireframeMode, setWireframeMode] = useState(false);

  // Update Target Camera based on currentChapter or activeHotspot
  useEffect(() => {
    if (!isOrbitMode && currentChapter) {
      const { position, lookAt } = currentChapter.cameraTarget;
      targetCameraPosRef.current.set(...position);
      targetLookAtRef.current.set(...lookAt);
    }
  }, [currentChapter, isOrbitMode]);

  // Handle Hotspot Target Camera
  useEffect(() => {
    if (activeHotspotId && currentChapter) {
      const hs = currentChapter.hotspots.find(h => h.id === activeHotspotId);
      if (hs) {
        // Move camera closer to hotspot
        targetLookAtRef.current.set(hs.position[0], hs.position[1] + 2, hs.position[2]);
        targetCameraPosRef.current.set(
          hs.position[0] - 25,
          hs.position[1] + 15,
          hs.position[2] + 35
        );
      }
    }
  }, [activeHotspotId, currentChapter]);

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0xEAD8B1, 0.0035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 45, 120);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Load Sandstone Texture
    const textureLoader = new THREE.TextureLoader();
    const sandstoneTexture = textureLoader.load('/src/assets/images/angkor_sandstone_texture_1786454804835.jpg');
    sandstoneTexture.wrapS = THREE.RepeatWrapping;
    sandstoneTexture.wrapT = THREE.RepeatWrapping;
    sandstoneTexture.repeat.set(4, 4);

    const sandstoneMat = new THREE.MeshStandardMaterial({
      color: 0xcbb28e,
      roughness: 0.85,
      metalness: 0.1,
      map: sandstoneTexture,
      bumpMap: sandstoneTexture,
      bumpScale: 0.15,
    });

    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: 0x826e54,
      roughness: 0.9,
      metalness: 0.05,
      map: sandstoneTexture,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe0a838,
      roughness: 0.3,
      metalness: 0.8,
    });

    // 4. Build Procedural Angkor Wat Temple Complex
    const templeGroup = new THREE.Group();
    scene.add(templeGroup);

    // A. Outer Moat Water & Island Earth
    const moatGeo = new THREE.PlaneGeometry(350, 350, 32, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x1d3840,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9,
    });
    const waterMesh = new THREE.Mesh(moatGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -0.5;
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // Sacred Temple Island Platform
    const islandGeo = new THREE.BoxGeometry(220, 3, 220);
    const islandMesh = new THREE.Mesh(islandGeo, darkStoneMat);
    islandMesh.position.y = 1;
    islandMesh.receiveShadow = true;
    templeGroup.add(islandMesh);

    // Western Causeway Bridge across Moat
    const causewayGeo = new THREE.BoxGeometry(100, 2.5, 18);
    const causewayMesh = new THREE.Mesh(causewayGeo, sandstoneMat);
    causewayMesh.position.set(-110, 1.25, 0);
    causewayMesh.castShadow = true;
    causewayMesh.receiveShadow = true;
    templeGroup.add(causewayMesh);

    // Naga Bridge Balustrade Pillars
    for (let x = -150; x <= -60; x += 15) {
      const nagaGeo = new THREE.CylinderGeometry(0.8, 1, 3, 8);
      const nagaLeft = new THREE.Mesh(nagaGeo, sandstoneMat);
      nagaLeft.position.set(x, 3, -9.5);
      nagaLeft.castShadow = true;

      const nagaRight = new THREE.Mesh(nagaGeo, sandstoneMat);
      nagaRight.position.set(x, 3, 9.5);
      nagaRight.castShadow = true;

      templeGroup.add(nagaLeft, nagaRight);
    }

    // B. Outer Gallery Enclosure (Level 1)
    const level1Size = 130;
    const level1Height = 8;
    const level1WallGeo = new THREE.BoxGeometry(level1Size, level1Height, level1Size);
    const level1Mesh = new THREE.Mesh(level1WallGeo, sandstoneMat);
    level1Mesh.position.y = level1Height / 2 + 2;
    level1Mesh.castShadow = true;
    level1Mesh.receiveShadow = true;
    templeGroup.add(level1Mesh);

    // Hollow Inner Courtyard 1
    const courtyard1Geo = new THREE.BoxGeometry(110, level1Height + 1, 110);
    const courtyard1Mesh = new THREE.Mesh(courtyard1Geo, darkStoneMat);
    courtyard1Mesh.position.y = level1Height / 2 + 2;
    // We add courtyard inner steps
    templeGroup.add(courtyard1Mesh);

    // C. Middle Tier Platform (Level 2)
    const level2Size = 80;
    const level2Height = 12;
    const level2BaseGeo = new THREE.BoxGeometry(level2Size, level2Height, level2Size);
    const level2Mesh = new THREE.Mesh(level2BaseGeo, sandstoneMat);
    level2Mesh.position.y = level2Height / 2 + level1Height + 2;
    level2Mesh.castShadow = true;
    level2Mesh.receiveShadow = true;
    templeGroup.add(level2Mesh);

    // D. Inner Bakan Sanctuary Platform (Level 3 - Sacred Meru Tier)
    const level3Size = 50;
    const level3Height = 14;
    const level3BaseGeo = new THREE.BoxGeometry(level3Size, level3Height, level3Size);
    const level3Mesh = new THREE.Mesh(level3BaseGeo, sandstoneMat);
    level3Mesh.position.y = level3Height / 2 + level1Height + level2Height + 2;
    level3Mesh.castShadow = true;
    level3Mesh.receiveShadow = true;
    templeGroup.add(level3Mesh);

    // E. Construct the 5 Lotus-Bud Towers (Quincunx Arrangement)
    const createLotusTower = (x: number, z: number, totalHeight: number, baseWidth: number, isCenter = false) => {
      const towerGroup = new THREE.Group();
      towerGroup.position.set(x, level1Height + level2Height + level3Height + 2, z);

      // Stacked Tiered Corbelled Rings
      const tiers = 7;
      for (let i = 0; i < tiers; i++) {
        const factor = 1 - Math.pow(i / tiers, 1.4);
        const ringWidth = baseWidth * factor;
        const ringHeight = totalHeight / tiers;

        const ringGeo = new THREE.CylinderGeometry(
          ringWidth * 0.85,
          ringWidth,
          ringHeight,
          12
        );
        const ringMesh = new THREE.Mesh(ringGeo, sandstoneMat);
        ringMesh.position.y = i * ringHeight + ringHeight / 2;
        ringMesh.castShadow = true;
        ringMesh.receiveShadow = true;
        towerGroup.add(ringMesh);

        // Decorative Cornice Ribs
        if (i < tiers - 1) {
          const ribGeo = new THREE.BoxGeometry(ringWidth * 1.1, ringHeight * 0.3, ringWidth * 1.1);
          const ribMesh = new THREE.Mesh(ribGeo, darkStoneMat);
          ribMesh.position.y = i * ringHeight + ringHeight * 0.9;
          ribMesh.castShadow = true;
          towerGroup.add(ribMesh);
        }
      }

      // Lotus Bud Crown Tip
      const crownGeo = new THREE.ConeGeometry(baseWidth * 0.4, totalHeight * 0.25, 12);
      const crownMesh = new THREE.Mesh(crownGeo, isCenter ? goldMat : sandstoneMat);
      crownMesh.position.y = totalHeight + (totalHeight * 0.25) / 2;
      crownMesh.castShadow = true;
      towerGroup.add(crownMesh);

      // Spire Finial (Kalasa)
      const spireGeo = new THREE.CylinderGeometry(0.1, 0.6, 4, 8);
      const spireMesh = new THREE.Mesh(spireGeo, goldMat);
      spireMesh.position.y = totalHeight + totalHeight * 0.25 + 2;
      towerGroup.add(spireMesh);

      return towerGroup;
    };

    // Central Tower (Highest - Mount Meru Peak)
    const centralTower = createLotusTower(0, 0, 32, 14, true);
    templeGroup.add(centralTower);

    // 4 Corner Towers
    const cornerOffset = 18;
    const cornerTower1 = createLotusTower(cornerOffset, cornerOffset, 22, 10);
    const cornerTower2 = createLotusTower(-cornerOffset, cornerOffset, 22, 10);
    const cornerTower3 = createLotusTower(cornerOffset, -cornerOffset, 22, 10);
    const cornerTower4 = createLotusTower(-cornerOffset, -cornerOffset, 22, 10);
    templeGroup.add(cornerTower1, cornerTower2, cornerTower3, cornerTower4);

    // F. Sky Dome
    const skyGeo = new THREE.SphereGeometry(400, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0xf5cf9d,
      side: THREE.BackSide,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);
    skyMeshRef.current = skyMesh;

    // G. Particle System (Golden Dust & Mist)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 200;
      particlePos[i + 1] = Math.random() * 60 + 2;
      particlePos[i + 2] = (Math.random() - 0.5) * 200;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffe6b0,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // H. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff3e0, 0.7);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    sunLight.position.set(-80, 70, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 300;
    const d = 100;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 5. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Water Ripple Animation
      if (waterMeshRef.current) {
        waterMeshRef.current.position.y = -0.5 + Math.sin(Date.now() * 0.0015) * 0.1;
      }

      // Smooth Camera Lerp
      currentCameraPosRef.current.lerp(targetCameraPosRef.current, 0.04);
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.04);

      if (cameraRef.current) {
        cameraRef.current.position.copy(currentCameraPosRef.current);
        cameraRef.current.lookAt(currentLookAtRef.current);
      }

      // Calculate Hotspot Screen Coordinates
      if (currentChapter && cameraRef.current && containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;

        const updatedHotspots = currentChapter.hotspots.map(hs => {
          const worldPos = new THREE.Vector3(...hs.position);
          worldPos.project(cameraRef.current!);

          const x = (worldPos.x * 0.5 + 0.5) * w;
          const y = (-(worldPos.y * 0.5) + 0.5) * h;
          const visible = worldPos.z < 1.0;

          return {
            id: hs.id,
            label: hs.label,
            x,
            y,
            visible,
          };
        });

        setScreenHotspots(updatedHotspots);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Listener
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Time-of-Day Atmosphere & Lighting
  useEffect(() => {
    if (!sunLightRef.current || !ambientLightRef.current || !skyMeshRef.current || !sceneRef.current) return;

    // Time map:
    // 0 = Dawn Sunrise (Golden Orange)
    // 0.25 = Morning Bright (Soft White Gold)
    // 0.5 = High Noon (Clear Bright Sunlight)
    // 0.75 = Crimson Sunset (Deep Rose Gold)
    // 1.0 = Night (Deep Sapphire Starry)

    const angle = (timeOfDay - 0.25) * Math.PI * 2;
    const sunX = Math.cos(angle) * 120;
    const sunY = Math.sin(angle) * 90;
    const sunZ = Math.sin(angle) * 60;

    sunLightRef.current.position.set(sunX, Math.max(sunY, -10), sunZ);

    if (timeOfDay < 0.2) {
      // Dawn
      skyMeshRef.current.material = new THREE.MeshBasicMaterial({ color: 0xe89758, side: THREE.BackSide });
      sceneRef.current.fog = new THREE.FogExp2(0xe89758, 0.003);
      sunLightRef.current.color.setHex(0xffaa55);
      sunLightRef.current.intensity = 1.6;
      ambientLightRef.current.color.setHex(0xffcb9a);
    } else if (timeOfDay < 0.6) {
      // Day
      skyMeshRef.current.material = new THREE.MeshBasicMaterial({ color: 0x98cbe0, side: THREE.BackSide });
      sceneRef.current.fog = new THREE.FogExp2(0xcce8f5, 0.002);
      sunLightRef.current.color.setHex(0xffffff);
      sunLightRef.current.intensity = 2.0;
      ambientLightRef.current.color.setHex(0xe8f4f8);
    } else if (timeOfDay < 0.85) {
      // Sunset
      skyMeshRef.current.material = new THREE.MeshBasicMaterial({ color: 0xd95b3b, side: THREE.BackSide });
      sceneRef.current.fog = new THREE.FogExp2(0xd95b3b, 0.0035);
      sunLightRef.current.color.setHex(0xff6622);
      sunLightRef.current.intensity = 1.5;
      ambientLightRef.current.color.setHex(0xff9966);
    } else {
      // Night
      skyMeshRef.current.material = new THREE.MeshBasicMaterial({ color: 0x0a1118, side: THREE.BackSide });
      sceneRef.current.fog = new THREE.FogExp2(0x0a1118, 0.004);
      sunLightRef.current.color.setHex(0x5588cc);
      sunLightRef.current.intensity = 0.4;
      ambientLightRef.current.color.setHex(0x1a2b3c);
    }
  }, [timeOfDay]);

  // Wireframe Toggle
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child !== skyMeshRef.current && child !== waterMeshRef.current) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => { m.wireframe = wireframeMode; });
        } else if (child.material) {
          child.material.wireframe = wireframeMode;
        }
      }
    });
  }, [wireframeMode]);

  // Mouse Orbit Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isOrbitMode) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isOrbitMode || !isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    cameraAngleRef.current.theta -= deltaX * 0.008;
    cameraAngleRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, cameraAngleRef.current.phi + deltaY * 0.008));

    const { theta, phi, radius } = cameraAngleRef.current;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    targetCameraPosRef.current.set(x, y + 10, z);

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div 
      className="relative w-full h-full min-h-[480px] bg-neutral-900 select-none overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Three.js WebGL Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Interactive 3D Hotspot Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {screenHotspots.map(hs => (
          hs.visible && (
            <button
              key={hs.id}
              id={`hotspot-btn-${hs.id}`}
              onClick={() => onSelectHotspot(hs.id)}
              style={{ left: `${hs.x}px`, top: `${hs.y}px` }}
              className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-medium transition-all shadow-lg ${
                activeHotspotId === hs.id
                  ? 'bg-amber-500 text-neutral-950 border-amber-300 scale-110 shadow-amber-500/40'
                  : 'bg-neutral-900/80 text-amber-200 border-amber-500/40 hover:bg-amber-900/80 hover:border-amber-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{hs.label}</span>
            </button>
          )
        ))}
      </div>

      {/* Top 3D Control Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-900/50 text-xs text-amber-100/80 shadow-lg">
          <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="font-serif tracking-wider text-amber-300">
            {isOrbitMode ? '3D Orbit Mode: Drag to Inspect' : `Parallax Camera: Chapter ${currentChapter.number}`}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Wireframe Architectural View Button */}
          <button
            id="toggle-wireframe-btn"
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs flex items-center gap-1.5 ${
              wireframeMode 
                ? 'bg-amber-500 text-neutral-950 border-amber-300 font-bold' 
                : 'bg-neutral-900/80 text-amber-200 border-amber-900/40 hover:bg-neutral-800'
            }`}
            title="Toggle Architectural Wireframe"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Wireframe</span>
          </button>

          {/* Toggle Free Orbit Mode Button */}
          <button
            id="toggle-orbit-mode-btn"
            onClick={() => onToggleOrbitMode(!isOrbitMode)}
            className={`px-3 py-2 rounded-xl backdrop-blur-md border transition-all text-xs font-semibold flex items-center gap-1.5 ${
              isOrbitMode
                ? 'bg-amber-500 text-neutral-950 border-amber-300 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-900/80 text-amber-200 border-amber-900/40 hover:bg-neutral-800'
            }`}
          >
            <Orbit className="w-4 h-4" />
            <span>{isOrbitMode ? 'Exit Orbit' : 'Explore 3D Orbit'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Subtle Overlay Watermark */}
      <div className="absolute bottom-4 left-4 pointer-events-none text-[10px] uppercase tracking-widest text-amber-400/40 font-mono">
        Angkor Wat Procedural 3D Model • 12th Century Sanctuary
      </div>
    </div>
  );
};
