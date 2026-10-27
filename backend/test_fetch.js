fetch('https://securestage.paytmpayments.com/theia/api/v1/initiateTransaction?mid=TUlbKN41048140733404&orderId=TEST_123', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        head: { signature: "dummy" },
        body: { requestType: "Payment", mid: "TUlbKN41048140733404", websiteName: "WEBSTAGING", orderId: "TEST_123", txnAmount: { value: "10.00", currency: "INR" }, userInfo: { custId: "CUST_123" } }
    })
}).then(res => res.text()).then(text => console.log('Response:', text)).catch(err => console.error('Error:', err.message));
