const USER_KEY = "USER_KEY"
const TOKEN_KEY = "JWT_TOKEN_KEY"

// class Auth{
//     static _instance: Auth | null = null;
//     token:any;
//     user:any;
//     //  构造方法
//   constructor(){
//     this.token = null
//     this.user = null
//     this.token = localStorage.getItem(TOKEN_KEY)
//     const userJson = localStorage.getItem(USER_KEY)
//     if(userJson){
//       this.user = JSON.parse(userJson)
//     }
//   }

//   static getInstance(){
//     if(!this._instance){
//       this._instance = new Auth()
//     }
//     return this._instance
//   }
  
//   setUserToken(user,token){
//     this.user = user
//     this.token = token
//     localStorage.setItem(USER_KEY,JSON.stringify(user))
//     localStorage.setItem(TOKEN_KEY,token)
//   }

//   clearUserToken(){
//     this.user = null;
//     this.token = null;
//     localStorage.removeItem(USER_KEY)
//     localStorage.removeItem(TOKEN_KEY)
//   }

//   get is_authed(){
//     if(this.user && this.token){
//       return true
//     }else{
//       return false
//     }
//   }

//   get is_staff(){
//       // 首先检查用户是否已认证
//       if(!this.is_authed){
//         return false;
//       }
//       // 若已认证，进一步检查用户是否为工作人员
//       if(this.user.is_staff){
//         return true;
//       }
//       return false;
//   }
// }


// const authInstance = Auth.getInstance() as Auth;
// export default authInstance;

// export default Auth.getInstance()