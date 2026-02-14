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
            "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herz.",
            "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Faeroe Is.", "Finland",
            "France", "Georgia", "Germany", "Greece", "Guernsey", "Hungary", "Iceland", "Ireland",
            "Isle of Man", "Italy", "Jersey", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein",
            "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco",
            "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania",
            "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden",
            "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Vatican", "Åland"
        ]
    },
    "Asia": {
        name: "Asia",
        color: "#36A2EB",
        countries: [
            "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan",
            "Br. Indian Ocean Ter.", "Brunei", "Cambodia", "China", "Cyprus", "Egypt", "Georgia",
            "Hong Kong", "India", "Indian Ocean Ter.", "Indonesia", "Iran", "Iraq", "Israel",
            "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon",
            "Macao", "Malaysia", "Maldives", "Mongolia", "Myanmar", "N. Cyprus", "Nepal",
            "North Korea", "Oman", "Pakistan", "Palestine", "Philippines", "Qatar", "Russia",
            "Saudi Arabia", "Siachen Glacier", "Singapore", "South Korea", "Sri Lanka", "Syria",
            "Taiwan", "Tajikistan", "Thailand", "Timor-Leste", "Turkey", "Turkmenistan",
            "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"
        ]
    },
    "Africa": {
        name: "Africa",
        color: "#FFCE56",
        countries: [
            "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
            "Cabo Verde", "Cameroon", "Central African Rep.", "Chad", "Comoros",
            "Congo", "Côte d'Ivoire", "Dem. Rep. Congo", "Djibouti", "Egypt", "Eq. Guinea",
            "Eritrea", "eSwatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea",
            "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar",
            "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique",
            "Namibia", "Niger", "Nigeria", "Rwanda", "S. Sudan", "Saint Helena",
            "Senegal", "Seychelles", "Sierra Leone", "Somalia", "Somaliland", "South Africa",
            "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "W. Sahara",
            "Zambia", "Zimbabwe", "São Tomé and Principe"
        ]
    },
    "North America": {
        name: "North America",
        color: "#4BC0C0",
        countries: [
            "Anguilla", "Antigua and Barb.", "Aruba", "Bahamas", "Barbados", "Belize",
            "Bermuda", "British Virgin Is.", "Canada", "Cayman Is.", "Costa Rica", "Cuba",
            "Curaçao", "Dominica", "Dominican Rep.", "El Salvador", "Greenland", "Grenada",
            "Guatemala", "Haiti", "Honduras", "Jamaica", "Mexico", "Montserrat", "Nicaragua",
            "Panama", "Puerto Rico", "Saint Lucia", "Sint Maarten", "St-Barthélemy",
            "St. Kitts and Nevis", "St. Pierre and Miquelon", "St-Martin", "St. Vin. and Gren.",
            "Trinidad and Tobago", "Turks and Caicos Is.", "U.S. Virgin Is.", "United States of America"
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