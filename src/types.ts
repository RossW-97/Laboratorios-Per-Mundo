export interface Product {
  id: number;
  species: string;
  variety: string;
  biotization_type: string;
  senasa_cert: string;
  stock_in_vitro: number;
  growth_speed: string;
  base_price: number;
  region: string;
}

export interface TraceabilityLog {
  id: number;
  order_id: number;
  lote_id: string;
  stage: string;
  description: string;
  timestamp: string;
  status: string;
  species: string;
  variety: string;
  senasa_cert: string;
}

export interface OrderResponse {
  orderId: number;
  loteId: string;
  totalPrice: number;
  estimatedDelivery: string;
  message: string;
}
