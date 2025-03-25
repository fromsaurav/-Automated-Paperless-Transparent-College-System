import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Spline from '@splinetool/react-spline';

const Login = () => {
  const apiURL = "http://localhost:4000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${apiURL}/api/v1/user/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          role: "Admin",
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setIsAuthenticated(true);
        navigateTo("/");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 3D Spline Background */}
      <div className="absolute inset-0 z-0">
      <Spline
        scene="https://prod.spline.design/AK0qEtNuv5a2bvRB/scene.splinecode" 
      />        </div>

      {/* Login Form */}
      <div className="relative z-10 max-w-md w-full space-y-8 bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-lg shadow-lg">
        <div>
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Welcome to Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Only Admins Are Allowed To Access These Resources!
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-gray-800 rounded-lg focus:ring-gray-500 focus:border-gray-500 shadow-sm hover:shadow-md transform transition-all duration-200 "
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-gray-800 rounded-lg focus:ring-gray-500 focus:border-gray-500 shadow-sm hover:shadow-md transform transition-all duration-200 "
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-gray-800 rounded-lg focus:ring-gray-500 focus:border-gray-500 shadow-sm hover:shadow-md transform transition-all duration-200 "
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-md hover:shadow-lg transform transition-all duration-200 "
            disabled={isLoading}
          >
            <LogIn className="h-5 w-5 mr-2" aria-hidden="true" />
            {isLoading ? "Logging in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default Login;