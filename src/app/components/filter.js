export default function Filter(filter, data){
    let regex = new RegExp(filter,'gi')

    return data.data.filter( el => el.Title.match(regex))
}