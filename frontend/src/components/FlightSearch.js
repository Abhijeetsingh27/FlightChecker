import React, { useState } from 'react';
import amadeusService from '../services/amadeusService';
import '../styles/FlightSearch.css';

const FlightSearch = () => {
  const [searchParams, setSearchParams] = useState({
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    cabinClass: 'ECONOMY'
  });
  const [isOneWay, setIsOneWay] = useState(false);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState({ origin: '', destination: '' });

  // Comprehensive list of major airports worldwide
  const airports = {
    // North America
    'JFK': 'John F. Kennedy International Airport, New York',
    'LAX': 'Los Angeles International Airport',
    'SFO': 'San Francisco International Airport',
    'ORD': 'O\'Hare International Airport, Chicago',
    'MIA': 'Miami International Airport',
    'YYZ': 'Toronto Pearson International Airport',
    'YVR': 'Vancouver International Airport',
    'MEX': 'Benito Juárez International Airport, Mexico City',
    'ATL': 'Hartsfield–Jackson Atlanta International Airport',
    'DFW': 'Dallas/Fort Worth International Airport',
    'DEN': 'Denver International Airport',
    'SEA': 'Seattle–Tacoma International Airport',
    'LAS': 'Harry Reid International Airport, Las Vegas',
    'PHX': 'Phoenix Sky Harbor International Airport',
    'CLT': 'Charlotte Douglas International Airport',
    'EWR': 'Newark Liberty International Airport',
    'BOS': 'Logan International Airport, Boston',
    'DTW': 'Detroit Metropolitan Airport',
    'PHL': 'Philadelphia International Airport',
    'LGA': 'LaGuardia Airport, New York',

    // Europe
    'LHR': 'Heathrow Airport, London',
    'CDG': 'Charles de Gaulle Airport, Paris',
    'FRA': 'Frankfurt Airport',
    'AMS': 'Amsterdam Airport Schiphol',
    'MAD': 'Adolfo Suárez Madrid–Barajas Airport',
    'FCO': 'Leonardo da Vinci International Airport, Rome',
    'IST': 'Istanbul Airport',
    'ZRH': 'Zurich Airport',
    'VIE': 'Vienna International Airport',
    'CPH': 'Copenhagen Airport',
    'HEL': 'Helsinki Airport',
    'BCN': 'Barcelona–El Prat Airport',
    'MUC': 'Munich Airport',
    'LIS': 'Lisbon Portela Airport',
    'ARN': 'Stockholm Arlanda Airport',
    'OSL': 'Oslo Airport, Gardermoen',
    'BRU': 'Brussels Airport',
    'DUB': 'Dublin Airport',
    'MAN': 'Manchester Airport',
    'EDI': 'Edinburgh Airport',

    // Asia
    'DXB': 'Dubai International Airport',
    'SIN': 'Changi Airport, Singapore',
    'HKG': 'Hong Kong International Airport',
    'NRT': 'Narita International Airport, Tokyo',
    'ICN': 'Incheon International Airport, Seoul',
    'DEL': 'Indira Gandhi International Airport, Delhi',
    'BOM': 'Chhatrapati Shivaji Maharaj International Airport, Mumbai',
    'BKK': 'Suvarnabhumi Airport, Bangkok',
    'KUL': 'Kuala Lumpur International Airport',
    'PEK': 'Beijing Capital International Airport',
    'PVG': 'Shanghai Pudong International Airport',
    'CAN': 'Guangzhou Baiyun International Airport',
    'CTU': 'Chengdu Shuangliu International Airport',
    'MNL': 'Ninoy Aquino International Airport, Manila',
    'CGK': 'Soekarno–Hatta International Airport, Jakarta',
    'TPE': 'Taiwan Taoyuan International Airport',
    'DPS': 'Ngurah Rai International Airport, Bali',
    'KHH': 'Kaohsiung International Airport',
    'MAA': 'Chennai International Airport',
    'BLR': 'Kempegowda International Airport, Bangalore',

    // Oceania
    'SYD': 'Sydney Airport',
    'MEL': 'Melbourne Airport',
    'BNE': 'Brisbane Airport',
    'AKL': 'Auckland Airport',
    'PER': 'Perth Airport',
    'ADL': 'Adelaide Airport',
    'CNS': 'Cairns Airport',
    'HBA': 'Hobart Airport',
    'DRW': 'Darwin International Airport',
    'CHC': 'Christchurch Airport',

    // Middle East
    'AUH': 'Abu Dhabi International Airport',
    'DOH': 'Hamad International Airport, Doha',
    'RUH': 'King Khalid International Airport, Riyadh',
    'JED': 'King Abdulaziz International Airport, Jeddah',
    'TLV': 'Ben Gurion Airport, Tel Aviv',
    'AMM': 'Queen Alia International Airport, Amman',
    'BEY': 'Beirut–Rafic Hariri International Airport',
    'MCT': 'Muscat International Airport',
    'KWI': 'Kuwait International Airport',
    'BAH': 'Bahrain International Airport',

    // Africa
    'JNB': 'O.R. Tambo International Airport, Johannesburg',
    'CPT': 'Cape Town International Airport',
    'CAI': 'Cairo International Airport',
    'NBO': 'Jomo Kenyatta International Airport, Nairobi',
    'ADD': 'Addis Ababa Bole International Airport',
    'CMN': 'Mohammed V International Airport, Casablanca',
    'LAD': 'Quatro de Fevereiro Airport, Luanda',
    'LOS': 'Murtala Muhammed International Airport, Lagos',
    'ACC': 'Kotoka International Airport, Accra',
    'DSS': 'Blaise Diagne International Airport, Dakar',

    // South America
    'GRU': 'São Paulo/Guarulhos International Airport',
    'EZE': 'Ministro Pistarini International Airport, Buenos Aires',
    'SCL': 'Arturo Merino Benítez International Airport, Santiago',
    'LIM': 'Jorge Chávez International Airport, Lima',
    'BOG': 'El Dorado International Airport, Bogotá',
    'UIO': 'Mariscal Sucre International Airport, Quito',
    'GIG': 'Rio de Janeiro/Galeão International Airport',
    'MVD': 'Carrasco International Airport, Montevideo',
    'ASU': 'Silvio Pettirossi International Airport, Asunción',
    'CCS': 'Simón Bolívar International Airport, Caracas'
  };

  // Comprehensive list of major airlines
  const airlineLogos = {
    // North American Airlines
    'AA': 'https://www.gstatic.com/flights/airline_logos/70px/AA.png', // American Airlines
    'DL': 'https://www.gstatic.com/flights/airline_logos/70px/DL.png', // Delta Air Lines
    'UA': 'https://www.gstatic.com/flights/airline_logos/70px/UA.png', // United Airlines
    'AC': 'https://www.gstatic.com/flights/airline_logos/70px/AC.png', // Air Canada
    'WN': 'https://www.gstatic.com/flights/airline_logos/70px/WN.png', // Southwest Airlines
    'B6': 'https://www.gstatic.com/flights/airline_logos/70px/B6.png', // JetBlue Airways

    // European Airlines
    'BA': 'https://www.gstatic.com/flights/airline_logos/70px/BA.png', // British Airways
    'LH': 'https://www.gstatic.com/flights/airline_logos/70px/LH.png', // Lufthansa
    'AF': 'https://www.gstatic.com/flights/airline_logos/70px/AF.png', // Air France
    'KL': 'https://www.gstatic.com/flights/airline_logos/70px/KL.png', // KLM
    'IB': 'https://www.gstatic.com/flights/airline_logos/70px/IB.png', // Iberia
    'LX': 'https://www.gstatic.com/flights/airline_logos/70px/LX.png', // Swiss International
    'OS': 'https://www.gstatic.com/flights/airline_logos/70px/OS.png', // Austrian Airlines
    'SK': 'https://www.gstatic.com/flights/airline_logos/70px/SK.png', // SAS
    'TK': 'https://www.gstatic.com/flights/airline_logos/70px/TK.png', // Turkish Airlines

    // Asian Airlines
    'SQ': 'https://www.gstatic.com/flights/airline_logos/70px/SQ.png', // Singapore Airlines
    'AI': 'https://www.gstatic.com/flights/airline_logos/70px/AI.png', // Air India
    'QF': 'https://www.gstatic.com/flights/airline_logos/70px/QF.png', // Qantas
    'EK': 'https://www.gstatic.com/flights/airline_logos/70px/EK.png', // Emirates
    'EY': 'https://www.gstatic.com/flights/airline_logos/70px/EY.png', // Etihad Airways
    'QR': 'https://www.gstatic.com/flights/airline_logos/70px/QR.png', // Qatar Airways
    'TG': 'https://www.gstatic.com/flights/airline_logos/70px/TG.png', // Thai Airways
    'CX': 'https://www.gstatic.com/flights/airline_logos/70px/CX.png', // Cathay Pacific
    'JL': 'https://www.gstatic.com/flights/airline_logos/70px/JL.png', // Japan Airlines
    'NH': 'https://www.gstatic.com/flights/airline_logos/70px/NH.png', // ANA
    'KE': 'https://www.gstatic.com/flights/airline_logos/70px/KE.png', // Korean Air
    'MH': 'https://www.gstatic.com/flights/airline_logos/70px/MH.png', // Malaysia Airlines
    'GA': 'https://www.gstatic.com/flights/airline_logos/70px/GA.png', // Garuda Indonesia

    // Middle Eastern Airlines
    'SV': 'https://www.gstatic.com/flights/airline_logos/70px/SV.png', // Saudia
    'WY': 'https://www.gstatic.com/flights/airline_logos/70px/WY.png', // Oman Air
    'GF': 'https://www.gstatic.com/flights/airline_logos/70px/GF.png', // Gulf Air

    // African Airlines
    'ET': 'https://www.gstatic.com/flights/airline_logos/70px/ET.png', // Ethiopian Airlines
    'SA': 'https://www.gstatic.com/flights/airline_logos/70px/SA.png', // South African Airways
    'MS': 'https://www.gstatic.com/flights/airline_logos/70px/MS.png', // EgyptAir

    // South American Airlines
    'LA': 'https://www.gstatic.com/flights/airline_logos/70px/LA.png', // LATAM Airlines
    'AV': 'https://www.gstatic.com/flights/airline_logos/70px/AV.png', // Avianca
    'JJ': 'https://www.gstatic.com/flights/airline_logos/70px/JJ.png', // LATAM Brasil
    'G3': 'https://www.gstatic.com/flights/airline_logos/70px/G3.png'  // GOL Linhas Aéreas
  };

  // Simplified cabin class options
  const cabinClasses = [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FIRST', label: 'First' }
  ];

  // Function to convert currency to INR (using a simple conversion rate for demo)
  const convertToINR = (amount, currency) => {
    const rates = {
      'USD': 83,
      'EUR': 90,
      'GBP': 105,
      'AED': 22.5,
      'SGD': 61.5
    };
    return Math.round(amount * (rates[currency] || 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value.toUpperCase()
    }));

    // Update search term for dropdowns
    if (name === 'originLocationCode') {
      setSearchTerm(prev => ({ ...prev, origin: value.toUpperCase() }));
      setShowOriginDropdown(true);
    } else if (name === 'destinationLocationCode') {
      setSearchTerm(prev => ({ ...prev, destination: value.toUpperCase() }));
      setShowDestinationDropdown(true);
    }
  };

  const handleTripTypeChange = (e) => {
    const isOneWayTrip = e.target.value === 'one-way';
    setIsOneWay(isOneWayTrip);
    if (isOneWayTrip) {
      setSearchParams(prev => ({ ...prev, returnDate: '' }));
    }
  };

  const handleAirportSelect = (code, type) => {
    if (type === 'origin') {
      setSearchParams(prev => ({ ...prev, originLocationCode: code }));
      setShowOriginDropdown(false);
      setSearchTerm(prev => ({ ...prev, origin: code }));
    } else {
      setSearchParams(prev => ({ ...prev, destinationLocationCode: code }));
      setShowDestinationDropdown(false);
      setSearchTerm(prev => ({ ...prev, destination: code }));
    }
  };

  const filteredAirports = (type) => {
    const search = type === 'origin' ? searchTerm.origin : searchTerm.destination;
    return Object.entries(airports)
      .filter(([code, name]) => 
        code.toLowerCase().includes(search.toLowerCase()) || 
        name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5); // Show only top 5 matches
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!airports[searchParams.originLocationCode]) {
      setError('Please select a valid origin airport');
      setLoading(false);
      return;
    }

    if (!airports[searchParams.destinationLocationCode]) {
      setError('Please select a valid destination airport');
      setLoading(false);
      return;
    }

    try {
      const results = await amadeusService.searchFlights(
        searchParams.originLocationCode,
        searchParams.destinationLocationCode,
        searchParams.departureDate,
        isOneWay ? null : searchParams.returnDate,
        searchParams.adults,
        searchParams.cabinClass
      );
      setFlights(results.data || []);
    } catch (err) {
      setError(err.message || 'Error searching for flights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (flight) => {
    const segment = flight.itineraries[0].segments[0];
    const airlineCode = segment.carrierCode;
    const departureDate = new Date(segment.departure.at).toISOString().split('T')[0];
    const returnDate = flight.itineraries[0].segments[1] ? 
      new Date(flight.itineraries[0].segments[1].departure.at).toISOString().split('T')[0] : null;

    // Map of airline booking URLs with proper parameters
    const airlineBookingUrls = {
      'AA': `https://www.aa.com/booking/flights/from/${segment.departure.iataCode}/to/${segment.arrival.iataCode}/depart/${departureDate}${returnDate ? `/return/${returnDate}` : ''}`,
      'DL': `https://www.delta.com/flight-search/book-a-flight?fromCity=${segment.departure.iataCode}&toCity=${segment.arrival.iataCode}&fromDate=${departureDate}${returnDate ? `&toDate=${returnDate}` : ''}`,
      'UA': `https://www.united.com/ual/en/us/flight-search/book-a-flight?f=${segment.departure.iataCode}&t=${segment.arrival.iataCode}&d=${departureDate}${returnDate ? `&r=${returnDate}` : ''}`,
      'BA': `https://www.britishairways.com/travel/home/public/en_us/?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&depart_date=${departureDate}${returnDate ? `&return_date=${returnDate}` : ''}`,
      'LH': `https://www.lufthansa.com/online/portal/lh/us/homepage?l=us&cid=1000078&departureDate=${departureDate}&origin=${segment.departure.iataCode}&destination=${segment.arrival.iataCode}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'AF': `https://wwws.airfrance.fr/searchEngine/flightSearch?departureDate=${departureDate}&origin=${segment.departure.iataCode}&destination=${segment.arrival.iataCode}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'KL': `https://www.klm.com/travel/us_en/plan_and_book/timetables/index.htm?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&date=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'SQ': `https://www.singaporeair.com/en_UK/us/home#/book/bookflight?origin=${segment.departure.iataCode}&destination=${segment.arrival.iataCode}&departureDate=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'EK': `https://www.emirates.com/us/english/book/?f=${segment.departure.iataCode}&t=${segment.arrival.iataCode}&d=${departureDate}${returnDate ? `&r=${returnDate}` : ''}`,
      'QR': `https://www.qatarairways.com/en-us/homepage.html?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&departureDate=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'EY': `https://www.etihad.com/en-us/plan-and-book/flights/?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&date=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'TK': `https://www.turkishairlines.com/en-int/flights/from-${segment.departure.iataCode}-to-${segment.arrival.iataCode}/?date=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'TG': `https://www.thaiairways.com/en_TH/index.page?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&departureDate=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'CX': `https://www.cathaypacific.com/cx/en_US.html?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&date=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'JL': `https://www.jal.co.jp/en/booking/?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&date=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'NH': `https://www.ana.co.jp/en/us/booking/?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&date=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'KE': `https://www.koreanair.com/global/en.html?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&date=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'MH': `https://www.malaysiaairlines.com/us/en.html?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&date=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`,
      'GA': `https://www.garuda-indonesia.com/other-countries/en/index.page?from=${segment.departure.iataCode}&to=${segment.arrival.iataCode}&date=${departureDate}${returnDate ? `&returnDate=${returnDate}` : ''}`
    };

    // Get the booking URL for the airline
    const bookingUrl = airlineBookingUrls[airlineCode];
    
    if (bookingUrl) {
      // Open the airline's booking URL in a new tab
      window.open(bookingUrl, '_blank');
    } else {
      // If airline not found, open Google Flights with the flight details
      const googleFlightsUrl = `https://www.google.com/travel/flights/search?tfs=CAwQAhopEgoyMDI0LTAzLTIxag0IAhIJL20vMDJfMjAwcg0IAhIJL20vMDJfMjAwcgwIAhIIL20vMDJfMjAw&tfu=EgYIABABGAA&hl=en&q=flights%20${segment.departure.iataCode}%20to%20${segment.arrival.iataCode}%20on%20${departureDate}`;
      window.open(googleFlightsUrl, '_blank');
    }
  };

  return (
    <div className="flight-search-container">
      <h2>Search Flights</h2>
      <form onSubmit={handleSearch} className="search-form">
        <div className="trip-type-selector">
          <label>
            <input
              type="radio"
              name="tripType"
              value="round-trip"
              checked={!isOneWay}
              onChange={handleTripTypeChange}
            />
            Round Trip
          </label>
          <label>
            <input
              type="radio"
              name="tripType"
              value="one-way"
              checked={isOneWay}
              onChange={handleTripTypeChange}
            />
            One Way
          </label>
        </div>

        <div className="form-group">
          <label>From:</label>
          <div className="airport-input-container">
            <input
              type="text"
              name="originLocationCode"
              value={searchParams.originLocationCode}
              onChange={handleInputChange}
              placeholder="Search airport code or name"
              required
            />
            {showOriginDropdown && (
              <div className="airport-dropdown">
                {filteredAirports('origin').map(([code, name]) => (
                  <div
                    key={code}
                    className="airport-option"
                    onClick={() => handleAirportSelect(code, 'origin')}
                  >
                    <span className="airport-code">{code}</span>
                    <span className="airport-name">{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>To:</label>
          <div className="airport-input-container">
            <input
              type="text"
              name="destinationLocationCode"
              value={searchParams.destinationLocationCode}
              onChange={handleInputChange}
              placeholder="Search airport code or name"
              required
            />
            {showDestinationDropdown && (
              <div className="airport-dropdown">
                {filteredAirports('destination').map(([code, name]) => (
                  <div
                    key={code}
                    className="airport-option"
                    onClick={() => handleAirportSelect(code, 'destination')}
                  >
                    <span className="airport-code">{code}</span>
                    <span className="airport-name">{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Departure Date:</label>
          <input
            type="date"
            name="departureDate"
            value={searchParams.departureDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {!isOneWay && (
          <div className="form-group">
            <label>Return Date:</label>
            <input
              type="date"
              name="returnDate"
              value={searchParams.returnDate}
              onChange={handleInputChange}
              min={searchParams.departureDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Number of Adults:</label>
          <input
            type="number"
            name="adults"
            value={searchParams.adults}
            onChange={handleInputChange}
            min="1"
            max="9"
            required
          />
        </div>

        <div className="form-group">
          <label>Cabin Class:</label>
          <div className="cabin-class-selector">
            {cabinClasses.map((cabin) => (
              <label key={cabin.value} className="cabin-option">
                <input
                  type="radio"
                  name="cabinClass"
                  value={cabin.value}
                  checked={searchParams.cabinClass === cabin.value}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, cabinClass: e.target.value }))}
                />
                <span className="cabin-label">{cabin.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {flights.length > 0 && (
        <div className="flight-results">
          <h3>Available Flights - {cabinClasses.find(c => c.value === searchParams.cabinClass)?.label}</h3>
          {flights.map((flight, index) => {
            const segment = flight.itineraries[0].segments[0];
            const airlineCode = segment.carrierCode;
            const duration = flight.itineraries[0].duration
              .replace('PT', '')
              .replace('H', 'h ')
              .replace('M', 'm')
              .trim();
            const priceInINR = convertToINR(flight.price.total, flight.price.currency);

            return (
              <div key={index} className="flight-card">
                <div className="flight-header">
                  <div className="airline-info">
                    <img 
                      src={airlineLogos[airlineCode] || 'https://www.gstatic.com/flights/airline_logos/70px/XX.png'} 
                      alt={airlineCode}
                      className="airline-logo"
                    />
                    <div className="airline-details">
                      <span className="airline-name">{segment.carrierCode}</span>
                      <span className="flight-number">{segment.number}</span>
                    </div>
                  </div>
                  <div className="flight-price">
                    <span className="price-label">Price</span>
                    <span className="price-amount">₹{priceInINR.toLocaleString()}</span>
                    <span className="price-original">{flight.price.currency} {flight.price.total}</span>
                  </div>
                </div>

                <div className="flight-route">
                  <div className="route-details">
                    <div className="departure">
                      <span className="time">{new Date(segment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="date">{new Date(segment.departure.at).toLocaleDateString()}</span>
                      <span className="airport">{airports[segment.departure.iataCode] || segment.departure.iataCode}</span>
                      <span className="terminal">Terminal {segment.departure.terminal || 'N/A'}</span>
                    </div>

                    <div className="flight-duration">
                      <div className="duration-line"></div>
                      <span className="duration">{duration}</span>
                      <div className="flight-type">{segment.operating?.carrierCode ? 'Operated by ' + segment.operating.carrierCode : 'Direct'}</div>
                    </div>

                    <div className="arrival">
                      <span className="time">{new Date(segment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="date">{new Date(segment.arrival.at).toLocaleDateString()}</span>
                      <span className="airport">{airports[segment.arrival.iataCode] || segment.arrival.iataCode}</span>
                      <span className="terminal">Terminal {segment.arrival.terminal || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flight-footer">
                  <div className="flight-details">
                    <span className="aircraft">Aircraft: {segment.aircraft.code}</span>
                    <span className="class">Class: {flight.travelerPricings[0].fareDetailsBySegment[0].cabin}</span>
                    <span className="cabin-type">{searchParams.cabinClass}</span>
                  </div>
                  <button 
                    className="book-button"
                    onClick={() => handleBooking(flight)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlightSearch; 