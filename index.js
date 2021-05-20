const GetUrls = require('get-urls')
const Got = require('got')

module.exports = async function searchStringParser (str) {
  if (/^\d{5,}$/.test(str)) {
    return { marketplace: 'taobao', externalId: str }
  }

  const url = getUrlFromStr(str)

  if (!url) {
    return str
  }

  let marketplace = getMarketplaceFromUrl(url)

  if (!marketplace) {
    throw new Error('Invalid url')
  }

  const isShortlink = /(m.tb.cn)|(qr.1688.com)/.test(url.hostname)

  let externalId = false

  if (isShortlink) {
    externalId = await getExternalIdFromShortUrl(url, marketplace)
  } else {
    externalId = getExternalIdFromFullUrl(url, marketplace)
  }

  if (!externalId) {
    throw new Error('Invalid url')
  }

  return { marketplace, externalId }
}

function getUrlFromStr(str) {
  try {
    const set = GetUrls(str)
    const found = Array.from(set).shift()
    return new URL(found)
  } catch {
    return false
  }
}

async function getExternalIdFromShortUrl(url, marketplace) {
  try {
    const { body } = await Got(url, { followRedirect: false })
    let externalId

    switch (marketplace) {
    case '1688':
      const url = new URL(body)

      if (url.searchParams.get('url')) {
        const innerUrl = new URL(url.searchParams.get('url'))
        externalId = getExternalIdFromPathnameParam(innerUrl.pathname, marketplace) || false
        break
      }

      externalId = (url.searchParams.get('id') || '').split('.html').shift() || false
      break

    case 'taobao':
      const matched = body.match(/(var url = ').+(';)/)

      if (!Array.isArray(matched)) {
        break
      }

      const matchedUrl = new URL(matched[0].replace(/(var url = ')|(';)/, ''))
      externalId = matchedUrl.searchParams.get('id') || getExternalIdFromPathnameParam(matchedUrl.pathname) || false
      break
    }

    return externalId
  } catch (error) {
    return false
  }
}

function getExternalIdFromFullUrl(url, marketplace) {
  let externalId = false

  switch(marketplace) {
  case 'taobao':
    externalId = url.searchParams.get('id') || false
    break

  case '1688':
    externalId = url.searchParams.get('offerId') || getExternalIdFromPathnameParam(url.pathname) || false
    break
  }

  return externalId
}

function getMarketplaceFromUrl(url) {
  let marketplace = false

  switch(true) {
  case /(tmall.com)|(taobao.com)|(m.tb.cn)/.test(url.hostname):
    marketplace = 'taobao'
    break

  case /(1688.com)|(qr.1688.com)/.test(url.hostname):
    marketplace = '1688'
    break
  }

  return marketplace
}

function getExternalIdFromPathnameParam(urlString) {
  return urlString.substring(urlString.lastIndexOf('/') + 1).replace(/\D/g, '')
}
