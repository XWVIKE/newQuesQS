const json2html = function (data) {
  try {
    data = JSON.parse(data)
  } catch (e) {
  }

  function aGenTag(name, value) {
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
        h += '<img class="tex" style="background-color:#fff;max-height:30px;height:25px;display: inline-block;"  src="'
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
    return {h: h, f: f}
  }

  var h = '', f = '', content = ''
  if (data.type) {
    var tag = aGenTag(data.type, data.txt)
    h = tag.h
    f = tag.f
  }
  if (data.type == 'color') {
    return h + content + f
  } else {
    let value = data.type === 1 ? data.txt : data.image
    return h + value + content + f
  }
}

export {json2html}
