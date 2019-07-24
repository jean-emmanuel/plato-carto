module.exports = []
    .concat(require('./2018/structures'))
    .concat(require('./2019/structures'))
    .concat(require('./2019_bis/structures'))
    .concat(require('./2019_nodetail/structures').map((x)=>{x.reseaux="";x.nodetail=true;;return x}))
