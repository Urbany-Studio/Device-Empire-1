import { COUNTRIES, CPU_ARCHITECTURES, GPU_ARCHITECTURES, DISPLAY_TECHS, BATTERY_TECHS, CAMERA_TECHS, TECH_TREE, EMPLOYEE_ROLES, OFFICE_TYPES, RIVAL_COMPANIES, EVENTS_POOL, PRODUCT_CATEGORIES, MARKET_SEGMENTS } from '../data/gameData';

// Types
export interface Employee {
  id: string;
  name: string;
  role: string;
  intelligence: number;
  experience: number;
  creativity: number;
  productivity: number;
  salary: number;
  motivation: number;
  fatigue: number;
  satisfaction: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  segment: string;
  price: number;
  cost: number;
  quality: number;
  design: number;
  specs: Record<string, any>;
  releaseDate: number;
  sales: number;
  satisfaction: number;
  stock: number;
  status: 'development' | 'ready' | 'selling' | 'discontinued';
  developmentProgress: number;
  developmentTime: number;
}

export interface Rival {
  id: string;
  name: string;
  country: string;
  marketShare: number;
  reputation: number;
  techLevel: number;
  aggression: number;
  innovation: number;
  quality: number;
  priceAggression: number;
  capital: number;
  products: Product[];
}

export interface GameState {
  // Company
  companyName: string;
  companyAbbr: string;
  slogan: string;
  founderName: string;
  foundingYear: number;
  country: string;
  currency: string;
  primaryColor: string;
  secondaryColor: string;
  
  // Game mode
  mode: 'career' | 'sandbox' | 'history' | 'challenge';
  difficulty: number;
  timeSpeed: number;
  
  // Financial
  capital: number;
  revenue: number;
  expenses: number;
  profit: number;
  marketValue: number;
  
  // Metrics
  fame: number;
  reputation: number;
  satisfaction: number;
  followers: number;
  marketShare: Record<string, number>;
  
  // Time
  currentYear: number;
  currentMonth: number;
  totalMonths: number;
  isPaused: boolean;
  
  // Employees
  employees: Employee[];
  
  // Products
  products: Product[];
  
  // Research
  unlockedTech: string[];
  researchPoints: number;
  currentResearch: string | null;
  researchProgress: number;
  
  // Office
  officeType: string;
  
  // Rivals
  rivals: Rival[];
  
  // Events
  activeEvents: { event: any; remainingMonths: number }[];
  eventLog: { month: number; text: string; type: string }[];
  
  // Sandbox settings
  sandbox: {
    infiniteMoney: boolean;
    instantResearch: boolean;
    instantProduction: boolean;
    allTechUnlocked: boolean;
    happyEmployees: boolean;
    freeHiring: boolean;
  };
}

export function createInitialState(config: any): GameState {
  const country = COUNTRIES.find(c => c.id === config.country) || COUNTRIES[0];
  
  const rivals: Rival[] = RIVAL_COMPANIES.map(r => ({
    ...r,
    capital: 5000000 + Math.random() * 50000000,
    products: [],
  }));

  return {
    companyName: config.companyName || 'Minha Empresa',
    companyAbbr: config.companyAbbr || 'ME',
    slogan: config.slogan || 'Inovando o futuro',
    founderName: config.founderName || 'Fundador',
    foundingYear: config.foundingYear || 2020,
    country: config.country || 'br',
    currency: config.currency || 'R$',
    primaryColor: config.primaryColor || '#6366f1',
    secondaryColor: config.secondaryColor || '#818cf8',
    
    mode: config.mode || 'career',
    difficulty: config.difficulty || 50,
    timeSpeed: 1,
    
    capital: config.capital || 100000,
    revenue: 0,
    expenses: 0,
    profit: 0,
    marketValue: config.capital || 100000,
    
    fame: 5,
    reputation: 50,
    satisfaction: 50,
    followers: 0,
    marketShare: {},
    
    currentYear: config.startYear || 2020,
    currentMonth: 1,
    totalMonths: 0,
    isPaused: true,
    
    employees: [],
    products: [],
    
    unlockedTech: config.mode === 'sandbox' && config.sandbox?.allTechUnlocked 
      ? TECH_TREE.map(t => t.id) 
      : [],
    researchPoints: config.mode === 'sandbox' ? 99999 : 0,
    currentResearch: null,
    researchProgress: 0,
    
    officeType: 'garage',
    
    rivals,
    
    activeEvents: [],
    eventLog: [{ month: 0, text: `${config.companyName} foi fundada!`, type: 'info' }],
    
    sandbox: config.sandbox || {
      infiniteMoney: false,
      instantResearch: false,
      instantProduction: false,
      allTechUnlocked: false,
      happyEmployees: false,
      freeHiring: false,
    },
  };
}

export function generateEmployee(role: string, country: Country): Employee {
  const roleData = EMPLOYEE_ROLES.find(r => r.id === role)!;
  const salaryMod = country.avgSalary / 50;
  
  return {
    id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: generateName(),
    role,
    intelligence: 30 + Math.random() * 70,
    experience: Math.random() * 100,
    creativity: 20 + Math.random() * 80,
    productivity: 40 + Math.random() * 60,
    salary: Math.round(roleData.baseSalary * salaryMod),
    motivation: 50 + Math.random() * 30,
    fatigue: Math.random() * 20,
    satisfaction: 60 + Math.random() * 20,
  };
}

function generateName(): string {
  const first = ['Ana', 'Carlos', 'Maria', 'João', 'Pedro', 'Lucas', 'Julia', 'Rafael', 'Fernanda', 'Bruno', 'Camila', 'Diego', 'Larissa', 'Thiago', 'Amanda'];
  const last = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa', 'Ferreira', 'Alves', 'Rodrigues', 'Gomes', 'Martins', 'Araujo', 'Ribeiro', 'Carvalho'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

interface Country { id: string; avgSalary: number; [key: string]: any; }

export function calculateProductQuality(product: Product, employees: Employee[]): number {
  const engBonus = employees.filter(e => e.role === 'engineer' || e.role === 'cpu_specialist')
    .reduce((sum, e) => sum + (e.intelligence * e.productivity) / 100, 0);
  const designBonus = employees.filter(e => e.role === 'designer')
    .reduce((sum, e) => sum + (e.creativity * e.productivity) / 100, 0);
  
  const baseQuality = product.design * 0.4 + (product.specs.overall || 50) * 0.4;
  const teamBonus = Math.min(30, engBonus * 2 + designBonus * 2);
  
  return Math.min(100, Math.max(1, Math.round(baseQuality + teamBonus)));
}

export function calculateProductCost(product: Product, country: Country): number {
  const baseCost = product.cost;
  const laborMod = country.laborCost / 50;
  const prodMod = country.productionCost / 50;
  return Math.round(baseCost * laborMod * 0.3 + baseCost * prodMod * 0.7);
}

export function calculateDemand(product: Product, state: GameState): number {
  const country = COUNTRIES.find(c => c.id === state.country)!;
  const segment = MARKET_SEGMENTS.find(s => s.id === product.segment)!;
  
  const priceFactor = Math.max(0.1, 2 - (product.price / (segment.multiplier * 1000)));
  const qualityFactor = product.quality / 100;
  const fameFactor = (state.fame + state.reputation) / 200;
  const purchasingPower = country.purchasingPower / 100;
  const volumeMod = segment.volume;
  
  const baseDemand = priceFactor * qualityFactor * fameFactor * purchasingPower * volumeMod * 1000;
  
  // Event modifiers
  let eventMod = 1;
  state.activeEvents.forEach(e => {
    if (e.event.effect === 'market_up') eventMod += e.event.magnitude;
    if (e.event.effect === 'market_down') eventMod -= e.event.magnitude;
  });
  
  return Math.max(0, Math.round(baseDemand * eventMod));
}

export function simulateMonth(state: GameState): GameState {
  const newState = { ...state };
  const country = COUNTRIES.find(c => c.id === state.country)!;
  
  // Advance time
  newState.currentMonth++;
  newState.totalMonths++;
  if (newState.currentMonth > 12) {
    newState.currentMonth = 1;
    newState.currentYear++;
  }
  
  // Employee costs
  const employeeCost = state.employees.reduce((sum, e) => sum + e.salary, 0);
  const officeCost = OFFICE_TYPES.find(o => o.id === state.officeType)?.maintenance || 0;
  const taxRate = country.taxRate / 100;
  
  // Product sales
  let monthlyRevenue = 0;
  newState.products.forEach(p => {
    if (p.status === 'selling') {
      const demand = calculateDemand(p, state);
      const sold = Math.min(demand, p.stock);
      p.sales += sold;
      p.stock -= sold;
      monthlyRevenue += sold * p.price;
      
      // Update satisfaction based on quality vs price
      const expected = p.quality / (p.price / 100);
      p.satisfaction = Math.min(100, Math.max(0, p.satisfaction * 0.95 + expected * 5));
    }
    
    // Development progress
    if (p.status === 'development') {
      const devSpeed = state.employees.filter(e => 
        e.role === 'engineer' || e.role === 'programmer' || e.role === 'designer'
      ).reduce((sum, e) => sum + (e.productivity * e.intelligence) / 1000, 0.5);
      
      if (state.sandbox.instantResearch) {
        p.developmentProgress = 100;
      } else {
        p.developmentProgress = Math.min(100, p.developmentProgress + devSpeed);
      }
      
      if (p.developmentProgress >= 100) {
        p.status = 'ready';
        newState.eventLog.push({
          month: newState.totalMonths,
          text: `${p.name} está pronto para lançamento!`,
          type: 'success'
        });
      }
    }
  });
  
  // Research progress
  if (state.currentResearch) {
    const tech = TECH_TREE.find(t => t.id === state.currentResearch);
    if (tech) {
      const researchers = state.employees.filter(e => e.role === 'researcher' || e.role === 'cpu_specialist' || e.role === 'gpu_specialist');
      const researchSpeed = researchers.reduce((sum, e) => sum + (e.intelligence * e.productivity) / 500, 0.1);
      
      if (state.sandbox.instantResearch) {
        newState.researchProgress = 100;
      } else {
        newState.researchProgress = Math.min(100, state.researchProgress + researchSpeed);
      }
      
      if (newState.researchProgress >= 100) {
        newState.unlockedTech = [...state.unlockedTech, tech.id];
        newState.researchPoints += 50;
        newState.currentResearch = null;
        newState.researchProgress = 0;
        newState.eventLog.push({
          month: newState.totalMonths,
          text: `Pesquisa concluída: ${tech.name}`,
          type: 'success'
        });
      }
    }
  }
  
  // Research points generation
  newState.researchPoints += state.employees.filter(e => e.role === 'researcher').length * 2;
  
  // Employee updates
  newState.employees = state.employees.map(e => ({
    ...e,
    fatigue: Math.min(100, e.fatigue + 0.5),
    motivation: Math.max(10, e.motivation + (e.satisfaction > 70 ? 0.2 : -0.3)),
    satisfaction: Math.max(10, Math.min(100, e.satisfaction + (e.fatigue < 50 ? 0.1 : -0.2))),
    productivity: e.productivity * (1 - (state.sandbox.happyEmployees ? 0 : e.fatigue / 300)),
  }));
  
  // Rival AI simulation
  newState.rivals = state.rivals.map(r => {
    const newShare = r.marketShare + (Math.random() - 0.5) * r.aggression / 50;
    return {
      ...r,
      marketShare: Math.max(1, Math.min(40, newShare)),
      reputation: Math.max(10, Math.min(100, r.reputation + (Math.random() - 0.5) * 2)),
      techLevel: Math.min(100, r.techLevel + r.innovation / 500),
    };
  });
  
  // Events
  newState.activeEvents = state.activeEvents
    .map(e => ({ ...e, remainingMonths: e.remainingMonths - 1 }))
    .filter(e => e.remainingMonths > 0);
  
  // Random events
  if (Math.random() < 0.03) {
    const event = EVENTS_POOL[Math.floor(Math.random() * EVENTS_POOL.length)];
    newState.activeEvents.push({ event, remainingMonths: event.duration });
    newState.eventLog.push({
      month: newState.totalMonths,
      text: `Evento: ${event.name}`,
      type: event.type === 'positive' ? 'success' : event.type === 'negative' ? 'danger' : 'info'
    });
  }
  
  // Financials
  const monthlyExpenses = employeeCost + officeCost;
  const grossProfit = monthlyRevenue - monthlyExpenses;
  const taxes = Math.max(0, grossProfit * taxRate);
  const netProfit = grossProfit - taxes;
  
  if (!state.sandbox.infiniteMoney) {
    newState.capital = state.capital + netProfit;
  }
  newState.revenue = monthlyRevenue;
  newState.expenses = monthlyExpenses + taxes;
  newState.profit = netProfit;
  newState.marketValue = newState.capital + newState.revenue * 12;
  
  // Update overall metrics
  const avgProductSat = newState.products.filter(p => p.status === 'selling')
    .reduce((sum, p, _, arr) => sum + p.satisfaction / Math.max(1, arr.length), 0);
  newState.satisfaction = avgProductSat > 0 ? avgProductSat : state.satisfaction;
  newState.fame = Math.min(100, state.fame + (newState.products.filter(p => p.status === 'selling').length * 0.1));
  newState.reputation = Math.min(100, Math.max(0, state.reputation + (newState.satisfaction - 50) * 0.01));
  
  // Followers growth
  newState.followers = state.followers + Math.round(state.fame * state.reputation / 100);
  
  // Market share calculation
  const totalMarket = newState.rivals.reduce((sum, r) => sum + r.marketShare, 0) + state.fame * 0.5;
  newState.marketShare = {
    ...state.marketShare,
    'smartphone': Math.min(50, (state.fame * 0.5 / Math.max(1, totalMarket)) * 100),
  };
  
  return newState;
}

export function saveGame(state: GameState, slot: string): void {
  try {
    const data = JSON.stringify(state);
    localStorage.setItem(`tech_empire_save_${slot}`, data);
  } catch (e) {
    console.error('Save failed:', e);
  }
}

export function loadGame(slot: string): GameState | null {
  try {
    const data = localStorage.getItem(`tech_empire_save_${slot}`);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Load failed:', e);
  }
  return null;
}

export function getSaveSlots(): { slot: string; companyName: string; date: string; year: number }[] {
  const slots: any[] = [];
  for (let i = 0; i < 10; i++) {
    const data = localStorage.getItem(`tech_empire_save_${i}`);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        slots.push({
          slot: `${i}`,
          companyName: parsed.companyName,
          date: new Date().toLocaleDateString('pt-BR'),
          year: parsed.currentYear,
        });
      } catch {}
    }
  }
  return slots;
}
