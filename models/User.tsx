import mongoose,{Schema, Document} from "mongoose";

export interface Message extends Document{
  content:string;
  createAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    typr:String,
    required: true
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

export interface User extends Document{
  username:string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpire: Date;
  isVerified:boolean;
  isAcceptingMessage: boolean;
  message: Message[]
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type:String,
    required: [true,"user name is required"],
    trim:true,
    unique: true

  },
  email: {
    type: String,
    required: [true,"Email is required"],
    unique:true,
    match:[/.+\@.+\..+/,'please use a valid email address']
  },
  password: {
    type: String,
    required: [true,"password is required"],
    trim:true,
    minlength: [6,"password must be at least 6 characters"],
    maxlength: [32,"password must be at most 32 characters"],
  },
  verifyCode: {
    type: String,
    required: [true,"verify code is required"],
  },
  verifyCodeExpire: {
    type: Date,
    required: [true,"verify code expire is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    required: [true,"is accepting message is required"],
    default: false,
  },
  message: {
    type: [MessageSchema],
  }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model("User",UserSchema)

export default UserModel;