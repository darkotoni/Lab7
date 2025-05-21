describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO. 
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
      });
    });

    console.log(`Checking product item 1/${prodItemsData.length}`);

    // Make sure the title, price, and image are populated in the JSON
    firstValue = prodItemsData[0];
    if (firstValue.title.length == 0) { allArePopulated = false; }
    if (firstValue.price.length == 0) { allArePopulated = false; }
    if (firstValue.image.length == 0) { allArePopulated = false; }


    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

    for (let i = 0; i< prodItemsData.length; i++) {
      console.log('Checking product item ${i+1}/${prodItemsData.length}');
      const currentItem = prodItemsData[i];
      if (currentItem.title.length==0) {
        allArePopulated =false;
      }
      if (currentItem.price.length == 0) {
        allArePopulated = false;
      }
      if (currentItem.image.length == 0) {
        allArePopulated = false;
      }
    }



  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    const productItem = await page.$('product-item');
    const shadowRoot = await productItem.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    await button.click();

    const buttonText = await button.getProperty('innerText');
    const buttonTextValue = await buttonText.jsonValue();

    expect(buttonTextValue).toBe('Remove from Cart');

  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    const productItems = await page.$$('product-item');
    
    for (let i = 1; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      await button.click();
    }
    
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(parseInt(cartCount)).toBe(20);
  }, 20000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');



       await page.reload();
       await page.waitForSelector('product-item');
       const productItems = await page.$$('product-item');

       let buttonCorrect = true;
       for (let i = 0; i < productItems.length; i++) {
        const shadowRoot = await productItems[i].getProperty('shadowRoot');
        const button = await shadowRoot.$('button');
        const buttonText = await button.getProperty('innerText');
        const buttonTextValue = await buttonText.jsonValue();

        if (buttonTextValue !== 'Remove from Cart') {
          buttonCorrect = false;
          break;
        }
       }

       expect(buttonCorrect).toBe(true);

       const cartCount = await page.$eval('#cart-count', el => el.innerText);
       expect(parseInt(cartCount)).toBe(20);

  }, 30000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {


    const cartContent = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    expect(cartContent).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');

  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');


    const productItems = await page.$$('product-item');
    for (let i = 0; i< productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      await button.click();
    }

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(parseInt(cartCount)).toBe(0);

  }, 30000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');


    await page.reload();
    await page.waitForSelector('product-item');
    const productItems = await page.$$('product-item');
    let buttonCorrect = true;
    for (let i = 0; i< productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty('shadowRoot');
      const button = await shadowRoot.$('button');
      const buttonText = await button.getProperty('innerText');
      const buttonTextValue = await buttonText.jsonValue();

      if (buttonTextValue !== 'Add to Cart') {
        buttonCorrect = false;
        break;
      }
    }
    
    expect(buttonCorrect).toBe(true);

    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(parseInt(cartCount)).toBe(0);

  }, 30000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');


    const cartContent = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });
    expect(cartContent).toBe('[]');
  });
});
