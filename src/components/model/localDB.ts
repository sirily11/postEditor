import DataStore from "nedb"
import { Post } from './interfaces';

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

export const getLocalPost = (postID: string, dbName = "data.db"): Promise<Post> => {
    let _, db = new DataStore({ filename: dbName, autoload: true });

    return new Promise((resolve, reject) => {
        db.findOne({ _id: postID }, (err: any, docs: Post) => {
            if (err) {
                reject(err)
            }
            resolve(docs)
        })
    })
}

export const updatePost = (post: Post, dbName = "data.db") => {
    let _, db = new DataStore({ filename: dbName, autoload: true });
    return new Promise((resolve, reject) => {
        console.log(post._id)
        db.update({ _id: post._id }, post, {}, (err: Error, numAffected: number) => {
            if (err) {
                reject(err)
            }
            console.log("Number affected", numAffected)
            resolve(numAffected)
        })
    })
}

export const insertPost = (userID: number, post: Post, dbName = "data.db") => {
    let _, db = new DataStore({ filename: dbName, autoload: true });
    return new Promise((resolve, reject) => {
        post.posted_by = userID;
        db.insert(post, (err: any, newDoc: any) => {
            if (err) reject()
            resolve()
        })
    })
}

export const deletePost = (post: Post, dbName = "data.db") => {
    let _, db = new DataStore({ filename: dbName, autoload: true });
    return new Promise((resolve, reject) => {
        db.remove({ _id: post._id }, (err: Error, num: number) => {
            if (err) reject(err)
            resolve(num)
        })
    })
}