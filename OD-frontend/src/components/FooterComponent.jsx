import React from 'react'

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div>
        <footer className='my-footer'>
            <span>© OdessaDomik {currentYear}. Все права защищены.</span>
        </footer>
    </div>
  )
}

export default FooterComponent