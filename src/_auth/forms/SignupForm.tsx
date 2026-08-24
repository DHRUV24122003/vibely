import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {useForm} from "react-hook-form"




const formSchema = z.object({
  username: z.string().min(2).max(50)
})
const SignupForm = () => {
  
  
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: " "
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(values)
  }
 
  

return(

    <div>
      <Button className="px-3 py-2 bg-gray-500">Click me</Button>
    </div>
)
  
}

export default SignupForm
