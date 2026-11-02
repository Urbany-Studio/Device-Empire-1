import * as THREE from 'three';

export interface PhoneConfig {
  width: number;
  height: number;
  thickness: number;
  cornerRadius: number;
  bodyColor: string;
  bodyMaterial: 'glass' | 'metal' | 'plastic' | 'ceramic';
  frameColor: string;
  frameMaterial: 'aluminum' | 'steel' | 'titanium';
  screenOn: boolean;
  screenColor: string;
  cameraCount: number;
  cameraSize: number;
  hasNotch: boolean;
  hasPunchHole: boolean;
}

const defaultConfig: PhoneConfig = {
  width: 72,
  height: 155,
  thickness: 8,
  cornerRadius: 12,
  bodyColor: '#1a1a2e',
  bodyMaterial: 'glass',
  frameColor: '#4a4a5a',
  frameMaterial: 'aluminum',
  screenOn: true,
  screenColor: '#000000',
  cameraCount: 3,
  cameraSize: 8,
  hasNotch: false,
  hasPunchHole: true,
};

function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = w / 2, hh = h / 2;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return shape;
}

export class PhoneModel {
  group: THREE.Group;
  private bodyMesh: THREE.Mesh | null = null;
  private screenMesh: THREE.Mesh | null = null;
  private frameMesh: THREE.Mesh | null = null;
  private cameraModule: THREE.Group;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.cameraModule = new THREE.Group();
    this.group.add(this.cameraModule);
    scene.add(this.group);
    this.update(defaultConfig);
  }

  update(config: PhoneConfig) {
    // Clear previous
    while (this.group.children.length > 0) {
      const child = this.group.children[0];
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
      this.group.remove(child);
    }
    this.cameraModule = new THREE.Group();

    const scale = 0.01;
    const w = config.width * scale;
    const h = config.height * scale;
    const d = config.thickness * scale;
    const r = config.cornerRadius * scale;

    // Body (back)
    const bodyShape = createRoundedRectShape(w, h, r);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth: d * 0.4,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 3,
    });
    
    const bodyMat = this.getMaterial(config.bodyMaterial, config.bodyColor);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.z = -d * 0.2;
    body.rotation.x = Math.PI;
    this.group.add(body);
    this.bodyMesh = body;

    // Frame
    const frameShape = createRoundedRectShape(w + 0.01, h + 0.01, r + 0.005);
    const innerShape = createRoundedRectShape(w - 0.01, h - 0.01, r - 0.005);
    frameShape.holes.push(innerShape as any);
    
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
      depth: d,
      bevelEnabled: false,
    });
    const frameMat = this.getFrameMaterial(config.frameMaterial, config.frameColor);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.z = -d * 0.5;
    this.group.add(frame);
    this.frameMesh = frame;

    // Screen
    const screenShape = createRoundedRectShape(w * 0.92, h * 0.95, r * 0.8);
    const screenGeo = new THREE.ExtrudeGeometry(screenShape, {
      depth: 0.003,
      bevelEnabled: true,
      bevelThickness: 0.001,
      bevelSize: 0.001,
      bevelSegments: 2,
    });
    
    const screenMat = new THREE.MeshPhysicalMaterial({
      color: config.screenOn ? config.screenColor : '#111111',
      metalness: 0.1,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.9,
      emissive: config.screenOn ? new THREE.Color(config.screenColor).multiplyScalar(0.1) : new THREE.Color(0x000000),
      emissiveIntensity: config.screenOn ? 0.3 : 0,
    });
    
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = d * 0.48;
    this.group.add(screen);
    this.screenMesh = screen;

    // Screen content (if on)
    if (config.screenOn) {
      const contentGeo = new THREE.PlaneGeometry(w * 0.85, h * 0.88);
      const contentMat = new THREE.MeshBasicMaterial({
        color: '#1a1a2e',
        transparent: true,
        opacity: 0.9,
      });
      const content = new THREE.Mesh(contentGeo, contentMat);
      content.position.z = d * 0.49;
      this.group.add(content);

      // Status bar dots
      for (let i = 0; i < 3; i++) {
        const dotGeo = new THREE.CircleGeometry(0.008, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(-0.15 + i * 0.15, h * 0.38, d * 0.495);
        this.group.add(dot);
      }

      // App icons grid
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const iconGeo = new THREE.PlaneGeometry(0.04, 0.04);
          const hue = (row * 4 + col) / 16;
          const iconColor = new THREE.Color().setHSL(hue, 0.7, 0.5);
          const iconMat = new THREE.MeshBasicMaterial({ color: iconColor });
          const icon = new THREE.Mesh(iconGeo, iconMat);
          icon.position.set(
            -0.1 + col * 0.07,
            0.15 - row * 0.08,
            d * 0.495
          );
          this.group.add(icon);
        }
      }
    }

    // Punch hole camera
    if (config.hasPunchHole) {
      const holeGeo = new THREE.CircleGeometry(0.012, 16);
      const holeMat = new THREE.MeshBasicMaterial({ color: '#000000' });
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.position.set(0, h * 0.42, d * 0.496);
      this.group.add(hole);
    }

    // Camera module on back
    this.buildCameraModule(config, w, h, d, r);

    // Side buttons
    const btnGeo = new THREE.BoxGeometry(0.008, 0.04, d * 0.3);
    const btnMat = new THREE.MeshStandardMaterial({ color: config.frameColor, metalness: 0.8, roughness: 0.2 });
    
    const powerBtn = new THREE.Mesh(btnGeo, btnMat);
    powerBtn.position.set(w / 2 + 0.005, 0.1, 0);
    this.group.add(powerBtn);

    const volUp = new THREE.Mesh(btnGeo.clone(), btnMat);
    volUp.position.set(-w / 2 - 0.005, 0.15, 0);
    this.group.add(volUp);

    const volDown = new THREE.Mesh(btnGeo.clone(), btnMat);
    volDown.position.set(-w / 2 - 0.005, 0.08, 0);
    this.group.add(volDown);

    // USB-C port
    const usbGeo = new THREE.BoxGeometry(0.025, 0.006, 0.01);
    const usbMat = new THREE.MeshStandardMaterial({ color: '#333333', metalness: 0.5, roughness: 0.5 });
    const usb = new THREE.Mesh(usbGeo, usbMat);
    usb.position.set(0, -h / 2 - 0.002, 0);
    this.group.add(usb);

    // Speaker grilles
    for (let i = 0; i < 6; i++) {
      const grilleGeo = new THREE.CircleGeometry(0.004, 8);
      const grilleMat = new THREE.MeshBasicMaterial({ color: '#222222' });
      const grille = new THREE.Mesh(grilleGeo, grilleMat);
      grille.position.set(0.03 + i * 0.012, -h / 2 - 0.001, d * 0.1);
      grille.rotation.x = Math.PI / 2;
      this.group.add(grille);
    }

    this.group.add(this.cameraModule);
  }

  private buildCameraModule(config: PhoneConfig, w: number, h: number, d: number, r: number) {
    const camGroup = new THREE.Group();
    
    // Camera housing
    const housingSize = config.cameraCount <= 2 ? 0.08 : 0.12;
    const housingGeo = new THREE.ExtrudeGeometry(
      createRoundedRectShape(housingSize, housingSize, 0.015),
      { depth: 0.008, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2 }
    );
    const housingMat = new THREE.MeshStandardMaterial({
      color: config.bodyColor,
      metalness: 0.3,
      roughness: 0.4,
    });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.set(-w * 0.2, h * 0.25, -d * 0.5 - 0.005);
    camGroup.add(housing);

    // Camera lenses
    const positions = this.getCameraPositions(config.cameraCount);
    positions.forEach((pos, i) => {
      // Lens ring
      const ringGeo = new THREE.TorusGeometry(config.cameraSize * 0.001, 0.003, 8, 24);
      const ringMat = new THREE.MeshStandardMaterial({
        color: '#666666',
        metalness: 0.9,
        roughness: 0.1,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(
        -w * 0.2 + pos.x,
        h * 0.25 + pos.y,
        -d * 0.5 - 0.01
      );
      camGroup.add(ring);

      // Lens glass
      const lensGeo = new THREE.CircleGeometry(config.cameraSize * 0.0008, 24);
      const lensMat = new THREE.MeshPhysicalMaterial({
        color: '#0a0a1a',
        metalness: 0.1,
        roughness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        reflectivity: 1.0,
      });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.position.set(
        -w * 0.2 + pos.x,
        h * 0.25 + pos.y,
        -d * 0.5 - 0.012
      );
      camGroup.add(lens);

      // Inner lens reflection
      const innerGeo = new THREE.CircleGeometry(config.cameraSize * 0.0004, 16);
      const innerMat = new THREE.MeshBasicMaterial({
        color: '#1a0a3a',
        transparent: true,
        opacity: 0.6,
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      inner.position.set(
        -w * 0.2 + pos.x,
        h * 0.25 + pos.y,
        -d * 0.5 - 0.013
      );
      camGroup.add(inner);
    });

    // Flash
    const flashGeo = new THREE.CircleGeometry(0.006, 16);
    const flashMat = new THREE.MeshBasicMaterial({ color: '#ffffcc' });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    flash.position.set(-w * 0.2 + 0.04, h * 0.25 - 0.04, -d * 0.5 - 0.006);
    camGroup.add(flash);

    this.cameraModule = camGroup;
  }

  private getCameraPositions(count: number): { x: number; y: number }[] {
    switch (count) {
      case 1: return [{ x: 0, y: 0 }];
      case 2: return [{ x: -0.02, y: 0.02 }, { x: -0.02, y: -0.02 }];
      case 3: return [{ x: -0.02, y: 0.025 }, { x: -0.02, y: -0.025 }, { x: 0.02, y: 0 }];
      case 4: return [{ x: -0.025, y: 0.025 }, { x: -0.025, y: -0.025 }, { x: 0.025, y: 0.025 }, { x: 0.025, y: -0.025 }];
      default: return [{ x: 0, y: 0 }];
    }
  }

  private getMaterial(type: string, color: string): THREE.Material {
    switch (type) {
      case 'glass':
        return new THREE.MeshPhysicalMaterial({
          color,
          metalness: 0.1,
          roughness: 0.1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          reflectivity: 0.8,
          transparent: true,
          opacity: 0.95,
        });
      case 'metal':
        return new THREE.MeshStandardMaterial({
          color,
          metalness: 0.9,
          roughness: 0.2,
        });
      case 'ceramic':
        return new THREE.MeshPhysicalMaterial({
          color,
          metalness: 0.0,
          roughness: 0.3,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
        });
      default: // plastic
        return new THREE.MeshStandardMaterial({
          color,
          metalness: 0.0,
          roughness: 0.6,
        });
    }
  }

  private getFrameMaterial(type: string, color: string): THREE.Material {
    switch (type) {
      case 'titanium':
        return new THREE.MeshStandardMaterial({ color, metalness: 0.95, roughness: 0.15 });
      case 'steel':
        return new THREE.MeshStandardMaterial({ color, metalness: 0.9, roughness: 0.2 });
      default: // aluminum
        return new THREE.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.25 });
    }
  }

  dispose() {
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    this.scene.remove(this.group);
  }
}
