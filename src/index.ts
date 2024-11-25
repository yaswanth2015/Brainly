import express from "express";
import connectToDB from "./connectToDB";
import { EnvironmentVariables } from "./EnvironmentValues";
import { zodUserSchema, UserModel } from "./model/userModel";
import jwt from "jsonwebtoken";
import { ContentModel, zodContentSchema, zodDeleteContentSchema } from "./model/contentModel";

const app = express()

connectToDB(EnvironmentVariables.getSharedInstance().getMongoUrl())

app.use(express.json())

app.post("/api/v1/signup", async (req, res) => {
    const data = zodUserSchema.safeParse(req.body);
    if (data.success) {
        const newuser = data.data
        try {
            const isUserPresent = await UserModel.find({
                emailId: newuser.emailId
            })
            if (isUserPresent.length != 0) {
                res.status(403).send({
                    message: "Account Already exists, Please login with those credentials"
                })
                return
            } else {
                //DO Salting the password before storing in db
                await UserModel.create(newuser);
                res.status(201).send({message: "User created Successfully"})
            }
        } catch (e) {
            console.log("Error in adding details")
            res.status(500).send({
                message: "Error in creating details"
            })
        }
    } else {
        res.status(401).send({
            message: `${data.error.errors[0].message}`
        })
    }
})


app.post("/api/v1/signin", async (req, res)=>{
    const data = zodUserSchema.safeParse(req.body);
    if (data.success) {
        const receivedUserData = data.data
        // Do Salting for the password before storing in DB
        const userFromDB = await UserModel.find({
            emailId: receivedUserData.emailId,
            password: receivedUserData.password
        })
        if(userFromDB.length == 0) {
            res.status(404).send({message: "User Not found"})
        } else {
            const userValue = userFromDB[0];
            const secret = EnvironmentVariables.getSharedInstance().getJWTSecretKey()
            const jwtToken = jwt.sign({id: userValue.id}, secret);
            res.status(200).send({
                token: jwtToken
            })
        }
    } else {
        res.status(403).send({message: `${data.error.errors[0].message}`})
    }
})

function checkAuthentication(req: any, res: any, next: any) {
    const bearer = req.headers.authorization as string;
    const token = bearer.split(" ")[1]
    try {
        const data = jwt.verify(token, EnvironmentVariables.getSharedInstance().getJWTSecretKey());
        if (data) {
            //@ts-ignore
            req.userId = data.id
            next()
        } else {
            res.status(403).send({ message: "Invalid Credenitals Please Login again" })
        }
    } catch (e) {
        console.log("Error occured")
        res.status(500).send({ message: "Error in verifying the token" })
    }
}

app.use((req, res, next) => {
    checkAuthentication(req, res, next)
})

//For adding the content
app.post("/api/v1/content", async (req, res)=>{
    const data = zodContentSchema.safeParse(req.body)
    if (data.success) {
        const bodyData = data.data
       await ContentModel.create({
            contentType: bodyData.type,
            link: bodyData.link,
            title: bodyData.title,
            tags: bodyData.tags,
            //@ts-ignore
            userIdRef: req.userId
        })
        res.status(200).send({ message: "Content added successfully" })
    } else {
        res.status(403).send({ message: `${data.error.errors[0].message}` })
    }
})
//For getting the content
app.get("/api/v1/content", async (req, res)=>{
    try {
        const data = await ContentModel.find({
            //@ts-ignore
            userIdRef: req.userId
        }).populate("userIdRef", "emailId")
        res.status(200).send({ content: data })
    } catch(e) {
        res.status(500).send({ message: "error in fetching details" })
    }
})
//For deleting the content
app.delete("/api/v1/content", async (req, res) => {
    const data = zodDeleteContentSchema.safeParse(req.body)
    if (data.success) {
        const parsedData = data.data
        await ContentModel.deleteMany({
            //@ts-ignore
            userIdRef: req.userId,
            _id: parsedData.contentId
        })
        res.status(200).send({ message: `Content deleted successfully` })
    } else {
        res.status(403).send({ message: `${data.error.errors[0].message}` })
    }
})
//For sharing content
app.post("/api/v1/brain/share", (req, res)=> {

})

//For fetching the shared links
app.get("/api/v1/brain/share/:sharedId", (req, res) => {

})

app.listen(8080, ()=>{
    console.log("started successfully")
})
