import DataStore from "nedb"
import { Post } from '../interfaces';

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

export const insertPost = async (userID: number, post: Post, dbName = "data.db"): Promise<Post> => {
    let _, db = new DataStore({ filename: dbName, autoload: true });
    return new Promise(async (resolve, reject) => {
        post.posted_by = userID;
        if (post.onlineID) {
            let p = await findByOnlineID(post.onlineID)
            console.log("Find post data with onlineID")
            if (p) {
                console.log("Update existing post")
                updatePost(post)
            } else {
                console.log("Insert new one")
                db.insert(post, (err: any, newDoc: Post) => {
                    if (err) reject()
                    console.log("Inserted new data", newDoc)
                    resolve(newDoc)
                })
            }
        }


    })
}

const findByOnlineID = (postID: string, dbName = "data.db") => {
    let _, db = new DataStore({ filename: dbName, autoload: true });
    return new Promise((resolve, reject) => {
        db.findOne({ onlineID: postID }, (err, document) => {
            if (err) reject(err)
            else {
                resolve(document)
            }
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