const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('Demo Frontend Dynamic', () => {
  let browser;
  let page;

  const checkElements = async (selector, expected) => {
    let elements = await page.$$(selector);
    let values = await Promise.all(elements.map(async (element) => await element.evaluate((el) => el.innerHTML)));

    expect(values.length).to.be.equal(expected.length);
    expect(JSON.stringify(values)).to.be.equal(JSON.stringify(expected));
  }

  const getBoundingBox = async (element) => {
    const box = await element.boundingBox();
    return {
      left: box.x,
      top: box.y,
      right: box.x + box.width,
      bottom: box.y + box.height,
      height: box.height,
      width: box.width,
    };
  };

  const checkCenteredY = (box1, box2, threshold = 2) => {
    expect((box1.top + box1.bottom) / 2).to.be.approximately(
      (box2.top + box2.bottom) / 2,
      threshold
    );
  };

  const checkElementsAligned = async (selectors) => {
    const boxesSelected = await Promise.all(selectors.map(selector => page.$$(selector)));
    const boxes = await Promise.all(boxesSelected.flat().map(box => getBoundingBox(box)));

    for (let i = 0; i < boxes.lenght; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        checkCenteredY(boxes[i], boxes[j]);
      }
    }
  }

  it('should load the page', async () => {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
    page = await browser.newPage();
    await page.goto(process.env.FRONTEND_PREVIEW_URL, { waitUntil: 'load' });
  }).timeout(3000);

  it('Check existence of button elements and boxes', async () => {
    // amount of visible box-# should be 5, the values of box-* should be 1,2,3,4,5
    await checkElements('.box', ['1', '2', '3', '4', '5']);

    // amount of visible button-* should be 2, the values of button-* should be <<,>>
    await checkElements('button', ['&lt;&lt;', '&gt;&gt;']);

    // the boxes are horizontally aligned with buttons
    await checkElementsAligned(['.box', 'button']);
  }).timeout(1000);

  it('Click left button once', async () => {
    // click left
    await page.click('.left-shift-button');

    // amount of visible box-# should be 5, the values of box-* should be 2,3,4,5,1
    await checkElements('.box', ['2', '3', '4', '5', '1']);

    // amount of visible button-* should be 2, the values of button-* should be <<,>>
    await checkElements('button', ['&lt;&lt;', '&gt;&gt;']);
  }).timeout(1000);

  it('Click left button two more times', async () => {
    // click left 2 times
    await page.click('.left-shift-button');
    await page.click('.left-shift-button');

    // amount of visible box-# should be 5, the values of box-* should be 2,3,4,5,1
    await checkElements('.box', ['4', '5', '1', '2', '3']);

    // amount of visible button-* should be 2, the values of button-* should be <<,>>
    await checkElements('button', ['&lt;&lt;', '&gt;&gt;']);
  }).timeout(1000);

  it('Click right button four times', async () => {
    // click right 4 times
    for (let i = 0; i < 4; i++) {
      await page.click('.right-shift-button');
    }

    // amount of visible box-# should be 5, the values of box-* should be 2,3,4,5,1
    await checkElements('.box', ['5', '1', '2', '3', '4']);

    // amount of visible button-* should be 2, the values of button-* should be <<,>>
    await checkElements('button', ['&lt;&lt;', '&gt;&gt;']);
  }).timeout(1000);

  it('Click right button seven times', async () => {
    // click right 7 times
    for (let i = 0; i < 7; i++) {
      await page.click('.right-shift-button');
    }

    // amount of visible box-# should be 5, the values of box-* should be 2,3,4,5,1
    await checkElements('.box', ['3', '4', '5', '1', '2']);

    // amount of visible button-* should be 2, the values of button-* should be <<,>>
    await checkElements('button', ['&lt;&lt;', '&gt;&gt;']);
  }).timeout(1000);

  it('Click left button 10 times and right button 4 times', async () => {
    // click left button 10 times and right button 4 times
    for (let i = 0; i < 10; i++) {
      await page.click('.left-shift-button');
    }
    for (let i = 0; i < 4; i++) {
      await page.click('.right-shift-button');
    }

    // amount of visible box-# should be 5, the values of box-* should be 2,3,4,5,1
    await checkElements('.box', ['4', '5', '1', '2', '3']);

    // amount of visible button-* should be 2, the values of button-* should be <<,>>
    await checkElements('button', ['&lt;&lt;', '&gt;&gt;']);
  }).timeout(1000);

  after(async () => {
    await browser.close();
  });
});
