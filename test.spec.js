const test = require('ava')
const searchStringParser = require('.')

test('plain search string', async t => {
  t.is(await searchStringParser('apple'), 'apple')
  t.is(await searchStringParser('xiaomi'), 'xiaomi')
  t.is(await searchStringParser('Женские купальники'), 'Женские купальники')
  t.is(await searchStringParser('Смартфоны'), 'Смартфоны')
})

test('externalId search string', async t => {
  t.deepEqual(await searchStringParser('568804690189'), { marketplace: 'taobao', externalId: '568804690189' })
  t.deepEqual(await searchStringParser('618593034309'), { marketplace: 'taobao', externalId: '618593034309' })
  t.deepEqual(await searchStringParser('606561436223'), { marketplace: 'taobao', externalId: '606561436223' })
  t.deepEqual(await searchStringParser('566136916082'), { marketplace: 'taobao', externalId: '566136916082' })
  t.deepEqual(await searchStringParser('640103352460'), { marketplace: 'taobao', externalId: '640103352460' })
})

test('valid search url string', async t => {
  t.deepEqual(
    await searchStringParser('https://m.tb.cn/h.4s4T1m5?sm=6fd301'),
    { marketplace: 'taobao', externalId: '568804690189' }
  )
  t.deepEqual(
    await searchStringParser('https://qr.1688.com/share.html?secret=0H9TOj6I'),
    { marketplace: '1688', externalId: '618593034309' }
  )
  t.deepEqual(
    await searchStringParser('https://qr.1688.com/share.html?secret=xzk3VcNy'),
    { marketplace: '1688', externalId: '606561436223' }
  )
  t.deepEqual(
    await searchStringParser('http://detail.m.1688.com/page/index.htm?offerId=566136916082'),
    { marketplace: '1688', externalId: '566136916082' }
  )
  t.deepEqual(
    await searchStringParser('https://detail.1688.com/offer/624139032536.html?spm=a260j.12536059.jr601u7p.1.70352084rtiaLu'),
    { marketplace: '1688', externalId: '624139032536' }
  )
  t.deepEqual(
    await searchStringParser('2.0啊CrATXeu9PaK， https://m.tb.cn/h.4JGyJuZ?sm=71c67e 卡通可爱煤球红米k30手机壳全包支架redmi推拉镜头肤感防摔红米note8外壳硅胶创意红米note8pro保护套女款'),
    { marketplace: 'taobao', externalId: '640103352460' }
  )
  t.deepEqual(
    await searchStringParser('https://detail.tmall.com/item.htm?id=595954825798&ft=t'),
    { marketplace: 'taobao', externalId: '595954825798' }
  )
  t.deepEqual(
    await searchStringParser('https://item.taobao.com/item.htm?spm=a2141.241046-global.8285604040.1.41cab6cbFU3tZl&scm=1007.15423.84311.100200300000005&id=548650406252&pvid=441b33d1-8999-43ee-976c-90ba3e78c9d9'),
    { marketplace: 'taobao', externalId: '548650406252' }
  )
})

test('not valid search url string', async t => {
  await t.throwsAsync(
    searchStringParser('https://google.com'),
    { message: 'Invalid url' }
  )
  await t.throwsAsync(
    searchStringParser('trrrending.today'),
    { message: 'Invalid url' }
  )
  await t.throwsAsync(
    searchStringParser('https://ooba.kg/products/taobao/1234567'),
    { message: 'Invalid url' }
  )
  await t.throwsAsync(
    searchStringParser('https://qr.1688.com/share.html?secret=0H9TOj6'),
    { message: 'Invalid url' }
  )
})

test('parse opentao search url', async t => {
  t.deepEqual(
    await searchStringParser('https://bao.kg/item?id=580595894786'),
    { marketplace: 'taobao', externalId: '580595894786' }
  )
  t.deepEqual(
    await searchStringParser('https://bao.kg/item?id=abb-619196007205'),
    { marketplace: '1688', externalId: '619196007205' }
  )
  t.deepEqual(
    await searchStringParser('http://www.megatao.kg/item?id=607850968837'),
    { marketplace: 'taobao', externalId: '607850968837' }
  )
  t.deepEqual(
    await searchStringParser('http://bishtao.kg/item?id=621657013153'),
    { marketplace: 'taobao', externalId: '621657013153' }
  )
  t.deepEqual(
    await searchStringParser('http://bishtao.kg/item?id=abb-551112359323'),
    { marketplace: '1688', externalId: '551112359323' }
  )
  t.deepEqual(
    await searchStringParser('https://www.tao.kg/item?id=4356083394'),
    { marketplace: 'taobao', externalId: '4356083394' }
  )
  t.deepEqual(
    await searchStringParser('https://www.tao.kg/item?id=abb-1247756680'),
    { marketplace: '1688', externalId: '1247756680' }
  )
})