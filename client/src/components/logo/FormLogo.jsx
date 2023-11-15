import { BiExclude } from 'react-icons/bi'

export default function FormLogo() {
    
    return (
        <div className="flex items-center gap-1">
            <BiExclude className={`text-xl text-blue-600`} />
            <h1 className={`text-xl text-blue-600 font-bold`}>Barbill</h1>
        </div>
    )
}