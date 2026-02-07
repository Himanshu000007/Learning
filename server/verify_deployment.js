const http = require('http');

const checkRoute = (path, method) => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            resolve(res.statusCode);
        });
        req.on('error', (e) => resolve('ERROR: ' + e.message));
        if (method === 'POST') req.write('{}'); // Send empty body
        req.end();
    });
};

async function test() {
    console.log('Checking server status...');
    const rootStatus = await checkRoute('/', 'GET');
    console.log(`Root / status: ${rootStatus}`);

    // New route - should exist (not 404)
    const aiStatus = await checkRoute('/api/ai/recommend', 'POST');
    console.log(`AI Route /api/ai/recommend status: ${aiStatus}`);
}

test();
