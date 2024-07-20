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
    get_paper_form(paper_id:string){
        const url="/papers/form?paper_id="+paper_id
        return this.http.get(url)
    }
    add_paper(data:any){
        const url="/papers/add"
        return this._post(url,data)
    }
    edit_paper(data:any){
        const url="/papers/edit"
        return this._post(url,data)
    }
    deletePapers(paper_id:number){
        const url="/papers/delete"
        return this._post(url,{"id":paper_id})
    }
    getGroupList(){
        const url="/group/list"
        return this.http.get(url)
    }
    addGroups(data:any){
        const url="/group/add"
        return this._post(url,data)
    }
    editGroups(data:any){
        const url="/group/edit"
        return this._post(url,data)
    }
    deleteGroups(group_id:number){
        const url="/group/delete"
        return this._post(url,{"id":group_id})
    }
    getNewsList(){
        const url="/news/list"
        return this.http.get(url)
    }
    addNews(data:any){
        const url="/news/add"
        return this._post(url,data)
    }
    editNews(data:any){
        const url="/news/edit"
        return this._post(url,data)
    }
    deleteNews(news_id:number){
        const url="/news/delete"
        return this._post(url,{"id":news_id})
    }
    getDatasetsList(){
        const url="/datasets/list"
        return this.http.get(url)
    }
    deleteDataset(dataset_id:number){
        const url="/datasets/delete"
        return this._post(url,{"id":dataset_id})
    }
    addDataset(data:any){
        const url="/datasets/add"
        return this._post(url,data)
    }
    editDataset(data:any){
        const url="/datasets/edit"
        return this._post(url,data)
    }
    get_hxxm(){
        const url="/hxxm/list"
        return this.http.get(url)
    }
    add_hxxm(data:any){
        const url="/hxxm/add"
        return this._post(url,data)
    }
    edit_hxxm(data:any){
        const url="/hxxm/edit"
        return this._post(url,data)
    }
    delete_hxxm(hxxm_id:number){
        const url="/hxxm/delete"
        return this._post(url,{"id":hxxm_id})
    }
    get_zxxm(){
        const url="/zxxm/list"
        return this.http.get(url)
    }
    add_zxxm(data:any){
        const url="/zxxm/add"
        return this._post(url,data)
    }
    edit_zxxm(data:any){
        const url="/zxxm/edit"
        return this._post(url,data)
    }
    delete_zxxm(zxxm_id:number){
        const url="/zxxm/delete"
        return this._post(url,{"id":zxxm_id})
    }
}

export default new Http()