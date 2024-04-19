import bcrypt from "bcrypt"
// create hash 
export const signPass = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// compare password
export const checkPass = (password, usser) => bcrypt.compareSync(password, usser.password)

//check local data base 
export const checkLocalDbFile = async(path) => {
    try {
        !fs.existsSync(path) && await fs.promises.writeFile(path, JSON.stringify({products:[]}))

        const res = await fs.promises.readFile(path, "utf-8")
        // CHECKEAR ESTE TERNARIO APARENTEMENTE REDUNDANTE
        const jsonRes =  res ? JSON.parse(res) : {products:[]}
        return jsonRes
        
    } catch (error) {
        console.error(error)
        throw new Error("something went wrong creating db file")
    }
}