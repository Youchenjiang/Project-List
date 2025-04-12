/* global echarts */

/*
 * 台灣地圖視覺化 - 使用 ECharts 5.3.3
 * 此檔案依賴 ECharts 庫，需在 HTML 中先引入：
 * <script src="https://cdn.bootcdn.net/ajax/libs/echarts/5.3.3/echarts.min.js"></script>
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

// 確保DOM加載完成後再執行初始化
document.addEventListener('DOMContentLoaded', initVisualMap);

// 主函數 - 異步執行地圖初始化
async function initVisualMap() {
    // 檢查 echarts 是否已載入
    if (typeof echarts === 'undefined') {
        console.error('ECharts 庫未載入！請確保在 HTML 中引入了 ECharts。');
        alert('視覺化庫載入失敗。請確保網絡連接正常並刷新頁面。');
        return;
    }

    // 檢查並初始化基本元素
    ensureDOMStructure();

    // 初始化echarts實例
    const myChart = echarts.init(document.querySelector('.geo1'));
    const myChart2 = echarts.init(document.querySelector('.geo2'));
    
    // 設置載入動畫
    myChart.showLoading();
    myChart2.showLoading();
    
    try {
        // 載入地理數據
        const map = await fetch('./roc1.json').then(resp => resp.json());
        const map2 = await fetch('./roc2.json').then(resp => resp.json());
        
        // 載入用戶數據
        const users = await fetch('./users1.json').then(resp => resp.json());
        const users2 = await fetch('./users2.json').then(resp => resp.json());
        
        // 註冊地圖數據
        echarts.registerMap('Taiwan', map);
    //配置地圖        // 設置地圖配置選項
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
                }
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
            },        series: [{
            //圖層名稱
            name: '人口數',
            //圖層類型
            type: 'map',
            //讀取註冊的地圖
            map: 'Taiwan',
            //數據來源
            data: users,
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
        
        myChart.setOption(populationConfig);
        myChart.hideLoading();
        
        // 註冊第二個地圖數據
        echarts.registerMap('Taiwan2', map2);        // 配置第二個地圖
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
                }
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
                data: users2,
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
        
        // 套用配置
        myChart2.setOption(usersConfig);
        myChart2.hideLoading();
        
        // 設置地圖聯動效果
        setupMapLinkage(myChart, myChart2);
        
        // 添加視窗大小調整監聽
        window.addEventListener('resize', function() {
            myChart.resize();
            myChart2.resize();
        });    } catch (error) {
        console.error('地圖數據載入失敗:', error);
        alert('地圖數據載入失敗，請檢查網絡連接並刷新頁面');
    }
}

/**
 * 設置地圖聯動效果
 * @param {Object} chart1 - 第一個地圖實例
 * @param {Object} chart2 - 第二個地圖實例
 */
function setupMapLinkage(chart1, chart2) {
    chart1.on('georoam', function(params) {
        if (params.zoom) {
            chart2.setOption({
                series: [{
                    zoom: params.zoom,
                    center: params.center
                }]
            });
        }
    });
    
    chart2.on('georoam', function(params) {
        if (params.zoom) {
            chart1.setOption({
                series: [{
                    zoom: params.zoom,
                    center: params.center
                }]
            });
        }
    });
}

/**
 * 確保DOM結構完整，如果在框架外運行需要初始化基本元素
 */
function ensureDOMStructure() {
    // 檢查是否在獨立環境運行
    if (!document.querySelector('.geo1') || !document.querySelector('.geo2')) {
        console.log('創建基本DOM結構以確保獨立運行');
        const container = document.createElement('div');
        container.className = 'map-container';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '20px';
        container.style.padding = '20px';
        
        // 創建第一個地圖容器
        const map1Wrapper = document.createElement('div');
        map1Wrapper.style.flex = '1';
        map1Wrapper.style.minWidth = 'calc(50% - 10px)';
        map1Wrapper.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        map1Wrapper.style.borderRadius = '8px';
        map1Wrapper.style.overflow = 'hidden';
        map1Wrapper.style.backgroundColor = '#fff';
        
        const map1Title = document.createElement('div');
        map1Title.style.padding = '10px 15px';
        map1Title.style.borderBottom = '1px solid #eee';
        map1Title.innerHTML = '<h3 style="margin:0;font-size:16px;color:#2c3e50;">台灣各縣市人口分布</h3>';
        
        const map1 = document.createElement('div');
        map1.className = 'geo1';
        map1.style.height = '70vh';
        map1.style.width = '100%';
        
        map1Wrapper.appendChild(map1Title);
        map1Wrapper.appendChild(map1);
        
        // 創建第二個地圖容器
        const map2Wrapper = document.createElement('div');
        map2Wrapper.style.flex = '1';
        map2Wrapper.style.minWidth = 'calc(50% - 10px)';
        map2Wrapper.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        map2Wrapper.style.borderRadius = '8px';
        map2Wrapper.style.overflow = 'hidden';
        map2Wrapper.style.backgroundColor = '#fff';
        
        const map2Title = document.createElement('div');
        map2Title.style.padding = '10px 15px';
        map2Title.style.borderBottom = '1px solid #eee';
        map2Title.innerHTML = '<h3 style="margin:0;font-size:16px;color:#2c3e50;">台灣各縣市用戶分布</h3>';
        
        const map2 = document.createElement('div');
        map2.className = 'geo2';
        map2.style.height = '70vh';
        map2.style.width = '100%';
        
        map2Wrapper.appendChild(map2Title);
        map2Wrapper.appendChild(map2);
        
        // 將兩個地圖容器添加到主容器
        container.appendChild(map1Wrapper);
        container.appendChild(map2Wrapper);
        
        // 添加到文檔主體
        document.body.appendChild(container);
    }
}