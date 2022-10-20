import IMask from "imask"

import "./css/index.css"

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path')
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path')
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img')

function setCardType(type) {
  const colors = {
    default: ['black', 'gray'],
    mastercard: ['#DF6F29', '#C69347'],
    visa: ['#436D99', '#2D57F2']
  }

  ccBgColor01.setAttribute('fill', colors[type][0])
  ccBgColor02.setAttribute('fill', colors[type][1])
  ccLogo.setAttribute('src', `cc-${type}.svg`)
}

const card = {
  expirationDate: {
    input: document.getElementById('expiration-date'),
    pattern: {
      mask: 'MM{/}YY',
      blocks: {
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12
        },
        YY: {
          mask: IMask.MaskedRange,
          from: String(new Date().getFullYear()).slice(2),
          to: String(new Date().getFullYear() + 10 ).slice(2) 
        }
      },
    }
  },
  holder: {
    input: document.getElementById('card-holder'),
    pattern: {
      mask: /^[A-z,\s]{0,35}$/
    }
  },
  number: {
    input: document.getElementById('card-number'),
    pattern: {
      mask: [
        {
          mask: '0000 0000 0000 0000',
          cardtype: 'visa',
          regex: /^4\d{0,15}/
        },
        {
          mask: '0000 0000 0000 0000',
          cardtype: 'mastercard',
          regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/
        },
        {
          mask: '0000 0000 0000 0000',
          cardtype: 'default'
        }
      ],
      dispatch: function (appended, dynamicMasked) {
        let number = (dynamicMasked.value + appended).replace(/\D/g, '')
        const foundMask = dynamicMasked.compiledMasks.find(({ regex }) => number.match(regex))

        return foundMask
      }
    }
  },
  securityCode: {
    input: document.getElementById('security-code'),
    pattern: {
      mask: '0000'
    }
  }
}

const cardExpirationDateMasked = IMask(card.expirationDate.input, card.expirationDate.pattern)
const cardHolderMasked = IMask(card.holder.input, card.holder.pattern)
const cardNumberMasked = IMask(card.number.input, card.number.pattern)
const cardSecurityCodeMasked = IMask(card.securityCode.input, card.securityCode.pattern)

const addButton = document.getElementById('add-card')

addButton.addEventListener('click', () => {
  alert('Cartão adicionado')
})

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault()
})

cardExpirationDateMasked.on('accept', () => {
  updateCardValues('.cc-expiration .value', '02/32', cardExpirationDateMasked.value)
})

cardNumberMasked.on('accept', () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardValues('.cc-number', '1234 5678 9012 3456', cardNumberMasked.value)
})

cardHolderMasked.on('accept', () => {
  updateCardValues('.cc-holder .value', 'FULANO DA SILVA', cardHolderMasked.value)
})

cardSecurityCodeMasked.on('accept', () => {
  updateCardValues('.cc-security .value', '123', cardSecurityCodeMasked.value)
})

function updateCardValues(field, defaultValue, newValue) {
  const fieldRef = document.querySelector(field)
  fieldRef.innerText = newValue.length === 0 ? defaultValue : newValue
}