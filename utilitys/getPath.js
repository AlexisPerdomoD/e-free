import path from 'path'
import { fileURLToPath } from 'url'

 export const getDirName = function (moduleUrl) {
    const filename = fileURLToPath(moduleUrl)
    return path.dirname(filename)
}
