

// import * as z from "zod"
// import { useForm } from "react-hook-form"
// import { Link } from "react-router-dom"
// import { useNavigate } from "react-router-dom"
// import { zodResolver } from "@hookform/resolvers/zod"
// //import { useState } from "react"

// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input" 
// import { Button } from "@/components/ui/button"
// import Loader from "@/components/shared/Loader"
// import { SignupValidation } from "@/lib/validation"
// //import { createUserAccount } from "@/lib/appwrite/api"
// import { useToast } from "@/components/ui/use-toast"
// import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations.ts";
// import { useUserContext } from "@/context/AuthContext"

// const SigninForm = () => { 
//   const navigate = useNavigate();
//   const {toast} = useToast()
//   const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
//   const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
//     const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount();

//   const form = useForm<z.infer<typeof SignupValidation>>({
//     resolver: zodResolver(SignupValidation),
//     defaultValues: {
//       name: "",
//       username: "",
//       email: "",
//       password: "",
//     },
//   })



// async function onSubmit(values: z.infer<typeof SignupValidation>) {
// try{
// const newUser = await createUserAccount(values);
// if(!newUser){
//   return toast({title: 'Sign-up failed, please try again'})
// }

// const session = await signInAccount({
//   email : values.email,
//   password:values.password,


// })
// if (!session) {
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
//         <img src="/assets/images/logo.svg" alt="logo" className="w-24 h-24" />

//         <h2 className="h3-bold md:h2-bold pt-3 sm:pt-6">
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
//             {isCreatingAccount ? (
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

// export default SigninForm
















import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SigninValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations.ts";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // Query
  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    const session = await signInAccount(user);

    if (!session) {
      toast({ title: "Login failed. Please try again." });
      
      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate("/");
    } else {
      toast({ title: "Login failed. Please try again.", });
      
      return;
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
            {isPending|| isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;




