export interface Zxxm {
    id?: number;
    name: string;
    description?: string; 
    funding_agency: string;
    start_date: string; 
    end_date: string;
    principal_investigator?: string; 
    budget?: number; 
    status: string; 
}

export interface Hxxm {
    id?: number;
    name: string;
    description?: string; 
    client: string;
    start_date: string; 
    end_date: string;
    project_manager?: string; 
    budget?: number; 
}

// 表格column
export interface table_col{
    label:string,
    prop:string,
}


export interface paper{
    papers_id:number;
    title:string;
    author:string;
    content:string;
    create_time:string;
    image_url?:string;
    abstract:string;
    keywords:string;
}

export interface Dataset {
    data_id:string,
    data_title:string,
    data_abstract?:string,
    data_content?:string,
    data_author:string,
    data_date?:string,
    data_link:string,
    data_read_count?:string,
    data_image_url:string,
    data_type:string
}

export interface New {
    news_id:string,
    news_title:string,
    news_content:string,
    news_date?:string,
    news_author:string,
    news_link:string,
    news_read_count?:string,
    news_image_url:string,
    label_id:string
}

export interface Group {
    group_id:number,
    group_type:string,
    group_role:string,
    group_person_name:string,
    group_person_description:string,
    group_person_image_url:string,
    group_person_content:string,
    group_person_papers?:string
}