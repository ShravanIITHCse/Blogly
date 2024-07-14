import { useState } from 'react';

const InputBox = ({ name, type, id, value, placeholder, icon}) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4 relative w-[100%]">
      <input
        name={name}
        type={type === 'password' && showPassword ? 'text' : type}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        className="input-box"
      />

      <i className={icon + " input-icon text-xl"}/>

      {
        type === 'password'?
          <i className={"fi fi-br-eye" + ((showPassword) ? "-crossed" : "")  + " input-icon text-xl left-[auto] right-4 cursor-pointer"} 
            onClick={() => setShowPassword(currentVal => !currentVal)} />
          : null
      }
    </div>
  );
}

export default InputBox;