import menuItems from '../data/MenuItens';

export function Navbar() {
  return (
    <nav className='flex justify-center py-24 w-[1510px]'>
      <ul className='grid grid-cols-3 gap-3 list-none'>
        {menuItems.map((item, index) => (
          <li key={index} className='w-72 h-44 text-center bg-[#0E7886] flex flex-col justify-between items-center shadow-lg'>
            <a href={item.link} className='text-decoration-none text-inherit flex flex-col justify-between items-center w-full h-full'>
              <div className='w-72 h-36 bg-white flex justify-center items-center'>
                <img className='w-20' src={item.imgSrc} alt={item.title} />
              </div>
              <p className='text-white flex justify-center items-center text-2xl font-bangers text-center italic'>{item.title}</p>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
