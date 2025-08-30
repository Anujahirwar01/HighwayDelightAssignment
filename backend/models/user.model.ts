import mongoose, { Document, Schema   } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    age: number;
    isVerified: boolean;
    otp?: string;
    otpExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [10, 'Age must be at least 10'],
        max: [120, 'Age cannot exceed 120']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster email lookups
userSchema.index({ email: 1 });

// Remove OTP fields when converting to JSON
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.otp;
    delete userObject.otpExpiry;
    return userObject;
};

export default mongoose.model<IUser>('User', userSchema);