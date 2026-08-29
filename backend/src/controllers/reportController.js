const supabase = require('../config/supabase');

const EXPIRY_DAYS = 30; // TODO: confirm actual number with team

// GET /api/reports — fetch all reports (optionally filter by status)
const getReports = async (req, res) => {
  const { status } = req.query;

  let query = supabase.from('reports').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  const now = new Date();
  const result = data.map(r => {
    if (r.status === 'pending' && r.expires_at && new Date(r.expires_at) < now) {
      return { ...r, status: 'expired' };
    }
    return r;
  });

  res.json(result);
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

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + EXPIRY_DAYS);

  const { data, error } = await supabase
    .from('reports')
    .insert([{ reported_by, location_id, latitude, longitude, issue_type, description, photo_url, expires_at: expiresAt.toISOString() }])
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

// PATCH /api/reports/:id/upvote — increment upvotes, auto-verify at threshold
const UPVOTE_THRESHOLD = 5; // TODO: confirm actual number with team

const upvoteReport = async (req, res) => {
  const { id } = req.params;

  const { data: report, error: fetchError } = await supabase
    .from('reports')
    .select('upvotes, status')
    .eq('id', id)
    .single();

  if (fetchError) return res.status(500).json({ error: fetchError.message });
  if (!report) return res.status(404).json({ error: 'Report not found' });

  const newUpvotes = report.upvotes + 1;
  const shouldAutoVerify = newUpvotes >= UPVOTE_THRESHOLD && report.status === 'pending';

  const updatePayload = {
    upvotes: newUpvotes,
    updated_at: new Date().toISOString(),
  };

  if (shouldAutoVerify) {
    updatePayload.status = 'verified';
    updatePayload.verified_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('reports')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

module.exports = { getReports, createReport, verifyReport, upvoteReport };