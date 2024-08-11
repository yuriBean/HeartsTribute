import { Label } from "./AddPost"

export default function InputBoxProfileManager({value = null, setValue = null, label = null, type, placeholder = null,  name, id, className = "" , icon = null}) {
  return (
    <div className="relative flex flex-col w-full">
      {label && <Label htmlFor={id}>{label}</Label>}
      {
        icon &&
        <img src={icon}
          alt="icon"
          className="absolute transform -translate-y-1/2 bottom-0 h-5 w-5 left-0 ml-2 md:ml-4"
        />
      }
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        id={id}
        // value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`border p-2 rounded-md ${icon ? "pl-8" : ""}`+ className}
      />
    </div>
  )
}
