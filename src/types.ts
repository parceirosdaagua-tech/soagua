export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  sectorId: string;
  deletedAt?: string | null;
}

export interface Sector {
  id: string;
  name: string;
  city: string;
  deliveryFee: number;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive';
  number: number;
  weeklySalary?: number;
  deletedAt?: string | null;
}

export interface Product {
  id: string;
  name: string;
  unitCost: number;
  priceVarejoVista: number;
  priceVarejoPrazo: number;
  priceAtacadoVista: number;
  priceAtacadoPrazo: number;
  fardoCost?: number;
  fardoQuantity?: number;
  deletedAt?: string | null;
}

export interface Sale {
  id: string;
  clientId: string;
  deliveryPersonId: string;
  productId: string;
  quantity: number;
  priceType: 'varejo_vista' | 'varejo_prazo' | 'atacado_vista' | 'atacado_prazo';
  unitPrice: number;
  unitCost: number;
  deliveryFee: number;
  totalAmount: number;
  totalCost: number;
  commission: number;
  profit: number;
  date: string;
  status: 'pending' | 'delivered' | 'canceled';
  deletedAt?: string | null;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  deletedAt?: string | null;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: 'truck' | 'car' | 'motorcycle';
  model: string;
  deletedAt?: string | null;
}

export interface FleetExpense {
  id: string;
  vehicleId: string;
  type: 'fuel' | 'maintenance' | 'other';
  amount: number;
  date: string;
  description: string;
  deletedAt?: string | null;
}

export interface CommissionVoucher {
  id: string;
  employeeId: string;
  type: 'commission_earn' | 'voucher_withdraw' | 'consumption_debit' | 'other_debit' | 'weekly_payment';
  amount: number;
  date: string;
  description: string;
  deletedAt?: string | null;
}

export interface Partner {
  id: string;
  name: string;
  sharePercentage: number;
}

export interface AppState {
  clients: Client[];
  sectors: Sector[];
  deliveryPersons: DeliveryPerson[];
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  vehicles: Vehicle[];
  fleetExpenses: FleetExpense[];
  vouchers: CommissionVoucher[];
  partners: Partner[];
}
