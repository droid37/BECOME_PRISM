# BECOME PRISM 프로젝트 구조 및 파일 연결성 리포트

**생성일:** 2024년  
**버전:** v1.0.0 (Final UI Sanctification: The Sanctuary)  
**아키텍처:** Chrome Extension (Manifest V3) + React + TypeScript + Vite

---

## 📁 프로젝트 폴더 구조

```
PRISM/
├── dist/                          # 빌드 결과물 (Chrome Extension 배포용)
│   ├── assets/                    # 빌드된 자산 파일
│   │   ├── eye_logo.png
│   │   ├── perfect_orb.png
│   │   ├── index.ts-*.js         # Content Script (빌드됨)
│   │   └── popup-*.js            # Popup UI (빌드됨)
│   ├── manifest.json             # Chrome Extension Manifest
│   ├── index.html                # Popup HTML
│   └── service-worker-loader.js  # Background Service Worker
│
├── public/                        # 정적 자산 (빌드 시 복사됨)
│   └── assets/
│       ├── eye_logo.png          # Extension 아이콘
│       └── perfect_orb.png       # Perfect Orb 이미지 (Eye UI)
│
├── src/                           # 소스 코드
│   ├── main.tsx                  # ⭐ Popup UI 진입점 (Sandbox Universe)
│   ├── content/
│   │   └── index.ts              # ⭐ Content Script (Minimalist Spy)
│   ├── background/
│   │   └── index.ts              # ⭐ Background Service Worker (Silent Heart)
│   ├── manifest.json             # Chrome Extension 설정
│   ├── index.css                 # (미사용 - CSS-in-JS 사용)
│   ├── eye-styles.css            # (미사용 - CSS-in-JS 사용)
│   ├── App.tsx                   # (미사용 - main.tsx가 직접 렌더링)
│   └── App.css                   # (미사용)
│
├── node_modules/                  # NPM 의존성
├── package.json                   # 프로젝트 설정 및 의존성
├── vite.config.ts                # Vite 빌드 설정
├── tsconfig.json                 # TypeScript 설정
├── index.html                    # Popup HTML 템플릿
└── README.md                     # 프로젝트 문서
```

---

## 🔗 핵심 파일 역할 및 연결성

### 1. **빌드 시스템**

#### `vite.config.ts`
- **역할:** Vite 빌드 설정 및 Chrome Extension 플러그인 통합
- **연결성:**
  - `@crxjs/vite-plugin` 사용하여 `src/manifest.json`을 읽어 Extension 빌드
  - `index.html`을 popup 진입점으로 설정
  - `src/content/index.ts`와 `src/background/index.ts`를 자동으로 빌드
- **출력:** `dist/` 폴더에 빌드된 Extension 생성

#### `package.json`
- **의존성:**
  - `react`, `react-dom`: Popup UI 프레임워크
  - `turndown`: HTML → Markdown 변환
  - `@crxjs/vite-plugin`: Chrome Extension 빌드 플러그인
  - `@types/chrome`: Chrome Extension API 타입 정의
- **스크립트:**
  - `npm run build`: TypeScript 컴파일 + Vite 빌드
  - `npm run dev`: 개발 모드 (Hot Reload)

---

### 2. **Chrome Extension 설정**

#### `src/manifest.json`
- **역할:** Chrome Extension의 핵심 설정 파일
- **주요 설정:**
  ```json
  {
    "action": {
      "default_popup": "index.html"  // → main.tsx가 렌더링됨
    },
    "content_scripts": [{
      "js": ["src/content/index.ts"]  // → content/index.ts 주입
    }],
    "background": {
      "service_worker": "src/background/index.ts"  // → background/index.ts 실행
    },
    "web_accessible_resources": [
      "assets/*"  // → public/assets/ 파일들 접근 가능
    ],
    "commands": {
      "_execute_action": {
        "suggested_key": "Alt+Shift+P"  // → Hotkey로 popup 열기
      }
    }
  }
  ```
- **연결성:**
  - 모든 Extension 컴포넌트의 진입점 정의
  - 권한 설정: `activeTab`, `scripting`, `storage`, `downloads`, `clipboardWrite`

---

### 3. **Popup UI (Sandbox Universe)**

#### `src/main.tsx` ⭐
- **역할:** Extension Popup의 메인 UI 컴포넌트
- **책임:**
  1. **UI 렌더링:** React로 Popup UI 구성 (Eye, Buttons, Help Card)
  2. **데이터 처리:** Content Script로부터 받은 raw HTML/TEXT를 처리
  3. **Markdown 변환:** `TurndownService`로 HTML → Markdown 변환
  4. **파일 저장:** Background Script에 `saveFile` 메시지 전송
  5. **클립보드 복사:** `navigator.clipboard.writeText()` 사용
- **주요 컴포넌트:**
  - `SentientEye`: Perfect Orb (정적, Color Resonance만)
  - `GlassButton`: Frosted Glass 버튼 (PRESERVE, TRANSPLANT, DNA, SOUL)
  - `HelpCard`: 3D Flip Card (프로젝트 이름 입력)
  - `Toast`: Ephemeral Tooltips
- **메시지 흐름:**
  ```
  User clicks button
    ↓
  main.tsx → chrome.tabs.sendMessage(tabId, { action: 'extract', mode: '...' })
    ↓
  content/index.ts (extract 수행)
    ↓
  content/index.ts → chrome.runtime.sendMessage({ success, content, isHtml })
    ↓
  main.tsx (수신)
    ↓
  TurndownService로 변환
    ↓
  chrome.runtime.sendMessage({ action: 'saveFile', ... }) → background/index.ts
  ```
- **스타일링:**
  - **CSS-in-JS:** 모든 스타일을 React Style Objects로 정의
  - **Nebula Background:** 다층 radial-gradient 배경
  - **The Gaze of Ra:** 정적 Eye (마우스 추적 없음)

---

### 4. **Content Script (Minimalist Spy)**

#### `src/content/index.ts` ⭐
- **역할:** 웹페이지에서 콘텐츠 추출만 수행 (UI 없음)
- **책임:**
  1. **4-Tier Invincible Extraction:**
     - Tier 1: `window.getSelection()` (사용자 선택)
     - Tier 2: 특정 Selector (`article`, `main`, `[role="presentation"]` 등)
     - Tier 3: `TreeWalker` (모든 visible text nodes)
     - Tier 4: `document.body.innerText` (Nuclear Option)
  2. **Mode별 추출:**
     - `full`: 전체 HTML (`innerHTML`)
     - `code`: 코드 블록만 (`<pre>`, `<code>`)
     - `context`: 컨텍스트/로직만 (메시지 추출)
     - `transplant`: Transplant 패키지 생성
- **메시지 리스너:**
  ```typescript
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extract') {
      const content = performExtraction(message.mode);
      sendResponse({ success: true, content, isHtml: true });
    }
  });
  ```
- **연결성:**
  - `main.tsx`로부터 `extract` 요청 수신
  - Raw HTML/TEXT만 반환 (처리는 popup에서 수행)
  - **NO UI, NO LIBRARIES** (순수 DOM 조작만)

---

### 5. **Background Service Worker (Silent Heart)**

#### `src/background/index.ts` ⭐
- **역할:** 백그라운드 작업 처리 (다운로드, Hotkey)
- **책임:**
  1. **Hotkey 처리:**
     ```typescript
     chrome.commands.onCommand.addListener((command) => {
       if (command === '_execute_action') {
         chrome.action.openPopup();  // Popup 열기
       }
     });
     ```
  2. **Smart Folder Logic:**
     ```typescript
     chrome.runtime.onMessage.addListener((message) => {
       if (message.action === 'saveFile') {
         // BECOME_PRISM/{project}/{title}.md 또는
         // BECOME_PRISM/{title}.md
         chrome.downloads.download({ url: dataUrl, filename });
       }
     });
     ```
- **연결성:**
  - `main.tsx`로부터 `saveFile` 메시지 수신
  - `chrome.downloads.download()` API 사용
  - 프로젝트 이름에 따라 폴더 구조 자동 생성

---

### 6. **정적 자산**

#### `public/assets/`
- **파일:**
  - `eye_logo.png`: Extension 아이콘 (16x16, 48x48, 128x128)
  - `perfect_orb.png`: Perfect Orb 이미지 (Eye UI 배경)
- **접근:**
  - `chrome.runtime.getURL('assets/perfect_orb.png')`로 접근
  - `manifest.json`의 `web_accessible_resources`에 등록됨

---

## 🔄 데이터 흐름도

### **시나리오 1: PRESERVE (전체 페이지 저장)**

```
1. User clicks "PRESERVE" button
   ↓
2. main.tsx: handleExtract('preserve')
   ↓
3. chrome.tabs.sendMessage(tabId, { action: 'extract', mode: 'full' })
   ↓
4. content/index.ts: performExtraction('full')
   - 4-Tier Extraction 수행
   - Raw HTML 반환
   ↓
5. main.tsx: TurndownService로 HTML → Markdown 변환
   ↓
6. chrome.storage.sync.get(['prismProject']) → 프로젝트 이름 읽기
   ↓
7. chrome.runtime.sendMessage({ action: 'saveFile', content, title, project })
   ↓
8. background/index.ts: chrome.downloads.download()
   - 파일명: BECOME_PRISM/{project}/{title}.md
   ↓
9. Toast: "Saved!" 표시
```

### **시나리오 2: DNA (코드 블록만 복사)**

```
1. User clicks "DNA" button
   ↓
2. main.tsx: handleExtract('dna')
   ↓
3. chrome.tabs.sendMessage(tabId, { action: 'extract', mode: 'code' })
   ↓
4. content/index.ts: extractCode()
   - 모든 <pre>, <code> 요소 추출
   - 구분자로 연결
   ↓
5. main.tsx: navigator.clipboard.writeText(codeContent)
   ↓
6. Toast: "Copied!" 표시
```

### **시나리오 3: Hotkey (Alt+Shift+P)**

```
1. User presses Alt+Shift+P
   ↓
2. background/index.ts: chrome.commands.onCommand
   ↓
3. chrome.action.openPopup()
   ↓
4. main.tsx: Popup UI 렌더링
```

---

## 🎨 UI 아키텍처

### **The Sanctuary (Final UI Sanctification)**

#### **레이아웃 구조:**
```
┌─────────────────────────────┐
│  Nebula Background          │
│  (Multi-layer gradients)    │
│                             │
│  ┌─────────────────────┐   │
│  │   Perfect Orb       │   │
│  │   (Static, 80x80)   │   │
│  └─────────────────────┘   │
│                             │
│  ┌──────────┬──────────┐   │
│  │ PRESERVE │TRANSPLANT│   │
│  └──────────┴──────────┘   │
│  ┌──────────┬──────────┐   │
│  │   DNA    │   SOUL   │   │
│  └──────────┴──────────┘   │
│                             │
│                    ┌───┐    │
│                    │ ? │    │ (Help Card)
│                    └───┘    │
└─────────────────────────────┘
```

#### **스타일링 방식:**
- **CSS-in-JS:** 모든 스타일을 React Style Objects로 정의 (`STYLES` 객체)
- **The Gaze of Ra:** Eye는 완전히 정적 (마우스 추적 없음)
- **Color Resonance:** 버튼 hover 시 Eye에 `boxShadow` glow 효과
- **Nebula Background:** 다층 `radial-gradient`로 깊이감 연출

---

## 🔧 빌드 프로세스

### **`npm run build` 실행 시:**

1. **TypeScript 컴파일:**
   - `tsc` 실행 → 타입 체크
   - `tsconfig.json` 설정 적용

2. **Vite 빌드:**
   - `vite.config.ts` 설정 읽기
   - `@crxjs/vite-plugin`이 `src/manifest.json` 처리
   - Entry Points:
     - `index.html` → `dist/index.html` (Popup)
     - `src/content/index.ts` → `dist/assets/index.ts-*.js`
     - `src/background/index.ts` → `dist/service-worker-loader.js`
     - `src/main.tsx` → `dist/assets/popup-*.js`
   - `public/assets/` → `dist/assets/` 복사

3. **출력:**
   - `dist/` 폴더에 완전한 Chrome Extension 생성
   - Chrome에서 `dist/` 폴더를 "압축해제된 확장 프로그램"으로 로드 가능

---

## 📊 파일 의존성 그래프

```
index.html
  └─→ main.tsx (React 진입점)
      ├─→ TurndownService (라이브러리)
      ├─→ chrome.tabs API
      ├─→ chrome.runtime API
      └─→ chrome.storage API
          │
          ├─→ content/index.ts (메시지 통신)
          │   └─→ DOM API (추출만)
          │
          └─→ background/index.ts (메시지 통신)
              └─→ chrome.downloads API
                  └─→ chrome.commands API
```

---

## ⚠️ 미사용 파일

다음 파일들은 현재 프로젝트에서 사용되지 않습니다:

- `src/App.tsx`: `main.tsx`가 직접 렌더링하므로 불필요
- `src/App.css`: CSS-in-JS 사용으로 불필요
- `src/index.css`: CSS-in-JS 사용으로 불필요
- `src/eye-styles.css`: CSS-in-JS 사용으로 불필요

**권장사항:** 향후 정리 시 삭제 가능 (현재는 빌드에 영향 없음)

---

## 🎯 핵심 아키텍처 원칙

### **1. Sandbox Protocol**
- **Content Script:** Minimalist Spy (추출만)
- **Popup:** Sandbox Universe (모든 처리)
- **Background:** Silent Heart (다운로드만)

### **2. Zero Friction**
- 자동 폴더 생성 (Smart Folder Logic)
- 즉시 실행 (Ghost triggers 없음)
- 에러 시 친절한 메시지 (Toast)

### **3. The Gaze of Ra**
- Eye는 완전히 정적 (god-like, omniscient)
- Color Resonance만 유일한 애니메이션
- 마우스 추적 없음

### **4. CSS-in-JS**
- 모든 스타일을 React Style Objects로 정의
- 별도 CSS 파일 없음
- Pixel-perfect 제어

---

## 📝 체크리스트

### ✅ 완료된 항목
- [x] Manifest V3 구조
- [x] Content Script (Minimalist Spy)
- [x] Background Service Worker (Silent Heart)
- [x] Popup UI (Sandbox Universe)
- [x] 4-Tier Invincible Extraction
- [x] Smart Folder Logic
- [x] Hotkey 지원 (Alt+Shift+P)
- [x] CSS-in-JS 스타일링
- [x] The Gaze of Ra (정적 Eye)
- [x] Nebula Background
- [x] Color Resonance

### 🔄 향후 개선 가능 항목
- [ ] `src/App.tsx`, `src/App.css`, `src/index.css`, `src/eye-styles.css` 삭제
- [ ] Content Script 재연결 로직 개선
- [ ] 에러 핸들링 강화
- [ ] 테스트 코드 추가

---

## 🚀 배포 준비

1. **빌드:**
   ```bash
   npm run build
   ```

2. **확인:**
   - `dist/` 폴더에 모든 파일 생성 확인
   - `dist/manifest.json` 확인
   - `dist/assets/`에 이미지 파일 확인

3. **로드:**
   - Chrome → `chrome://extensions/`
   - "개발자 모드" 활성화
   - "압축해제된 확장 프로그램 로드"
   - `dist/` 폴더 선택

---

**리포트 작성 완료.**  
**프로젝트 구조와 파일 연결성이 모두 확인되었습니다.**

