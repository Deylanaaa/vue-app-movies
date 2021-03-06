import { ref } from "vue";
import axios from "axios";

const movies = ref([]);
const totalResults = ref(0);
const load = ref(true);
const loadAMovie = ref(false);
const msg = ref("Please Wait");

const loadMovies = async (keyword) => {
  if (keyword == null) {
    keyword = "Batman";
  }
  msg.value = "Please Wait";
  try {
    let { data } = await axios.get(`${import.meta.env.VITE_API_URL}?apikey=${import.meta.env.VITE_API_KEY}&s=${keyword}`);
    if (data.Response == "False") {
      throw new Error(data.Error);
    }
    movies.value = await data.Search;
    totalResults.value = data.totalResults;
    load.value = false;
    loadAMovie.value = true;
  } catch (err) {
    load.value = true;
    msg.value = err.message;
    loadAMovie.value = false;
  }
};

const nextPages = async (page, keyword) => {
  load.value = true;
  msg.value = "Please Wait";
  try {
    let { data } = await axios.get(`${import.meta.env.VITE_API_URL}?apikey=${import.meta.env.VITE_API_KEY}&s=${keyword}&page=${page}`);
    if (data.Response == "False") {
      throw new Error(data.Error);
    }
    data.Search.forEach((movie) => movies.value.push(movie));
    load.value = false;
    loadAMovie.value = true;
  } catch (err) {
    load.value = true;
    msg.value = err.message;
    loadAMovie.value = false;
  }
};
export default { movies, totalResults, load, msg, loadAMovie, loadMovies, nextPages };
