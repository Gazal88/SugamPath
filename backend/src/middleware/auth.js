const supabase = require('../config/supabase');

// Verifies the request has a valid Supabase session token
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = data.user; // attach user to request for later use
  next();
};

// Checks the user's role from `profiles` — use AFTER requireAuth
const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(403).json({ error: 'Profile not found' });
    }

    if (!allowedRoles.includes(profile.role)) {
      return res.status(403).json({ error: `Requires role: ${allowedRoles.join(' or ')}` });
    }

    next();
  };
};

module.exports = { requireAuth, requireRole };