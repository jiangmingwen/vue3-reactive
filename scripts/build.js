
const fs = require('fs')
const execa = require('execa')

const dirs = fs.readdirSync('packages').filter(f=> fs.statSync(`packages/${f}`).isDirectory() )


async function build(target){
   await execa('rollup',['-c','--environment',`TARGET:${target}`],{stdio:'inherit'})
}


function runParallel(dirs,interatorFn){
    const res = []
    for(const item of dirs) {
        const p = interatorFn(item)
        res.push(p)
    }

    return Promise.all(res)
}


runParallel(dirs,build)