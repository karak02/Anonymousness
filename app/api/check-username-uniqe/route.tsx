import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/models/User";
import { usernameValidation } from "@/Schema/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){



    await dbConnect()
   
    try {
        const {searchParams} = new URL(request.url)
        const QueryParam =  {
            username:searchParams.get('username')
        }
        //valitaion
      const result = UsernameQuerySchema.safeParse(QueryParam)

      if(!result.success){
        const usernameError = result.error.format().username?._errors||[]
        return Response.json({
            success:false,
            message:'invalid query '
        },{status:400})
      }

      const {username}=result.data

      const existingVerifyedUser =  UserModel.findOne({username,isVerified:true})
      
      if(await existingVerifyedUser){
        return Response.json({
            success:false,
            message:'user namee is already taken'
        },{status:400})
      }
      return Response.json({
        success:true,
        message:'user namee is uniqe'
    },{status:400})

    } catch (error) {
        console.error("Error cheking username",error)
        return Response.json({
            success:false,
            message:"Error checkiing username"
        },
    {status:500}
)
    }
}