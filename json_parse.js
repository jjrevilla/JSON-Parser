/*
 This is  a function that can parse a JSON text, producing a JavaScript
 data structure. Its a simple, recursive descent parser
*/

var json_parse = function () {
  var at
  var ch
  var escapee = {
    '"': '"',
    '\\': '\\',
    '/': '/',
    b: 'b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t'
  }
  var text

  var error = function (m) {
    throw {
      name: 'SyntaxError',
      message: m,
      at: at,
      text: text
    }
  }

  var next = function (c) {
    if (c && c !== ch) {
      error("Expected '" + c + "’ instead of '" + ch + "'")
    }
    ch = text.charAt(at)
    at += 1
    return ch
  }

  var number = function () {
    var _number = ''
    var _string = ''

    if (ch === '-') {
      _string = '-'
      next('-')
    }

    while (ch >= '0' && ch <= '9') {
      _string += ch
      ch = next()
    }

    if (ch === '.') {
      _string += '.'
      while ((ch = next()) && ch >= '0' && ch <= '9') {
        _string += ch
      }
    }

    if (ch === 'e' || ch === 'E') {
      _string += ch
      ch = next()

      if (ch === '-' || ch === '+') {
        _string += ch
        ch = next()
      }

      while (ch >= '0' && ch <= '9') {
        _string += ch
        ch = next()
      }
    }

    _number = +_string
    if (isNaN(_number)) {
      error('Bad number')
    }
    return _number
  }

  var string = function () {
    var hex
    var _string = ''
    var uffff

    if (ch === '"') {
      while (next()) {
        if (ch === '"') {
          next()
          return _string
        }
        if (ch === '\\') {
          next()
          if (ch === 'u') {
            uffff = 0
            for (var i = 0; i < 4; i++) {
              hex = parseInt(next(), 16)
              if (!isFinite(hex)) {
                break
              }
              uffff = uffff * 16 + hex
            }
            _string += String.fromCharCode(uffff)
          } else if (typeof escapee[ch] === 'string') {
            _string += escapee[ch]
          } else {
            break
          }
        } else {
          _string += ch
        }
      }
    }
    error('Bad string')
    return undefined
  }

  
}()
