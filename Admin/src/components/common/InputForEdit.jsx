import { Label } from "./Label";


export default function InputForEdit({
    type,
    id,
    className = "",
    icon = null,
    name,
    label,
    modifiedData,
    handleChange,
    value,
}) {
    return (
        <div className="relative flex w-full flex-col">
            {label && <Label htmlFor={id}>{label}</Label>}
            <span className="invisible absolute left-[5ch] top-1 text-red-500 peer-placeholder-shown:visible">
                *
            </span>
            {icon && (
                <img
                    src={icon}
                    alt="icon"
                    className="peer absolute bottom-0 left-0 ml-2 h-5 w-5 -translate-y-1/2 transform md:ml-4"
                />
            )}
            <input
                id={id}
                type={type}
                name={name}
                value={
                    modifiedData.hasOwnProperty(name)
                        ? modifiedData[name]
                        : value || ""
                }
                onChange={(e) => handleChange(name, e.target.value)}
                className={`peer rounded-md border p-2 ${icon ? "pl-8" : ""} ${className}`}
            />
        </div>
    );
}
