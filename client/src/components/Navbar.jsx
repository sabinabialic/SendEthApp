import React from 'react';
import {HiMenuAlt4} from 'react-icons/hi';
import {AiOutlineClose} from 'react-icons/ai';

const NavbarItem = ({title, classProps}) => (
  <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav className='w-full flex md:justify-end justify-between items-center p-8 pr-10'>
      <ul className="navbar-text" onClick={() => window.open("https://ethereum.org/en/", "_blank")}>About</ul>
      <ul className="navbar-text" onClick={() => window.open("https://www.tradingview.com/chart/?symbol=ETH", "_blank")}>Market</ul>
      <ul className="navbar-text" onClick={() => window.open("https://coinbase.com/", "_blank")}>Exchange</ul>
      <ul className="navbar-text" onClick={() => window.open("https://www.youtube.com/watch?v=Wn_Kb3MR_cU", "_blank")}>Tutorial</ul>

      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
        )}
        {toggleMenu && (
          <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
        )}
        {toggleMenu && (
          <ul className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md purple-glassmorphism text-white animate-slide-in">
            <li className="text-xl w-full my-2"> <AiOutlineClose onClick={() => setToggleMenu(false)} /></li>
            <li className="navbar-mobile-text" onClick={() => window.open("https://ethereum.org/en/", "_blank")}>About</li>
            <li className="navbar-mobile-text" onClick={() => window.open("https://www.tradingview.com/chart/?symbol=ETH", "_blank")}>Market</li>
            <li className="navbar-mobile-text" onClick={() => window.open("https://coinbase.com/", "_blank")}>Exchange</li>
            <li className="navbar-mobile-text" onClick={() => window.open("https://www.youtube.com/watch?v=Wn_Kb3MR_cU", "_blank")}>Tutorial</li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
