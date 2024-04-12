// .envから設定
const API_URL = process.env.REACT_APP_API_URL;

// ログインAPI
export const LOGIN_API = `${API_URL}/api/admin/login`;
// 管理者登録API
export const ADMIN_REGISTER_API = `${API_URL}/api/admin/register`;
// 従業員一覧取得API
export const GET_EMPLOYEES_API = `${API_URL}/api/employees`;
// 従業員登録API
export const POST_EMPLOYEES_API = `${API_URL}/api/employees`;
// 従業員更新API
export const PUT_EMPLOYEES_API = `${API_URL}/api/employees`;
// 従業員削除API
export const DELETE_EMPLOYEES_API = `${API_URL}/api/employees`;
// 従業員インポートAPI
export const POST_IMPORT_API = `${API_URL}/api/employees/import`;
