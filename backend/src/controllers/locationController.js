const supabase = require('../config/supabase');

// GET /api/locations — fetch all locations
const getLocations = async (req, res) => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// GET /api/locations/:id — fetch one location
const getLocationById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'Location not found' });
  res.json(data);
};

// POST /api/locations — create a new location
const createLocation = async (req, res) => {
  const {
    name, category, address, latitude, longitude,
    ramp_available, ramp_usable, elevator_available, elevator_working,
    accessible_washroom, wheelchair_entrance, accessible_parking,
    tactile_paving, surface_quality, door_width_cm, handrails,
  } = req.body;

  // Basic validation — required fields
  if (!name || !category || !address || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'name, category, address, latitude, and longitude are required' });
  }

  const { data, error } = await supabase
    .from('locations')
    .insert([{
      name, category, address, latitude, longitude,
      ramp_available, ramp_usable, elevator_available, elevator_working,
      accessible_washroom, wheelchair_entrance, accessible_parking,
      tactile_paving, surface_quality, door_width_cm, handrails,
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

module.exports = { getLocations, getLocationById, createLocation };