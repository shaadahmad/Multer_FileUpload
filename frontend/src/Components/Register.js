import React, { useRef } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";




function Register() {

    const r_email = useRef();
    const r_name = useRef();
    const r_phone = useRef();
    const r_pass = useRef();

    const Navigate = useNavigate()

    // const dispatch=useDispatch();


    function registerUser() {
        const newUser = {
            email: r_email.current.value,
            name: r_name.current.value,
            password: r_pass.current.value
        }

        if (r_email.current.value === '' || r_name.current.value === ''  || r_pass.current.value === '') {
            alert('fill the fields')
        }
        else {
            console.log(newUser)
            axios.post("http://localhost:5000/register", newUser).then(res => console.log(res.data))
            Navigate('/login')
        }
    }

    return (
        <>
            <div className="  formm" >
                <div className="innerForm">
                    <form>
                        <div ><h1 >Sign-Up</h1></div>
                        <br />
                        {/* <label className='registerLabel' htmlFor="fname">Email  : </label> */}
                        <input className="inputFeild" type="email" name="fname" ref={r_email} placeholder="Type Your Email Here"/><br />
                        <br />
                        {/* <label className='registerLabel' htmlFor="fname">Name : </label> */}
                        <input type="text" className="inputFeild" name="fname" ref={r_name} placeholder="Name"/><br />
                        <br />
                        {/* <label className='registerLabel' htmlFor="fname">Password : </label> */}
                        <input type="password" name="fname" className="inputFeild" ref={r_pass} placeholder="Password"/><br />
                        <br />
                        <div className='mt-4'>
                            <button type="button" className="btn" onClick={(e) => registerUser(e)}>Register</button>
                            <br />
                            <Link to='/login'>
                                <button className="btn">Already Have an Account </button>
                            </Link>
                        </div>
                    </form>
                </div>

                <br />
            </div>
        </>
    )
}

export default Register;
