export interface LiveAdapterContext {
  apiKey?: string;
  secret?: string;
  baseUrl?: string;
}

export interface OrderTicket {
  symbol: string;
  quantity: number;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  limitPrice?: number;
}

export interface LiveTradingAdapter {
  readonly venue: string;
  connect(ctx: LiveAdapterContext): Promise<void>;
  disconnect(): Promise<void>;
  submitOrder(ticket: OrderTicket): Promise<string>;
}

export class MockLiveAdapter implements LiveTradingAdapter {
  readonly venue = 'mock';

  async connect(): Promise<void> {
    return;
  }

  async disconnect(): Promise<void> {
    return;
  }

  async submitOrder(): Promise<string> {
    return `mock-${Date.now()}`;
  }
}

