import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { useHistory } from 'react-router'


const Signup = () => {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPass, setConfirmPass] = useState()
    const [pic, setPic] = useState()
    const [show, setShow] = useState()
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    
    const handleClick = () => setShow(!show)
    const postDetails = async (pics) => {
        setLoading(true)
        if(pics === undefined){
            toast.success('Please Select an Image!', {
                position: "bottom-center"
              })
              return
        }
        console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const formData = new FormData();
        formData.append('file', pics);
    
        try {
          const response = await axios.post('/api/upload', formData);
          const filePath = response.data.filePath;
          setPic(`/uploads/${filePath}`);
          setTimeout(()=>{
            setLoading(false)
          },2000)
        } catch (error) {
          console.error('Error uploading image:', error);
          setTimeout(()=>{
            setLoading(false)
          },2000)
        }
    }
    else{
        toast.success('Please select an image.', {
            position: "bottom-center"
          })
          setTimeout(()=>{
            setLoading(false)
          },2000)
          return;
    }
    }
    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPass) {
            toast.success('Please fill all the fields.', {
                position: "bottom-center",
                "icon":'⚠'
              })
              setTimeout(()=>{
                setLoading(false)
              },2000)
          return;
        }
        if (password !== confirmPass) {
            toast.error('Password do not match.', {
                position: "bottom-center"
              })
              setTimeout(()=>{
                setLoading(false)
              },2000)

          return;
        }
        console.log(name, email, password, pic);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            "/api/user",
            {
              name,
              email,
              password,
              pic,
            },
            config
          );
          console.log(data);
          toast.success('Registration Successfull.', {
            position: "bottom-center"
          })
          localStorage.setItem("userInfo", JSON.stringify(data));
          setTimeout(()=>{
            setLoading(false)
          },2000)
          history.push("/");
        } catch (error) {
            toast.error('Error occured.', {
                position: "bottom-center"
              })
              setTimeout(()=>{
                setLoading(false)
              },2000)
        }
    }
  return (
    <div className="mx-auto h flex w-full max-w-sm flex-col gap-6">
<div className="flex flex-col items-center">
    <h1 className="text-3xl font-semibold">Sign Up</h1>
</div>
<div className="form-group">
    <div className="form-field">
        <label className="form-label">Name</label>

        <input placeholder="Type here" type="text" className="input max-w-full" onChange={e=> setName(e.target.value)} />
        <label className="form-label">Email address</label>

        <input placeholder="Type here" type="email" className="input max-w-full" onChange={e=> setEmail(e.target.value)} />
        <label className="form-label">
            <span className="form-label-alt">Please enter a valid email.</span>
        </label>
    </div>
    <div className="form-field">
        <label className="form-label">Password</label>
        <div className="form-control">
            <input placeholder="Type here" type={show?"text":"password"} className="input max-w-full" onChange={e=> setPassword(e.target.value)} />
            <span className="absolute inset-y-0 right-4 inline-flex items-center">
			<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-content3 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={handleClick}>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
			</svg>
		</span>
        </div>
    </div>
    <div className="form-field">
        <label className="form-label">Confirm Password</label>
        <div className="form-control">
            <input placeholder="Type here" type={show?"text":"password"} className="input max-w-full" onChange={e=> setConfirmPass(e.target.value)} />
            <span className="absolute inset-y-0 right-4 inline-flex items-center">
			<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-content3 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={handleClick}>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
			</svg>
		</span>
        </div>
    </div>
    <label className="form-label">Upload your Picture</label>

<input placeholder="Type here" type="file" accept='image/*' className="input max-w-full" onChange={e=> postDetails(e.target.files[0])} />
    <div className="form-field pt-0">
        <div className="form-control justify-between">
            <button type="button" onClick={submitHandler} disabled={loading} className="btn btn-primary w-full">{loading ? <svg class="spinner-ring spinner-warning" viewBox="25 25 50 50" stroke-width="5">
		<circle cx="50" cy="50" r="20" />
	</svg> : "Sign Up"}</button>
        </div>
    </div>

</div>
<Toaster/>
</div>
  )
}

export default Signup