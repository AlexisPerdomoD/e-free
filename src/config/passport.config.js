import passport from "passport"
import  GitHubStrategy from "passport-github2"
import local from "passport-local"
import UsserMannagerM from "../dao/db/usserMannagerM.js"
import { checkPass, signPass } from "../utils/utils.js"
import CartMannagerM from "../dao/db/CartMannagerM.js"
const um = new UsserMannagerM()
const cm = new CartMannagerM()

const initializatePassport = () =>{
    // here i'll be settle every end point and strategy to authenticate ussers
    passport.use( "login", new local.Strategy({
            usernameField:"ussername",
            passReqToCallback:true
        },
        async (req, ussername, password, done) =>{
            try {
                const usser = await um.getUsser(ussername)
                if(!usser) return done(null, false,{message:"there is not usser found"})
                if(!checkPass(password, usser)) return done(null, false , {message:"user or password incorrect"})
                delete usser.password
                return done(null, usser)
            } catch (error) {
                return done(error)
            }
    }
    ))
    passport.use( "register", new local.Strategy({
        usernameField:"email",
        passReqToCallback:true
            },
        async (req, ussername, password, done) =>{
            try {
                const usser = await um.getUsser(ussername)
                if(usser) return done(null, false, {message:"the email is already being used"})
                //create cart for usser
                const {age, first_name, last_name} = req.body
                const signedPass = signPass(password)
                const usserCart = await cm.addCart()
                const newUsser = await um.setUsser({
                    age, 
                    first_name, 
                    last_name, 
                    password:signedPass, 
                    email:ussername, 
                    cart:usserCart.content._id
                })

                if(newUsser.error) return done(null, false, {message: "there was a problem creating your account"})

                delete newUsser.content.password
                
                return done(null, newUsser.content)
            } catch (error) {
                return done(error)
            }
        }
    ))
    passport.use("github" , new GitHubStrategy({
        clientID: "Iv1.d9511b7d10d472f9",
        clientSecret:"4a34d3ea527c9ee7f6864f8bee2067fa5fc29d5d",
        callbackURl: "http://localhost:8080/api/usser/githubcb"
    }, async (accessToken, refreshToken, profile, done) =>{
        try {
            if(!profile._json?.email)return done(null, false, {message:"these usser does not provite any email from github"})
            const {name, email, login} = profile._json
            const usser = await um.getUsser(email)
            if(!usser) {
                const usserCart = await cm.addCart()
                const newUsser = {
                    first_name: name,
                    last_name: "",
                    email: email || login + "@github.usser",
                    age:18,
                    password:'',
                    cart: usserCart.content._id
                }
                let response = await um.setUsser(newUsser)
                delete response.content.password
                return done(null, response.content)
            }
            delete usser.password
            return done(null, usser)
        } catch (error) {
            done(error)
        }
    }))
    passport.serializeUser((usser, done) => done(null, usser._id))
    passport.deserializeUser(async (id, done) => done(null, await um.getUsserById(id)))
}

export default initializatePassport



//response from github 
// _json: {
//     login: 'AlexisPerdomoD',
//     id: 127882970,
//     node_id: 'U_kgDOB59W2g',
//     avatar_url: 'https://avatars.githubusercontent.com/u/127882970?v=4',
//     gravatar_id: '',
//     url: 'https://api.github.com/users/AlexisPerdomoD',
//     html_url: 'https://github.com/AlexisPerdomoD',
//     followers_url: 'https://api.github.com/users/AlexisPerdomoD/followers',
//     following_url: 'https://api.github.com/users/AlexisPerdomoD/following{/other_user}',
//     gists_url: 'https://api.github.com/users/AlexisPerdomoD/gists{/gist_id}',
//     starred_url: 'https://api.github.com/users/AlexisPerdomoD/starred{/owner}{/repo}',
//     subscriptions_url: 'https://api.github.com/users/AlexisPerdomoD/subscriptions',
//     organizations_url: 'https://api.github.com/users/AlexisPerdomoD/orgs',
//     repos_url: 'https://api.github.com/users/AlexisPerdomoD/repos',
//     events_url: 'https://api.github.com/users/AlexisPerdomoD/events{/privacy}',
//     received_events_url: 'https://api.github.com/users/AlexisPerdomoD/received_events',
//     type: 'User',
//     site_admin: false,
//     name: 'Alexis j Perdomo D',
//     company: null,
//     blog: '',
//     location: null,
//     email: null,
//     hireable: null,
//     bio: null,
//     twitter_username: null,
//     public_repos: 5,
//     public_gists: 0,
//     followers: 2,
//     following: 5,
//     created_at: '2023-03-14T17:20:23Z',
//     updated_at: '2024-03-11T21:59:30Z',
//     plan: {
//       name: 'free',
//       space: 976562499,
//       collaborators: 0,
//       private_repos: 10000
//     }
//   }
// }