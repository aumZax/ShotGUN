// endpoints.ts
const BASE_URL = "http://100.112.212.19:3000"; 
// const BASE_URL = "http://localhost:3000";

// const BASE_URL = "https://api-test-pi-rosy.vercel.app";


const ENDPOINTS = {
  // UPLOAD_PENDING: `${BASE_URL}/pending`,
  // UPLOAD_APPROVED: `${BASE_URL}/approved`,
  GET_IMAGES: `${BASE_URL}/images`,

  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  GET_PENDING: `${BASE_URL}/getPendingFiles`,
  GET_APPROVED: `${BASE_URL}/getApprovedFiles`,
  NEWPROJECT: `${BASE_URL}/newproject`,
  PROJECTLIST: `${BASE_URL}/projectlist`,
  PROJECTDETAIL: `${BASE_URL}/projectdetails`,
  PROJECTINFO: `${BASE_URL}/projectinfo`,
  UPLOAD: `${BASE_URL}/upload`,
  GETPROJECTIMAGES: `${BASE_URL}/project/images`,
  DELETEPROJECT: `${BASE_URL}/deleteProject`,
  UPLOAD_AVATAR: `${BASE_URL}/upload/avatar`,
  image_url: "http://100.112.212.19:3000/",
  videos: `${BASE_URL}/videos`,
  IMAGE_URL: `${BASE_URL}/`,
  UPLOAD_VIDEO: `${BASE_URL}/upload/video`,
  VIDEOS: `${BASE_URL}/videos`,
  DELETEPROJECTIMAGE: `${BASE_URL}/deleteProjectImage`,
  PEOPLE: `${BASE_URL}/people`,
  GETPEOPLE: `${BASE_URL}/getpeople`,
  SEATS: `${BASE_URL}/seats`,
  USERS: `${BASE_URL}/getallusers`,
  STATUSPEOPLE: `${BASE_URL}/statuspeople`,
  PROJECT_SEQUENCES: `${BASE_URL}/project-sequences`,
  UPDATE_SEQUENCE: `${BASE_URL}/project-sequences/update`,
  CREATE_SEQUENCE: `${BASE_URL}/project-sequences/create`,
  UPLOAD_SEQUENCE: `${BASE_URL}/sequence/upload`,
  SHOTLIST: `${BASE_URL}/shotlist`,
  UPDATESHOT: `${BASE_URL}/updateshot`,
  CREATESHOT: `${BASE_URL}/createshot`,
  GETSEQUENCE: `${BASE_URL}/getsequence`,
  UPLOAD_SHOT: `${BASE_URL}/shot/upload`,
  CREATEASSETS: `${BASE_URL}/createasset`,
  ASSETLIST: `${BASE_URL}/assetlist`,
  UPDATEASSET: `${BASE_URL}/updateasset`,
  ASSETUPLOAD: `${BASE_URL}/asset/upload`,
  GETSHOTS: `${BASE_URL}/getshots`,
  PROJECT_SHOT_STATS: `${BASE_URL}/projectDetail-shots/Calculator`,
  PROJECT_ASSET_STATS: `${BASE_URL}/projectDetail-assets/Calculator`,
  PROJECT_SEQUENCE_STATS: `${BASE_URL}/projectDetail-sequences/Calculator`,
  UPLOAD_ASSET: `${BASE_URL}/asset/upload`,



  // เพิ่ม endpoint อื่น ๆ ตามต้องการ
};

export default ENDPOINTS;
