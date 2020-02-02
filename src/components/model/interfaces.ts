import { RouteComponentProps } from 'react-router';

export interface Post {

    // Post ID
    id?: string;
    // User ID
    posted_by?: number;
    // Post title
    title: string;
    // Content in Markdown Format
    content: string;
    // Category
    post_category?: Category
    // author name
    author?: Author;
    //Language
    post_language?: Language
    // Image URL
    image_url?: string;
}

export interface Author {
    username: string
}

export interface Category {
    id: number;
    category: string;
}

export interface Language {
    id: number;
    language: string;
}

interface RouterProps {
    _id: string;
    isLocal?: string;
}

export interface Result<T> {
    count: number;
    next?: string
    previous?: string
    results: T[]
}

export interface EditorProps extends RouteComponentProps<RouterProps> {
    insertImage(imagePath: string): void
}


export interface Video {
    id: number;
    title: string;
    content: string;
    category: number;
    original_video: string;
    video_480p?: string;
    video_720p?: string;
    video_1080p?: string;
    video_4k?: string;
    video_category: Category
}