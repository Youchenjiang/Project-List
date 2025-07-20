/* global Toastify */

// === 常數定義 ===
const CHARSET_SIZES = {
    DIGITS: 10,
    LOWERCASE: 26,
    UPPERCASE: 26,
    SYMBOLS: 32
};

const TIME_UNITS = {
    SECONDS_PER_MINUTE: 60,
    SECONDS_PER_HOUR: 3600,
    SECONDS_PER_DAY: 86400,
    DAYS_PER_YEAR: 365
};

const TIME_THRESHOLDS = {
    LOG_CALCULATION_LIMIT: 30, // 約10億秒以下可以直接計算
    THOUSAND: 1e3,
    MILLION: 1e6,
    BILLION: 1e9,
    TRILLION: 1e12
};

const REGEX_PATTERNS = {
    DIGITS: /[0-9]/,
    LOWERCASE: /[a-z]/,
    UPPERCASE: /[A-Z]/,
    SYMBOLS: /[^0-9a-zA-Z]/
};

const NOTIFICATION_CONFIG = {
    DURATION: 3000,
    GRAVITY: "bottom",
    POSITION: "right",
    STOP_ON_FOCUS: true,
    ERROR_STYLE: {
        background: "#e74c3c"
    }
};

const HIBP_CONFIG = {
    API_URL: 'https://api.pwnedpasswords.com/range/',
    HASH_PREFIX_LENGTH: 5,
    LINE_SEPARATOR: "\r\n",
    HASH_COUNT_SEPARATOR: ':'
};

// 硬體配置設定 - 基於實際測試數據和公開基準
// hashRate 單位：每秒雜湊次數 (hashes per second)
const HARDWARE_CONFIGS = {
    'cpu-single':     { name: '單核心 CPU (Intel i5-12400 舉例)', hashRate: 1e3 },        // 1 千次/秒
    'cpu-multi':      { name: '多核心 CPU (AMD Ryzen 9 7950X 舉例)', hashRate: 1e5 },     // 10 萬次/秒
    'gpu-entry':      { name: '入門級消費 GPU (GTX 1660 舉例)', hashRate: 1e6 },          // 100 萬次/秒
    'gpu-consumer':   { name: '旗艦消費 GPU (RTX 5090)', hashRate: 4.5e10 },             // 450 億次/秒
    'gpu-datacenter': { name: '最強資料中心 GPU (B200 舉例)', hashRate: 1.2e11 },         // 1200 億次/秒
    'gpu-cluster':    { name: 'GPU 叢集 (4x B200)', hashRate: 4.8e11 },                  // 4800 億次/秒
    'asic':           { name: 'ASIC 礦機 (Antminer S19 Pro)', hashRate: 1.1e14 }         // 110 兆次/秒
};

document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password-input');
    const toggleButton = document.getElementById('toggle-password');
    const checkButton = document.getElementById('check-button');
    const hardwareSelect = document.getElementById('hardware-select');
    const loadingElement = document.getElementById('loading');
    const resultContainer = document.getElementById('result-container');
    const hashValue = document.getElementById('hash-value');
    const hibpResult = document.getElementById('hibp-result');
    const strengthAnalysis = document.getElementById('strength-analysis');
    const strengthDetails = document.getElementById('strength-details');
    const crackTime = document.getElementById('crack-time');

    // 使用 Toastify 顯示通知
    function showNotification(message) {
        // 檢查 Toastify 是否可用
        if (typeof Toastify === 'undefined') {
            // 降級到原生 alert
            alert(message);
            return;
        }

        Toastify({
            text: message,
            duration: NOTIFICATION_CONFIG.DURATION,
            gravity: NOTIFICATION_CONFIG.GRAVITY,
            position: NOTIFICATION_CONFIG.POSITION,
            stopOnFocus: NOTIFICATION_CONFIG.STOP_ON_FOCUS,
            style: NOTIFICATION_CONFIG.ERROR_STYLE
        }).showToast();
    }

    // 整頁監聽 Enter 鍵觸發檢查
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // 防止表單提交
            checkButton.click(); // 觸發檢查按鈕點擊事件
        }
    });

    // 切換密碼顯示/隱藏
    toggleButton.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.querySelector('.eye-icon').textContent = '👁️‍🗨️';
            toggleButton.setAttribute('aria-label', '隱藏密碼');
        } else {
            passwordInput.type = 'password';
            toggleButton.querySelector('.eye-icon').textContent = '👁️';
            toggleButton.setAttribute('aria-label', '顯示密碼');
        }
    });

    // 硬體選擇器改變事件 - 動態更新破解時間
    hardwareSelect.addEventListener('change', function () {
        const password = passwordInput.value;
        if (password && !resultContainer.classList.contains('hidden')) {
            // 重新分析密碼強度
            const selectedHardware = hardwareSelect.value;
            const analysis = analyzePassword(password, selectedHardware);

            // 更新顯示
            crackTime.textContent = `預估暴力破解時間約：${analysis.crackTime} (${analysis.hardwareName})`;
        }
    });

    // 檢查密碼按鈕點擊事件
    checkButton.addEventListener('click', function () {
        const password = passwordInput.value;
        if (!password) {
            showNotification('請輸入密碼', 'error');
            return;
        }

        // 顯示載入中
        loadingElement.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        strengthAnalysis.classList.add('hidden');

        // 計算SHA-1雜湊
        calculateSHA1(password).then(hash => {
            // 顯示雜湊值
            const prefix = hash.substring(0, 5);
            const remaining = hash.substring(5);
            hashValue.textContent = `${prefix} - ${remaining}`;

            // 查詢 HIBP API
            checkHIBP(prefix, remaining).then(result => {
                // 隱藏載入中
                loadingElement.classList.add('hidden');
                resultContainer.classList.remove('hidden');

                // 無論是否被收錄，都分析密碼強度
                const selectedHardware = hardwareSelect.value;
                const analysis = analyzePassword(password, selectedHardware);
                strengthAnalysis.classList.remove('hidden');

                // 顯示密碼組成
                const setNames = [];
                if (analysis.hasDigits) setNames.push('數字');
                if (analysis.hasLower) setNames.push('小寫');
                if (analysis.hasUpper) setNames.push('大寫');
                if (analysis.hasSymbols) setNames.push('符號');

                strengthDetails.textContent = `長度 ${password.length} (${setNames.join('、')})`;
                crackTime.textContent = `預估暴力破解時間約：${analysis.crackTime} (${analysis.hardwareName})`;

                if (result.found) {
                    // 密碼已外洩
                    hibpResult.textContent = `⚠️ 警告！此密碼在 HIBP 資料庫出現 ${result.count.toLocaleString('zh-TW')} 次，已被外洩不建議使用`;
                    hibpResult.className = 'result-section danger';
                } else {
                    // 密碼未外洩
                    hibpResult.textContent = '✅ 呼~ HIBP 資料庫未收錄此密碼';
                    hibpResult.className = 'result-section success';
                }
            });
        });
    });

    // 計算SHA-1雜湊函數
    async function calculateSHA1(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hash = await crypto.subtle.digest('SHA-1', data);

        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
    }

    // 查詢HIBP API - 使用 k-匿名查詢模型保護隱私
    async function checkHIBP(prefix, remaining) {
        try {
            // 只傳送雜湊的前5碼到伺服器，保護用戶隱私
            // 伺服器會回傳所有以這5碼開頭的雜湊後綴清單
            const response = await fetch(`${HIBP_CONFIG.API_URL}${prefix}`);
            const text = await response.text();

            // 在本地比對完整雜湊，確保準確性
            // 格式：雜湊後綴:出現次數
            const lines = text.split(HIBP_CONFIG.LINE_SEPARATOR);
            for (const line of lines) {
                const [hashSuffix, count] = line.split(HIBP_CONFIG.HASH_COUNT_SEPARATOR);

                // 比對剩餘的35碼雜湊，確保完全匹配
                if (hashSuffix.toUpperCase() === remaining) {
                    return {
                        found: true,
                        count: parseInt(count, 10)
                    };
                }
            }

            return { found: false };
        } catch (error) {
            console.error('HIBP API 請求失敗:', error);
            return { found: false, error: true };
        }
    }

    // 分析密碼強度
    function analyzePassword(password, hardwareType = 'gpu-consumer') {
        let charPool = 0;
        const hasDigits = REGEX_PATTERNS.DIGITS.test(password);
        const hasLower = REGEX_PATTERNS.LOWERCASE.test(password);
        const hasUpper = REGEX_PATTERNS.UPPERCASE.test(password);
        const hasSymbols = REGEX_PATTERNS.SYMBOLS.test(password);

        if (hasDigits) charPool += CHARSET_SIZES.DIGITS;
        if (hasLower) charPool += CHARSET_SIZES.LOWERCASE;
        if (hasUpper) charPool += CHARSET_SIZES.UPPERCASE;
        if (hasSymbols) charPool += CHARSET_SIZES.SYMBOLS;

        const length = password.length;
        const config = HARDWARE_CONFIGS[hardwareType];

        // 使用不依賴 BigInt 的簡易估算方式
        let estimatedTime = '無法計算';
        try {
            // 使用對數運算避免溢位
            // log(chars^length) = length * log(chars)
            const combinations = length * Math.log(charPool);

            // 硬體雜湊速度的對數值
            const hashSpeed = Math.log(config.hashRate);

            // 計算破解所需秒數的對數值
            const secLog = combinations - hashSpeed;

            // 轉換為實際秒數 (對於小數值) 或估算較大值
            let secs;
            if (secLog < TIME_THRESHOLDS.LOG_CALCULATION_LIMIT) { // 約10億秒以下可以直接計算
                secs = Math.exp(secLog);
                if (secs < TIME_UNITS.SECONDS_PER_MINUTE) {
                    estimatedTime = `${Math.round(secs)} 秒`;
                } else if (secs < TIME_UNITS.SECONDS_PER_HOUR) {
                    estimatedTime = `${Math.round(secs / TIME_UNITS.SECONDS_PER_MINUTE)} 分鐘`;
                } else if (secs < TIME_UNITS.SECONDS_PER_DAY) {
                    estimatedTime = `${Math.round(secs / TIME_UNITS.SECONDS_PER_HOUR)} 小時`;
                } else if (secs < TIME_UNITS.SECONDS_PER_DAY * TIME_UNITS.DAYS_PER_YEAR) {
                    estimatedTime = `${Math.round(secs / TIME_UNITS.SECONDS_PER_DAY)} 天`;
                } else {
                    const years = secs / (TIME_UNITS.SECONDS_PER_DAY * TIME_UNITS.DAYS_PER_YEAR);
                    estimatedTime = `${years.toLocaleString('zh-TW', { maximumFractionDigits: 0 })} 年`;
                }
            } else {
                // 對於非常大的數值，使用科學計數法表示年數
                const years = Math.exp(secLog - Math.log(TIME_UNITS.SECONDS_PER_DAY * TIME_UNITS.DAYS_PER_YEAR));

                if (years < TIME_THRESHOLDS.THOUSAND) {
                    estimatedTime = `${years.toLocaleString('zh-TW', { maximumFractionDigits: 0 })} 年`;
                } else if (years < TIME_THRESHOLDS.MILLION) {
                    estimatedTime = `${(years / TIME_THRESHOLDS.THOUSAND).toLocaleString('zh-TW', { maximumFractionDigits: 0 })} 千年`;
                } else if (years < TIME_THRESHOLDS.BILLION) {
                    estimatedTime = `${(years / TIME_THRESHOLDS.MILLION).toLocaleString('zh-TW', { maximumFractionDigits: 0 })} 百萬年`;
                } else if (years < TIME_THRESHOLDS.TRILLION) {
                    estimatedTime = `${(years / TIME_THRESHOLDS.BILLION).toLocaleString('zh-TW', { maximumFractionDigits: 0 })} 十億年`;
                } else {
                    estimatedTime = `${(years / TIME_THRESHOLDS.TRILLION).toLocaleString('zh-TW', { maximumFractionDigits: 0 })} 兆年`;
                }
            }
        } catch (error) {
            console.error('Error calculating crack time:', error);
            estimatedTime = '計算時發生錯誤，請重試';
        }

        return {
            hasDigits,
            hasLower,
            hasUpper,
            hasSymbols,
            crackTime: estimatedTime,
            hardwareName: config.name
        };
    }
});
