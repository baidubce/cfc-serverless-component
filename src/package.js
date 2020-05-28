const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const globby = require('globby')
const { contains, isNil, last, split } = require('ramda')
const { createReadStream, createWriteStream } = require('fs-extra')

const VALID_FORMAT = ['zip']
const isValidFormat = (format) => contains(format, VALID_FORMAT)

module.exports = {
    async package(inputDirPath, outputFilePath, include = [], exclude = []) {
        const format = last(split('.', outputFilePath))
        if (!isValidFormat(format)) {
            throw new Error('zip file format invalid')
        }

        const patterns = ['**']
        if (!isNil(exclude)) {
            exclude.forEach((excludeItem) => patterns.push(`!${excludeItem}`))
        }

        const files = (await globby(patterns, { cwd: inputDirPath, dot: true }))
        .sort()
        .map((file) => ({
          input: path.join(inputDirPath, file),
          output: file
        }))

        return new Promise((resolve, reject) => {
            const output = createWriteStream(outputFilePath)
            const archive = archiver(format, {
              zlib: { level: 9 }
            })
      
            output.on('open', async () => {
              archive.pipe(output)
      
              // we must set the date to ensure correct hash
              files.forEach((file) =>
                archive.append(createReadStream(file.input), { name: file.output, date: new Date(0) })
              )
      
              if (!isNil(include)) {
                for (let i = 0, len = include.length; i < len; i++) {
                  const curInclude = include[i]
                  if (fs.statSync(curInclude).isDirectory()) {
                    // if is relative directory, we should join with process.cwd
                    const curPath = path.isAbsolute(curInclude)
                      ? curInclude
                      : path.join(process.cwd(), curInclude)
                    const includeFiles = await globby(patterns, { cwd: curPath, dot: true })
                    includeFiles
                      .sort()
                      .map((file) => ({
                        input: path.join(curPath, file),
                        output: prefix ? path.join(prefix, file) : file
                      }))
                      .forEach((file) =>
                        archive.append(createReadStream(file.input), {
                          name: file.output,
                          date: new Date(0)
                        })
                      )
                  } else {
                    const stream = createReadStream(curInclude)
                    archive.append(stream, { name: path.basename(curInclude), date: new Date(0) })
                  }
                }
              }
      
              archive.finalize()
            })
      
            archive.on('error', (err) => reject(err))
            output.on('close', () => resolve(outputFilePath))
          })

    }
}