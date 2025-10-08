export type Continent = {
    name: string;
    countries: string[];
    color: string;
};

export const continents: Record<string, Continent> = {
    "Europe": {
        name: "Europe",
        color: "#FF6384",
        countries: [
            "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina",
            "Bulgaria", "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland",
            "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy",
            "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova",
            "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland",
            "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia",
            "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City"
        ]
    },
    "Asia": {
        name: "Asia",
        color: "#36A2EB",
        countries: [
            "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan",
            "Brunei", "Cambodia", "China", "Cyprus", "Georgia", "India", "Indonesia",
            "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait",
            "Kyrgyzstan", "Laos", "Lebanon", "Malaysia", "Maldives", "Mongolia",
            "Myanmar", "Nepal", "North Korea", "Oman", "Pakistan", "Palestine",
            "Philippines", "Qatar", "Saudi Arabia", "Singapore", "South Korea",
            "Sri Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand", "Timor-Leste",
            "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam",
            "Yemen"
        ]
    },
    "Africa": {
        name: "Africa",
        color: "#FFCE56",
        countries: [
            "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
            "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Comoros",
            "Congo", "Democratic Republic of the Congo", "Djibouti", "Egypt",
            "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana",
            "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia",
            "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius",
            "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda",
            "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone",
            "Somalia", "South Africa", "South Sudan", "Sudan", "Swaziland",
            "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
        ]
    },
    "North America": {
        name: "North America",
        color: "#4BC0C0",
        countries: [
            "Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Canada",
            "Costa Rica", "Cuba", "Dominica", "Dominican Republic", "El Salvador",
            "Grenada", "Guatemala", "Haiti", "Honduras", "Jamaica", "Mexico",
            "Nicaragua", "Panama", "Saint Kitts and Nevis", "Saint Lucia",
            "Saint Vincent and the Grenadines", "Trinidad and Tobago",
            "United States"
        ]
    },
    "South America": {
        name: "South America",
        color: "#9966FF",
        countries: [
            "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador",
            "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"
        ]
    },
    "Oceania": {
        name: "Oceania",
        color: "#FF9F40",
        countries: [
            "Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia",
            "Nauru", "New Zealand", "Palau", "Papua New Guinea", "Samoa",
            "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"
        ]
    }
};