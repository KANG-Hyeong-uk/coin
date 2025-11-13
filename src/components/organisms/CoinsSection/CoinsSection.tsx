/**
 * CoinsSection Organism
 * 코인 그리드 섹션 - 4개의 코인 카드를 2x2 그리드로 배치
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CoinCard } from '../../molecules/CoinCard';
import { HistoricalROIModal } from '../HistoricalROIModal';
import { MOCK_COINS, HISTORICAL_DATA } from '../../../utils/mockData';
import { CoinData, HistoricalInvestment } from '../../../types/crypto';

interface CoinsSectionProps {
  className?: string;
}

const CoinsSection: React.FC<CoinsSectionProps> = ({ className }) => {
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [selectedHistoricalData, setSelectedHistoricalData] = useState<HistoricalInvestment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCoinClick = (coin: CoinData) => {
    const historicalData = HISTORICAL_DATA[coin.id];
    setSelectedCoin(coin);
    setSelectedHistoricalData(historicalData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // 모달 닫히는 애니메이션이 끝난 후 데이터 초기화
    setTimeout(() => {
      setSelectedCoin(null);
      setSelectedHistoricalData(null);
    }, 300);
  };

  return (
    <>
      <SectionContainer id="roi" className={className}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <SectionTitle>Popular Cryptocurrencies</SectionTitle>
        </motion.div>

        <CoinsGrid>
          {MOCK_COINS.map((coin, index) => (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CoinCard coin={coin} onClick={() => handleCoinClick(coin)} />
            </motion.div>
          ))}
        </CoinsGrid>
      </SectionContainer>

      <HistoricalROIModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        coinData={selectedCoin}
        historicalData={selectedHistoricalData}
      />
    </>
  );
};

export default CoinsSection;

// Styled Components
const SectionContainer = styled.section`
  padding: 4rem 2rem;
  background: transparent;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  font-family: 'Poppins', sans-serif;
  text-align: center;
  background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 3rem 0;
  letter-spacing: -0.03em;
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));

  @media (max-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.875rem;
  }
`;

const CoinsGrid = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;
