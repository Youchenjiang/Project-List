/*
使用地圖需要兩部分數據:
1.GEOJSON格式的地理數據，該資訊將作為地圖背景板
2.在地圖背景板上要進行顯示或交互的數據，該數據將作為地圖上的圖層
*/
(async function () {
    //初始化echarts實例，準備調用其中的方法
    const myChart = echarts.init(document.querySelector('.geo1'));
    //調用載入效果
    myChart.showLoading();
    //載入地理數據
    const map = await fetch('./roc1.json').then(resp => resp.json());
    //載入用戶數據
    const users = await fetch('./users1.json').then(resp => resp.json());
    //註冊地圖數據
    echarts.registerMap('Taiwan', map);
    //配置地圖
    myChart.setOption({
        //標題
        title: {
            text: '台灣地圖',
            subtext: '各縣市人口數',
            left: 'center'
        },
        //各區塊提示文字
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>人口:{c}人'
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
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
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
            data: users,
            //滑鼠縮放
            roam: true,
            //縮放比例控制
            scaleLimit: {
                min: 0.7,
                max: 3
            }
        }]
    });
    myChart.hideLoading();
    //初始化echarts實例，準備調用其中的方法
    const myChart2 = echarts.init(document.querySelector('.geo2'));
    //調用載入效果
    myChart2.showLoading();
    //載入地理數據
    const map2 = await fetch('./roc2.json').then(resp => resp.json());
    //載入用戶數據
    const users2 = await fetch('./users2.json').then(resp => resp.json());
    //註冊地圖數據
    echarts.registerMap('Taiwan2', map2);
    //配置地圖
    myChart2.setOption({
        //標題
        title: {
            text: '台灣地圖',
            subtext: '各縣市用戶數',
            left: 'center'
        },
        //各區塊提示文字
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>註冊用戶{c}人'
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
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
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
            }
        }]
    });
    myChart2.hideLoading();
})();