// Tech Empire - Game Data

export interface Country {
  id: string;
  name: string;
  flag: string;
  taxRate: number;
  laborCost: number;
  avgSalary: number;
  productionCost: number;
  infrastructure: number;
  purchasingPower: number;
  population: number;
  marketAccess: number;
  logisticsCost: number;
  techLevel: number;
  professionalAvailability: number;
  economicStability: number;
  incentives: number;
  importTariff: number;
  exportTariff: number;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  level: number;
  cost: number;
  time: number;
  prerequisites: string[];
  unlocks: string[];
  description: string;
  yearAvailable: number;
}

export interface CPUArch {
  id: string;
  name: string;
  lithography: number;
  cores: number;
  threads: number;
  baseFreq: number;
  turboFreq: number;
  cacheL2: number;
  cacheL3: number;
  tdp: number;
  score: number;
  yearAvailable: number;
  cost: number;
}

export interface GPUArch {
  id: string;
  name: string;
  architecture: string;
  cores: number;
  freq: number;
  vram: number;
  bandwidth: number;
  rayTracing: boolean;
  tdp: number;
  score: number;
  yearAvailable: number;
  cost: number;
}

export interface DisplayTech {
  id: string;
  name: string;
  type: string;
  maxRes: string;
  maxRefresh: number;
  brightness: number;
  contrast: number;
  yearAvailable: number;
  cost: number;
}

export interface BatteryTech {
  id: string;
  name: string;
  maxCapacity: number;
  chargeSpeed: number;
  wireless: boolean;
  cycles: number;
  yearAvailable: number;
  cost: number;
}

export interface CameraTech {
  id: string;
  name: string;
  resolution: number;
  aperture: number;
  stabilization: boolean;
  sensorSize: string;
  yearAvailable: number;
  cost: number;
}

export const COUNTRIES: Country[] = [
  { id: 'br', name: 'Brasil', flag: '🇧🇷', taxRate: 34, laborCost: 45, avgSalary: 40, productionCost: 50, infrastructure: 55, purchasingPower: 50, population: 215, marketAccess: 60, logisticsCost: 55, techLevel: 55, professionalAvailability: 60, economicStability: 45, incentives: 50, importTariff: 60, exportTariff: 30 },
  { id: 'us', name: 'Estados Unidos', flag: '🇺🇸', taxRate: 21, laborCost: 85, avgSalary: 80, productionCost: 80, infrastructure: 90, purchasingPower: 95, population: 330, marketAccess: 95, logisticsCost: 30, techLevel: 95, professionalAvailability: 90, economicStability: 85, incentives: 60, importTariff: 25, exportTariff: 15 },
  { id: 'cn', name: 'China', flag: '🇨🇳', taxRate: 25, laborCost: 35, avgSalary: 30, productionCost: 25, infrastructure: 80, purchasingPower: 60, population: 1400, marketAccess: 80, logisticsCost: 25, techLevel: 80, professionalAvailability: 85, economicStability: 70, incentives: 80, importTariff: 40, exportTariff: 10 },
  { id: 'jp', name: 'Japão', flag: '🇯🇵', taxRate: 30, laborCost: 75, avgSalary: 70, productionCost: 70, infrastructure: 95, purchasingPower: 80, population: 125, marketAccess: 75, logisticsCost: 30, techLevel: 90, professionalAvailability: 85, economicStability: 80, incentives: 55, importTariff: 20, exportTariff: 15 },
  { id: 'kr', name: 'Coreia do Sul', flag: '🇰🇷', taxRate: 22, laborCost: 65, avgSalary: 60, productionCost: 55, infrastructure: 90, purchasingPower: 75, population: 52, marketAccess: 70, logisticsCost: 30, techLevel: 92, professionalAvailability: 85, economicStability: 80, incentives: 70, importTariff: 20, exportTariff: 15 },
  { id: 'de', name: 'Alemanha', flag: '🇩🇪', taxRate: 30, laborCost: 80, avgSalary: 75, productionCost: 75, infrastructure: 90, purchasingPower: 85, population: 83, marketAccess: 85, logisticsCost: 25, techLevel: 85, professionalAvailability: 80, economicStability: 85, incentives: 50, importTariff: 20, exportTariff: 15 },
  { id: 'in', name: 'Índia', flag: '🇮🇳', taxRate: 25, laborCost: 20, avgSalary: 15, productionCost: 20, infrastructure: 50, purchasingPower: 30, population: 1400, marketAccess: 60, logisticsCost: 50, techLevel: 55, professionalAvailability: 70, economicStability: 55, incentives: 75, importTariff: 45, exportTariff: 20 },
  { id: 'vn', name: 'Vietnã', flag: '🇻🇳', taxRate: 20, laborCost: 15, avgSalary: 12, productionCost: 15, infrastructure: 45, purchasingPower: 25, population: 98, marketAccess: 45, logisticsCost: 45, techLevel: 35, professionalAvailability: 50, economicStability: 60, incentives: 85, importTariff: 30, exportTariff: 10 },
  { id: 'uk', name: 'Reino Unido', flag: '🇬🇧', taxRate: 25, laborCost: 75, avgSalary: 70, productionCost: 72, infrastructure: 85, purchasingPower: 80, population: 67, marketAccess: 80, logisticsCost: 35, techLevel: 82, professionalAvailability: 80, economicStability: 75, incentives: 55, importTariff: 25, exportTariff: 15 },
  { id: 'sg', name: 'Singapura', flag: '🇸🇬', taxRate: 17, laborCost: 70, avgSalary: 65, productionCost: 65, infrastructure: 95, purchasingPower: 90, population: 6, marketAccess: 80, logisticsCost: 15, techLevel: 88, professionalAvailability: 75, economicStability: 90, incentives: 85, importTariff: 0, exportTariff: 0 },
];

export const CPU_ARCHITECTURES: CPUArch[] = [
  { id: 'cpu_basic_1', name: 'CoreLite A1', lithography: 65, cores: 1, threads: 1, baseFreq: 800, turboFreq: 1000, cacheL2: 256, cacheL3: 0, tdp: 5, score: 15, yearAvailable: 2000, cost: 5 },
  { id: 'cpu_basic_2', name: 'CoreLite B2', lithography: 45, cores: 2, threads: 2, baseFreq: 1200, turboFreq: 1600, cacheL2: 512, cacheL3: 2048, tdp: 8, score: 35, yearAvailable: 2005, cost: 12 },
  { id: 'cpu_mid_1', name: 'HyperCore C4', lithography: 32, cores: 4, threads: 4, baseFreq: 1800, turboFreq: 2400, cacheL2: 1024, cacheL3: 4096, tdp: 15, score: 65, yearAvailable: 2010, cost: 25 },
  { id: 'cpu_mid_2', name: 'HyperCore D6', lithography: 22, cores: 6, threads: 12, baseFreq: 2200, turboFreq: 3200, cacheL2: 1536, cacheL3: 8192, tdp: 25, score: 120, yearAvailable: 2015, cost: 45 },
  { id: 'cpu_high_1', name: 'TitanX E8', lithography: 14, cores: 8, threads: 16, baseFreq: 2800, turboFreq: 3800, cacheL2: 2048, cacheL3: 16384, tdp: 35, score: 200, yearAvailable: 2018, cost: 70 },
  { id: 'cpu_high_2', name: 'TitanX F10', lithography: 7, cores: 10, threads: 20, baseFreq: 3200, turboFreq: 4200, cacheL2: 2560, cacheL3: 32768, tdp: 45, score: 320, yearAvailable: 2021, cost: 110 },
  { id: 'cpu_ultra_1', name: 'NovaCore G12', lithography: 5, cores: 12, threads: 24, baseFreq: 3600, turboFreq: 4800, cacheL2: 3072, cacheL3: 65536, tdp: 55, score: 480, yearAvailable: 2024, cost: 160 },
  { id: 'cpu_ultra_2', name: 'NovaCore H16', lithography: 3, cores: 16, threads: 32, baseFreq: 4000, turboFreq: 5400, cacheL2: 4096, cacheL3: 131072, tdp: 65, score: 700, yearAvailable: 2027, cost: 250 },
];

export const GPU_ARCHITECTURES: GPUArch[] = [
  { id: 'gpu_basic_1', name: 'PixelForce 100', architecture: 'Gen1', cores: 64, freq: 400, vram: 512, bandwidth: 8, rayTracing: false, tdp: 10, score: 20, yearAvailable: 2005, cost: 15 },
  { id: 'gpu_basic_2', name: 'PixelForce 300', architecture: 'Gen2', cores: 128, freq: 600, vram: 1024, bandwidth: 16, rayTracing: false, tdp: 20, score: 55, yearAvailable: 2010, cost: 30 },
  { id: 'gpu_mid_1', name: 'VortexCore 500', architecture: 'Gen3', cores: 256, freq: 900, vram: 2048, bandwidth: 32, rayTracing: false, tdp: 35, score: 110, yearAvailable: 2014, cost: 55 },
  { id: 'gpu_mid_2', name: 'VortexCore 700', architecture: 'Gen4', cores: 512, freq: 1200, vram: 4096, bandwidth: 64, rayTracing: true, tdp: 50, score: 200, yearAvailable: 2018, cost: 90 },
  { id: 'gpu_high_1', name: 'InfernoX 900', architecture: 'Gen5', cores: 1024, freq: 1500, vram: 8192, bandwidth: 128, rayTracing: true, tdp: 75, score: 380, yearAvailable: 2021, cost: 150 },
  { id: 'gpu_high_2', name: 'InfernoX 1100', architecture: 'Gen6', cores: 2048, freq: 1800, vram: 16384, bandwidth: 256, rayTracing: true, tdp: 100, score: 600, yearAvailable: 2024, cost: 220 },
  { id: 'gpu_ultra_1', name: 'QuantumRay 1300', architecture: 'Gen7', cores: 4096, freq: 2200, vram: 24576, bandwidth: 384, rayTracing: true, tdp: 130, score: 900, yearAvailable: 2027, cost: 350 },
];

export const DISPLAY_TECHS: DisplayTech[] = [
  { id: 'disp_lcd', name: 'LCD IPS', type: 'IPS', maxRes: '1920x1080', maxRefresh: 60, brightness: 400, contrast: 1000, yearAvailable: 2005, cost: 8 },
  { id: 'disp_amoled', name: 'AMOLED', type: 'AMOLED', maxRes: '2560x1440', maxRefresh: 90, brightness: 600, contrast: 100000, yearAvailable: 2012, cost: 18 },
  { id: 'disp_oled', name: 'Super OLED', type: 'OLED', maxRes: '3200x1440', maxRefresh: 120, brightness: 800, contrast: 200000, yearAvailable: 2017, cost: 28 },
  { id: 'disp_ltpo', name: 'LTPO OLED', type: 'LTPO', maxRes: '3200x1440', maxRefresh: 144, brightness: 1200, contrast: 500000, yearAvailable: 2021, cost: 40 },
  { id: 'disp_micro', name: 'MicroLED', type: 'MicroLED', maxRes: '4096x2160', maxRefresh: 240, brightness: 2000, contrast: 1000000, yearAvailable: 2026, cost: 65 },
];

export const BATTERY_TECHS: BatteryTech[] = [
  { id: 'bat_li', name: 'Li-Ion', maxCapacity: 3000, chargeSpeed: 10, wireless: false, cycles: 500, yearAvailable: 2005, cost: 5 },
  { id: 'bat_lipo', name: 'Li-Po', maxCapacity: 4000, chargeSpeed: 18, wireless: true, cycles: 700, yearAvailable: 2012, cost: 10 },
  { id: 'bat_graphene', name: 'Graphene', maxCapacity: 5500, chargeSpeed: 45, wireless: true, cycles: 1200, yearAvailable: 2020, cost: 22 },
  { id: 'bat_solid', name: 'Estado Sólido', maxCapacity: 7000, chargeSpeed: 65, wireless: true, cycles: 2000, yearAvailable: 2025, cost: 38 },
];

export const CAMERA_TECHS: CameraTech[] = [
  { id: 'cam_8', name: 'Sensor 8MP', resolution: 8, aperture: 2.4, stabilization: false, sensorSize: '1/3.2"', yearAvailable: 2005, cost: 3 },
  { id: 'cam_12', name: 'Sensor 12MP', resolution: 12, aperture: 2.0, stabilization: true, sensorSize: '1/2.55"', yearAvailable: 2012, cost: 8 },
  { id: 'cam_48', name: 'Sensor 48MP', resolution: 48, aperture: 1.8, stabilization: true, sensorSize: '1/2"', yearAvailable: 2018, cost: 15 },
  { id: 'cam_108', name: 'Sensor 108MP', resolution: 108, aperture: 1.6, stabilization: true, sensorSize: '1/1.33"', yearAvailable: 2021, cost: 25 },
  { id: 'cam_200', name: 'Sensor 200MP', resolution: 200, aperture: 1.4, stabilization: true, sensorSize: '1/1.12"', yearAvailable: 2024, cost: 40 },
];

export const TECH_TREE: Technology[] = [
  // Processing
  { id: 'tech_cpu_1', name: 'Arquitetura Multi-Core', category: 'Processamento', level: 1, cost: 5000, time: 30, prerequisites: [], unlocks: ['cpu_mid_1'], description: 'Permite CPUs com múltiplos núcleos', yearAvailable: 2008 },
  { id: 'tech_cpu_2', name: 'Litografia Avançada 14nm', category: 'Processamento', level: 2, cost: 25000, time: 60, prerequisites: ['tech_cpu_1'], unlocks: ['cpu_high_1'], description: 'Reduz consumo e aumenta performance', yearAvailable: 2016 },
  { id: 'tech_cpu_3', name: 'Litografia 7nm', category: 'Processamento', level: 3, cost: 80000, time: 90, prerequisites: ['tech_cpu_2'], unlocks: ['cpu_high_2'], description: 'Processadores de alta eficiência', yearAvailable: 2020 },
  { id: 'tech_cpu_4', name: 'Litografia 3nm', category: 'Processamento', level: 4, cost: 200000, time: 120, prerequisites: ['tech_cpu_3'], unlocks: ['cpu_ultra_1', 'cpu_ultra_2'], description: 'Estado da arte em semicondutores', yearAvailable: 2025 },
  // Graphics
  { id: 'tech_gpu_1', name: 'Pipeline Gráfico Moderno', category: 'Gráficos', level: 1, cost: 8000, time: 40, prerequisites: [], unlocks: ['gpu_mid_1'], description: 'Arquitetura GPU moderna', yearAvailable: 2012 },
  { id: 'tech_gpu_2', name: 'Ray Tracing Hardware', category: 'Gráficos', level: 2, cost: 35000, time: 70, prerequisites: ['tech_gpu_1'], unlocks: ['gpu_mid_2'], description: 'Aceleração de ray tracing por hardware', yearAvailable: 2018 },
  { id: 'tech_gpu_3', name: 'Arquitetura Unificada', category: 'Gráficos', level: 3, cost: 100000, time: 100, prerequisites: ['tech_gpu_2'], unlocks: ['gpu_high_1', 'gpu_high_2'], description: 'GPU com arquitetura unificada de shaders', yearAvailable: 2022 },
  // Displays
  { id: 'tech_disp_1', name: 'Painel AMOLED', category: 'Displays', level: 1, cost: 10000, time: 30, prerequisites: [], unlocks: ['disp_amoled'], description: 'Tecnologia de display orgânico', yearAvailable: 2010 },
  { id: 'tech_disp_2', name: 'LTPO Display', category: 'Displays', level: 2, cost: 30000, time: 50, prerequisites: ['tech_disp_1'], unlocks: ['disp_ltpo'], description: 'Taxa de atualização adaptativa', yearAvailable: 2019 },
  // Battery
  { id: 'tech_bat_1', name: 'Bateria Li-Po', category: 'Baterias', level: 1, cost: 5000, time: 20, prerequisites: [], unlocks: ['bat_lipo'], description: 'Bateria de polímero de lítio', yearAvailable: 2010 },
  { id: 'tech_bat_2', name: 'Carregamento Rápido', category: 'Baterias', level: 2, cost: 15000, time: 35, prerequisites: ['tech_bat_1'], unlocks: ['bat_graphene'], description: 'Tecnologia de carregamento acelerado', yearAvailable: 2018 },
  // Camera
  { id: 'tech_cam_1', name: 'Sensor de Alta Resolução', category: 'Câmeras', level: 1, cost: 8000, time: 25, prerequisites: [], unlocks: ['cam_12'], description: 'Sensores com mais de 10MP', yearAvailable: 2010 },
  { id: 'tech_cam_2', name: 'Computação Fotográfica', category: 'Câmeras', level: 2, cost: 20000, time: 45, prerequisites: ['tech_cam_1'], unlocks: ['cam_48', 'cam_108'], description: 'IA para processamento de imagens', yearAvailable: 2017 },
  { id: 'tech_cam_3', name: 'Sensor Ultra', category: 'Câmeras', level: 3, cost: 50000, time: 60, prerequisites: ['tech_cam_2'], unlocks: ['cam_200'], description: 'Sensores de última geração', yearAvailable: 2023 },
  // Software
  { id: 'tech_sw_1', name: 'Sistema Operacional Móvel', category: 'Software', level: 1, cost: 15000, time: 60, prerequisites: [], unlocks: [], description: 'Desenvolver um SO próprio', yearAvailable: 2008 },
  { id: 'tech_sw_2', name: 'Ecossistema de Apps', category: 'Software', level: 2, cost: 40000, time: 80, prerequisites: ['tech_sw_1'], unlocks: [], description: 'Loja de aplicativos própria', yearAvailable: 2012 },
  // AI
  { id: 'tech_ai_1', name: 'NPU Integrada', category: 'IA', level: 1, cost: 20000, time: 50, prerequisites: ['tech_cpu_1'], unlocks: [], description: 'Processamento neural no chip', yearAvailable: 2017 },
  { id: 'tech_ai_2', name: 'IA Generativa On-Device', category: 'IA', level: 2, cost: 60000, time: 80, prerequisites: ['tech_ai_1'], unlocks: [], description: 'Modelos de IA rodando localmente', yearAvailable: 2023 },
];

export const EMPLOYEE_ROLES = [
  { id: 'designer', name: 'Designer', icon: '🎨', baseSalary: 4000, productivity: 1.0 },
  { id: 'engineer', name: 'Engenheiro', icon: '⚙️', baseSalary: 5000, productivity: 1.2 },
  { id: 'programmer', name: 'Programador', icon: '💻', baseSalary: 5500, productivity: 1.3 },
  { id: 'cpu_specialist', name: 'Esp. CPU', icon: '🔲', baseSalary: 7000, productivity: 1.5 },
  { id: 'gpu_specialist', name: 'Esp. GPU', icon: '🖥️', baseSalary: 7000, productivity: 1.5 },
  { id: 'researcher', name: 'Pesquisador', icon: '🔬', baseSalary: 6000, productivity: 1.4 },
  { id: 'marketing', name: 'Marketing', icon: '📢', baseSalary: 3500, productivity: 1.0 },
  { id: 'finance', name: 'Financeiro', icon: '💰', baseSalary: 4000, productivity: 1.0 },
  { id: 'manager', name: 'Gerente', icon: '👔', baseSalary: 6500, productivity: 1.1 },
];

export const OFFICE_TYPES = [
  { id: 'garage', name: 'Garagem', capacity: 5, cost: 0, maintenance: 200, productivityBonus: 0 },
  { id: 'small_office', name: 'Escritório Pequeno', capacity: 15, cost: 50000, maintenance: 1500, productivityBonus: 5 },
  { id: 'office', name: 'Escritório', capacity: 50, cost: 200000, maintenance: 5000, productivityBonus: 10 },
  { id: 'tech_park', name: 'Parque Tecnológico', capacity: 150, cost: 800000, maintenance: 15000, productivityBonus: 18 },
  { id: 'campus', name: 'Campus', capacity: 500, cost: 3000000, maintenance: 50000, productivityBonus: 25 },
  { id: 'hq', name: 'Sede Global', capacity: 2000, cost: 15000000, maintenance: 200000, productivityBonus: 35 },
];

export const PRODUCT_CATEGORIES = [
  { id: 'smartphone', name: 'Smartphone', icon: '📱' },
  { id: 'tablet', name: 'Tablet', icon: '📋' },
  { id: 'laptop', name: 'Notebook', icon: '💻' },
  { id: 'desktop', name: 'PC Desktop', icon: '🖥️' },
  { id: 'tv', name: 'TV/Monitor', icon: '📺' },
  { id: 'audio', name: 'Áudio', icon: '🎧' },
  { id: 'wearable', name: 'Vestível', icon: '⌚' },
  { id: 'console', name: 'Console', icon: '🎮' },
  { id: 'cpu', name: 'Processador', icon: '🔲' },
  { id: 'gpu', name: 'Placa de Vídeo', icon: '🖥️' },
];

export const MARKET_SEGMENTS = [
  { id: 'budget', name: 'Econômico', multiplier: 0.6, volume: 1.8 },
  { id: 'mid', name: 'Intermediário', multiplier: 1.0, volume: 1.4 },
  { id: 'premium', name: 'Premium', multiplier: 1.8, volume: 0.8 },
  { id: 'ultra', name: 'Ultra Premium', multiplier: 2.8, volume: 0.4 },
];

export const RIVAL_COMPANIES = [
  { id: 'rival_1', name: 'NovaTech', country: 'us', marketShare: 22, reputation: 78, techLevel: 85, aggression: 60, innovation: 80, quality: 75, priceAggression: 30 },
  { id: 'rival_2', name: 'ZenithCorp', country: 'kr', marketShare: 18, reputation: 82, techLevel: 90, aggression: 50, innovation: 85, quality: 88, priceAggression: 40 },
  { id: 'rival_3', name: 'DragonTech', country: 'cn', marketShare: 15, reputation: 65, techLevel: 75, aggression: 70, innovation: 70, quality: 60, priceAggression: 80 },
  { id: 'rival_4', name: 'SakuraElec', country: 'jp', marketShare: 12, reputation: 85, techLevel: 88, aggression: 35, innovation: 75, quality: 90, priceAggression: 25 },
  { id: 'rival_5', name: 'EuroSilicon', country: 'de', marketShare: 8, reputation: 72, techLevel: 78, aggression: 45, innovation: 65, quality: 82, priceAggression: 35 },
];

export const EVENTS_POOL = [
  { id: 'crisis', name: 'Crise Econômica', type: 'negative', effect: 'market_down', magnitude: 0.3, duration: 6 },
  { id: 'boom', name: 'Boom de Demanda', type: 'positive', effect: 'market_up', magnitude: 0.25, duration: 4 },
  { id: 'shortage', name: 'Escassez de Componentes', type: 'negative', effect: 'cost_up', magnitude: 0.4, duration: 3 },
  { id: 'innovation', name: 'Avanço Tecnológico', type: 'positive', effect: 'research_boost', magnitude: 0.5, duration: 2 },
  { id: 'tariff', name: 'Aumento de Tarifas', type: 'negative', effect: 'tariff_up', magnitude: 0.2, duration: 8 },
  { id: 'award', name: 'Prêmio de Inovação', type: 'positive', effect: 'reputation_up', magnitude: 10, duration: 12 },
  { id: 'recall', name: 'Problema de Qualidade', type: 'negative', effect: 'reputation_down', magnitude: 15, duration: 6 },
  { id: 'trend', name: 'Nova Tendência de Mercado', type: 'neutral', effect: 'segment_shift', magnitude: 0.15, duration: 5 },
];
