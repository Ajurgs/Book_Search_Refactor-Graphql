const { AuthenticationError } = require('apollo-server-express');
const { sign } = require('jsonwebtoken');
const { User,Book } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query:{
        user: async (parent,{userId})=>{
            return User.findOne({_id: userId});
        },
        me: async (parent,args,context)=>{
            if(context.user){
                return User.findOne({_id: context.user._id});
            }
            throw new AuthenticationError("You need to be logged in!");
        } 
    },
    Mutation:{
        addUser: async (parent,{username,email,password})=>{
            const user = await User.create({username,email,password});
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
        saveBook: async (parent, {book},context)=>{
            if(context.user){
                return User.findOneAndUpdate(
                    {_id:context.user._id},
                    {$addToSet:{savedBooks:book}},
                    {
                        new:true,
                        runValidators:true,
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