// @ts-ignore
import satori, { init as initSatori } from 'satori/wasm'
// @ts-ignore
import initYoga from 'yoga-wasm-web'
// @ts-ignore
import yogaWasm from '../public/yoga.wasm?module'

import { Card } from '../src/components/preview/card'
import { autoThemeCss } from './helpers'
import { getCardConfig, getFonts, loadDynamicAsset } from './renderCard'
import { Theme } from './types/configType'
import QueryType from './types/queryType'

const renderCardSVG = async (query: QueryType) => {
  const yoga = await initYoga(yogaWasm)
  initSatori(yoga)

  const config = await getCardConfig(query)

  if (config.theme === Theme.auto) {
    let [lightThemeSvg, darkThemeSvg] = await Promise.all([
      satori(<Card {...config} theme={Theme.light} />, {
        width: 1280,
        height: 640,
        fonts: await getFonts(config.font),
        loadAdditionalAsset: loadDynamicAsset,
      }),
      satori(<Card {...config} theme={Theme.dark} />, {
        width: 1280,
        height: 640,
        fonts: await getFonts(config.font),
        loadAdditionalAsset: loadDynamicAsset,
      }),
    ])

    // Make id unique
    lightThemeSvg = lightThemeSvg
      .replace(/id="/g, 'id="theme-light-')
      .replace(/url\(#/g, 'url(#theme-light-')
    darkThemeSvg = darkThemeSvg
      .replace(/id="/g, 'id="theme-dark-')
      .replace(/url\(#/g, 'url(#theme-dark-')

    return `
<svg width="1280" height="640" viewBox="0 0 1280 640" xmlns="http://www.w3.org/2000/svg">
  <style>${autoThemeCss}</style>
  <g class="card-light">${lightThemeSvg}</g>
  <g class="card-dark">${darkThemeSvg}</g>
</svg>`.replace(/\n\s*/g, '')
  } else {
    return satori(<Card {...config} />, {
      width: 1280,
      height: 640,
      fonts: await getFonts(config.font),
      loadAdditionalAsset: loadDynamicAsset,
    })
  }
}

export default renderCardSVG
