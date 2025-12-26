// endpoints.ts
// const BASE_URL = "http://localhost:3000"; 
const BASE_URL = "https://api-test-pi-rosy.vercel.app";

const ENDPOINTS = {
  // UPLOAD_PENDING: `${BASE_URL}/pending`,
  // UPLOAD_APPROVED: `${BASE_URL}/approved`,
  GET_IMAGES: `${BASE_URL}/images`,
  GET_VIDEOS: `${BASE_URL}/videos`,
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  GET_PENDING: `${BASE_URL}/getPendingFiles`,
  GET_APPROVED: `${BASE_URL}/getApprovedFiles`,
  NEWPROJECT: `${BASE_URL}/newproject`,
  PROJECTLIST: `${BASE_URL}/projectlist`,
  PROJECTDETAIL: `${BASE_URL}/projectdetails`,
  PROJECTINFO: `${BASE_URL}/projectinfo`,
  UPLOAD: `${BASE_URL}/upload`,
  GETPROJECTIMAGES: `${BASE_URL}/getProjectImages`,
  DELETEPROJECT: `${BASE_URL}/deleteProject`,
  CREATESHOT:`${BASE_URL}/createShot`,
  // เพิ่ม endpoint อื่น ๆ ตามต้องการ
};

export default ENDPOINTS;
