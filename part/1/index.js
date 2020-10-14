/**
 * Fetch data at the given URL. Returns a promise that resolves with the data.
 * Simulates random network latency up to 4 seconds.
 */
function fetch(url) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`dummy data for ${url}`), Math.random() * 4000)
  })
}

/**
 * Problem: Fetch 10 designs with the urls `design/1` through to `design/10` log `done` to the console when all are complete
 */
const fetchTenDesigns = () => {
  const designs = [...Array(10).keys()]
  const urls = designs.map((design) => `design/${design + 1}`)

  Promise.all(urls.map((url) => fetch(url))).then(() => console.log("done"))
}

window.fetchTenDesigns = fetchTenDesigns

window.console.log = (input) => {
  const message = document.createElement("p")
  message.innerText = input
  document.querySelector("#output").appendChild(message)
}
