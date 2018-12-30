const phonetic = require('phonetic')

const options = {
  syllables: 2,
  capFirst: false
}

for (let i = 0; i < 20; i++)  {
  const w = phonetic.generate(options)
  console.log(w)
}
