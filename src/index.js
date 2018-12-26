import _ from 'lodash'
import icon from './images/loading.gif'
import log from './log'
import './style.css'

function conponment() {
  let _div = document.createElement('div')
  _div.innerText = _.join(['hello', 'webpack'], '')
  return _div
}

function loading_icon() {
  const img = new Image()
  img.src = icon
  return img
}
log()
document.body.appendChild(conponment())
document.body.appendChild(loading_icon())