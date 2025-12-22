// endpoints.ts
const BASE_URL = "http://localhost:3000"; 
// const BASE_URL = "https://api-shot-grid-ysfx.vercel.app";

const ENDPOINTS = {
  UPLOAD_PENDING: `${BASE_URL}/pending`,
  UPLOAD_APPROVED: `${BASE_URL}/approved`,
  GET_IMAGES: `${BASE_URL}/images`,
  GET_VIDEOS: `${BASE_URL}/videos`,
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  GET_PENDING: `${BASE_URL}/getPendingFiles`,
  GET_APPROVED: `${BASE_URL}/getApprovedFiles`,
  // เพิ่ม endpoint อื่น ๆ ตามต้องการ
};

export default ENDPOINTS;
