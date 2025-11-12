/**
 * 암호화폐 관련 타입 정의
 */

export interface CoinData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  logo: string;
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface ROIStats {
  maxROI: {
    date: string;
    amount: number;
    percentage: number;
  };
  minROI: {
    date: string;
    amount: number;
    percentage: number;
  };
  averageROI: number;
  totalInvestment: number;
  currentValue: number;
}

export type TimeFrame = '1H' | '24H' | '7D' | '1M' | '1Y';

export interface CoinDetailData extends CoinData {
  roiStats: ROIStats;
  detailedChartData: {
    [key in TimeFrame]: ChartDataPoint[];
  };
}
