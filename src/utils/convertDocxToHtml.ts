import mammoth from 'mammoth'
import fs from 'fs'

export const convertDocxToHtml = (filePath: any) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) return reject(err)

            mammoth.extractRawText({ buffer: data })
                .then((result) => resolve(`<html><body>${result.value}</body></html>`))
                .catch(reject)
        }) 
    })
}

export default convertDocxToHtml
