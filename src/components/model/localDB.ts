import DataStore from "nedb"
import { Post } from '../home/HomePage';

export const getAllLocalPosts = (userID: number): Promise<Post[]> => {
    let _, db = new DataStore();
    return new Promise((resolve, reject) => {
        db.find({ $where: {  } }, (err: any, docs: Post[]) => {
            if (err) {
                reject(err)
            }
            resolve(docs)
        })
    })
}

export const insertPost = (userID: number, post: Post) => {
    let _, db = new DataStore();
    return new Promise((resolve, reject) => {
        post.userID = userID;
        db.insert(post, (err: any, newDoc: any) => {
            if (err) reject()
            resolve()
        })

    })
}