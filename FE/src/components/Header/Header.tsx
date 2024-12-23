import { IoTicket } from 'react-icons/io5'
import Logo from '../../assets/2.png'
import avaUser from '../../assets/124599.jpeg'
import { FaChevronDown } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import MenuItemDropDown from '../MenuItemDropDown/MenuItemDropDown'
import LoginForm from '../LoginForm/LoginForm'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import ButtonHeader from '../ButtonHeader/ButtonHeader'
import RegisterForm from '../RegisterForm/RegisterForm'
import ListCardMenu from '../Card/ListCardMenu'
import { useMutation } from '@tanstack/react-query'
import { getAllMovie } from '@/apis/movie.api'
import { Movie } from '@/types/movie.type'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false)
  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>('')

  const [movies, setMovies] = useState<Movie[]>([])
  const [showingMovies, setShowingMovies] = useState<Movie[]>([])
  const [noneShowingMovies, setNoneShowingMovies] = useState<Movie[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserName(user.fullName)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowLoginForm(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleLoginClick = () => {
    setShowLoginForm((prev) => !prev)
  }

  const handleLoginSuccess = (name: string) => {
    setUserName(name)
    setShowLoginForm(false)
  }

  const handleLogout = () => {
    setUserName('')
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('bookingInfo')
    localStorage.removeItem('orderId')
    navigate('/')
  }

  const handleRegisterClick = () => {
    setShowRegisterForm((prev) => !prev)
  }

  const handleOverlayClick = () => {
    setShowLoginForm(false)
  }

  const { mutate } = useMutation({
    mutationFn: getAllMovie,
    onSuccess(response) {
      const moviesData = response.data
      setMovies(moviesData)
      setShowingMovies(moviesData.filter((movie) => movie.showing == 1))
      setNoneShowingMovies(moviesData.filter((movie) => movie.showing == 0))
    }
  })

  useEffect(() => {
    mutate()
  }, [mutate])

  return (
    <div className='w-full px-44 h-24 bg-[#10172B] flex flex-col md:flex-row justify-between items-center p-4 nunito-sans'>
      <NavLink to={''}>
        <img src={Logo} alt='Ticket Logo' className='w-32 md:w-48' />
      </NavLink>

      <div className='w-full md:w-[35rem] text-sm md:text-base'>
        <ul className='flex flex-wrap justify-center md:justify-around text-white'>
          <li className='flex items-center mr-3 mb-2 md:mb-0 hover:text-blue-400'>
            <button className='h-10 px-4 py-2 bg-[#FF5400] flex items-center rounded-xl hover:text-black'>
              <NavLink className='mr-2' to='/booking'>
                Buy ticket
              </NavLink>
              <IoTicket />
            </button>
          </li>
          <li className='flex items-center mr-3 mb-2 md:mb-0 relative group py-4'>
            <span className='hover:text-[#FF5400]'>Movie</span>
            <FaChevronDown className='ml-1' />
            <div className='absolute w-[50rem] hidden h-auto bg-[#E5E1DA] grid top-14 right-[-24rem] group-hover:block rounded-xl text-black z-50'>
              <ListCardMenu movies={showingMovies} name='Phim Đang Chiếu' />
              <ListCardMenu movies={noneShowingMovies} name='Phim Sắp Chiếu' />
            </div>
          </li>
          <li className='flex relative items-center mr-3 mb-2 md:mb-0 group z-50'>
            <span className='group-hover:text-[#FF5400]'>Event</span>
            <FaChevronDown className='ml-1' />
            <MenuItemDropDown ListMenuItem={['Endow 🎉', 'Movie Best Month']} positionRight={-3} />
          </li>
          <li className='flex relative items-center mr-3 mb-2 md:mb-0 group z-50'>
            <span className='group-hover:text-[#FF5400]'>Theater / Price</span>
            <FaChevronDown className='ml-1' />
            <MenuItemDropDown ListMenuItem={['Đà Nẵng', 'Quảng Ngãi', 'Quảng Nam']} positionRight={-1.5} />
          </li>
        </ul>
      </div>
      <div className='flex items-center mt-2 md:mt-0'>
        {!userName ? (
          <>
            <ButtonHeader name={'Login'} handleClick={handleLoginClick} />
            <ButtonHeader name={'Register'} handleClick={handleRegisterClick} />
          </>
        ) : (
          <div className='flex items-center'>
            <Avatar>
              <AvatarImage src={avaUser} className='rounded-full w-10 h-10' />
              <AvatarFallback>{userName}</AvatarFallback>
            </Avatar>
            <span className='text-white ml-2 mr-2'>
              <NavLink to={'/user'}>{userName}</NavLink>
            </span>
            <button
              onClick={handleLogout}
              className='group h-10 px-4 py-1 bg-slate-900 text-white transition-all text-center font-light border-[2px] border-[#FF8000] rounded-[10px] hover:bg-[#FF8000]'
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {showLoginForm && (
        <>
          <div className='fixed inset-0 bg-black opacity-50 z-40' onClick={handleOverlayClick} />
          <div className='fixed inset-0 flex justify-center items-center z-50 w-full '>
            <div className='rounded w-[90%] md:w-[30%]'>
              <LoginForm onLoginSuccess={handleLoginSuccess} handleExitForm={handleLoginClick} />
            </div>
          </div>
        </>
      )}
      {showRegisterForm && (
        <>
          <div className='fixed inset-0 bg-black opacity-50 z-40' onClick={handleOverlayClick} />
          <div className='fixed inset-0 flex justify-center items-center z-50 w-full h-[100%]'>
            <div className='rounde w-[90%] md:w-[30%]'>
              <RegisterForm handleExitForm={handleRegisterClick} onLoginForm={handleLoginClick} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
