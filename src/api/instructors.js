import axios from "axios";

const API_URL = "http://localhost:8000/instructors";

/* ---------------------- TOKEN HELPER ---------------------- */
export const getToken = () => localStorage.getItem("token");

/* ---------------------- AXIOS INSTANCE ---------------------- */
const api = axios.create({
  baseURL: API_URL,
});

/* Automatically attach JWT token */
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Format instructor data (null → “no resort selected”) */
const formatInstructor = (data) => {
  return {
    ...data,
    local_resort: data.local_resort ?? "No resort selected",
  };
};

/* ---------------------- API FUNCTIONS ---------------------- */

/**
 * GET /instructors/me
 * Gets current instructor profile
 */
export async function fetchInstructorProfile() {
  const res = await api.get(`/me`);
  return formatInstructor(res.data);
}

/**
 * GET /instructors/{id}
 * Get instructor by ID
 */
export async function fetchInstructorById(instructorId) {
  const res = await api.get(`/${instructorId}`);
  return formatInstructor(res.data);
}

/**
 * GET /instructors?resort={name}
 * Get instructors from a resort
 */
export async function fetchInstructorsByResort(resortName) {
  const res = await api.get(``, {
    params: { resort: resortName },
  });

  return res.data.map((inst) => formatInstructor(inst));
}

/**
 * PATCH /instructors/update-local-resort
 */
export async function updateLocalResort(newResort) {
  const res = await api.patch(`/update-local-resort`, {
    local_resort: newResort,
  });

  // response is { message, local_resort }
  return res.data;
}
