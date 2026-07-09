import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppState, 
  Client, 
  Sale, 
  Expense, 
  Partner, 
  Sector, 
  DeliveryPerson, 
  Product, 
  Vehicle, 
  FleetExpense, 
  CommissionVoucher 
} from '../types';

interface AppContextType extends AppState {
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  
  addSale: (sale: Omit<Sale, 'id' | 'commission'>) => void;
  updateSaleStatus: (id: string, status: 'pending' | 'delivered' | 'canceled') => void;
  deleteSale: (id: string) => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  
  addSector: (sector: Omit<Sector, 'id'>) => void;
  
  addDeliveryPerson: (person: Omit<DeliveryPerson, 'id'>) => void;
  updateDeliveryPerson: (person: DeliveryPerson) => void;
  deleteDeliveryPerson: (id: string) => void;
  
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;

  addFleetExpense: (expense: Omit<FleetExpense, 'id'>) => void;
  deleteFleetExpense: (id: string) => void;

  addVoucher: (voucher: Omit<CommissionVoucher, 'id'>) => void;
  updateVoucher: (voucher: CommissionVoucher) => void;
  deleteVoucher: (id: string) => void;
  weeklyClosure: (employeeId: string) => void;
  completeWeeklyPayment: (employeeId: string, totalToReceive: number, debtAmount: number) => void;

  updatePartner: (partner: Partner) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PARTNERS: Partner[] = [
  { id: 'partner-1', name: 'Sócio Wagner (Administrador)', sharePercentage: 40.00 },
  { id: 'partner-2', name: 'Sócio Bruno (Comercial)', sharePercentage: 30.00 },
  { id: 'partner-3', name: 'Sócio Carla (Operacional)', sharePercentage: 30.00 },
];

const DEFAULT_SECTORS: Sector[] = [
  { id: 'sector-a', name: 'A. CENTRO', city: 'Rio das Ostras', deliveryFee: 3.00 },
  { id: 'sector-b', name: 'B. ANCORA, VILLAGE, TERRA FIRME', city: 'Rio das Ostras', deliveryFee: 5.00 },
  { id: 'sector-c', name: 'C. IRIRI, OURO VERDE, RECREIO, COSTA AZUL, COLINAS', city: 'Rio das Ostras', deliveryFee: 6.00 },
  { id: 'sector-d', name: 'D. CIDADE PRAIANA', city: 'Rio das Ostras', deliveryFee: 5.00 },
  { id: 'sector-e', name: 'E. BARRA DE SÃO JOÃO', city: 'Casimiro de Abreu', deliveryFee: 8.00 },
];

const INITIAL_DELIVERY_PERSONS: DeliveryPerson[] = [
  { id: 'dp-1', name: 'Carlos Santos', phone: '(22) 99888-1111', status: 'active', number: 1, weeklySalary: 500 },
  { id: 'dp-2', name: 'André Silva', phone: '(22) 99777-2222', status: 'active', number: 2, weeklySalary: 600 },
  { id: 'dp-3', name: 'Roberto Lima', phone: '(22) 99666-3333', status: 'active', number: 3, weeklySalary: 550 },
  { id: 'dp-4', name: 'Mateus Souza', phone: '(22) 99555-4444', status: 'inactive', number: 4, weeklySalary: 500 },
  { id: 'dp-5', name: 'Lucas Pinheiro', phone: '(22) 99444-5555', status: 'active', number: 5, weeklySalary: 600 },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod-1', name: '510 ml com gás', unitCost: 0.90, priceVarejoVista: 2.50, priceVarejoPrazo: 3.00, priceAtacadoVista: 1.80, priceAtacadoPrazo: 2.10 },
  { id: 'prod-2', name: '510 ml sem gás', unitCost: 0.70, priceVarejoVista: 2.00, priceVarejoPrazo: 2.50, priceAtacadoVista: 1.50, priceAtacadoPrazo: 1.80 },
  { id: 'prod-3', name: '1500 ml com gás', unitCost: 1.40, priceVarejoVista: 4.50, priceVarejoPrazo: 5.00, priceAtacadoVista: 3.20, priceAtacadoPrazo: 3.60 },
  { id: 'prod-4', name: '1500 ml sem gás', unitCost: 1.10, priceVarejoVista: 3.80, priceVarejoPrazo: 4.30, priceAtacadoVista: 2.80, priceAtacadoPrazo: 3.10 },
  { id: 'prod-5', name: '5 Litros sem gás', unitCost: 2.80, priceVarejoVista: 8.50, priceVarejoPrazo: 9.50, priceAtacadoVista: 6.50, priceAtacadoPrazo: 7.20 },
  { id: 'prod-6', name: '10 Litros sem gás', unitCost: 4.90, priceVarejoVista: 13.90, priceVarejoPrazo: 15.90, priceAtacadoVista: 11.00, priceAtacadoPrazo: 12.50 },
  { id: 'prod-7', name: 'Galão 20 Litros', unitCost: 4.00, priceVarejoVista: 14.00, priceVarejoPrazo: 16.00, priceAtacadoVista: 9.99, priceAtacadoPrazo: 11.50 },
];

const INITIAL_CLIENTS: Client[] = [
  { id: 'cli-1', name: 'Mercadinho do Centro', phone: '22991234567', address: 'Rua Principal, 102 - Centro', sectorId: 'sector-a' },
  { id: 'cli-2', name: 'Padaria Âncora', phone: '22998765432', address: 'Av. das Flores, 444 - Âncora', sectorId: 'sector-b' },
  { id: 'cli-3', name: 'Quiosque Costa Azul', phone: '22981112222', address: 'Orla de Costa Azul, s/n', sectorId: 'sector-c' },
  { id: 'cli-4', name: 'Hotel Cidade Praiana', phone: '22974443333', address: 'Rua Santa Catarina, 12 - Cidade Praiana', sectorId: 'sector-d' },
  { id: 'cli-5', name: 'Restaurante da Barra', phone: '22990001212', address: 'Av. Beira Rio, 20 - Barra de São João', sectorId: 'sector-e' },
];

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'veh-1', plate: 'KXO-4E12', type: 'motorcycle', model: 'Honda Cargo 160cc' },
  { id: 'veh-2', plate: 'LPT-9D88', type: 'car', model: 'Fiat Fiorino 1.4 EVO' },
  { id: 'veh-3', plate: 'MGB-2026', type: 'truck', model: 'VW Delivery 9.170' },
];

const INITIAL_FLEET_EXPENSES: FleetExpense[] = [
  { id: 'fe-1', vehicleId: 'veh-1', type: 'fuel', amount: 45.00, date: '2026-07-07T10:00:00.000Z', description: 'Abastecimento Completo Moto' },
  { id: 'fe-2', vehicleId: 'veh-2', type: 'maintenance', amount: 350.00, date: '2026-07-05T14:30:00.000Z', description: 'Troca de Óleo e Filtros Fiorino' },
  { id: 'fe-3', vehicleId: 'veh-3', type: 'fuel', amount: 480.00, date: '2026-07-08T08:15:00.000Z', description: 'Diesel S10 Caminhão' },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', description: 'Conta de Energia (Depósito)', amount: 420.00, date: '2026-07-02T15:00:00.000Z', category: 'Utilidades' },
  { id: 'exp-2', description: 'Aluguel do Galpão', amount: 2500.00, date: '2026-07-01T09:00:00.000Z', category: 'Infraestrutura' },
  { id: 'exp-3', description: 'Internet Banda Larga', amount: 150.00, date: '2026-07-03T11:00:00.000Z', category: 'Comunicação' },
];

const INITIAL_SALES: Sale[] = [
  { 
    id: 'sale-1', 
    clientId: 'cli-1', 
    deliveryPersonId: 'dp-1', 
    productId: 'prod-7', 
    quantity: 15, 
    priceType: 'atacado_vista', 
    unitPrice: 9.99, 
    unitCost: 4.00, 
    deliveryFee: 3.00, 
    totalAmount: 152.85, 
    totalCost: 60.00, 
    commission: 0.00, // unitPrice is 9.99, below 10.00 trigger -> 0 commission
    profit: 92.85, 
    date: '2026-07-08T11:30:00.000Z',
    status: 'delivered'
  },
  { 
    id: 'sale-2', 
    clientId: 'cli-2', 
    deliveryPersonId: 'dp-2', 
    productId: 'prod-7', 
    quantity: 10, 
    priceType: 'varejo_vista', 
    unitPrice: 14.00, // Above 10.00! R$1.00 per galão commission -> R$10.00 commission
    unitCost: 4.00, 
    deliveryFee: 5.00, 
    totalAmount: 145.00, 
    totalCost: 40.00, 
    commission: 10.00, 
    profit: 95.00, 
    date: '2026-07-09T08:00:00.000Z',
    status: 'pending' // pending for routing
  },
  { 
    id: 'sale-3', 
    clientId: 'cli-3', 
    deliveryPersonId: 'dp-3', 
    productId: 'prod-5', 
    quantity: 20, 
    priceType: 'atacado_prazo', 
    unitPrice: 7.20, 
    unitCost: 2.80, 
    deliveryFee: 6.00, 
    totalAmount: 150.00, 
    totalCost: 56.00, 
    commission: 0.00, 
    profit: 88.00, 
    date: '2026-07-09T09:15:00.000Z',
    status: 'pending' // pending for routing
  }
];

const INITIAL_VOUCHERS: CommissionVoucher[] = [
  // Commissions automatically generated from sale-2 or preloaded
  { id: 'vouc-1', employeeId: 'dp-2', type: 'commission_earn', amount: 10.00, date: '2026-07-09T08:00:00.000Z', description: 'Comissão Automática - 10x Galão 20L (Pedido #sale-2)' },
  { id: 'vouc-2', employeeId: 'dp-1', type: 'voucher_withdraw', amount: 50.00, date: '2026-07-06T17:00:00.000Z', description: 'Adiantamento Semanal Solicitado' },
  { id: 'vouc-3', employeeId: 'dp-2', type: 'voucher_withdraw', amount: 30.00, date: '2026-07-07T16:00:00.000Z', description: 'Adiantamento / Vale' },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('aqua_gestao_v2_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved data, reverting to defaults", e);
      }
    }
    return {
      clients: INITIAL_CLIENTS,
      sectors: DEFAULT_SECTORS,
      deliveryPersons: INITIAL_DELIVERY_PERSONS,
      products: INITIAL_PRODUCTS,
      sales: INITIAL_SALES,
      expenses: INITIAL_EXPENSES,
      vehicles: INITIAL_VEHICLES,
      fleetExpenses: INITIAL_FLEET_EXPENSES,
      vouchers: INITIAL_VOUCHERS,
      partners: INITIAL_PARTNERS,
    };
  });

  useEffect(() => {
    localStorage.setItem('aqua_gestao_v2_data', JSON.stringify(state));
  }, [state]);

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient: Client = { ...client, id: 'cli-' + crypto.randomUUID().slice(0, 8) };
    setState(s => ({ ...s, clients: [...s.clients, newClient] }));
  };

  const updateClient = (client: Client) => {
    setState(s => ({
      ...s,
      clients: s.clients.map(c => c.id === client.id ? client : c)
    }));
  };

  const deleteClient = (id: string) => {
    // Soft Delete
    setState(s => ({
      ...s,
      clients: s.clients.map(c => c.id === id ? { ...c, deletedAt: new Date().toISOString() } : c)
    }));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'commission'>) => {
    const id = 'sale-' + crypto.randomUUID().slice(0, 8);
    
    // COMMISSION TRIGGER: R$ 1,00 commission per Galão 20 Litros (prod-7) or any product with "galão"/"galao" in name if unitPrice > R$ 10.00 (i.e., >= 11.00)
    const product = state.products.find(p => p.id === sale.productId);
    const productName = product ? product.name : 'Galão 20 Litros';
    const isGalao = sale.productId === 'prod-7' || productName.toLowerCase().includes('galão') || productName.toLowerCase().includes('galao');
    
    let commissionAmount = 0;
    if (isGalao && sale.unitPrice > 10.00) {
      commissionAmount = sale.quantity * 1.00;
    }

    const newSale: Sale = { 
      ...sale, 
      id, 
      commission: commissionAmount 
    };

    setState(s => {
      const nextSales = [...s.sales, newSale];
      const nextVouchers = [...s.vouchers];
      
      // If commission earned, add automated voucher earning
      if (commissionAmount > 0) {
        nextVouchers.push({
          id: 'vouc-' + crypto.randomUUID().slice(0, 8),
          employeeId: sale.deliveryPersonId,
          type: 'commission_earn',
          amount: commissionAmount,
          date: new Date().toISOString(),
          description: `Comissão Automática - ${sale.quantity}x ${productName} (Pedido #${id.slice(0,8)})`
        });
      }

      return {
        ...s,
        sales: nextSales,
        vouchers: nextVouchers
      };
    });
  };

  const updateSaleStatus = (id: string, status: 'pending' | 'delivered' | 'canceled') => {
    setState(s => ({
      ...s,
      sales: s.sales.map(sl => sl.id === id ? { ...sl, status } : sl)
    }));
  };

  const deleteSale = (id: string) => {
    // Soft Delete
    setState(s => ({
      ...s,
      sales: s.sales.map(sl => sl.id === id ? { ...sl, deletedAt: new Date().toISOString(), status: 'canceled' as const } : sl)
    }));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: 'exp-' + crypto.randomUUID().slice(0, 8) };
    setState(s => ({ ...s, expenses: [...s.expenses, newExpense] }));
  };

  const deleteExpense = (id: string) => {
    // Soft Delete
    setState(s => ({
      ...s,
      expenses: s.expenses.map(e => e.id === id ? { ...e, deletedAt: new Date().toISOString() } : e)
    }));
  };

  const addSector = (sector: Omit<Sector, 'id'>) => {
    const newSector: Sector = { ...sector, id: 'sec-' + crypto.randomUUID().slice(0, 8) };
    setState(s => ({ ...s, sectors: [...s.sectors, newSector] }));
  };

  const addDeliveryPerson = (person: Omit<DeliveryPerson, 'id'>) => {
    const newPerson: DeliveryPerson = { ...person, id: 'dp-' + crypto.randomUUID().slice(0, 8) };
    setState(s => ({ ...s, deliveryPersons: [...s.deliveryPersons, newPerson] }));
  };

  const updateDeliveryPerson = (person: DeliveryPerson) => {
    setState(s => ({
      ...s,
      deliveryPersons: s.deliveryPersons.map(p => p.id === person.id ? person : p)
    }));
  };

  const deleteDeliveryPerson = (id: string) => {
    setState(s => ({
      ...s,
      deliveryPersons: s.deliveryPersons.filter(p => p.id !== id)
    }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: 'prod-' + crypto.randomUUID().slice(0, 8) };
    setState(s => ({ ...s, products: [...s.products, newProduct] }));
  };

  const updateProduct = (product: Product) => {
    setState(s => ({
      ...s,
      products: s.products.map(p => p.id === product.id ? product : p)
    }));
  };

  const deleteProduct = (id: string) => {
    // Soft Delete
    setState(s => ({
      ...s,
      products: s.products.map(p => p.id === id ? { ...p, deletedAt: new Date().toISOString() } : p)
    }));
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = { ...vehicle, id: 'veh-' + crypto.randomUUID().slice(0, 8) };
    setState(s => ({ ...s, vehicles: [...s.vehicles, newVehicle] }));
  };

  const updateVehicle = (vehicle: Vehicle) => {
    setState(s => ({
      ...s,
      vehicles: s.vehicles.map(v => v.id === vehicle.id ? vehicle : v)
    }));
  };

  const deleteVehicle = (id: string) => {
    // Soft Delete
    setState(s => ({
      ...s,
      vehicles: s.vehicles.map(v => v.id === id ? { ...v, deletedAt: new Date().toISOString() } : v)
    }));
  };

  const addFleetExpense = (expense: Omit<FleetExpense, 'id'>) => {
    const newExpense: FleetExpense = { ...expense, id: 'fe-' + crypto.randomUUID().slice(0, 8) };
    setState(s => ({ ...s, fleetExpenses: [...s.fleetExpenses, newExpense] }));
  };

  const deleteFleetExpense = (id: string) => {
    // Soft Delete
    setState(s => ({
      ...s,
      fleetExpenses: s.fleetExpenses.map(fe => fe.id === id ? { ...fe, deletedAt: new Date().toISOString() } : fe)
    }));
  };

  const addVoucher = (voucher: Omit<CommissionVoucher, 'id'>) => {
    const newVoucher: CommissionVoucher = { ...voucher, id: 'vouc-' + crypto.randomUUID().slice(0, 8) };
    setState(s => ({ ...s, vouchers: [...s.vouchers, newVoucher] }));
  };

  const updateVoucher = (voucher: CommissionVoucher) => {
    setState(s => ({
      ...s,
      vouchers: s.vouchers.map(v => v.id === voucher.id ? voucher : v)
    }));
  };

  const deleteVoucher = (id: string) => {
    // Soft Delete
    setState(s => ({
      ...s,
      vouchers: s.vouchers.map(v => v.id === id ? { ...v, deletedAt: new Date().toISOString() } : v)
    }));
  };

  const weeklyClosure = (employeeId: string) => {
    // Perform a weekly closure for this employee:
    // This resolves all earnings and vouchers to date.
    const employeeVouchers = state.vouchers.filter(v => v.employeeId === employeeId && !v.deletedAt);
    const earned = employeeVouchers.filter(v => v.type === 'commission_earn').reduce((sum, v) => sum + v.amount, 0);
    const withdrawn = employeeVouchers.filter(v => v.type === 'voucher_withdraw').reduce((sum, v) => sum + v.amount, 0);
    const consumption = employeeVouchers.filter(v => v.type === 'consumption_debit').reduce((sum, v) => sum + v.amount, 0);
    const debits = employeeVouchers.filter(v => v.type === 'other_debit').reduce((sum, v) => sum + v.amount, 0);
    const paid = employeeVouchers.filter(v => v.type === 'weekly_payment').reduce((sum, v) => sum + v.amount, 0);
    const balance = earned - (withdrawn + consumption + debits + paid);

    if (balance <= 0) return;

    const deliveryPersonName = state.deliveryPersons.find(d => d.id === employeeId)?.name || 'Colaborador';

    const closureId = 'vouc-' + crypto.randomUUID().slice(0, 8);
    const newVoucher: CommissionVoucher = {
      id: closureId,
      employeeId,
      type: 'weekly_payment',
      amount: balance,
      date: new Date().toISOString(),
      description: `Fechamento Semanal (Acerto Pago) - ${deliveryPersonName}`
    };

    // Also register an actual corporate expense for the corporate division math
    const expenseId = 'exp-' + crypto.randomUUID().slice(0, 8);
    const newExpense: Expense = {
      id: expenseId,
      description: `Fechamento Semanal - ${deliveryPersonName}`,
      amount: balance,
      date: new Date().toISOString(),
      category: 'Comissões/Vales Pagos'
    };

    setState(s => ({
      ...s,
      vouchers: [...s.vouchers, newVoucher],
      expenses: [...s.expenses, newExpense]
    }));
  };

  const completeWeeklyPayment = (employeeId: string, totalToReceive: number, debtAmount: number) => {
    const deliveryPersonName = state.deliveryPersons.find(d => d.id === employeeId)?.name || 'Colaborador';
    
    setState(s => {
      // 1. Soft-delete all active vouchers for this employee
      const updatedVouchers = s.vouchers.map(v => 
        v.employeeId === employeeId && !v.deletedAt 
          ? { ...v, deletedAt: new Date().toISOString() } 
          : v
      );

      // 2. Add corporate expense if we paid them (totalToReceive > 0)
      const updatedExpenses = [...s.expenses];
      if (totalToReceive > 0) {
        updatedExpenses.push({
          id: 'exp-' + crypto.randomUUID().slice(0, 8),
          description: `Acerto Semanal Pago - ${deliveryPersonName}`,
          amount: totalToReceive,
          date: new Date().toISOString(),
          category: 'Comissões/Vales Pagos'
        });
      }

      // 3. Add carry-forward debit voucher if there was a debt
      if (debtAmount > 0) {
        updatedVouchers.push({
          id: 'vouc-' + crypto.randomUUID().slice(0, 8),
          employeeId: employeeId,
          type: 'other_debit',
          amount: debtAmount,
          date: new Date().toISOString(),
          description: `Saldo Devedor Carregado da Semana Anterior (Fechamento: R$ -${debtAmount.toFixed(2)})`
        });
      }

      return {
        ...s,
        vouchers: updatedVouchers,
        expenses: updatedExpenses
      };
    });
  };

  const updatePartner = (partner: Partner) => {
    setState(s => ({
      ...s,
      partners: s.partners.map(p => p.id === partner.id ? partner : p)
    }));
  };

  const resetAllData = () => {
    setState({
      clients: INITIAL_CLIENTS,
      sectors: DEFAULT_SECTORS,
      deliveryPersons: INITIAL_DELIVERY_PERSONS,
      products: INITIAL_PRODUCTS,
      sales: INITIAL_SALES,
      expenses: INITIAL_EXPENSES,
      vehicles: INITIAL_VEHICLES,
      fleetExpenses: INITIAL_FLEET_EXPENSES,
      vouchers: INITIAL_VOUCHERS,
      partners: INITIAL_PARTNERS,
    });
  };

  return (
    <AppContext.Provider value={{
      ...state,
      addClient,
      updateClient,
      deleteClient,
      addSale,
      updateSaleStatus,
      deleteSale,
      addExpense,
      deleteExpense,
      addSector,
      addDeliveryPerson,
      updateDeliveryPerson,
      deleteDeliveryPerson,
      addProduct,
      updateProduct,
      deleteProduct,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addFleetExpense,
      deleteFleetExpense,
      addVoucher,
      updateVoucher,
      deleteVoucher,
      weeklyClosure,
      completeWeeklyPayment,
      updatePartner,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
