/**
 * CoinCard Molecule
 * 개별 코인 카드 컴포넌트
 */

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { CoinData } from '../../../types/crypto';

interface CoinCardProps {
  coin: CoinData;
  onClick: () => void;
  className?: string;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, onClick, className }) => {
  const isPositive = coin.priceChangePercentage24h >= 0;

  return (
    <CardContainer
      as={motion.div}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={className}
      layoutId={`card-${coin.id}`}
    >
      <CardHeader>
        <CoinLogo>{coin.logo}</CoinLogo>
        <CoinInfo>
          <CoinName>{coin.name}</CoinName>
          <CoinSymbol>{coin.symbol}</CoinSymbol>
        </CoinInfo>
      </CardHeader>

      <PriceSection>
        <CurrentPrice>
          ${coin.currentPrice.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </CurrentPrice>
        <PriceChange $isPositive={isPositive}>
          <ChangeIcon>{isPositive ? '↑' : '↓'}</ChangeIcon>
          {Math.abs(coin.priceChangePercentage24h).toFixed(2)}%
        </PriceChange>
      </PriceSection>

      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={coin.chartData}>
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContainer>
  );
};

export default CoinCard;

// Styled Components
const CardContainer = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 640px) {
    padding: 1.5rem;
    gap: 1rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CoinLogo = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #627eea 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px rgba(98, 126, 234, 0.3);

  @media (max-width: 640px) {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }
`;

const CoinInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CoinName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

const CoinSymbol = styled.p`
  font-size: 1rem;
  color: #6b7280;
  opacity: 0.7;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 0.875rem;
  }
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CurrentPrice = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  font-family: 'Courier New', monospace;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

const PriceChange = styled.span<{ $isPositive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  color: ${(props) => (props.$isPositive ? '#10b981' : '#ef4444')};

  @media (max-width: 640px) {
    font-size: 0.875rem;
  }
`;

const ChangeIcon = styled.span`
  font-size: 0.875rem;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 60px;
  margin-top: auto;
`;
