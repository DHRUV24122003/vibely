import './globals.css'
import { Routes  , Route} from 'react-router-dom'
import SigninForm from './_auth/forms/SigninForm'
import { Home } from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import SignupForm from './_auth/forms/SignupForm'

const App = () => {
  return (
    
    <main className='flex h-screen'>
    <Routes>
        {/* public routes -> everybody will be able to see - sign in/out*/}
        {/* private routes - only if you are signed in */}
        <Route element = {<AuthLayout/>}>
        <Route path = "/sign-in" element = {<SigninForm/>}/>
        <Route path = "/sign-up" element = {<SignupForm/>}/>

         </Route>
         <Route element = {<RootLayout/>}>
        <Route index element = {<Home/>}/>
        </Route>
        
        
    </Routes>
    </main>
    
  )
}

export default App