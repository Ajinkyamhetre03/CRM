// src/middleware/apiTracker.js
const apiHits = {}; // { '/api/superadmin/getUsers': 5, '/api/hr/create': 3 }

const apiTracker = (req, res, next) => {
  const path = req.baseUrl + req.path; // e.g. /api/superadmin/users
  apiHits[path] = (apiHits[path] || 0) + 1;
  console.log(`[API TRACKER] ${path} => ${apiHits[path]} hits`);
  next();
};

const getApiStats = () => apiHits;

export { apiTracker, getApiStats };
