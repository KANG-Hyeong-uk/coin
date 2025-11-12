# 🏗️ 아키텍처 설계 문서

이 문서는 프로젝트의 전체 아키텍처와 설계 결정 사항을 설명합니다.

1.주식 차트 섹션 하나 옮기기
2.버튼 하나 더 만들어서 시뮬레이션 창 만들기
3.내 포지션 나오게 하기
4.업비트 api 문서화



## 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [Atomic Design 패턴](#atomic-design-패턴)
3. [스타일링 전략](#스타일링-전략)
4. [타입 시스템](#타입-시스템)
5. [상태 관리](#상태-관리)
6. [API 레이어](#api-레이어)
7. [성능 최적화](#성능-최적화)
8. [보안](#보안)

---

## 아키텍처 개요

### 전체 구조

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                │
│  (Pages → Templates → Organisms → Molecules │
│             → Atoms)                         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────┴───────────────────────────┐
│          Business Logic Layer               │
│  (Custom Hooks, Services, Utils)            │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────┴───────────────────────────┐
│            Data Layer                       │
│  (React Query, Axios, State Management)     │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────┴───────────────────────────┐
│            External APIs                    │
│  (REST API, GraphQL, etc.)                  │
└─────────────────────────────────────────────┘
```

### 설계 원칙

1. **관심사의 분리 (Separation of Concerns)**
   - 각 레이어는 명확한 책임을 가짐
   - 컴포넌트는 UI 렌더링에만 집중
   - 비즈니스 로직은 커스텀 훅과 서비스 레이어에서 처리

2. **단일 책임 원칙 (Single Responsibility Principle)**
   - 각 컴포넌트는 하나의 역할만 수행
   - 함수는 하나의 작업만 수행

3. **의존성 역전 원칙 (Dependency Inversion Principle)**
   - 상위 레벨 모듈은 하위 레벨 모듈에 의존하지 않음
   - 둘 다 추상화에 의존

4. **개방-폐쇄 원칙 (Open-Closed Principle)**
   - 확장에는 열려있고, 수정에는 닫혀있음
   - Props를 통한 컴포넌트 커스터마이징

---

## Atomic Design 패턴

### 계층 구조

```
Atoms (원자)
  ↓
Molecules (분자)
  ↓
Organisms (유기체)
  ↓
Templates (템플릿)
  ↓
Pages (페이지)
```

### 1. Atoms (원자)

**정의**: UI의 가장 작은 단위, 더 이상 분해할 수 없는 컴포넌트

**예시**:
- Button
- Input
- Label
- Icon
- Badge
- Avatar

**특징**:
- Props로 완전히 제어 가능
- 상태를 최소화 (가능한 stateless)
- 재사용성 극대화
- 디자인 시스템의 기본 빌딩 블록

**코드 예시**:
```tsx
// ✅ Good: 순수한 Atom
<Button variant="solid" color="primary" size="md">
  클릭
</Button>

// ❌ Bad: 너무 많은 책임
<Button onClick={handleComplexLogic} fetchData={...}>
  복잡한 버튼
</Button>
```

### 2. Molecules (분자)

**정의**: 2개 이상의 Atoms를 조합한 단순한 컴포넌트 그룹

**예시**:
- FormField (Label + Input + ErrorMessage)
- SearchBar (Input + Button)
- CardHeader (Avatar + Title + Subtitle)

**특징**:
- 특정 기능을 수행하는 최소 단위
- Atoms의 조합
- 간단한 상태 관리 가능

**코드 예시**:
```tsx
// src/components/molecules/FormField/FormField.tsx
export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  children
}) => {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && <HelperText>{helperText}</HelperText>}
    </div>
  );
};
```

### 3. Organisms (유기체)

**정의**: Molecules와 Atoms를 조합한 복잡한 컴포넌트

**예시**:
- Header (Logo + Navigation + SearchBar + UserMenu)
- ProductCard (Image + Title + Price + Button)
- CommentSection (CommentList + CommentForm)

**특징**:
- 독립적으로 기능하는 UI 섹션
- 비즈니스 로직 포함 가능
- 컨텍스트나 훅을 통한 데이터 연동

### 4. Templates (템플릿)

**정의**: 페이지 레이아웃 구조, 데이터가 없는 와이어프레임

**예시**:
- DashboardLayout
- AuthLayout
- ContentLayout

**특징**:
- 페이지의 뼈대
- 실제 데이터 없이 구조만 정의
- 재사용 가능한 레이아웃

### 5. Pages (페이지)

**정의**: 실제 데이터가 주입된 완성된 페이지

**예시**:
- HomePage
- ProductDetailPage
- UserProfilePage

**특징**:
- 라우팅의 대상
- API 호출 및 데이터 페칭
- 실제 컨텐츠 렌더링

---

## 스타일링 전략

### 혼합 전략의 이유

각 스타일링 방법은 특정 상황에서 최적의 성능을 발휘합니다:

| 방법 | 사용 케이스 | 장점 | 단점 |
|------|-------------|------|------|
| **Styled-components** | 동적 스타일링 필요 시 | Props 기반 스타일, 테마 접근 용이 | 번들 크기 증가, 런타임 오버헤드 |
| **CSS Modules** | 스코프 격리 중요 시 | 전통적 CSS, 빌드 타임 처리 | 동적 스타일링 어려움 |
| **Tailwind CSS** | 레이아웃, 유틸리티 | 빠른 개발, 일관성 | 클래스명 길어짐 |

### 사용 가이드라인

#### Styled-components 사용

```tsx
// ✅ 사용: 동적 props 기반 스타일링
const Button = styled.button<{ $primary: boolean }>`
  background: ${props => props.$primary ? 'blue' : 'gray'};
  color: ${props => props.theme.colors.text};
`;

// ✅ 사용: 복잡한 호버, 애니메이션
const Card = styled.div`
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

// ❌ 피할 것: 정적 스타일만 있는 경우
const StaticDiv = styled.div`
  display: flex;
  padding: 16px;
`;
// → Tailwind 사용: <div className="flex p-4">
```

#### CSS Modules 사용

```tsx
// ✅ 사용: 복잡한 CSS 로직
.input {
  position: relative;
}

.input:focus-within {
  outline: 2px solid var(--primary);
}

.input::placeholder {
  color: var(--gray-400);
}

// ✅ 사용: 컴포넌트 스코프 격리가 중요할 때
.modal {
  /* 다른 모달과 충돌하지 않음 */
}
```

#### Tailwind CSS 사용

```tsx
// ✅ 사용: 레이아웃
<div className="flex items-center justify-between p-4 gap-2">

// ✅ 사용: 반응형
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ✅ 사용: 유틸리티
<p className="text-sm text-gray-600 font-medium">

// ❌ 피할 것: 너무 복잡한 조합
<div className="relative flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
// → Styled-components로 추상화
```

---

## 타입 시스템

### 타입 구조

```
types/
├── common.ts        # 공통 타입 (Size, ColorVariant 등)
├── component.ts     # 컴포넌트 Props 타입
├── api.ts          # API 관련 타입
└── index.ts        # 통합 export
```

### 타입 네이밍 컨벤션

```tsx
// Interface: PascalCase
interface User {
  id: string;
  name: string;
}

// Type Alias: PascalCase
type ButtonVariant = 'solid' | 'outline' | 'ghost';

// Props: ComponentName + Props
interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
}

// Event Handler: onEventName
type OnClickHandler = (event: React.MouseEvent) => void;
```

### 제네릭 활용

```tsx
// API 응답 제네릭
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// 사용
const response: ApiResponse<User[]> = await fetchUsers();

// React Query 제네릭
const { data } = useQuery<User[], ApiError>({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

---

## 상태 관리

### 상태 분류

1. **서버 상태** → React Query
   - API에서 가져온 데이터
   - 캐싱, 리페칭, 동기화

2. **전역 클라이언트 상태** → Zustand
   - 테마 설정
   - 사용자 인증 정보
   - UI 설정

3. **로컬 컴포넌트 상태** → useState/useReducer
   - 폼 입력 값
   - 모달 열림/닫힘
   - 임시 UI 상태

### React Query 패턴

```tsx
// 쿼리 키 관리
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Filters) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
};

// 커스텀 훅
export const useUsers = (filters?: Filters) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters || {}),
    queryFn: () => fetchUsers(filters),
  });
};

// Mutation with optimistic update
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });
      const previousUsers = queryClient.getQueryData(queryKeys.users.all);
      queryClient.setQueryData(queryKeys.users.all, (old) => [...old, newUser]);
      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      // Rollback
      queryClient.setQueryData(queryKeys.users.all, context.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};
```

---

## API 레이어

### 구조

```
services/
├── api/
│   ├── client.ts       # Axios 인스턴스
│   ├── endpoints.ts    # API 엔드포인트 정의
│   └── index.ts
└── queries/
    ├── queryClient.ts  # React Query 설정
    ├── useUsers.ts     # 사용자 관련 훅
    └── index.ts
```

### 인터셉터 패턴

```tsx
// 요청 인터셉터
apiClient.interceptors.request.use((config) => {
  // 1. 인증 토큰 추가
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. 요청 로깅
  console.log('API Request:', config);

  return config;
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. 토큰 리프레시
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(error.config);
    }

    // 2. 에러 정규화
    return Promise.reject(normalizeError(error));
  }
);
```

---

## 성능 최적화

### 1. 코드 스플리팅

```tsx
// 라우트 레벨 lazy loading
const HomePage = lazy(() => import('@pages/HomePage'));
const AboutPage = lazy(() => import('@pages/AboutPage'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. 메모이제이션

```tsx
// useMemo: 계산 비용이 높은 값
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// useCallback: 함수 참조 유지
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// React.memo: 컴포넌트 메모이제이션
export const ExpensiveComponent = React.memo(({ data }) => {
  // 무거운 렌더링
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수
  return prevProps.data.id === nextProps.data.id;
});
```

### 3. 가상화

```tsx
// 긴 리스트의 경우 가상화 사용
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>
      {items[index]}
    </div>
  )}
</FixedSizeList>
```

---

## 보안

### 1. XSS 방지

```tsx
// ✅ React는 기본적으로 XSS 방지
<div>{userInput}</div>  // 자동 이스케이프

// ⚠️ dangerouslySetInnerHTML 사용 시 주의
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(htmlContent)
}} />
```

### 2. CSRF 방지

```tsx
// Axios에 CSRF 토큰 추가
apiClient.defaults.headers.common['X-CSRF-Token'] = getCsrfToken();
```

### 3. 민감 정보 보호

```tsx
// ❌ 절대 하지 말 것
const API_KEY = 'sk_live_xxxxx';  // 코드에 직접 노출

// ✅ 환경 변수 사용
const API_KEY = import.meta.env.VITE_API_KEY;

// .env 파일
// VITE_API_KEY=sk_live_xxxxx

// .gitignore에 추가
.env
.env.local
```

### 4. 인증 토큰 관리

```tsx
// ✅ httpOnly 쿠키 사용 (선호)
// 서버에서 httpOnly 쿠키로 토큰 전송

// ⚠️ localStorage 사용 시 (XSS 취약)
// 토큰 만료 시간 짧게 설정
// Refresh 토큰 패턴 사용
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
```

---

## 확장 가이드

### 새로운 기능 추가 체크리스트

- [ ] 타입 정의 추가 (`src/types/`)
- [ ] API 엔드포인트 정의 (`src/services/api/endpoints.ts`)
- [ ] React Query 훅 생성 (`src/services/queries/`)
- [ ] 컴포넌트 구현 (Atomic Design 패턴 따름)
- [ ] 테스트 작성
- [ ] 문서 업데이트

---

## 참고 자료

- [React Best Practices](https://react.dev/learn)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
