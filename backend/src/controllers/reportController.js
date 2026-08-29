const supabase = require('../config/supabase');

// GET /api/reports — fetch all reports (optionally filter by status)
const getReports = async (req, res) => {
  const { status } = req.query;

  let query = supabase.from('reports').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/reports — submit a new obstacle report
const createReport = async (req, res) => {
  const {
    reported_by, location_id, latitude, longitude,
    issue_type, description, photo_url,
  } = req.body;

  if (!location_id || latitude == null || longitude == null || !issue_type) {
    return res.status(400).json({ error: 'location_id, latitude, longitude, and issue_type are required' });
  }

  const { data, error } = await supabase
    .from('reports')
    .insert([{ reported_by, location_id, latitude, longitude, issue_type, description, photo_url }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// PATCH /api/reports/:id/verify — mark a report as verified or rejected
const verifyReport = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be "verified" or "rejected"' });
  }

  const { data, error } = await supabase
    .from('reports')
    .update({ status, verified_by: req.user.id, verified_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

module.exports = { getReports, createReport, verifyReport };