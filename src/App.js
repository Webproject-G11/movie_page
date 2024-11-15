import ReactPaginate from 'react-paginate';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [query, setQuery] = useState('Star Wars')

  const Movies = () => {
    return (
      <table>
        {movies && movies.map(movie => (
          <tr key={movie.id}>
            <td>
              {movie.title}
            </td>
          </tr>
        ))}
      </table>
    )
  }

const search = () =>{
  fetch('https://api.themoviedb.org/3/search/movie?query='+ query +'&include_adult=false&language=en-US&page=' + page,{
    headers:{
     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI',
     'Content-Type':'application/json'
    }
  }).then(response => response.json())
    .then(json => {
      //console.log(json)
      setMovies(json.results)
      setPageCount(json.total_pages)
  })
  .catch(error => {
    console.log(error)
  })
}

useEffect(() => {
  search()
}, [page])


  return (
    <div id="container">
      <h3>Search movies</h3>
      <input value ={query } onChange={e => setQuery(e.target.value)}></input>
      <button onClick={search} type="button">Search</button>
      <ReactPaginate
        breakLabel="..."
        nextLabel=" >"
        onPageChange={(e) => setPage(e.selected + 1)}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< "
        renderOnZeroPageCount={null}
        />
      <Movies />
    </div>
  );
}

export default App;