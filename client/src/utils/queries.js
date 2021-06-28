import {gql} from '@apollo/client';


export const QUERY_ME = gql`
    query me{
        me{
            _id
            username
            email
            bookCount
            savedBooks{
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
`

export const QUERY_USER= gql`
    query user($userId:ID!){
        user(userId:$userId){
            _id
            username
            email
            bookCount
            savedBooks{
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
`
