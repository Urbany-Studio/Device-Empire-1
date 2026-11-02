import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, createInitialState, simulateMonth, saveGame, loadGame, getSaveSlots, generateEmployee, Employee, Product } from './engine/GameEngine';
import { COUNTRIES, CPU_ARCHITECTURES, GPU_ARCHITECTURES, DISPLAY_TECHS, BATTERY_TECHS, CAMERA_TECHS, TECH_TREE, EMPLOYEE_ROLES, OFFICE_TYPES, PRODUCT_CATEGORIES, MARKET_SEGMENTS } from './data/gameData';
import { PhoneModel, PhoneConfig } from './three/PhoneModel';
import * as THREE from 'three';

// ============ SETUP WIZARD ============
function SetupWizard({ onStart }: { onStart: (config: any) => void }) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<{
    companyName: string;
    companyAbbr: string;
    slogan: string;
    founderName: string;
    foundingYear: number;
    country: string;
    currency: string;
    primaryColor: string;
    secondaryColor: string;
    mode: string;
    difficulty: number;
    startYear: number;
    capital: number;
    sandbox: Record<string, boolean>;
  }>({
    companyName: '',
    companyAbbr: '',
    slogan: '',
    founderName: '',
    foundingYear: 2020,
    country: 'br',
    currency: 'R$',
    primaryColor: '#6366f1',
    secondaryColor: '#818cf8',
    mode: 'career',
    difficulty: 50,
    startYear: 2020,
    capital: 100000,
    sandbox: {
      infiniteMoney: false,
      instantResearch: false,
      instantProduction: false,
      allTechUnlocked: false,
      happyEmployees: false,
      freeHiring: false,
    },
  });

  const steps = ['Empresa', 'País', 'Capital', 'Modo', 'Revisão'];

  const capitalOptions = [
    { name: 'Microempresa', value: 50000, desc: 'Comece pequeno, cresça devagar' },
    { name: 'Startup', value: 100000, desc: 'Recursos para inovar' },
    { name: 'Pequena Empresa', value: 500000, desc: 'Base sólida para crescer' },
    { name: 'Média Empresa', value: 2000000, desc: 'Expansão acelerada' },
    { name: 'Grande Empresa', value: 10000000, desc: 'Domínio regional' },
    { name: 'Multinacional', value: 50000000, desc: 'Poder global' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0f1117]">
      {/* Header */}
      <div className="p-4 border-b border-[#2d3040]">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          TECH EMPIRE
        </h1>
        <p className="text-center text-sm text-gray-500 mt-1">Simulador Empresarial Tecnológico</p>
      </div>

      {/* Progress */}
      <div className="flex px-4 py-3 gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex-1">
            <div className={`h-1 rounded-full ${i <= step ? 'bg-indigo-500' : 'bg-[#2d3040]'}`} />
            <span className={`text-xs mt-1 block text-center ${i <= step ? 'text-indigo-400' : 'text-gray-600'}`}>{s}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold">Identidade da Empresa</h2>
            <div>
              <label className="text-sm text-gray-400">Nome da Empresa *</label>
              <input
                className="w-full mt-1 px-3 py-2 bg-[#1a1d27] border border-[#2d3040] rounded-lg text-white focus:border-indigo-500 outline-none"
                placeholder="Ex: NovaTech"
                value={config.companyName}
                onChange={e => setConfig({ ...config, companyName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Abreviação</label>
              <input
                className="w-full mt-1 px-3 py-2 bg-[#1a1d27] border border-[#2d3040] rounded-lg text-white focus:border-indigo-500 outline-none"
                placeholder="Ex: NT"
                maxLength={5}
                value={config.companyAbbr}
                onChange={e => setConfig({ ...config, companyAbbr: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Slogan</label>
              <input
                className="w-full mt-1 px-3 py-2 bg-[#1a1d27] border border-[#2d3040] rounded-lg text-white focus:border-indigo-500 outline-none"
                placeholder="Ex: Inovando o futuro"
                value={config.slogan}
                onChange={e => setConfig({ ...config, slogan: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Nome do Fundador</label>
              <input
                className="w-full mt-1 px-3 py-2 bg-[#1a1d27] border border-[#2d3040] rounded-lg text-white focus:border-indigo-500 outline-none"
                placeholder="Seu nome"
                value={config.founderName}
                onChange={e => setConfig({ ...config, founderName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-400">Cor Principal</label>
                <input
                  type="color"
                  className="w-full mt-1 h-10 bg-[#1a1d27] border border-[#2d3040] rounded-lg cursor-pointer"
                  value={config.primaryColor}
                  onChange={e => setConfig({ ...config, primaryColor: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Cor Secundária</label>
                <input
                  type="color"
                  className="w-full mt-1 h-10 bg-[#1a1d27] border border-[#2d3040] rounded-lg cursor-pointer"
                  value={config.secondaryColor}
                  onChange={e => setConfig({ ...config, secondaryColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-lg font-semibold">Escolha o País da Sede</h2>
            <p className="text-sm text-gray-400">Cada país possui características econômicas únicas que afetam o jogo.</p>
            <div className="grid gap-2">
              {COUNTRIES.map(c => (
                <button
                  key={c.id}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    config.country === c.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-[#2d3040] bg-[#1a1d27] hover:border-gray-600'
                  }`}
                  onClick={() => setConfig({ ...config, country: c.id })}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{c.flag} {c.name}</span>
                    <span className="text-xs text-gray-500">Pop: {c.population}M</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="text-xs">
                      <span className="text-gray-500">Impostos</span>
                      <div className="h-1 bg-[#2d3040] rounded mt-0.5">
                        <div className="h-full bg-red-500 rounded" style={{ width: `${c.taxRate}%` }} />
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Infraestrutura</span>
                      <div className="h-1 bg-[#2d3040] rounded mt-0.5">
                        <div className="h-full bg-green-500 rounded" style={{ width: `${c.infrastructure}%` }} />
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Tecnologia</span>
                      <div className="h-1 bg-[#2d3040] rounded mt-0.5">
                        <div className="h-full bg-blue-500 rounded" style={{ width: `${c.techLevel}%` }} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold">Capital Inicial</h2>
            <div className="grid gap-2">
              {capitalOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    config.capital === opt.value
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-[#2d3040] bg-[#1a1d27] hover:border-gray-600'
                  }`}
                  onClick={() => setConfig({ ...config, capital: opt.value })}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{opt.name}</span>
                    <span className="text-indigo-400 font-mono">{(opt.value / 1000).toFixed(0)}K</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm text-gray-400">Ano Inicial</label>
              <input
                type="number"
                className="w-full mt-1 px-3 py-2 bg-[#1a1d27] border border-[#2d3040] rounded-lg text-white focus:border-indigo-500 outline-none"
                min={2000}
                max={2030}
                value={config.startYear}
                onChange={e => setConfig({ ...config, startYear: parseInt(e.target.value) })}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold">Modo de Jogo</h2>
            <div className="grid gap-3">
              {[
                { id: 'career', name: '🏢 Carreira', desc: 'Comece do zero e construa seu império' },
                { id: 'sandbox', name: '🎮 Sandbox', desc: 'Liberdade total, tudo desbloqueado' },
                { id: 'history', name: '📜 História', desc: 'Acompanhe a evolução tecnológica' },
                { id: 'challenge', name: '🏆 Desafio', desc: 'Objetivos específicos para superar' },
              ].map(m => (
                <button
                  key={m.id}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    config.mode === m.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-[#2d3040] bg-[#1a1d27] hover:border-gray-600'
                  }`}
                  onClick={() => setConfig({ ...config, mode: m.id })}
                >
                  <div className="font-medium">{m.name}</div>
                  <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
                </button>
              ))}
            </div>

            {config.mode === 'sandbox' && (
              <div className="mt-4 space-y-2 p-3 bg-[#1a1d27] rounded-lg border border-[#2d3040]">
                <h3 className="text-sm font-medium text-indigo-400">Configurações Sandbox</h3>
                {[
                  { key: 'infiniteMoney', label: '💰 Dinheiro Infinito' },
                  { key: 'instantResearch', label: '⚡ Pesquisa Instantânea' },
                  { key: 'instantProduction', label: '🏭 Produção Instantânea' },
                  { key: 'allTechUnlocked', label: '🔓 Todas as Tecnologias' },
                  { key: 'happyEmployees', label: '😊 Funcionários Sempre Felizes' },
                  { key: 'freeHiring', label: '🤝 Contratação Gratuita' },
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-600 text-indigo-500 focus:ring-indigo-500"
                      checked={(config.sandbox as any)[opt.key]}
                      onChange={e => setConfig({
                        ...config,
                        sandbox: { ...config.sandbox, [opt.key]: e.target.checked }
                      })}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            <div>
              <label className="text-sm text-gray-400">Dificuldade: {config.difficulty}%</label>
              <input
                type="range"
                className="w-full mt-1"
                min={10}
                max={100}
                value={config.difficulty}
                onChange={e => setConfig({ ...config, difficulty: parseInt(e.target.value) })}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold">Revisão Final</h2>
            <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Empresa</span>
                <span className="font-medium">{config.companyName || 'Sem nome'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">País</span>
                <span>{COUNTRIES.find(c => c.id === config.country)?.flag} {COUNTRIES.find(c => c.id === config.country)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Capital</span>
                <span className="text-green-400">{config.currency} {(config.capital / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Modo</span>
                <span className="capitalize">{config.mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ano</span>
                <span>{config.startYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dificuldade</span>
                <span>{config.difficulty}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-[#2d3040] flex gap-3">
        {step > 0 && (
          <button
            className="flex-1 py-3 rounded-lg border border-[#2d3040] text-gray-300 hover:bg-[#1a1d27]"
            onClick={() => setStep(step - 1)}
          >
            Voltar
          </button>
        )}
        {step < 4 ? (
          <button
            className="flex-1 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && !config.companyName}
          >
            Próximo
          </button>
        ) : (
          <button
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all glow-pulse"
            onClick={() => onStart(config)}
            disabled={!config.companyName}
          >
            🚀 Fundar Empresa
          </button>
        )}
      </div>
    </div>
  );
}

// ============ 3D VIEWER ============
function ThreeViewer({ config }: { config: PhoneConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<PhoneModel | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a0f');

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.01, 100);
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight('#ffffff', 1.0);
    mainLight.position.set(2, 3, 4);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight('#6366f1', 0.3);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#a855f7', 0.4);
    rimLight.position.set(0, -2, -3);
    scene.add(rimLight);

    // Environment
    const envGeo = new THREE.SphereGeometry(20, 32, 32);
    const envMat = new THREE.MeshBasicMaterial({ color: '#0a0a12', side: THREE.BackSide });
    scene.add(new THREE.Mesh(envGeo, envMat));

    // Model
    const model = new PhoneModel(scene);
    modelRef.current = model;

    // Mouse/touch rotation
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let rotX = 0, rotY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      rotY += dx * 0.01;
      rotX += dy * 0.01;
      rotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotX));
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerUp = () => { isDragging = false; };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Animation
    let animId: number;
    let autoRotate = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) autoRotate += 0.003;
      model.group.rotation.x = rotX;
      model.group.rotation.y = rotY + autoRotate;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      model.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.update(config);
    }
  }, [config]);

  return <div ref={containerRef} className="w-full h-full" />;
}

// ============ PRODUCT EDITOR ============
function ProductEditor({ state, setState }: { state: GameState; setState: (s: GameState) => void }) {
  const [activeTab, setActiveTab] = useState('design');
  const [phoneConfig, setPhoneConfig] = useState<PhoneConfig>({
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
  });

  const [productName, setProductName] = useState('');
  const [productSegment, setProductSegment] = useState('mid');
  const [productPrice, setProductPrice] = useState(999);
  const [selectedCPU, setSelectedCPU] = useState(CPU_ARCHITECTURES[0].id);
  const [selectedGPU, setSelectedGPU] = useState('');
  const [selectedDisplay, setSelectedDisplay] = useState(DISPLAY_TECHS[0].id);
  const [selectedBattery, setSelectedBattery] = useState(BATTERY_TECHS[0].id);
  const [selectedCamera, setSelectedCamera] = useState(CAMERA_TECHS[0].id);
  const [ram, setRam] = useState(4);
  const [storage, setStorage] = useState(64);

  const cpu = CPU_ARCHITECTURES.find(c => c.id === selectedCPU)!;
  const display = DISPLAY_TECHS.find(d => d.id === selectedDisplay)!;
  const battery = BATTERY_TECHS.find(b => b.id === selectedBattery)!;
  const camera = CAMERA_TECHS.find(c => c.id === selectedCamera)!;

  const estimatedCost = Math.round(
    (cpu.cost + display.cost + battery.cost + camera.cost + ram * 3 + storage * 0.1) * 1.3
  );

  const estimatedQuality = Math.min(100, Math.round(
    (cpu.score / 7) + (display.maxRefresh / 2.4) + (battery.maxCapacity / 70) + (camera.resolution / 2) + (ram * 2)
  ));

  const handleLaunch = () => {
    const product: Product = {
      id: `prod_${Date.now()}`,
      name: productName || `${state.companyName} Phone 1`,
      category: 'smartphone',
      segment: productSegment,
      price: productPrice,
      cost: estimatedCost,
      quality: estimatedQuality,
      design: Math.round((phoneConfig.cornerRadius + phoneConfig.thickness * 2) * 2),
      specs: {
        cpu: selectedCPU,
        display: selectedDisplay,
        battery: selectedBattery,
        camera: selectedCamera,
        ram,
        storage,
        overall: estimatedQuality,
      },
      releaseDate: state.totalMonths,
      sales: 0,
      satisfaction: 50,
      stock: 100,
      status: 'development',
      developmentProgress: 0,
      developmentTime: 3,
    };

    setState({ ...state, products: [...state.products, product] });
  };

  const tabs = [
    { id: 'design', name: '🎨 Design', },
    { id: 'hardware', name: '⚙️ Hardware' },
    { id: 'specs', name: '📊 Specs' },
    { id: 'launch', name: '🚀 Lançar' },
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* 3D View */}
      <div className="lg:w-1/2 h-64 lg:h-full border-b lg:border-b-0 lg:border-r border-[#2d3040]">
        <ThreeViewer config={phoneConfig} />
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[#2d3040] overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                activeTab === t.id ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'design' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Largura: {phoneConfig.width}mm</label>
                  <input type="range" className="w-full" min={60} max={85} value={phoneConfig.width}
                    onChange={e => setPhoneConfig({ ...phoneConfig, width: +e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Altura: {phoneConfig.height}mm</label>
                  <input type="range" className="w-full" min={130} max={175} value={phoneConfig.height}
                    onChange={e => setPhoneConfig({ ...phoneConfig, height: +e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Espessura: {phoneConfig.thickness}mm</label>
                  <input type="range" className="w-full" min={6} max={12} value={phoneConfig.thickness}
                    onChange={e => setPhoneConfig({ ...phoneConfig, thickness: +e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Curvatura: {phoneConfig.cornerRadius}mm</label>
                  <input type="range" className="w-full" min={4} max={20} value={phoneConfig.cornerRadius}
                    onChange={e => setPhoneConfig({ ...phoneConfig, cornerRadius: +e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Material do Corpo</label>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {(['glass', 'metal', 'plastic', 'ceramic'] as const).map(m => (
                    <button key={m} className={`px-2 py-1.5 text-xs rounded border ${
                      phoneConfig.bodyMaterial === m ? 'border-indigo-500 bg-indigo-500/10' : 'border-[#2d3040]'
                    }`} onClick={() => setPhoneConfig({ ...phoneConfig, bodyMaterial: m })}>
                      {m === 'glass' ? '🔮 Vidro' : m === 'metal' ? '🪙 Metal' : m === 'plastic' ? '🧱 Plástico' : '🏺 Cerâmica'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Cor do Corpo</label>
                  <input type="color" className="w-full h-8 mt-1 rounded cursor-pointer"
                    value={phoneConfig.bodyColor}
                    onChange={e => setPhoneConfig({ ...phoneConfig, bodyColor: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Cor da Moldura</label>
                  <input type="color" className="w-full h-8 mt-1 rounded cursor-pointer"
                    value={phoneConfig.frameColor}
                    onChange={e => setPhoneConfig({ ...phoneConfig, frameColor: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Material da Moldura</label>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {(['aluminum', 'steel', 'titanium'] as const).map(m => (
                    <button key={m} className={`px-2 py-1.5 text-xs rounded border ${
                      phoneConfig.frameMaterial === m ? 'border-indigo-500 bg-indigo-500/10' : 'border-[#2d3040]'
                    }`} onClick={() => setPhoneConfig({ ...phoneConfig, frameMaterial: m })}>
                      {m === 'aluminum' ? 'Alumínio' : m === 'steel' ? 'Aço' : 'Titânio'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Câmeras: {phoneConfig.cameraCount}</label>
                <input type="range" className="w-full" min={1} max={4} value={phoneConfig.cameraCount}
                  onChange={e => setPhoneConfig({ ...phoneConfig, cameraCount: +e.target.value })} />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={phoneConfig.hasPunchHole}
                  onChange={e => setPhoneConfig({ ...phoneConfig, hasPunchHole: e.target.checked })} />
                <span className="text-sm">Câmera frontal (punch hole)</span>
              </label>
            </>
          )}

          {activeTab === 'hardware' && (
            <>
              <div>
                <label className="text-xs text-gray-400">Processador</label>
                <select className="w-full mt-1 px-3 py-2 bg-[#1a1d27] border border-[#2d3040] rounded-lg text-white"
                  value={selectedCPU} onChange={e => setSelectedCPU(e.target.value)}>
                  {CPU_ARCHITECTURES.filter(c => c.yearAvailable <= state.currentYear).map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.cores}C/{c.threads}T, {c.baseFreq}MHz) - Score: {c.score}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400">Tela</label>
                <select className="w-full mt-1 px-3 py-2 bg-[#1a1d27] border border-[#2d3040] rounded-lg text-white"
                  value={selectedDisplay} onChange={e => setSelectedDisplay(e.target.value)}>
                  {DISPLAY_TECHS.filter(d => d.yearAvailable <= state.currentYear).map(d => (
                    <option key={d.id} value={d.id}>{d.name} - {d.maxRefresh}Hz, {d.brightness}nits</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400">Bateria</label>
                <select className="w-full mt-1 px-3 py-2 bg-[#1a1d27] border border-[#2d3040] rounded-lg text-white"
                  value={selectedBattery} onChange={e => setSelectedBattery(e.target.value)}>
                  {BATTERY_TECHS.filter(b => b.yearAvailable <= state.currentYear).map(b => (
                    <option key={b.id} value={b.id}>{b.name} - {b.maxCapacity}mAh, {b.chargeSpeed}W</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400">Câmera</label>
                <select className="w-full mt-1 px-3 py-2 bg-[#1a1d27] border border-[#2d3040] rounded-lg text-white"
                  value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)}>
                  {CAMERA_TECHS.filter(c => c.yearAvailable <= state.currentYear).map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.resolution}MP, f/{c.aperture}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">RAM: {ram}GB</label>
                  <input type="range" className="w-full" min={2} max={24} step={2} value={ram}
                    onChange={e => setRam(+e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Armazenamento: {storage}GB</label>
                  <input type="range" className="w-full" min={32} max={1024} step={32} value={storage}
                    onChange={e => setStorage(+e.target.value)} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-3">
              <h3 className="font-medium text-indigo-400">Especificações Estimadas</h3>
              <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">CPU</span>
                  <span>{cpu.name} ({cpu.cores}C/{cpu.threads}T)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Frequência</span>
                  <span>{cpu.baseFreq}-{cpu.turboFreq} MHz</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tela</span>
                  <span>{display.name} {display.maxRefresh}Hz</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Brilho</span>
                  <span>{display.brightness} nits</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bateria</span>
                  <span>{battery.maxCapacity}mAh ({battery.chargeSpeed}W)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Câmera</span>
                  <span>{camera.resolution}MP f/{camera.aperture}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">RAM / Storage</span>
                  <span>{ram}GB / {storage}GB</span>
                </div>
                <hr className="border-[#2d3040]" />
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">Custo Estimado</span>
                  <span className="text-yellow-400">{state.currency}{estimatedCost}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">Qualidade Estimada</span>
                  <span className={estimatedQuality >= 70 ? 'text-green-400' : estimatedQuality >= 40 ? 'text-yellow-400' : 'text-red-400'}>
                    {estimatedQuality}/100
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">Score CPU</span>
                  <span className="text-blue-400">{cpu.score}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'launch' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Nome do Produto</label>
                <input className="w-full mt-1 px-3 py-2 bg-[#1a1d27] border border-[#2d3040] rounded-lg text-white"
                  placeholder={`${state.companyName} Phone 1`}
                  value={productName} onChange={e => setProductName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400">Segmento</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {MARKET_SEGMENTS.map(s => (
                    <button key={s.id} className={`px-3 py-2 text-sm rounded border ${
                      productSegment === s.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-[#2d3040]'
                    }`} onClick={() => setProductSegment(s.id)}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400">Preço: {state.currency}{productPrice}</label>
                <input type="range" className="w-full" min={99} max={4999} step={50} value={productPrice}
                  onChange={e => setProductPrice(+e.target.value)} />
              </div>
              <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Custo de Produção</span>
                  <span>{state.currency}{estimatedCost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Margem</span>
                  <span className={productPrice > estimatedCost ? 'text-green-400' : 'text-red-400'}>
                    {state.currency}{productPrice - estimatedCost} ({Math.round((1 - estimatedCost / productPrice) * 100)}%)
                  </span>
                </div>
              </div>
              <button
                className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium"
                onClick={handleLaunch}
              >
                🚀 Iniciar Desenvolvimento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ MAIN GAME UI ============
function GameUI({ state, setState }: { state: GameState; setState: (s: GameState) => void }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [showSidebar, setShowSidebar] = useState(false);
  const [timerRef, setTimerRef] = useState<any>(null);

  // Game loop
  useEffect(() => {
    if (!state.isPaused) {
      const interval = setInterval(() => {
        setState(simulateMonth(state));
      }, 2000 / state.timeSpeed);
      setTimerRef(interval);
      return () => clearInterval(interval);
    }
  }, [state.isPaused, state.timeSpeed]);

  const formatMoney = (v: number) => {
    if (v >= 1000000) return `${state.currency}${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${state.currency}${(v / 1000).toFixed(0)}K`;
    return `${state.currency}${v.toFixed(0)}`;
  };

  const menuItems = [
    { id: 'overview', name: 'Visão Geral', icon: '📊' },
    { id: 'products', name: 'Produtos', icon: '📱' },
    { id: 'editor', name: 'Editor', icon: '🎨' },
    { id: 'research', name: 'Pesquisa', icon: '🔬' },
    { id: 'employees', name: 'Funcionários', icon: '👥' },
    { id: 'finance', name: 'Finanças', icon: '💰' },
    { id: 'market', name: 'Mercado', icon: '📈' },
    { id: 'rivals', name: 'Concorrentes', icon: '🏢' },
    { id: 'news', name: 'Notícias', icon: '📰' },
    { id: 'settings', name: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="h-12 border-b border-[#2d3040] flex items-center px-3 gap-2 bg-[#0f1117] shrink-0">
        <button className="lg:hidden p-2" onClick={() => setShowSidebar(!showSidebar)}>☰</button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ background: state.primaryColor }} />
          <span className="font-bold text-sm hidden sm:block">{state.companyName}</span>
        </div>
        <div className="flex-1" />
        
        {/* Time controls */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 hidden sm:block">
            {`${state.currentMonth.toString().padStart(2, '0')}/${state.currentYear}`}
          </span>
          <button
            className={`p-1.5 rounded ${state.isPaused ? 'bg-green-600' : 'bg-yellow-600'}`}
            onClick={() => setState({ ...state, isPaused: !state.isPaused })}
          >
            {state.isPaused ? '▶' : '⏸'}
          </button>
          <button
            className="p-1.5 rounded bg-[#1a1d27] border border-[#2d3040]"
            onClick={() => setState({ ...state, timeSpeed: state.timeSpeed === 1 ? 2 : state.timeSpeed === 2 ? 4 : 1 })}
          >
            {state.timeSpeed}x
          </button>
        </div>

        {/* Money */}
        <div className="text-sm font-mono text-green-400 hidden sm:block">
          {formatMoney(state.capital)}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-12 left-0 z-40 w-48 bg-[#0f1117] border-r border-[#2d3040] transition-transform overflow-y-auto`}>
          <nav className="p-2 space-y-0.5">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  activeSection === item.id
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-gray-400 hover:bg-[#1a1d27] hover:text-gray-200'
                }`}
                onClick={() => { setActiveSection(item.id); setShowSidebar(false); }}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {activeSection === 'overview' && <OverviewSection state={state} formatMoney={formatMoney} />}
          {activeSection === 'products' && <ProductsSection state={state} formatMoney={formatMoney} />}
          {activeSection === 'editor' && <ProductEditor state={state} setState={setState} />}
          {activeSection === 'research' && <ResearchSection state={state} setState={setState} />}
          {activeSection === 'employees' && <EmployeesSection state={state} setState={setState} />}
          {activeSection === 'finance' && <FinanceSection state={state} formatMoney={formatMoney} />}
          {activeSection === 'market' && <MarketSection state={state} />}
          {activeSection === 'rivals' && <RivalsSection state={state} />}
          {activeSection === 'news' && <NewsSection state={state} />}
          {activeSection === 'settings' && <SettingsSection state={state} setState={setState} />}
        </div>
      </div>
    </div>
  );
}

// ============ SECTIONS ============
function OverviewSection({ state, formatMoney }: { state: GameState; formatMoney: (v: number) => string }) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Visão Geral</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Capital" value={formatMoney(state.capital)} color="green" />
        <StatCard label="Receita/mês" value={formatMoney(state.revenue)} color="blue" />
        <StatCard label="Despesas/mês" value={formatMoney(state.expenses)} color="red" />
        <StatCard label="Lucro/mês" value={formatMoney(state.profit)} color={state.profit >= 0 ? 'green' : 'red'} />
        <StatCard label="Fama" value={`${Math.round(state.fame)}/100`} color="purple" />
        <StatCard label="Reputação" value={`${Math.round(state.reputation)}/100`} color="indigo" />
        <StatCard label="Satisfação" value={`${Math.round(state.satisfaction)}/100`} color="yellow" />
        <StatCard label="Seguidores" value={state.followers.toLocaleString()} color="pink" />
      </div>

      {/* Company Info */}
      <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4">
        <h3 className="font-medium mb-2">📋 Informações da Empresa</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-400">Fundador:</span> {state.founderName}</div>
          <div><span className="text-gray-400">Fundação:</span> {state.foundingYear}</div>
          <div><span className="text-gray-400">País:</span> {COUNTRIES.find(c => c.id === state.country)?.flag} {COUNTRIES.find(c => c.id === state.country)?.name}</div>
          <div><span className="text-gray-400">Escritório:</span> {OFFICE_TYPES.find(o => o.id === state.officeType)?.name}</div>
          <div><span className="text-gray-400">Funcionários:</span> {state.employees.length}</div>
          <div><span className="text-gray-400">Produtos:</span> {state.products.length}</div>
        </div>
      </div>

      {/* Active Events */}
      {state.activeEvents.length > 0 && (
        <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4">
          <h3 className="font-medium mb-2">⚡ Eventos Ativos</h3>
          {state.activeEvents.map((e, i) => (
            <div key={i} className={`text-sm p-2 rounded mb-1 ${
              e.event.type === 'positive' ? 'bg-green-500/10 text-green-400' :
              e.event.type === 'negative' ? 'bg-red-500/10 text-red-400' :
              'bg-blue-500/10 text-blue-400'
            }`}>
              {e.event.name} ({e.remainingMonths} meses restantes)
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-4 rounded-lg bg-[#1a1d27] border border-[#2d3040] hover:border-indigo-500 transition-colors text-left"
          onClick={() => {}}>
          <div className="text-2xl mb-1">📱</div>
          <div className="font-medium text-sm">Novo Produto</div>
          <div className="text-xs text-gray-500">Criar smartphone</div>
        </button>
        <button className="p-4 rounded-lg bg-[#1a1d27] border border-[#2d3040] hover:border-indigo-500 transition-colors text-left"
          onClick={() => {}}>
          <div className="text-2xl mb-1">🔬</div>
          <div className="font-medium text-sm">Pesquisar</div>
          <div className="text-xs text-gray-500">{state.researchPoints} pts disponíveis</div>
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'text-green-400', blue: 'text-blue-400', red: 'text-red-400',
    purple: 'text-purple-400', indigo: 'text-indigo-400', yellow: 'text-yellow-400',
    pink: 'text-pink-400',
  };
  return (
    <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-bold font-mono ${colorMap[color] || 'text-white'}`}>{value}</div>
    </div>
  );
}

function ProductsSection({ state, formatMoney }: { state: GameState; formatMoney: (v: number) => string }) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Produtos</h2>
      {state.products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📱</div>
          <p>Nenhum produto criado ainda.</p>
          <p className="text-sm">Vá ao Editor para criar seu primeiro produto!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {state.products.map(p => (
            <div key={p.id} className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="text-xs text-gray-500">{PRODUCT_CATEGORIES.find(c => c.id === p.category)?.name} • {MARKET_SEGMENTS.find(s => s.id === p.segment)?.name}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  p.status === 'development' ? 'bg-yellow-500/20 text-yellow-400' :
                  p.status === 'selling' ? 'bg-green-500/20 text-green-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {p.status === 'development' ? 'Desenvolvendo' : p.status === 'selling' ? 'Vendendo' : p.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                <div><span className="text-gray-500">Preço:</span> {formatMoney(p.price)}</div>
                <div><span className="text-gray-500">Qualidade:</span> {p.quality}/100</div>
                <div><span className="text-gray-500">Vendas:</span> {p.sales}</div>
              </div>
              {p.status === 'development' && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Progresso</span>
                    <span>{Math.round(p.developmentProgress)}%</span>
                  </div>
                  <div className="h-2 bg-[#2d3040] rounded mt-1">
                    <div className="h-full bg-indigo-500 rounded transition-all" style={{ width: `${p.developmentProgress}%` }} />
                  </div>
                </div>
              )}
              {p.status === 'selling' && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Estoque</span>
                    <span>{p.stock} unidades</span>
                  </div>
                  <div className="h-2 bg-[#2d3040] rounded mt-1">
                    <div className="h-full bg-green-500 rounded" style={{ width: `${Math.min(100, p.stock / 10)}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResearchSection({ state, setState }: { state: GameState; setState: (s: GameState) => void }) {
  const categories = [...new Set(TECH_TREE.map(t => t.category))];
  
  const startResearch = (techId: string) => {
    const tech = TECH_TREE.find(t => t.id === techId);
    if (!tech) return;
    if (state.capital < tech.cost && !state.sandbox.infiniteMoney) return;
    
    setState({
      ...state,
      capital: state.sandbox.infiniteMoney ? state.capital : state.capital - tech.cost,
      currentResearch: techId,
      researchProgress: 0,
    });
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Pesquisa & Desenvolvimento</h2>
        <span className="text-sm text-indigo-400 font-mono">{state.researchPoints} pts</span>
      </div>

      {state.currentResearch && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-indigo-400">Pesquisando: {TECH_TREE.find(t => t.id === state.currentResearch)?.name}</span>
            <span>{Math.round(state.researchProgress)}%</span>
          </div>
          <div className="h-2 bg-[#2d3040] rounded mt-2">
            <div className="h-full bg-indigo-500 rounded transition-all" style={{ width: `${state.researchProgress}%` }} />
          </div>
        </div>
      )}

      {categories.map(cat => (
        <div key={cat}>
          <h3 className="text-sm font-medium text-gray-400 mb-2">{cat}</h3>
          <div className="grid gap-2">
            {TECH_TREE.filter(t => t.category === cat).map(tech => {
              const unlocked = state.unlockedTech.includes(tech.id);
              const available = tech.prerequisites.every(p => state.unlockedTech.includes(p));
              const isResearching = state.currentResearch === tech.id;
              
              return (
                <div key={tech.id} className={`p-3 rounded-lg border ${
                  unlocked ? 'border-green-500/30 bg-green-500/5' :
                  isResearching ? 'border-indigo-500/30 bg-indigo-500/5' :
                  available ? 'border-[#2d3040] bg-[#1a1d27]' :
                  'border-[#2d3040] bg-[#0f1117] opacity-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-sm">{tech.name}</span>
                      <p className="text-xs text-gray-500">{tech.description}</p>
                    </div>
                    {unlocked ? (
                      <span className="text-green-400 text-xs">✓ Desbloqueado</span>
                    ) : isResearching ? (
                      <span className="text-indigo-400 text-xs">Pesquisando...</span>
                    ) : available ? (
                      <button
                        className="px-3 py-1 text-xs rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => startResearch(tech.id)}
                        disabled={!!state.currentResearch}
                      >
                        {formatMoneySimple(tech.cost)}
                      </button>
                    ) : (
                      <span className="text-gray-600 text-xs">🔒 Bloqueado</span>
                    )}
                  </div>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    <span>Nível {tech.level}</span>
                    <span>{tech.time} meses</span>
                    {tech.yearAvailable && <span>Desde {tech.yearAvailable}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatMoneySimple(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return `${v}`;
}

function EmployeesSection({ state, setState }: { state: GameState; setState: (s: GameState) => void }) {
  const office = OFFICE_TYPES.find(o => o.id === state.officeType)!;
  
  const hireEmployee = (roleId: string) => {
    if (state.employees.length >= office.capacity) return;
    const country = COUNTRIES.find(c => c.id === state.country)!;
    const cost = state.sandbox.freeHiring ? 0 : 2000;
    if (state.capital < cost && !state.sandbox.infiniteMoney) return;
    
    const emp = generateEmployee(roleId, country as any);
    setState({
      ...state,
      employees: [...state.employees, emp],
      capital: state.sandbox.infiniteMoney ? state.capital : state.capital - cost,
    });
  };

  const fireEmployee = (id: string) => {
    setState({ ...state, employees: state.employees.filter(e => e.id !== id) });
  };

  const upgradeOffice = () => {
    const currentIdx = OFFICE_TYPES.findIndex(o => o.id === state.officeType);
    if (currentIdx >= OFFICE_TYPES.length - 1) return;
    const next = OFFICE_TYPES[currentIdx + 1];
    if (state.capital < next.cost && !state.sandbox.infiniteMoney) return;
    setState({
      ...state,
      officeType: next.id,
      capital: state.sandbox.infiniteMoney ? state.capital : state.capital - next.cost,
    });
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Funcionários & Escritório</h2>
      
      {/* Office */}
      <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{office.name}</h3>
            <p className="text-xs text-gray-500">{state.employees.length}/{office.capacity} vagas • Manutenção: {office.maintenance}/mês</p>
          </div>
          {state.officeType !== 'hq' && (
            <button className="px-3 py-1.5 text-xs rounded bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={upgradeOffice}>
              Upgrade → {OFFICE_TYPES[OFFICE_TYPES.findIndex(o => o.id === state.officeType) + 1]?.name}
            </button>
          )}
        </div>
      </div>

      {/* Hire */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Contratar</h3>
        <div className="grid grid-cols-3 gap-2">
          {EMPLOYEE_ROLES.map(role => (
            <button key={role.id}
              className="p-2 rounded-lg border border-[#2d3040] bg-[#1a1d27] hover:border-indigo-500 transition-colors text-center"
              onClick={() => hireEmployee(role.id)}
              disabled={state.employees.length >= office.capacity}
            >
              <div className="text-lg">{role.icon}</div>
              <div className="text-xs mt-1">{role.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Employee List */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Equipe ({state.employees.length})</h3>
        <div className="space-y-2">
          {state.employees.map(emp => {
            const role = EMPLOYEE_ROLES.find(r => r.id === emp.role);
            return (
              <div key={emp.id} className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{role?.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{emp.name}</div>
                      <div className="text-xs text-gray-500">{role?.name} • {emp.salary}/mês</div>
                    </div>
                  </div>
                  <button className="text-xs text-red-400 hover:text-red-300" onClick={() => fireEmployee(emp.id)}>
                    Demitir
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-xs">
                    <span className="text-gray-500">Inteligência</span>
                    <div className="h-1 bg-[#2d3040] rounded mt-0.5">
                      <div className="h-full bg-blue-500 rounded" style={{ width: `${emp.intelligence}%` }} />
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-500">Motivação</span>
                    <div className="h-1 bg-[#2d3040] rounded mt-0.5">
                      <div className="h-full bg-green-500 rounded" style={{ width: `${emp.motivation}%` }} />
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-500">Cansaço</span>
                    <div className="h-1 bg-[#2d3040] rounded mt-0.5">
                      <div className="h-full bg-red-500 rounded" style={{ width: `${emp.fatigue}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FinanceSection({ state, formatMoney }: { state: GameState; formatMoney: (v: number) => string }) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Finanças</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Capital Total" value={formatMoney(state.capital)} color="green" />
        <StatCard label="Valor de Mercado" value={formatMoney(state.marketValue)} color="purple" />
        <StatCard label="Receita Mensal" value={formatMoney(state.revenue)} color="blue" />
        <StatCard label="Despesas Mensais" value={formatMoney(state.expenses)} color="red" />
      </div>

      <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4">
        <h3 className="font-medium mb-3">📊 Demonstrativo Financeiro</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Receita de Vendas</span>
            <span className="text-green-400">+{formatMoney(state.revenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Salários</span>
            <span className="text-red-400">-{formatMoney(state.employees.reduce((s, e) => s + e.salary, 0))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Manutenção</span>
            <span className="text-red-400">-{formatMoney(OFFICE_TYPES.find(o => o.id === state.officeType)?.maintenance || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Impostos ({COUNTRIES.find(c => c.id === state.country)?.taxRate}%)</span>
            <span className="text-red-400">-{formatMoney(Math.max(0, (state.revenue - state.expenses) * (COUNTRIES.find(c => c.id === state.country)?.taxRate || 0) / 100))}</span>
          </div>
          <hr className="border-[#2d3040]" />
          <div className="flex justify-between font-medium">
            <span>Lucro Líquido</span>
            <span className={state.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
              {state.profit >= 0 ? '+' : ''}{formatMoney(state.profit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketSection({ state }: { state: GameState }) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Mercado</h2>
      
      <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4">
        <h3 className="font-medium mb-3">Participação de Mercado</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>{state.companyName}</span>
              <span className="text-indigo-400">{(state.marketShare['smartphone'] || 0).toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-[#2d3040] rounded">
              <div className="h-full bg-indigo-500 rounded" style={{ width: `${state.marketShare['smartphone'] || 0}%` }} />
            </div>
          </div>
          {state.rivals.map(r => (
            <div key={r.id}>
              <div className="flex justify-between text-sm mb-1">
                <span>{r.name}</span>
                <span className="text-gray-400">{r.marketShare.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-[#2d3040] rounded">
                <div className="h-full bg-gray-600 rounded" style={{ width: `${r.marketShare}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4">
        <h3 className="font-medium mb-3">📈 Indicadores</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Fama</span>
            <div className="h-2 bg-[#2d3040] rounded mt-1">
              <div className="h-full bg-purple-500 rounded" style={{ width: `${state.fame}%` }} />
            </div>
          </div>
          <div>
            <span className="text-gray-400">Reputação</span>
            <div className="h-2 bg-[#2d3040] rounded mt-1">
              <div className="h-full bg-indigo-500 rounded" style={{ width: `${state.reputation}%` }} />
            </div>
          </div>
          <div>
            <span className="text-gray-400">Satisfação</span>
            <div className="h-2 bg-[#2d3040] rounded mt-1">
              <div className="h-full bg-yellow-500 rounded" style={{ width: `${state.satisfaction}%` }} />
            </div>
          </div>
          <div>
            <span className="text-gray-400">Seguidores</span>
            <div className="font-mono text-pink-400 mt-1">{state.followers.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RivalsSection({ state }: { state: GameState }) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Concorrentes</h2>
      <div className="grid gap-3">
        {state.rivals.map(r => (
          <div key={r.id} className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{r.name}</h3>
                <p className="text-xs text-gray-500">{COUNTRIES.find(c => c.id === r.country)?.flag} {COUNTRIES.find(c => c.id === r.country)?.name}</p>
              </div>
              <span className="text-sm text-indigo-400">{r.marketShare.toFixed(1)}% mercado</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              <div className="text-xs text-center">
                <div className="text-gray-500">Reputação</div>
                <div className="font-mono">{Math.round(r.reputation)}</div>
              </div>
              <div className="text-xs text-center">
                <div className="text-gray-500">Tecnologia</div>
                <div className="font-mono">{Math.round(r.techLevel)}</div>
              </div>
              <div className="text-xs text-center">
                <div className="text-gray-500">Agressividade</div>
                <div className="font-mono">{Math.round(r.aggression)}</div>
              </div>
              <div className="text-xs text-center">
                <div className="text-gray-500">Inovação</div>
                <div className="font-mono">{Math.round(r.innovation)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsSection({ state }: { state: GameState }) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Notícias & Eventos</h2>
      <div className="space-y-2">
        {[...state.eventLog].reverse().slice(0, 20).map((entry, i) => (
          <div key={i} className={`p-3 rounded-lg border text-sm ${
            entry.type === 'success' ? 'border-green-500/30 bg-green-500/5 text-green-400' :
            entry.type === 'danger' ? 'border-red-500/30 bg-red-500/5 text-red-400' :
            'border-[#2d3040] bg-[#1a1d27] text-gray-300'
          }`}>
            <span className="text-xs text-gray-500 mr-2">
              Mês {entry.month}
            </span>
            {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsSection({ state, setState }: { state: GameState; setState: (s: GameState) => void }) {
  const handleSave = () => {
    saveGame(state, '0');
    alert('Jogo salvo com sucesso!');
  };

  const handleLoad = () => {
    const loaded = loadGame('0');
    if (loaded) {
      setState(loaded);
      alert('Jogo carregado!');
    } else {
      alert('Nenhum salvamento encontrado.');
    }
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Configurações</h2>
      
      <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4 space-y-3">
        <h3 className="font-medium">💾 Salvamento</h3>
        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
            onClick={handleSave}>Salvar Jogo</button>
          <button className="flex-1 py-2 rounded bg-[#252836] hover:bg-[#2d3040] text-sm"
            onClick={handleLoad}>Carregar Jogo</button>
        </div>
      </div>

      {state.mode === 'sandbox' && (
        <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4 space-y-3">
          <h3 className="font-medium">🎮 Sandbox</h3>
          {[
            { key: 'infiniteMoney', label: '💰 Dinheiro Infinito' },
            { key: 'instantResearch', label: '⚡ Pesquisa Instantânea' },
            { key: 'instantProduction', label: '🏭 Produção Instantânea' },
            { key: 'happyEmployees', label: '😊 Funcionários Felizes' },
          ].map(opt => (
            <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox"
                checked={(state.sandbox as any)[opt.key]}
                onChange={e => setState({
                  ...state,
                  sandbox: { ...state.sandbox, [opt.key]: e.target.checked }
                })}
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      <div className="bg-[#1a1d27] rounded-lg border border-[#2d3040] p-4">
        <h3 className="font-medium mb-2">ℹ️ Sobre</h3>
        <p className="text-sm text-gray-400">Tech Empire v1.0</p>
        <p className="text-xs text-gray-500 mt-1">Simulador empresarial tecnológico com modelagem 3D em Three.js</p>
      </div>
    </div>
  );
}

// ============ SAVE SLOTS SCREEN ============
function SaveSlotsScreen({ onLoad, onNew }: { onLoad: (state: GameState) => void; onNew: () => void }) {
  const slots = getSaveSlots();
  
  return (
    <div className="h-full flex flex-col bg-[#0f1117] items-center justify-center p-4">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
        TECH EMPIRE
      </h1>
      <p className="text-gray-500 mb-8">Simulador Empresarial Tecnológico</p>
      
      <div className="w-full max-w-md space-y-3">
        <button
          className="w-full py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-lg transition-all glow-pulse"
          onClick={onNew}
        >
          🚀 Nova Empresa
        </button>

        {slots.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="text-sm text-gray-400">Partidas Salvas</h3>
            {slots.map(s => (
              <button
                key={s.slot}
                className="w-full p-3 rounded-lg border border-[#2d3040] bg-[#1a1d27] hover:border-indigo-500 transition-colors text-left"
                onClick={() => {
                  const loaded = loadGame(s.slot);
                  if (loaded) onLoad(loaded);
                }}
              >
                <div className="font-medium">{s.companyName}</div>
                <div className="text-xs text-gray-500">Ano {s.year} • {s.date}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [screen, setScreen] = useState<'menu' | 'setup' | 'game'>('menu');
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleNewGame = () => setScreen('setup');
  
  const handleStartGame = (config: any) => {
    const state = createInitialState(config);
    setGameState(state);
    setScreen('game');
  };

  const handleLoadGame = (state: GameState) => {
    setGameState(state);
    setScreen('game');
  };

  if (screen === 'menu') {
    return <SaveSlotsScreen onLoad={handleLoadGame} onNew={handleNewGame} />;
  }

  if (screen === 'setup') {
    return <SetupWizard onStart={handleStartGame} />;
  }

  if (screen === 'game' && gameState) {
    return <GameUI state={gameState} setState={setGameState} />;
  }

  return null;
}
