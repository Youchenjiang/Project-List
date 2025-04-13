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

// 處理 ECharts 可能不存在的情況（適應不同的執行環境）
(function(global) {
    // 如果在瀏覽器環境中
    if (typeof window !== 'undefined') {
        // 檢查是否已有 echarts 全局對象
        if (typeof window.echarts === 'undefined') {
            // 如果沒有，嘗試創建一個最小的替代對象，並記錄錯誤
            window.echarts = {
                init: function() {
                    console.error('ECharts 庫未載入！請確保在 HTML 中引入了 ECharts。');
                    return {
                        setOption: function() {},
                        on: function() {},
                        resize: function() {},
                        showLoading: function() {},
                        hideLoading: function() {},
                        dispatchAction: function() {}
                    };
                },
                registerMap: function() {
                    console.error('ECharts 庫未載入！無法註冊地圖。');
                }
            };
        }
    }
    // 如果在 Node.js 或其他環境中，可以增加相應的處理
})(typeof window !== 'undefined' ? window : this);

// 全局變量，存儲地圖實例和數據以便重用
const mapModule = {
    charts: {},
    data: {},
    mapRegistered: false
};

// 確保DOM加載完成後再執行初始化
document.addEventListener('DOMContentLoaded', initVisualMap);

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

    // 初始化echarts實例
    const myChart = echarts.init(document.querySelector('.geo1'), null, { renderer: 'canvas' });
    const myChart2 = echarts.init(document.querySelector('.geo2'), null, { renderer: 'canvas' });
    
    // 儲存實例以便後續使用
    mapModule.charts = {
        population: myChart,
        users: myChart2
    };
    
    try {        // 載入地理數據
        const [map, map2, users, users2] = await Promise.all([
            fetch('./taiwan-geo-data1.json').then(resp => resp.json()),
            fetch('./taiwan-geo-data2.json').then(resp => resp.json()),
            fetch('./population-data.json').then(resp => resp.json()),
            fetch('./user-distribution.json').then(resp => resp.json())
        ]);
        
        // 儲存數據以便重用
        mapModule.data = {
            geoData: { taiwan: map, taiwan2: map2 },
            populationData: users,
            usersData: users2
        };
        
        // 註冊地圖數據
        echarts.registerMap('Taiwan', map);
        echarts.registerMap('Taiwan2', map2);
        mapModule.mapRegistered = true;
        
        // 移除載入狀態
        loading1.remove();
        loading2.remove();
        
        // 配置並顯示地圖
        setupPopulationMap(myChart, users);
        setupUsersMap(myChart2, users2);
        
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
function setupPopulationMap(chart, data) {
    const populationConfig = {
        //標題
        title: {
            text: '台灣地圖',
            subtext: '各縣市人口數',
            left: 'center'
        },
        //各區塊提示文字
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>人口: {c} 人',
            backgroundColor: 'rgba(50,50,50,0.9)',
            borderColor: '#3498db',
            textStyle: {
                color: '#fff'
            },
            className: 'custom-tooltip'
        },
        visualMap: {
            //控制條靠左
            left: 'left',
            //控制條靠中
            top: 'center',
            //區間最小值
            min: 0,
            //區間最大值
            max: 4042587,
            //區間界線文字
            text: ['高', '低'],
            //顏色
            calculable: true,
            inRange: {
                color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
            },
            textStyle: {
                color: '#333'
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
            //圖層名稱
            name: '人口數',
            //圖層類型
            type: 'map',
            //讀取註冊的地圖
            map: 'Taiwan',
            //數據來源
            data: data,
            //滑鼠縮放
            roam: true,
            //縮放比例控制
            scaleLimit: {
                min: 0.7,
                max: 3
            },
            // 標籤設置
            label: {
                show: true,
                formatter: '{b}',
                fontSize: 10
            },
            // 強調效果
            emphasis: {
                label: {
                    show: true,
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                itemStyle: {
                    areaColor: '#3498db'
                }
            }
        }]
    };
    
    chart.setOption(populationConfig);
}

/**
 * 配置用戶地圖
 * @param {Object} chart - ECharts 實例
 * @param {Array} data - 用戶數據
 */
function setupUsersMap(chart, data) {
    const usersConfig = {
        //標題
        title: {
            text: '台灣地圖',
            subtext: '各縣市用戶數',
            left: 'center'
        },
        //各區塊提示文字
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>註冊用戶: {c} 人',
            backgroundColor: 'rgba(50,50,50,0.9)',
            borderColor: '#2ecc71',
            textStyle: {
                color: '#fff'
            },
            className: 'custom-tooltip'
        },
        visualMap: {
            //控制條靠左
            left: 'left',
            //控制條靠中
            top: 'center',
            //區間最小值
            min: 0,
            //區間最大值
            max: 50,
            //區間界線文字
            text: ['高', '低'],
            //顏色
            calculable: true,
            inRange: {
                color: ['#e6f7ff', '#c6e6ff', '#95d0fc', '#60b3ff', '#1a88ff']
            },
            textStyle: {
                color: '#333'
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
            //圖層名稱
            name: '用戶數',
            //圖層類型
            type: 'map',
            //讀取註冊的地圖
            map: 'Taiwan2',
            //數據來源
            data: data,
            //滑鼠縮放
            roam: true,
            //縮放比例控制
            scaleLimit: {
                min: 0.7,
                max: 3
            },
            // 標籤設置
            label: {
                show: true,
                formatter: '{b}',
                fontSize: 10
            },
            // 強調效果
            emphasis: {
                label: {
                    show: true,
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                itemStyle: {
                    areaColor: '#2ecc71'
                }
            }
        }]
    };
    
    chart.setOption(usersConfig);
}

/**
 * 設置地圖聯動效果
 * @param {Object} chart1 - 第一個地圖實例
 * @param {Object} chart2 - 第二個地圖實例
 */
function setupMapLinkage(chart1, chart2) {
    chart1.on('georoam', function(params) {
        if (params.zoom !== undefined) {
            chart2.setOption({
                series: [{
                    zoom: params.zoom,
                    center: params.center
                }]
            });
        }
    });
    
    chart2.on('georoam', function(params) {
        if (params.zoom !== undefined) {
            chart1.setOption({
                series: [{
                    zoom: params.zoom,
                    center: params.center
                }]
            });
        }
    });
    
    // 添加選中區域的聯動高亮
    chart1.on('mouseover', {seriesIndex: 0}, function(params) {
        const name = params.name;
        chart2.dispatchAction({
            type: 'highlight',
            name: name
        });
    });
    
    chart1.on('mouseout', {seriesIndex: 0}, function(params) {
        const name = params.name;
        chart2.dispatchAction({
            type: 'downplay',
            name: name
        });
    });
    
    chart2.on('mouseover', {seriesIndex: 0}, function(params) {
        const name = params.name;
        chart1.dispatchAction({
            type: 'highlight',
            name: name
        });
    });
    
    chart2.on('mouseout', {seriesIndex: 0}, function(params) {
        const name = params.name;
        chart1.dispatchAction({
            type: 'downplay',
            name: name
        });
    });
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
                mapModule.charts[chartKey].dispatchAction({
                    type: 'restore'
                });
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
    });
      // 如果有需要，可以添加全局控制區域
    if (mapWrappers.length >= 2) {
        const globalControls = document.createElement('div');
        globalControls.className = 'global-controls';
        globalControls.style.textAlign = 'center';
        globalControls.style.margin = '20px 0';
        
        // 創建重置所有選擇的按鈕
        const resetSelectionBtn = document.createElement('button');
        resetSelectionBtn.textContent = '重置選擇';
        resetSelectionBtn.addEventListener('click', function() {
            // 清除所有地圖上的高亮
            Object.values(mapModule.charts).forEach(chart => {
                chart.dispatchAction({
                    type: 'downplay'
                });
            });
            
            // 重置區域詳情區域
            const regionDetailDiv = document.getElementById('region-detail');
            if (regionDetailDiv) {
                regionDetailDiv.innerHTML = '<p class="instruction">請點擊地圖上的任一地區以顯示詳細資訊</p>';
            }
        });
        
        globalControls.appendChild(resetSelectionBtn);
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
    
    // 計算所有區域的比例數據
    const allResults = mapModule.data.populationData.map(popItem => {
        const userItem = mapModule.data.usersData.find(u => u.name === popItem.name);
        if (!userItem) return null;
        
        const ratio = userItem.value / popItem.value * 10000; // 每萬人用戶數
        return {
            name: popItem.name,
            population: popItem.value,
            users: userItem.value,
            ratio: parseFloat(ratio.toFixed(2))
        };
    }).filter(item => item !== null);
    
    // 計算統計數據
    allResults.sort((a, b) => b.ratio - a.ratio);
    const highestRegion = allResults[0];
    const lowestRegion = allResults[allResults.length-1];
    const averageRatio = parseFloat((allResults.reduce((sum, item) => sum + item.ratio, 0) / allResults.length).toFixed(2));
    
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
            mapModule.charts[chartKey].on('click', function(params) {
                const regionName = params.name;
                showRegionDetail(regionName, regionDetailDiv);
                
                // 高亮顯示所選區域
                Object.values(mapModule.charts).forEach(chart => {
                    chart.dispatchAction({
                        type: 'highlight',
                        name: regionName
                    });
                });
            });
        }
    });
}

/**
 * 獲取標準化的區域名稱（處理「台」和「臺」的差異）
 * @param {string} name - 原始區域名稱
 * @returns {string} 標準化後的名稱
 */
function getNormalizedRegionName(name) {
    // 建立台灣地名對照表
    const nameMapping = {
        '台北市': '臺北市', '臺北市': '台北市',
        '台中市': '臺中市', '臺中市': '台中市',
        '台南市': '臺南市', '臺南市': '台南市',
        '台東縣': '臺東縣', '臺東縣': '台東縣',
        '桃園市': '桃園縣', '桃園縣': '桃園市'
    };
    
    // 返回對照表中的名稱，若沒有則返回原名
    return nameMapping[name] || name;
}

/**
 * 顯示特定區域的詳細比較數據
 * @param {string} regionName - 區域名稱
 * @param {HTMLElement} detailContainer - 顯示詳細信息的容器
 */
function showRegionDetail(regionName, detailContainer) {
    // 查找區域數據，考慮可能的名稱差異
    const normalizedName = getNormalizedRegionName(regionName);
    
    let populationData = mapModule.data.populationData.find(item => item.name === regionName);
    let userData = mapModule.data.usersData.find(item => item.name === regionName);
    
    // 如果找不到直接匹配的數據，嘗試使用標準化名稱
    if (!populationData) {
        populationData = mapModule.data.populationData.find(item => item.name === normalizedName);
    }
    
    if (!userData) {
        userData = mapModule.data.usersData.find(item => 
            item.name === normalizedName || 
            getNormalizedRegionName(item.name) === regionName
        );
    }
    
    if (!populationData || !userData) {
        detailContainer.innerHTML = `<p class="error">無法找到 ${regionName} 的完整數據</p>`;
        return;
    }
    
    // 計算比例
    const ratio = userData.value / populationData.value * 10000; // 每萬人用戶數
    
    // 計算全台平均值（用於比較）
    const allRatios = mapModule.data.populationData.map(popItem => {
        const userItem = mapModule.data.usersData.find(u => u.name === popItem.name);
        if (!userItem) return null;
        return userItem.value / popItem.value * 10000;
    }).filter(r => r !== null);
    
    const averageRatio = allRatios.reduce((sum, r) => sum + r, 0) / allRatios.length;
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
        
        const container = document.createElement('div');
        container.className = 'map-container';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '20px';
        container.style.padding = '20px';
        
        // 創建第一個地圖容器
        const map1Wrapper = document.createElement('div');
        map1Wrapper.className = 'map-wrapper';
        map1Wrapper.style.flex = '1';
        map1Wrapper.style.minWidth = 'calc(50% - 10px)';
        map1Wrapper.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        map1Wrapper.style.borderRadius = '8px';
        map1Wrapper.style.overflow = 'hidden';
        map1Wrapper.style.backgroundColor = '#fff';
        
        const map1Title = document.createElement('h2');
        map1Title.textContent = '台灣人口分布';
        map1Title.style.padding = '10px 15px';
        map1Title.style.margin = '0';
        map1Title.style.borderBottom = '1px solid #eee';
        map1Title.style.backgroundColor = '#f8f9fa';
        map1Title.style.textAlign = 'center';
        
        const map1 = document.createElement('div');
        map1.className = 'geo1';
        map1.style.height = '500px';
        map1.style.width = '100%';
        
        map1Wrapper.appendChild(map1Title);
        map1Wrapper.appendChild(map1);
        
        // 創建第二個地圖容器
        const map2Wrapper = document.createElement('div');
        map2Wrapper.className = 'map-wrapper';
        map2Wrapper.style.flex = '1';
        map2Wrapper.style.minWidth = 'calc(50% - 10px)';
        map2Wrapper.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        map2Wrapper.style.borderRadius = '8px';
        map2Wrapper.style.overflow = 'hidden';
        map2Wrapper.style.backgroundColor = '#fff';
        
        const map2Title = document.createElement('h2');
        map2Title.textContent = '台灣用戶分布';
        map2Title.style.padding = '10px 15px';
        map2Title.style.margin = '0';
        map2Title.style.borderBottom = '1px solid #eee';
        map2Title.style.backgroundColor = '#f8f9fa';
        map2Title.style.textAlign = 'center';
        
        const map2 = document.createElement('div');
        map2.className = 'geo2';
        map2.style.height = '500px';
        map2.style.width = '100%';
        
        map2Wrapper.appendChild(map2Title);
        map2Wrapper.appendChild(map2);
        
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