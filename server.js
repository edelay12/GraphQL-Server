const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const app = express()

//custom type
const authorType = new GraphQLObjectType({
    name: 'author',
    description: 'an author',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLString},
        books: {
            type: new GraphQLList(bookType),
        resolve: (author) => {
            return booksList.filter(book => book.authorId === author.id) 
        }
    }
    })
});

const bookType = new GraphQLObjectType({
    name: 'book',
    description: 'book with an author',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        title: {type: GraphQLString},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author : {
            type: authorType,
            resolve: (book) => {
                return authors.find(author => book.authorId === author.id)
            }
        }
    })
})

//data 
const authors = [
    {id: 1, name:'Author 1'},
    {id: 2, name:'Author 2'},
    {id: 3, name:'Author 3'},
    {id: 4, name:'Author 4'},
]
 const booksList = [
     {id: 1, title: 'book title', authorId: 1},
     {id: 2, title: 'book title', authorId: 2},
     {id: 3, title: 'book title', authorId: 3},
     {id: 4, title: 'book title', authorId: 4},
     {id: 5, title: 'book title', authorId: 1},
     {id: 6, title: 'book title', authorId: 2},
     {id: 7, title: 'book title', authorId: 3},
     {id: 8, title: 'book title', authorId: 4}
 ]

const rootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'all mutations object',
    fields: () => ({
    addBook: {
         type: bookType,
         description: "add a book",
         args: { 
             title: { type: GraphQLNonNull(GraphQLString) },
             authorId: {type: GraphQLNonNull(GraphQLInt)}
         },
         resolve: (parent, args) => {
             const book = { id: booksList.length + 1, title: args.title, authorId: args.authorId}
             booksList.push(book);
             console.log(booksList)
             return book;
         }
    }
    })
}) 

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'root query',
    fields: () => ({
        book: {
            type: bookType,
            description: 'List of books',
            args: { 
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => {
                //query database or other data to return 
                return booksList.find(book => book.id === args.id);
            }
         } ,
        books: {
            type: GraphQLList(bookType),
            description: 'List of books',
            resolve: () => {
                //query database or other data to return 
                return booksList;
            } 
        },
        authors: {
            type: GraphQLList(authorType),
            description: 'List of authors',
            resolve: () => {
                //query database or other data to return 
                return authors;
            } 
        }
    })
})

//schema
bookSchema = new GraphQLSchema({
    query: RootQueryType,
    mutation: rootMutationType
})

 schema = new GraphQLSchema({
     query: new GraphQLObjectType({
        name: 'HelloWorld',
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => "hello"
            }
        })
     })
 })



app.use('/graphql', graphqlHTTP({
    schema: bookSchema,
    graphiql: true
}))

app.listen(5000., () => console.log('server listening'))