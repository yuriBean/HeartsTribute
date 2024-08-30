import { Label } from "../ProfileManager/AddPost";

export default function Input({
    type,
    placeholder = null,
    id,
    className = "",
    icon = null,
    name,
    label,
    register,
    required = true,
}) {
    return (
        <div className="relative flex w-full flex-col">
            {label && (
                <Label htmlFor={id}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </Label>
            )}
            {icon && (
                <img
                    src={icon}
                    alt="icon"
                    className="absolute bottom-0 left-0 ml-2 h-5 w-5 -translate-y-1/2 transform md:ml-4"
                />
            )}
            <input
                id={id}
                type={type}
                name={name}
                className={
                    `rounded-md border p-2 ${icon ? "pl-10" : ""}` + className
                }
                {...register(name, {
                    required: required ? `${label} is required` : false,
                })}
                placeholder={placeholder}
            />
        </div>
    );
}