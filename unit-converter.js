// Unit Converter App - Main JavaScript File

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
        converterSection.innerHTML = `
            <h2>${section.title}</h2>
            <p>${section.description}</p>
            <div id="converter-form" style="margin-top: 2rem;">
                <!-- Converter form will be inserted here in future steps -->
                <p style="color: #999;">Converter form coming soon...</p>
            </div>
        `;
    }
}

// Utility function for conversions (to be expanded in future steps)
function convert(value, fromUnit, toUnit, conversionType) {
    // This function will handle all conversions
    // Will be implemented in next steps
    console.log(`Converting ${value} from ${fromUnit} to ${toUnit} (${conversionType})`);
}
