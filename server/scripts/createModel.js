import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

const { dirname } = path

const __dirname = dirname(fileURLToPath(import.meta.url))

const createCrud = async () => {
  try {
    const basepath = path.join(__dirname, '..')
    console.log(basepath)
    const crudAns = await inquirer.prompt(modelQues)
    const model = crudAns.modelName
    createSchema(model, basepath)
    createModel(model, basepath)
    createPolicy(model, basepath)
    createController(model, basepath)
    createRouter(model, basepath)
  } catch (e) {
    console.log(`something bad happend, ${e}`)
  }
}

const createSchema = (name, basepath) => {
  const temp = `import mongoose from "mongoose";\nconst Schema = mongoose.Schema;\n\nconst ${name}Schema = new Schema({});\n\nexport default ${name}Schema
  `
  fs.writeFileSync(
    `${basepath}/models/schemas/${name}Schema.js`,
    temp,
    'utf-8',
  )
  console.log(chalk.green(`${name} schema created`))
}

const createModel = (name, basepath) => {
  const cname = capitalize(name)
  const temp = `import mongoose from "mongoose"\nimport ${name}Schema from "./schemas/${name}Schema.js"\nconst ${cname} = mongoose.model("${name}", ${name}Schema)\n\nexport default ${cname}
  `
  fs.writeFileSync(`${basepath}/models/${name}Model.js`, temp, 'utf-8')
  console.log(chalk.green(`${name} model created`))
}

const createPolicy = (name, basepath) => {
  const cname = capitalize(name)
  const temp = 'import Policy from "./Policy.js";\nexport default class extends Policy {}'
  fs.writeFileSync(`${basepath}/policies/${cname}Policy.js`, temp, 'utf-8')
  console.log(chalk.green(`${name} policy created`))
}

const createController = (name, basepath) => {
  const cname = capitalize(name)
  const temp = `import Controller from "./${cname}Controller.js";\nimport ${cname}Repository from "../repositories/${cname}Repository.js";\nimport ${cname}Policy from "../policies/${cname}Policy.js";\n\nconst repository = new ${cname}Repository();\n\nclass ${cname}Controller extends Controller {\n\tconstructor() {\n\t\tsuper({ name: "${name}", repository, policy: ${cname}Policy });\n\t}\n}\n\nexport default ${cname}Controller;
  `

  fs.writeFileSync(
    `${basepath}/controllers/${cname}Controller.js`,
    temp,
    'utf-8',
  )
  console.log(chalk.green(`${name} controller created`))
}

const createRouter = (name, basepath) => {
  const cname = capitalize(name)
  try {
    const temp = `import express from "express";\nimport Controller from "../controllers/${cname}Controller.js";\nimport { auth } from "../middleware/auth.js";\n\nconst router = express.Router();\n\nconst c = new Controller();\n//Basic Crud routes\n\nrouter.get("/", c.index());\nrouter.get("/:id", c.show());\nrouter.post("/", c.store());\nrouter.put("/:id", c.update());\nrouter.delete("/:id", c.destroy());\nrouter.post("/replicate/:id", c.replicate());
\n\nexport default router;
    `
    fs.writeFileSync(`${basepath}/routes/${name}Routes.js`, temp, 'utf-8')
    console.log(chalk.green(`${name} router created`))
  } catch (e) {
    throw e
  }
}

const capitalize = (str) => {
  str = str.toLowerCase()
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const validators = {
  notEmpty: async (input) => {
    console.log(input)
    if (!input) return 'y/n only'
    return true
  },
  isNumber: async (input) => {
    const reg = new RegExp(/^\d+$/)
    if (!reg.test(input)) return 'only numbers'
    return true
  },
}

const modelQues = [
  {
    name: 'modelName',
    type: 'input',
    message: 'Enter the model name',
    validate: validators.notEmpty,
  },
]

createCrud()
