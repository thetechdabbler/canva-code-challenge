/**
 * Fetch data at the given URL. Returns a promise that resolves with the data.
 * Simulates random network latency up to 4 seconds.
 */
function fetch(url) {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          designId: 1,
          shapes: [
            { shapeId: "basic-square", color: { r: 255, g: 255, b: 255 } },
            { shapeId: "basic-circle", color: { r: 255, g: 255, b: 255 } },
            { shapeId: "basic-diamond", color: { r: 255, g: 0, b: 0 } },
            { shapeId: "basic-rectangle", color: { r: 0, g: 255, b: 0 } },
          ],
        }),
      Math.random() * 0
    )
  })
}

/**
 * Problem: Fetch 10 designs with the urls `design/1` through to `design/10`.
 * Then calculate the `averageColor` of each design, based on the colours in the shapes in the shapes array.
 */
const designsWithAverageColour = []

const coloursFromShapes = (shapes) => shapes.map((shape) => shape.color)

const sumRGB = (rgbArray) =>
  rgbArray.reduce(
    (acc, color) => ({
      r: acc?.r + color.r,
      g: acc?.g + color.g,
      b: acc?.b + color.b,
    }),
    { r: 0, g: 0, b: 0 }
  )

const averageRGB = (sum, length) => ({
  r: sum.r / length,
  g: sum.g / length,
  b: sum.b / length,
})

const getAverageColourFromShapes = (shapes) => {
  const colours = coloursFromShapes(shapes)
  const sum = sumRGB(colours)

  return averageRGB(sum, shapes.length)
}

const addAverageColourToDesign = (design) => {
  designsWithAverageColour.push({
    ...design,
    averageColor: getAverageColourFromShapes(design.shapes),
  })
}

const getAverageDesignColours = async () => {
  const designs = [...Array(10).keys()]
  const urls = designs.map((design) => `design/${design + 1}`)

  await Promise.all(
    urls.map((url) =>
      fetch(url).then((design) => {
        addAverageColourToDesign(design)
      })
    )
  )

  console.log(JSON.stringify(designsWithAverageColour, null, 2))
}

window.getAverageDesignColours = getAverageDesignColours

window.console.log = (input) => {
  const message = document.createElement("p")
  message.innerText = input
  document.querySelector("#output").appendChild(message)
}
