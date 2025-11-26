import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Airplane3D() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const airplaneGroupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(6, 2, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xff6b6b, 0.3);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0x4a90e2, 0.5, 20);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Create airplane with more realistic proportions
    const airplaneGroup = new THREE.Group();
    airplaneGroupRef.current = airplaneGroup;

    // Metallic materials - AeroFlow brand colors
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.15
    });

    const accentMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xc8102e, // AeroFlow red
      metalness: 0.95,
      roughness: 0.05
    });

    const darkAccentMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.8,
      roughness: 0.2
    });

    // Fuselage (more elongated and realistic) - scaled up
    const fuselageGeometry = new THREE.CylinderGeometry(0.35, 0.28, 5, 32);
    const fuselage = new THREE.Mesh(fuselageGeometry, bodyMaterial);
    fuselage.rotation.z = Math.PI / 2;
    fuselage.castShadow = true;
    airplaneGroup.add(fuselage);

    // Red stripe along fuselage - AeroFlow branding
    const stripeGeometry = new THREE.CylinderGeometry(0.36, 0.29, 5, 32, 1, false, 0, Math.PI / 4);
    const stripe = new THREE.Mesh(stripeGeometry, accentMaterial);
    stripe.rotation.z = Math.PI / 2;
    stripe.position.z = 0;
    airplaneGroup.add(stripe);

    // Nose cone (sleeker) - scaled up
    const noseGeometry = new THREE.ConeGeometry(0.35, 0.9, 32);
    const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 2.95;
    nose.castShadow = true;
    airplaneGroup.add(nose);

    // Cockpit windows - scaled up
    const cockpitGeometry = new THREE.SphereGeometry(0.28, 32, 32, 0, Math.PI);
    const cockpitMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a2e,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0x4a90e2,
      emissiveIntensity: 0.4
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.rotation.z = -Math.PI / 2;
    cockpit.rotation.y = Math.PI / 2;
    cockpit.position.set(2.7, 0, 0.25);
    airplaneGroup.add(cockpit);

    // Main Wings (swept back, realistic) - scaled up
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(2.8, 0.4);
    wingShape.lineTo(2.8, 0.7);
    wingShape.lineTo(0, 0.2);
    const wingGeometry = new THREE.ExtrudeGeometry(wingShape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });
    
    const leftWing = new THREE.Mesh(wingGeometry, bodyMaterial);
    leftWing.position.set(0.3, 0, -0.06);
    leftWing.rotation.x = -Math.PI / 2;
    leftWing.castShadow = true;
    airplaneGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, bodyMaterial);
    rightWing.position.set(0.3, 0, 0.06);
    rightWing.rotation.x = Math.PI / 2;
    rightWing.rotation.y = Math.PI;
    rightWing.castShadow = true;
    airplaneGroup.add(rightWing);

    // Red wing tips - AeroFlow branding
    const wingTipGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.12);
    const leftWingTip = new THREE.Mesh(wingTipGeometry, accentMaterial);
    leftWingTip.position.set(2.6, 2.2, -0.06);
    leftWingTip.rotation.z = 0.3;
    airplaneGroup.add(leftWingTip);

    const rightWingTip = new THREE.Mesh(wingTipGeometry, accentMaterial);
    rightWingTip.position.set(2.6, -2.2, 0.06);
    rightWingTip.rotation.z = -0.3;
    airplaneGroup.add(rightWingTip);

    // Winglets - scaled up
    const wingletGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.08);
    const leftWinglet = new THREE.Mesh(wingletGeometry, accentMaterial);
    leftWinglet.position.set(2.8, 0.3, -0.06);
    leftWinglet.rotation.z = 0.4;
    leftWinglet.castShadow = true;
    airplaneGroup.add(leftWinglet);

    const rightWinglet = new THREE.Mesh(wingletGeometry, accentMaterial);
    rightWinglet.position.set(2.8, -0.3, 0.06);
    rightWinglet.rotation.z = -0.4;
    rightWinglet.castShadow = true;
    airplaneGroup.add(rightWinglet);

    // Engines - scaled up
    const engineGeometry = new THREE.CylinderGeometry(0.22, 0.26, 0.9, 32);
    const engineMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf0f0f0,
      metalness: 0.95,
      roughness: 0.2
    });
    
    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    leftEngine.rotation.z = Math.PI / 2;
    leftEngine.position.set(1.2, 1.8, -0.4);
    leftEngine.castShadow = true;
    airplaneGroup.add(leftEngine);

    const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    rightEngine.rotation.z = Math.PI / 2;
    rightEngine.position.set(1.2, -1.8, 0.4);
    rightEngine.castShadow = true;
    airplaneGroup.add(rightEngine);

    // Engine fans
    const fanGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 32);
    const fanMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.1
    });
    
    const leftFan = new THREE.Mesh(fanGeometry, fanMaterial);
    leftFan.rotation.z = Math.PI / 2;
    leftFan.position.set(1.65, 1.8, -0.4);
    airplaneGroup.add(leftFan);

    const rightFan = new THREE.Mesh(fanGeometry, fanMaterial);
    rightFan.rotation.z = Math.PI / 2;
    rightFan.position.set(1.65, -1.8, 0.4);
    airplaneGroup.add(rightFan);

    // Horizontal stabilizer (tail wing) - scaled up
    const tailWingGeometry = new THREE.BoxGeometry(0.1, 1.8, 0.5);
    const tailWing = new THREE.Mesh(tailWingGeometry, bodyMaterial);
    tailWing.position.set(-2.2, 0, 0);
    tailWing.castShadow = true;
    airplaneGroup.add(tailWing);

    // Vertical stabilizer (tail fin) - scaled up with red tip
    const tailFinGeometry = new THREE.BoxGeometry(0.1, 0.5, 1.0);
    const tailFin = new THREE.Mesh(tailFinGeometry, bodyMaterial);
    tailFin.position.set(-2.2, 0, 0.5);
    tailFin.rotation.x = Math.PI / 2;
    tailFin.castShadow = true;
    airplaneGroup.add(tailFin);

    // Red tail fin tip - AeroFlow branding
    const tailFinTipGeometry = new THREE.BoxGeometry(0.11, 0.5, 0.3);
    const tailFinTip = new THREE.Mesh(tailFinTipGeometry, accentMaterial);
    tailFinTip.position.set(-2.2, 0, 0.85);
    tailFinTip.rotation.x = Math.PI / 2;
    airplaneGroup.add(tailFinTip);

    // Fuselage windows - scaled up
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a2e,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0x4a90e2,
      emissiveIntensity: 0.3
    });
    
    for (let i = 0; i < 16; i++) {
      const windowGeometry = new THREE.BoxGeometry(0.18, 0.22, 0.03);
      const windowTop = new THREE.Mesh(windowGeometry, windowMaterial);
      windowTop.position.set(1.8 - i * 0.28, 0, 0.36);
      airplaneGroup.add(windowTop);
      
      const windowBottom = new THREE.Mesh(windowGeometry, windowMaterial);
      windowBottom.position.set(1.8 - i * 0.28, 0, -0.36);
      airplaneGroup.add(windowBottom);
    }

    // AeroFlow text on fuselage using 3D shapes
    const textMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xc8102e,
      metalness: 0.9,
      roughness: 0.1
    });
    
    // Simple "AF" logo representation
    const logoGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.02);
    const logo = new THREE.Mesh(logoGeometry, textMaterial);
    logo.position.set(-0.5, 0, 0.36);
    airplaneGroup.add(logo);

    scene.add(airplaneGroup);

    // Initial position
    airplaneGroup.position.set(0, 0, 0);
    airplaneGroup.rotation.set(0, 0.3, 0);

    // Scroll handling
    let scrollProgress = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = Math.min(scrollTop / Math.max(docHeight, 1), 1);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Base floating animation
      const floatY = Math.sin(Date.now() * 0.0008) * 0.3;
      const floatZ = Math.cos(Date.now() * 0.0006) * 0.2;

      // Scroll-based transformations - more dramatic
      airplaneGroup.rotation.y = 0.2 + scrollProgress * Math.PI * 3;
      airplaneGroup.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.3;
      airplaneGroup.rotation.x = scrollProgress * 0.3;
      
      airplaneGroup.position.y = floatY + scrollProgress * 4 - 1;
      airplaneGroup.position.x = Math.sin(scrollProgress * Math.PI * 2) * 3;
      airplaneGroup.position.z = floatZ + scrollProgress * 2;

      // Rotate engine fans faster
      if (leftFan && rightFan) {
        leftFan.rotation.x += 0.5;
        rightFan.rotation.x += 0.5;
      }

      // Camera follows airplane more dynamically
      camera.position.x = 6 + Math.sin(scrollProgress * Math.PI) * 3;
      camera.position.y = 2 + scrollProgress * 4;
      camera.position.z = 6 - scrollProgress * 2;
      camera.lookAt(airplaneGroup.position);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px]"
      style={{ position: "relative" }}
    />
  );
}