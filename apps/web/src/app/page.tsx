"use client"
import useDataStore, { LoginFormData } from "@/store";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import { parseCookies } from "nookies";

const SignIn = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const signIn = useDataStore((state) => state.signIn);
  const getUserByToken = useDataStore((state) => state.getUserByToken);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    const isAuthenticated = await signIn(data); // Handle form submission data
    
    isAuthenticated ? router.push('/dashboard'): null;
  };

  useEffect(() => {
    const { 'juicy-admin-token' :access_token} = parseCookies()
    
    if(access_token) {
      (async () => {
        return await getUserByToken(access_token);
      })().then(isAuthenticated => isAuthenticated ? router.push('/dashboard'): null)
      
      
    }
  }, [getUserByToken, router])
  

  return (
    <div className="h-[100vh] w-full flex justify-center items-center">
      <div className="flex justify-center self-center  z-10">
        <div className="p-12 bg-white mx-auto rounded-2xl w-100 ">
          <div className="mb-4">
            <h3 className="font-semibold text-2xl text-gray-800">Sign In</h3>
            <p className="text-gray-500">Please sign in to your account.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide">
                Email
              </label>
              <input
                className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                type="text"
                placeholder="mail@gmail.com"
                {...register("email")} // Register email input
              />
            </div>
            <div className="space-y-2">
              <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                Password
              </label>
              <input
                className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                type="password"
                placeholder="Enter your password"
                {...register("password")} // Register password input
              />
            </div>
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a href="#" className="text-green-400 hover:text-green-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center bg-green-400 hover:bg-green-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
