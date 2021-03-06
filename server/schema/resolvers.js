const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query:{
        me: async (parent,args,context)=>{
            if(context.user){
                return User.findOne({_id: context.user._id}).select('-__V -password');
            }
            throw new AuthenticationError("You need to be logged in!");
        } 
    },
    Mutation:{
        addUser: async (parent,args)=>{
            console.log("Args",args);
            const user = await User.create(args);
            const token = signToken(user);

            return{ token,user};
        },
        login: async(parent,{email,password})=>{
            const user = await User.findOne({email});
            if(!user){
                throw new AuthenticationError("Incorrect username or password");
            }

            const correctPW = await user.isCorrectPassword(password);

            if(!correctPW){
                throw new AuthenticationError("Incorrect username or password");
            }

            const token = signToken(user);
            return{token,user};
        },
        saveBook: async (parent, {bookData},context)=>{
            if(context.user){
                return User.findOneAndUpdate(
                    {_id:context.user._id},
                    {$addToSet:{savedBooks:bookData}},
                    {
                        new:true,
                    }
                );
            }
            throw new AuthenticationError("You need to be logged in!");
        },
        removeBook: async(parent,{bookId},context) =>{
            if(context.user){
                return User.findOneAndUpdate(
                    {_id:context.user._id},
                    {$pull:{savedBooks:{ bookId:bookId}}},
                    {
                        new:true,
                    }
                );
            }
            throw new AuthenticationError("You need to be logged in!");
        }
    }
}

module.exports = resolvers;