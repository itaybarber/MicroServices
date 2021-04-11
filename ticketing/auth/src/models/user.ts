import mongoose from 'mongoose';
import { Password } from "../services/password";

// An interface that describes props 
// that are requiered to create a new user
// aka - what it takes to create a user
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the props
// that a userModel has
// aka what the entire collection of users look like
// or at least methods that are associated with the user model 
interface UserModel extends mongoose.Model<UserDoc> {
    build(atters: UserAttrs): UserDoc;
}

// An interface that describes the props 
// that a userDocument has 
// Aka what props a single user has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        // This type is only for mongoose, not for TS. Therefore it's with a capital S
        // Which is built for JS
        type: String,
        requiered: true
    },
    password: {
        type: String,
        requiered: true
    }
}, 
    // We're going to define a set of props to help mongoose to
    // take our document and turn it to JSON
    {
        toJSON: {
          transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password; // the delete keyword is going to remove a prop from a JS object
                delete ret.__v;
                
            }  
        }
    } 
);

userSchema.pre('save', async function(done) {
     if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password')); 
        this.set('password', hashed);
    }
    done();
    
});

userSchema.statics.build = (attrs: UserAttrs) =>  {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export { User };