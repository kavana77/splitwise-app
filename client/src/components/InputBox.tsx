interface InputBoxProps {
    type: string
    placeholder?: string
    label: string
}
const InputBox = ({label,type,placeholder,...props}:InputBoxProps) => {
    return ( 
        <div>
            <label>{label}</label>
            <input
            type={type}
            placeholder={placeholder}
            className="w-full rounded-md p-2 text-foreground bg-background pl-4 border border-gray-300 focus:bg-transparent placeholder:text-gray-400"
            {...props}/>
        </div>
     );
}
 
export default InputBox;