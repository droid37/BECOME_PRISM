# BECOME PRISM v1.0 - 아키텍처 리포트

## 📁 폴더 구조

```
PRISM/
├── dist/                          # 빌드 출력 디렉토리
│   ├── assets/                    # 번들된 에셋
│   │   ├── eye_logo.png          # 아이콘 이미지
│   │   └── *.css, *.js           # 번들된 스타일/스크립트
│   ├── src/
│   │   └── eye-styles.css        # Single Source of Truth (web_accessible_resource)
│   ├── manifest.json              # Chrome Extension Manifest
│   └── index.html                 # Popup HTML
│
├── public/                        # 정적 에셋 (빌드 시 복사됨)
│   ├── assets/
│   │   └── eye_logo.png          # 소스 아이콘
│   └── eye_logo.png
│
├── src/                           # 소스 코드
│   ├── main.tsx                   # Popup UI 진입점 (React)
│   ├── index.css                  # Popup 스타일 (Cupertino Soul)
│   ├── eye-styles.css             # Eye Single Source of Truth
│   ├── manifest.json              # Chrome Extension Manifest
│   │
│   ├── background/
│   │   └── index.ts               # Background Service Worker
│   │
│   ├── content/
│   │   └── index.ts               # Content Script (Floating Eye + Extraction)
│   │
│   ├── App.tsx                    # (미사용 - main.tsx가 직접 렌더링)
│   └── App.css                    # (미사용)
│
├── index.html                     # Popup HTML 템플릿
├── package.json                   # 프로젝트 메타데이터 & 의존성
├── vite.config.ts                 # Vite 빌드 설정 + Asset Automator
├── tsconfig.json                  # TypeScript 설정
└── eslint.config.js               # ESLint 설정
```

---

## 🎯 파일별 역할 및 책임

### **1. 진입점 및 빌드 설정**

#### `index.html`
- **역할**: Popup UI의 HTML 진입점
- **구조**: `<div id="root">` + React 스크립트 로드
- **연관관계**: 
  - `src/main.tsx`를 로드하여 React 앱 마운트
  - Vite가 빌드 시 `dist/index.html`로 변환

#### `package.json`
- **역할**: 프로젝트 메타데이터 및 의존성 관리
- **주요 의존성**:
  - `react`, `react-dom`: UI 프레임워크
  - `turndown`: HTML → Markdown 변환
  - `@crxjs/vite-plugin`: Chrome Extension 빌드 플러그인
- **스크립트**:
  - `npm run build`: TypeScript 컴파일 + Vite 빌드
  - `npm run dev`: 개발 서버

#### `vite.config.ts`
- **역할**: Vite 빌드 설정 및 커스텀 플러그인
- **주요 기능**:
  - `@crxjs/vite-plugin`: Manifest V3 Extension 빌드
  - `assetAutomator()`: 빌드 후 자동 에셋 복사
- **연관관계**:
  - `src/manifest.json`을 읽어 Extension 구조 생성
  - `public/`의 에셋을 `dist/`로 복사

#### `tsconfig.json`
- **역할**: TypeScript 컴파일러 설정
- **주요 설정**:
  - `types: ["chrome"]`: Chrome Extension API 타입 지원
  - `jsx: "react-jsx"`: React JSX 변환
  - `strict: true`: 엄격한 타입 체크

---

### **2. Chrome Extension 핵심 파일**

#### `src/manifest.json`
- **역할**: Chrome Extension의 메타데이터 및 권한 정의
- **주요 구성**:
  - **Icons**: `assets/eye_logo.png` (16, 48, 128px)
  - **Action**: Popup UI (`index.html`)
  - **Permissions**: `activeTab`, `scripting`, `storage`, `downloads`, `clipboardWrite`
  - **Content Scripts**: `src/content/index.ts` (모든 URL에 주입)
  - **Background**: `src/background/index.ts` (Service Worker)
  - **Web Accessible Resources**: `assets/*`, `src/eye-styles.css`
- **연관관계**:
  - 모든 스크립트와 리소스의 진입점 정의
  - `vite.config.ts`의 `crx` 플러그인이 이를 읽어 빌드

---

### **3. UI 레이어 (Popup)**

#### `src/main.tsx`
- **역할**: Popup UI의 메인 컴포넌트 (React 진입점)
- **주요 기능**:
  1. **SentientEye 컴포넌트**: Eye of Ra (Fixed Gaze)
  2. **GlassButton 컴포넌트**: Frosted Glass 버튼 (NO ICONS)
  3. **Toast 컴포넌트**: Ephemeral Tooltip
  4. **HelpCard 컴포넌트**: 3D Flip Card
  5. **Intent-Based Layout**: Primary/Secondary 행 구조
  6. **Resonance Logic**: CSS 클래스 기반 Color Resonance
  7. **Silent Reconnection**: Context invalidation 자동 복구
- **연관관계**:
  - `src/index.css`: Popup 스타일
  - `src/eye-styles.css`: Eye 스타일 (Single Source of Truth)
  - `src/content/index.ts`: `chrome.tabs.sendMessage`로 통신
  - `src/background/index.ts`: Soul's Return 애니메이션 트리거

#### `src/index.css`
- **역할**: Popup UI의 스타일 (Cupertino Soul)
- **주요 스타일**:
  - **Intent-Based Layout**: `.primary-row`, `.secondary-row`
  - **Frosted Glass Buttons**: `backdrop-filter: blur(25px)`, noise texture
  - **Neon Engraving**: `text-shadow`로 DNA color glow
  - **Flip Card**: 3D transform 애니메이션
  - **Toast**: Ephemeral tooltip 애니메이션
- **연관관계**:
  - `src/main.tsx`에서 import하여 사용
  - DNA color variables (`--dna-red`, `--dna-yellow`, etc.)

#### `src/eye-styles.css`
- **역할**: Eye의 Single Source of Truth (Main UI + Floating Eye 공유)
- **주요 구조**:
  - **Hybrid Eye**: `.prism-eye-body` (2D logo) + `.prism-eye-pupil` (physics overlay)
  - **Resonance Classes**: `.resonance-preserve`, `.resonance-transplant`, etc.
  - **CSS Variables**: `--glow-color-red`, `--glow-color-yellow`, etc.
  - **Animations**: `focus-power`, `blinking`, `pulse`, `shake`
- **연관관계**:
  - `src/main.tsx`: Popup Eye에서 사용
  - `src/content/index.ts`: Shadow DOM에 주입하여 Floating Eye에서 사용
  - `src/manifest.json`: `web_accessible_resources`로 등록

---

### **4. Content Script 레이어**

#### `src/content/index.ts`
- **역할**: 웹페이지에 주입되는 스크립트 (Floating Eye + Extraction Engine)
- **주요 기능**:
  1. **Floating Eye Widget**:
     - Shadow DOM으로 격리
     - Draggable, position 저장
     - 3-Tier Awareness System (Idle/Active/Focus)
     - Satellite Menu (Orbital Layout)
  2. **4-Tier Invincible Extraction**:
     - Tier 1: User Selection
     - Tier 2: Deep Targeting (Purified messages)
     - Tier 3: TreeWalker (All visible text)
     - Tier 4: Nuclear Option (`document.body.innerText`)
  3. **Extraction Modes**:
     - `full`: HTML → Markdown (PRESERVE)
     - `transplant`: Content 저장 (TRANSPLANT)
     - `code`: Code blocks only (DNA)
     - `logic`: Text without code (미사용)
     - `context`: First 3 + Last 3 messages (SOUL)
  4. **Phantom Hand**: 텍스트 선택 시 Ghost Eye 표시
- **연관관계**:
  - `src/eye-styles.css`: Shadow DOM에 `<link>`로 주입
  - `src/main.tsx`: `chrome.runtime.onMessage`로 통신
  - `src/background/index.ts`: Soul's Return 메시지 수신
  - `chrome.storage.local`: Floating Eye position, Transplant content 저장
  - `assets/eye_logo.png`: Floating Eye 이미지

---

### **5. Background Service Worker**

#### `src/background/index.ts`
- **역할**: Background Service Worker (최소한의 로직)
- **주요 기능**:
  1. **Soul's Return**: Browser action 클릭 시 Floating Eye 애니메이션 트리거
  2. **Lifecycle**: Extension 설치/업데이트 이벤트 처리
- **연관관계**:
  - `src/content/index.ts`: `chrome.tabs.sendMessage`로 Soul's Return 메시지 전송
  - `src/manifest.json`: `background.service_worker`로 등록

---

## 🔗 연관관계 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                    Chrome Extension                          │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Popup UI   │      │   Content    │      │  Background  │
│  (main.tsx)  │◄────►│ Script       │◄────►│  Service     │
│              │      │ (index.ts)   │      │  Worker      │
└──────────────┘      └──────────────┘      └──────────────┘
        │                     │                     │
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ index.css    │      │ eye-styles   │      │ manifest.json│
│ (Cupertino)  │      │ .css (SST)   │      │ (Config)     │
└──────────────┘      └──────────────┘      └──────────────┘
                              │
                              │ (Shadow DOM 주입)
                              ▼
                    ┌─────────────────┐
                    │  Floating Eye   │
                    │  (Widget)       │
                    └─────────────────┘
```

---

## 📊 데이터 흐름

### **1. Extraction Flow (PRESERVE/DNA/SOUL)**

```
User clicks button (main.tsx)
    │
    ├─► handleExtract()
    │   │
    │   ├─► chrome.tabs.sendMessage(activeTabId, { action: 'extract', mode: 'full' })
    │   │
    │   └─► content/index.ts receives message
    │       │
    │       ├─► performExtraction('full')
    │       │   ├─► Tier 1: window.getSelection()
    │       │   ├─► Tier 2: extractPurifiedMessages()
    │       │   ├─► Tier 3: extractWithTreeWalker()
    │       │   └─► Tier 4: document.body.innerText
    │       │
    │       ├─► processFullArchive()
    │       │   └─► TurndownService.turndown(html)
    │       │
    │       └─► sendResponse({ markdown, title })
    │
    └─► main.tsx receives response
        │
        ├─► Create Blob([markdown])
        ├─► URL.createObjectURL(blob)
        └─► Trigger download
```

### **2. Resonance Flow (Color Glow)**

```
User hovers button (main.tsx)
    │
    ├─► handleButtonHover('preserve')
    │   │
    │   └─► setResonanceClass('preserve')
    │       │
    │       └─► SentientEye receives resonanceClass prop
    │           │
    │           └─► useEffect adds class: 'resonance-preserve'
    │               │
    │               └─► eye-styles.css applies glow:
    │                   box-shadow: 0 0 20px var(--glow-color-red)
```

### **3. Floating Eye Flow**

```
Page loads
    │
    ├─► content/index.ts: createFloatingEye()
    │   │
    │   ├─► Create Shadow DOM
    │   ├─► Inject eye-styles.css (<link>)
    │   ├─► Create .prism-eye-container structure
    │   │   ├─► .prism-eye-body (background image)
    │   │   ├─► .prism-eye-pupil (centered)
    │   │   ├─► .prism-eye-glint (physics)
    │   │   └─► .prism-eye-eyelid-top/bottom
    │   │
    │   ├─► 3-Tier Awareness System
    │   │   ├─► Idle: opacity 0.2
    │   │   ├─► Active: opacity 0.6
    │   │   └─► Focus: opacity 1.0, scale 1.1
    │   │
    │   └─► Satellite Menu (Orbital Layout)
    │       └─► 4 buttons at 0°, 90°, 180°, 270°
```

### **4. Silent Reconnection Flow**

```
main.tsx: chrome.tabs.sendMessage()
    │
    ├─► Error: "Extension context invalidated"
    │   │
    │   └─► reconnectContentScript(tabId)
    │       │
    │       ├─► chrome.scripting.executeScript({ files: ['src/content/index.ts'] })
    │       │
    │       └─► Wait 100ms → Retry sendMessage()
```

---

## 🎨 스타일 시스템

### **CSS 계층 구조**

```
1. eye-styles.css (Single Source of Truth)
   ├─► .prism-eye-container (Hybrid Eye 구조)
   ├─► .prism-eye-body (2D logo background)
   ├─► .prism-eye-pupil (Physics overlay)
   ├─► .prism-eye-glint (Glass reflection)
   ├─► .prism-eye-eyelid-top/bottom (Blinking)
   └─► .resonance-* (Color glow classes)

2. index.css (Cupertino Soul)
   ├─► .popup-container (Layout)
   ├─► .primary-row / .secondary-row (Intent-Based)
   ├─► .glass-button (Frosted Glass)
   ├─► .toast (Ephemeral Tooltip)
   └─► .help-card (3D Flip)

3. Content Script Inline Styles
   └─► Widget-specific positioning & z-index
```

---

## 🔐 보안 및 격리

### **Shadow DOM 격리**
- Floating Eye는 Shadow DOM 내부에 생성
- 페이지 스타일과 완전 격리
- `event.stopPropagation()`으로 이벤트 전파 차단

### **Content Security Policy**
```json
"content_security_policy": {
  "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
}
```

### **Web Accessible Resources**
- `assets/*`: 아이콘 이미지
- `src/eye-styles.css`: Shadow DOM에서 로드 가능

---

## 📦 빌드 프로세스

```
npm run build
    │
    ├─► tsc (TypeScript 컴파일)
    │   └─► 타입 체크 및 에러 검증
    │
    └─► vite build
        │
        ├─► @crxjs/vite-plugin
        │   ├─► src/manifest.json 읽기
        │   ├─► Extension 구조 생성
        │   └─► dist/manifest.json 생성
        │
        ├─► React 빌드
        │   ├─► src/main.tsx → dist/assets/index.html-*.js
        │   └─► src/index.css → dist/assets/index-*.css
        │
        ├─► Content Script 빌드
        │   └─► src/content/index.ts → dist/assets/index.ts-*.js
        │
        ├─► Background 빌드
        │   └─► src/background/index.ts → dist/service-worker-loader.js
        │
        ├─► Asset 복사
        │   ├─► public/eye_logo.png → dist/eye_logo.png
        │   └─► public/assets/* → dist/assets/*
        │
        └─► assetAutomator() (Post-build)
            ├─► dist/assets/ 디렉토리 생성
            └─► eye_logo.png 최종 확인
```

---

## 🎯 핵심 설계 원칙

### **1. Single Source of Truth**
- `eye-styles.css`: Main UI와 Floating Eye가 동일한 스타일 공유
- CSS Variables로 Resonance 제어

### **2. Zero Friction**
- Silent Reconnection: 자동 복구
- Ephemeral Tooltips: 비침투적 피드백
- 4-Tier Extraction: 항상 콘텐츠 추출 성공

### **3. Holistic Resonance**
- CSS 클래스 기반 Resonance (인라인 스타일 제거)
- CSS Variables로 일관된 색상 관리
- 버튼 hover → Eye glow 연동

### **4. Intent-Based Layout**
- Primary Row: 주요 액션 (PRESERVE, TRANSPLANT)
- Secondary Row: 보조 액션 (DNA, SOUL)
- Typography-driven (NO ICONS)

---

## 📝 파일별 의존성 요약

| 파일 | 의존하는 파일 | 의존받는 파일 |
|------|--------------|--------------|
| `main.tsx` | `index.css`, `eye-styles.css` | `index.html` |
| `content/index.ts` | `eye-styles.css` (Shadow DOM) | `manifest.json` |
| `background/index.ts` | - | `manifest.json` |
| `eye-styles.css` | `assets/eye_logo.png` | `main.tsx`, `content/index.ts` |
| `index.css` | - | `main.tsx` |
| `manifest.json` | - | `vite.config.ts` |
| `vite.config.ts` | `src/manifest.json` | `package.json` |

---

## 🚀 확장 포인트

1. **새로운 Extraction Mode 추가**:
   - `content/index.ts`의 `performExtraction()` 수정
   - `main.tsx`의 `handleExtract()`에 케이스 추가

2. **새로운 Resonance Color 추가**:
   - `eye-styles.css`에 CSS Variable 추가
   - `eye-styles.css`에 `.resonance-*` 클래스 추가
   - `main.tsx`의 `handleButtonHover()` 수정

3. **새로운 Satellite Menu 버튼 추가**:
   - `content/index.ts`의 `createSatelliteMenu()` 수정
   - Orbital angle 계산 추가

---

**생성일**: 2024
**버전**: v1.0 Final Build
**아키텍처**: Holistic Resonance Simulation

