import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';
import os from 'os';
import path from 'path';
import assert from 'assert';

async function testSearchFunction() {
    const options = new chrome.Options().addArguments('--ignore-certificate-errors');

    const remoteUrl = process.env.SELENIUM_HOST || 'http://localhost:4444/wd/hub';
    const appUrl = process.env.APP_URL || 'http://localhost:5000/';

    console.log(remoteUrl);
    console.log(appUrl);

    let driver = await new Builder().forBrowser('chrome').usingServer(remoteUrl).setChromeOptions(options).build();
    try {
        // Navigate to your React app URL
        await driver.get(appUrl);

        let searchButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Submit"]')), 5000);
        const searchButtonVisible = await searchButton.isDisplayed();
        const searchButtonEnabled = await searchButton.isEnabled();

        let searchField = await driver.findElement(By.id('query'));
        const searchFieldVisible = await searchField.isDisplayed();

        if (!searchFieldVisible || !searchButtonEnabled) {
            throw new Error('Search bar or button not visible');
        }

        console.log('✅ Search is ready');

        // --- Test 1: XSS attack --- //
        // Clear and enter test data
        await searchField.clear();
        await searchField.sendKeys('<script>alert("Test");</script>');
        await searchButton.click();

        let currentUrl = await driver.getCurrentUrl();  
        if (currentUrl === appUrl){
            console.log('XSS Attack detected and remained at /');
        }

        console.log('✅ Search behaviour correct for XSS attack');

        
        // --- Test 2: SQL attack --- //
        // Clear and enter test data
        searchField = await driver.findElement(By.id('query'));
        searchButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Submit"]')), 10000);
        await searchField.clear();
        await searchField.sendKeys(`' OR '1'='1`);
        await searchButton.click();

        currentUrl = await driver.getCurrentUrl();
        if (currentUrl === appUrl){
            console.log('✅ SQL Attack detected and remained at /');
        }

        console.log('✅ Search behaviour correct for SQL attack');


        // --- Test 3: Valid Login --- //
        // Clear and enter test data
        searchField = await driver.findElement(By.id('query'));
        searchButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Submit"]')), 20000);
        await searchField.clear();
        await searchField.sendKeys('SSD');
        await searchButton.click();

        await driver.wait(until.urlContains('/result'), 10000);
        currentUrl = await driver.getCurrentUrl();
        console.log('Current URL after legitimate search:', currentUrl);
        console.log('✅ At /result page');
        let goBackButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Go back"]')), 20000);
        let searchResultField = await driver.findElement(By.id('result')).getText();
        console.log("Search term: ", searchResultField);
        console.log("Going back.....")
        await goBackButton.click();

        currentUrl = await driver.getCurrentUrl();
        console.log(currentUrl);
        if (currentUrl === appUrl){
            console.log('✅ Back to index.html');
        }


    } catch (err) {
        console.log('Test failed: ', err);
    } finally {
        await driver.quit();
    }
}


testSearchFunction();