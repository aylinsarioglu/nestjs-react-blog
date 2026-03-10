import axios from "axios";
import authService from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// eğer refresh token'ın süresi dolduysa yeni bir access token oluştur
// gelen cevaptaki hatayı kontrol edip refresh endpointine istek at
// eper refresh token'ında süresi dolduysa login sayfasına yönlendir

api.interceptors.response.use(
  // api'den her olumlu cevap geldiğinde çalışır
  (res) => res,
  // api'den gelen her hatada çalışır
  async (err) => {
    // atılan api isteğini al
    const originalRequest = err.config;

    // eğer gelen hatanın sebebi access token'ın süresinin dolmasıysa
    if (
      originalRequest &&
      !originalRequest.retry &&
      originalRequest.url === "user/me" &&
      err.response.status === 401 &&
      err?.response?.data?.message === "Unauthorized"
    ) {
      // isteği tekrar atacağımız için retry'i true yap
      originalRequest.retry = true;
      try {
        // refresh token ile yeni access token oluştur
        await authService.refreshToken();
        // hata aldığımız son isteği tekrar et
        return api.request(originalRequest)
      } catch (error) {
        // eğer refresh token'in süresi dolduysa logout
        await authService.logout();
        // login sayfasına yönlendir
        window.location.href = "/login";
      }
    }  
    // hata döndür
        return Promise.reject(err);
  }
);

export default api;
