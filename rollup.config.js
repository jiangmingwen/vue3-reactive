import path from 'path'
import jsonPlugin from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve'
import tsPlugin from 'rollup-plugin-typescript2'


const targetDir = path.resolve(__dirname,'packages')
const packageDir = path.resolve(targetDir,process.env.TARGET)

const  resolvePath = (p) => path.resolve(packageDir,p)

const packageJson =  require(resolvePath('package.json'))
const name = path.basename(packageDir)

const options = packageJson.buildOptions || {};
const outputName = options.name || '';
const formats = options.formats || [];

const outputConfig = {
    'esm-bundler': {
        file: resolvePath(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    'cjs': {
        file: resolvePath(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    global: {
        file: resolvePath(`dist/${name}.global.js`),
        format: 'iife'//立即执行函数
    }
}


function createConfig(format,output) {
    return {
        input: resolvePath('src/index.ts'),
        output: {
            ...output,
            name: outputName,
            sourcemap: true,
        },
        plugins: [
            jsonPlugin(),
            tsPlugin({
                tsconfig: path.resolve(__dirname,'tsconfig.json')
            }),
            resolvePlugin()
        ]
    }
}

export default formats.map(format => createConfig(format,outputConfig[format]) )