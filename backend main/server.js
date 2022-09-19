const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const cors = require('cors');
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const app = express();
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.set("view engine", "ejs");
const Users = require("./model/register");
const Log = require("./model/fileLog");
const mongoURI = "mongodb+srv://Shaad:Vinove321@quiz.gal2t.mongodb.net/users?retryWrites=true&w=majority";
const conn = mongoose.createConnection(mongoURI);
// console.log(conn,"adasdasd")
let gfs;
mongoose.connect(mongoURI).then(res => {
    console.log("mongo connected")


})

conn.on('connected', function () {
    console.log('database is connected successfully');
});

// conn.once("open", () => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection("uploads");
// });


let  gridfsBucket;
conn.once('open', () => 
{
 gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
 bucketName: 'uploads'
});

 gfs = Grid(conn.db, mongoose.mongo);
 gfs.collection('uploads');
})

// conn.once("open", () => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection("Office");
// });

const storage = new GridFsStorage({
    url: mongoURI,
    file: function (req, file) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const fileInfo = {
                    filename: file.originalname,
                    bucketName: "uploads"
                };
                resolve(fileInfo);

            });
        });
    },
});

const upload = multer({

    fileFilter: function (req, file, cb) {
        console.log(req.body.NewLogData ,"hi");
        console.log(file);
        // console.log(gfs.files,"gfs.files .........")
        // console.log(gfs.files.find())
        gfs.files.find({ filename: file.originalname })
            // const data=gfs.files.find()
            .toArray((err, files) => {
                // console.log(files, "file found")
                if (files.length != 0) {
                    req.fileValidationError = "You cant upload this since its already uploaded";
                    cb(null, false, req.fileValidationError);
                } else {

                    cb(null, true, "uploads");
                }
            })

    }, storage
});

app.post("/upload", upload.single("file"), (req, res) => {
    console.log(req.body.NewLogData ,"hi");

    if (req.fileValidationError) {
        res.send(req.fileValidationError)
    }
    else
        res.send("File uploaded successfully");
}
);

app.post("/uploadNewFile", async(req, res) => {
    console.log(req.body,"newData");

    try {
        const newUser = new Log(req.body);

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

}
);

app.post("/register", async (req, res) => {

    // Users.create(req.body, (err, data) => {
    //     console.log(req.body)
    //     !err ? res.send(data) : res.send(err.message)
    // })

    try {
        const newUser = new Users(req.body);

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

})

app.get('/login', async (req, res) => {

    Users.find((err, data) => {
        !err ? res.send(data) : res.send([])
    })
})

app.get('/downloadImage/:filename', async (req, res) => {

    console.log(req.params,"parans")

    gfs.files.findOne(req.params, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "No file exists",
            });
        }
        if (file.contentType === "image/jpeg" || file.contentType === "image/png"|| file.contentType === "image/jpg") {
            const readstream = gridfsBucket.openDownloadStreamByName(file.filename);
            readstream.pipe(res);
            // res.send(file)
        } else {
            res.status(404).json({
                err: "Not an image",
            });
        }
    });
})

// app.get('/getData', async (req, res) => {

//     gfs.files.find()

//         .toArray((err, files) => {
//             console.log(files, "file found")
//             if (files.length != 0) {
//                 res.send(files)
//             } else {
//                 res.send([])
//             }
//         })
// })

app.post('/getData', async (req, res) => {
    // console.log(req.body);
    Log.find({name:req.body.name},(err, data) => {
        !err ?res.send(data): res.send([])
    })

    
})

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
