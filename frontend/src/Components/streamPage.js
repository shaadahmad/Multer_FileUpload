import axios from 'axios'
import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
// import FileDownloadIcon from '@mui/icons-material/FileDownload';


function StreamPage() {

    const [userData, setUserData] = useState()
    const [radio, setRadio] = useState("Personal")
    const uploadFile = useRef();
    const [value, setValue] = useState('');
    const [tableFilter, setTable] = useState([])

    useEffect(() => {
        axios.post("http://localhost:5000/getData", { name: sessionStorage.getItem('Name') }) //json
            .then(response => {
                setUserData(response.data)
                setTable(response.data)

            })
    }, [userData])
    // console.log(userData)
    // console.log(userData)

    const filterData = (e) => {
        if (e.target.value !== "") {
            setValue(e.target.value)
            let temp = userData;
            let filterTable = temp.filter(val => val.fileName.toLowerCase().includes(e.target.value.toLowerCase()))
            setTable(filterTable)
        }
        else {
            setTable(userData)
        }
    }

    function handleImg(e) {
        e.preventDefault()
        const file = uploadFile.current.files[0];
        file["UserName"] = sessionStorage.getItem('Name');
        file["fileName"] = file.name;
        file["typeOfFile"] = radio;

        const newData = {
            name: sessionStorage.getItem('Name'),
            fileName: file.name,
            typeOfFile: radio
        }
        // console.log(file, "testing image")
        var profilePic = new FormData();
        profilePic.append("file", file);

        // profilePic.append("file", file);

        console.log(file)
        axios.post("http://localhost:5000/uploadNewFile", newData)
        // console.log(profilePic)
        axios.post("http://localhost:5000/upload", profilePic)

        sessionStorage.setItem("image", file.name)
        // window.location.reload();
    }

    // const getImage = (data) => {
    //     console.log(data, "data getImage")
    //     axios.get(`http://localhost:5000/downloadImage/${data.fileName}`).then((res) => {
    //         console.log(res)
    //         // // <a href="' + res + '" download></a>
    //         // var link = document.createElement("a");
    //         // If you don't know the name or want to use
    //         // the webserver default set name = ''
    //         // link.setAttribute('download', data.name);
    //         // let uri = `http://localhost:5000/downloadImage/${data.fileName}`;
    //         // link.href = uri;
    //         // document.body.appendChild(link);
    //         // link.click();
    //         // link.setAttribute('download', `${screenType}.xlsx`);
    //         // document.body.appendChild(link);
    //         // link.click();
    //         // link.remove();  
    //         // console.log(res, "ahsfahas")
    //         // let blob=new Blob(res.data)
    //         // const link = document.createElement("a");
    //         // // link.style.display = "none";
    //         // link.href = URL.createObjectURL(blob);
    //         // link.download = data.fileName;

    //         // document.body.appendChild(link);
    //         // link.click();

    //         var fileURL = URL.createObjectURL(res.data);
    //         // var fileURL =URL.createObjectURL(res.data)
    //         var data = btoa(res.data);
    //         const link = document.createElement('a');
    //         link.href = data;
    //         link.setAttribute('download', `imgggg.jpeg}`);
    //         document.body.appendChild(link);
    //         link.click();

    //     }).catch((err) => {
    //         console.log(err);
    //     }
    //     )
    // }
    const getBase64StringFromDataURL = (dataURL) =>
        dataURL.replace('data:', '').replace(/^.+,/, '');

    const getImage = (data) => {
        console.log(data, "data getImage")
        // axios.get(`http://localhost:5000/downloadImage/${data.fileName}`)
        fetch(`http://localhost:5000/downloadImage/${data.fileName}`, {
            method: "GET",
            headers: {},
        })

            .then((response) => {

                // console.log(res,"data for image")
                // const a = document.createElement("a");
                // let uri = `http://localhost:5000/downloadImage/${data.fileName}`;
                // // a.download = "";
                // a.href = uri;
                // a.target = "hiddenIframe"
                // // a.download = "images"
                // a.download = uri.substring(uri.lastIndexOf('/') + 1);

                // document.body.appendChild(a);
                // // a.setAttribute('Download', ` `);
                // // window.open(uri, 'Download');
                // a.click();

                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", data.fileName.split("_")[0]); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });


            }).catch((err) => {
                console.log(err);
            }
            )
    }

    return (
        <div>

            <div className='right'>
                {/* <div className='head'> <h1>Upload New Files Here</h1></div> */}
                <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet" />
                <form class="form-container" enctype='multipart/form-data'>
                    <div class="upload-files-container">
                        <div class="drag-file-area">
                            <span class="material-icons-outlined upload-icon"> file_upload </span>
                            <h3 class="dynamic-message"> Drag & drop any file here </h3>
                            <label class="label"> or <span class="browse-files">
                                <input type="file" class="default-file-input" ref={uploadFile} />
                                <span class="browse-files-text">browse file</span> <span>from device</span> </span> </label>
                        </div>
                        <span class="cannot-upload-message"> <span class="material-icons-outlined">error</span> Please select a file first <span class="material-icons-outlined cancel-alert-button">cancel</span> </span>
                        <div class="file-block">
                            <div class="file-info"> <span class="material-icons-outlined file-icon">description</span> <span class="file-name"> </span> | <span class="file-size">  </span> </div>
                            <span class="material-icons remove-file-icon">delete</span>
                            <div class="progress-bar"> </div>
                        </div>
                        <div class="wrapper">
                            <input type="radio" name="select" id="option-1" onClick={(e) => setRadio(e.target.value)} value="Personal" />
                            <input type="radio" name="select" id="option-2" onClick={(e) => setRadio(e.target.value)} value="Work" />
                            <label for="option-1" class="option option-1">
                                <div class="dot"></div>
                                <span>Personal</span>
                            </label>
                            <label for="option-2" class="option option-2">
                                <div class="dot"></div>
                                <span>Work</span>
                            </label>
                        </div>

                        <button type="button" class="upload-button" onClick={handleImg}> Upload </button>
                    </div>
                </form>
            </div>
            <div className='left'>
                <div class="datatable-container">

                    <div class="header-tools">
                        <div class="tools">
                            <ul>
                                <li>
                                    <button>
                                        <i class="material-icons">add_circle</i>
                                    </button>
                                </li>
                                <li>
                                    <button>
                                        <i class="material-icons">edit</i>
                                    </button>
                                </li>
                                <li>
                                    <button>
                                        <i class="material-icons">delete</i>
                                    </button>
                                </li>
                                <li>

                                    <button>
                                        <i class="material-icons">download</i>
                                    </button>

                                </li>
                            </ul>
                        </div>

                        <div class="search">
                            <input type="text" class="search-input" placeholder="Search..." onChange={filterData} />
                        </div>
                    </div>

                    <table class="datatable ">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>File Name</th>
                                <th>Type Of File</th>
                                <th>Uploaded By</th>
                                {/* <th>length</th>
                                <th>Upload Date</th> */}
                                <th>Download</th>

                            </tr>
                        </thead>

                        <tbody>
                            {

                                tableFilter && tableFilter.map((data, i) => {
                                    return (
                                        <tr>
                                            {/* {console.log(data)} */}
                                            <td>{i + 1}</td>
                                            <td>{data.fileName}</td>
                                            <td>{data.typeOfFile}</td>
                                            <td>{data.name}</td>
                                            {/* <td>{data.length}</td>
                                            <td>{data.uploadDate}</td> */}
                                            <td> <button onClick={() => getImage(data)}><i class="material-icons">download</i></button> </td>
                                            {/* <td> <Link to="/home/shaadahmad/Desktop/multer task/my-app/src/logo.svg" target="_blank" download><button onClick={() => getImage(data)}><i class="material-icons">download</i></button></Link> </td> */}
                                        </tr>)
                                })
                            }
                        </tbody>
                    </table>


                    <div class="footer-tools">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default StreamPage