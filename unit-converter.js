// Unit Converter App - Main JavaScript File

// Conversion factors to base unit (meters)
const lengthUnits = {
    'mm': 0.001,
    'cm': 0.01,
    'm': 1,
    'km': 1000,
    'inch': 0.0254,
    'foot': 0.3048,
    'yard': 0.9144,
    'mile': 1609.34
};

// Weight conversion factors to base unit (grams)
const weightUnits = {
    'mg': 0.001,
    'g': 1,
    'kg': 1000,
    'ton': 1000000,
    'oz': 28.3495,
    'lb': 453.592,
    'stone': 6350.29
};

// Temperature conversion (uses formulas instead of factors)
const temperatureUnits = ['°C', '°F', 'K'];

// Temperature conversion functions
function convertTemperature(value, fromUnit, toUnit) {
    let celsius;
    
    // Convert to Celsius first
    if (fromUnit === '°C') {
        celsius = value;
    } else if (fromUnit === '°F') {
        celsius = (value - 32) * (5/9);
    } else if (fromUnit === 'K') {
        celsius = value - 273.15;
    }
    
    // Convert from Celsius to target unit
    if (toUnit === '°C') {
        return celsius;
    } else if (toUnit === '°F') {
        return (celsius * 9/5) + 32;
    } else if (toUnit === 'K') {
        return celsius + 273.15;
    }
}

// Currency data and API handling
const currencyData = {
    rates: {},
    lastUpdated: null
};

const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MXN'];

// Fetch exchange rates from API
async function fetchExchangeRates() {
    try {
        // Using exchangerate-api.com free tier (no key required for basic requests)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Store rates for supported currencies
        supportedCurrencies.forEach(currency => {
            if (data.rates[currency]) {
                currencyData.rates[currency] = data.rates[currency];
            }
        });
        
        currencyData.lastUpdated = new Date();
        console.log('Exchange rates updated successfully');
        return true;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Use fallback rates if API fails
        useFallbackRates();
        return false;
    }
}

// Fallback rates in case API is unavailable
function useFallbackRates() {
    currencyData.rates = {
        'USD': 1.0,
        'EUR': 0.92,
        'GBP': 0.79,
        'JPY': 149.50,
        'AUD': 1.53,
        'CAD': 1.36,
        'CHF': 0.88,
        'CNY': 7.08,
        'INR': 83.12,
        'MXN': 17.05
    };
    console.log('Using fallback exchange rates');
}

// Convert currency value
function convertCurrency(value, fromCurrency, toCurrency) {
    if (!currencyData.rates[fromCurrency] || !currencyData.rates[toCurrency]) {
        return 0;
    }
    
    // Convert to USD first, then to target currency
    const valueInUSD = value / currencyData.rates[fromCurrency];
    return valueInUSD * currencyData.rates[toCurrency];
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    console.log('Unit Converter App Initialized');
    
    // Add click event listeners to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            console.log('Navigating to:', sectionId);
            loadConverterSection(sectionId);
        });
    });
});

// Function to load different converter sections
function loadConverterSection(sectionId) {
    const converterSection = document.querySelector('.converter-section');
    
    const sections = {
        length: {
            title: 'Length Converter',
            description: 'Convert between meters, kilometers, miles, feet, inches, etc.'
        },
        weight: {
            title: 'Weight Converter',
            description: 'Convert between milligrams, grams, kilograms, tons, ounces, pounds, etc.'
        },
        temperature: {
            title: 'Temperature Converter',
            description: 'Convert between Celsius, Fahrenheit, and Kelvin.'
        },
        currency: {
            title: 'Currency Converter',
            description: 'Convert between different world currencies with real-time rates.'
        },
        area: {
            title: 'Area Converter',
            description: 'Convert between square meters, square kilometers, square feet, acres, etc.'
        }
    };
    
    const section = sections[sectionId];
    
    if (section) {
        let formHTML = `
            <h2>${section.title}</h2>
            <p>${section.description}</p>
            <div id="converter-form" style="margin-top: 2rem;">
        `;
        
        if (sectionId === 'length') {
            formHTML += createLengthConverterForm();
        } else if (sectionId === 'weight') {
            formHTML += createWeightConverterForm();
        } else if (sectionId === 'temperature') {
            formHTML += createTemperatureConverterForm();
        } else if (sectionId === 'currency') {
            formHTML += createCurrencyConverterForm();
        } else {
            formHTML += '<p style="color: #999;">Converter form coming soon...</p>';
        }
        
        formHTML += '</div>';
        converterSection.innerHTML = formHTML;
        
        // Attach event listeners
        if (sectionId === 'length') {
            setupLengthConverter();
        } else if (sectionId === 'weight') {
            setupWeightConverter();
        } else if (sectionId === 'temperature') {
            setupTemperatureConverter();
        } else if (sectionId === 'currency') {
            setupCurrencyConverter();
        }
    }
}

// Create length converter form HTML
function createLengthConverterForm() {
    const units = Object.keys(lengthUnits);
    const unitOptions = units.map(unit => `<option value="${unit}">${unit}</option>`).join('');
    
    return `
        <div class="converter-container">
            <div class="converter-input-group">
                <label for="from-value">From:</label>
                <div class="input-unit-group">
                    <input type="number" id="from-value" placeholder="Enter value" value="1" step="any">
                    <select id="from-unit">
                        ${unitOptions}
                    </select>
                </div>
            </div>
            
            <div class="converter-button">
                <button id="swap-btn" title="Swap units">⇄</button>
            </div>
            
            <div class="converter-input-group">
                <label for="to-value">To:</label>
                <div class="input-unit-group">
                    <input type="number" id="to-value" placeholder="Result" readonly>
                    <select id="to-unit">
                        ${unitOptions}
                    </select>
                </div>
            </div>
        </div>
        <div class="conversion-info">
            <p id="conversion-text">1 ${units[0]} = <span id="conversion-result">1</span> ${units[2]}</p>
        </div>
    `;
}

// Setup event listeners for length converter
function setupLengthConverter() {
    const fromValue = document.getElementById('from-value');
    const fromUnit = document.getElementById('from-unit');
    const toValue = document.getElementById('to-value');
    const toUnit = document.getElementById('to-unit');
    const swapBtn = document.getElementById('swap-btn');
    
    // Set default units
    fromUnit.value = 'm';
    toUnit.value = 'foot';
    
    // Add event listeners
    fromValue.addEventListener('input', performConversion);
    fromUnit.addEventListener('change', performConversion);
    toUnit.addEventListener('change', performConversion);
    swapBtn.addEventListener('click', swapUnits);
    
    // Perform initial conversion
    performConversion();
}

// Perform the conversion
function performConversion() {
    const fromValue = document.getElementById('from-value');
    const fromUnit = document.getElementById('from-unit');
    const toValue = document.getElementById('to-value');
    const toUnit = document.getElementById('to-unit');
    const conversionText = document.getElementById('conversion-text');
    const conversionResult = document.getElementById('conversion-result');
    
    const value = parseFloat(fromValue.value) || 0;
    
    // Convert to base unit (meters) then to target unit
    const valueInMeters = value * lengthUnits[fromUnit.value];
    const result = valueInMeters / lengthUnits[toUnit.value];
    
    toValue.value = result.toFixed(6).replace(/\.?0+$/, '');
    
    // Update conversion info
    conversionText.textContent = `1 ${fromUnit.value} = `;
    conversionResult.textContent = (lengthUnits[toUnit.value] / lengthUnits[fromUnit.value]).toFixed(6).replace(/\.?0+$/, '');
}

// Swap units
function swapUnits() {
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    const fromValue = document.getElementById('from-value');
    const toValue = document.getElementById('to-value');
    
    // Swap unit selects
    [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
    
    // Swap values
    [fromValue.value, toValue.value] = [toValue.value, fromValue.value];
    
    // Perform conversion
    performConversion();
}

// Create weight converter form HTML
function createWeightConverterForm() {
    const units = Object.keys(weightUnits);
    const unitOptions = units.map(unit => `<option value="${unit}">${unit}</option>`).join('');
    
    return `
        <div class="converter-container">
            <div class="converter-input-group">
                <label for="weight-from-value">From:</label>
                <div class="input-unit-group">
                    <input type="number" id="weight-from-value" placeholder="Enter value" value="1" step="any">
                    <select id="weight-from-unit">
                        ${unitOptions}
                    </select>
                </div>
            </div>
            
            <div class="converter-button">
                <button id="weight-swap-btn" title="Swap units">⇄</button>
            </div>
            
            <div class="converter-input-group">
                <label for="weight-to-value">To:</label>
                <div class="input-unit-group">
                    <input type="number" id="weight-to-value" placeholder="Result" readonly>
                    <select id="weight-to-unit">
                        ${unitOptions}
                    </select>
                </div>
            </div>
        </div>
        <div class="conversion-info">
            <p id="weight-conversion-text">1 g = <span id="weight-conversion-result">1</span> g</p>
        </div>
    `;
}

// Setup event listeners for weight converter
function setupWeightConverter() {
    const fromValue = document.getElementById('weight-from-value');
    const fromUnit = document.getElementById('weight-from-unit');
    const toValue = document.getElementById('weight-to-value');
    const toUnit = document.getElementById('weight-to-unit');
    const swapBtn = document.getElementById('weight-swap-btn');
    
    // Set default units
    fromUnit.value = 'kg';
    toUnit.value = 'lb';
    
    // Add event listeners
    fromValue.addEventListener('input', performWeightConversion);
    fromUnit.addEventListener('change', performWeightConversion);
    toUnit.addEventListener('change', performWeightConversion);
    swapBtn.addEventListener('click', swapWeightUnits);
    
    // Perform initial conversion
    performWeightConversion();
}

// Perform weight conversion
function performWeightConversion() {
    const fromValue = document.getElementById('weight-from-value');
    const fromUnit = document.getElementById('weight-from-unit');
    const toValue = document.getElementById('weight-to-value');
    const toUnit = document.getElementById('weight-to-unit');
    const conversionText = document.getElementById('weight-conversion-text');
    const conversionResult = document.getElementById('weight-conversion-result');
    
    const value = parseFloat(fromValue.value) || 0;
    
    // Convert to base unit (grams) then to target unit
    const valueInGrams = value * weightUnits[fromUnit.value];
    const result = valueInGrams / weightUnits[toUnit.value];
    
    toValue.value = result.toFixed(6).replace(/\.?0+$/, '');
    
    // Update conversion info
    conversionText.textContent = `1 ${fromUnit.value} = `;
    conversionResult.textContent = (weightUnits[toUnit.value] / weightUnits[fromUnit.value]).toFixed(6).replace(/\.?0+$/, '');
}

// Swap weight units
function swapWeightUnits() {
    const fromUnit = document.getElementById('weight-from-unit');
    const toUnit = document.getElementById('weight-to-unit');
    const fromValue = document.getElementById('weight-from-value');
    const toValue = document.getElementById('weight-to-value');
    
    // Swap unit selects
    [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
    
    // Swap values
    [fromValue.value, toValue.value] = [toValue.value, fromValue.value];
    
    // Perform conversion
    performWeightConversion();
}

// Create temperature converter form HTML
function createTemperatureConverterForm() {
    const unitOptions = temperatureUnits.map(unit => `<option value="${unit}">${unit}</option>`).join('');
    
    return `
        <div class="converter-container">
            <div class="converter-input-group">
                <label for="temp-from-value">From:</label>
                <div class="input-unit-group">
                    <input type="number" id="temp-from-value" placeholder="Enter value" value="0" step="any">
                    <select id="temp-from-unit">
                        ${unitOptions}
                    </select>
                </div>
            </div>
            
            <div class="converter-button">
                <button id="temp-swap-btn" title="Swap units">⇄</button>
            </div>
            
            <div class="converter-input-group">
                <label for="temp-to-value">To:</label>
                <div class="input-unit-group">
                    <input type="number" id="temp-to-value" placeholder="Result" readonly>
                    <select id="temp-to-unit">
                        ${unitOptions}
                    </select>
                </div>
            </div>
        </div>
        <div class="conversion-info">
            <p id="temp-conversion-text">0 °C = <span id="temp-conversion-result">32</span> °F</p>
        </div>
    `;
}

// Setup event listeners for temperature converter
function setupTemperatureConverter() {
    const fromValue = document.getElementById('temp-from-value');
    const fromUnit = document.getElementById('temp-from-unit');
    const toValue = document.getElementById('temp-to-value');
    const toUnit = document.getElementById('temp-to-unit');
    const swapBtn = document.getElementById('temp-swap-btn');
    
    // Set default units
    fromUnit.value = '°C';
    toUnit.value = '°F';
    
    // Add event listeners
    fromValue.addEventListener('input', performTemperatureConversion);
    fromUnit.addEventListener('change', performTemperatureConversion);
    toUnit.addEventListener('change', performTemperatureConversion);
    swapBtn.addEventListener('click', swapTemperatureUnits);
    
    // Perform initial conversion
    performTemperatureConversion();
}

// Perform temperature conversion
function performTemperatureConversion() {
    const fromValue = document.getElementById('temp-from-value');
    const fromUnit = document.getElementById('temp-from-unit');
    const toValue = document.getElementById('temp-to-value');
    const toUnit = document.getElementById('temp-to-unit');
    const conversionText = document.getElementById('temp-conversion-text');
    const conversionResult = document.getElementById('temp-conversion-result');
    
    const value = parseFloat(fromValue.value) || 0;
    
    // Perform temperature conversion
    const result = convertTemperature(value, fromUnit.value, toUnit.value);
    
    toValue.value = result.toFixed(2);
    
    // Update conversion info
    const infoResult = convertTemperature(1, fromUnit.value, toUnit.value);
    conversionText.textContent = `0 ${fromUnit.value} = `;
    conversionResult.textContent = convertTemperature(0, fromUnit.value, toUnit.value).toFixed(2);
}

// Swap temperature units
function swapTemperatureUnits() {
    const fromUnit = document.getElementById('temp-from-unit');
    const toUnit = document.getElementById('temp-to-unit');
    const fromValue = document.getElementById('temp-from-value');
    const toValue = document.getElementById('temp-to-value');
    
    // Swap unit selects
    [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
    
    // Swap values
    [fromValue.value, toValue.value] = [toValue.value, fromValue.value];
    
    // Perform conversion
    performTemperatureConversion();
}

// Create currency converter form HTML
function createCurrencyConverterForm() {
    const currencyOptions = supportedCurrencies.map(currency => `<option value="${currency}">${currency}</option>`).join('');
    
    return `
        <div class="currency-update-info">
            <span id="rates-status">📡 Loading exchange rates...</span>
        </div>
        <div class="converter-container">
            <div class="converter-input-group">
                <label for="curr-from-value">From:</label>
                <div class="input-unit-group">
                    <input type="number" id="curr-from-value" placeholder="Enter amount" value="1" step="any">
                    <select id="curr-from-unit">
                        ${currencyOptions}
                    </select>
                </div>
            </div>
            
            <div class="converter-button">
                <button id="curr-swap-btn" title="Swap currencies">⇄</button>
            </div>
            
            <div class="converter-input-group">
                <label for="curr-to-value">To:</label>
                <div class="input-unit-group">
                    <input type="number" id="curr-to-value" placeholder="Result" readonly>
                    <select id="curr-to-unit">
                        ${currencyOptions}
                    </select>
                </div>
            </div>
        </div>
        <div class="conversion-info">
            <p id="curr-conversion-text">1 USD = <span id="curr-conversion-result">1</span> USD</p>
            <p style="font-size: 0.9rem; color: #999; margin-top: 0.5rem;" id="rates-date">Last updated: Just now</p>
        </div>
    `;
}

// Setup event listeners for currency converter
function setupCurrencyConverter() {
    const fromValue = document.getElementById('curr-from-value');
    const fromUnit = document.getElementById('curr-from-unit');
    const toValue = document.getElementById('curr-to-value');
    const toUnit = document.getElementById('curr-to-unit');
    const swapBtn = document.getElementById('curr-swap-btn');
    const ratesStatus = document.getElementById('rates-status');
    const ratesDate = document.getElementById('rates-date');
    
    // Set default currencies
    fromUnit.value = 'USD';
    toUnit.value = 'EUR';
    
    // Fetch rates and setup
    ratesStatus.textContent = '📡 Fetching live exchange rates...';
    fetchExchangeRates().then(success => {
        if (success) {
            ratesStatus.textContent = '✅ Live rates loaded';
        } else {
            ratesStatus.textContent = '⚠️ Using cached rates';
        }
        
        if (currencyData.lastUpdated) {
            const time = currencyData.lastUpdated.toLocaleTimeString();
            ratesDate.textContent = `Last updated: ${time}`;
        }
        
        // Add event listeners
        fromValue.addEventListener('input', performCurrencyConversion);
        fromUnit.addEventListener('change', performCurrencyConversion);
        toUnit.addEventListener('change', performCurrencyConversion);
        swapBtn.addEventListener('click', swapCurrencyUnits);
        
        // Perform initial conversion
        performCurrencyConversion();
    });
}

// Perform currency conversion
function performCurrencyConversion() {
    const fromValue = document.getElementById('curr-from-value');
    const fromUnit = document.getElementById('curr-from-unit');
    const toValue = document.getElementById('curr-to-value');
    const toUnit = document.getElementById('curr-to-unit');
    const conversionText = document.getElementById('curr-conversion-text');
    const conversionResult = document.getElementById('curr-conversion-result');
    
    const value = parseFloat(fromValue.value) || 0;
    
    // Perform currency conversion
    const result = convertCurrency(value, fromUnit.value, toUnit.value);
    
    toValue.value = result.toFixed(2);
    
    // Update conversion info
    const conversionRate = convertCurrency(1, fromUnit.value, toUnit.value);
    conversionText.textContent = `1 ${fromUnit.value} = `;
    conversionResult.textContent = conversionRate.toFixed(4);
}

// Swap currency units
function swapCurrencyUnits() {
    const fromUnit = document.getElementById('curr-from-unit');
    const toUnit = document.getElementById('curr-to-unit');
    const fromValue = document.getElementById('curr-from-value');
    const toValue = document.getElementById('curr-to-value');
    
    // Swap unit selects
    [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
    
    // Swap values
    [fromValue.value, toValue.value] = [toValue.value, fromValue.value];
    
    // Perform conversion
    performCurrencyConversion();
}

// Utility function for conversions (to be expanded in future steps)
function convert(value, fromUnit, toUnit, conversionType) {
    // This function will handle all conversions
    // Will be implemented in next steps
    console.log(`Converting ${value} from ${fromUnit} to ${toUnit} (${conversionType})`);
}
