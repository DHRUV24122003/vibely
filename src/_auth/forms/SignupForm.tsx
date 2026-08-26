

// import * as z from "zod"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Link } from "react-router-dom"

// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

// const SignupValidation = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters." }),
//   username: z.string().min(2, { message: "Username must be at least 2 characters." }),
//   email: z.string().email(),
//   password: z.string().min(8, { message: "Password must be at least 8 characters." }),
// })

// const SignupForm = () => {
//   const form = useForm<z.infer<typeof SignupValidation>>({
//     resolver: zodResolver(SignupValidation),
//     defaultValues: {
//       name: "",
//       username: "",
//       email: "",
//       password: "",
//     },
//   })

//   function onSubmit(values: z.infer<typeof SignupValidation>) {
//     console.log(values)
//   }

//   return (
//     <Form {...form}>
//       <div className="sm:w-420 flex-center flex-col">
//         <img src="/assets/images/logo.svg" alt="logo" className="w-12 h-12" />

//         <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
//           Create a new account
//         </h2>
//         <p className="text-light-3 small-medium md:base-regular mt-2">
//           To use Vibely, please enter your details
//         </p>

//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="flex flex-col gap-5 w-full mt-4"
//         >
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="username"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Username</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input type="email" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input type="password" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button type="submit" className="shad-button_primary">
//             Sign Up
//           </Button>

//           <p className="text-small-regular text-light-2 text-center mt-2">
//             Already have an account?
//             <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">
//               Log in
//             </Link>
//           </p>
//         </form>
//       </div>
//     </Form>
//   )
// }

// export default SignupForm
















// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import Loader from "@/components/shared/Loader";
// import { useToast } from "@/components/ui/use-toast";

// // import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
// import { SignupValidation } from "@/lib/validation";
// import { useUserContext } from "@/context/AuthContext";

// const SignupForm = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

//   const form = useForm<z.infer<typeof SignupValidation>>({
//     resolver: zodResolver(SignupValidation),
//     defaultValues: {
//       name: "",
//       username: "",
//       email: "",
//       password: "",
//     },
//   });

//   // Queries
//   const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
//   const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

//   // Handler
//   const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
//     try {
//       const newUser = await createUserAccount(user);

//       if (!newUser) {
//         toast({ title: "Sign up failed. Please try again.", });
        
//         return;
//       }

//       const session = await signInAccount({
//         email: user.email,
//         password: user.password,
//       });

//       if (!session) {
//         toast({ title: "Something went wrong. Please login your new account", });
        
//         navigate("/sign-in");
        
//         return;
//       }

//       const isLoggedIn = await checkAuthUser();

//       if (isLoggedIn) {
//         form.reset();

//         navigate("/");
//       } else {
//         toast({ title: "Login failed. Please try again.", });
        
//         return;
//       }
//     } catch (error) {
//       console.log({ error });
//     }
//   };

//   return (
//     <Form {...form}>
//       <div className="sm:w-420 flex-center flex-col">
//         <img src="/assets/images/logo.svg" alt="logo" />

//         <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
//           Create a new account
//         </h2>
//         <p className="text-light-3 small-medium md:base-regular mt-2">
//           To use snapgram, Please enter your details
//         </p>

//         <form
//           onSubmit={form.handleSubmit(handleSignup)}
//           className="flex flex-col gap-5 w-full mt-4">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="shad-form_label">Name</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="username"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="shad-form_label">Username</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="shad-form_label">Email</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="shad-form_label">Password</FormLabel>
//                 <FormControl>
//                   <Input type="password" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button type="submit" className="shad-button_primary">
//             {isCreatingAccount || isSigningInUser || isUserLoading ? (
//               <div className="flex-center gap-2">
//                 <Loader /> Loading...
//               </div>
//             ) : (
//               "Sign Up"
//             )}
//           </Button>

//           <p className="text-small-regular text-light-2 text-center mt-2">
//             Already have an account?
//             <Link
//               to="/sign-in"
//               className="text-primary-500 text-small-semibold ml-1">
//               Log in
//             </Link>
//           </p>
//         </form>
//       </div>
//     </Form>
//   );
// };

// export default SignupForm;








// import * as z from "zod"
// import { useForm } from "react-hook-form"
// import { Link } from "react-router-dom"
// import { zodResolver } from "@hookform/resolvers/zod"

// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { SignupValidation } from "@/lib/validation"

// const SignupForm = () => {
//   const form = useForm<z.infer<typeof SignupValidation>>({
//     resolver: zodResolver(SignupValidation),
//     defaultValues: {
//       name: "",
//       username: "",
//       email: "",
//       password: "",
//     },
//   })

//   function onSubmit(values: z.infer<typeof SignupValidation>) {
//     console.log("Form submitted:", values)
//     // Baad mein yahan Appwrite + React Query logic aayega
//   }

//   return (
//     <Form {...form}>
//       <div className="sm:w-420 flex-center flex-col">
//         <img src="/assets/images/logo.svg" alt="logo" className="w-12 h-12" />

//         <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
//           Create a new account
//         </h2>
//         <p className="text-light-3 small-medium md:base-regular mt-2">
//           To use Vibely, please enter your details
//         </p>

//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="flex flex-col gap-5 w-full mt-4"
//         >
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="shad-form_label">Name</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="username"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="shad-form_label">Username</FormLabel>
//                 <FormControl>
//                   <Input type="text" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="shad-form_label">Email</FormLabel>
//                 <FormControl>
//                   <Input type="email" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="shad-form_label">Password</FormLabel>
//                 <FormControl>
//                   <Input type="password" className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button type="submit" className="shad-button_primary">
//             Sign Up
//           </Button>

//           <p className="text-small-regular text-light-2 text-center mt-2">
//             Already have an account?
//             <Link
//               to="/sign-in"
//               className="text-primary-500 text-small-semibold ml-1"
//             >
//               Log in
//             </Link>
//           </p>
//         </form>
//       </div>
//     </Form>
//   )
// }

// export default SignupForm









import * as z from "zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { SignupValidation } from "@/lib/validation"
import { createUserAccount } from "@/lib/appwrite/api"
import { useToast } from "@/components/ui/use-toast"

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignupValidation>) {

    // const newUser = await createUserAccount(values)
    // console.log(newUser)
    // setIsLoading(true)
    // console.log("Form submitted:", values)

    // // Simulate loading (baad mein hata dena)
    // setTimeout(() => {
    //   setIsLoading(false)
    // }, 1500)

    setIsLoading(true)

  try {
    const newUser = await createUserAccount(values)
    console.log(newUser)

    if (!newUser) {
      toast({
        title: "Sign up failed. Please try again.",
      })
      return
    }

    toast({
      title: "Account created successfully!",
    })

  } catch (error) {
    console.log(error)
    toast({
      title: "Something went wrong.",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }


  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" className="w-24 h-24" />

        <h2 className="h3-bold md:h2-bold pt-3 sm:pt-6">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Vibely, please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm