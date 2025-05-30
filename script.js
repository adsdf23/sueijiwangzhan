// 网站分类及URL数据库
const urlDatabase = {
    social: [
        { name: "微博", url: "https://weibo.com" },
        { name: "知乎", url: "https://www.zhihu.com" },
        { name: "豆瓣", url: "https://www.douban.com" },
        { name: "B站", url: "https://www.bilibili.com" },
        { name: "Twitter", url: "https://twitter.com" },
        { name: "Instagram", url: "https://www.instagram.com" },
        { name: "LinkedIn", url: "https://www.linkedin.com" },
        { name: "Reddit", url: "https://www.reddit.com" },
        { name: "Facebook", url: "https://www.facebook.com" },
        { name: "Pinterest", url: "https://www.pinterest.com" },
    ],
    knowledge: [
        { name: "维基百科", url: "https://zh.wikipedia.org/wiki/Special:Random" },
        { name: "果壳网", url: "https://www.guokr.com" },
        { name: "Stack Overflow", url: "https://stackoverflow.com" },
        { name: "Medium", url: "https://medium.com" },
        { name: "TED", url: "https://www.ted.com/talks" },
        { name: "可汗学院", url: "https://zh.khanacademy.org" },
        { name: "GitHub", url: "https://github.com/explore" },
        { name: "Quora", url: "https://www.quora.com" },
        { name: "MIT开放课程", url: "https://ocw.mit.edu" },
        { name: "Coursera", url: "https://www.coursera.org" },
    ],
    entertainment: [
        { name: "YouTube", url: "https://www.youtube.com/feed/trending" },
        { name: "Netflix", url: "https://www.netflix.com" },
        { name: "虎扑", url: "https://www.hupu.com" },
        { name: "Reddit Popular", url: "https://www.reddit.com/r/popular/" },
        { name: "Twitch", url: "https://www.twitch.tv" },
        { name: "爱奇艺", url: "https://www.iqiyi.com" },
        { name: "腾讯视频", url: "https://v.qq.com" },
        { name: "优酷", url: "https://www.youku.com" },
        { name: "Spotify", url: "https://open.spotify.com" },
        { name: "Steam", url: "https://store.steampowered.com" },
    ],
    tool: [
        { name: "百度", url: "https://www.baidu.com" },
        { name: "Google", url: "https://www.google.com" },
        { name: "Bing", url: "https://www.bing.com" },
        { name: "谷歌翻译", url: "https://translate.google.com" },
        { name: "高德地图", url: "https://www.amap.com" },
        { name: "百度翻译", url: "https://fanyi.baidu.com" },
        { name: "在线PS", url: "https://www.photopea.com" },
        { name: "天气预报", url: "https://www.weather.com" },
        { name: "Wolfram Alpha", url: "https://www.wolframalpha.com" },
        { name: "Can I Use", url: "https://caniuse.com" },
    ]
};

// 随机URL库
const randomUrlSources = [
    // 随机Wiki条目
    { name: "随机维基百科", url: "https://zh.wikipedia.org/wiki/Special:Random" },
    { name: "随机英文维基", url: "https://en.wikipedia.org/wiki/Special:Random" },
    // 随机视频 - 改为函数，每次调用时生成新的随机ID
    { 
        name: "随机B站视频", 
        getUrl: () => "https://www.bilibili.com/video/av" + Math.floor(Math.random() * 10000000) 
    },
    // 随机GitHub仓库
    { name: "随机GitHub项目", url: "https://github.com/discover" },
    // 随机新闻
    { name: "今日热点", url: "https://www.zhihu.com/hot" },
    // 随机壁纸
    { name: "随机壁纸", url: "https://unsplash.com/photos/random" },
    // 随机音乐
    { name: "随机音乐", url: "https://www.last.fm/player/station/user/LastfmRadio" },
    // 随机商品
    { name: "随机亚马逊好物", url: "https://www.amazon.com/gcx/Gifts-for-Everyone/gfhz" },
    // 随机笑话
    { name: "随机笑话", url: "https://icanhazdadjoke.com" },
    // 随机事实
    { name: "随机趣味事实", url: "https://www.factslides.com/random" },
];

// 每个分类额外添加一些随机特殊网址
urlDatabase.social.push(...randomUrlSources.slice(0, 3));
urlDatabase.knowledge.push(...randomUrlSources.slice(3, 6));
urlDatabase.entertainment.push(...randomUrlSources.slice(6, 9));
urlDatabase.tool.push(randomUrlSources[9]);

// 合并所有分类URL到"all"分类
urlDatabase.all = [
    ...urlDatabase.social,
    ...urlDatabase.knowledge,
    ...urlDatabase.entertainment,
    ...urlDatabase.tool
];

// 获取DOM元素
const generateBtn = document.getElementById('generateBtn');
const openUrlBtn = document.getElementById('openUrlBtn');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const urlDisplay = document.getElementById('urlDisplay');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const categoryBtns = document.querySelectorAll('.category-btn');

// 当前分类和URL
let currentCategory = 'all';
let currentUrl = null;
let history = loadHistory();

// 更新历史记录显示
updateHistoryDisplay();

// 初始化事件监听器
function initEventListeners() {
    // 生成随机URL按钮
    generateBtn.addEventListener('click', () => {
        generateRandomUrl();
    });

    // 打开URL按钮
    openUrlBtn.addEventListener('click', () => {
        if (currentUrl) {
            window.open(currentUrl.url, '_blank');
            // 添加到历史记录
            addToHistory(currentUrl);
        }
    });

    // 复制链接按钮
    copyUrlBtn.addEventListener('click', () => {
        if (currentUrl) {
            copyToClipboard(currentUrl.url);
            showNotification('链接已复制到剪贴板');
        }
    });

    // 清除历史记录按钮
    clearHistoryBtn.addEventListener('click', () => {
        clearHistory();
    });

    // 分类按钮
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            setActiveCategory(category);
            generateRandomUrl();
        });
    });
}

// 设置激活的分类
function setActiveCategory(category) {
    currentCategory = category;
    
    // 更新UI
    categoryBtns.forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 生成随机URL
function generateRandomUrl() {
    const categoryUrls = urlDatabase[currentCategory];
    if (categoryUrls && categoryUrls.length > 0) {
        // 过滤掉已经在历史记录中的URL
        let availableUrls = categoryUrls;
        
        // 只有当历史记录不为空时才过滤
        if (history.length > 0) {
            const historyUrls = history.map(item => item.url);
            availableUrls = categoryUrls.filter(urlObj => {
                // 如果URL是函数生成的，则认为它总是可用的（每次都是新的）
                if (urlObj.getUrl) return true;
                
                return !historyUrls.includes(urlObj.url);
            });
            
            // 如果所有URL都已在历史记录中，则使用所有URL（当分类中的所有URL都被访问过时）
            if (availableUrls.length === 0) {
                console.log("所有URL已被访问过，重新使用完整URL列表");
                availableUrls = categoryUrls;
            }
        }
        
        // 从可用URL中随机选择
        const randomIndex = Math.floor(Math.random() * availableUrls.length);
        const selectedUrl = availableUrls[randomIndex];
        
        // 处理动态URL (getUrl函数)
        if (selectedUrl.getUrl) {
            currentUrl = {
                name: selectedUrl.name,
                url: selectedUrl.getUrl()
            };
        } else {
            currentUrl = selectedUrl;
        }
        
        // 更新UI，给链接添加点击事件，点击时添加到历史记录
        urlDisplay.innerHTML = `<a href="${currentUrl.url}" target="_blank" id="currentUrlLink">${currentUrl.name}: ${currentUrl.url}</a>`;
        document.getElementById('currentUrlLink').addEventListener('click', () => {
            addToHistory(currentUrl);
        });
        
        urlDisplay.classList.add('active');
        
        // 启用按钮
        openUrlBtn.disabled = false;
        copyUrlBtn.disabled = false;
    }
}

// 添加到历史记录
function addToHistory(urlObj) {
    const timestamp = new Date().toLocaleString();
    const historyItem = {
        name: urlObj.name,
        url: urlObj.url,
        timestamp: timestamp,
        category: currentCategory
    };
    
    // 检查是否已存在相同URL
    const existingIndex = history.findIndex(item => item.url === urlObj.url);
    if (existingIndex !== -1) {
        history.splice(existingIndex, 1);
    }
    
    // 添加到历史记录开头
    history.unshift(historyItem);
    
    // 限制历史记录长度
    if (history.length > 50) {
        history.pop();
    }
    
    // 保存到本地存储
    saveHistory();
    
    // 更新UI
    updateHistoryDisplay();
}

// 更新历史记录显示
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<li class="empty-history">暂无历史记录</li>';
        return;
    }
    
    history.forEach((item, index) => {
        if (index < 15) { // 只显示最近15条记录
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${item.url}" target="_blank">${item.name}</a>
                <span class="timestamp">${item.timestamp}</span>
            `;
            
            li.addEventListener('click', (e) => {
                if (!e.target.tagName === 'A') {
                    window.open(item.url, '_blank');
                }
            });
            
            historyList.appendChild(li);
        }
    });
}

// 清除历史记录
function clearHistory() {
    history = [];
    saveHistory();
    updateHistoryDisplay();
}

// 保存历史记录到本地存储
function saveHistory() {
    localStorage.setItem('randomUrlHistory', JSON.stringify(history));
}

// 从本地存储加载历史记录
function loadHistory() {
    const savedHistory = localStorage.getItem('randomUrlHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
}

// 复制到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('无法复制到剪贴板:', err);
        // 备用方法
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}

// 显示通知
function showNotification(message) {
    // 移除现有通知
    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        document.body.removeChild(existingNotification);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    
    // 添加到文档
    document.body.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 2000);
}

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    // 按空格键生成新的随机URL
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        generateRandomUrl();
        e.preventDefault();
    }
    
    // 按Enter键打开URL
    if (e.code === 'Enter' && currentUrl && document.activeElement.tagName !== 'INPUT') {
        window.open(currentUrl.url, '_blank');
        e.preventDefault();
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    
    // 自动生成第一个URL
    generateRandomUrl();
}); 