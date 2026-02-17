const { Builder } = require('selenium-webdriver');

async function testDriver() {
    console.log('1. Starting...');
    
    try {
        console.log('2. Creating driver...');
        const driver = await new Builder().forBrowser('chrome').build();
        
        console.log('3. Driver created! Chrome should be open now.');
        
        await driver.get('https://www.google.com');
        console.log('4. Navigated to Google');
        
        await driver.sleep(3000);
        console.log('5. Closing...');
        
        await driver.quit();
        console.log('6. Done!');
        
    } catch (error) {
        console.error('ERROR:', error.message);
        console.error('Full error:', error);
    }
}

testDriver();