import axios from "axios";
import Cookies from "js-cookie";

const axiosInterceptors = axios.create({
	baseURL: process.env.BASE_URL_PROD,
});

axiosInterceptors.interceptors.request.use(
	function (config) {
		config.headers = {
			Authorization: `Bearer ${Cookies.get("token")}`,
		};
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

axiosInterceptors.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		if (error.response.status === 403) {
			Cookies.remove("token");
			Cookies.remove("user_id");
			localStorage.clear();
			if (Cookies.get("token")) {
				alert(error.response.data.msg);
				window.location.href = "/auth/login";
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInterceptors;
