export const FileInput = ({ label, name, onChange, disabled, required }) => (
    <div className="flex flex-col w-9/12">
        <label className="font-semibold mb-2 text-gray-300">{label}{required && <span className="text-red-500">*</span>}</label>
        <input
            type="file"
            name={name}
            onChange={onChange}
            disabled={disabled}
            className="p-3 border border-gray-600 rounded bg-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            required={required}
        />
    </div>
);
