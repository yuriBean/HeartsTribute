export const Label = ({ children, htmlFor }) => {
  return (
    <label className='text-lg font-light tracking-wider mb-1' htmlFor={htmlFor}>
      {children}
    </label>
  )
} 