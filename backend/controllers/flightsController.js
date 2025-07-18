const { supabase } = require('../db/supabaseClient');

// Search flights
const searchFlights = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    console.log('Search params:', { origin, destination, date });

    let query = supabase
      .from('flights')
      .select('*');

    if (origin) {
      query = query.ilike('origin', `%${origin}%`);
    }
    if (destination) {
      query = query.ilike('destination', `%${destination}%`);
    }
    if (date) {
      query = query.gte('departure_time', `${date}T00:00:00`)
                   .lt('departure_time', `${date}T23:59:59`);
    }

    console.log('Executing query...');
    const { data, error } = await query;
    console.log('Query result:', { data, error });

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('No flights found');
      return res.json([]);
    }

    console.log(`Found ${data.length} flights`);
    res.json(data);
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ 
      error: 'Failed to search flights',
      details: error.message 
    });
  }
};

// Get flight by ID
const getFlightById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting flight by ID:', id);

    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    if (!data) {
      console.log('Flight not found');
      return res.status(404).json({ error: 'Flight not found' });
    }

    console.log('Flight found:', data);
    res.json(data);
  } catch (error) {
    console.error('Error getting flight:', error);
    res.status(500).json({ 
      error: 'Failed to get flight details',
      details: error.message 
    });
  }
};

module.exports = {
  searchFlights,
  getFlightById
}; 