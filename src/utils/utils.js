import bcrypt from "bcrypt"
// create hash 
export const signPass = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// compare password
export const checkPass = (password, usser) => bcrypt.compareSync(password, usser.password)