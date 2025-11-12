/**
 * Navigation Organism
 * 상단 네비게이션 바 컴포넌트
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', path: '/', type: 'route' },
    { label: 'Past ROI', path: '#roi', type: 'scroll' },
    { label: '매매 일지', path: '#journal', type: 'scroll' },
    { label: '시뮬레이터', path: '#simulator', type: 'scroll' },
    { label: '차트 보기', path: '/charts', type: 'route' },
  ];

  const handleScrollToSection = (hash: string) => {
    if (location.pathname !== '/') {
      return; // 메인 페이지가 아니면 스크롤 안함
    }

    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NavContainer
      as={motion.nav}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      $isScrolled={isScrolled}
      className={className}
    >
      <NavContent>
        <Logo as={Link} to="/">
          <LogoIcon>₿</LogoIcon>
          <LogoText>CryptoPortfolio</LogoText>
        </Logo>

        <MenuList>
          {menuItems.map((item) => (
            <MenuItem key={item.label}>
              {item.type === 'route' ? (
                <MenuLink as={Link} to={item.path}>
                  {item.label}
                </MenuLink>
              ) : (
                <MenuLink
                  as="a"
                  href={item.path}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    handleScrollToSection(item.path);
                  }}
                >
                  {item.label}
                </MenuLink>
              )}
            </MenuItem>
          ))}
        </MenuList>
      </NavContent>
    </NavContainer>
  );
};

export default Navigation;

// Styled Components
const NavContainer = styled.nav<{ $isScrolled: boolean }>`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100;
  background: ${(props) =>
    props.$isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid
    ${(props) => (props.$isScrolled ? 'rgba(0, 0, 0, 0.1)' : 'transparent')};
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.$isScrolled ? '0 2px 12px rgba(0, 0, 0, 0.08)' : 'none'};
`;

const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #627eea;
  text-shadow: 0 2px 4px rgba(98, 126, 234, 0.2);
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const MenuList = styled.ul`
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`;

const MenuItem = styled.li`
  position: relative;
`;

const MenuLink = styled.a`
  color: #4a4a4a;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #627eea;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #627eea;

    &::after {
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    font-size: 0.875rem;
  }
`;
