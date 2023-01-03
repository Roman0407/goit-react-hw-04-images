import { Button } from "./button/Button";
import { GlobalStyle } from "./GlobalStyle.styled";
import { ImageGallery } from "./imageGallery/ImageGallery";
import { Loader } from "./loader/Loader";
import { Searchbar } from "./searchbar/Searchbar";
import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const App = () => {

  const API_KEY = '30834606-0dc24151179eb34ac466f7732';

  const [toSearch, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setLoadingFlag] = useState(false);
  const [noMorePhoto, setNoMorePhotoFlag] = useState(false);
  const [totalHits, setTotalHits] = useState(0);


  useEffect(() => {
    async function fetchPhotos() {
      if (!toSearch) return;

      try {
        setLoadingFlag(true);
        const response = await axios.get(`?q=${toSearch}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`);
        console.log(response.data);
        setData(prevData => [...prevData, ...response.data.hits]);
        setLoadingFlag(false);
        setTotalHits(response.data.total);

        response.data.hits.length < 12 ? setNoMorePhotoFlag(true) : setNoMorePhotoFlag(false);
      } catch {
        setNoMorePhotoFlag(true);
        setLoadingFlag(false);
      }
    }
    fetchPhotos();
  }, [toSearch, page]);

  const onSubmit = event => {
    event.preventDefault();
    const inputText = event.currentTarget.lastChild.value;
    if (toSearch === inputText) return;
    if (toSearch !== inputText) {
      setData([]);
      setPage(1);
    }
    setSearch(inputText);
    event.currentTarget.reset();
  }

  const loadMore = () => setPage(page + 1);

  return (
    <div className="app">
      <GlobalStyle />
      <Searchbar onSubmit={onSubmit} />
      <ImageGallery images={data} />
      {totalHits > data.length && <Button loadMore={loadMore} />}
      {isLoading && <Loader />}
      {noMorePhoto && <span style={{ margin: "0 auto" }}>Oops no more photo found</span>}
    </div>
  )

};