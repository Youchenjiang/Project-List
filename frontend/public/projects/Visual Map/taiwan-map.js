/* global echarts */

/*
 * 台灣地圖視覺化 - 使用 ECharts 5.3.3
 * 此檔案依賴 ECharts 庫，需在 HTML 中先引入：
 * <script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.3.3/echarts.min.js"></script>
 * 或使用本地文件: <script src="./echarts.min.js"></script>
 * 
 * 使用地圖需要兩部分數據:
 * 1. GEOJSON格式的地理數據，該資訊將作為地圖背景板
 * 2. 在地圖背景板上要進行顯示或交互的數據，該數據將作為地圖上的圖層
 *
 * 特性:
 * - 支持響應式設計
 * - 雙地圖聯動
 * - 可獨立運行，不依賴框架
 * - 支持滑鼠縮放與平移
 * - 支持數據比較與分析
 * 
 * @version 1.1.0
 * @last-updated 2025-04-12
 */

// 處理 ECharts 可能不存在的情況
(function() {
    if (typeof window !== 'undefined' && typeof window.echarts === 'undefined') {
        // 創建簡易替代對象並記錄錯誤
        const mockFn = () => {};
        const mockObj = { setOption: mockFn, on: mockFn, resize: mockFn, showLoading: mockFn, hideLoading: mockFn, dispatchAction: mockFn };
        window.echarts = {
            init: function() {
                console.error('ECharts 庫未載入！請確保在 HTML 中引入了 ECharts。');
                return mockObj;
            },
            registerMap: function() {
                console.error('ECharts 庫未載入！無法註冊地圖。');
            }
        };
    }
})();

// 全局變量，存儲地圖實例和數據以便重用
// 定義模組配置和狀態管理
const mapModule = {
    charts: {},            // 存儲地圖實例
    data: {},              // 存儲地圖數據
    mapRegistered: false,  // 地圖是否已註冊
    selectedRegion: null,  // 追蹤當前選中的區域
    mapLinkageEnabled: true, // 控制地圖聯動功能
    config: {
        animation: true,     // 控制動畫效果
        duration: 300,      // 過渡動畫時長
        theme: 'default'    // 地圖主題
    }
};

// 確保DOM加載完成後再執行初始化
document.addEventListener('DOMContentLoaded', initVisualMap);

/**
 * 載入所有地圖數據，同時處理快取和錯誤重試
 * @returns {Promise<void>}
 */
async function loadMapData() {
    // 檢查是否已有快取數據
    const cachedData = checkLocalCache();
    if (cachedData) {
        console.log('使用本地快取數據');
        setupCachedData(cachedData);
        return;
    }

    // 最多重試3次載入
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        try {
            // 載入地理數據，使用Promise.all並行請求提高效率
            const [map, map2, users, users2] = await Promise.all([
                fetchWithTimeout('./taiwan-geo-data1.json', 5000),
                fetchWithTimeout('./taiwan-geo-data2.json', 5000),
                fetchWithTimeout('./population-data.json', 5000),
                fetchWithTimeout('./user-distribution.json', 5000)
            ]);
            
            // 儲存數據以便重用
            const dataToStore = {
                geoData: { taiwan: map, taiwan2: map2 },
                populationData: users,
                usersData: users2,
                timestamp: Date.now()
            };

            mapModule.data = dataToStore;
            
            // 註冊地圖數據
            echarts.registerMap('Taiwan', map);
            echarts.registerMap('Taiwan2', map2);
            mapModule.mapRegistered = true;
            
            // 將數據儲存到本地快取
            storeLocalCache(dataToStore);
            
            return;
        } catch (err) {
            attempts++;
            console.warn(`數據載入失敗，第${attempts}次重試`, err);
            
            if (attempts >= maxAttempts) {
                throw new Error('無法載入地圖數據，請檢查網絡連接');
            }
            
            // 指數退避策略，避免頻繁請求
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
    }
}

/**
 * 支援逾時的資源請求
 * @param {string} url - 請求URL
 * @param {number} timeout - 逾時時間（毫秒）
 * @returns {Promise<any>} 解析後的JSON數據
 */
async function fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (e) {
        clearTimeout(timeoutId);
        throw e;
    }
}

/**
 * 檢查本地快取是否可用
 * @returns {object|null} 快取的數據對象或null
 */
function checkLocalCache() {
    try {
        const cachedData = localStorage.getItem('taiwan_map_data');
        if (!cachedData) return null;
        
        const data = JSON.parse(cachedData);
        const now = Date.now();
        
        // 檢查快取是否已過期（24小時）
        if (now - data.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('taiwan_map_data');
            return null;
        }
        
        return data;
    } catch (e) {
        console.warn('讀取快取失敗', e);
        return null;
    }
}

/**
 * 將數據存儲到本地快取
 * @param {object} data - 要快取的數據
 */
function storeLocalCache(data) {
    try {
        const serialized = JSON.stringify(data);
        localStorage.setItem('taiwan_map_data', serialized);
        console.log('數據已存入本地快取');
    } catch (e) {
        console.warn('無法存儲快取數據', e);
    }
}

/**
 * 設置快取數據
 * @param {object} cachedData - 快取數據
 */
function setupCachedData(cachedData) {
    mapModule.data = cachedData;
    
    // 註冊地圖數據
    echarts.registerMap('Taiwan', cachedData.geoData.taiwan);
    echarts.registerMap('Taiwan2', cachedData.geoData.taiwan2);
    mapModule.mapRegistered = true;
}

/**
 * 顯示加載狀態或錯誤訊息
 * @param {HTMLElement} element - 要顯示加載狀態的容器元素
 * @param {string} message - 顯示的訊息
 * @param {string} type - 類型 ('loading' 或 'error')
 * @returns {HTMLElement} 創建的覆蓋層元素
 */
function showOverlay(element, message, type = 'loading') {
    // 確保容器是相對定位
    if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }

    const overlay = document.createElement('div');
    overlay.className = type === 'loading' ? 'loading-overlay' : 'error-overlay';
    
    if (type === 'loading') {
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div>${message || '資料載入中...'}</div>
        `;
    } else {
        overlay.innerHTML = `
            <div class="error-icon">⚠️</div>
            <div>${message || '發生錯誤'}</div>
        `;
    }
    
    element.appendChild(overlay);
    return overlay;
}

// 主函數 - 異步執行地圖初始化
/**
 * 初始化視覺化地圖並載入數據
 * 使用非同步處理以優化載入體驗
 * @returns {Promise<void>}
 */
async function initVisualMap() {
    // 檢查 echarts 是否已載入
    if (typeof echarts === 'undefined') {
        console.error('ECharts 庫未載入！請確保在 HTML 中引入了 ECharts。');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = '視覺化庫載入失敗。請確保網絡連接正常並刷新頁面。';
        document.body.insertBefore(errorDiv, document.body.firstChild);
        return;
    }
      // 設定高效能渲染模式，根據裝置性能決定最佳渲染器
    const renderer = window.devicePixelRatio > 1 || window.innerWidth > 1200 ? 'canvas' : 'svg';
    console.log(`使用 ${renderer} 渲染模式以優化效能`);

    // 檢查並初始化基本元素
    ensureDOMStructure();
    
    // 獲取地圖容器元素
    const container1 = document.querySelector('.geo1').parentElement;
    const container2 = document.querySelector('.geo2').parentElement;
    
    // 顯示載入狀態
    const loading1 = showOverlay(container1, '人口數據載入中...');
    const loading2 = showOverlay(container2, '用戶數據載入中...');
    
    // 更新頁腳中的資料時間
    updateFooterDate();

    // 初始化echarts實例，使用最適合當前裝置的渲染器
    const mapOptions = { 
        renderer: renderer,
        devicePixelRatio: window.devicePixelRatio || 1
    };
    
    // 基於配置中的設定應用動畫
    if (mapModule.config.animation === false) {
        mapOptions.animation = false;
    }
    
    const myChart = echarts.init(document.querySelector('.geo1'), null, mapOptions);
    const myChart2 = echarts.init(document.querySelector('.geo2'), null, mapOptions);
    
    // 儲存實例以便後續使用
    mapModule.charts = {
        population: myChart,
        users: myChart2
    };
    try {
        // 載入所有地圖數據並配置
        await loadMapData();
          // 配置並顯示地圖
        setupPopulationMap(myChart, mapModule.data.populationData);
        setupUsersMap(myChart2, mapModule.data.usersData);
        
        // 移除載入狀態
        setTimeout(() => {
            loading1.remove();
            loading2.remove();
        }, 300); // 短暫延遲確保地圖渲染完成後才移除載入狀態
        
        // 設置地圖聯動效果
        setupMapLinkage(myChart, myChart2);
        
        // 添加視窗大小調整監聽
        window.addEventListener('resize', function() {
            myChart.resize();
            myChart2.resize();
        });
          // 添加地圖控制按鈕
        setupMapControls();
        
        // 創建數據分析區域
        createDataAnalysisArea();
        
        // 設置地圖區域點擊事件處理
        setupRegionClickHandler();
        
    } catch (error) {
        console.error('地圖數據載入失敗:', error);
        
        // 顯示錯誤訊息
        loading1.remove();
        loading2.remove();
        showOverlay(container1, '地圖數據載入失敗，請檢查網絡連接並刷新頁面', 'error');
        showOverlay(container2, '地圖數據載入失敗，請檢查網絡連接並刷新頁面', 'error');
    }
}

/**
 * 更新頁腳中的日期資訊
 */
function updateFooterDate() {
    const footerDateElem = document.querySelector('footer p:first-child');
    if (footerDateElem) {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
        footerDateElem.textContent = `資料更新時間: ${formattedDate}`;
    }
}

/**
 * 配置人口地圖
 * @param {Object} chart - ECharts 實例
 * @param {Array} data - 人口數據
 */
/**
 * 創建地圖基礎配置
 * @param {string} title - 地圖標題
 * @param {string} subtitle - 地圖副標題
 * @param {string} tooltipText - 提示文本格式
 * @param {string} mapName - 地圖名稱
 * @param {Array} data - 地圖數據
 * @param {number} maxValue - 最大值
 * @param {Array} colors - 顏色範圍
 * @param {string} emphasisColor - 強調顏色
 * @returns {Object} 地圖配置對象
 */
function createMapConfig(title, subtitle, tooltipText, mapName, data, maxValue, colors, emphasisColor) {
    return {
        title: {
            text: title,
            subtext: subtitle,
            left: 'center'
        },        tooltip: {
            trigger: 'item',
            formatter: `{b}<br/>${tooltipText}: {c} 人`,
            backgroundColor: 'rgba(50,50,50,0.9)',
            borderColor: emphasisColor,
            textStyle: { color: '#fff' }
        },
        visualMap: {
            left: 'left',
            top: 'center',
            min: 0,
            max: maxValue,
            text: ['高', '低'],
            calculable: true,
            inRange: { color: colors },
            textStyle: {
                color: '#333',
                fontWeight: 'bold'
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        series: [{
            name: subtitle,
            type: 'map',
            map: mapName,
            data: data,
            roam: true,
            scaleLimit: {
                min: 0.7,
                max: 3
            },
            label: {
                show: true,
                formatter: '{b}',
                fontSize: 10
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                itemStyle: {
                    areaColor: emphasisColor
                }
            }
        }]
    };
}

/**
 * 配置人口地圖
 * @param {Object} chart - ECharts 實例
 * @param {Array} data - 人口數據
 */
function setupPopulationMap(chart, data) {
    const config = createMapConfig(
        '台灣地圖',
        '各縣市人口數',
        '人口',
        'Taiwan',
        data,
        4042587,
        ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
        '#3498db'
    );
    
    chart.setOption(config);
}

/**
 * 配置用戶地圖
 * @param {Object} chart - ECharts 實例
 * @param {Array} data - 用戶數據
 */
function setupUsersMap(chart, data) {
    const config = createMapConfig(
        '台灣地圖',
        '各縣市用戶數',
        '註冊用戶',
        'Taiwan2',
        data,
        50,
        ['#e6f7ff', '#c6e6ff', '#95d0fc', '#60b3ff', '#1a88ff'],
        '#2ecc71'
    );
    
    chart.setOption(config);
}

/**
 * 設置地圖聯動效果
 * @param {Object} chart1 - 第一個地圖實例
 * @param {Object} chart2 - 第二個地圖實例
 */
function setupMapLinkage(chart1, chart2) {
    // 記錄是否正在處理聯動，避免無限循環
    let isProcessingLinkage = false;
    
    // 獲取圖表當前視圖狀態的函數
    function getChartViewState(chart) {
        if (!chart || !chart.getOption()) return null;
        
        const option = chart.getOption();
        if (!option.series || !option.series[0]) return null;
        
        return {
            zoom: option.series[0].zoom || 1,
            center: option.series[0].center || null
        };
    }
    
    // 同步兩個地圖視圖的函數
    function syncMapViews(sourceChart, targetChart, viewState) {
        // 如果聯動被禁用或正在處理聯動，則不操作
        if (!mapModule.mapLinkageEnabled || isProcessingLinkage) return;
        
        try {
            // 設置標誌，避免觸發循環聯動
            isProcessingLinkage = true;
            
            // 檢查是否有有效的視圖狀態
            if (!viewState || viewState.zoom === undefined) return;
            
            // 同步目標地圖的視圖
            targetChart.setOption({
                series: [{
                    zoom: viewState.zoom,
                    center: viewState.center || undefined
                }]
            }, { notMerge: false, lazyUpdate: true, silent: true });
            
        } finally {
            // 確保處理完成後重置標誌
            setTimeout(() => {
                isProcessingLinkage = false;
            }, 50);
        }
    }
    
    // 設置地圖縮放和平移事件處理
    chart1.off('georoam').on('georoam', function() {
        // 使用延遲以確保獲取最新狀態
        setTimeout(() => {
            const state = getChartViewState(chart1);
            syncMapViews(chart1, chart2, state);
        }, 0);
    });
    
    chart2.off('georoam').on('georoam', function() {
        // 使用延遲以確保獲取最新狀態
        setTimeout(() => {
            const state = getChartViewState(chart2);
            syncMapViews(chart2, chart1, state);
        }, 0);
    });
    
    // 添加選中區域的聯動高亮
    // 使用函式來減少重複程式碼
    function setupHoverLink(sourceChart, targetChart) {
        sourceChart.off('mouseover').on('mouseover', {seriesIndex: 0}, function(params) {
            if (!mapModule.mapLinkageEnabled) return; // 如果聯動被禁用，則不進行操作
            
            targetChart.dispatchAction({
                type: 'highlight',
                name: params.name
            });
        });
        
        sourceChart.off('mouseout').on('mouseout', {seriesIndex: 0}, function(params) {
            if (!mapModule.mapLinkageEnabled) return; // 如果聯動被禁用，則不進行操作
            
            targetChart.dispatchAction({
                type: 'downplay',
                name: params.name
            });
        });
    }
    
    // 雙向設置懸停聯動
    setupHoverLink(chart1, chart2);
    setupHoverLink(chart2, chart1);
    
    // 提供切換聯動功能的函數
    mapModule.toggleMapLinkage = function(enable) {
        mapModule.mapLinkageEnabled = enable;
        
        // 如果啟用聯動，立即同步兩個地圖的視圖
        if (enable) {
            // 取較新狀態的圖表作為基準來同步
            setTimeout(() => {
                const state1 = getChartViewState(chart1);
                const state2 = getChartViewState(chart2);
                
                if (state1 && state2) {
                    // 使用第一個地圖的視圖狀態同步第二個地圖
                    syncMapViews(chart1, chart2, state1);
                }
            }, 0);
        }
    };
}

/**
 * 設置地圖控制按鈕
 */
function setupMapControls() {
    // 獲取地圖容器
    const container = document.querySelector('.map-container');
    if (!container) return;
    
    // 為每個地圖創建控制區域
    const mapWrappers = container.querySelectorAll('.map-wrapper');
    
    mapWrappers.forEach((wrapper, index) => {
        const controls = document.createElement('div');
        controls.className = 'map-controls';
          // 創建重置視圖按鈕
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重設視圖';
        resetBtn.addEventListener('click', function() {
            const chartKey = index === 0 ? 'population' : 'users';
            if (mapModule.charts[chartKey]) {
                // 恢復視圖狀態（縮放和平移）
                mapModule.charts[chartKey].dispatchAction({
                    type: 'restore'
                });
                  // 清除選中區域的高亮效果
                mapModule.charts[chartKey].dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0
                });
                
                // 特別移除選中狀態
                mapModule.charts[chartKey].dispatchAction({
                    type: 'unselect',
                    seriesIndex: 0
                });
                
                // 如果當前點擊的地圖是最後選中的區域，也要清除選中狀態
                if (mapModule.selectedRegion) {
                    mapModule.selectedRegion = null;
                    
                    // 清除所有地圖的選中狀態
                    Object.values(mapModule.charts).forEach(chart => {
                        chart.dispatchAction({
                            type: 'unselect',
                            seriesIndex: 0
                        });
                    });
                    
                    // 重置區域詳情區域
                    const regionDetailDiv = document.getElementById('region-detail');
                    if (regionDetailDiv) {
                        regionDetailDiv.innerHTML = '<p class="instruction">請點擊地圖上的任一地區以顯示詳細資訊</p>';
                    }
                }
            }
        });
          // 創建開關標籤顯示按鈕
        const toggleLabelsBtn = document.createElement('button');
        toggleLabelsBtn.textContent = '隱藏標籤';
        toggleLabelsBtn.setAttribute('data-show-labels', 'true');
        toggleLabelsBtn.addEventListener('click', function() {
            const chartKey = index === 0 ? 'population' : 'users';
            const showLabels = toggleLabelsBtn.getAttribute('data-show-labels') === 'true';
            
            if (mapModule.charts[chartKey]) {
                mapModule.charts[chartKey].setOption({
                    series: [{
                        label: {
                            show: !showLabels
                        }
                    }]
                });
                
                // 更新按鈕狀態和文字
                toggleLabelsBtn.setAttribute('data-show-labels', (!showLabels).toString());
                toggleLabelsBtn.textContent = !showLabels ? '隱藏標籤' : '顯示標籤';
            }
        });
        
        // 將按鈕添加到控制區域
        controls.appendChild(resetBtn);
        controls.appendChild(toggleLabelsBtn);
        
        // 將控制區域添加到地圖包裝器
        wrapper.appendChild(controls);
    });      // 如果有需要，可以添加全局控制區域
    if (mapWrappers.length >= 2) {
        const globalControls = document.createElement('div');
        globalControls.className = 'global-controls';
        globalControls.style.textAlign = 'center';
        globalControls.style.margin = '20px 0';        // 創建重置所有選擇的按鈕
        const resetSelectionBtn = document.createElement('button');
        resetSelectionBtn.textContent = '重置選擇';
        resetSelectionBtn.addEventListener('click', function() {
            // 清除選中記錄
            mapModule.selectedRegion = null;
            
            // 重置區域詳情區域
            const regionDetailDiv = document.getElementById('region-detail');
            if (regionDetailDiv) {
                regionDetailDiv.innerHTML = '<p class="instruction">請點擊地圖上的任一地區以顯示詳細資訊</p>';
            }
            
            // 直接修改每個地圖的選中樣式設定，強制清除選中效果
            Object.values(mapModule.charts).forEach(chart => {
                // 徹底重置地圖 - 完全重新設置option
                const option = chart.getOption();
                if (option && option.series && option.series[0]) {
                    // 先使用 toolbox 的 restore 功能
                    chart.dispatchAction({
                        type: 'restore'
                    });
                    
                    // 然後直接重設選中樣式
                    const newOption = {
                        series: [{
                            select: {
                                disabled: true  // 禁用選中效果
                            },
                            selectedMode: false,  // 禁用選中模式
                            data: option.series[0].data  // 保持原始數據
                        }]
                    };
                    
                    // 重新設置地圖選項
                    chart.setOption(newOption, false);
                    
                    // 然後再重新啟用選中效果
                    setTimeout(() => {
                        chart.setOption({
                            series: [{
                                select: {
                                    disabled: false
                                },
                                selectedMode: 'single'
                            }]
                        }, false);
                    }, 100);
                }
            });
            
            // 顯示操作成功的提示訊息
            const container = document.querySelector('.map-container');
            if (container) {
                const message = document.createElement('div');
                message.className = 'success-message';
                message.textContent = '已重置所有選擇狀態';
                message.style.position = 'fixed';
                message.style.top = '20px';
                message.style.left = '50%';
                message.style.transform = 'translateX(-50%)';
                message.style.backgroundColor = 'rgba(46, 204, 113, 0.9)';
                message.style.color = 'white';
                message.style.padding = '10px 20px';
                message.style.borderRadius = '4px';
                message.style.zIndex = '9999';
                message.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                document.body.appendChild(message);
                
                // 消息顯示 2 秒後消失
                setTimeout(() => {
                    message.style.opacity = '0';
                    message.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => message.remove(), 500);
                }, 2000);
            }
        });
        
        // 創建地圖聯動切換按鈕
        const toggleLinkageBtn = document.createElement('button');
        toggleLinkageBtn.textContent = '關閉地圖聯動';
        toggleLinkageBtn.className = 'linkage-toggle-btn';
        toggleLinkageBtn.setAttribute('data-linkage-enabled', 'true');
        toggleLinkageBtn.addEventListener('click', function() {
            const isEnabled = toggleLinkageBtn.getAttribute('data-linkage-enabled') === 'true';
            const newState = !isEnabled;
            
            // 切換聯動狀態
            if (typeof mapModule.toggleMapLinkage === 'function') {
                mapModule.toggleMapLinkage(newState);
            }
            
            // 更新按鈕文字和狀態
            toggleLinkageBtn.textContent = newState ? '關閉地圖聯動' : '開啟地圖聯動';
            toggleLinkageBtn.setAttribute('data-linkage-enabled', newState.toString());
            
            // 可視化反饋
            toggleLinkageBtn.classList.toggle('disabled', !newState);
        });
        
        globalControls.appendChild(resetSelectionBtn);
        globalControls.appendChild(toggleLinkageBtn);
        container.parentNode.insertBefore(globalControls, container.nextSibling);
    }
}

/**
 * 創建數據分析區域，顯示整體統計數據和交互比較功能
 * @returns {HTMLElement} 創建的分析區域元素
 */
function createDataAnalysisArea() {
    if (!mapModule.data.populationData || !mapModule.data.usersData) {
        console.error('數據不可用，無法進行比較');
        return null;
    }
    
    // 使用通用函數計算區域比例和統計數據
    const { highestRegion, lowestRegion, averageRatio } = calculateRegionRatios();
    
    // 創建數據分析區域
    let analysisDiv = document.querySelector('.data-analysis');
    if (!analysisDiv) {
        analysisDiv = document.createElement('div');
        analysisDiv.className = 'data-analysis';
        
        // 添加到頁面
        const container = document.querySelector('.map-container');
        if (container) {
            container.parentNode.insertBefore(analysisDiv, container.nextSibling);
        } else {
            document.body.appendChild(analysisDiv);
        }
    }
    
    // 設置基本統計數據
    analysisDiv.innerHTML = `
        <h3>人口與用戶數據比較分析</h3>
        <div class="analysis-summary">
            <div class="analysis-stat">
                <span class="stat-label">每萬人用戶數最高:</span>
                <span class="stat-value">${highestRegion.name} (${highestRegion.ratio})</span>
            </div>
            <div class="analysis-stat">
                <span class="stat-label">每萬人用戶數最低:</span>
                <span class="stat-value">${lowestRegion.name} (${lowestRegion.ratio})</span>
            </div>
            <div class="analysis-stat">
                <span class="stat-label">全台平均值:</span>
                <span class="stat-value">${averageRatio}</span>
            </div>
        </div>
        <div class="analysis-detail">
            <h4>點擊地圖區域可查看詳細數據</h4>
            <div id="region-detail" class="region-detail">
                <p class="instruction">請點擊地圖上的任一地區以顯示詳細資訊</p>
            </div>
        </div>
    `;
    
    return analysisDiv;
}

/**
 * 設置地圖點擊事件，顯示區域詳細比較數據
 */
function setupRegionClickHandler() {
    // 確保分析區域已經創建
    let analysisDiv = document.querySelector('.data-analysis');
    if (!analysisDiv) {
        analysisDiv = createDataAnalysisArea();
    }
    
    if (!analysisDiv) return; // 如果仍然無法創建則退出
    
    const regionDetailDiv = document.getElementById('region-detail');
    if (!regionDetailDiv) return;
    
    // 為兩個地圖添加點擊事件
    ['population', 'users'].forEach(chartKey => {
        if (mapModule.charts[chartKey]) {
            mapModule.charts[chartKey].on('click', function(params) {                const regionName = params.name;
                  // 不管是否點擊同一個區域，都顯示詳細資訊並保持選中狀態
                // 顯示區域詳細資訊
                showRegionDetail(regionName, regionDetailDiv);
                
                // 如果之前已選中區域，先清除高亮
                if (mapModule.selectedRegion) {
                    Object.values(mapModule.charts).forEach(chart => {
                        chart.dispatchAction({
                            type: 'downplay',
                            seriesIndex: 0
                        });
                    });
                }
                
                // 在兩個地圖上設置新選中區域的高亮
                Object.values(mapModule.charts).forEach(chart => {
                    // 使用 select 類型而不是 highlight，確保選中效果持續存在
                    chart.dispatchAction({
                        type: 'select',
                        seriesIndex: 0,
                        name: regionName
                    });
                });
                  // 更新選中區域
                mapModule.selectedRegion = regionName;
            });
        }
    });
}

// 已刪除 getNormalizedRegionName 函數，因為縣市名稱已統一

/**
 * 計算所有區域的人口與用戶比例數據
 * @returns {Object} 包含所有比例數據和統計信息
 */
function calculateRegionRatios() {
    if (!mapModule.data.populationData || !mapModule.data.usersData) {
        console.error('數據不可用，無法計算比例');
        return { highestRegion: null, lowestRegion: null, averageRatio: 0 };
    }

    // 計算所有區域的比例數據
    const allResults = mapModule.data.populationData.map(popItem => {
        const userItem = mapModule.data.usersData.find(u => u.name === popItem.name);
        if (!userItem || !popItem.value || popItem.value <= 0) return null;
        
        const ratio = userItem.value / popItem.value * 10000; // 每萬人用戶數
        return {
            name: popItem.name,
            population: popItem.value,
            users: userItem.value,
            ratio: parseFloat(ratio.toFixed(2))
        };
    }).filter(item => item !== null);
    
    if (allResults.length === 0) {
        return { highestRegion: null, lowestRegion: null, averageRatio: 0 };
    }

    // 計算統計數據
    allResults.sort((a, b) => b.ratio - a.ratio);
    const highestRegion = allResults[0];
    const lowestRegion = allResults[allResults.length-1];
    const averageRatio = parseFloat((allResults.reduce((sum, item) => sum + item.ratio, 0) / allResults.length).toFixed(2));

    // 只返回需要使用的數據，不再返回 allResults
    return { highestRegion, lowestRegion, averageRatio };
}

/**
 * 顯示特定區域的詳細比較數據
 * @param {string} regionName - 區域名稱
 * @param {HTMLElement} detailContainer - 顯示詳細信息的容器
 */
function showRegionDetail(regionName, detailContainer) {    // 直接查找區域數據，因為縣市名稱已統一
    let populationData = mapModule.data.populationData.find(item => item.name === regionName);
    let userData = mapModule.data.usersData.find(item => item.name === regionName);
      if (!populationData || !userData) {
        detailContainer.innerHTML = `<p class="error">無法找到 ${regionName} 的完整數據</p>`;
        return;
    }
    
    // 確保數據值有效
    if (!populationData.value || populationData.value <= 0) {
        detailContainer.innerHTML = `<p class="error">${regionName} 的人口數據無效</p>`;
        return;
    }
    
    // 計算比例
    const ratio = userData.value / populationData.value * 10000; // 每萬人用戶數
    
    // 使用共用函數獲取全台平均值
    const { averageRatio } = calculateRegionRatios();
    const comparedToAvg = parseFloat(((ratio / averageRatio - 1) * 100).toFixed(1));
    const comparedClass = comparedToAvg >= 0 ? 'above-average' : 'below-average';
    const comparedText = comparedToAvg >= 0 ? `高於平均 ${Math.abs(comparedToAvg)}%` : `低於平均 ${Math.abs(comparedToAvg)}%`;
    
    // 顯示詳細數據
    detailContainer.innerHTML = `
        <h4>${regionName} 詳細數據</h4>
        <div class="region-stats">
            <div class="region-stat">
                <div class="stat-name">總人口數:</div>
                <div class="stat-value">${populationData.value.toLocaleString('zh-TW')} 人</div>
            </div>
            <div class="region-stat">
                <div class="stat-name">註冊用戶數:</div>
                <div class="stat-value">${userData.value.toLocaleString('zh-TW')} 人</div>
            </div>
            <div class="region-stat highlight">
                <div class="stat-name">每萬人用戶數:</div>
                <div class="stat-value">${parseFloat(ratio.toFixed(2))}</div>
            </div>
            <div class="region-stat ${comparedClass}">
                <div class="stat-name">與全台平均比較:</div>
                <div class="stat-value">${comparedText}</div>
            </div>
        </div>
    `;
}

/**
 * 確保DOM結構完整，如果在框架外運行需要初始化基本元素
 */
/**
 * 創建地圖容器元素
 * @param {string} title - 地圖標題
 * @param {string} className - 地圖容器的 CSS 類名
 * @returns {HTMLElement} 地圖容器元素
 */
function createMapWrapper(title, className) {
    const wrapper = document.createElement('div');
    wrapper.className = 'map-wrapper';
    
    const titleElem = document.createElement('h2');
    titleElem.textContent = title;
    
    const mapContainer = document.createElement('div');
    mapContainer.className = className;
    
    wrapper.appendChild(titleElem);
    wrapper.appendChild(mapContainer);
    
    return wrapper;
}

/**
 * 確保DOM結構完整，如果在框架外運行需要初始化基本元素
 */
function ensureDOMStructure() {
    // 檢查是否在獨立環境運行
    if (!document.querySelector('.geo1') || !document.querySelector('.geo2')) {
        console.log('創建基本DOM結構以確保獨立運行');
        
        // 創建頁面標題
        const header = document.createElement('header');
        header.innerHTML = `
            <h1>台灣地理視覺化數據</h1>
            <p>透過互動式地圖探索台灣各縣市數據</p>
        `;
        document.body.appendChild(header);
        
        // 創建地圖容器
        const container = document.createElement('div');
        container.className = 'map-container';
        
        // 使用輔助函數創建地圖容器
        const map1Wrapper = createMapWrapper('台灣人口分布', 'geo1');
        const map2Wrapper = createMapWrapper('台灣用戶分布', 'geo2');
        
        // 將兩個地圖容器添加到主容器
        container.appendChild(map1Wrapper);
        container.appendChild(map2Wrapper);
        
        // 創建頁腳
        const footer = document.createElement('footer');
        footer.innerHTML = `
            <p>資料更新時間: ${new Date().getFullYear()}年</p>
            <p>© 地理資訊視覺化專案</p>
        `;
        
        // 添加到文檔主體
        document.body.appendChild(container);
        document.body.appendChild(footer);
        
        // 添加基本樣式
        if (!document.querySelector('link[href="styles.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'styles.css';
            document.head.appendChild(link);
        }
    }
}