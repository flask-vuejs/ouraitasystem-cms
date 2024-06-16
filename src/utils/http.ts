import axios from "axios"
import type { AxiosInstance } from "axios";
// import auth from "./auth"
import qs from "qs";

const server_host='http://127.0.0.1:5000'

class Http {
    server_host:string;
    http:AxiosInstance;
    constructor(){
        this.server_host=server_host;
        this.http=axios.create({
            baseURL:server_host+'/cmsapi',
            timeout:1000*60,
        });
        // 请求之前的拦截器，用来设置JWT
        // this.http.interceptors.request.use(config=>{
        //     const token=auth.token
        //     if(token){
        //         config.headers.common.Authorization="Bearer "+token
        //     }
        //     return config
        // })
        
        // 响应拦截器
        // this.http.interceptors.response.use(response=>{
        //     return response.data
        // }
    }

    
    _post(url:string,data:Record<string,any>){
        return this.http.post(url,qs.stringify(data))
    }
    addBanner(data:any){
        const url="/banner/add"
        return this._post(url,data)
    }
    getBannerList(){
        const url="/banner/list"
        return this.http.get(url)
    }
    deleteBanner(banner_id:number){
        const url="/banner/delete"
        return this._post(url,{"banner_id":banner_id})
    }
    editBanner(data:any){
        const url="/banner/edit"
        return this._post(url,data)
    }
    getPapersList(page:number){
        const url="/papers/list?page="+(page?page.toString():"1")
        return this.http.get(url)
    }
    deletePapers(paper_id:number){
        const url="/papers/delete"
        return this._post(url,{"id":paper_id})
    }
    getGroupList(){
        const url="/group/list"
        return this.http.get(url)
    }
    getNewsList(){
        const url="/news/list"
        return this.http.get(url)
    }
    getDatasetsList(){
        const url="/datasets/list"
        return this.http.get(url)
    }
}

export default new Http()