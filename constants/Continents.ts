export type Continent = {
    name: string;
    countries: string[];
    color: string;
};

// This mapping includes all countries from the map data, properly categorized by continent
export const continents: Record<string, Continent> = {
    "Europe": {
        name: "Europe",
        color: "#FF6384",
        countries: [
            "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herz.",
            "Bulgaria", "Croatia", "Czechia", "Denmark", "Estonia", "Faeroe Is.", "Finland",
            "France", "Germany", "Greece", "Guernsey", "Hungary", "Iceland", "Ireland",
            "Isle of Man", "Italy", "Jersey", "Kosovo", "Latvia", "Liechtenstein",
            "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco",
            "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania",
            "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden",
            "Switzerland", "Ukraine", "United Kingdom", "Vatican", "Åland"
        ]
    },
    "Asia": {
        name: "Asia",
        color: "#36A2EB",
        countries: [
            "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan",
            "Brunei", "Cambodia", "China", "Cyprus", "Georgia", "Hong Kong", "India",
            "Indonesia", "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan",
            "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Macao", "Malaysia", "Maldives",
            "Mongolia", "Myanmar", "N. Cyprus", "Nepal", "North Korea", "Oman", "Pakistan",
            "Palestine", "Philippines", "Qatar", "Russia", "Saudi Arabia", "Siachen Glacier",
            "Singapore", "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan",
            "Thailand", "Timor-Leste", "Turkey", "Turkmenistan", "United Arab Emirates",
            "Uzbekistan", "Vietnam", "Yemen", "Br. Indian Ocean Ter.", "Indian Ocean Ter."
        ]
    },
    "Africa": {
        name: "Africa",
        color: "#FFCE56",
        countries: [
            "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
            "Cameroon", "Cabo Verde", "Central African Rep.", "Chad", "Comoros",
            "Congo", "Dem. Rep. Congo", "Djibouti", "Egypt", "Eq. Guinea", "Eritrea",
            "eSwatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau",
            "Côte d'Ivoire", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar",
            "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique",
            "Namibia", "Niger", "Nigeria", "Rwanda", "São Tomé and Principe", "Senegal",
            "Seychelles", "Sierra Leone", "Somalia", "Somaliland", "South Africa",
            "S. Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "W. Sahara",
            "Zambia", "Zimbabwe", "Saint Helena"
        ]
    },
    "North America": {
        name: "North America",
        color: "#4BC0C0",
        countries: [
            "Antigua and Barb.", "Bahamas", "Barbados", "Belize", "Canada",
            "Costa Rica", "Cuba", "Dominica", "Dominican Rep.", "El Salvador",
            "Grenada", "Guatemala", "Haiti", "Honduras", "Jamaica", "Mexico",
            "Nicaragua", "Panama", "St. Kitts and Nevis", "Saint Lucia",
            "St. Vin. and Gren.", "Trinidad and Tobago", "United States of America",
            "Puerto Rico", "U.S. Virgin Is.", "Sint Maarten", "St-Martin",
            "Greenland", "Bermuda", "Cayman Is.", "Montserrat", "Turks and Caicos Is.",
            "Anguilla", "Aruba", "British Virgin Is.",
            "Curaçao", "St-Barthélemy",
            "St. Pierre and Miquelon"
        ]
    },
    "South America": {
        name: "South America",
        color: "#9966FF",
        countries: [
            "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador",
            "Falkland Is.", "Fr. S. Antarctic Lands", "Guyana", "Paraguay", "Peru",
            "S. Geo. and the Is.", "Suriname", "Uruguay", "Venezuela"
        ]
    },
    "Oceania": {
        name: "Oceania",
        color: "#FF9F40",
        countries: [
            "American Samoa", "Australia", "Cook Is.", "Fiji", "Fr. Polynesia",
            "Guam", "Heard I. and McDonald Is.", "Kiribati", "Marshall Is.", "Micronesia", "Nauru",
            "New Caledonia", "New Zealand", "Niue", "N. Mariana Is.", "Norfolk Island", "Palau",
            "Papua New Guinea", "Pitcairn Is.", "Samoa", "Solomon Is.",
            "Tonga", "Vanuatu", "Wallis and Futuna Is."
        ]
    },
    "Antarctica": {
        name: "Antarctica",
        color: "#999999",
        countries: [
            "Antarctica"
        ]
    }
};