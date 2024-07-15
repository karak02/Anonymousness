import { sendVerificationEmail } from "@/helpers/sendvarificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
const bcrypt = require('bcrypt');

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username,email,password} = await request.json()
        const exitingUservefifiedByUsername= await UserModel.findOne({
            username,
            isVerified:true
        }) 
        if(exitingUservefifiedByUsername){
            return Response.json({
                success:false,
                message: "Username is already taken"
            },{status:400})
        }
        const exitingUservefifiedByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000+Math.random()*90000).toString()
        if(exitingUservefifiedByEmail){
            if(exitingUservefifiedByEmail.isVerified){
                return Response.json({
                    success:false,
                    message: "email already exits"
                },{status:400})
            }
            else{
                const hasedPassword = await bcrypt.hash(password,10)
                exitingUservefifiedByEmail.password = hasedPassword;
                exitingUservefifiedByEmail.verifyCode = verifyCode;
                exitingUservefifiedByEmail.verifyCodeExpire = new Date(Date.now() + 3600000);
                await exitingUservefifiedByEmail.save();
            }
        }else{
            const hasedPassword = await bcrypt.hash(password,10)
            const expirydate = new Date();
            expirydate.setHours(expirydate.getHours()+1)

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpire: expirydate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            })

            await newUser.save();
        }

       const emailResponse = await sendVerificationEmail(
            email,username,verifyCode
        )
if(!emailResponse.success){
    return Response.json({
        success:false,
        message: "Email sending failed"
        },{status:400})
}
return Response.json({
    success:true,
    message: "Email resister succesfully"
    },{status:400})

    } catch (error) {
        console.error("Error resistering user",error)
        return Response.json(
            {
                success:false,
                message: "Error registring user"
            },
           { status:500}
        )
    }
}