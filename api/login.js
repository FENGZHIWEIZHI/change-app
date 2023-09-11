// 获取验证码
function getCode(username) {
  return uni.$u.get('/code',{ username });
}

// 登录方法
function login(username, password) {
  const data = {
    username,
    password,
  }
  return uni.$u.post('/login', data);
}

// 登录方法
function codeLogin(username, code) {
  return uni.$u.post('/code_login', {
    username,
    code
  });
}

// 注册
function register(data) {
  return uni.$u.post('/register', data);
}

// 退出
function logout() {
  return uni.$u.post('/logout')
}



export default {
  getCode,
  login,
  codeLogin,
  register,
  logout,
}
