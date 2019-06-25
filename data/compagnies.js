module.exports = []
    .concat(require('./2018/compagnies'))
    .concat(require('./2019/compagnies'))
    .concat(require('./2019_nodetail/compagnies').map((x)=>{x.reseaux="";x.nodetail=true;return x}))
