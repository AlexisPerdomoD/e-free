import passport from "passport"
import GitHubStrategy from "passport-github2"
import local from "passport-local"
import UsserMannagerM from "../dao/db/usserMannagerM.js"
import { checkPass, signPass } from "../utils/utils.js"
import CartMannagerM from "../dao/db/CartMannagerM.js"
import dotenvConfig from "./dotenv.config.js"
import em, { ErrorCode } from "../utils/error.manager.js"

const um = new UsserMannagerM()
const cm = new CartMannagerM()

const initializatePassport = () => {
    // here i'll be settle every end point and strategy to authenticate ussers
    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true,
            },
            async (_req, username, password, done) => {
                try {
                    const usser = await um.getUsser(username.toLowerCase())
                    if (!usser)
                       throw em.createError({
                            status: 404,
                            message: "the user does not exist",
                            name: "CastError",
                            code: ErrorCode.GENERAL_USER_ERROR,
                            cause:"not found",
                        })
                    if (!checkPass(password, usser))
                         throw em.createError({
                            status: 401,
                            message: "wether the email or password is not correct",
                            name: "Authentication Error",
                            code: ErrorCode.NOT_AUTHORIZATION,
                            cause:"invalid credentials",
                        })

                   delete usser.password
                    return done(null, usser)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    passport.use(
        "register",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true,
            },
            async (req, username, password, done) => {
                try {
                    username = username.toLowerCase()
                    const regex =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                    if (!regex.test(password))
                        return done(null, false, {
                            message: "password do not follows de RegExp",
                        })
                    const usser = await um.getUsser(username)
                    if (usser)
                        throw em.createError({
                            status: 400,
                            message: "email is already been used",
                            name: "CastError",
                            code: ErrorCode.GENERAL_USER_ERROR,
                            cause: "email need to be change",
                        })
                    //return done(null, false, {message:"the email is already being used"})
                    //create cart for usser
                    const { age, first_name, last_name } = req.body
                    const signedPass = signPass(password)
                    const usserCart = await cm.addCart()
                    const newUsser = await um.setUsser({
                        age,
                        first_name,
                        last_name,
                        password: signedPass,
                        email: username,
                        cart: usserCart.content._id,
                        rol:
                            dotenvConfig.admin === username ? "admin" : "usser",
                    })

                    delete newUsser.content.password

                    return done(null, newUsser.content)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: "Iv1.d9511b7d10d472f9",
                clientSecret: "4a34d3ea527c9ee7f6864f8bee2067fa5fc29d5d",
                callbackURl: "http://localhost:8080/api/usser/githubcb",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    if (!profile._json?.email)
                        return done(null, false, {
                            message:
                                "these usser does not provite any email from github",
                        })
                    const { name, email, login } = profile._json
                    const usser = await um.getUsser(
                        email || login + ".github.usser"
                    )
                    if (!usser) {
                        const usserCart = await cm.addCart()
                        const newUsser = {
                            first_name: name,
                            last_name: "",
                            email: email.toLowerCase() || login + ".github.usser",
                            age: 18,
                            password: "",
                            cart: usserCart.content._id,
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
            }
        )
    )
    passport.serializeUser((usser, done) => done(null, usser._id))
    passport.deserializeUser(async (id, done) =>
        done(null, await um.getUsserById(id))
    )
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
//     recei15ved_events_url: 'https://api.github.com/users/AlexisPerdomoD/received_events',
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
