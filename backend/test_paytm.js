const https = require('https');
const PaytmChecksum = require('paytmchecksum');

async function testPaytm() {
    const MID = 'TUlbKN41048140733404';
    const MKEY = 'lh6SG77j8a3A2dHI';
    const WEBSITE = 'WEBSTAGING';
    const orderId = 'TEST_ORDER_' + Date.now();
    const amount = "10.00";

    const paytmParams = {
        body: {
            requestType: "Payment",
            mid: MID,
            websiteName: WEBSITE,
            orderId: orderId,
            callbackUrl: "https://shramikseva.com/api/payments/paytm/callback",
            txnAmount: {
                value: amount,
                currency: "INR",
            },
            userInfo: {
                custId: "CUST_123"
            }
        }
    };

    const bodyString = JSON.stringify(paytmParams.body);
    const checksum = await PaytmChecksum.generateSignature(bodyString, MKEY);
    
    paytmParams.head = { signature: checksum };
    const post_data = JSON.stringify(paytmParams);

    const options = {
        hostname: 'securestage.paytmpayments.com',
        port: 443,
        path: `/theia/api/v1/initiateTransaction?mid=${MID}&orderId=${orderId}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data),
            'User-Agent': 'Node/22'
        }
    };

    const req = https.request(options, (res) => {
        let response = "";
        res.on('data', chunk => response += chunk);
        res.on('end', () => {
            try { console.log("Response:", JSON.stringify(JSON.parse(response), null, 2)); } catch(e) { console.log("Raw Response:", response); }
        });
    });

    req.on('error', (e) => {
        console.error("Connection error:", e.message);
    });

    req.write(post_data);
    req.end();
}

testPaytm().catch(console.error);
