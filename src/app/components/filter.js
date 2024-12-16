import PropTypes from "prop-types"

export default function Filter({filter, results, data}){
    let regex = new RegExp(filter,'gi')

    const filtered = data.data.filter( el => el.Title.match(regex))

    console.log(filtered)

    return(
        <div>
            {results()}
        </div>
    )
}

Filter.propTypes = {
    filter: PropTypes.string,
    results: PropTypes.func,
    data:   PropTypes.array
}