const json2html = function (data) {
  try {
    data = JSON.parse(data)
  } catch (e) {
  }

  function aGenTag (name, value) {
    var h = '', f = ''
    switch (name) {
      case 'doc':
        h += '<div>'
        f += '</div>'
        break
      case 1:
        h += '<p style="display: inline-block">'
        f += '</p>'
        break
      case 3 :
        h += '<img class="tex" style="background-color:#fff;max-height:40px;display: inline-block;"  src="'
        f += '" />'
        break
      case 'txt' :
        h += ''
        f += ''
        break
      case 2:
        h += '<img class="pic" style="max-width:100%;" src="'
        f += '" />'
        break
      case 'br':
        h += ''
        f += '<br/>'
        break
      case 'u':
        h += '<u>'
        f += '</u>'
        break
      case 'b':
        h += '<b>'
        f += '</b>'
        break
      case 'color':
        h += '<span style="color:' + value + '">'
        f += '</span>'
        break
      default:
        h += '<span class="red">***未知格式，请联系研发部***'
        f += '</span>'
    }
    return { h: h, f: f }
  }
  var h = '', f = '', content = ''
  let value = data.type === 1 ? data.txt : data.image
  return h + value + content + f

}

//html转json
const htmlToJson = function (html) {
  let json = mapDOM(html)
  let arr = unfold(json)
  const list = []
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'string') {
      list.push({ type: 1, txt: arr[i] })
    } else {
      try {
        list.push({
          type: 2,
          image: arr[i]['attributes']['src'],
          width: arr[i]['attributes']['width'],
          height: arr[i]['attributes']['height'],
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
  return list
}

//展开多维数组
function unfold (arr) {
  const newArr = []
  const newArrTwo = []
  const ergodic = (arr) => {
    arr.forEach((item) => {
      if (Array.isArray(item)) {
        ergodic(item)
      } else {
        newArr.push(item)
      }
    })
    ergodicTwo(newArr)
  }
  const ergodicTwo = (arr) => {
    arr.forEach((item) => {
      if (Array.isArray(item.content)) {
        ergodicTwo(item.content)
      } else {
        newArrTwo.push(item)
      }
    })
  }
  ergodic(arr.content)
  return newArrTwo
}

function decodeHtml (text) {
  const HTML_DECODE = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&nbsp;': ' ',
    '&quot;': '"',
    '&copy;': '©',
    '&ldquo;': '“',
    '&rdquo;': '”',
    '/\n': '',
  }
  let regStr = '(' + Object.keys(HTML_DECODE).toString() + ')'
  regStr = regStr.replace(/,/g, ')|(')
  const regExp = new RegExp(regStr, 'g')
  return text.replace(regExp, match => HTML_DECODE[match])
}

//序列化html树
function mapDOM (element, json = false) {
  let treeObject = {}, parser, docNode
  let data = decodeHtml(element)
  let str = `<div>${data}</div>`

  // If string convert to document Node
  if (typeof str === 'string') {
    if (window.DOMParser) {
      parser = new DOMParser()
      docNode = parser.parseFromString(str, 'text/xml')
    } else { // Microsoft strikes again
      docNode = new ActiveXObject('Microsoft.XMLDOM')
      docNode.async = false
      docNode.loadXML(str)
    }
    str = docNode.firstChild
  }

  //Recursively loop through DOM elements and assign properties to object
  function treeHTML (str, object) {
    object['type'] = str.nodeName
    var nodeList = str.childNodes
    if (nodeList != null) {
      if (nodeList.length) {
        object['content'] = []
        for (var i = 0; i < nodeList.length; i++) {
          if (nodeList[i].nodeType == 3) {
            object['content'].push(nodeList[i].nodeValue)
          } else {
            object['content'].push({})
            treeHTML(nodeList[i], object['content'][object['content'].length - 1])
          }
        }
      }
    }
    if (str.attributes != null) {
      if (str.attributes.length) {
        object['attributes'] = {}
        for (var i = 0; i < str.attributes.length; i++) {
          object['attributes'][str.attributes[i].nodeName] = str.attributes[i].nodeValue
        }
      }
    }
  }

  treeHTML(str, treeObject)
  return (json) ? JSON.stringify(treeObject) : treeObject
}

//转换json为html格式
function run (arr) {
  let str = ''
  let img = (url, width, height) => {
    return `<img src="${url}" style="max-width:100%;width: ${width}px;height: ${height}px" alt="img" />`
  }
  let formula = (url,height=25) => {
    return `<img src="${url}" style="background-color:#fff;max-height:35px;height:${height}px;display: inline-block;"/>`
  }
  let p = (txt, color = '#000') => {
    return `<p style="display: inline-block;color: ${color}">${txt}</p>`
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].type === 1 && i === 0) {
      str += `<div>${arr[i].txt}`
    } else if (arr[i].type === 1) {
      if (arr[i].txt === '\n' || arr[i].txt === '↵') {
        str += '<br/>'
      } else {
        str += arr[i].txt
      }
    } else if (arr[i].type === 2) {
      str += img(arr[i].image, arr[i].width, arr[i].height)
    } else if (arr[i].type === 3) {
      str += formula(arr[i].image,arr[i].height)
    } else if (arr[i].type === 1 && i === arr.length - 1) {
      str += `${arr[i].txt}</div>`
    }
  }
  return str
}

//以类型0分割数组
function slice (arr) {
  let zeroList = []
  const backArr = [...arr]
  let newArr = []
  let start = 0, end = 0
  for (let i in arr) {
    if (arr[i]['type'] === 0) {
      if (start === 0) {
        start = 0
        end = i
      } else {
        end = i
      }

      zeroList.push({ start, end })
      start = end
    } else if (arr[i]['type'] !== 0 && i == arr.length - 1) {
      zeroList.push({ start, end: arr.length })
    }
  }
  if (zeroList.length === 0) {
    return [[...arr]]
  } else {
    zeroList.forEach(item => {
      let tempArr = backArr.slice(item.start, item.end)
      let index = tempArr.findIndex(item => item.type === 0)
      if (index !== -1) {
        tempArr.splice(index, 1)
      }
      newArr.push(tempArr)
      newArr.push([{ type: 0 }])
    })
    return newArr
  }
}

//为分段数组两端添加p标签
function addPTypeOne (arr = []) {
  let newArr = [...arr]
  if (newArr.length === 1) {
    if (newArr[0]['type'] !== 1) {
      newArr = [{ type: 1, txt: '' }, newArr[0], { type: 1, txt: '' }]
    } else {
      newArr.push({ type: 1, txt: '' })
    }
  } else if (newArr.length > 1) {
    if (newArr[0]['type'] !== 1) {
      newArr.splice(0, 0, { type: 1, txt: '' })
    }
    if (newArr[arr.length - 1]['type'] !== 1) {
      newArr.push({ type: 1, txt: '' })
    }
  }
  return newArr
}

const jsonToHtml = function (arr) {
  let groupArr = slice(arr)
  // console.log(groupArr)
  let backGroupArr = [], str = ''
  groupArr.forEach(item => {
    backGroupArr.push(addPTypeOne(item))
  })
  backGroupArr.forEach(item => {
    str += run(item)
  })
  return str
}
const formatDate = function (time, format) {
  var date = time || new Date()
  var map = {
    'y': date.getFullYear(),
    'M': date.getMonth() + 1,//month
    'd': date.getDate(),//date
    'H': date.getHours(),//hours
    'm': date.getMinutes(),//minutes
    's': date.getSeconds(), //seconds
  }
  for (var i in map) {
    if (map.hasOwnProperty(i)) {
      if (map[i] < 10) {
        map[i] = '0' + map[i]
      }
    }
  }
  format = format || 'yyyy-MM-dd HH:mm:ss'
  var reg = new RegExp('y+|M+|d+|H+|m+|s+', 'g')
  var regY = new RegExp('y')
  format = format.replace(reg, function (v) {
    var old = v
    if (regY.test(v)) {
      var y = '' + map['y']
      var len = 4 - v.length
      old = y.substr(len)
    } else {
      var key = v.substr(0, 1)
      old = map[key]
    }
    return old
  })
  return format
}

const isJSON = function (str = '') {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true
    }
  } catch (e) {}

  return false
}

const toHtml = function (value = '') {
  if (isJSON(value)) {
    return jsonToHtml(JSON.parse(value))
  } else {
    return value
  }
}

export { jsonToHtml, htmlToJson, formatDate, json2html, isJSON, toHtml }

