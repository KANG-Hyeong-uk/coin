/**
 * 목업 데이터 생성 유틸리티
 */

import { CoinData, ChartDataPoint, TimeFrame, CoinDetailData, ROIStats } from '../types/crypto';

// 차트 데이터 생성 함수
const generateChartData = (
  basePrice: number,
  points: number,
  volatility: number = 0.05
): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = Date.now();
  let currentPrice = basePrice;

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
    currentPrice += change;

    data.push({
      timestamp: now - (points - i) * 3600000, // 1시간 간격
      price: Math.max(currentPrice, basePrice * 0.5), // 최소 50% 가격 유지
      volume: Math.random() * 1000000000,
    });
  }

  return data;
};

// ROI 통계 생성
const generateROIStats = (coinName: string): ROIStats => {
  const totalInvestment = Math.random() * 50000 + 10000;
  const currentValue = totalInvestment * (0.8 + Math.random() * 1.5);

  return {
    maxROI: {
      date: new Date(Date.now() - Math.random() * 365 * 24 * 3600000).toISOString().split('T')[0],
      amount: currentValue * 1.3,
      percentage: 130 + Math.random() * 100,
    },
    minROI: {
      date: new Date(Date.now() - Math.random() * 365 * 24 * 3600000).toISOString().split('T')[0],
      amount: totalInvestment * 0.6,
      percentage: -40 - Math.random() * 20,
    },
    averageROI: ((currentValue - totalInvestment) / totalInvestment) * 100,
    totalInvestment,
    currentValue,
  };
};

// 코인 목업 데이터
export const MOCK_COINS: CoinData[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    currentPrice: 67842.35,
    priceChange24h: 1234.56,
    priceChangePercentage24h: 1.85,
    logo: '₿',
    chartData: generateChartData(67842.35, 24),
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    currentPrice: 3456.78,
    priceChange24h: -87.92,
    priceChangePercentage24h: -2.48,
    logo: 'Ξ',
    chartData: generateChartData(3456.78, 24),
  },
  {
    id: 'ripple',
    name: 'Ripple',
    symbol: 'XRP',
    currentPrice: 0.5678,
    priceChange24h: 0.0234,
    priceChangePercentage24h: 4.31,
    logo: 'XRP',
    chartData: generateChartData(0.5678, 24),
  },
  {
    id: 'luna',
    name: 'Terra Luna',
    symbol: 'LUNA',
    currentPrice: 98.45,
    priceChange24h: 5.67,
    priceChangePercentage24h: 6.11,
    logo: 'LUNA',
    chartData: generateChartData(98.45, 24),
  },
];

// 상세 데이터 생성 함수
export const generateDetailedCoinData = (coin: CoinData): CoinDetailData => {
  return {
    ...coin,
    roiStats: generateROIStats(coin.name),
    detailedChartData: {
      '1H': generateChartData(coin.currentPrice, 60),
      '24H': generateChartData(coin.currentPrice, 24),
      '7D': generateChartData(coin.currentPrice, 168),
      '1M': generateChartData(coin.currentPrice, 720),
      '1Y': generateChartData(coin.currentPrice, 8760),
    },
  };
};

// 실시간 가격 업데이트 시뮬레이션
export const updateCoinPrice = (coin: CoinData): CoinData => {
  const change = (Math.random() - 0.5) * 0.02 * coin.currentPrice;
  const newPrice = coin.currentPrice + change;
  const priceChange24h = change;
  const priceChangePercentage24h = (change / coin.currentPrice) * 100;

  return {
    ...coin,
    currentPrice: newPrice,
    priceChange24h,
    priceChangePercentage24h,
  };
};
