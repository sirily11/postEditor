import DataStore from "nedb"
import { Post } from '../home/HomePage';


export const getAllLocalPosts = (userID: number, dbName = "data.db"): Promise<Post[]> => {
    let _, db = new DataStore({ filename: dbName, autoload: true });

    return new Promise((resolve, reject) => {
        db.find({}, (err: any, docs: Post[]) => {
            console.log(docs)
            if (err) {
                reject(err)
            }
            resolve(docs)
        })
    })
}

export const insertPost = (userID: number, post: Post, dbName = "data.db") => {
    let _, db = new DataStore({ filename: dbName, autoload: true });
    return new Promise((resolve, reject) => {
        post.userID = userID;
        db.insert(post, (err: any, newDoc: any) => {
            if (err) reject()
            resolve()
        })
    })
}