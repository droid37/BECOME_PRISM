# BECOME PRISM: Workspace Sterilization Commands

## ⚠️ IMPORTANT
**Run these commands in sequence. Do not skip steps.**

---

## 🧹 Cleanup Command Sequence

### Step 1: Delete Build Output
**Command:**
```powershell
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
```

**Purpose:** Deletes the old, potentially corrupted build output directory (`dist/`). This ensures we start with a completely fresh build.

**Alternative (if using Git Bash or WSL):**
```bash
rm -rf dist
```

---

### Step 2: Delete Dependency Cache
**Command:**
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
```

**Purpose:** Deletes all installed libraries (`node_modules/`) to ensure a completely clean re-installation. This resolves any corrupted or mismatched dependencies.

**Alternative (if using Git Bash or WSL):**
```bash
rm -rf node_modules
```

---

### Step 3: Delete Package Lock
**Command:**
```powershell
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
```

**Purpose:** Deletes the lock file to resolve any potential dependency version conflicts. A new lock file will be generated during `npm install`.

**Alternative (if using Git Bash or WSL):**
```bash
rm -f package-lock.json
```

---

### Step 4: Delete Legacy Python/Batch Files (Optional)
**Command:**
```powershell
Remove-Item -Force *.py, *.bat -ErrorAction SilentlyContinue
```

**Purpose:** Deletes any remaining legacy script files (`*.py`, `*.bat`) from the root directory. These are no longer needed as we use `npm run build` instead.

**Alternative (if using Git Bash or WSL):**
```bash
rm -f *.py *.bat
```

---

## 🔄 Rebirth Command Sequence

### Step 1: Re-install Dependencies
**Command:**
```powershell
npm install
```

**Purpose:** Installs a fresh, clean set of all required libraries based on `package.json`. This creates a new `node_modules/` directory and `package-lock.json` file.

---

### Step 2: Re-build the Project
**Command:**
```powershell
npm run build
```

**Purpose:** Creates a new, clean `dist/` folder based on the current source code. This compiles TypeScript, bundles the extension, and runs the Asset Automator plugin.

---

## 📋 Complete Command Sequence (Copy & Paste)

### For Windows PowerShell:
```powershell
# Cleanup
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force *.py, *.bat -ErrorAction SilentlyContinue

# Rebirth
npm install
npm run build
```

### For Git Bash / WSL / Linux / macOS:
```bash
# Cleanup
rm -rf dist
rm -rf node_modules
rm -f package-lock.json
rm -f *.py *.bat

# Rebirth
npm install
npm run build
```

---

## ✅ Verification

After running the commands, verify:
1. ✅ `dist/` folder is recreated with fresh build artifacts
2. ✅ `node_modules/` is recreated with all dependencies
3. ✅ `package-lock.json` is regenerated
4. ✅ Build completes without errors
5. ✅ Extension loads correctly in Chrome

---

## 🚨 Safety Notes

- **These commands are safe** - they only delete build artifacts and dependencies, NOT source code
- **Source files are preserved:**
  - `src/` directory (all source code)
  - `public/` directory (assets)
  - `package.json` (dependencies list)
  - `vite.config.ts` (build configuration)
  - `tsconfig.json` (TypeScript configuration)
  - All other configuration files

- **If you have uncommitted changes**, commit them first or create a backup

