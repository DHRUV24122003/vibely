import './globals.css'
import { Routes  , Route} from 'react-router-dom'
import {
  Home,
  Explore,
  Saved,
  CreatePost,
  Profile,
  EditPost,
  PostDetails,
  UpdateProfile,
  AllUsers,
} from "@/_root/pages";
import SigninForm from './_auth/forms/SigninForm'
//import { Home } from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import SignupForm from './_auth/forms/SignupForm'

import { Toaster } from "@/components/ui/toaster"

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
        <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
        
        
    </Routes>
    <Toaster/>
    </main>
    
  )
}

export default App