// 全局变量
let fractalType = 'koch';
let iterations = 5;
let colorScheme = 'rainbow';
let zoom = 1;
let canvas;

// 曼德博集合参数
let mandelbrotOffsetX = 0;
let mandelbrotOffsetY = 0;
let mandelbrotZoom = 1;

function setup() {
    // 创建画布
    canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    noLoop();
    
    // 初始化控制事件
    initControls();
}

function draw() {
    background(255);
    
    switch(fractalType) {
        case 'koch':
            drawKochCurve();
            break;
        case 'sierpinski':
            drawSierpinskiTriangle();
            break;
        case 'mandelbrot':
            drawMandelbrotSet();
            break;
    }
}

// 科赫曲线实现
function drawKochCurve() {
    let startX = 100;
    let startY = height / 2;
    let endX = width - 100;
    let endY = height / 2;
    
    // 根据缩放调整
    let length = (endX - startX) * zoom;
    startX = width / 2 - length / 2;
    endX = width / 2 + length / 2;
    
    kochCurve(startX, startY, endX, endY, iterations);
}

function kochCurve(x1, y1, x2, y2, level) {
    if (level === 0) {
        // 设置颜色
        setColor(level);
        line(x1, y1, x2, y2);
    } else {
        let dx = x2 - x1;
        let dy = y2 - y1;
        
        let x3 = x1 + dx / 3;
        let y3 = y1 + dy / 3;
        
        let x4 = x1 + dx * 2 / 3;
        let y4 = y1 + dy * 2 / 3;
        
        // 计算等边三角形的顶点
        let x5 = x3 + (dx / 3) * cos(-PI / 3) - (dy / 3) * sin(-PI / 3);
        let y5 = y3 + (dx / 3) * sin(-PI / 3) + (dy / 3) * cos(-PI / 3);
        
        // 递归绘制
        kochCurve(x1, y1, x3, y3, level - 1);
        kochCurve(x3, y3, x5, y5, level - 1);
        kochCurve(x5, y5, x4, y4, level - 1);
        kochCurve(x4, y4, x2, y2, level - 1);
    }
}

// 谢尔宾斯基三角形实现
function drawSierpinskiTriangle() {
    let size = min(width, height) * 0.8 * zoom;
    let x1 = width / 2;
    let y1 = 100;
    let x2 = width / 2 - size / 2;
    let y2 = y1 + size * sin(PI / 3);
    let x3 = width / 2 + size / 2;
    let y3 = y2;
    
    sierpinskiTriangle(x1, y1, x2, y2, x3, y3, iterations);
}

function sierpinskiTriangle(x1, y1, x2, y2, x3, y3, level) {
    if (level === 0) {
        // 设置颜色
        setColor(level);
        triangle(x1, y1, x2, y2, x3, y3);
    } else {
        // 计算中点
        let mx1 = (x1 + x2) / 2;
        let my1 = (y1 + y2) / 2;
        let mx2 = (x2 + x3) / 2;
        let my2 = (y2 + y3) / 2;
        let mx3 = (x3 + x1) / 2;
        let my3 = (y3 + y1) / 2;
        
        // 递归绘制三个小三角形
        sierpinskiTriangle(x1, y1, mx1, my1, mx3, my3, level - 1);
        sierpinskiTriangle(mx1, my1, x2, y2, mx2, my2, level - 1);
        sierpinskiTriangle(mx3, my3, mx2, my2, x3, y3, level - 1);
    }
}

// 曼德博集合实现
function drawMandelbrotSet() {
    let maxIterations = iterations * 10;
    let width = canvas.width;
    let height = canvas.height;
    
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // 映射像素坐标到复数平面
            let a = map(x, 0, width, -2.5 / mandelbrotZoom + mandelbrotOffsetX, 1.5 / mandelbrotZoom + mandelbrotOffsetX);
            let b = map(y, 0, height, -2 / mandelbrotZoom + mandelbrotOffsetY, 2 / mandelbrotZoom + mandelbrotOffsetY);
            
            let originalA = a;
            let originalB = b;
            
            let n = 0;
            
            // 迭代计算
            while (n < maxIterations) {
                let aa = a * a - b * b;
                let bb = 2 * a * b;
                
                a = aa + originalA;
                b = bb + originalB;
                
                if (abs(a + b) > 16) {
                    break;
                }
                
                n++;
            }
            
            // 设置颜色
            setMandelbrotColor(x, y, n, maxIterations);
        }
    }
}

// 设置颜色
function setColor(level) {
    switch(colorScheme) {
        case 'rainbow':
            stroke((level * 50) % 255, 255, 255);
            break;
        case 'grayscale':
            let gray = map(level, 0, iterations, 0, 255);
            stroke(gray);
            break;
        case 'blue':
            stroke(0, 0, 200 + level * 10);
            break;
        case 'green':
            stroke(0, 200 + level * 10, 0);
            break;
    }
}

// 设置曼德博集合颜色
function setMandelbrotColor(x, y, n, maxIterations) {
    switch(colorScheme) {
        case 'rainbow':
            let hue = map(n, 0, maxIterations, 0, 360);
            stroke(hue, 255, 255);
            break;
        case 'grayscale':
            let gray = map(n, 0, maxIterations, 0, 255);
            stroke(gray);
            break;
        case 'blue':
            let blue = map(n, 0, maxIterations, 0, 255);
            stroke(0, 0, blue);
            break;
        case 'green':
            let green = map(n, 0, maxIterations, 0, 255);
            stroke(0, green, 0);
            break;
    }
    point(x, y);
}

// 初始化控制事件
function initControls() {
    // 分形类型选择
    document.getElementById('fractal-type').addEventListener('change', function(e) {
        fractalType = e.target.value;
        resetMandelbrot();
        redraw();
    });
    
    // 迭代深度控制
    let iterationsSlider = document.getElementById('iterations');
    let iterationsValue = document.getElementById('iterations-value');
    
    iterationsSlider.addEventListener('input', function(e) {
        iterations = parseInt(e.target.value);
        iterationsValue.textContent = iterations;
        redraw();
    });
    
    // 颜色方案选择
    document.getElementById('color-scheme').addEventListener('change', function(e) {
        colorScheme = e.target.value;
        redraw();
    });
    
    // 缩放级别控制
    let zoomSlider = document.getElementById('zoom');
    let zoomValue = document.getElementById('zoom-value');
    
    zoomSlider.addEventListener('input', function(e) {
        zoom = parseFloat(e.target.value);
        zoomValue.textContent = zoom;
        redraw();
    });
    
    // 重置按钮
    document.getElementById('reset').addEventListener('click', function() {
        resetMandelbrot();
        zoom = 1;
        document.getElementById('zoom').value = 1;
        document.getElementById('zoom-value').textContent = 1;
        redraw();
    });
    
    // 鼠标点击事件（用于曼德博集合缩放）
    canvas.elt.addEventListener('click', function(e) {
        if (fractalType === 'mandelbrot') {
            let rect = canvas.elt.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            
            // 计算点击位置对应的复数平面坐标
            let a = map(x, 0, canvas.width, -2.5 / mandelbrotZoom + mandelbrotOffsetX, 1.5 / mandelbrotZoom + mandelbrotOffsetX);
            let b = map(y, 0, canvas.height, -2 / mandelbrotZoom + mandelbrotOffsetY, 2 / mandelbrotZoom + mandelbrotOffsetY);
            
            // 更新偏移和缩放
            mandelbrotOffsetX = a;
            mandelbrotOffsetY = b;
            mandelbrotZoom *= 2;
            
            redraw();
        }
    });
}

// 重置曼德博集合参数
function resetMandelbrot() {
    mandelbrotOffsetX = 0;
    mandelbrotOffsetY = 0;
    mandelbrotZoom = 1;
}