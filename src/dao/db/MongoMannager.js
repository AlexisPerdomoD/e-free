export default class MongoMannager{
    constructor(model, type){
        this.model = model
        this.type = type
    }
    async getColletion(){
        try {
            let response =  await this.model.find()
            return  response.map(item => {
                let res = {}
                for (const key in item) {
                    res[key] = item[key]
                }
                return res
            })
        } catch (error) {
            return {
                message:"there was a problem getting " + this.type + " from e-comerse-server",
                error: error 
            }
        }
    }
    async getDocumentById(id){
        try {
            return {
                message:this.type + " found",
                content : await this.model.findById(id)
            }
        } catch (error) {
            return {
                message:"there was a problem looking for the " + this.type + " with the id: "+ id,
                error: error}
        }
    }
    async deleteDocumentById(id){
        const response = await this.model.findByIdAndDelete(id)
        try {
            return {
                message:this.type + (response ? " eliminated properly" : " not found"),
                content : response
            }
        } catch (error) {
            return {
                message:"there was a problem looking for the " + this.type + " with the id: "+ id,
                error: error}
        }
    }
    async addDocument(item){
        try {
            let newItem =  new this.model(item)
            newItem = await newItem.save()
            return {
                message: this.type + " properly added, id: "+ newItem.id,
                content: newItem}
        } catch (error) {
            return {
                message:`there was a problem adding the ${this.type}`,
                error: error 
            }
        }
    }
    async updateDocument(id, updates){
        try {
            let response = await this.model.updateOne({_id: id}, {$set: updates})
            return {
                message:this.type + " properly updated",
                content: response
            }
        } catch (error) {
            return {
                message:`there was a problem adding the ${this.type} id: ${id}`,
                error: error 
            }
        }
    }
}