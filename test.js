// pow(x) - trx(x) = 2

const answer = () => {
    let right = 2
    let x = 0
    while (true) {
        let left = Math.pow(x, 2) - Math.pow(x, 3)
        if(left === right) {
            return x
        }
        x++
    }
}

console.log("%d", answer())