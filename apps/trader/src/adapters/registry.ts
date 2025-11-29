import { MockLiveAdapter, type LiveTradingAdapter } from '@mmtrader/core';

const registry: LiveTradingAdapter[] = [new MockLiveAdapter()];

export const listAdapters = (): LiveTradingAdapter[] => registry;

