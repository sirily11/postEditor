import AWS, { S3 } from "aws-sdk";

const buckName = "sirilee-webpage-post-image"
const bucketRegion = "ap-east-1"
const accessID = "AKIA5OFVTR4CQYITLFEK"
const secretKey = "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"


export const uploadImage = async (image: File, onUpload: (progress: number) => void) => {
    return new Promise((resolve, reject) => {
        let s3 = new S3({ accessKeyId: accessID, secretAccessKey: secretKey, region: bucketRegion })
        let key = `postImage/${image.name.replace(/ /g, '_')}`
        console.log("photoKey", key)
        s3.upload({
            Bucket: buckName,
            Key: key,
            Body: image,
            ACL: "public-read"
        }, (err, data) => {
            if (err) console.log(err)
            resolve()

        }).on("httpUploadProgress", (evt) => {
            onUpload(evt.loaded / evt.total)
        })
    })

}   