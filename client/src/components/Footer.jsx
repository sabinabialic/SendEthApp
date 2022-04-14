const Footer = () => {
  return (
    <div className='w-full flex justify-center items-center flex-col p-5 gradient-bg-footer'>
      <div className='sm:w-[90%] w-full h-[0.25px] bg-gray-300 mt-5'/>
      <div className='sm:w-[90%] w-full flex justify-center items-center mt-3'>
        <a href={`https://github.com/sabinabialic/Web-3.0-ETH-Blockchain`} target='_blank' rel='noopener noreferrer'>
          <p className='text-white text-sm text-center'>Source Code</p>
        </a>
      </div>
    </div>
  );
}

export default Footer;
