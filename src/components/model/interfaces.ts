import { RouteComponentProps } from 'react-router';

export interface Post {

    // Post ID
    _id?: string;
    // Post category ID
    category: number;
    // Local Image File
    cover?: File;
    // Online Image
    cover_url?: string;
    // User ID
    posted_by?: number;
    // Post title
    title: string;
    // Content in Markdown Format
    content: string;
    // Category name
    category_name?: string;
    // User Name
    posted_name?: string;
    // Is local version
    isLocal: boolean;
}

export interface Category {
    _id: number;
    category: string;
}

export interface Language {
    _id: number;
    languageName: string;
}

interface RouterProps {
    _id: string;
    isLocal?: string;
}

export interface EditorProps extends RouteComponentProps<RouterProps> { }