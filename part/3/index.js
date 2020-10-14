/**
 * Fetch data at the given URL. Returns a promise that resolves with the data.
 * Simulates random network latency up to 4 seconds.
 */
function fetch(url) {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          designId: url,
          shapes: [
            {
              shapeId: "basic-shape",
              color: { r: 55, g: 40, b: 255 },
              children: [],
            },
            {
              shapeId: "duck",
              color: { r: 255, g: 255, b: 252 },
              children: [
                {
                  shapeId: "duck-bill",
                  color: { r: 255, g: 255, b: 255 },
                  children: [],
                },
                {
                  shapeId: "duck-body",
                  color: { r: 205, g: 255, b: 252 },
                  children: [],
                },
                {
                  shapeId: "duck-legs",
                  color: { r: 100, g: 255, b: 252 },
                  children: [],
                },
              ],
            },
            {
              shapeId: "zigzag-polygon",
              color: { r: 205, g: 255, b: 252 },
              children: [],
            },
            {
              shapeId: "fish",
              color: { r: 205, g: 255, b: 252 },
              children: [
                {
                  shapeId: "fish-eyes",
                  color: { r: 255, g: 255, b: 255 },
                  children: [],
                },
                {
                  shapeId: "fish-fin",
                  color: { r: 100, g: 66, b: 74 },
                  children: [
                    {
                      shapeId: "fish-fin-part-1",
                      color: { r: 93, g: 54, b: 55 },
                      children: [],
                    },
                    {
                      shapeId: "fish-fin-part-2",
                      color: { r: 33, g: 255, b: 255 },
                      children: [],
                    },
                    {
                      shapeId: "fish-fin-part-3",
                      color: { r: 128, g: 53, b: 255 },
                      children: [],
                    },
                  ],
                },
                {
                  shapeId: "fish-tail",
                  color: { r: 255, g: 5, b: 255 },
                  children: [],
                },
              ],
            },
            {
              shapeId: "duck",
              color: { r: 255, g: 255, b: 252 },
              children: [
                {
                  shapeId: "duck-bill",
                  color: { r: 255, g: 255, b: 255 },
                  children: [],
                },
                {
                  shapeId: "duck-body",
                  color: { r: 205, g: 255, b: 252 },
                  children: [],
                },
                {
                  shapeId: "duck-legs",
                  color: { r: 100, g: 255, b: 252 },
                  children: [],
                },
              ],
            },
          ],
        }),
      4000 - Math.random() * 4000
    )
  })
}

/**
 * Problem: Fetch 10 designs with the urls `design/1` through to `design/10`.
 * Then calculate the `averageColor` of each design, based on the colours in the shapes in the shapes array,
 * and the the shapes of the children shapes of any shapes .
 */
const designsWithAverageColourRecursive = []

const logColour = (text, rgbObject) => {
  debugger
  console.log(text, {
    background: `rgb(${rgbObject.r}, ${rgbObject.g}, ${rgbObject.b})`,
    color: "#999",
    textShadow: "0 1px #33333399",
    padding: "0.5rem",
    margin: 0,
  })
}

const walk = (shape) =>
  shape.children.length
    ? [
        ...shape.children.map((childShape) => walk(childShape)).flat(),
        shape.color,
      ]
    : shape.color

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

const getAverageColor = (design) => {
  const designColors = design.shapes.map((shape) => walk(shape)).flat()

  designColors.map((color, i) =>
    logColour(
      `${design.designId} shape ${i + 1} colour: ${JSON.stringify(color)}`,
      color
    )
  )
  const sum = sumRGB(designColors)

  const average = averageRGB(sum, designColors.length)

  logColour(
    `${design.designId} average colour: ${JSON.stringify(average)}`,
    average
  )

  return average
}

const addAverageColourToDesign = (design) => {
  designsWithAverageColourRecursive.push({
    ...design,
    averageColor: getAverageColor(design),
  })
}

const loadDesignsAndGetAverageColoursRecursively = async () => {
  const designIds = [...Array(10).keys()]
  const urls = designIds.map((url) => `design/${url + 1}`)

  await Promise.all(
    urls.map((url) =>
      fetch(url).then((design) => addAverageColourToDesign(design))
    )
  )

  console.log("all designs loaded")
  console.log(JSON.stringify(designsWithAverageColourRecursive, null, 2))
}

window.loadDesignsAndGetAverageColoursRecursively = loadDesignsAndGetAverageColoursRecursively

window.console.log = (input, args) => {
  const message = document.createElement("p")
  for (k in args) {
    message.style[k] = args[k]
  }
  message.innerText = input
  document.querySelector("#output").appendChild(message)
}
