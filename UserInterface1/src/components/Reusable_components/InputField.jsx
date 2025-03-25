import { useState } from "react";

export const InputField = ({ label, type = "text", name, value, onChange, disabled, required }) => {
    const [error, setError] = useState("");

    const handleEmailValidation = (e) => {
        const { value } = e.target;
        if (name === "email" && !value.endsWith("@sggs.ac.in")) {
            setError("Email must end with @sggs.ac.in");
        } else {
            setError("");
        }
        onChange(e);
    };

    return (
        <div className="flex flex-col w-9/12">
            <label className="font-semibold mb-2 text-white">
                {label}{required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleEmailValidation}
                disabled={disabled}
                placeholder={label}
                className="p-2 border shadow-md opacity-75 text-white border-gray-600 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300"
                required={required}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};
