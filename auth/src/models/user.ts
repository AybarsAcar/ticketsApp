import mongoose from 'mongoose';
import { Password } from '../utils/password';

// userSchema interface to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// interface describes the methods the user model has
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

// to describe the props that a user document has
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // remap the _ir prop
        ret.id = ret._id;
        delete ret._id;
        // remove password
        delete ret.password;
        delete ret.__v;
      },
    },

    timestamps: true,
  }
);

// mongoose middleware before saving
userSchema.pre('save', async function (done) {
  // check if the password modified because otherwise we dont want to rehash
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  done();
});

// we will use this function to create new user for typechecking
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
