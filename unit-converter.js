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
            description: 'Convert between kilograms, grams, pounds, ounces, etc.'
        },
        temperature: {
            title: 'Temperature Converter',
            description: 'Convert between Celsius, Fahrenheit, and Kelvin.'
        },
        volume: {
            title: 'Volume Converter',
            description: 'Convert between liters, milliliters, gallons, cups, etc.'
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
        } else {
            formHTML += '<p style="color: #999;">Converter form coming soon...</p>';
        }
        
        formHTML += '</div>';
        converterSection.innerHTML = formHTML;
        
        // Attach event listeners
        if (sectionId === 'length') {
            setupLengthConverter();
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

// Utility function for conversions (to be expanded in future steps)
function convert(value, fromUnit, toUnit, conversionType) {
    // This function will handle all conversions
    // Will be implemented in next steps
    console.log(`Converting ${value} from ${fromUnit} to ${toUnit} (${conversionType})`);
}
