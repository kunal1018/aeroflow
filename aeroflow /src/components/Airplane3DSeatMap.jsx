import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function Airplane3DSeatMap({ seats, selectedSeats, onSeatSelect, maxSeats = 1 }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const seatMeshesRef = useRef(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const cameraTargetRef = useRef({ x: 0, y: 2, z: 0 });
  const cameraPositionRef = useRef({ x: 0, y: 18, z: 22 });

  const SEAT_SIZE = 0.4;
  const SEAT_SPACING = 0.7;
  const AISLE_WIDTH = 1.2;
  const ROW_SPACING = 0.9;
  const CABIN_WIDTH = 6;

  const getSeatColor = (seat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    const isHovered = hoveredSeat === seat.id;
    if (seat.is_booked) {
      return 0x4C4C4E;
    } else if (isSelected) {
      return 0x10B981;
    } else if (isHovered) {
      return 0xD97706; // Amber on hover
    } else {
      return 0x6B7280;
    }
  };

  const createSeat = (seatData) => {
    const group = new THREE.Group();
    
    // Seat cushion
    const cushionGeometry = new THREE.BoxGeometry(SEAT_SIZE, SEAT_SIZE * 0.5, SEAT_SIZE * 0.9);
    cushionGeometry.translate(0, 0, -0.05);
    const seatMaterial = new THREE.MeshStandardMaterial({ 
      color: getSeatColor(seatData),
      roughness: 0.7,
      metalness: 0.1
    });
    const seatMesh = new THREE.Mesh(cushionGeometry, seatMaterial);
    seatMesh.position.y = SEAT_SIZE * 0.25;
    seatMesh.castShadow = true;
    group.add(seatMesh);
    
    // Seat back
    const backGeometry = new THREE.BoxGeometry(SEAT_SIZE, SEAT_SIZE * 1.2, SEAT_SIZE * 0.15);
    const backMesh = new THREE.Mesh(backGeometry, seatMaterial.clone());
    backMesh.position.set(0, SEAT_SIZE * 0.8, -SEAT_SIZE * 0.5);
    backMesh.castShadow = true;
    group.add(backMesh);
    
    // Armrests
    const armrestGeometry = new THREE.BoxGeometry(SEAT_SIZE * 0.1, SEAT_SIZE * 0.4, SEAT_SIZE * 0.6);
    const armrestMaterial = new THREE.MeshStandardMaterial({ color: 0x3C3C3E, roughness: 0.8 });
    
    const leftArmrest = new THREE.Mesh(armrestGeometry, armrestMaterial);
    leftArmrest.position.set(-SEAT_SIZE * 0.45, SEAT_SIZE * 0.4, -0.1);
    leftArmrest.castShadow = true;
    group.add(leftArmrest);
    
    const rightArmrest = new THREE.Mesh(armrestGeometry, armrestMaterial);
    rightArmrest.position.set(SEAT_SIZE * 0.45, SEAT_SIZE * 0.4, -0.1);
    rightArmrest.castShadow = true;
    group.add(rightArmrest);
    
    group.userData = { id: seatData.id, seatData, meshes: [seatMesh, backMesh] };
    return group;
  };

  useEffect(() => {
    if (!mountRef.current || seats.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        throw new Error('WebGL not supported');
      }

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1A1A1C);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(
        60,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 18, 22);
      camera.lookAt(0, 2, 0);
      cameraRef.current = camera;
      
      // Initialize camera position refs
      cameraPositionRef.current = { x: 0, y: 18, z: 22 };

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.shadowMap.enabled = true;
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
    mainLight.position.set(0, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);

    // Cabin ceiling lights
    for (let i = -12; i < 15; i += 3) {
      const ceilingLight = new THREE.PointLight(0xffffee, 0.4, 5);
      ceilingLight.position.set(0, 3.5, i);
      scene.add(ceilingLight);
    }

    // Aisle carpet
    const carpetGeometry = new THREE.PlaneGeometry(AISLE_WIDTH * 0.8, 30);
    const carpetMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xD97706,
      roughness: 0.9,
      metalness: 0.1
    });
    const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.y = 0.01;
    carpet.receiveShadow = true;
    scene.add(carpet);

    // Cabin floor (dark)
    const floorGeometry = new THREE.PlaneGeometry(CABIN_WIDTH * 2, 35);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1A1A1C,
      roughness: 0.9
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Curved fuselage
    const fuselageRadius = CABIN_WIDTH / 2;
    const fuselageLength = 30;
    const fuselageGeometry = new THREE.CylinderGeometry(fuselageRadius, fuselageRadius, fuselageLength, 32, 1, true);
    const fuselageMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xE8E8EA,
      side: THREE.BackSide,
      roughness: 0.6,
      metalness: 0.3
    });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.rotation.x = Math.PI / 2;
    fuselage.position.y = fuselageRadius;
    scene.add(fuselage);

    // Windows
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.7,
      emissive: 0x4A90E2,
      emissiveIntensity: 0.3
    });
    
    for (let z = -12; z < 15; z += 1.5) {
      // Left windows
      const windowGeometry = new THREE.PlaneGeometry(0.3, 0.4);
      const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      leftWindow.position.set(-CABIN_WIDTH / 2 + 0.05, 1.5, z);
      leftWindow.rotation.y = Math.PI / 2;
      scene.add(leftWindow);
      
      // Right windows
      const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      rightWindow.position.set(CABIN_WIDTH / 2 - 0.05, 1.5, z);
      rightWindow.rotation.y = -Math.PI / 2;
      scene.add(rightWindow);
    }

    // Overhead bins
    const binMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xD5D5D7,
      roughness: 0.5,
      metalness: 0.2
    });
    
    const leftBinGeometry = new THREE.BoxGeometry(1.8, 0.6, 30);
    const leftBin = new THREE.Mesh(leftBinGeometry, binMaterial);
    leftBin.position.set(-2.2, 3.2, 0);
    leftBin.castShadow = true;
    scene.add(leftBin);
    
    const rightBinGeometry = new THREE.BoxGeometry(1.8, 0.6, 30);
    const rightBin = new THREE.Mesh(rightBinGeometry, binMaterial);
    rightBin.position.set(2.2, 3.2, 0);
    rightBin.castShadow = true;
    scene.add(rightBin);

    // Render seats
    const seatsByClass = seats.reduce((acc, seat) => {
      if (!acc[seat.seat_class]) acc[seat.seat_class] = [];
      acc[seat.seat_class].push(seat);
      return acc;
    }, {});

    let currentZ = -10;

    Object.keys(seatsByClass).sort().forEach(seatClass => {
      const classSeats = seatsByClass[seatClass];
      const rows = {};
      classSeats.forEach(seat => {
        const row = seat.seat_number.match(/\d+/)[0];
        if (!rows[row]) rows[row] = [];
        rows[row].push(seat);
      });

      const sortedRows = Object.keys(rows).sort((a, b) => parseInt(a) - parseInt(b));
      const seatsPerSide = seatClass === 'Business' || seatClass === 'First' ? 2 : 3;

      sortedRows.forEach(row => {
        const rowSeats = rows[row].sort((a, b) => a.seat_number.localeCompare(b.seat_number));
        let leftSeats = 0;
        let rightSeats = 0;

        rowSeats.forEach(seat => {
          const seatGroup = createSeat(seat);
          let xPos;

          if (leftSeats < seatsPerSide) {
            xPos = -AISLE_WIDTH / 2 - SEAT_SPACING * (seatsPerSide - leftSeats - 0.5);
            leftSeats++;
          } else {
            xPos = AISLE_WIDTH / 2 + SEAT_SPACING * (rightSeats + 0.5);
            rightSeats++;
          }

          seatGroup.position.set(xPos, 0, currentZ);
          seatGroup.castShadow = true;
          scene.add(seatGroup);
          seatMeshesRef.current.set(seat.id, seatGroup);
        });

        currentZ += ROW_SPACING;
      });

      currentZ += ROW_SPACING * 2; // Extra space between classes
    });

    // Animation loop with smooth camera movement
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Smooth camera interpolation
      const lerpFactor = 0.1;
      camera.position.x += (cameraPositionRef.current.x - camera.position.x) * lerpFactor;
      camera.position.y += (cameraPositionRef.current.y - camera.position.y) * lerpFactor;
      camera.position.z += (cameraPositionRef.current.z - camera.position.z) * lerpFactor;
      
      camera.lookAt(cameraTargetRef.current.x, cameraTargetRef.current.y, cameraTargetRef.current.z);
      
      renderer.render(scene, camera);
    };
    animate();

    // Mark as loaded after first render
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowTip(false), 5000); // Hide tip after 5 seconds
    }, 500);

    // Mouse controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (event) => {
      setIsDragging(true);
      setPreviousMousePosition({ x: event.clientX, y: event.clientY });
    };

    const onMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        
        cameraPositionRef.current.x -= deltaX * 0.02;
        cameraPositionRef.current.y += deltaY * 0.02;
        
        // Clamp camera position for better experience
        cameraPositionRef.current.x = Math.max(-15, Math.min(15, cameraPositionRef.current.x));
        cameraPositionRef.current.y = Math.max(8, Math.min(25, cameraPositionRef.current.y));
        
        setPreviousMousePosition({ x: event.clientX, y: event.clientY });
        return;
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let foundSeat = null;
      for (const intersect of intersects) {
        if (intersect.object.parent?.userData?.seatData) {
          const seatData = intersect.object.parent.userData.seatData;
          if (!seatData.is_booked) {
            document.body.style.cursor = 'pointer';
            foundSeat = seatData.id;
            break;
          }
        }
      }
      
      setHoveredSeat(foundSeat);
      if (!foundSeat) {
        document.body.style.cursor = 'default';
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    const onClick = (event) => {
      if (isDragging) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const intersect of intersects) {
        if (intersect.object.parent?.userData?.seatData) {
          const seatData = intersect.object.parent.userData.seatData;
          if (!seatData.is_booked) {
            const isSelected = selectedSeats.some(s => s.id === seatData.id);
            if (isSelected) {
              onSeatSelect(selectedSeats.filter(s => s.id !== seatData.id));
              setShowLimitWarning(false);
            } else if (selectedSeats.length < maxSeats) {
              onSeatSelect([...selectedSeats, seatData]);
              setShowLimitWarning(false);
            } else {
              // Show warning when trying to select more than max
              setShowLimitWarning(true);
              setTimeout(() => setShowLimitWarning(false), 2000);
            }
            break;
          }
        }
      }
    };

    const onWheel = (event) => {
      event.preventDefault();
      if (cameraRef.current) {
        const zoomSpeed = 0.5;
        cameraPositionRef.current.z += event.deltaY * 0.01 * zoomSpeed;
        cameraPositionRef.current.y += event.deltaY * 0.005 * zoomSpeed;
        cameraPositionRef.current.z = Math.max(10, Math.min(35, cameraPositionRef.current.z));
        cameraPositionRef.current.y = Math.max(8, Math.min(25, cameraPositionRef.current.y));
      }
    };

    const handleResize = () => {
      if (mountRef.current && camera && renderer) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };

    mountRef.current.addEventListener('mousedown', onMouseDown);
    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('mouseup', onMouseUp);
    mountRef.current.addEventListener('click', onClick);
    mountRef.current.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', handleResize);

      return () => {
        if (mountRef.current) {
          mountRef.current.removeEventListener('mousedown', onMouseDown);
          mountRef.current.removeEventListener('mousemove', onMouseMove);
          mountRef.current.removeEventListener('mouseup', onMouseUp);
          mountRef.current.removeEventListener('click', onClick);
          mountRef.current.removeEventListener('wheel', onWheel);
        }
        window.removeEventListener('resize', handleResize);
        const currentMount = mountRef.current;
        if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
        seatMeshesRef.current.clear();
      };
    } catch (err) {
      console.error('3D seat map error:', err);
      setError(err.message || 'Failed to load 3D view');
      setIsLoading(false);
    }
  }, [seats, maxSeats, onSeatSelect]);

  // Update colors when selection or hover changes
  useEffect(() => {
    seatMeshesRef.current.forEach((group, seatId) => {
      const seatData = seats.find(s => s.id === seatId);
      if (seatData && group.userData.meshes) {
        const newColor = getSeatColor(seatData);
        group.userData.meshes.forEach(mesh => {
          mesh.material.color.set(newColor);
        });
      }
    });
  }, [selectedSeats, seats, hoveredSeat]);

  if (seats.length === 0) {
    return (
      <div className="w-full h-[700px] rounded-2xl overflow-hidden border border-[#3C3C3E] bg-gradient-to-b from-[#1A1A1C] to-[#0A0A0C] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#A8B0BA] text-lg">No seats available</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[700px] rounded-2xl overflow-hidden border border-red-700/40 bg-gradient-to-b from-[#1A1A1C] to-[#0A0A0C] flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-400 text-lg font-semibold mb-2">Unable to load 3D view</p>
          <p className="text-[#A8B0BA] text-sm">{error}</p>
          <p className="text-[#A8B0BA] text-xs mt-4">Please ensure WebGL is enabled in your browser</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mountRef} 
        className="w-full h-[700px] rounded-2xl overflow-hidden border border-[#3C3C3E] bg-gradient-to-b from-[#1A1A1C] to-[#0A0A0C] cursor-grab active:cursor-grabbing transition-all"
        style={{ touchAction: 'none' }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1C]/90 backdrop-blur-md rounded-2xl transition-opacity duration-300">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#EDEDED] font-semibold text-lg">Loading 3D Seat Map...</p>
            <p className="text-[#A8B0BA] text-sm mt-2">Rendering cabin interior</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-[#D97706] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#D97706] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#D97706] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {showTip && !isLoading && (
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-[#2C2C2E]/95 to-[#3C3C3E]/95 backdrop-blur-sm border border-[#D97706]/30 rounded-xl px-5 py-3 text-xs text-[#EDEDED] shadow-[0_4px_15px_rgba(217,119,6,0.2)] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-semibold mb-1">Interactive Controls:</p>
              <p className="text-[#A8B0BA] leading-relaxed">🖱️ Click seat to select • Drag to rotate view • Scroll to zoom</p>
            </div>
            <button 
              onClick={() => setShowTip(false)}
              className="ml-2 text-[#A8B0BA] hover:text-[#EDEDED] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {selectedSeats.length > 0 && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-900/90 to-emerald-800/90 backdrop-blur-sm border border-emerald-700/50 rounded-xl px-5 py-3 shadow-[0_4px_15px_rgba(16,185,129,0.3)] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-emerald-100 font-semibold">
              {selectedSeats.length} / {maxSeats} seat{maxSeats > 1 ? 's' : ''} selected
            </span>
          </div>
        </div>
      )}

      {hoveredSeat && !isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-700 backdrop-blur-sm border border-amber-500/50 rounded-xl px-5 py-2.5 text-sm text-white font-bold shadow-[0_4px_15px_rgba(217,119,6,0.4)] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2">
            <span className="text-lg">💺</span>
            <span>Seat {seats.find(s => s.id === hoveredSeat)?.seat_number}</span>
          </div>
        </div>
      )}

      {showLimitWarning && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm border border-red-500/50 rounded-xl px-6 py-4 text-sm text-white font-bold shadow-[0_4px_20px_rgba(220,38,38,0.5)] animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold">Selection Limit Reached</p>
              <p className="text-xs text-red-100 font-normal mt-1">Maximum {maxSeats} seat{maxSeats > 1 ? 's' : ''} allowed. Deselect a seat first.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}