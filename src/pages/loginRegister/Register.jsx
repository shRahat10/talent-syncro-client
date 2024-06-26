import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import loginReg from "../../assets/loginReg.jpg";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SocialLogin from "./SocialLogin";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const MySwal = withReactContent(Swal);
const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const Register = () => {
    const axiosPublic = useAxiosPublic();
    const { userRegistration, updateUserProfile, bannedUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPass, setShowPass] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();


    const onSubmit = async (data) => {
        if (bannedUser?.find(bannedUser => bannedUser === data.email)) {
            MySwal.fire({
                title: <p className="text-3xl font-bold text-primary mb-4">User is banned</p>,
                icon: "error",
                confirmButtonColor: 'green',
                confirmButtonText: "Okay"
            })
        }
        else {
            const { name, email, password, photo, salary } = data;

            console.log("Salary Input:", salary);

            if (password.length < 6) {
                setErrorMessage("Password must be at least 6 characters long");
            } else if (!password.match(/[a-z]/)) {
                setErrorMessage("Password must contain at least one lowercase letter");
            } else if (!password.match(/[A-Z]/)) {
                setErrorMessage("Password must contain at least one uppercase letter");
            } else if (!password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
                setErrorMessage("Password must contain at least one special character");
            } else {
                try {
                    const formData = new FormData();
                    formData.append('image', photo[0]);

                    const imgbbResponse = await axiosPublic.post(`https://api.imgbb.com/1/upload?key=${image_hosting_key}`, formData);
                    const photoUrl = imgbbResponse.data.data.url;

                    const result = await userRegistration(email, password);
                    console.log(result);
                    await updateUserProfile(name, photoUrl);

                    const newUser = {
                        name,
                        email,
                        password,
                        photoUrl,
                        role: data.role,
                        bank_account_no: data.bank_account_no,
                        salary: parseFloat(salary),
                        designation: data.designation,
                        isVerified: false,
                        status: 'active',
                    };

                    console.log("New User Data:", newUser);

                    await axiosPublic.post('/user', newUser, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    MySwal.fire({
                        title: <p className="text-3xl font-bold text-primary mb-4">Welcome to Talent Syncro!</p>,
                        html: (
                            <div className="text-lg">
                                <p>You have successfully registered.</p>
                                <p>Thank you for registering. You are now a part of our team now!</p>
                            </div>
                        ),
                        icon: "success",
                        confirmButtonColor: 'green',
                        confirmButtonText: "Let's get started!"
                    }).then(() => {
                        navigate(location?.state ? location.state : "/");
                    });
                } catch (error) {
                    console.log(error);
                    toast.error("Registration failed. Please try again.");
                }
            }
            console.log(data);
        }
    };


    return (
        <>
            <Helmet>
                <title>Register | Talent Syncro</title>
            </Helmet>
            <div style={{ backgroundImage: `url(${loginReg})` }} className="mx-auto w-full flex justify-center lg:mt-10  md:py-10 bg-cover bg-top">
                <div className="bg-white bg-opacity-85 p-10 md:w-1/2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold ">Your name</span>
                            </label>
                            <input name="name" type="text" placeholder="Enter your name" className="bg-transparent input rounded-none border-b-2 border-b-gray-300 focus:outline-none focus:border-0 focus:border-b-2 focus:border-b-primary" {...register("name", { required: true })} />
                            {errors.name && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold ">Email address</span>
                            </label>
                            <input name="email" type="email" placeholder="Enter your email address" className="bg-transparent input rounded-none border-b-2 border-b-gray-300 focus:outline-none focus:border-0 focus:border-b-2 focus:border-b-primary" {...register("email", { required: true })} />
                            {errors.email && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold ">Password</span>
                            </label>
                            <span className="flex relative">
                                <input name="password" type={showPass ? 'text' : 'password'} placeholder="Enter your password" className="bg-transparent w-full input rounded-none border-b-2 border-b-gray-300 focus:outline-none focus:border-0 focus:border-b-2 focus:border-b-primary" {...register("password", { required: true })} />
                                <span className="absolute top-1/3 right-3" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                </span>
                            </span>
                            {errors.password && <span className="text-red-500">This field is required</span>}
                            {errorMessage && <span className="text-red-500">{errorMessage}</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold ">Role</span>
                            </label>
                            <select name="role" className="bg-transparent input rounded-none border-b-2 border-b-gray-300 focus:outline-none focus:border-0 focus:border-b-2 focus:border-b-primary" {...register("role", { required: true })}>
                                <option value="">Select role</option>
                                <option value="Employee">Employee</option>
                                <option value="HR">HR</option>
                            </select>
                            {errors.role && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold ">Bank Account Number</span>
                            </label>
                            <input name="bank_account_no" type="number" placeholder="Enter your bank account number" className="bg-transparent input rounded-none border-b-2 border-b-gray-300 focus:outline-none focus:border-0 focus:border-b-2 focus:border-b-primary" {...register("bank_account_no", { required: true })} />
                            {errors.bank_account_no && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold ">Salary</span>
                            </label>
                            <input name="salary" type="number" placeholder="Enter your salary" className="bg-transparent input rounded-none border-b-2 border-b-gray-300 focus:outline-none focus:border-0 focus:border-b-2 focus:border-b-primary" {...register("salary", { required: true })} />
                            {errors.salary && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold ">Designation</span>
                            </label>
                            <input name="designation" type="text" placeholder="Enter your designation" className="bg-transparent input rounded-none border-b-2 border-b-gray-300 focus:outline-none focus:border-0 focus:border-b-2 focus:border-b-primary" {...register("designation", { required: true })} />
                            {errors.designation && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold ">Photo</span>
                            </label>
                            <input name="photo" type="file" accept="image/*" className="bg-transparent input rounded-none border-b-2 border-b-gray-300 focus:outline-none focus:border-0 focus:border-b-2 focus:border-b-primary" {...register("photo", { required: true })} />
                            {errors.photo && <span className="text-red-500">This field is required</span>}
                        </div>
                        <div className="form-control flex flex-row items-center">
                            <input name="checkbox" type="checkbox" id="termsAndConditions" className="mr-2" {...register("checkbox", { required: true })} />
                            <label htmlFor="termsAndConditions" className="cursor-pointer">
                                Accept Term & Conditions
                            </label>
                        </div>
                        {errors.checkbox && <span className="text-red-500">Accept our term & conditions to proceed</span>}
                        <div className="form-control mt-6">
                            <button className="btn text-white bg-primary hover:bg-transparent hover:border hover:border-primary hover:text-primary transition duration-300 ease-in-out">Register</button>
                        </div>
                        <SocialLogin></SocialLogin>
                        <p className="mt-3 text-center">Already Have An Account? <Link className="text-red-500" to={'/login'}>Login</Link></p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
