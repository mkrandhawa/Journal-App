function InputField ({ label, name, type = 'number', placeholder, required = false, step = 1, min = 0, icon: Icon, onChange, isMacronutrient = false , value}) {
    
    return (<div className="flex flex-col">
      <label htmlFor={name} className={`mb-1 text-sm font-medium ${isMacronutrient ? 'text-gray-500' : 'text-gray-700'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          step={step}
          className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition duration-150 ${Icon ? 'pl-10' : ''} text-gray-600`}
        />
      </div>
    </div>
    )
};

export default InputField;