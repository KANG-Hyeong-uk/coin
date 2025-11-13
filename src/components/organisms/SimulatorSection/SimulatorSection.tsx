/**
 * SimulatorSection Organism
 * 암호화폐 시뮬레이터 섹션 컴포넌트
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface Market {
  code: string;
  name: string;
}

interface BacktestResult {
  success: boolean;
  market: string;
  data_period: {
    start: string;
    end: string;
    days: number;
  };
  metrics: {
    initial_capital: number;
    final_value: number;
    total_return: number;
    buy_hold_return: number;
    num_trades: number;
    win_rate: number;
    max_drawdown: number;
    sharpe_ratio: number;
    uptrend_probability: number;
  };
  chart_image: string;
  signals: {
    buy_count: number;
    sell_count: number;
  };
}

interface SimulatorSectionProps {
  className?: string;
}

const AVAILABLE_MARKETS: Market[] = [
  { code: 'KRW-BTC', name: '비트코인 (BTC)' },
  { code: 'KRW-ETH', name: '이더리움 (ETH)' },
  { code: 'KRW-XRP', name: '리플 (XRP)' },
  { code: 'KRW-ADA', name: '에이다 (ADA)' },
  { code: 'KRW-DOT', name: '폴카닷 (DOT)' },
  { code: 'KRW-LINK', name: '체인링크 (LINK)' },
  { code: 'KRW-LTC', name: '라이트코인 (LTC)' },
  { code: 'KRW-BCH', name: '비트코인 캐시 (BCH)' },
];

const SimulatorSection: React.FC<SimulatorSectionProps> = ({ className }) => {
  const [selectedMarket, setSelectedMarket] = useState('KRW-BTC');
  const [days, setDays] = useState(500);
  const [initialCapital, setInitialCapital] = useState(10000000);
  const [useApi, setUseApi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunBacktest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5001/api/backtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          market: selectedMarket,
          days: days,
          initial_capital: initialCapital,
          use_api: useApi,
        }),
      });

      if (!response.ok) {
        throw new Error('백테스팅 실행 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('ko-KR') + '원';
  };

  const formatPercentage = (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <SectionContainer id="simulator" className={className}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <SectionTitle>암호화폐 백테스팅 시뮬레이터</SectionTitle>
        <SectionSubtitle>
          과거 데이터로 매매 전략의 성과를 시뮬레이션해보세요
        </SectionSubtitle>
      </motion.div>

      <ContentWrapper>
        {/* 설정 패널 */}
        <ControlPanel
          as={motion.div}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <PanelTitle>시뮬레이션 설정</PanelTitle>

          <FormGroup>
            <Label>암호화폐 선택</Label>
            <Select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
            >
              {AVAILABLE_MARKETS.map((market) => (
                <option key={market.code} value={market.code}>
                  {market.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>시뮬레이션 기간 (일)</Label>
            <Input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              min="30"
              max="1000"
            />
          </FormGroup>

          <FormGroup>
            <Label>초기 자본 (원)</Label>
            <Input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              min="1000000"
              step="1000000"
            />
            <HintText>{formatCurrency(initialCapital)}</HintText>
          </FormGroup>

          <FormGroup>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                checked={useApi}
                onChange={(e) => setUseApi(e.target.checked)}
                id="use-api"
              />
              <CheckboxLabel htmlFor="use-api">
                실시간 API 데이터 사용 (느릴 수 있음)
              </CheckboxLabel>
            </CheckboxContainer>
          </FormGroup>

          <RunButton
            as={motion.button}
            onClick={handleRunBacktest}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? '시뮬레이션 실행 중...' : '시뮬레이션 실행'}
          </RunButton>
        </ControlPanel>

        {/* 결과 패널 */}
        <ResultPanel
          as={motion.div}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isLoading && (
            <LoadingContainer>
              <Spinner />
              <LoadingText>백테스팅 실행 중...</LoadingText>
            </LoadingContainer>
          )}

          {error && (
            <ErrorContainer>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorText>{error}</ErrorText>
              <ErrorHint>
                백엔드 서버가 실행 중인지 확인해주세요. (포트: 5001)
              </ErrorHint>
            </ErrorContainer>
          )}

          {!isLoading && !error && !result && (
            <PlaceholderContainer>
              <PlaceholderIcon>📊</PlaceholderIcon>
              <PlaceholderText>
                시뮬레이션을 실행하여 결과를 확인하세요
              </PlaceholderText>
            </PlaceholderContainer>
          )}

          {result && !isLoading && !error && (
            <>
              <ResultTitle>시뮬레이션 결과</ResultTitle>

              {/* 기간 정보 */}
              <InfoCard>
                <InfoLabel>분석 기간</InfoLabel>
                <InfoValue>
                  {result.data_period.start} ~ {result.data_period.end}
                  <InfoSmall> ({result.data_period.days}일)</InfoSmall>
                </InfoValue>
              </InfoCard>

              {/* 수익률 카드 */}
              <MetricsGrid>
                <MetricCard $highlight>
                  <MetricLabel>총 수익률</MetricLabel>
                  <MetricValue $positive={result.metrics.total_return >= 0}>
                    {formatPercentage(result.metrics.total_return)}
                  </MetricValue>
                  <MetricSubtext>
                    {formatCurrency(result.metrics.initial_capital)} →{' '}
                    {formatCurrency(result.metrics.final_value)}
                  </MetricSubtext>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>Buy & Hold 수익률</MetricLabel>
                  <MetricValue $positive={result.metrics.buy_hold_return >= 0}>
                    {formatPercentage(result.metrics.buy_hold_return)}
                  </MetricValue>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>승률</MetricLabel>
                  <MetricValue $positive={result.metrics.win_rate >= 50}>
                    {result.metrics.win_rate.toFixed(2)}%
                  </MetricValue>
                  <MetricSubtext>{result.metrics.num_trades}회 거래</MetricSubtext>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>상승 확률</MetricLabel>
                  <MetricValue $positive={result.metrics.uptrend_probability >= 50}>
                    {result.metrics.uptrend_probability.toFixed(2)}%
                  </MetricValue>
                  <MetricSubtext>현재 시점 기준</MetricSubtext>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>최대 낙폭 (MDD)</MetricLabel>
                  <MetricValue $negative>
                    -{result.metrics.max_drawdown.toFixed(2)}%
                  </MetricValue>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>Sharpe Ratio</MetricLabel>
                  <MetricValue>{result.metrics.sharpe_ratio.toFixed(2)}</MetricValue>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>매수 신호</MetricLabel>
                  <MetricValue>{result.signals.buy_count}회</MetricValue>
                </MetricCard>

                <MetricCard>
                  <MetricLabel>매도 신호</MetricLabel>
                  <MetricValue>{result.signals.sell_count}회</MetricValue>
                </MetricCard>
              </MetricsGrid>

              {/* 차트 이미지 */}
              <ChartContainer>
                <ChartImage
                  src={`data:image/png;base64,${result.chart_image}`}
                  alt="백테스팅 차트"
                />
              </ChartContainer>
            </>
          )}
        </ResultPanel>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default SimulatorSection;

// Styled Components
const SectionContainer = styled.section`
  padding: 4rem 2rem;
  background: transparent;
  min-height: 100vh;
  position: relative;

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
  margin: 0 0 1rem 0;
  letter-spacing: -0.03em;
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.875rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  text-align: center;
  color: #94a3b8;
  margin: 0 0 3rem 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ControlPanel = styled.div`
  background: rgba(26, 33, 66, 0.7);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  height: fit-content;
  position: sticky;
  top: 100px;

  @media (max-width: 1024px) {
    position: static;
  }

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const PanelTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  color: #f8fafc;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.5rem;
  letter-spacing: 0.01em;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  color: #f8fafc;
  background: rgba(15, 21, 53, 0.6);
  font-family: 'SF Mono', 'Fira Code', monospace;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: rgba(15, 21, 53, 0.8);
  }

  &:disabled {
    background: rgba(15, 21, 53, 0.3);
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  color: #f8fafc;
  background: rgba(15, 21, 53, 0.6);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: rgba(15, 21, 53, 0.8);
  }

  option {
    background: #0f1535;
    color: #f8fafc;
  }
`;

const HintText = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0.5rem 0 0 0;
  font-family: 'SF Mono', 'Fira Code', monospace;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #cbd5e1;
  cursor: pointer;
  user-select: none;
`;

const RunButton = styled.button`
  width: 100%;
  padding: 1.125rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2);
  letter-spacing: 0.01em;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5), 0 0 60px rgba(16, 185, 129, 0.2);
    transform: translateY(-2px);

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #475569 0%, #334155 100%);
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.6;
  }
`;

const ResultPanel = styled.div`
  background: rgba(26, 33, 66, 0.7);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  min-height: 400px;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1.5rem;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #627eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
`;

const ErrorText = styled.p`
  font-size: 1.125rem;
  color: #ef4444;
  font-weight: 600;
  margin: 0;
`;

const ErrorHint = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
`;

const PlaceholderIcon = styled.div`
  font-size: 4rem;
`;

const PlaceholderText = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 500;
`;

const ResultTitle = styled.h3`
  font-size: 1.875rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  color: #f8fafc;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
`;

const InfoCard = styled.div`
  background: rgba(15, 21, 53, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

const InfoLabel = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
`;

const InfoValue = styled.p`
  font-size: 1rem;
  font-weight: 600;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #f8fafc;
  margin: 0;
`;

const InfoSmall = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div<{ $highlight?: boolean }>`
  background: ${(props) =>
    props.$highlight
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(15, 21, 53, 0.6)'};
  backdrop-filter: blur(8px);
  padding: 1.25rem;
  border-radius: 12px;
  border: ${(props) =>
    props.$highlight
      ? '1px solid rgba(59, 130, 246, 0.4)'
      : '1px solid rgba(148, 163, 184, 0.1)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${(props) =>
      props.$highlight
        ? 'rgba(59, 130, 246, 0.6)'
        : 'rgba(148, 163, 184, 0.2)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }
`;

const MetricLabel = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  letter-spacing: 0.01em;
`;

const MetricValue = styled.p<{
  $positive?: boolean;
  $negative?: boolean;
}>`
  font-size: 1.75rem;
  font-weight: 800;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: ${(props) =>
    props.$positive
      ? '#10b981'
      : props.$negative
      ? '#ef4444'
      : '#f8fafc'};
  margin: 0;
  text-shadow: ${(props) =>
    props.$positive
      ? '0 0 12px rgba(16, 185, 129, 0.5)'
      : props.$negative
      ? '0 0 12px rgba(239, 68, 68, 0.5)'
      : 'none'};
`;

const MetricSubtext = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
`;

const ChartContainer = styled.div`
  margin-top: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ChartImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;
