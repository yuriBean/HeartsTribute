
export default function InputText({ placeholder, value, onChange, type, icon = null, name }) {
  return (
    <div className="relative">
      <input className="w-full px-8 py-3 xl:py-4 2xl:py-6 3xl:py-8 rounded-xl pl-10 md:pl-12 text-lg 2xl:text-xl 3xl:text-3xl bg-secondaryGray outline-none" value={value} onChange={onChange} name={name} type={type} placeholder={placeholder} />
      {icon && <img src={icon} alt="" className="h-6 w-6 md:w-8 md:h-8 bottom-0 md:bottom-1 aspect-square left-2 absolute tranform -translate-y-1/2" />}
    </div>
  )
}