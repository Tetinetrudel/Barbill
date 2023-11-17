import { Link } from 'react-router-dom'

import { sidebarMenu } from '../utils/sidebarMenu'

export default function Sidebar() {
  return (
    <div className='w-full pl-10 pt-10 flex flex-col gap-5 items-start h-full border-r border-r-zinc-200'>
        {sidebarMenu && sidebarMenu.map(item => (
            <Link to={item.path} key={item.title} className="w-full flex items-center gap-1 py-1 pl-3 bg-white hover:bg-blue-50 hover:text-blue-600 text-sm border-l-2 border-l-white hover:border-l-blue-600 rounded-tl-md rounded-bl-md transition-all delay-200 ease-in-out">
                <span>{item.icon}</span>
                <p>{item.title}</p>
            </Link>
        ))}
    </div>
  )
}
