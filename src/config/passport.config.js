import passport from "passport"
import  GitHubStrategy from "passport-github2"
import UsserMannagerM from "../dao/db/usserMannagerM.js"
const um = new UsserMannagerM()
const initializatePassport = () =>{
    // here i'll be settle every end point and strategy to authenticate ussers
    passport.use("github" , new GitHubStrategy({
        clientID: "Iv1.d9511b7d10d472f9",
        clientSecret:"4a34d3ea527c9ee7f6864f8bee2067fa5fc29d5d",
        callbackURl: "http://localhost:8080/api/usser/githubcb"
    }, async (accessToken, refreshToken, profile, done) =>{
        try {
            const usser = await um.getUsser(profile._json.email)
            if(usser.email) return done(null, usser)
            const newUsser = {
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                age:18,
                password:''
            }
            done(null, await um.setUser(newUsser))
        } catch (error) {
            done(error)
        }
    }))
    passport.serializeUser((usser, done) => {
        done(null, usser._id)})
    passport.deserializeUser(async(id, done) => done(null, await um.getUsserById(id)))
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